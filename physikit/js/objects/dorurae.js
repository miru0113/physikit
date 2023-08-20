import { Object } from "./object.js";

export class Dorurae extends Object {
  constructor(stageWidth, stageHeight, rad, length, x, y, width) {
    super(stageWidth, stageHeight, rad, length, x, y);
    this.width = width;
    this.setVertices();

    this.type = "dorurae";
  }

  setVertices = () => {
    const [SIN, COS] = [Math.sin(this.rad), Math.cos(this.rad)];

    const 원의중심 = [this.x + this.length * COS, this.y - this.length * SIN];

    this.leftbottom = {
      x: 원의중심[0] - this.width / 2,
      y: 원의중심[1] + this.width / 2,
    };
    this.lefttop = {
      x: 원의중심[0] - this.width / 2,
      y: 원의중심[1] - this.width / 2,
    };
    this.righttop = {
      x: 원의중심[0] + this.width / 2,
      y: 원의중심[1] - this.width / 2,
    };
    this.rightbottom = {
      x: 원의중심[0] + this.width / 2,
      y: 원의중심[1] + this.width / 2,
    };
  };

  setRad = (rad) => {
    this.rad = rad;
    this.setVertices();
  };

  setLength = (length) => {
    this.length = length;
    this.setVertices();
  };

  setCoord = (x, y) => {
    this.x = x;
    this.y = y;
    this.setVertices();
  };

  setWidth = (width) => {
    this.width = width;
    this.setVertices();
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
    ctx.arc(this.x, this.y, this.width / 10, -this.rad + Math.PI / 2, -this.rad + Math.PI + Math.PI / 2);
    ctx.moveTo(this.x, this.y);
    ctx.arc(this.x, this.y, this.width / 30, Math.PI / 2, Math.PI * 2 + Math.PI / 2);
    ctx.moveTo(this.x + (this.width / 10) * SIN, this.y + (this.width / 10) * COS);
    ctx.lineTo(this.x + (this.width / 10) * SIN + this.length * COS, this.y + (this.width / 10) * COS - this.length * SIN);
    ctx.moveTo(this.x + this.length * COS, this.y - this.length * SIN);
    ctx.arc(
      this.x + this.length * COS,
      this.y - this.length * SIN,
      this.width / 10,
      -this.rad + Math.PI / 2,
      -this.rad + Math.PI + Math.PI / 2,
      true
    );
    ctx.moveTo(this.x + this.length * COS, this.y - this.length * SIN);
    ctx.arc(this.x + this.length * COS, this.y - this.length * SIN, this.width / 30, 0 + Math.PI / 2, Math.PI * 2 + Math.PI / 2);
    ctx.moveTo(this.x + this.length * COS, this.y - (this.width / 10) * COS - this.length * SIN);
    ctx.lineTo(this.x - (this.width / 10) * SIN, this.y - (this.width / 10) * COS);

    const paddingRad = Math.asin(4 / 5);
    ctx.moveTo(this.x + this.length * COS, this.y - this.length * SIN);
    ctx.arc(
      this.x + this.length * COS,
      this.y - this.length * SIN,
      this.width / 2,
      this.rad - paddingRad - Math.PI / 2,
      this.rad - paddingRad + Math.PI * 2 - Math.PI / 2
    );
  };
}
