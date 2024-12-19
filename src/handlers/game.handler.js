import { getGameAssets } from '../init/assets.js';
import { setStage, getStage, clearStage } from '../models/stage.model.js';
import { getTotalItemScore, clearItems } from '../models/item.model.js';
import { getHighScore, setRanks } from '../models/rank.model.js';

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();
  clearStage(uuid);
  setStage(uuid, stages.data[0].id, payload.timestamp);
  clearItems(uuid);
  console.log('Stages: ', getStage(uuid));

  return { status: 'success' };
};

export const gameEnd = (uuid, payload) => {
  // 클라이언트에서 받은 게임 종료 시 타임스탬프와 총 점수
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid);
  const { stages: assetStages } = getGameAssets();

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 각 스테이지의 지속 시간을 계산하여 총 점수 계산
  let totalScore = 0;
  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      // 마지막 스테이지의 경우 종료 시간이 게임의 종료 시간
      stageEndTime = gameEndTime;
    } else {
      // 다음 스테이지의 시작 시간을 현재 스테이지의 종료 시간으로 사용
      stageEndTime = stages[index + 1].timestamp;
    }
    const stageDuration = (stageEndTime - stage.timestamp) / 1000; // 스테이지 지속 시간 (초 단위)
    const scorePerSec = assetStages.find((item) => item.id === stage.id).scorePerSecond; // 스테이지 당 점수
    totalScore += stageDuration * scorePerSec; // 스테이지 시간 * 스테이지 당 점수
  });

  // 아이템 총 점수 더하기
  totalScore += getTotalItemScore(uuid);

  // 점수와 타임스탬프 검증 (예: 클라이언트가 보낸 총점과 계산된 총점 비교)
  // 오차범위 5
  if (Math.abs(score - totalScore) > 5) {
    return { status: 'fail', message: 'Score verification failed' };
  }

  // 기록 저장
  setRanks(uuid, score, gameEndTime);

  const highScore = getHighScore();

  // 모든 검증이 통과된 후, 클라이언트에서 제공한 점수 저장하는 로직
  // saveGameResult(userId, clientScore, gameEndTime);
  // 검증이 통과되면 게임 종료 처리
  if (highScore.uuid === uuid)
    // 최고기록이면 broadcast
    return {
      status: 'success',
      message: 'Game ended successfully',
      id: 'highScore',
      score,
      broadcast: highScore,
    };

  return { status: 'success', message: 'Game ended successfully', id: 'endScore', score };
};

export const getGameTables = (uuid, payload) => {
  const gameAssets = getGameAssets();

  return { status: 'success', id: 'gameAssets', gameAssets };
};
