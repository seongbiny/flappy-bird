import { Container } from 'pixi.js';
import { GAME_CONFIG } from '../constants';
import { createText } from '../ui/createText';

export class PlayingScene {
  readonly container: Container;
  private readonly scoreText: ReturnType<typeof createText>;

  constructor() {
    this.container = new Container();

    this.scoreText = createText('0', { fontSize: 36, fontWeight: 'bold', fill: 0xffffff });
    this.scoreText.anchor.set(0.5, 0);
    this.scoreText.x = GAME_CONFIG.CANVAS_WIDTH / 2;
    this.scoreText.y = 20;

    this.container.addChild(this.scoreText);
  }

  updateScore(score: number): void {
    this.scoreText.text = String(score);
  }

  destroy(): void {
    this.container.destroy({ children: true });
  }
}
