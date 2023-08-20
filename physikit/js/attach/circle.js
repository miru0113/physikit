import { Attach } from "./attach.js";

export class AttachForCircle {
  constructor() {}

  isAttachableObject = (objToCheck) => {
    if (objToCheck.type === FLAT) return true;
    if (objToCheck.type === CIRC) return false; //개발 중 ㅎㅎ
    if (objToCheck.type === SPRI) return true;
    return false;
  };

  getMinDistancePart = (objToCheck, selectedSquare) => {
    const center = [
      selectedSquare.x + (selectedSquare.length / 2) * (Math.cos(selectedSquare.rad) - Math.sin(selectedSquare.rad)),
      selectedSquare.y - (selectedSquare.length / 2) * (Math.cos(selectedSquare.rad) + Math.sin(selectedSquare.rad)),
    ];

    if (objToCheck.type === FLAT) {
      const part = [
        [selectedSquare.x, selectedSquare.y],
        getMeetPointOfLineByNormal(
          selectedSquare.x,
          selectedSquare.y,
          objToCheck.rad,
          objToCheck.length,
          objToCheck.x,
          objToCheck.y
        ),
      ];
      const distance = getDistancePointToLine(
        center[0],
        center[1],
        objToCheck.rad,
        objToCheck.length,
        objToCheck.x,
        objToCheck.y
      );

      return [part, distance];
    }
    //   if (objToCheck.type === CIRC) {
    //     const centerOfObjTocheck = [
    //       objToCheck.x + (objToCheck.length / 2) * (Math.cos(objToCheck.rad) - Math.sin(objToCheck.rad)),
    //       objToCheck.y - (objToCheck.length / 2) * (Math.cos(objToCheck.rad) + Math.sin(objToCheck.rad)),
    //     ];
    //     const distance = getLength(center, centerOfObjTocheck);
    //     return [[center, centerOfObjTocheck], distance];
    //   }
    if (objToCheck.type === SPRI) {
      const endOfSpring = [
        objToCheck.x + objToCheck.length * Math.cos(objToCheck.rad),
        objToCheck.y - objToCheck.length * Math.sin(objToCheck.rad),
      ];
      const distance = getLength(center, endOfSpring);
      return [
        [[selectedSquare.x + selectedSquare.length / 2, selectedSquare.y - selectedSquare.length / 2], endOfSpring],
        distance,
      ];
    }
  };
}
