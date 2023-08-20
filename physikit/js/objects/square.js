import { Object } from "./object.js";

export class Square extends Object {
  constructor(stageWidth, stageHeight, rad, length, x, y) {
    super(stageWidth, stageHeight, rad, length, x, y);

    this.type = "square";
  }

  draw = (ctx) => {
    const SIN = Math.sin(this.rad);
    const COS = Math.cos(this.rad);

    const leftbottom = {
      x: this.x,
      y: this.y,
    };
    const lefttop = {
      x: this.x - this.length * SIN,
      y: this.y - this.length * COS,
    };
    const righttop = {
      x: lefttop.x + this.length * COS,
      y: lefttop.y - this.length * SIN,
    };
    const rightbottom = {
      x: this.x + this.length * COS,
      y: this.y - this.length * SIN,
    };

    ctx.moveTo(leftbottom.x, leftbottom.y);
    ctx.lineTo(lefttop.x, lefttop.y);
    ctx.lineTo(righttop.x, righttop.y);
    ctx.lineTo(rightbottom.x, rightbottom.y);
    ctx.lineTo(leftbottom.x, leftbottom.y);
    ctx.lineTo(lefttop.x, lefttop.y);
  };

  drawAttaching = (ctx) => {
    const SIN = Math.sin(this.attachingRad);
    const COS = Math.cos(this.attachingRad);

    const leftbottom = {
      x: this.attachingX,
      y: this.attachingY,
    };
    const lefttop = {
      x: this.attachingX - this.length * SIN,
      y: this.attachingY - this.length * COS,
    };
    const righttop = {
      x: lefttop.x + this.length * COS,
      y: lefttop.y - this.length * SIN,
    };
    const rightbottom = {
      x: this.attachingX + this.length * COS,
      y: this.attachingY - this.length * SIN,
    };

    ctx.moveTo(leftbottom.x, leftbottom.y);
    ctx.lineTo(lefttop.x, lefttop.y);
    ctx.lineTo(righttop.x, righttop.y);
    ctx.lineTo(rightbottom.x, rightbottom.y);
    ctx.lineTo(leftbottom.x, leftbottom.y);
    ctx.lineTo(lefttop.x, lefttop.y);
  };
}
