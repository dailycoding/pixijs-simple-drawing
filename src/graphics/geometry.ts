import { Graphics, Point } from "pixi.js";
import { IGeometry, IPoint } from "./interface";
import { isCloseAt } from "./math";
import Vertex from "./vertex";

class Geometry extends Graphics implements IGeometry {
  vertices: IPoint[];

  constructor(vertices: Iterable<Point>) {
    super();

    // Add new vertices
    this.vertices = new Array<Vertex>();
    for (let vertex of vertices) {
      this.vertices.push(new Vertex(vertex, this));
    }

    this.update();
  }

  addVertex(vertex: Point, update: boolean = true) {
    // If new vertex is same with previous one, ignore it
    if (this.vertices.length > 0 && this.vertices.slice(-1)[0].equals(vertex)) {
      return;
    }

    this.vertices.push(new Vertex(vertex, this));

    // Update geometry if flag set
    if (update) this.update();
  }

  getVertexAt(pos: Point) {
    for (let i = 0; i < this.vertices.length; i++) {
      if (isCloseAt(pos, this.vertices[i])) {
        return this.vertices[i];
      }
    }
    return null;
  }

  isCompleted() {
    return false;
  }

  update() {}
}

export default Geometry;
