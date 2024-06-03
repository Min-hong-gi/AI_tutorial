// 평균 제곱 오차
export function meanSquaredError(y: Array<number>, y_hat: Array<number>) {
	let totalLoss = 0;
	y.forEach((x, i) => {
		totalLoss += y_hat[i] - x;
	})
	return totalLoss / y.length;
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
		for (let j = 0; j < K; j++) {
			loss += y[i][j] * Math.log(y_hat[i][j]);
		}
	}
	return -loss / N;
}