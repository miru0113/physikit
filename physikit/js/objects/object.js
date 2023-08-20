export class Object {
  constructor(stageWidth, stageHeight, rad, length, x, y) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    this.rad = rad;
    this.length = length;
    this.x = x;
    this.y = y;

    this.isMouseon = false;
    this.onclick = false;
    this.isAttaching = false;
  }

  setRad = (rad) => {
    this.rad = rad;
  };

  setLength = (length) => {
    this.length = length;
  };

  setCoord = (x, y) => {
    this.x = x;
    this.y = y;
  };

  setAttachingRad = (rad) => {
    this.attachingRad = rad;
  };

  setAttachingCoord = (x, y) => {
    this.attachingX = x;
    this.attachingY = y;
  };

  resize = (stageWidth, stageHeight) => {
    const ratio = stageWidth / this.stageWidth;

    this.length *= ratio;
    this.x *= ratio;
    this.y *= ratio;
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
  };
}
