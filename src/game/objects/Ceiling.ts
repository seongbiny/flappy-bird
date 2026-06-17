import * as Matter from 'matter-js';
import { Container, Graphics } from 'pixi.js';
import { GAME_CONFIG } from '../constants';

export class Ceiling {
  readonly body: Matter.Body;
  readonly graphic: Graphics;

  constructor(world: Matter.Composite, stage: Container) {
    const { CANVAS_WIDTH, CEILING_HEIGHT } = GAME_CONFIG;
    const y = CEILING_HEIGHT / 2;

    this.body = Matter.Bodies.rectangle(CANVAS_WIDTH / 2, y, CANVAS_WIDTH, CEILING_HEIGHT, {
      isStatic: true,
      label: 'ceiling',
    });

    this.graphic = new Graphics();
    this.graphic.rect(0, 0, CANVAS_WIDTH, CEILING_HEIGHT);
    this.graphic.fill({ color: 0x87ceeb, alpha: 0.3 });

    Matter.Composite.add(world, this.body);
    stage.addChild(this.graphic);
  }

  destroy(world: Matter.Composite): void {
    Matter.Composite.remove(world, this.body);
    this.graphic.destroy();
  }
}
