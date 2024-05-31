export class Circle {
  x: number;
  y: number;
  r: number;
  colour: string;

  constructor(x: number, y: number, r: number, colour: string) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.colour = colour;
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.r <= 0) {
      return;
    }

    context.fillStyle = this.colour;
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    context.fill();
  }

  /**
   * @returns The distance between centres
   */
  distanceTo(circle: Circle) {
    return Math.sqrt(
      Math.pow(this.x + this.r / 2 - (circle.x + circle.r / 2), 2) +
        Math.pow(this.y + this.r / 2 - (circle.y + circle.r / 2), 2)
    );
  }
}
