import { Application, Container } from 'pixi.js';
import * as Matter from 'matter-js';
import { GAME_CONFIG } from './constants';
import { type GameStatus } from './types';
import { Player } from './objects/Player';
import { Pipe } from './objects/Pipe';
import { Ground } from './objects/Ground';
import { Ceiling } from './objects/Ceiling';
import { ReadyScene } from './scenes/ReadyScene';
import { PlayingScene } from './scenes/PlayingScene';
import { GameOverScene } from './scenes/GameOverScene';

export class FlappyBirdGame {
  private app!: Application;
  private engine!: Matter.Engine;
  private world!: Matter.Composite;

  private status: GameStatus = 'ready';
  private score: number = 0;
  private lastPipeTime: number = 0;

  private player: Player | null = null;
  private pipes: Pipe[] = [];
  private ground: Ground | null = null;
  private ceiling: Ceiling | null = null;

  private gameLayer!: Container;
  private currentScene: ReadyScene | PlayingScene | GameOverScene | null = null;

  private readonly onInput = (): void => {
    if (this.status === 'ready') {
      this.startGame();
    } else if (this.status === 'playing') {
      this.player?.jump();
    }
  };

  private readonly onKeyDown = (e: KeyboardEvent): void => {
    if (e.code === 'Space') {
      e.preventDefault();
      this.onInput();
    }
  };

  async init(container: HTMLElement): Promise<void> {
    this.app = new Application();
    await this.app.init({
      width: GAME_CONFIG.CANVAS_WIDTH,
      height: GAME_CONFIG.CANVAS_HEIGHT,
      backgroundColor: 0x87ceeb,
    });

    container.appendChild(this.app.canvas);

    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.engine.gravity.y = GAME_CONFIG.GRAVITY_Y;

    this.gameLayer = new Container();
    this.app.stage.addChild(this.gameLayer);

    this.registerInputEvents();
    this.registerCollisionEvents();

    this.app.ticker.add((ticker) => this.gameLoop(ticker.deltaMS));
  }

  start(): void {
    this.showReadyScene();
  }

  private showReadyScene(): void {
    this.clearScene();
    this.status = 'ready';
    const scene = new ReadyScene(() => this.startGame());
    this.app.stage.addChild(scene.container);
    this.currentScene = scene;
  }

  private startGame(): void {
    this.clearScene();
    this.clearGameObjects();

    this.score = 0;
    this.lastPipeTime = 0;
    this.pipes = [];

    this.status = 'playing';

    this.ground = new Ground(this.world, this.gameLayer);
    this.ceiling = new Ceiling(this.world, this.gameLayer);
    this.player = new Player(this.world, this.gameLayer);
    this.player.update();

    const scene = new PlayingScene();
    this.app.stage.addChild(scene.container);
    this.currentScene = scene;
  }

  private gameLoop(deltaMS: number): void {
    if (this.status !== 'playing') return;

    Matter.Engine.update(this.engine, deltaMS);

    this.lastPipeTime += deltaMS;
    if (this.lastPipeTime >= GAME_CONFIG.PIPE_SPAWN_INTERVAL) {
      this.spawnPipe();
      this.lastPipeTime = 0;
    }

    this.pipes.forEach((pipe) => pipe.update());
    this.player?.update();

    this.updateScore();
    this.removeOffScreenPipes();
  }

  private spawnPipe(): void {
    const { CANVAS_HEIGHT, GROUND_HEIGHT, PIPE_GAP_HEIGHT } = GAME_CONFIG;
    const minGapY = PIPE_GAP_HEIGHT / 2 + 40;
    const maxGapY = CANVAS_HEIGHT - GROUND_HEIGHT - PIPE_GAP_HEIGHT / 2 - 40;
    const gapY = Math.random() * (maxGapY - minGapY) + minGapY;

    const pipe = new Pipe(this.world, this.gameLayer, gapY);
    this.pipes.push(pipe);
  }

  private updateScore(): void {
    if (!this.player) return;

    for (const pipe of this.pipes) {
      if (!pipe.scored && pipe.x + GAME_CONFIG.PIPE_WIDTH / 2 < this.player.body.position.x) {
        pipe.scored = true;
        this.score += 1;
        if (this.currentScene instanceof PlayingScene) {
          this.currentScene.updateScore(this.score);
        }
      }
    }
  }

  private removeOffScreenPipes(): void {
    this.pipes = this.pipes.filter((pipe) => {
      if (pipe.isOffScreen()) {
        pipe.destroy();
        return false;
      }
      return true;
    });
  }

  private triggerGameOver(): void {
    if (this.status === 'gameOver') return;
    this.status = 'gameOver';

    this.clearScene();

    const scene = new GameOverScene(this.score, () => this.restart());
    this.app.stage.addChild(scene.container);
    this.currentScene = scene;
  }

  restart(): void {
    this.startGame();
  }

  private registerInputEvents(): void {
    window.addEventListener('keydown', this.onKeyDown);
    this.app.canvas.addEventListener('pointerdown', this.onInput);
  }

  private registerCollisionEvents(): void {
    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      if (this.status !== 'playing') return;

      for (const pair of event.pairs) {
        const labels = [pair.bodyA.label, pair.bodyB.label];
        if (labels.includes('player')) {
          this.triggerGameOver();
          break;
        }
      }
    });
  }

  private clearScene(): void {
    if (this.currentScene) {
      this.currentScene.destroy();
      this.currentScene = null;
    }
  }

  private clearGameObjects(): void {
    this.pipes.forEach((pipe) => pipe.destroy());
    this.pipes = [];

    this.player?.destroy(this.world);
    this.player = null;

    this.ground?.destroy(this.world);
    this.ground = null;

    this.ceiling?.destroy(this.world);
    this.ceiling = null;

    Matter.Composite.clear(this.world, false);
  }

  destroy(): void {
    this.app.ticker.stop();
    window.removeEventListener('keydown', this.onKeyDown);
    this.app.canvas.removeEventListener('pointerdown', this.onInput);
    Matter.Events.off(this.engine, 'collisionStart');
    this.clearGameObjects();
    this.clearScene();
    this.gameLayer.destroy({ children: true });
    this.app.destroy(true);
  }
}
