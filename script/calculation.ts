import * as Type from "./type";
import * as Settings from "./settings";
import config from "@resource/config.json";
export const isRegularNumber = (value: any): value is number =>
    "number" === typeof value && isFinite(value);
export const nanToNull = (value: number): number | null =>
    isNaN(value) ? null : value;
export interface NumberFormatOptionsOthers
{
    notation?: "standard" | "scientific" | "engineering" | "compact";
    compactDisplay?: "short" | "long";
    useGrouping?: "always" | "min2" | "auto" | true | false;
    signDisplay?: "auto" | "always" | "exceptZero" | "negative" | "never";
}
export type NumberFormatOptions = Intl.NumberFormatOptions & NumberFormatOptionsOthers;
export type LocalesArgument = Parameters<typeof Number.prototype.toLocaleString>[0];
// これらの型定義は VS Code エディタ上でのエラー避けの為。コンパイル自体は以下の型で通る。
// EN: These type definitions are for avoiding errors in the VS Code editor. The compilation itself can proceed with the following types.
// export type NumberFormatOptions = Intl.NumberFormatOptions;
// export type LocalesArgument = Intl.LocalesArgument;
export const sec = (x: number) => 1 / Math.cos(x);
export const csc = (x: number) => 1 / Math.sin(x);
export const cot = (x: number) => 1 / Math.tan(x);
export const asec = (x: number) => Math.acos(1 / x);
export const acsc = (x: number) => Math.asin(1 / x);
export const acot = (x: number) => Math.atan2(1, x);
export const asin_i = (x: number) =>
    1E15 < x ? -Math.log(2 *x): // 下の方が正規の計算式。ただ、x が大きい場合に x * x でオーバーフローするので、x が大きい場合はこちらの近似式を使う。 number 型の仮数部の精度的に 1E10 以上で同じ計算結果になる。(マージンをとって 1E15 にしている)
    1 <= x ? -Math.log(x + Math.sqrt(x * x - 1)):
        0;
export const sin_half_pi_i = (x: number) =>
{
    switch(true)
    {
    case 0 <= x:
        return NaN;
    case x <= -35: // -35 ≈ arcsin_i(1E15)
        return Math.exp(-x) /2;
    default:
        const exp = Math.exp(-x);
        return (exp +1 / exp) /2;
    }
};
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
export const parseFloat = Number.parseFloat;
export const isFinite = Number.isFinite;
export const isNaN = Number.isNaN;
export const isSafeInteger = Number.isSafeInteger;
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
export const SafeOr1 = (value: number): number =>
    0 === value %2 ? value +1: value;
export const roundE = (value: number, exponent: number = -6): number =>
{
    // factor が 1 より小さい値になると number 型では正確に表現できず計算誤差が生じるため、factor が必ず 1 以上の値になる形で処理する。
    const integerExponent = Math.round(exponent);
    if (0 <= integerExponent)
    {
        const factor = Math.pow(10, integerExponent);
        return Math.round(value /factor) *factor;
    }
    else
    {
        const factor = Math.pow(10, -integerExponent);
        return Math.round(value *factor) /factor;
    }
};
export const getNamedNumberValue = (value: Type.NamedNumber): number =>
{
    switch (value)
    {
        case "phi": return Type.phi;
        case "e": return Math.E;
        case "pi": return Math.PI;
        case "tau": return Type.tau;
        default: return value;
    }
};
export const getThreeDigitSeparatorSymbol = (locales?: LocalesArgument): string =>
{
    switch (Settings.getThreeDigitSeparator())
    {
        case "none": return "";
        case "custom": return (1111).toLocaleString(locales).replace(new RegExp((1).toLocaleString(locales), "g"), "");
        case "thin-space": return config.symbols.thinSpace;
    }
};
export const groupDigits = (value: string, locales?: LocalesArgument): string =>
{
    let [ mantissa, exponentPart ] = value.split(/e/i);
    if (undefined !== exponentPart && Settings.getExponentMultipleOfThree())
    {
        const exponentValue = parseInt(exponentPart, 10);
        let adjustment = exponentValue % 3;
        if (0 !== adjustment)
        {
            if (exponentValue < 0)
            {
                adjustment += 3;
            }
            const adjustedExponent = exponentValue - adjustment;
            const adjustedMantissa = parseFloat(mantissa) * Math.pow(10, adjustment);
            mantissa = adjustedMantissa.toFixed(mantissa.includes(".") ? mantissa.split(".")[1].length -adjustment: 0);
            exponentPart = adjustedExponent.toString();
        }
    }
    const separatorSymbol = getThreeDigitSeparatorSymbol();
    // const resultExponentPart = exponentPart ? `${separatorSymbol}E${exponentPart.replace(/^(\d+)/, "+$1")}` : "";
    const resultExponentPart = exponentPart ?
        (
            "e" === Settings.getExponentFormat() ?
                `${config.symbols.exponent}${exponentPart.replace(/^(\d+)/, "+$1")}`:
                `${config.symbols.multiplication}10${config.symbols.power}${exponentPart}`
        ):
        "";
    if ("" === separatorSymbol)
    {
        return `${mantissa}${resultExponentPart}`;
    }
    else
    {
        const floatPointSymbol = (1.1).toLocaleString(locales).replace(new RegExp((1).toLocaleString(locales), "g"), "");
        const [ integerPart, fractionalPart ] = mantissa.split(floatPointSymbol);
        const groupedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separatorSymbol);
        if (undefined === fractionalPart)
        {
            return `${groupedIntegerPart}${resultExponentPart}`;
        }
        else
        {
            const groupedFractionalPart = fractionalPart.replace(/(\d{3})(?=\d)/g, `$1${separatorSymbol}`);
            return `${groupedIntegerPart}${floatPointSymbol}${groupedFractionalPart}${resultExponentPart}`;
        }
    }
};
export const getNamedNumberLabel = (value: Type.NamedNumber, locales?: LocalesArgument, options?: NumberFormatOptions): string =>
{
    switch (value)
    {
        case "phi": return "φ";
        case "e": return "e";
        case "pi": return "π";
        case "tau": return "τ";
        default:
        {
            const useGrouping = false;
            let result = groupDigits(value.toLocaleString(locales, { ...options, useGrouping, }), locales);
            // const exponentMatch = result.match(/e([+-]?\d+)$/i);
            // if (exponentMatch)
            // {
            //     const exponent = parseInt(exponentMatch[1], 10);
            //     const base = result.slice(0, exponentMatch.index);
            //     result = `${base}×10^${exponent >= 0 ? "+" : ""}${exponent}`;
            // }
            return result;
        }
    }
};
export const diffRate = (a: number, b: number): number =>
{
    if (0 === a && 0 === b)
    {
        return 0;
    }
    else
    {
        return Math.abs(a -b) /Math.max(Math.abs(a), Math.abs(b));
    }
};
export const isNearlyEqual = (a: number, b: number, epsilon: number = 1E-6): boolean =>
    Math.abs(diffRate(a, b)) <= epsilon;
