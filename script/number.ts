import config from "@resource/config.json";
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
export const primeNumbers =
[
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47,
    53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
    // Values after this point are generated dynamically up to config.model.primeNumber.cacheSize.
];
export const isPrimeNumber = (value: number): boolean =>
{
    if (Number.isInteger(value) && 2 <= value && value <= MAX_SAFE_INTEGER)
    {
        const sqrt = Math.sqrt(value);
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
        for(let i = primeNumbers[primeNumbers.length - 1] + 2; i <= sqrt; i += 2)
        {
            if (primeNumbers.length < config.model.primeNumber.cacheSize)
            {
                if (isPrimeNumber(i))
                {
                    primeNumbers.push(i);
                }
                else
                {
                    continue;
                }
            }
            if (0 === value % i)
            {
                return false;
            }
        }
        return true;
    }
    return false;
};
export const primeDecomposition = (value: number): number[] =>
{
    const result: number[] = [];
    if (Number.isInteger(value) && 2 <= value && value <= MAX_SAFE_INTEGER)
    {
        let remainder = value;
        for(const prime of primeNumbers)
        {
            if (prime * prime > remainder)
            {
                break;
            }
            while(0 === remainder %prime)
            {
                result.push(prime);
                remainder /= prime;
            }
        }
        for(let i = primeNumbers[primeNumbers.length - 1] + 2; i * i <= remainder; i += 2)
        {
            if (primeNumbers.length < config.model.primeNumber.cacheSize)
            {
                if (isPrimeNumber(i))
                {
                    primeNumbers.push(i);
                }
                else
                {
                    continue;
                }
            }
            while(0 === remainder % i)
            {
                result.push(i);
                remainder /= i;
            }
        }
        if (1 < remainder)
        {
            result.push(remainder);
        }
    }
    return result;
}
export const System = Number;
export const SafeOr1 = (value: number): number =>
    0 === value %2 ? value +1: value;
export const roundE = (value: number, exponent: number = -6): number =>
{
    const factor = Math.pow(10, -exponent);
    return Math.round(value *factor) /factor;
};
