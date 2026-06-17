import * as Matter from 'matter-js';
import { Container, Graphics } from 'pixi.js';
import { GAME_CONFIG } from '../constants';

export class Ground {
  readonly body: Matter.Body;
  readonly graphic: Graphics;

  constructor(world: Matter.Composite, stage: Container) {
    const { CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_HEIGHT } = GAME_CONFIG;
    const y = CANVAS_HEIGHT - GROUND_HEIGHT / 2;

    this.body = Matter.Bodies.rectangle(CANVAS_WIDTH / 2, y, CANVAS_WIDTH, GROUND_HEIGHT, {
      isStatic: true,
      label: 'ground',
    });

    this.graphic = new Graphics();
    this.graphic.rect(0, CANVAS_HEIGHT - GROUND_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT);
    this.graphic.fill({ color: 0x8b6914 });

    Matter.Composite.add(world, this.body);
    stage.addChild(this.graphic);
  }

  destroy(world: Matter.Composite): void {
    Matter.Composite.remove(world, this.body);
    this.graphic.destroy();
  }
}
