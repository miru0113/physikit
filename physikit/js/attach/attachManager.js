import { AttachForFlat } from "./flat.js";
import { AttachForCircle } from "./circle.js";
import { AttachForSquare } from "./square.js";

flatAtt = new AttachForFlat();
circleAtt = new AttachForCircle();
squareAtt = new AttachForSquare();

export class AttachManager {
  constructor() {
    this.flatAtt = new AttachForFlat();
    this.circleAtt = new AttachForCircle();
    this.squareAtt = new AttachForSquare();
  }
}
