import { Point } from "pixi.js";
import Geometry from "./geometry";

class Polygon extends Geometry {
  isClosed: boolean;
  isDragging: boolean;
  isFocused: boolean;
  lineWidth: number;
  lineColor: number;
  fillColor: number;
  fillAlpha: number;

  constructor(
    vertices: Iterable<Point>,
    lineSize: number = 2,
    lineColor: number = 0x0000f0,
    fillColor: number = 0x00f000,
    fillAlpha: number = 0.5
  ) {
    super(vertices);

    this.name = `polygon_${Math.random().toString().substring(2)}`;
    this.isClosed = false;
    this.isDragging = false;
    this.isFocused = false;

    this.lineWidth = lineSize;
    this.lineColor = lineColor;
    this.fillColor = fillColor;
    this.fillAlpha = fillAlpha;

    this.update();
  }

  override update() {
    // Set line style
    this.clear().lineStyle(this.lineWidth, this.lineColor);

    if (this.isClosed) {
      const vertices = [...this.vertices, this.vertices[0]];

      // Draw polygon
      this.beginFill(this.fillColor, this.alpha)
        .drawPolygon(vertices)
        .endFill();
    } else {
      // Draw Polyline
      this.moveTo(this.vertices[0].x, this.vertices[0].y);
      for (let i = 1; i < this.vertices.length; i++) {
        this.lineTo(this.vertices[i].x, this.vertices[i].y);
      }
    }
  }

  close() {
    if (this.vertices.length < 3) {
      return false;
    }

    this.isClosed = true;
    this.update();

    return true;
  }

  override isCompleted(): boolean {
    return this.isClosed;
  }
}

export default Polygon;
