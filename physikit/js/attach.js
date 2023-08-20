const crossProduct = (x1, y1, x2, y2) => x1 * y2 - x2 * y1;
const dotProduct = (x1, y1, x2, y2) => x1 * x2 + y1 * y2;
const getSlope = (p1, p2) => (p1.y - p2.y) / (p1.x - p2.x);
const getLength = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

const RECT = "square";
const CIRC = "circle";
const WEIGHT_MASS = 1;
const HILL = "dorurae";
const WEIGHT_HILL = 1;
const LINE = "flat";
const WEIGHT_LINE = 1;
const SPRI = "spring";
const WEIGHT_SPRI = 1;

export class Attach {
  constructor() {}

  getXByY = (targetX, targetY, rad, x1, y1) => {
    const slope = -Math.tan(rad);

    // 선분이 수직인 경우 (slope가 무한대)
    if (Math.abs(slope) > 1000000) {
      console.log("fina");
      return targetX;
    }

    // 선분의 기울기가 0인 경우 (수평 선분)
    if (slope === 0) return targetX;

    // 직선의 방정식: y = slope * (x - x1) + y1
    // y 좌표에 해당하는 x 좌표 계산
    const x = x1 + (targetY - y1) / slope;

    return x;
  };

  getYByX = (targetX, targetY, rad, x1, y1) => {
    // 기울기를 라디안에서 라디안으로 변환
    const slope = -Math.tan(rad);

    // 선분이 수직인 경우 (slope가 무한대)
    if (Math.abs(slope) > 1000000) return targetY;

    const y = slope * (targetX - x1) + y1;

    return y;
  };

  getDistancePointToLine = (targetX, targetY, rad, length, x1, y1, exSlope) => {
    const slope = rad !== null && rad !== undefined ? (Math.tan(rad) * length >= 0 ? -Math.tan(rad) : Math.tan(rad)) : exSlope;
    const verticalLength = length * Math.sin(rad);
    const horizontalLength = length * Math.cos(rad);
    const x2 = x1 + horizontalLength;
    const y2 = y1 - verticalLength;

    const distanceToStraight = Math.abs(-targetY + slope * (targetX - x1) + y1) / Math.sqrt(slope ** 2 + 1);
    const distanceToPoint1 = Math.sqrt((targetX - x1) ** 2 + (targetY - y1) ** 2);
    const distanceToPoint2 = Math.sqrt((targetX - x2) ** 2 + (targetY - y2) ** 2);

    let distance = distanceToStraight;
    if (Math.max(distanceToPoint1, distanceToPoint2) > Math.sqrt(length ** 2 + distance ** 2))
      distance = Math.min(distanceToPoint1, distanceToPoint2);

    return distance;
  };

  isPointInQuadrangle = (targetX, targetY, leftbottom, lefttop, righttop, rightbottom) => {
    const vectorLeft = [lefttop.x - leftbottom.x, lefttop.y - leftbottom.y];
    const vectorTop = [righttop.x - lefttop.x, righttop.y - lefttop.y];
    const vectorRight = [rightbottom.x - righttop.x, rightbottom.y - righttop.y];
    const vectorBottom = [leftbottom.x - rightbottom.x, leftbottom.y - rightbottom.y];

    const crossLeft = crossProduct(vectorLeft[0], vectorLeft[1], targetX - leftbottom.x, targetY - leftbottom.y);
    const crossTop = crossProduct(vectorTop[0], vectorTop[1], targetX - lefttop.x, targetY - lefttop.y);
    const crossRight = crossProduct(vectorRight[0], vectorRight[1], targetX - righttop.x, targetY - righttop.y);
    const crossBottom = crossProduct(vectorBottom[0], vectorBottom[1], targetX - rightbottom.x, targetY - rightbottom.y);

    if (crossLeft >= 0 && crossTop >= 0 && crossRight >= 0 && crossBottom >= 0) return true;
    return false;
  };

  getDistancePointToRect = (targetX, targetY, rad, length, x1, y1) => {
    const verticalLength = length * Math.sin(rad);
    const horizontalLength = length * Math.cos(rad);
    const leftbottom = {
      x: x1,
      y: y1,
    };
    const lefttop = {
      x: leftbottom.x - verticalLength,
      y: leftbottom.y - horizontalLength,
    };
    const righttop = {
      x: lefttop.x + horizontalLength,
      y: lefttop.y - verticalLength,
    };
    const rightbottom = {
      x: righttop.x + verticalLength,
      y: righttop.y + horizontalLength,
    };

    if (this.isPointInQuadrangle(targetX, targetY, leftbottom, lefttop, righttop, rightbottom)) return 0;

    const distanceToBottom = this.getDistancePointToLine(targetX, targetY, rad, length, leftbottom.x, leftbottom.y);
    const distanceToLeft = this.getDistancePointToLine(targetX, targetY, rad + Math.PI / 2, length, leftbottom.x, leftbottom.y);
    const distanceToTop = this.getDistancePointToLine(targetX, targetY, rad, length, lefttop.x, lefttop.y);
    const distanceToRight = this.getDistancePointToLine(targetX, targetY, rad + Math.PI, length, righttop.x, righttop.y);

    return Math.min(distanceToBottom, distanceToLeft, distanceToRight, distanceToTop);
  };

  getDistancePointToCircle = (targetX, targetY, radius, x1, y1) => {
    let distance = Math.sqrt((targetX - x1) ** 2 + (targetY - y1) ** 2) - radius;
    if (distance < 0) distance = 0;

    return distance;
  };

  getDistancePointToQuadrangle = (targetX, targetY, leftbottom, lefttop, righttop, rightbottom) => {
    const isPointInQuadrangle = this.isPointInQuadrangle(targetX, targetY, leftbottom, lefttop, righttop, rightbottom);

    if (isPointInQuadrangle) return 0;

    const slopeBottom = getSlope(rightbottom, leftbottom);
    const slopeLeft = getSlope(leftbottom, lefttop);
    const slopeTop = getSlope(lefttop, righttop);
    const slopeRight = getSlope(righttop, rightbottom);

    const lengthBottom = getLength(rightbottom, leftbottom);
    const lengthLeft = getLength(leftbottom, lefttop);
    const lengthTop = getLength(lefttop, righttop);
    const lengthRight = getLength(righttop, rightbottom);

    const distanceToBottom = this.getDistancePointToLine(
      targetX,
      targetY,
      null,
      lengthBottom,
      leftbottom.x,
      leftbottom.y,
      slopeBottom
    );
    const distanceToLeft = this.getDistancePointToLine(targetX, targetY, null, lengthLeft, leftbottom.x, leftbottom.y, slopeLeft);
    const distanceToTop = this.getDistancePointToLine(targetX, targetY, null, lengthTop, lefttop.x, lefttop.y, slopeTop);
    const distanceToRight = this.getDistancePointToLine(targetX, targetY, null, lengthRight, righttop.x, righttop.y, slopeRight);

    return Math.min(distanceToBottom, distanceToLeft, distanceToRight, distanceToTop);
  };

  isLineCrossLine = (p1, p2, q1, q2) => {
    const vectorP = [p2.x - p1.x, p2.y - p1.y];
    const vectorP1Q1 = [q1.x - p1.x, q1.y - p1.y];
    const vectorP1Q2 = [q2.x - p1.x, q2.y - p1.y];

    const crossP1Q1 = crossProduct(vectorP[0], vectorP[1], vectorP1Q1[0], vectorP1Q1[1]);
    const crossP1Q2 = crossProduct(vectorP[0], vectorP[1], vectorP1Q2[0], vectorP1Q2[1]);

    if (crossP1Q1 * crossP1Q2 <= 0) {
      return true;
    }
    return false;
  };

  isLineCrossRect = (p1, p2, leftbottom, lefttop, righttop, rightbottom) => {
    const isP1inRect = this.isPointInQuadrangle(p1.x, p1.y, leftbottom, lefttop, righttop, rightbottom);
    const isP2inRect = this.isPointInQuadrangle(p2.x, p2.y, leftbottom, lefttop, righttop, rightbottom);

    if (isP1inRect || isP2inRect) return true;

    const p1ToLeftbottom = [leftbottom.x - p1.x, leftbottom.y - p1.y];
    const p2ToLeftbottom = [leftbottom.x - p2.x, leftbottom.y - p2.y];
    const p1ToLefttop = [lefttop.x - p1.x, lefttop.y - p1.y];
    const p2ToLefttop = [lefttop.x - p2.x, lefttop.y - p2.y];
    const p1ToRighttop = [righttop.x - p1.x, righttop.y - p1.y];
    const p2ToRighttop = [righttop.x - p2.x, righttop.y - p2.y];
    const p1ToRightbottom = [rightbottom.x - p1.x, rightbottom.y - p1.y];
    const p2ToRightbottom = [rightbottom.x - p2.x, rightbottom.y - p2.y];

    const p1ToRect = [
      p1ToLeftbottom[0] + p1ToLefttop[0] + p1ToRighttop[0] + p1ToRightbottom[0],
      p1ToLeftbottom[1] + p1ToLefttop[1] + p1ToRighttop[1] + p1ToRightbottom[1],
    ];
    const p2ToRect = [
      p2ToLeftbottom[0] + p2ToLefttop[0] + p2ToRighttop[0] + p2ToRightbottom[0],
      p2ToLeftbottom[1] + p2ToLefttop[1] + p2ToRighttop[1] + p2ToRightbottom[1],
    ];
    const lengthOfP1ToRect = Math.sqrt(p1ToRect[0] ** 2 + p1ToRect[1] ** 2);
    const lengthOfP2ToRect = Math.sqrt(p2ToRect[0] ** 2 + p2ToRect[1] ** 2);

    const cos = dotProduct(p1ToRect[0], p1ToRect[1], p2ToRect[0], p2ToRect[1]) / (lengthOfP1ToRect * lengthOfP2ToRect);

    if (cos <= 0) return true;
    return false;
  };

  getDistanceLineToLine = (pRad, pLength, p1, qRad, qLength, q1) => {
    const p2 = {
      x: p1.x + Math.cos(pRad) * pLength,
      y: p1.y - Math.sin(pRad) * pLength,
    };
    const q2 = {
      x: q1.x + Math.cos(qRad) * qLength,
      y: q1.y - Math.sin(qRad) * qLength,
    };

    const distanceP1ToQ = this.getDistancePointToLine(p1.x, p1.y, qRad, qLength, q1.x, q1.y);
    const distanceP2ToQ = this.getDistancePointToLine(p2.x, p2.y, qRad, qLength, q1.x, q1.y);
    const distanceQ1ToP = this.getDistancePointToLine(q1.x, q1.y, pRad, pLength, p1.x, p1.y);
    const distanceQ2ToP = this.getDistancePointToLine(q2.x, q2.y, pRad, pLength, p1.x, p1.y);

    if (Math.max(distanceP1ToQ, distanceP2ToQ, distanceQ1ToP, distanceQ2ToP) < Math.min(Math.abs(pLength), Math.abs(qLength)))
      if (this.isLineCrossLine(p1, p2, q1, q2)) return 0;

    return Math.min(distanceP1ToQ, distanceP2ToQ, distanceQ1ToP, distanceQ2ToP);
  };

  getDistanceLineToCircle = (rad, length, lineX, lineY, radius, circleX, circleY) => {
    let distance = this.getDistancePointToLine(circleX, circleY, rad, length, lineX, lineY);
    distance -= radius;

    if (distance <= 0) return 0;
    return distance;
  };

  getDistanceLineToRect = (lineRad, lineLength, p1, rectRad, rectLength, leftbottom) => {
    const p2 = {
      x: p1.x + Math.cos(lineRad) * lineLength,
      y: p1.y - Math.sin(lineRad) * lineLength,
    };
    const verticalLength = rectLength * Math.sin(rectRad);
    const horizontalLength = rectLength * Math.cos(rectRad);
    const lefttop = {
      x: leftbottom.x - verticalLength,
      y: leftbottom.y - horizontalLength,
    };
    const righttop = {
      x: lefttop.x + horizontalLength,
      y: lefttop.y - verticalLength,
    };
    const rightbottom = {
      x: righttop.x + verticalLength,
      y: righttop.y + horizontalLength,
    };

    const isLineCrossRect = this.isLineCrossRect(p1, p2, leftbottom, lefttop, righttop, rightbottom);
    if (isLineCrossRect) return 0;

    const leftTo = this.getDistanceLineToLine(lineRad, lineLength, p1, rectRad + Math.PI / 2, rectLength, leftbottom);
    const topTo = this.getDistanceLineToLine(lineRad, lineLength, p1, rectRad, rectLength, lefttop);
    const rightTo = this.getDistanceLineToLine(lineRad, lineLength, p1, rectRad - Math.PI / 2, rectLength, righttop);
    const bottomTo = this.getDistanceLineToRect(lineRad, lineLength, p1, rectRad + Math.PI, rectLength, rightbottom);

    return Math.min(leftTo, topTo, rightTo, bottomTo);
  };

  isPointWithinRangeByLine = (targetX, targetY, rad, length, x1, y1, range) => {
    const distance = this.getDistancePointToLine(targetX, targetY, rad, length, x1, y1);

    if (distance <= range) return true;
    return false;
  };

  isPointWithinRangeByRect = (targetX, targetY, rad, length, x1, y1, range) => {
    const distance = this.getDistancePointToRect(targetX, targetY, rad, length, x1, y1);

    if (distance <= range) return true;
    return false;
  };

  isPointWithinRangeByQuadrangle = (targetX, targetY, leftbottom, lefttop, righttop, rightbottom, range) => {
    const distance = this.getDistancePointToQuadrangle(targetX, targetY, leftbottom, lefttop, righttop, rightbottom);

    if (distance <= range) return true;
    return false;
  };

  isPointWithinRangeByCircle = (targetX, targetY, radius, x1, y1, range) => {
    const distance = this.getDistancePointToCircle(targetX, targetY, radius, x1, y1);

    if (distance <= range) return true;
    return false;
  };

  getObjectWithinRange = (mouseCoord, objects, range) => {
    let minDistanceObject = null;
    let minDistance = range;
    let indexOfMinDistanceObject = 0;

    objects.forEach((obj, index) => {
      switch (obj.type) {
        case LINE: {
          let distance;
          if (obj.isAttaching)
            distance = this.getDistancePointToLine(
              mouseCoord.x,
              mouseCoord.y,
              obj.attachingRad,
              obj.length,
              obj.attachingX,
              obj.attachingY
            );
          else distance = this.getDistancePointToLine(mouseCoord.x, mouseCoord.y, obj.rad, obj.length, obj.x, obj.y);

          if (distance <= range) {
            const weightedDistance = distance / WEIGHT_LINE;
            if (weightedDistance < minDistance) {
              minDistance = weightedDistance;
              minDistanceObject = obj;
              indexOfMinDistanceObject = index;
            }
          }
          break;
        }
        case HILL: {
          const distance = this.getDistancePointToQuadrangle(
            mouseCoord.x,
            mouseCoord.y,
            obj.leftbottom,
            obj.lefttop,
            obj.righttop,
            obj.rightbottom
          );
          if (distance <= range) {
            const weightedDistance = distance / WEIGHT_HILL;
            if (weightedDistance < minDistance) {
              minDistance = weightedDistance;
              minDistanceObject = obj;
              indexOfMinDistanceObject = index;
            }
          }
          break;
        }
        case RECT: {
          let distance;
          if (obj.isAttaching)
            distance = this.getDistancePointToRect(
              mouseCoord.x,
              mouseCoord.y,
              obj.attachingRad,
              obj.length,
              obj.attachingX,
              obj.attachingY
            );
          else distance = this.getDistancePointToRect(mouseCoord.x, mouseCoord.y, obj.rad, obj.length, obj.x, obj.y);

          if (distance <= range) {
            const weightedDistance = distance / WEIGHT_MASS;
            if (weightedDistance < minDistance) {
              minDistance = weightedDistance;
              minDistanceObject = obj;
              indexOfMinDistanceObject = index;
            }
          }
          break;
        }
        case CIRC: {
          let SIN, COS;

          if (obj.isAttaching) {
            SIN = Math.sin(obj.attachingRad);
            COS = Math.cos(obj.attachingRad);
          } else {
            SIN = Math.sin(obj.rad);
            COS = Math.cos(obj.rad);
          }
          const center = {
            x: obj.x + (obj.length / 2) * (COS - SIN),
            y: obj.y - (obj.length / 2) * (COS + SIN),
          };

          const distance = this.getDistancePointToCircle(mouseCoord.x, mouseCoord.y, obj.length / 2, center.x, center.y);
          if (distance <= range) {
            const weightedDistance = distance / WEIGHT_MASS;
            if (weightedDistance < minDistance) {
              minDistance = weightedDistance;
              minDistanceObject = obj;
              indexOfMinDistanceObject = index;
            }
          }
          break;
        }
        case SPRI: {
          let distance;
          if (obj.isAttaching)
            distance = this.getDistancePointToQuadrangle(
              mouseCoord.x,
              mouseCoord.y,
              obj.attachingLeftbottom,
              obj.attachingLefttop,
              obj.attachingRighttop,
              obj.attachingRightbottom
            );
          else
            distance = this.getDistancePointToQuadrangle(
              mouseCoord.x,
              mouseCoord.y,
              obj.leftbottom,
              obj.lefttop,
              obj.righttop,
              obj.rightbottom
            );
          if (distance <= range) {
            const weightedDistance = distance / WEIGHT_MASS;
            if (weightedDistance < minDistance) {
              minDistance = weightedDistance;
              minDistanceObject = obj;
              indexOfMinDistanceObject = index;
            }
          }
          break;
        }
      }
    });
    if (minDistanceObject === null) return [null, null];

    let objectsWithoutMinDistanceObject = objects.slice();
    objectsWithoutMinDistanceObject.splice(indexOfMinDistanceObject, 1);

    return [minDistanceObject, objectsWithoutMinDistanceObject];
  };

  getAttachablePartLineToLine = (p1, p2, q1, q2) => {
    const distanceP1Q1 = getLength(p1, q1);
    const distanceP1Q2 = getLength(p1, q2);
    const distanceP2Q1 = getLength(p2, q1);
    const distanceP2Q2 = getLength(p2, q2);

    let distance = distanceP1Q1;
    let dCoord = {
      x: q1.x - p1.x,
      y: q1.y - p1.y,
    };
    if (distanceP1Q2 < distance) {
      distance = distanceP1Q2;
      dCoord = {
        x: q2.x - p1.x,
        y: q2.y - p1.y,
      };
    }
    if (distanceP2Q1 < distance) {
      distance = distanceP2Q1;
      dCoord = {
        x: q1.x - p2.x,
        y: q1.y - p2.y,
      };
    }
    if (distanceP2Q2 < distance) {
      distance = distanceP2Q2;
      dCoord = {
        x: q2.x - p2.x,
        y: q2.y - p2.y,
      };
    }

    return [dCoord, distance];
  };

  getDCoordForLineToMass = (dMouseCoord, lineRad, p1, massCoord) => {
    let attachableCoord = {
      x: p1.x,
      y: p1.y,
    };

    if (Math.abs(dMouseCoord.x) > Math.abs(dMouseCoord.y)) {
      attachableCoord.x = this.getXByY(p1.x, p1.y, lineRad, massCoord.x, massCoord.y);
    } else {
      attachableCoord.y = this.getYByX(p1.x, p1.y, lineRad, massCoord.x, massCoord.y);
    }

    const dCoord = {
      x: attachableCoord.x - p1.x,
      y: attachableCoord.y - p1.y,
    };

    return dCoord;
  };

  getDCoordForRectToLine = (dMouseCoord, lineRad, p1, massCoord) => {
    let attachableCoord = {
      x: p1.x,
      y: p1.y,
    };

    console.log(massCoord);

    if (Math.abs(dMouseCoord.x) > Math.abs(dMouseCoord.y)) {
      attachableCoord.x = this.getXByY(massCoord.x, massCoord.y, lineRad, p1.x, p1.y);
    } else {
      attachableCoord.y = this.getYByX(massCoord.x, massCoord.y, lineRad, p1.x, p1.y);
    }

    const dCoord = {
      x: attachableCoord.x - p1.x,
      y: attachableCoord.y - p1.y,
    };

    return dCoord;
  };

  getAttachablePartLineToMass = (
    lineRad,
    lineLength,
    p1,
    massRad,
    massLength,
    massCoord,
    dMouseCoord,
    isMassAttaching,
    massAttachingRad
  ) => {
    // let distance;
    // if (isMassAttaching) distance = this.getDistanceLineToLine(lineRad, lineLength, p1, massAttachingRad, massLength, massCoord);
    // else distance = this.getDistanceLineToLine(lineRad, lineLength, p1, massRad, massLength, massCoord);

    const distance = this.getDistanceLineToLine(lineRad, lineLength, p1, massRad, massLength, massCoord);
    const dCoord = this.getDCoordForLineToMass(dMouseCoord, lineRad, p1, massCoord);

    return [dCoord, distance];
  };

  getAttachablePartRectToLine = (
    lineRad,
    lineLength,
    p1,
    massRad,
    massLength,
    massCoord,
    dMouseCoord,
    isMassAttaching,
    massAttachingRad
  ) => {
    const distance = this.getDistanceLineToLine(lineRad, lineLength, p1, massRad, massLength, massCoord);
    const dCoord = this.getDCoordForRectToLine(dMouseCoord, massRad, p1, massCoord);

    return [dCoord, distance];
  };

  getAttachableObjectForLine = (line, objects, range, dMouseCoord) => {
    let [minDistanceObject, attachablePart, lineRadShift, objRadShift] = [null, null, null, null];
    let minDistance = range;

    const p1 = { x: line.x, y: line.y };
    const p2 = {
      x: p1.x + Math.cos(line.rad) * line.length,
      y: p1.y - Math.sin(line.rad) * line.length,
    };
    objects.forEach((obj) => {
      switch (obj.type) {
        case LINE: {
          const q1 = { x: obj.x, y: obj.y };
          const q2 = {
            x: q1.x + Math.cos(obj.rad) * obj.length,
            y: q1.y - Math.sin(obj.rad) * obj.length,
          };

          const [dCoord, distance] = this.getAttachablePartLineToLine(p1, p2, q1, q2);

          if (distance <= range) {
            const weightedDistance = distance / WEIGHT_LINE;
            if (weightedDistance < minDistance) {
              minDistance = weightedDistance;
              minDistanceObject = obj;
              attachablePart = dCoord;
              lineRadShift = null;
              objRadShift = null;
            }
          }
          break;
        }
        case HILL: {
          const q1 = obj.leftbottom;
          const q2 = obj.rightbottom;

          const [dCoord, distance] = this.getAttachablePartLineToLine(p1, p2, q1, q2);

          if (distance <= range) {
            const weightedDistance = distance / WEIGHT_HILL;
            if (weightedDistance < minDistance) {
              minDistance = weightedDistance;
              minDistanceObject = obj;
              attachablePart = dCoord;
              lineRadShift = null;
              objRadShift = null;
            }
          }
          break;
        }
        case RECT: {
          // const [dCoord, distance] = this.getAttachablePartLineToMass(
          //   line.rad,
          //   line.length,
          //   p1,
          //   obj.rad,
          //   obj.length,
          //   { x: obj.x, y: obj.y },
          //   dMouseCoord
          //   // obj.isAttaching,
          //   // obj.attachingRad
          // );

          // if (distance <= range) {
          //   const weightedDistance = distance / WEIGHT_MASS;
          //   if (weightedDistance < minDistance) {
          //     minDistance = weightedDistance;
          //     minDistanceObject = obj;
          //     attachablePart = dCoord;
          //     lineRadShift = null;
          //     objRadShift = line.rad;
          //   }
          // }
          break;
        }
        case CIRC: {
          // const SIN = Math.sin(obj.rad);
          // const COS = Math.cos(obj.rad);
          // const center = {
          //   x: obj.x + (obj.length / 2) * (COS - SIN),
          //   y: obj.y - (obj.length / 2) * (COS + SIN),
          // };

          // const distance = this.getDistanceLineToCircle(
          //   line.rad,
          //   line.length,
          //   line.x,
          //   line.y,
          //   obj.length / 2,
          //   center.x,
          //   center.y
          // );

          // if (distance <= range) {
          //   const weightedDistance = distance / WEIGHT_MASS;
          //   if (weightedDistance < minDistance) {
          //     minDistance = weightedDistance;
          //     minDistanceObject = obj;

          //     attachablePart = this.getDCoordForLineToMass(dMouseCoord, line.rad, p1, { x: obj.x, y: obj.y });
          //     lineRadShift = null;
          //     objRadShift = line.rad;
          //   }
          // }
          break;
        }
        case SPRI: {
          const center = {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2,
          };
          const springStart = {
            x: obj.x,
            y: obj.y,
          };
          const springEnd = {
            x: obj.x + obj.length * Math.cos(obj.rad),
            y: obj.y - obj.length * Math.sin(obj.rad),
          };
          const distanceToStart = getLength(center, springStart);
          const distanceToEnd = getLength(center, springEnd);

          let distance = distanceToStart;
          let attachableCoord;
          if (distanceToEnd < distanceToStart) {
            distance = distanceToEnd;
            attachableCoord = springEnd;
          } else attachableCoord = springStart;

          const forRad = obj.rad + Math.PI / 2;
          const forP2 = {
            x: p1.x + Math.cos(forRad) * line.length,
            y: p1.y - Math.sin(forRad) * line.length,
          };
          const forCenter = {
            x: (p1.x + forP2.x) / 2,
            y: (p1.y + forP2.y) / 2,
          };
          const dCoord = {
            x: attachableCoord.x - forCenter.x,
            y: attachableCoord.y - forCenter.y,
          };

          if (distance <= range) {
            const weightedDistance = distance / WEIGHT_SPRI;
            if (weightedDistance < minDistance) {
              minDistance = weightedDistance;
              minDistanceObject = obj;
              attachablePart = dCoord;
              lineRadShift = obj.rad + Math.PI / 2;
              objRadShift = null;
            }
          }
          break;
        }
      }
    });

    return [minDistanceObject, attachablePart, lineRadShift, objRadShift];
  };

  getAttachableObjectForHill = (hill, objects, range, dMouseCoord) => {
    let [minDistanceObject, attachablePart, hillRadShift, objRadShift] = [null, null, null, null];
    let minDistance = range;

    const p1 = hill.leftbottom;
    const p2 = hill.rightbottom;

    objects.forEach((obj) => {
      switch (obj.type) {
        case LINE: {
          const q1 = { x: obj.x, y: obj.y };
          const q2 = {
            x: q1.x + Math.cos(obj.rad) * obj.length,
            y: q1.y - Math.sin(obj.rad) * obj.length,
          };

          const [dCoord, distance] = this.getAttachablePartLineToLine(p1, p2, q1, q2);

          if (distance <= range) {
            const weightedDistance = distance / WEIGHT_LINE;
            if (weightedDistance < minDistance) {
              minDistance = weightedDistance;
              minDistanceObject = obj;
              attachablePart = dCoord;
              hillRadShift = null;
              objRadShift = null;
            }
          }
        }
        case HILL: {
          break;
        }
        case RECT: {
          const [dCoord, distance] = this.getAttachablePartLineToMass(
            hill.rad,
            hill.length,
            hill.lefttop,
            obj.rad,
            obj.length,
            { x: obj.x, y: obj.y },
            dMouseCoord
            // obj.isAttaching,
            // obj.attachingRad
          );

          if (distance <= range) {
            const weightedDistance = distance / WEIGHT_MASS;
            if (weightedDistance < minDistance) {
              minDistance = weightedDistance;
              minDistanceObject = obj;
              attachablePart = dCoord;
              hillRadShift = null;
              objRadShift = hill.rad;
            }
          }
          break;
        }
        case CIRC: {
          const SIN = Math.sin(obj.rad);
          const COS = Math.cos(obj.rad);
          const center = {
            x: obj.x + (obj.length / 2) * (COS - SIN),
            y: obj.y - (obj.length / 2) * (COS + SIN),
          };

          const distance = this.getDistanceLineToCircle(
            hill.rad,
            hill.length,
            hill.x,
            hill.y,
            obj.length / 2,
            center.x,
            center.y
          );

          if (distance <= range) {
            const weightedDistance = distance / WEIGHT_MASS;
            if (weightedDistance < minDistance) {
              minDistance = weightedDistance;
              minDistanceObject = obj;

              attachablePart = this.getDCoordForLineToMass(dMouseCoord, hill.rad, hill.lefttop, { x: obj.x, y: obj.y });
              hillRadShift = null;
              objRadShift = hill.rad;
            }
          }
          break;
        }
        case SPRI: {
          break;
        }
      }
    });

    return [minDistanceObject, attachablePart, hillRadShift, objRadShift];
  };

  getAttachableObjectForRect = (hill, objects, range, dMouseCoord) => {
    let [minDistanceObject, attachablePart, hillRadShift, objRadShift] = [null, null, null, null];
    let minDistance = range;

    objects.forEach((obj) => {
      switch (obj.type) {
        case LINE: {
          const [dCoord, distance] = this.getAttachablePartRectToLine(
            obj.rad,
            obj.length,
            obj.lefttop,
            hill.rad,
            hill.length,
            { x: hill.x, y: hill.y },
            dMouseCoord
            // obj.isAttaching,
            // obj.attachingRad
          );

          if (distance <= range) {
            const weightedDistance = distance / WEIGHT_MASS;
            if (weightedDistance < minDistance) {
              minDistance = weightedDistance;
              minDistanceObject = obj;
              attachablePart = dCoord;
              hillRadShift = obj.rad;
              objRadShift = null;
            }
          }
          break;
        }
        case HILL: {
          break;
        }
        case RECT: {
          // const [dCoord, distance] = this.getAttachablePartLineToMass(
          //   hill.rad,
          //   hill.length,
          //   hill.lefttop,
          //   obj.rad,
          //   obj.length,
          //   { x: obj.x, y: obj.y },
          //   dMouseCoord
          //   // obj.isAttaching,
          //   // obj.attachingRad
          // );

          // if (distance <= range) {
          //   const weightedDistance = distance / WEIGHT_MASS;
          //   if (weightedDistance < minDistance) {
          //     minDistance = weightedDistance;
          //     minDistanceObject = obj;
          //     attachablePart = dCoord;
          //     hillRadShift = null;
          //     objRadShift = hill.rad;
          //   }
          // }
          break;
        }
        case CIRC: {
          break;
        }
        case SPRI: {
          break;
        }
      }
    });

    return [minDistanceObject, attachablePart, hillRadShift, objRadShift];
  };

  getAttachableObject = (onclickObject, objects, range, mouseCoord, preMouseCoord) => {
    const dMouseCoord = {
      x: mouseCoord.x - preMouseCoord.x,
      x: mouseCoord.y - preMouseCoord.y,
    };

    switch (onclickObject.type) {
      case LINE: {
        const [attachableObject, attachableParts, lineRadShift, objRadShift] = this.getAttachableObjectForLine(
          onclickObject,
          objects,
          range,
          dMouseCoord
        );

        return [attachableObject, attachableParts, lineRadShift, objRadShift];
      }
      case HILL: {
        const [attachableObject, attachableParts, lineRadShift, objRadShift] = this.getAttachableObjectForHill(
          onclickObject,
          objects,
          range,
          dMouseCoord
        );

        return [attachableObject, attachableParts, lineRadShift, objRadShift];
      }
      case RECT: {
        const [attachableObject, attachableParts, lineRadShift, objRadShift] = this.getAttachableObjectForRect(
          onclickObject,
          objects,
          range,
          dMouseCoord
        );

        return [attachableObject, attachableParts, lineRadShift, objRadShift];
      }
      case CIRC: {
        break;
      }
      case SPRI: {
        break;
      }
    }

    return [null, null];
  };
}
