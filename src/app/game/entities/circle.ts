export class Circle {
  x: number;
  y: number;
  r: number;

  private _colour?: string;

  constructor(x: number, y: number, r: number, colour?: string) {
    this.x = x;
    this.y = y;
    this.r = r;
    this._colour = colour;
  }

  get colour(): string {
    return this._colour ?? "";
  }

  draw(context: CanvasRenderingContext2D, x?: number, y?: number) {
    Circle.draw(context, x ?? this.x, y ?? this.y, this.r, this.colour);
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

  static draw(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    colour: string
  ) {
    if (r <= 0) {
      return;
    }

    context.fillStyle = colour;
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI);
    context.fill();
  }
}
