import { Container, Graphics, Text } from 'pixi.js';

export function createButton(
  label: string,
  x: number,
  y: number,
  onClick: () => void
): Container {
  const container = new Container();

  const bg = new Graphics();
  bg.roundRect(-100, -25, 200, 50, 8);
  bg.fill({ color: 0x4caf50 });

  const text = new Text({
    text: label,
    style: {
      fontFamily: 'Arial',
      fontSize: 20,
      fill: 0xffffff,
    },
  });
  text.anchor.set(0.5);

  container.addChild(bg, text);
  container.x = x;
  container.y = y;
  container.eventMode = 'static';
  container.cursor = 'pointer';
  container.on('pointerdown', onClick);

  return container;
}
