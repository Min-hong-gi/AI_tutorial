export class Vector2D {
	private _x: number;
	private _y: number;
	constructor(x: number, y: number) {
		this._x = x;
		this._y = y;
	}
	get x() {
		return this._x;
	}
	get y() {
		return this._y;
	}
	add(vector2D: Vector2D): Vector2D;
	add(x: number, y: number): Vector2D;
	add(x: number | Vector2D, y?: number): Vector2D {
		if (typeof x === "number" && typeof y === 'number') {
			this._x += x;
			this._y += y;
		} else if (x instanceof Vector2D) {
			this._x += x.x;
			this._y += x.y;
		}
		return this;
	}
	sub(vector2D: Vector2D): Vector2D;
	sub(x: number, y: number): Vector2D;
	sub(x: number | Vector2D, y?: number): Vector2D {
		if (typeof x === "number" && typeof y === 'number') {
			this._x -= x;
			this._y -= y;
		} else if (x instanceof Vector2D) {
			this._x -= x.x;
			this._y -= x.y;
		}
		return this;
	}
	mul(scale: number): Vector2D {
		this._x *= scale;
		this._y *= scale;

		return this;
	}
	avg(scale: number): Vector2D {
		this._x /= scale;
		this._y /= scale;

		return this;
	}
	get size(): number {
		return Math.sqrt(this._x**2 + this._y **2);
	}
	normalize(scale: number): Vector2D {
		const size = this.size;
		if(size) {
			this._x *= scale / size;
			this._y *= scale / size;
		}
		return this;
	}
	clone(): Vector2D {
		return new Vector2D(this.x, this.y);
	}
	dot(vector2d: Vector2D): number {
		return this._x * vector2d.x + this._y * vector2d.y;
	}
}