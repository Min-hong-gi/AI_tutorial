import { CanvasManager } from "../manager/canvas.manager.js";
import { LoopManager } from "../manager/loop.manager.js";

export class Chapter {
	// 시각화할 캔버스
	private _canvasManager: CanvasManager
	get canvasManager() {
		return this._canvasManager;
	}

	// 메인 루프
	private _loop: LoopManager
	get loop() {
		return this._loop;
	}

	private fn: (time: number, epoch: number) => void;

	constructor(protected delay: number, selector: string) {
		// 시각화 캔버스 설정
		this._canvasManager = new CanvasManager(selector);
		// 메인 루프 설정
		this._loop = new LoopManager();
		this.loop.time = delay;

		this.fn = (time: number, epoch: number) => {
			this.model(epoch);
			this.draw(epoch);
		}
	}
	run() {
		this.preprocessing();
		this.loop.subscribe(this.fn);
		this.loop.run();
	}
	stop() {
		this.loop.unsubscribe(this.fn);
		this.loop.stop();
	}
	preprocessing() {
		console.log("Not implements method: preprocessing")
	}
	model(epoch: number) {
		console.log("Not implements method: model")
	}
	draw(epoch: number) {
		console.log("Not implements method: draw")
	}
}
