import { Object } from "./object.js";

export class Circle extends Object {
  constructor(stageWidth, stageHeight, rad, length, x, y) {
    super(stageWidth, stageHeight, rad, length, x, y);

    this.type = "circle";
  }

  draw = (ctx) => {
    ctx.arc(this.x, this.y, this.length / 2, 0, Math.PI * 2);
  };
}
