import { Object } from "./object.js";

export class Dorurae extends Object {
  constructor(stageWidth, stageHeight, rad, length, x, y, width) {
    super(stageWidth, stageHeight, rad, length, x, y);
    this.width = width;

    this.type = "dorurae";
  }

  setWidth = (width) => {
    this.width = width;
  };

  resize = (stageWidth, stageHeight) => {
    const ratio = stageWidth / this.stageWidth;

    this.length *= ratio;
    this.x *= ratio;
    this.y *= ratio;
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    this.width *= ratio;
  };

  draw = (ctx) => {
    const SIN = Math.sin(this.rad);
    const COS = Math.cos(this.rad);
    ctx.arc(this.x, this.y, this.width / 5, this.rad + Math.PI / 2, this.rad + Math.PI + Math.PI / 2);
    ctx.arc(this.x, this.y, this.width / 15, 0 + Math.PI / 2, Math.PI * 2 + Math.PI / 2);
    ctx.moveTo(this.x + (this.width / 5) * COS, this.y + (this.width / 5) * SIN);
    ctx.lineTo(this.x + (this.width / 5) * COS + this.length * COS, this.y + (this.width / 5) * SIN + this.length * SIN);
    ctx.arc(
      this.x + this.length * COS,
      this.y - this.length * SIN,
      this.width / 5,
      this.rad + Math.PI / 2,
      this.rad + Math.PI + Math.PI / 2,
      true
    );
    ctx.arc(this.x + this.length * COS, this.y - this.length * SIN, this.width / 15, 0 + Math.PI / 2, Math.PI * 2 + Math.PI / 2);
    ctx.moveTo(this.x + this.length * COS - (this.width / 5) * COS, this.y - this.length * SIN - (this.width / 5) * SIN);
    ctx.lineTo(this.x - this.width / 5, this.y + this.width / 5);

    const paddingRad = Math.asin(5 / 4);
    ctx.arc(
      this.x + this.length * COS,
      this.y - this.length * SIN,
      this.width / 2,
      this.rad - paddingRad - Math.PI / 2,
      this.rad + paddingRad + Math.PI * 2 - Math.PI / 2
    );
  };
}
