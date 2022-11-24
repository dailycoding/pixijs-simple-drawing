import { IGeometry } from "./interface";
import Geometry from "./geometry";
import Vertex from "./vertex";
import { Point } from "pixi.js";

class VertexGroup extends Geometry {
    constructor() {
        super([]);
    }

    override addVertex(vertex: Vertex): void {
        if (this.vertices.includes(vertex)) return;

        let otherVertexGroup = vertex.connectedGeometry as VertexGroup;
        if (otherVertexGroup) {
            otherVertexGroup.remove(vertex);
        }

        this.vertices.push(vertex);
        vertex.connectedGeometry = this;
    }

    remove(vertex: Vertex) {
        let vertexIndex = this.vertices.indexOf(vertex);
        if (vertexIndex >= 0) {
            this.vertices.splice(vertexIndex, 1);
            if (vertex.connectedGeometry == this) {
                vertex.connectedGeometry = null;
            }
        }
    }

    setPosition(pos: Point) {
        let geometries = new Set<IGeometry>();
        for (let vertex of this.vertices) {
            if (!vertex.equals(pos)) {
                vertex.set(pos.x, pos.y);
                geometries.add(vertex.geometry);
            }
        }
        for (let geometry of geometries) {
            geometry.update();
        }
    }
}

export default VertexGroup;
