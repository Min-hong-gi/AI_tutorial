export function gradientDescent(param: number, learningRate: number, gradient: number) {
	return param - learningRate * gradient;
}
export function momentumGradientDescent(momentum: number) {
	let velocity = 0;
	return function(param: number, learningRate: number, gradient: number) {
		velocity = (momentum * velocity) - (learningRate * gradient);
		return param + velocity;
	}
}