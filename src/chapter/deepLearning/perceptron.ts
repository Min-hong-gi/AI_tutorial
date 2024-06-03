export function perceptron({ activationFunction, lossFunction, errorFunction, optimizer, learningRate = 1 }: PerceptronLayerInitType) {
    return function <T, K>({ originData, train, weights, bias }: PerceptronTrainType) {
        const trainValue: { x: number[]; y: number[]; }[] = structuredClone(train || originData);
        let totalLoss = 0;
        const predictions: number[][] = [];

        const numClasses = weights.length;
        const numFeatures = weights[0].length;

        
        let gradients_w: Array<Array<number>> = Array.from({ length: numClasses }, () => new Array(numFeatures).fill(0));
        let gradients_b: Array<number> = new Array(bias.length).fill(0);
        
        // 결과 계산
        for (let i = 0; i < trainValue.length; i++) {
            const z = weights.map((class_weight, k) => {
                return class_weight.reduce((sum, weight, j) => {
                    return sum + (weight * trainValue[i].x[j] + bias[k])
                }, 0)
            });
            const h = activationFunction(z);
            predictions.push(h);

            for (let j = 0; j < numClasses; j++) {
                const error = errorFunction(h[j] - trainValue[i].y[j]);
                //기울기 반영
                for (let k = 0; k < numFeatures; k++) {
                    gradients_w[j][k] += error * trainValue[i].x[k];
                }
                gradients_b[j] += error;
            }
            if (lossFunction) {
                totalLoss += lossFunction(originData[i].y, h);
            }
        }
        
        // 가중치 및 편향 업데이트
        for (let j = 0; j < numClasses; j++) {
            for (let i = 0; i < numFeatures; i++) {
                weights[j][i] -= optimizer(learningRate, gradients_w[j][i]);
            }
            bias[j] -= optimizer(learningRate, gradients_b[j]);
        }

        return {
            weights,
            bias,
            totalLoss,
            predictions,
            train: trainValue,
            gradients_w,
            gradients_b,
            originData,
        }
    }
}
