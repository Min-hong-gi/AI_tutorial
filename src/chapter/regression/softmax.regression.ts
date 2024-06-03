import { multiClassCrossEntropy } from "../../util/loss.core.js";
import { normalize, oneHotEncode, softmax, tokenizer } from "../../util/util.core.js";
import { Chapter } from "../chapter.class.js";

export class SoftmaxRegression extends Chapter {
	// 학습률
	private static learningRate = 1;

	// 학습용 데이터 선언
	data: Array<{ x: Array<number>, y: any }> = [
		{ x: [0], y: "불합격" },
		{ x: [5], y: "불합격" },
		{ x: [10], y: "불합격" },
		{ x: [20], y: "불합격" },
		{ x: [30], y: "재시험" },
		{ x: [40], y: "재시험" },
		{ x: [50], y: "재시험" },
		{ x: [60], y: "합격" },
		{ x: [70], y: "합격" },
		{ x: [80], y: "합격" },
		{ x: [90], y: "합격" },
	];
	get X() {
		return this.data.reduce((p, c) => {
			p.push(c.x);
			return p;
		}, [] as Array<Array<number>>);
	}
	get Y(): Array<any> {
		return this.data.reduce((p, c) => {
			p.push(c.y);
			return p;
		}, [] as Array<Array<number>>);
	}
	weights: Array<Array<number>> = [];
	b: Array<number> = [];
	model() {
		const X = this.X;
		const Y = this.Y;

		let n = X[0].length;
		let m = X.length;

		const numClasses = this.weights.length;
		const numFeatures = this.weights[0].length;

		const gradients = Array.from({ length: numClasses }, () => (new Array(numFeatures).fill(0)));
		const gradients_b = new Array(numClasses).fill(0);

		for (let i = 0; i < m; i++) {
			// 가중치와 편향을 통한 보정
			const z: number[] = [];
			for (let k = 0; k < numClasses; k++) {
				z.push(this.weights[k].reduce((sum, weight, j) => sum + (weight * X[i][j] + this.b[k]), 0));
			}
			// sigmoid를 통한 0~1 정규화
			let h = softmax(z);

			//기울기 반영
			for (let k = 0; k < numClasses; k++) {
				for (let j = 0; j < numFeatures; j++) {
					gradients[k][j] += (h[k] - Y[i][k]) * X[i][j];
				}
				gradients_b[k] += (h[k] - Y[i][k]);
			}
		}
		for (let k = 0; k < numClasses; k++) {
			for (let j = 0; j < numFeatures; j++) {
				this.weights[k][j] -= (SoftmaxRegression.learningRate * gradients[k][j]) / m;
			}
			this.b[k] -= (SoftmaxRegression.learningRate * gradients_b[k]) / m;
		}
	}
	// 예측 함수
	predict(x: Array<number>): number {
		x = x.map((d, i) => d / this.scale[i]);
		// 가중치와 편향을 통한 보정
		const z: number[] = [];
		for (let k = 0; k < this.weights.length; k++) {
			z.push(this.weights[k].reduce((sum, weight, j) => sum + (weight * x[j] + this.b[k]), 0));
		}
		let h = softmax(z);
		return h.indexOf(Math.max(...h));
	}
	scale: Array<number> = new Array(this.X[0].length).fill(1);
	preprocessing() {
		const token = tokenizer(this.Y)
		token.forEach((x, i) => {
			this.data[i].y = x;
		});
		this.data.forEach(d => {
			d.y = oneHotEncode([d.y], 3)[0];
		});
		const numClasses = Math.max(...token) + 1;
		const numFeatures = this.X[0].length;

		this.weights = Array.from({ length: numClasses }, () => new Array(numFeatures).fill(Math.random() * 0.1));
		this.b = new Array(numClasses).fill(Math.random() * 0.1);

		this.scale = normalize(this.data);
		this.data = this.data.map(d => ({ x: this.scale.map((x, i) => (d.x[i] / x)), y: d.y }))
	}
	printData(): void {
		this.canvasManager.draw((ctx, vw, vh) => {
			this.data.forEach((x, i) => {
				ctx.beginPath();
				ctx.textBaseline = 'middle';
				ctx.fillStyle = '#000'
				ctx.font = '15px Arial';
				ctx.fillText(`x: ${x.x}\t\t\ty: ${x.y}`, vw / 2 + vw / 3, 30 * (i + 1));
				ctx.closePath();
			})
		});
	}
	draw(epoch: number) {
		this.canvasManager.draw((ctx, vw, vh) => {
			ctx.beginPath();
			ctx.fillStyle = '#fff5'
			ctx.fillRect(0, 0, vw, vh);
			ctx.beginPath();
		});
		let hs: Array<Array<number>> = [];
		// 데이터 포인트 그리기
		this.canvasManager.draw((ctx, vw, vh) => {

			ctx.beginPath();
			ctx.fillStyle = '#00f';
			ctx.fillText("불합격", 310, vh/2);
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = '#0ff';
			ctx.fillText("재시험", 420, vh/2);
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = '#003';
			ctx.fillText("합격", 540, vh/2);
			ctx.closePath();

			this.data.forEach((point, i) => {
				const prev = this.data[Math.max(i - 1, 0)];
				const prevZ: number[] = [];
				for (let k = 0; k < this.weights.length; k++) {
					prevZ.push(this.weights[k].reduce((sum, weight, j) => sum + (weight * prev.x[j] + this.b[k]), 0));
				}
				const prevH = softmax(prevZ);


				const z: number[] = [];
				for (let k = 0; k < this.weights.length; k++) {
					z.push(this.weights[k].reduce((sum, weight, j) => sum + (weight * point.x[j] + this.b[k]), 0));
				}
				let h = softmax(z);
				hs.push(h);

				ctx.beginPath();
				ctx.arc(300 + (point.x[0]) * 300, (vh - 100) - (h[0] * 200), 5, 0, Math.PI * 2);
				ctx.fillStyle = '#00f';
				ctx.fill();
				ctx.closePath();

				ctx.beginPath();
				ctx.moveTo(300 + (prev.x[0]) * 300, (vh - 100) - (prevH[0] * 200));
				ctx.lineTo(300 + (point.x[0]) * 300, (vh - 100) - (h[0] * 200));
				ctx.strokeStyle = '#00f';
				ctx.stroke();
				ctx.closePath();

				ctx.beginPath();
				ctx.arc(300 + (point.x[0]) * 300, (vh - 100) - (h[1] * 200), 5, 0, Math.PI * 2);
				ctx.fillStyle = '#0ff';
				ctx.fill();
				ctx.closePath();

				ctx.beginPath();
				ctx.moveTo(300 + (prev.x[0]) * 300, (vh - 100) - (prevH[1] * 200));
				ctx.lineTo(300 + (point.x[0]) * 300, (vh - 100) - (h[1] * 200));
				ctx.strokeStyle = '#0ff';
				ctx.stroke();
				ctx.closePath();

				ctx.beginPath();
				ctx.arc(300 + (point.x[0]) * 300, (vh - 100) - (h[2] * 200), 5, 0, Math.PI * 2);
				ctx.fillStyle = '#003';
				ctx.fill();
				ctx.closePath();

				ctx.beginPath();
				ctx.moveTo(300 + (prev.x[0]) * 300, (vh - 100) - (prevH[2] * 200));
				ctx.lineTo(300 + (point.x[0]) * 300, (vh - 100) - (h[2] * 200));
				ctx.strokeStyle = '#003';
				ctx.stroke();
				ctx.closePath();

			});
		});
		const totalLoss = multiClassCrossEntropy(this.Y, hs);

		// 현재 진행 상황
		this.canvasManager.draw((ctx, vw, vh) => {
			let msg = `Epoch: ${epoch} TotalLoss: ${totalLoss}`;
			ctx.beginPath();
			ctx.textBaseline = 'middle';
			ctx.fillStyle = '#000'
			ctx.font = '15px Arial';
			ctx.fillText(msg, 10, 30)
			ctx.closePath();

			msg = `Weight: [`;
			ctx.beginPath();
			ctx.textBaseline = 'middle';
			ctx.fillStyle = '#000'
			ctx.font = '15px Arial';
			ctx.fillText(msg, 10, 60)
			ctx.closePath();
			for (let i = 0; i < this.weights.length; i++) {
				msg = `${JSON.stringify(this.weights[i])}, `;
				ctx.beginPath();
				ctx.textBaseline = 'middle';
				ctx.fillStyle = '#000'
				ctx.font = '15px Arial';
				ctx.fillText(msg, 30, i * 30 + 90)
				ctx.closePath();
			}
			msg = `]`;
			ctx.beginPath();
			ctx.textBaseline = 'middle';
			ctx.fillStyle = '#000'
			ctx.font = '15px Arial';
			ctx.fillText(msg, 10, this.weights.length * 30 + 90)
			ctx.closePath();

			msg = `Bias: [`;
			ctx.beginPath();
			ctx.textBaseline = 'middle';
			ctx.fillStyle = '#000'
			ctx.font = '15px Arial';
			ctx.fillText(msg, 10, this.weights.length * 30 + 120)
			ctx.closePath();
			for (let i = 0; i < this.b.length; i++) {
				msg = `${JSON.stringify(this.b[i])}, `;
				ctx.beginPath();
				ctx.textBaseline = 'middle';
				ctx.fillStyle = '#000'
				ctx.font = '15px Arial';
				ctx.fillText(msg, 30, this.weights.length * 30 + 120 + i * 30 + 30)
				ctx.closePath();
			}
			msg = `]`;
			ctx.beginPath();
			ctx.textBaseline = 'middle';
			ctx.fillStyle = '#000'
			ctx.font = '15px Arial';
			ctx.fillText(msg, 10, this.weights.length * 30 + 120 + (this.b.length * 30)+30)
			ctx.closePath();
		});
	}
}