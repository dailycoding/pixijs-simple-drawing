import { Application, Container, Graphics, Point } from "pixi.js";
import { Geometry, Polygon, VertexGroup } from "./graphics";

const view = document.querySelector("#pixi-content") as HTMLCanvasElement;

const app = new Application({
  view: view,
  width: window.innerWidth,
  height: window.innerHeight,
  resizeTo: window,
});

let isMouseButtonDown = false;
let initPosition: Point | null = null;
let currentGeometry: Geometry | null = null;
let currentVertexGroup: VertexGroup | null = null;

const container = new Container();
const graphics = new Graphics();
app.stage.addChild(container, graphics);
app.ticker.add(update);
window.addEventListener("resize", onResize);

view.addEventListener("mousemove", onMouseMove);
view.addEventListener("mousedown", onMouseDown);
view.addEventListener("mouseup", onMouseUp);
view.addEventListener("dblclick", onMouseDblClick);

function update() {
  graphics.clear().lineStyle(2, 0x0000ff);
}

function onResize() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
}

function getMousePos(event: MouseEvent) {
  const pos = new Point(0, 0);
  if (container) {
    // Get the position and size of the component on the page.
    const holderOffset = view.getBoundingClientRect();
    pos.set(event.pageX - holderOffset.x, event.pageY - holderOffset.y);
  }
  return pos;
}

function getPickedGeometry(position: Point, single: boolean = false) {
  let selectedVertexGroup: VertexGroup | null = null;
  for (let child of container.children) {
    let geometry = child as Geometry;
    if (!geometry) continue;

    let vertices = geometry.getVerticesAt(position);
    for (let vertex of vertices) {
      if (!selectedVertexGroup) {
        selectedVertexGroup = vertex.connectedGeometry as VertexGroup;
        if (selectedVertexGroup) {
          continue;
        } else {
          selectedVertexGroup = new VertexGroup();
        }
      }
      selectedVertexGroup.addVertex(vertex);
    }

    if (!vertices.length) continue;

    if (single && selectedVertexGroup) {
      if (selectedVertexGroup.vertices.length != vertices.length) {
        // Create new vertex group with selected geometry only
        let oldVertexGroup = selectedVertexGroup;
        selectedVertexGroup = new VertexGroup();
        for (let vertex of vertices) {
          oldVertexGroup.remove(vertex)
          selectedVertexGroup.addVertex(vertex);
        }
      }
      break;
    }
  }

  return selectedVertexGroup;
}

function onMouseDown(e: MouseEvent) {
  if (isMouseButtonDown) return;

  const clickPos = getMousePos(e);

  initPosition = clickPos;

  if (currentGeometry) {
    currentGeometry.addVertex(initPosition);
  }

  let selectSingleGeometry = e.shiftKey;
  currentVertexGroup = getPickedGeometry(clickPos, selectSingleGeometry);
  if (currentVertexGroup) {
    if (!currentGeometry) {
      currentGeometry = currentVertexGroup.vertices[0].geometry as Geometry;
    }
  }

  if (!currentGeometry) {
    currentGeometry = new Polygon([initPosition, initPosition]);
    container.addChild(currentGeometry);
    if (!currentVertexGroup) {
      currentVertexGroup = new VertexGroup();
      let selectedVertex =
        currentGeometry.vertices[currentGeometry.vertices.length - 1];
      currentVertexGroup.addVertex(selectedVertex);
    }
  }

  isMouseButtonDown = true;

  return true;
}

function onMouseMove(e: MouseEvent) {
  if (currentVertexGroup) {
    const currentPosition = getMousePos(e);
    currentVertexGroup.setPosition(currentPosition);
  }
}

function onMouseUp(e: MouseEvent) {
  if (currentVertexGroup) {
    const currentPosition = getMousePos(e);
    currentVertexGroup.setPosition(currentPosition);
    currentVertexGroup = null;
  }

  let currentPolygon = currentGeometry as Polygon;
  if (currentPolygon && currentPolygon.isClosed) {
    currentGeometry = null;
  }

  if (isMouseButtonDown) {
    isMouseButtonDown = false;
  }
}

function onMouseDblClick() {
  let currentPolygon = currentGeometry as Polygon;
  if (currentPolygon && !currentPolygon.isClosed) {
    if (currentPolygon.close()) {
      currentGeometry = null;
    }
  }
}
