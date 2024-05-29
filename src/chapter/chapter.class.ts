import { CanvasManager } from "../manager/canvas.manager.js";
import { LoopManager } from "../manager/loop.manager.js";

export class Chapter {
	// 시각화할 캔버스
	canvasManager: CanvasManager

	// 메인 루프
	loop: LoopManager

	data:Array<any> = [];

	fn: (time: number, epoch: number) => void;

	constructor(protected delay: number) {
		// 시각화 캔버스 설정
		this.canvasManager = new CanvasManager('canvas');
		// 메인 루프 설정
		this.loop = new LoopManager();
		this.loop.time = delay;

		this.fn = (time: number, epoch: number) => {
			this.model(epoch);
			this.draw(epoch);
		}
	}
	run() {
		this.printData();
		this.preprocessing();
		this.loop.subscribe(this.fn);
		this.loop.run();
	}
	stop() {
		this.loop.unsubscribe(this.fn);
		this.loop.stop();
	}
	preprocessing() {}
	printData() {}
	model(epoch: number) {}
	draw(epoch: number) {}
}
