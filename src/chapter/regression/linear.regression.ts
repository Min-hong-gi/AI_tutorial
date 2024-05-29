import { MSE } from "../../util/util.core.js";
import { Chapter } from "../chapter.class.js";

// 선형 회귀
export class LinearRegression extends Chapter {
	// 학습률
	private static learningRate = 0.01;

	// 학습용 데이터 선언
	data = [
		{ x: 1, y: 2 },
		{ x: 2, y: 4 },
		{ x: 3, y: 6 },
		{ x: 4, y: 8 },
		{ x: 5, y: 10 },
		{ x: 6, y: 12 },
		{ x: 7, y: 14 },
		{ x: 8, y: 16 },
		{ x: 9, y: 18 },
	];
	// 가중치 선언
	private b = Math.random();
	private w = Math.random();


	//손실
	get loss() {
		return MSE(this.b, this.w, this.data);
	}
	printData(): void {
		
	}
	model() {
		let gradient_b = 0;
		let gradient_w = 0;
		for (let i = 0; i < this.data.length; i++) {

			const x = this.data[i].x;
			const y = this.data[i].y;
			const predictedY = this.w * x + this.b;
			gradient_b += 2 * (predictedY - y); // 절편에 대한 편미분
			gradient_w += 2 * (predictedY - y) * x; // 기울기에 대한 편미분
		};
		gradient_b /= this.data.length;
		gradient_w /= this.data.length;
		this.b -= LinearRegression.learningRate * gradient_b;
		this.w -= LinearRegression.learningRate * gradient_w;
	}
	draw(epoch: number) {
		this.canvasManager.draw((ctx, vw, vh) => {
			ctx.clearRect(0, 0, vw / 2, vh);
		});
		for (let i = 0; i < this.data.length; i++) {
			const x = this.data[i].x;
			const y = this.data[i].y;
			const predictedY = this.w * x + this.b;
			
			// 실제 값
			const prev = this.data[Math.max(i - 1, 0)];
			this.canvasManager.draw((ctx, vw, vh) => {
				ctx.beginPath()
				ctx.moveTo(prev.x * 30, vh - prev.y * 30)
				ctx.lineTo(x * 30, vh - y * 30);
				ctx.strokeStyle = '#f008';
				ctx.stroke();
				ctx.closePath();

				ctx.beginPath()
				ctx.arc(x * 30, vh - y * 30, 5, 0, Math.PI * 2);
				ctx.fillStyle = '#f008';
				ctx.fill();
				ctx.closePath();
			});

			// 예상 값
			const prevPredictedY = this.w * prev.x + this.b;
			this.canvasManager.draw((ctx, vw, vh) => {
				ctx.beginPath()
				ctx.moveTo(prev.x * 30, vh - prevPredictedY * 30)
				ctx.lineTo(x * 30, vh - (predictedY * 30));
				ctx.strokeStyle = '#00f8';
				ctx.stroke();
				ctx.closePath();

				ctx.beginPath()
				ctx.arc(x * 30, vh - (predictedY * 30), 5, 0, Math.PI * 2);
				ctx.fillStyle = '#00f8';
				ctx.fill();
				ctx.closePath();
			})

			// 현재 진행 상황
			this.canvasManager.draw((ctx, vw, vh) => {
				const msg = `Epoch: ${epoch} Loss: ${this.loss.toFixed(5)}`;
				ctx.beginPath();
				ctx.textBaseline = 'middle';
				ctx.fillStyle = '#000'
				ctx.font = '15px Arial';
				ctx.fillText(msg, 10, 30)
				ctx.closePath();

				const p = `W: ${this.w.toFixed(5)} B: ${this.b.toFixed(5)}`;
				ctx.beginPath();
				ctx.textBaseline = 'middle';
				ctx.fillStyle = '#000'
				ctx.font = '15px Arial';
				ctx.fillText(p, 10, 60)
				ctx.closePath();
			});
		}
	}
}