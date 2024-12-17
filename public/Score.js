import { sendEvent } from './Socket.js';
import { getStages } from './Data.js';

class Score {
  score = 0;
  scoreCounter = 0;
  HIGH_SCORE_KEY = 'highScore';
  minStage = 1000;
  maxStage = 1006;
  stageIdx = this.minStage;
  scorePerSec = 1;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    this.score += deltaTime * 0.001 * this.scorePerSec;
    this.scoreCounter += deltaTime * 0.001; // 10초마다 stage 이동동

    if (this.stageIdx < this.maxStage && this.scoreCounter >= 10) {
      this.scoreCounter = 0;
      sendEvent(11, { currentStage: this.stageIdx, targetStage: this.stageIdx + 1 });
      this.stageIdx += 1;

      // 추가 점수 변경
      this.setScorePerSec();
    }
  }

  getItem(itemId) {
    this.score += 0;
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
    return this.stageIdx - this.minStage +1;
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

  setScorePerSec() {
    const stages = getStages();

    const curStage = stages.find((item) => item.id === this.stageIdx);

    this.scorePerSec = curStage.scorePerSecond;
  }
}

export default Score;
