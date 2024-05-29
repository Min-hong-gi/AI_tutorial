import { binaryCrossEntropy, normalize, tokenizer, sigmoid } from "../../util/util.core.js";
import { Chapter } from "../chapter.class.js";

export class LogisticRegression extends Chapter {
	// 학습률
	private static learningRate = 1;

	// 학습용 데이터 선언
	data: Array<{ x: Array<number>, y: any }> = [
		{ x: [0], y: "불합격" },
		{ x: [5], y: "불합격" },
		{ x: [10], y: "불합격" },
		{ x: [20], y: "불합격" },
		{ x: [30], y: "불합격" },
		{ x: [40], y: "불합격" },
		{ x: [50], y: "불합격" },
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
	get Y() {
		return this.data.reduce((p, c) => {
			p.push(c.y);
			return p;
		}, [] as Array<any>);
	}
	weights = new Array(this.X[0].length).fill(Math.random() * 0.1); // 각 특징에 대한 가중치
	b = Math.random() * 0.1; // 각 특징에 대한 편향
	model() {
		const X = this.X;
		const Y = this.Y;

		let n = X[0].length;
		let m = X.length;

		const gradient = new Array(n).fill(0); // 각 특징에 대한 가중치의 기울기
		let gradient_b = 0 // 각 특징에 대한 편향의 기울기
		for (let i = 0; i < m; i++) {
			// 가중치와 편향을 통한 보정
			let z = this.weights.reduce((sum, weight, j) => sum + (weight * X[i][j] + this.b), 0);
			// sigmoid를 통한 0~1 정규화
			let h = sigmoid(z);
			
			//기울기 반영
			for (let j = 0; j < n; j++) {
				gradient[j] += (h - Y[i]) * X[i][j];
			}
			gradient_b += (h - Y[i]);
		}
		for (let j = 0; j < n; j++) {
			this.weights[j] -= (LogisticRegression.learningRate * gradient[j]) / m;
			this.b -= (LogisticRegression.learningRate * gradient_b) / m;
		}
	}
	// 예측 함수
	predict(x: Array<number>): number {
		x = x.map((d, i) => d / this.scale[i]);
		let z = this.weights.reduce((sum, weight, j) => sum +( weight * x[j] + this.b), 0);
		return sigmoid(z);
	}
	scale: Array<number> = new Array(this.X[0].length).fill(1);
	preprocessing() {
		tokenizer(this.Y).forEach((x, i) => {
			this.data[i].y = x;
		});
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
		let hs: Array<number> = [];
		// 데이터 포인트 그리기
		this.canvasManager.draw((ctx, vw, vh) => {
			this.data.forEach(point => {
				ctx.beginPath();
				ctx.arc(300 + (point.x[0]) * 300, (vh - 100) - (point.y * 300), 5, 0, Math.PI * 2);
				ctx.fillStyle = '#f00';
				ctx.fill();
				ctx.closePath();

				let z = this.weights.reduce((sum, weight, j) => sum + (weight * point.x[j] + this.b), 0);
				const h = sigmoid(z);
				hs.push(h);
				ctx.beginPath();
				ctx.arc(300 + (point.x[0]) * 300, (vh - 100) - (h * 300), 5, 0, Math.PI * 2);
				ctx.fillStyle = '#00f';
				ctx.fill();
				ctx.closePath();
			});
		});
		const totalLoss = binaryCrossEntropy(this.Y, hs);

		// 현재 진행 상황
		this.canvasManager.draw((ctx, vw, vh) => {
			const msg = `Epoch: ${epoch} TotalLoss: ${totalLoss}`;
			ctx.beginPath();
			ctx.textBaseline = 'middle';
			ctx.fillStyle = '#000'
			ctx.font = '15px Arial';
			ctx.fillText(msg, 10, 30)
			ctx.closePath();

			const msg2 = `Weight: ${JSON.stringify(this.weights)} Bias: ${JSON.stringify(this.b)}`;
			ctx.beginPath();
			ctx.textBaseline = 'middle';
			ctx.fillStyle = '#000'
			ctx.font = '15px Arial';
			ctx.fillText(msg2, 10, 60)
			ctx.closePath();
		});
	}
}