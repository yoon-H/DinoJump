import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';
import { setItem, getTotalItemScore } from '../models/item.model.js';

export const moveStageHandler = (userId, payload) => {
  let currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 오름차순 -> 가장 큰 스테이지 ID를 확인 <- 유저의 현재 스테이지
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // 클라이언트 vs 서버 비교
  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current Stage mismatch' };
  }

  /** 점수 검증 */

  // 이번 스테이지에서 얻은 점수
  const serverTime = Date.now(); //현재 타임스탬프
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000;
  const totalScorePerSec = elapsedTime * currentStage.scorePerSecond;

  // 아이템으로 얻은 점수
  const totalItemScore = getTotalItemScore(userId, currentStage.stageIdx);

  // 종합 점수
  const stageScore = Math.floor(totalScorePerSec + totalItemScore);

  const { stages } = getGameAssets();

  const tableCurrentStage = stages.data.find((stage) => stage.id === payload.currentStage);

  // 점수 검증
  const totalScore = stageScore + tableCurrentStage.score;

  if (totalScore < payload.score || totalScore > payload.score + 5) {
    return { status: 'fail', message: 'Score mismatch' };
  }

  // 타겟 스테이지 찾기
  const targetStage = stages.data.find((stage) => stage.id === payload.targetStage);

  // targetStage 검증 <- 게임 에셋에 존재하는가?
  if (!targetStage) {
    return { status: 'fail', message: 'Target stage not found' };
  }

  // 타겟 스테이지 점수 검증
  if (totalScore < targetStage.score) {
    return { status: 'fail', message: 'Score is lower than targetStage' };
  }

  setStage(userId, payload.targetStage, serverTime);

  console.log('stages : ', getStage(userId));

  return { status: 'success', id: 'moveStage', stageIdx: payload.targetStage };
};

export const getItemHandler = (userId, payload) => {
  // 점수 검증? (현재 스테이지, 얻은 아이템, 점수)
  let currentStages = getStage(userId);

  console.log(currentStages);

  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 오름차순 -> 가장 큰 스테이지 ID를 확인 <- 유저의 현재 스테이지
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // 클라이언트 vs 서버 비교
  if (currentStage.id !== payload.stage) {
    return { status: 'fail', message: 'Current Stage mismatch' };
  }

  const { items, itemUnlocks } = getGameAssets();
  const unlockedItems = itemUnlocks.data.find((element) => element.stage_id === currentStage.id);

  // 현재 스테이지 해제 아이템 확인
  if (!unlockedItems) {
    return { status: 'fail', message: 'No unlockInfos by currentStage' };
  }

  if (!unlockedItems.item_id.includes(payload.itemId)) {
    return { status: 'fail', message: 'This item does not spawn in this stage' };
  }

  const item = items.data.find((element) => element.id === payload.itemId);
  if (!item) {
    return { status: 'fail', message: 'This item does not exist' };
  }

  const timestamp = Date.now();

  setItem(userId, currentStage.id, item.id, item.score, timestamp);

  return { status: 'success' };
};
