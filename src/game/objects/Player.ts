import * as Matter from 'matter-js';
import { Container, Graphics } from 'pixi.js';
import { GAME_CONFIG } from '../constants';

export class Player {
  readonly body: Matter.Body;
  readonly graphic: Graphics;

  constructor(world: Matter.Composite, stage: Container) {
    const { PLAYER_X, PLAYER_START_Y, PLAYER_SIZE } = GAME_CONFIG;

    this.body = Matter.Bodies.rectangle(PLAYER_X, PLAYER_START_Y, PLAYER_SIZE, PLAYER_SIZE, {
      label: 'player',
      frictionAir: 0.05,
    });

    this.graphic = new Graphics();
    this.graphic.roundRect(-PLAYER_SIZE / 2, -PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE, 6);
    this.graphic.fill({ color: 0xffd700 });

    Matter.Composite.add(world, this.body);
    stage.addChild(this.graphic);
  }

  jump(): void {
    Matter.Body.setVelocity(this.body, { x: 0, y: GAME_CONFIG.JUMP_VELOCITY });
  }

  update(): void {
    this.graphic.x = this.body.position.x;
    this.graphic.y = this.body.position.y;
    this.graphic.rotation = this.body.angle;
  }

  destroy(world: Matter.Composite): void {
    Matter.Composite.remove(world, this.body);
    this.graphic.destroy();
  }
}
