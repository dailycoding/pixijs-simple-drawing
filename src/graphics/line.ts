import { Graphics, Point, Polygon } from "pixi.js";
import Vertex from "./vertex";
import { isCloseAt } from "./math";

class Line extends Graphics {
  vertices: Vertex[];

  lineWidth: number;
  lineColor: number;
  isDragging: boolean;
  currentVertex: Vertex | null;
  isFocused: boolean;

  constructor(a: Point, b: Point, lineSize = 2, lineColor = 0xf00000) {
    super();

    this.name = `line_${Math.random().toString().substring(2)}`;
    this.isDragging = false;
    this.isFocused = false;
    this.currentVertex = null;

    this.vertices = [a, b].map((pos, index) => new Vertex(this, index, pos));

    this.lineWidth = lineSize || 2;
    this.lineColor = lineColor || 0xf00000;
    this.interactive = true;
    this.buttonMode = true;

    this.draw();
  }

  updatePoints(a: Point, b: Point) {
    this.vertices[0].setPosition(a);
    this.vertices[1].setPosition(b);

    // Update hit area
    this.hitArea = new Polygon(this.vertices);

    this.draw();
  }

  draw() {
    this.clear();
    this.lineStyle(this.lineWidth, this.lineColor);
    this.moveTo(this.vertices[0].x, this.vertices[0].y);
    this.lineTo(this.vertices[1].x, this.vertices[1].y);
  }

  getVertexAt(pos: Point) {
    for (let i = 0; i < this.vertices.length; i++) {
      if (isCloseAt(pos, this.vertices[i].position)) {
        return i;
      }
    }
    return -1;
  }

  startDragging(vertId: number) {
    this.currentVertex = this.vertices[vertId];
    this.isDragging = true;
  }

  setCurrentVertexPos(position: Point) {
    if (this.currentVertex) {
      this.currentVertex.setPosition(position);
      this.draw();
    }
  }

  endDragging() {
    this.currentVertex = null;
    this.isDragging = false;
  }
}

export default Line;
