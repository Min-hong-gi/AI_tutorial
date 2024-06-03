type PerceptronLayerInitType = {
	activationFunction: (sum_weights: number[]) => number[],
	lossFunction?: (
		y: number[],
		y_hat: number[]
	) => number,
	errorFunction: (error: number) => number,
	optimizer: (param: number, learningRate: number, gradient: number) => number,
	learningRate?: number
}

type PerceptronTrainType = {
	train?: { x: number[], y: number[] }[],
	weights: number[][],
	bias: number[],
	originData: { x: number[], y: number[] }[],
}