import * as Matter from 'matter-js';
import { Container, Graphics } from 'pixi.js';
import { GAME_CONFIG } from '../constants';

export class Pipe {
  scored: boolean = false;

  private readonly topBody: Matter.Body;
  private readonly bottomBody: Matter.Body;
  private readonly topGraphic: Graphics;
  private readonly bottomGraphic: Graphics;
  private readonly world: Matter.Composite;

  constructor(world: Matter.Composite, stage: Container, gapY: number) {
    const { CANVAS_WIDTH, CANVAS_HEIGHT, PIPE_WIDTH, PIPE_GAP_HEIGHT, GROUND_HEIGHT } =
      GAME_CONFIG;

    this.world = world;

    const pipeX = CANVAS_WIDTH + PIPE_WIDTH;
    const halfGap = PIPE_GAP_HEIGHT / 2;

    const topHeight = gapY - halfGap;
    const bottomY = gapY + halfGap;
    const bottomHeight = CANVAS_HEIGHT - GROUND_HEIGHT - bottomY;

    this.topBody = Matter.Bodies.rectangle(pipeX, topHeight / 2, PIPE_WIDTH, topHeight, {
      isStatic: true,
      label: 'pipe',
    });

    this.bottomBody = Matter.Bodies.rectangle(
      pipeX,
      bottomY + bottomHeight / 2,
      PIPE_WIDTH,
      bottomHeight,
      {
        isStatic: true,
        label: 'pipe',
      }
    );

    this.topGraphic = this.createPipeGraphic(PIPE_WIDTH, topHeight, 0x4caf50);
    this.bottomGraphic = this.createPipeGraphic(PIPE_WIDTH, bottomHeight, 0x4caf50);

    Matter.Composite.add(world, [this.topBody, this.bottomBody]);
    stage.addChild(this.topGraphic, this.bottomGraphic);

    this.syncGraphics();
  }

  private createPipeGraphic(width: number, height: number, color: number): Graphics {
    const g = new Graphics();
    g.rect(-width / 2, -height / 2, width, height);
    g.fill({ color });
    g.rect(-width / 2 - 5, -height / 2, width + 10, 20);
    g.fill({ color: 0x388e3c });
    return g;
  }

  get x(): number {
    return this.topBody.position.x;
  }

  update(): void {
    const speed = GAME_CONFIG.PIPE_SPEED;

    Matter.Body.setPosition(this.topBody, {
      x: this.topBody.position.x - speed,
      y: this.topBody.position.y,
    });

    Matter.Body.setPosition(this.bottomBody, {
      x: this.bottomBody.position.x - speed,
      y: this.bottomBody.position.y,
    });

    this.syncGraphics();
  }

  private syncGraphics(): void {
    this.topGraphic.x = this.topBody.position.x;
    this.topGraphic.y = this.topBody.position.y;
    this.bottomGraphic.x = this.bottomBody.position.x;
    this.bottomGraphic.y = this.bottomBody.position.y;
  }

  isOffScreen(): boolean {
    return this.topBody.position.x < -GAME_CONFIG.PIPE_WIDTH;
  }

  destroy(): void {
    Matter.Composite.remove(this.world, this.topBody);
    Matter.Composite.remove(this.world, this.bottomBody);
    this.topGraphic.destroy();
    this.bottomGraphic.destroy();
  }
}
