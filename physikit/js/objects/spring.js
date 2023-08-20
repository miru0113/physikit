import { Object } from "./object.js";

export class Spring extends Object {
  constructor(stageWidth, stageHeight, rad, length, x, y, width, numOfRings) {
    super(stageWidth, stageHeight, rad, length, x, y);
    this.width = width;
    this.numOfRings = numOfRings;
    this.ringInterval = this.length / (0.7 * this.numOfRings + 1);

    this.setVertices();

    this.type = "spring";
  }

  getVerticesProduct = (rad) => {
    const SIN = Math.sin(rad);
    const COS = Math.cos(rad);
    const xWithUp = -(SIN * this.width) / 4;
    const yWithUp = -(COS * this.width) / 4;
    const xWithForward = (COS * this.ringInterval) / 4;
    const yWithForward = -(SIN * this.ringInterval) / 4;

    return [SIN, COS, xWithUp, yWithUp, xWithForward, yWithForward];
  };

  setVertices = () => {
    const [SIN, COS, xWithUp, yWithUp, xWithForward, yWithForward] = this.getVerticesProduct(this.rad);

    this.leftbottom = {
      x: this.x + -2 * xWithUp + 0.15 * this.numOfRings * xWithForward,
      y: this.y + -2 * yWithUp + 0.15 * this.numOfRings * yWithForward,
    };
    this.lefttop = {
      x: this.leftbottom.x + 4 * xWithUp,
      y: this.leftbottom.y + 4 * yWithUp,
    };
    this.righttop = {
      x: this.lefttop.x + 4.15 * this.numOfRings * xWithForward,
      y: this.lefttop.y + 4.15 * this.numOfRings * yWithForward,
    };
    this.rightbottom = {
      x: this.righttop.x - 4 * xWithUp,
      y: this.righttop.y - 4 * yWithUp,
    };
  };

  setAttachingVertices = () => {
    const [SIN, COS, xWithUp, yWithUp, xWithForward, yWithForward] = this.getVerticesProduct(this.rad);

    this.attachingLeftbottom = {
      x: this.x + -2 * xWithUp + 0.15 * this.numOfRings * xWithForward,
      y: this.y + -2 * yWithUp + 0.15 * this.numOfRings * yWithForward,
    };
    this.attachingLefttop = {
      x: this.leftbottom.x + 4 * xWithUp,
      y: this.leftbottom.y + 4 * yWithUp,
    };
    this.attachingRighttop = {
      x: this.lefttop.x + 4.15 * this.numOfRings * xWithForward,
      y: this.lefttop.y + 4.15 * this.numOfRings * yWithForward,
    };
    this.attachingRightbottom = {
      x: this.righttop.x - 4 * xWithUp,
      y: this.righttop.y - 4 * yWithUp,
    };
  };

  setRad = (rad) => {
    this.rad = rad;
    this.setVertices();
  };

  setLength = (length) => {
    this.length = length;
    this.ringInterval = this.length / (0.7 * this.numOfRings + 1);
    this.setVertices();
  };

  setCoord = (x, y) => {
    this.x = x;
    this.y = y;
    this.setVertices();
  };

  setAttachingCoord = (x, y) => {
    this.attachingX = x;
    this.attachingY = y;
    this.setAttachingVertices();
  };

  setWidth = (width) => {
    this.width = width;
    this.setVertices();
  };

  setNumOfRings = (numOfRings) => {
    this.numOfRings = numOfRings;
    this.ringInterval = this.length / (0.7 * this.numOfRings + 1);
    this.setVertices();
  };

  resize = (stageWidth, stageHeight) => {
    const ratio = stageWidth / this.stageWidth;

    this.length *= ratio;
    this.ringInterval *= ratio;
    this.width *= ratio;
    this.x *= ratio;
    this.y *= ratio;
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    this.setVertices();
  };

  draw = (ctx) => {
    const [SIN, COS, xWithUp, yWithUp, xWithForward, yWithForward] = this.getVerticesProduct(this.rad);

    ctx.moveTo(this.x, this.y);

    let bezierStart = [this.x + 0.15 * xWithForward * this.numOfRings, this.y + 0.15 * yWithForward * this.numOfRings];
    ctx.lineTo(bezierStart[0], bezierStart[1]);

    ctx.bezierCurveTo(
      bezierStart[0] - xWithUp,
      bezierStart[1] - yWithUp,
      bezierStart[0] - 2 * xWithUp + xWithForward,
      bezierStart[1] - 2 * yWithUp + yWithForward,
      bezierStart[0] - 2 * xWithUp + 2 * xWithForward,
      bezierStart[1] - 2 * yWithUp + 2 * yWithForward
    );
    ctx.bezierCurveTo(
      bezierStart[0] - 2 * xWithUp + 3 * xWithForward,
      bezierStart[1] - 2 * yWithUp + 3 * yWithForward,
      bezierStart[0] - xWithUp + 4 * xWithForward,
      bezierStart[1] - yWithUp + 4 * yWithForward,
      bezierStart[0] + 4 * xWithForward,
      bezierStart[1] + 4 * yWithForward
    );
    ctx.bezierCurveTo(
      bezierStart[0] + xWithUp + 4 * xWithForward,
      bezierStart[1] + yWithUp + 4 * yWithForward,
      bezierStart[0] + 2 * xWithUp + 3.75 * xWithForward,
      bezierStart[1] + 2 * yWithUp + 3.75 * yWithForward,
      bezierStart[0] + 2 * xWithUp + 3.25 * xWithForward,
      bezierStart[1] + 2 * yWithUp + 3.25 * yWithForward
    );
    ctx.bezierCurveTo(
      bezierStart[0] + 2 * xWithUp + 2.75 * xWithForward,
      bezierStart[1] + 2 * yWithUp + 2.75 * yWithForward,
      bezierStart[0] + xWithUp + 2.5 * xWithForward,
      bezierStart[1] + yWithUp + 2.5 * yWithForward,
      bezierStart[0] + 2.5 * xWithForward,
      bezierStart[1] + 2.5 * yWithForward
    );
    bezierStart = [bezierStart[0] + 2.5 * xWithForward, bezierStart[1] + 2.5 * yWithForward];
    for (let i = 1; i < this.numOfRings; i++) {
      ctx.bezierCurveTo(
        bezierStart[0] - xWithUp,
        bezierStart[1] - yWithUp,
        bezierStart[0] - 2 * xWithUp + xWithForward,
        bezierStart[1] - 2 * yWithUp + yWithForward,
        bezierStart[0] - 2 * xWithUp + 2 * xWithForward,
        bezierStart[1] - 2 * yWithUp + 2 * yWithForward
      );
      ctx.bezierCurveTo(
        bezierStart[0] - 2 * xWithUp + 3 * xWithForward,
        bezierStart[1] - 2 * yWithUp + 3 * yWithForward,
        bezierStart[0] - xWithUp + 4 * xWithForward,
        bezierStart[1] - yWithUp + 4 * yWithForward,
        bezierStart[0] + 4 * xWithForward,
        bezierStart[1] + 4 * yWithForward
      );
      ctx.bezierCurveTo(
        bezierStart[0] + xWithUp + 4 * xWithForward,
        bezierStart[1] + yWithUp + 4 * yWithForward,
        bezierStart[0] + 2 * xWithUp + 3.75 * xWithForward,
        bezierStart[1] + 2 * yWithUp + 3.75 * yWithForward,
        bezierStart[0] + 2 * xWithUp + 3.25 * xWithForward,
        bezierStart[1] + 2 * yWithUp + 3.25 * yWithForward
      );
      ctx.bezierCurveTo(
        bezierStart[0] + 2 * xWithUp + 2.75 * xWithForward,
        bezierStart[1] + 2 * yWithUp + 2.75 * yWithForward,
        bezierStart[0] + xWithUp + 2.5 * xWithForward,
        bezierStart[1] + yWithUp + 2.5 * yWithForward,
        bezierStart[0] + 2.5 * xWithForward,
        bezierStart[1] + 2.5 * yWithForward
      );
      bezierStart = [bezierStart[0] + 2.5 * xWithForward, bezierStart[1] + 2.5 * yWithForward];
    }

    ctx.bezierCurveTo(
      bezierStart[0] - xWithUp,
      bezierStart[1] - yWithUp,
      bezierStart[0] - 2 * xWithUp + xWithForward,
      bezierStart[1] - 2 * yWithUp + yWithForward,
      bezierStart[0] - 2 * xWithUp + 2 * xWithForward,
      bezierStart[1] - 2 * yWithUp + 2 * yWithForward
    );
    ctx.bezierCurveTo(
      bezierStart[0] - 2 * xWithUp + 3 * xWithForward,
      bezierStart[1] - 2 * yWithUp + 3 * yWithForward,
      bezierStart[0] - xWithUp + 4 * xWithForward,
      bezierStart[1] - yWithUp + 4 * yWithForward,
      bezierStart[0] + 4 * xWithForward,
      bezierStart[1] + 4 * yWithForward
    );
    ctx.lineTo(this.x + this.length * COS, this.y - this.length * SIN);
  };
}
