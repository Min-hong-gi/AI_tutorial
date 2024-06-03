// 계단 함수
export function step(x: number[]) {
	return x.map(x=>{
		return x > 0 ? 1 : 0;
	})
}
// 시그모이드
export function sigmoid(x: number[]) {
	return x.map(x=>{
		return 1 / (1 + Math.exp(-x));
	})
}
// 렐루
export function reLU(x: number[]) {
	return x.map(x=>{
		return Math.max(x, 0)
	});
}

// 리키 렐루
export function leakyReLU(x: number[], a = 0.01) {
	return x.map(x=>{
		return Math.max(x, a * x);
	})
}
