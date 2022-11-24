import { Point } from "pixi.js";
import { IGeometry, IPoint } from "./interface";
import VertexGroup from "./vertexGroup";

class Vertex extends Point implements IPoint {
    geometry: IGeometry;
    connectedGeometry: VertexGroup | null;

    constructor(position: Point, geometry: IGeometry) {
        super(position.x, position.y);
        this.geometry = geometry;
        this.connectedGeometry = null;
    }
}

export default Vertex;
