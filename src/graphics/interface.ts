import { Point } from "pixi.js";

export interface IPoint extends Point {
  geometry: IGeometry;
  connectedGeometry: any;
}

export interface IGeometry {
  vertices: IPoint[];
  addVertex: (v: any) => void;
  update: () => void;
}
