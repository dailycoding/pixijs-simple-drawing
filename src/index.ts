import { Application, Container, Graphics, Point } from "pixi.js";
import { Line } from "./graphics";

let vw = window.innerWidth,
  vh = window.innerHeight;
let view = document.querySelector("#pixi-content") as HTMLCanvasElement;

const app = new Application({
  view: view,
  width: vw,
  height: vh,
  resizeTo: window,
});

const geometries: Line[] = [];
let isMouseButtonDown = false;
let initPosition: Point | null = null;
let currentGeometries: Line[] = [];

const container = new Container();
const graphics = new Graphics();
app.stage.addChild(container, graphics);
app.ticker.add(update);
window.addEventListener("resize", onResize);

view.addEventListener("mousemove", onMouseMove);
view.addEventListener("mousedown", onMouseDown);
view.addEventListener("mouseup", onMouseUp);

function update() {
  graphics.clear().lineStyle(2, 0x0000ff);
}

function onResize() {
  vw = window.innerWidth;
  vh = window.innerHeight;
  app.renderer.resize(vw, vh);
}

// let annoRef: Container | null = null;
// let sprite: Line | null = null;

function getMousePos(event: MouseEvent) {
  const pos = new Point(0, 0);
  if (container) {
    // Get the position and size of the component on the page.
    const holderOffset = view.getBoundingClientRect();
    pos.set(event.pageX - holderOffset.x, event.pageY - holderOffset.y);
  }
  return pos;
}

function getPickedGeometries(position: Point) {
  let pickedGeometries = [];
  for (let geometry of geometries) {
    let vertexId = geometry.getVertexAt(position);
    if (vertexId < 0) continue;

    geometry.startDragging(vertexId);
    pickedGeometries.push(geometry);
  }

  return pickedGeometries;
}

function onMouseDown(e: MouseEvent) {
  const clickPos = getMousePos(e);

  initPosition = clickPos;

  currentGeometries = getPickedGeometries(clickPos);
  if (!currentGeometries.length) {
    let geometry = new Line(initPosition, initPosition);
    geometry.startDragging(1);
    geometries.push(geometry);
    container.addChild(geometry);

    currentGeometries = [geometry];
  }
  isMouseButtonDown = true;

  return true;
}

function onMouseMove(e: MouseEvent) {
  if (!isMouseButtonDown) {
    return;
  }

  const currentPosition = getMousePos(e);
  for (let geometry of currentGeometries) {
    geometry.setCurrentVertexPos(currentPosition);
  }
}

function onMouseUp(_e: MouseEvent) {
  for (let geometry of currentGeometries) {
    geometry.endDragging();
  }
  currentGeometries = [];
  isMouseButtonDown = false;
}
