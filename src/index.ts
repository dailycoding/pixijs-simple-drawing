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
let currentGeometry: Line | null = null;

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

function onMouseDown(e: MouseEvent) {
  const clickPos = getMousePos(e);

  let obj = app.renderer.plugins.interaction.hitTest(clickPos);
  if (obj) {
    return;
  }

  initPosition = clickPos;

  currentGeometry = new Line(initPosition, initPosition);
  geometries.push(currentGeometry);
  container.addChild(currentGeometry);

  isMouseButtonDown = true;

  return true;
}

function onMouseMove(e: MouseEvent) {
  if (!isMouseButtonDown) {
    return;
  }

  // clearSpriteRef(annoRef)
  if (initPosition == null) return;

  if (!currentGeometry) return;

  const currentPosition = getMousePos(e);

  currentGeometry.updatePoints(initPosition, currentPosition);
}

function onMouseUp(_e: MouseEvent) {
  isMouseButtonDown = false;
}
