import { leakyReLU, reLU, sigmoid } from "../../util/active.core.js";
import { binaryCrossEntropy } from "../../util/loss.core.js";
import { gradientDescent } from "../../util/optimizer.core.js";
import { normalize } from "../../util/util.core.js";
import { feeForward, layerProcessing } from "../../util/util.js";
import { Chapter } from "../chapter.class.js";
import { perceptron } from "../deepLearning/perceptron.js";

// 선형 회귀
// 선형 회귀
export class PerceptronLogisticRegression extends Chapter {
	// 학습률
	private static learningRate = 0.1;

	private lerningdata = [
		{ x: [5], y: [0] },
		{ x: [10], y: [0] },
		{ x: [15], y: [0] },
		{ x: [20], y: [0] },
		{ x: [25], y: [0] },
		{ x: [30], y: [0] },
		{ x: [35], y: [0] },
		{ x: [40], y: [0] },
		{ x: [45], y: [0] },
		{ x: [50], y: [0] },
		{ x: [55], y: [0] },
		{ x: [60], y: [1] },
		{ x: [65], y: [1] },
		{ x: [70], y: [1] },
		{ x: [75], y: [1] },
		{ x: [80], y: [1] },
		{ x: [85], y: [1] },
		{ x: [90], y: [1] },
		{ x: [95], y: [1] },
		{ x: [100], y: [1] },
	];

	private w: number = Math.random() * 0.1;
	private b: number = Math.random() * 0.1;

	preprocessing(): void {
		const scale = normalize(this.lerningdata);
		this.lerningdata = this.lerningdata.map(x => {
			scale.forEach((scale, i) => {
				x.x[i] /= scale;
			});
			return x;
		});
	}

	model(epoch: number) {
		// 학습 계층

		const initLayer = perceptron({
			// 활성화 함수
			activationFunction: reLU,
			// 가중치 반영 함수
			errorFunction: (error) => {
				return error;
			},
			optimizer: gradientDescent,
			// 학습률
			learningRate: PerceptronLogisticRegression.learningRate,
		});
		const layer = perceptron({
			// 활성화 함수
			activationFunction: leakyReLU,
			// 가중치 반영 함수
			errorFunction: (error) => {
				return error;
			},
			optimizer: gradientDescent,
			// 학습률
			learningRate: PerceptronLogisticRegression.learningRate,
		});

		const outLayer = perceptron({
			// 활성화 함수
			activationFunction: sigmoid,
			// 손실 함수
			lossFunction: binaryCrossEntropy,
			// 에러 함수
			errorFunction: (error) => {
				return error;
			},
			optimizer: gradientDescent,
			// 학습률
			learningRate: PerceptronLogisticRegression.learningRate,
		});

		const result = feeForward(
			outLayer.bind(null, {
				// 학습 데이터
				originData: this.lerningdata,
				// 가중치
				weights: [[this.w]],
				// 편향
				bias: [this.b],
			}),
			// layerProcessing(layer),
			// layerProcessing(outLayer),
		);

		this.w = result.weights[0][0];
		this.b = result.bias[0];

		return result;
	}

	draw(epoch: number) {
		this.canvasManager.draw((ctx, vw, vh) => {
			ctx.clearRect(0, 0, vw, vh);
		});

		const result = this.model(epoch);
		const predicted = result.predictions;
		let prev = this.lerningdata[0];
		let prevPredictedY = predicted[0][0];

		this.lerningdata.forEach((data, i) => {
			const x = data.x[0];
			const y = data.y[0];

			this.canvasManager.draw((ctx, vw, vh) => {
				// 실제값
				ctx.beginPath();
				ctx.moveTo(300 + prev.x[0] * 300, (vh - 300) - prev.y[0] * 200);
				ctx.lineTo(300 + x * 300, (vh - 300) - (y * 200));
				ctx.strokeStyle = '#f00';
				ctx.stroke();
				ctx.closePath();

				ctx.beginPath();
				ctx.arc(300 + x * 300, (vh - 300) - (y * 200), 5, 0, Math.PI * 2);
				ctx.fillStyle = '#f00';
				ctx.fill();
				ctx.closePath();

				// 예상 값
				ctx.beginPath();
				ctx.moveTo(300 + prev.x[0] * 300, (vh - 300) - prevPredictedY * 200);
				ctx.lineTo(300 + x * 300, (vh - 300) - (predicted[i][0] * 200));
				ctx.strokeStyle = '#00f';
				ctx.stroke();
				ctx.closePath();

				ctx.beginPath();
				ctx.arc(300 + x * 300, (vh - 300) - (predicted[i][0] * 200), 5, 0, Math.PI * 2);
				ctx.fillStyle = '#00f';
				ctx.fill();
				ctx.closePath();
			});
			prev = data;
			prevPredictedY = predicted[i][0];
		});

		// 현재 진행 상황
		this.canvasManager.draw((ctx, vw, vh) => {
			const msg = `Epoch: ${epoch} Loss: ${result.totalLoss.toFixed(5)}`;
			ctx.beginPath();
			ctx.textBaseline = 'middle';
			ctx.fillStyle = '#000';
			ctx.font = '15px Arial';
			ctx.fillText(msg, 10, 30);
			ctx.closePath();

			const p = `W: ${this.w.toFixed(5)} B: ${this.b.toFixed(5)}`;
			ctx.beginPath();
			ctx.textBaseline = 'middle';
			ctx.fillStyle = '#000';
			ctx.font = '15px Arial';
			ctx.fillText(p, 10, 60);
			ctx.closePath();
		});
	}
}
