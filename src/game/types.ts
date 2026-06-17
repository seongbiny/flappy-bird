export type GameStatus = 'ready' | 'playing' | 'gameOver';

export interface GameInstance {
  init: (container: HTMLElement) => Promise<void>;
  start: () => void;
  restart: () => void;
  destroy: () => void;
}
