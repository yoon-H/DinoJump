import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';
import { setItem } from '../models/item.model.js';

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

  // 점수 검증
  const serverTime = Date.now(); //현재 타임스탬프
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000;

  // 1스테이지 -> 2스테이지로 넘어가는 가정
  // 5 => 임의로 정한 오차범위
  if (elapsedTime < 10 || elapsedTime > 10.5) {
    return { status: 'fail', message: 'Invalid elapsed time' };
  }

  // targetStage 검증 <- 게임 에셋에 존재하는가?
  const { stages } = getGameAssets();

  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target stage not found' };
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
