import { Text, TextStyle } from 'pixi.js';

export function createText(content: string, style?: Partial<TextStyle>): Text {
  return new Text({
    text: content,
    style: {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
      ...style,
    },
  });
}
