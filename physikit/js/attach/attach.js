export class Attach {
  constructor() {
    this.SQUA = "square"; //done 개발 중
    this.CIRC = "circle"; //done 개발 중
    this.FLAT = "flat"; //done
    this.SPRI = "spring"; //나중에
    this.DORU = "dorurae"; //나중에
  }

  isInAttachableRange = (objToCheck, selectedFlat, range, attach) => {
    if (!this.isAttachableObject(objToCheck)) return false;
    const [part, minDistance] = this.getMinDistancePart(objToCheck, selectedFlat, attach);
    if (minDistance <= range) return [part, minDistance];
    return false;
  };

  /**point x, point y, line rad, line length, line x, line y*/
  getDistancePointToLine = (pX, pY, rad, length, x1, y1) => {
    const slope = Math.tan(rad) * length >= 0 ? -Math.tan(rad) : Math.tan(rad);
    const x2 = x1 + length * Math.cos(rad);
    const y2 = y1 - length * Math.sin(rad);

    const distanceToStraight = Math.abs(-pY + slope * (pX - x1) + y1) / Math.sqrt(slope ** 2 + 1);
    const distanceToPoint1 = Math.sqrt((pX - x1) ** 2 + (pY - y1) ** 2);
    const distanceToPoint2 = Math.sqrt((pX - x2) ** 2 + (pY - y2) ** 2);

    let distance = distanceToStraight;
    if (Math.max(distanceToPoint1, distanceToPoint2) > Math.sqrt(length ** 2 + distance ** 2))
      distance = Math.min(distanceToPoint1, distanceToPoint2);

    return distance;
  };

  getMeetPointOfLineByNormal = (pX, pY, rad, length, x1, y1) => {
    const slope = Math.tan(rad) * length >= 0 ? -Math.tan(rad) : Math.tan(rad);

    const yInterceptOfLine = y1 - slope * x1;
    const yInterceptOfNormal = pY + pX / slope;
    const meetPointX = (yInterceptOfNormal - yInterceptOfLine) / (slope + 1 / slope);
    const meetPointY = slope * meetPointX + yInterceptOfLine;

    return [meetPointX, meetPointY];
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

  getObjectWithinRange = (mouseCoord, objects, range) => {
    let minDistanceObject = null;
    let minDistance = range;
    let indexOfMinDistanceObject = 0;

    objects.forEach((obj, index) => {
      switch (obj.type) {
        case this.LINE: {
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
        case this.SQUA: {
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
        case this.CIRC: {
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
        case this.SPRI: {
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
        case this.DORU: {
        }
      }
    });
    if (minDistanceObject === null) return [null, null];

    let objectsWithoutMinDistanceObject = objects.slice();
    objectsWithoutMinDistanceObject.splice(indexOfMinDistanceObject, 1);

    return [minDistanceObject, objectsWithoutMinDistanceObject];
  };

  crossProduct = (x1, y1, x2, y2) => x1 * y2 - x2 * y1;
  dotProduct = (x1, y1, x2, y2) => x1 * x2 + y1 * y2;
  getSlope = (p1, p2) => (p1.y - p2.y) / (p1.x - p2.x);
  getLength = (p1, p2) => Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
}
