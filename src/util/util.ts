import { perceptron } from "../chapter/deepLearning/perceptron";

/**
 * Feed Forward Neural Network
 * @param fns 
 * @returns 
*/
export function feeForward<T>(fn: () => T): T;
export function feeForward<T, K>(fn: () => T, ...fns: Array<(args?: any) => K>): K
export function feeForward<T, K>(fn: () => T, ...fns: Array<(args?: any) => K>): K | T {
	let param: any = fn();
	for (let i = 0; i < fns.length; i++) {
		param = fns[i](param);
	}
	return param;
}

/**
 * Recurrent Neural Network
 * @param fns
 * @returns 
 */
export function recurrent(t: number = 1) {
	function forward<T>(fn: () => T): T;
	function forward<T, K>(fn: () => T, ...fns: Array<(args?: any) => K>): K
	function forward<T, K>(fn: () => T, ...fns: Array<(args?: any) => K>): K | T {
		let param: any = fn();
		for(let i = 0; i < t;i++) {
			for (let i = 0; i < fns.length; i++) {
				param = fns[i](param);
			}
		}
		return param;
	}
	
	return forward;
}

/**
 * 이전 레이어의 값을 다음 레이어로 전달하기 위한 유틸리티 함수
 * @param fix_layer 
 * @returns 
 */
export function layerProcessing(fix_layer: (...args: any) => ReturnType<ReturnType<typeof perceptron>>) {
	return (result: ReturnType<typeof fix_layer>) => {
		return fix_layer({
			...result,
			train: result.train.map((x, i) => {
				x.y = result.predictions[i];
				return x;
			}),
		});
	}
}