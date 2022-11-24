import { Graphics, Point } from "pixi.js";
import { IGeometry, IPoint } from "./interface";
import { isCloseAt } from "./math";
import Vertex from "./vertex";

class Geometry extends Graphics implements IGeometry {
  vertices: IPoint[];

  constructor(vertices: Iterable<Point>) {
    super();

    this.vertices = new Array<Vertex>();
    for (let vertex of vertices) {
      this.vertices.push(new Vertex(vertex, this));
    }
  }

  addVertex(vertex: Point) {
    if (
      this.vertices.length == 0 ||
      !this.vertices[this.vertices.length - 1].equals(vertex)
    ) {
      this.vertices.push(new Vertex(vertex, this));
      this.update();
    }
  }

  getVerticesAt(pos: Point) {
    let points: IPoint[] = [];
    for (let i = 0; i < this.vertices.length; i++) {
      if (isCloseAt(pos, this.vertices[i])) {
        points.push(this.vertices[i]);
      }
    }
    return points;
  }

  update() {}
}

export default Geometry;
