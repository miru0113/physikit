import { Flat } from "./objects/flat.js";
import { Square } from "./objects/square.js";
import { Circle } from "./objects/circle.js";
import { Spring } from "./objects/spring.js";
import { Dorurae } from "./objects/dorurae.js";

export class AddObject {
  constructor(callbackFunction) {
    this.addFlat = document.querySelector("#addFlat");
    this.addSquare = document.querySelector("#addSquare");
    this.addCircle = document.querySelector("#addCircle");
    this.addSpring = document.querySelector("#addSpring");
    this.addDorurae = document.querySelector("#addDorurae");

    this.addButtonList = [this.addFlat, this.addSquare, this.addCircle, this.addSpring, this.addDorurae];
    this.ObjectList = [Flat, Square, Circle, Spring, Dorurae];

    this.setClickHandler(callbackFunction);
  }

  setClickHandler = (callbackFunction) => {
    this.addButtonList.forEach((button, index) => {
      button.addEventListener("click", () => {
        callbackFunction(index);
      });
    });
  };

  createNewObjectByIndex = (stageWidth, stageHeight, index) => {
    return new this.ObjectList[index](
      stageWidth,
      stageHeight,
      0,
      stageWidth / 10,
      stageWidth / 2,
      stageHeight / 2,
      stageWidth / 20,
      5
    );
  };
}
