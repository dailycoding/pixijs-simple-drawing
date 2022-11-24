import { Point } from "pixi.js";
import Geometry from "./geometry";

class Polygon extends Geometry {
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
    this.isDragging = false;
    this.isFocused = false;

    this.lineWidth = lineSize;
    this.lineColor = lineColor;
    this.fillColor = fillColor;
    this.fillAlpha = fillAlpha;

    this.update();
  }

  override update() {
    this.clear().lineStyle(this.lineWidth, this.lineColor);
    if (this.isClosed) {
      this.beginFill(this.fillColor, this.alpha)
        .drawPolygon(this.vertices)
        .endFill();
    } else {
      this.moveTo(this.vertices[0].x, this.vertices[0].y);
      for (let i = 1; i < this.vertices.length; i++) {
        this.lineTo(this.vertices[i].x, this.vertices[i].y);
      }
    }
  }

  get isClosed() {
    return (
      this.vertices.length >= 3 &&
      this.vertices[0].equals(this.vertices[this.vertices.length - 1])
    );
  }

  close() {
    if (this.vertices.length <= 1) {
      return false;
    } else if (this.vertices[0].equals(this.vertices[this.vertices.length - 1])) {
      return this.vertices.length > 2;
    }

    this.addVertex(this.vertices[0]);
    return true;
  }
}

export default Polygon;
