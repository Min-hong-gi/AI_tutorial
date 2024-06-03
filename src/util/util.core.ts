// 토큰화
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
export function normalize(data: Array<{ x: Array<number> }>) {
	const val: Array<number> = [];
	for (let i = 0; i < data[0].x.length; i++) {
		val.push(Math.max(...data.map(d => d.x[i])))
	}
	return val;
}

// 소프트맥스 함수
export function softmax(z: number[]): number[] {
	const maxZ = Math.max(...z);
	const expZ = z.map(value => Math.exp(value - maxZ));
	const sumExpZ = expZ.reduce((a, b) => a + b, 0);
	return expZ.map(value => value / sumExpZ);
}

// One-Hot 인코딩 함수
export function oneHotEncode(values: number[], size: number = 1): number[][] {
	return values.map(value => {
		let arr = new Array(size).fill(0);
		arr[value] = 1;
		return arr;
	});
}