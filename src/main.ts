import './style.css';
import { FlappyBirdGame } from './game/FlappyBirdGame';

const container = document.querySelector<HTMLDivElement>('#app');

if (!container) {
  throw new Error('App container not found');
}

const game = new FlappyBirdGame();

await game.init(container);
game.start();
