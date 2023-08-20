import { Object } from "./object.js";

export class Flat extends Object {
  constructor(stageWidth, stageHeight, rad, length, x, y) {
    super(stageWidth, stageHeight, rad, length, x, y);

    this.type = "flat";
  }

  draw = (ctx) => {
    if (this.isAttaching) return this.drawAttaching(ctx);
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.length * Math.cos(this.rad), this.y - this.length * Math.sin(this.rad));
  };

  drawAttaching = (ctx) => {
    ctx.moveTo(this.attachingX, this.attachingY);
    ctx.lineTo(
      this.attachingX + this.length * Math.cos(this.attachingRad),
      this.attachingY - this.length * Math.sin(this.attachingRad)
    );
  };
}
