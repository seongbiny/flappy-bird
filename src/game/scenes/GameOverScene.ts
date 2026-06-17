import { Container } from 'pixi.js';
import { GAME_CONFIG } from '../constants';
import { createButton } from '../ui/createButton';
import { createText } from '../ui/createText';

export class GameOverScene {
  readonly container: Container;

  constructor(score: number, onRestart: () => void) {
    const { CANVAS_WIDTH, CANVAS_HEIGHT } = GAME_CONFIG;
    this.container = new Container();

    const gameOverText = createText('Game Over', {
      fontSize: 48,
      fontWeight: 'bold',
      fill: 0xff4444,
    });
    gameOverText.anchor.set(0.5);
    gameOverText.x = CANVAS_WIDTH / 2;
    gameOverText.y = CANVAS_HEIGHT / 2 - 80;

    const scoreText = createText(`Score: ${score}`, { fontSize: 28, fill: 0xffffff });
    scoreText.anchor.set(0.5);
    scoreText.x = CANVAS_WIDTH / 2;
    scoreText.y = CANVAS_HEIGHT / 2 - 10;

    const restartBtn = createButton(
      '다시 시작',
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2 + 70,
      onRestart
    );

    this.container.addChild(gameOverText, scoreText, restartBtn);
  }

  destroy(): void {
    this.container.destroy({ children: true });
  }
}
