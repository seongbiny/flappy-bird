import { Container } from 'pixi.js';
import { GAME_CONFIG } from '../constants';
import { createButton } from '../ui/createButton';
import { createText } from '../ui/createText';

export class ReadyScene {
  readonly container: Container;

  constructor(onStart: () => void) {
    const { CANVAS_WIDTH, CANVAS_HEIGHT } = GAME_CONFIG;
    this.container = new Container();

    const title = createText('Flappy Bird', {
      fontSize: 48,
      fontWeight: 'bold',
      fill: 0xffd700,
    });
    title.anchor.set(0.5);
    title.x = CANVAS_WIDTH / 2;
    title.y = CANVAS_HEIGHT / 2 - 100;

    const desc = createText('클릭하거나 스페이스바를 눌러 날아오르세요!', {
      fontSize: 18,
      fill: 0xdddddd,
    });
    desc.anchor.set(0.5);
    desc.x = CANVAS_WIDTH / 2;
    desc.y = CANVAS_HEIGHT / 2 - 30;

    const startBtn = createButton('시작', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60, onStart);

    this.container.addChild(title, desc, startBtn);
  }

  destroy(): void {
    this.container.destroy({ children: true });
  }
}
