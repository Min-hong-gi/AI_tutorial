// 평균 제곱 오차
export function MSE(b: number, w: number, data: Array<{ x: number, y: number }>) {
	let totalLoss = 0;
	for (let i = 0; i < data.length; i++) {
		const x = data[i].x;
		const y = data[i].y;
		const predictedY = b + w * x;
		totalLoss += Math.pow(predictedY - y, 2);
	}
	return totalLoss / data.length;
}

// 이진 분류
export function binaryCrossEntropy(y: Array<number>, y_hat: Array<number>) {
	const N = y.length;
	let loss = 0;
	for (let i = 0; i < N; i++) {
		loss += y[i] * Math.log(y_hat[i]) + (1 - y[i]) * Math.log(1 - y_hat[i]);
	}
	return -loss / N;
}
// 다중 클래스 분류
export function multiClassCrossEntropy(y: Array<Array<number>>, y_hat: Array<Array<number>>) {
	const N = y.length;
	const K = y[0].length;
	let loss = 0;
	for (let i = 0; i < N; i++) {
		for (let j = 0; i < K; j++) {
			loss += y[i][j] * Math.log(y_hat[i][j]);
		}
	}
	return -loss / N;
}

export function sigmoid(x: number) {
	return 1 / (1 + Math.exp(-x));
}

export function tokenizer(data: Array<string>) {
	let map: { [k: string]: number } = {};
	let result: Array<number> = [];
	let last = 0;
	data.forEach(x => {
		if (typeof map[x] == 'number') {
		} else {
			map[x] = last;
			last++;
		}
		result.push(map[x]);
	});
	return result;
}

// 데이터 정규화 함수
export function normalize(data: Array<{ x: Array<number>, y?: number }>) {
	const val: Array<number> = [];
	for (let i = 0; i < data[0].x.length; i++) {
		val.push(Math.max(...data.map(d => d.x[i])))
	}
	return val;
}