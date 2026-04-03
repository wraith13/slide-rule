export const parse = (value: string | undefined): number | undefined =>
{
    if (undefined !== value)
    {
        const result = parseFloat(value);
        if (! isNaN(result))
        {
            return result;
        }
    }
    return undefined;
};
export const orUndefined = (value: any): number | undefined =>
    "number" === typeof value ? value : undefined;
// export const MIN_VALUE = Number.MIN_VALUE;
// export const MAX_VALUE = Number.MAX_VALUE;
// export const MIN_VALUE = 1e-300;
// export const MAX_VALUE = 1e300;
export const floorTo1Mantissa = (n: number): number =>
{
    if (n === 0)
    {
        return 0;
    }
    else
    {
        const sign = Math.sign(n);
        const abs = Math.abs(n);
        const exp = Math.floor(Math.log10(abs));
        return sign * Math.pow(10, exp);
    }
};
export const ceilTo1Mantissa = (n: number): number =>
{
    if (n === 0)
    {
        return 0;
    }
    else
    {
        const sign = Math.sign(n);
        const abs = Math.abs(n);
        const exp = Math.ceil(Math.log10(abs));
        return sign * Math.pow(10, exp);
    }
}
// This is the minimum value achieved by sacrificing the mantissa, so values around this range have low precision and are not practical for use.
//export const MIN_VALUE = ceilTo1Mantissa(Number.MIN_VALUE);
export const MAX_VALUE = floorTo1Mantissa(Number.MAX_VALUE);
export const MIN_VALUE = 1 / MAX_VALUE;
export const clamp = (value: number): number =>
    Math.max(Math.min(value, MAX_VALUE), MIN_VALUE);
export const minMax = (value: number | undefined): number =>
    clamp(value ?? MAX_VALUE);
export const maxMin = (value: number | undefined): number =>
    clamp(value ?? MIN_VALUE);
