import { Application, Container, Graphics, Point } from "pixi.js";
import { Geometry, Polygon, VertexGroup } from "./graphics";

const view = document.querySelector("#pixi-content") as HTMLCanvasElement;

// Initialize PixiJS application
const app = new Application({
  view: view,
  width: window.innerWidth,
  height: window.innerHeight,
});

const container = new Container();
const graphics = new Graphics();
app.stage.addChild(container, graphics);
app.ticker.add(() => {
  graphics.clear();
});

// Make canvas to full-sized
window.addEventListener("resize", () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

function getMousePos(event: MouseEvent) {
  const pos = new Point(0, 0);
  if (container) {
    // Get the position and size of the component on the page.
    const holderOffset = view.getBoundingClientRect();
    pos.set(event.pageX - holderOffset.x, event.pageY - holderOffset.y);
  }
  return pos;
}

/**
 * Find geometry picked with mouse position
 */
function getPickedGeometry(position: Point, single: boolean = false) {
  let selectedVertexGroup: VertexGroup | null = null;

  for (let child of container.children) {
    let geometry = child as Geometry;
    if (!geometry) continue;

    let vertex = geometry.getVertexAt(position);
    if (!vertex) continue;

    if (!selectedVertexGroup) {
      // If there's a connected VertexGroup for picked vertex, use it
      // Otherwise, create new one
      selectedVertexGroup = vertex.connectedGeometry as VertexGroup;
      if (!selectedVertexGroup) {
        selectedVertexGroup = new VertexGroup();
      }
    }

    // Append vertex to vertex group
    selectedVertexGroup.addVertex(vertex);

    if (single && selectedVertexGroup.vertices.length > 1) {
      // Create new vertex group with selected geometry only
      selectedVertexGroup.remove(vertex)

      selectedVertexGroup = new VertexGroup();
      selectedVertexGroup.addVertex(vertex);

      break;
    }
  }

  return selectedVertexGroup;
}

/**
 * Start drawing/editing geometries
 */

let isMouseButtonDown = false;
let initPosition: Point | null = null;
let currentGeometry: Geometry | null = null;
let currentVertexGroup: VertexGroup | null = null;

function onMouseDown(e: MouseEvent) {
  if (isMouseButtonDown) return;

  const clickPos = getMousePos(e);
  initPosition = clickPos;

  // If user is drawing new Geometry, add new vertex
  if (currentGeometry) {
    currentGeometry.addVertex(initPosition);
  }

  // Get point (group) to move
  if (currentGeometry && !currentGeometry.isCompleted()) {

  } else {
    let selectSingleGeometry = e.shiftKey;
    currentVertexGroup = getPickedGeometry(clickPos, selectSingleGeometry);

    // Choose selected geometry if there is pickable geometry
    // Otherwise, create new geometry
    if (currentVertexGroup) {
      if (!currentGeometry) {
        currentGeometry = currentVertexGroup.vertices[0].geometry as Geometry;
      }
    } else {
      // Add new geometry if necessary
      if (!currentGeometry) {
        currentGeometry = new Polygon([initPosition, initPosition]);
        container.addChild(currentGeometry);
      }
    }
  }

  // Create new vertex group if necessary
  if (!currentVertexGroup) {
    currentVertexGroup = new VertexGroup();
    const selectedVertex = currentGeometry.vertices.slice(-1)[0];
    currentVertexGroup.addVertex(selectedVertex);
  }

  isMouseButtonDown = true;

  return true;
}

function onMouseMove(e: MouseEvent) {
  // Update position of picked vertices
  if (currentVertexGroup) {
    const currentPosition = getMousePos(e);
    currentVertexGroup.setPosition(currentPosition);
  }
}

function onMouseUp(e: MouseEvent) {
  // Update position of picked vertices, and unselect
  if (currentVertexGroup) {
    const currentPosition = getMousePos(e);
    currentVertexGroup.setPosition(currentPosition);
    currentVertexGroup = null;
  }

  // Deselect current geometry if editing was finished
  let currentPolygon = currentGeometry as Polygon;
  if (currentPolygon && currentPolygon.isClosed) {
    currentGeometry = null;
  }

  if (isMouseButtonDown) {
    isMouseButtonDown = false;
  }
}

function onMouseDblClick() {
  // Close path for polygon
  let currentPolygon = currentGeometry as Polygon;
  if (currentPolygon && !currentPolygon.isClosed) {
    if (currentPolygon.close()) {
      currentGeometry = null;
    }
  }
}

// Add mouse event listeners
view.addEventListener("mousemove", onMouseMove);
view.addEventListener("mousedown", onMouseDown);
view.addEventListener("mouseup", onMouseUp);
view.addEventListener("dblclick", onMouseDblClick);
