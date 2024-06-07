
export const calculateChart = (x: number, startValue: number, curveFactor: number, endFactor: number, logBase: number) => {
    const logFrom = (curveFactor + x) / curveFactor;

    const logValue = Math.log(logFrom) / Math.log(logBase)

    return startValue + logValue * endFactor
}