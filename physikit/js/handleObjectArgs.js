export class HandleObjectArgs {
  constructor() {
    this.handleLength = document.querySelector("#handleLength");
    this.handleRad = document.querySelector("#handleRad");
    this.handleWidth = document.querySelector("#handleWidth");
    this.handleNumOfRings = document.querySelector("#handleNumOfRings");

    this.lengthInput = this.handleLength.querySelector("input");
    this.radInput = this.handleRad.querySelector("input");
    this.widthInput = this.handleWidth.querySelector("input");
    this.numOfRingsInput = this.handleNumOfRings.querySelector("input");

    this.lengthButton = this.handleLength.querySelector("button");
    this.radButton = this.handleRad.querySelector("button");
    this.widthButton = this.handleWidth.querySelector("button");
    this.numOfRingsButton = this.handleNumOfRings.querySelector("button");

    this.lengthH5 = this.handleLength.querySelector("h5");
    this.radH5 = this.handleRad.querySelector("h5");
    this.widthH5 = this.handleWidth.querySelector("h5");
    this.numOfRingsH5 = this.handleNumOfRings.querySelector("h5");

    this.handleLength.addEventListener("submit", this.setLength);
    this.handleRad.addEventListener("submit", this.setRad);
    this.handleWidth.addEventListener("submit", this.setWidth);
    this.handleNumOfRings.addEventListener("submit", this.setNumOfRings);
  }

  setObj = (obj) => {
    this.obj = obj;
    this.setH5();
  };

  setH5 = () => {
    this.lengthH5.innerHTML = this.obj.length;
    this.radH5.innerHTML = this.obj.rad;
    this.widthH5.innerHTML = this.obj.width;
    this.numOfRingsH5.innerHTML = this.obj.numOfRings;
  };

  setLength = (e) => {
    e.preventDefault();
    const lengthInput = e.target["input"];
    this.obj.setLength(lengthInput.value);
    this.setH5();
  };

  setRad = (e) => {
    e.preventDefault();
    const lengthInput = e.target["input"];
    this.obj.setRad(lengthInput.value);
    this.setH5();
  };

  setWidth = (e) => {
    e.preventDefault();
    const lengthInput = e.target["input"];
    this.obj.setWidth(lengthInput.value);
    this.setH5();
  };
  setNumOfRings = (e) => {
    e.preventDefault();
    const lengthInput = e.target["input"];
    this.obj.setNumOfRings(lengthInput.value);
    this.setH5();
  };
}
