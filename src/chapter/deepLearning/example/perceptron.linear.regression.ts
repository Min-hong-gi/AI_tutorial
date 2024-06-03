import { meanSquaredError } from "../../../util/loss.core";
import { gradientDescent } from "../../../util/optimizer.core";
import { normalize } from "../../../util/util.core";
import { Chapter } from "../../chapter.class";
import { perceptron } from "../perceptron";

// 선형 회귀
export class PerceptronLinearRegression extends Chapter {
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
	private loss = 0;

	private lerningdata: Array<{ x: Array<number>, y: Array<number> }> = [];

	preprocessing() {
		const scale = normalize(this.data.map(x => ({ x: [x.x] })));
		this.lerningdata = this.data.map(x => {
			x.x /= scale[0];
			return x;
		}).map(x => {
			return {
				x: [x.x],
				y: [x.y],
			}
		})
	}

	model() {
		// 학습 계층
		const layer = perceptron({
			// 활성화 함수
			activationFunction: (weightSums) => weightSums,
			// 손실 함수
			lossFunction: meanSquaredError,
			// 에러 함수
			errorFunction: (error) => {
				return 2 * (error);
			},
			optimizer: gradientDescent,
			//학습률
			learningRate: PerceptronLinearRegression.learningRate,
		});

		// 학습 결과
		const reuslt = layer({
			// 학습 데이터
			originData: this.lerningdata,
			// 가중치 (선택)
			weights: [[this.w]],
			// 편향 (선택)
			bias: [this.b],
		});
		
		this.w = reuslt.weights[0][0];
		this.b = reuslt.bias[0];
		this.loss = reuslt.totalLoss;
	}
	draw(epoch: number) {
		this.canvasManager.draw((ctx, vw, vh) => {
			ctx.clearRect(0, 0, vw, vh);
		});
		for (let i = 0; i < this.data.length; i++) {
			const x = this.data[i].x;
			const y = this.data[i].y;
			const predictedY = this.w * x + this.b;

			// 실제 값
			const prev = this.data[Math.max(i - 1, 0)];
			this.canvasManager.draw((ctx, vw, vh) => {
				ctx.beginPath()
				ctx.moveTo(prev.x * 300, vh - prev.y * 30)
				ctx.lineTo(x * 300, vh - y * 30);
				ctx.strokeStyle = '#f008';
				ctx.stroke();
				ctx.closePath();

				ctx.beginPath()
				ctx.arc(x * 300, vh - y * 30, 5, 0, Math.PI * 2);
				ctx.fillStyle = '#f008';
				ctx.fill();
				ctx.closePath();
			});

			// 예상 값
			const prevPredictedY = this.w * prev.x + this.b;
			this.canvasManager.draw((ctx, vw, vh) => {
				ctx.beginPath()
				ctx.moveTo(prev.x * 300, vh - prevPredictedY * 30)
				ctx.lineTo(x * 300, vh - (predictedY * 30));
				ctx.strokeStyle = '#00f8';
				ctx.stroke();
				ctx.closePath();

				ctx.beginPath()
				ctx.arc(x * 300, vh - (predictedY * 30), 5, 0, Math.PI * 2);
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