import { Graphics, Point } from "pixi.js";

class Vertex {
    graphics: Graphics;
    index: number;
    position: Point;

    constructor(graphics: Graphics, vertexIndex: number, position: Point) {
        this.graphics = graphics;
        this.index = vertexIndex;
        this.position = new Point(position.x, position.y);
    }

    get x() {
        return this.position.x;
    }
    get y() {
        return this.position.y;
    }

    setPosition(position: Point) {
        this.position.set(position.x, position.y);
    }
}

export default Vertex;
