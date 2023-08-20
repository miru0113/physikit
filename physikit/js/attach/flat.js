import { Attach } from "./attach.js";

export class AttachForFlat extends Attach {
  constructor() {}

  isAttachableObject = (objToCheck) => {
    if (objToCheck.type === FLAT) return true;
    return false;
  };

  getMinDistancePart = (objToCheck, selectedFlat) => {
    const p1 = [selectedFlat.x, selectedFlat.y];
    const p2 = [
      p1[0] + selectedFlat.length * Math.cos(selectedFlat.rad),
      p1[1] - selectedFlat.length * Math.sin(selectedFlat.rad),
    ];
    const q1 = [objToCheck.x, objToCheck.y];
    const q2 = [q1[0] + objToCheck.length * Math.cos(objToCheck.rad), q1[1] - objToCheck.length * Math.sin(objToCheck.rad)];

    const distanceP1ToQ1 = getLength(p1, q1);
    const distanceP1ToQ2 = getLength(p1, q2);
    const distanceP2ToQ1 = getLength(p2, q1);
    const distanceP2ToQ2 = getLength(p2, q2);

    let distance = distanceP1ToQ1;
    let part = [p1, q1];
    if (distanceP1ToQ2 < distance) {
      distance = distanceP1ToQ2;
      part = [p1, q2];
    }
    if (distanceP2ToQ1 < distance) {
      distance = distanceP2ToQ1;
      part = [p2, q1];
    }
    if (distanceP2ToQ2 < distance) {
      distance = distanceP2ToQ2;
      part = [p2, q2];
    }

    return [part, distance];
  };
}
