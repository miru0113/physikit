import { AddObject } from "./addObjects.js";
import { Attach } from "./attach.js";
import { HandleObjectArgs } from "./handleObjectArgs.js";

const RECT = "rect";
const CIRC = "circle";
const HILL = "hill";
const LINE = "line";
const SPRI = "spring";
const STROKE = 1;
const RANGE = 10;

const attach = new Attach();
const handleObjectArgs = new HandleObjectArgs();

class App {
  constructor() {
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    // this.ctx = new C2S(1000, 1000);

    this.addObject = new AddObject(this.addObjectCallBackFunction);

    this.objects = [];

    this.toPngButton = document.querySelector(".toPng");
    this.toPngButton.addEventListener("click", () => {
      const link = document.createElement("a");
      this.canvas.toBlob((blob) => {
        link.href = URL.createObjectURL(blob);
        link.download = "download.png";
        link.dataset.downloadurl = `image/png:${link.download}:${link.href}`;
        link.click();
        link.remove();
      });
    });
    this.toSvgButton = document.querySelector(".toSvg");
    this.toSvgButton.addEventListener("click", () => {
      alert("언젠가 추가될 기능..ㅎㅎ");
      // const link = document.createElement("a");
      // const svg = this.ctx.getSerializedSvg(true);
      // link.href = `data:text/plain;charset=utf-8,${svg}`;
      // link.download = "download.svg";
      // link.dataset.downloadurl = `image/png:${link.download}:${link.href}`;
      // link.click();
      // link.remove();
    });

    window.addEventListener("resize", this.resize, false);
    this.resize();

    this.rx = this.stageWidth / 1000;
    this.strokeWidth = STROKE * this.rx;
    this.range = RANGE * this.rx;

    this.isMouseup = true;
    this.canvas.addEventListener("mousedown", this.mousedownHandler, false);
    this.canvas.addEventListener("mousemove", this.mousemoveHandler, false);
    this.canvas.addEventListener("mouseup", this.mouseupHandler, false);

    requestAnimationFrame(this.draw);
  }

  resize = () => {
    this.stageWidth = this.canvas.clientWidth;
    this.stageHeight = this.canvas.clientHeight;

    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;
    this.ctx.scale(2, 2);

    this.objects.forEach((obj) => {
      obj.resize(this.stageWidth, this.stageHeight);
    });

    this.rx = this.stageWidth / 1000;
  };

  draw = () => {
    requestAnimationFrame(this.draw);
    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.objects.forEach((obj) => {
      this.ctx.strokeStyle = "black";
      if (obj.isControlRings) {
        console.log("pink");
        this.ctx.strokeStyle = "pink";
      }
      if (obj.isMouseon) this.ctx.strokeStyle = "green";
      if (obj.onclick) this.ctx.strokeStyle = "orange";
      if (obj.isAttaching) this.ctx.strokeStyle = "red";

      this.ctx.beginPath();
      obj.draw(this.ctx);
      this.ctx.stroke();
    });
  };

  mousedownHandler = (e) => {
    if (!this.isMouseup) return;
    this.isMouseup = false;
    this.isMousemoving = false;

    const mouseCoord = {
      x: e.offsetX,
      y: e.offsetY,
    };

    [this.onclickObject, this.objectsWithoutOnclickObject] = attach.getObjectWithinRange(mouseCoord, this.objects, this.range);
    if (this.onclickObject === null) return;

    this.onclickObject.onclick = true;
    handleObjectArgs.setObj(this.onclickObject);
    this.preMouseCoord = mouseCoord;
  };

  mousemoveHandler = (e) => {
    this.isMousemoving = true;

    const mouseCoord = {
      x: e.offsetX,
      y: e.offsetY,
    };

    if (this.onclickObject !== null && this.onclickObject !== undefined && this.onclickObject.onclick) {
      this.onclickObject.setCoord(
        this.onclickObject.x + mouseCoord.x - this.preMouseCoord.x,
        this.onclickObject.y + mouseCoord.y - this.preMouseCoord.y
      );
    } else {
      const [nearObject, objectsWithoutNearObject] = attach.getObjectWithinRange(mouseCoord, this.objects, this.range);
      if (this.minDistanceObject === null || this.minDistanceObject === undefined) return (this.minDistanceObject = nearObject);
      if (nearObject === null) {
        this.minDistanceObject.isMouseon = false;
        this.minDistanceObject = null;
        return;
      }
      this.minDistanceObject.isMouseon = false;
      this.minDistanceObject = nearObject;
      this.minDistanceObject.isMouseon = true;
    }

    this.preMouseCoord = mouseCoord;
  };

  mouseupHandler = (e) => {
    this.isMousemoving = false;
    this.isMouseup = true;

    if (this.onclickObject === null) return;
    this.onclickObject.onclick = false;
  };

  addObjectCallBackFunction = (index) => {
    this.objects.push(this.addObject.createNewObjectByIndex(this.stageWidth, this.stageHeight, index));
  };
}

window.onload = () => {
  const app = new App();
};
