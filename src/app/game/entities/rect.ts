export class Rect {
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = "#1152f7";
    context.fillRect(this.x, this.y, this.w, this.h);
  }
}
