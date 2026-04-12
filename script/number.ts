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
export const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
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
export const isInteger = Number.isInteger;
export const isPrimeNumber = (value: number): boolean =>
{
    if (Number.isInteger(value) && 2 <= value && value <= MAX_SAFE_INTEGER)
    {
        if (2 === value || 3 === value)
        {
            return true;
        }
        if (0 === value %2 || 0 === value %3)
        {
            return false;
        }
        const sqrt = Math.sqrt(value);
        const primeNumbers =
        [
            //2, 3,
            5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47,
            53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
        ];
        for(const prime of primeNumbers)
        {
            if (sqrt < prime)
            {
                return true;
            }
            if (0 === value %prime)
            {
                return false;
            }
        }
        for(let i = 101; i <= sqrt; i += 2)
        {
            if (0 === value % i)
            {
                return false;
            }
        }
        return true;
    }
    return false;
};
export const System = Number;
