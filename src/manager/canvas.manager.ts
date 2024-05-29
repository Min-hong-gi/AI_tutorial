export class CanvasManager {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	constructor(selector: string) {
		this.canvas = document.querySelector(selector) as HTMLCanvasElement;
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

		this.canvas.width = this.canvas.clientWidth;
		this.canvas.height = this.canvas.clientHeight;
	}
	draw<T>(fn: (ctx: CanvasRenderingContext2D, vw: number, vh: number) => T) {
		return fn(this.ctx, this.vw, this.vh);
	}
	get vw() {
		return this.canvas.width;
	}
	get vh() {
		return this.canvas.height;
	}
}