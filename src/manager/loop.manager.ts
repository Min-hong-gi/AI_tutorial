export class LoopManager {
	private running: boolean = false;
	private prevTime = 0;
	private loopEvents: Array<Function> = [];
	private delay: number = 0;
	private epoch =0;
	set time(time: number) {
		this.delay = time;
	}
	run() {
		this.running = true;
		requestAnimationFrame(this.loop.bind(this));
	}
	stop() {
		this.running = false;
	}
	subscribe(callback: (time: number, epoch: number) => any) {
		this.loopEvents.push(callback);
	}
	unsubscribe(callback: Function) {
		const index = this.loopEvents.findIndex(x => x == callback);
		this.loopEvents.splice(index, 1);
	}
	loop(time: number) {
		const elapsedTime = time - this.prevTime;
		if (this.delay <= elapsedTime) {
			this.epoch++;
			this.prevTime = time;
			this.loopEvents.forEach(x => {
				x(elapsedTime, this.epoch);
			})
		}
		if(this.running){
			requestAnimationFrame(this.loop.bind(this));
		}
	}
}