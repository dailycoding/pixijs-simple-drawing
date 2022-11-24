import { Point } from "pixi.js";

function isCloseAt(p1: Point, p2: Point, epsilon = 2) {
  return (
    Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)) < epsilon
  );
}

export { isCloseAt };
