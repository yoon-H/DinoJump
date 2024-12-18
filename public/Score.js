import { sendEvent } from './Socket.js';
import { getStages, getItems } from './Data.js';

class Score {
  score = 0;
  scoreCounter = 0;
  HIGH_SCORE_KEY = 'highScore';
  minStage = 1000;
  maxStage = 1006;
  stageIdx = this.minStage;
  targetScore = 15;
  scorePerSec = 1;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    this.score += deltaTime * 0.001 * this.scorePerSec;

    if (this.stageIdx < this.maxStage && this.score >= this.targetScore) {
      this.scoreCounter = 0;
      sendEvent(11, {
        currentStage: this.stageIdx,
        targetStage: this.stageIdx + 1,
        score: this.score,
      });
      this.stageIdx += 1;

      // 추가 점수 변경
      this.setNextInfo();
    }
  }

  getItem(itemId) {
    const item = getItems().find((element) => element.id === itemId);

    sendEvent(21, { stage: this.stageIdx, itemId, score: item.score });

    this.score += item.score;
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  getStageIdx() {
    return this.stageIdx - this.minStage + 1;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }

  setNextInfo() {
    const stages = getStages();

    const index = stages.findIndex((item) => item.id === this.stageIdx);

    const curStage = stages[index];

    this.scorePerSec = curStage.scorePerSecond;

    if (this.stageIdx < this.maxStage - 1) {
      const targetStage = stages[index + 1];

      this.targetScore = targetStage.score;
    }
  }
}

export default Score;
