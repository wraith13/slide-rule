import * as Settings from "./settings";
import config from "@resource/config.json";
export const imaginaryUnitSymbol = "𝑖";
export type NamedNumber = number | "phi" | "e" | "pi" | "tau";
export const namedNumberList: NamedNumber[] = [ "phi", "e", "pi", "tau" ];
export const isNamedNumber = (value: unknown): value is "phi" | "e" | "pi" | "tau" =>
    namedNumberList.includes(value as NamedNumber);
export const phi = (1 + Math.sqrt(5)) / 2;
export const tau = 2 * Math.PI;
// phi approximately 1.618033988749895
// e approximately 2.718281828459045
// pi approximately 3.141592653589793
// tau approximately 6.283185307179586
export const getNamedNumberValue = (value: NamedNumber): number =>
{
    switch (value)
    {
        case "phi": return phi;
        case "e": return Math.E;
        case "pi": return Math.PI;
        case "tau": return tau;
        default: return value;
    }
};
export const getNamedNumberLabel = (value: NamedNumber, locales?: LocalesArgument, options?: NumberFormatOptions): string =>
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
export const isRegularNumber = (value: unknown): value is number =>
    "number" === typeof value && isFinite(value);
export const isRegularNumberOrComplex = (value: unknown): value is NumberOrComplex =>
    isNumberOrComplex(value) && isFinite(getRealPart(value)) && isFinite(getImaginaryPart(value));
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
export interface ComplexNumber
{
    real: number;
    imaginary: number;
}
export const isComplexNumber = (value: unknown): value is ComplexNumber =>
    "object" === typeof value && null !== value &&
    "real" in value && "number" === typeof value.real &&
    "imaginary" in value && "number" === typeof value.imaginary;
export type NumberOrComplex = number | ComplexNumber;
export const isNumberOrComplex = (value: unknown): value is NumberOrComplex =>
    "number" === typeof value || isComplexNumber(value);
export const isZero = (value: NumberOrComplex): boolean =>
    0 === getRealPart(value) && 0 === getImaginaryPart(value);
export const isNaN = (value: NumberOrComplex): boolean =>
    Number.isNaN(getRealPart(value)) || Number.isNaN(getImaginaryPart(value));
export const isFinite = (value: NumberOrComplex): boolean =>
    Number.isFinite(getRealPart(value)) && Number.isFinite(getImaginaryPart(value));
export const isRealNumber = (value: NumberOrComplex): boolean =>
    0 === getImaginaryPart(value);
export const regularizeComplexNumber = (value: NumberOrComplex): NumberOrComplex =>
    isRealNumber(value) ? getRealPart(value): value;
export const makeSureComplexNumber = (value: NumberOrComplex): ComplexNumber =>
    "number" === typeof value ? { real: value, imaginary: 0 }: value;
export const getNumberOrNaN = (value: unknown): number =>
    "number" === typeof value ? value: NaN;
export const getRealPart = (value: NumberOrComplex): number =>
    "number" === typeof value ? value: value.real;
export const getImaginaryPart = (value: NumberOrComplex): number =>
    "number" === typeof value ? 0: value.imaginary;
export const addComplexNumbers = (a: NumberOrComplex, b: NumberOrComplex): NumberOrComplex =>
    regularizeComplexNumber
    ({
        real: getRealPart(a) +getRealPart(b),
        imaginary: getImaginaryPart(a) +getImaginaryPart(b),
    });
export const subtractComplexNumbers = (a: NumberOrComplex, b: NumberOrComplex): NumberOrComplex =>
    regularizeComplexNumber
    ({
        real: getRealPart(a) -getRealPart(b),
        imaginary: getImaginaryPart(a) -getImaginaryPart(b),
    });
export const multiplyComplexNumbers = (a: NumberOrComplex, b: NumberOrComplex): NumberOrComplex =>
    regularizeComplexNumber
    ({
        real: (getRealPart(a) *getRealPart(b)) -(getImaginaryPart(a) *getImaginaryPart(b)),
        imaginary: (getRealPart(a) *getImaginaryPart(b)) +(getImaginaryPart(a) *getRealPart(b)),
    });
export const divideComplexNumbers = (a: NumberOrComplex, b: NumberOrComplex): NumberOrComplex =>
{
    const { real: aReal, imaginary: aImaginary } = makeSureComplexNumber(a);
    const { real: bReal, imaginary: bImaginary } = makeSureComplexNumber(b);
    const denominator = (bReal *bReal) +(bImaginary *bImaginary);
    if (0 === denominator)
    {
        throw new Error(`🦋 FIXME: divideComplexNumbers: division by zero`);
    }
    return regularizeComplexNumber
    ({
        real: (aReal *bReal + aImaginary *bImaginary) / denominator,
        imaginary: (aImaginary *bReal - aReal *bImaginary) / denominator,
    });
};
export const negateComplexNumber = (value: NumberOrComplex): NumberOrComplex =>
    regularizeComplexNumber
    ({
        real: -getRealPart(value),
        imaginary: -getImaginaryPart(value),
    });
export const absComplexNumber = (value: NumberOrComplex): number =>
    Math.sqrt(getRealPart(value) *getRealPart(value) + getImaginaryPart(value) *getImaginaryPart(value));
export const complexNumberToString = (value: NumberOrComplex): string =>
{
    const realPart = getRealPart(value);
    const imaginaryPart = getImaginaryPart(value);
    switch(true)
    {
    case 0 === getImaginaryPart(value):
        return `${realPart}`;
    case 0 === getRealPart(value):
        return `${imaginaryPart}${imaginaryUnitSymbol}`;
    default:
        const sign = 0 <= imaginaryPart ? "+" : "-";
        return `${realPart}${sign}${Math.abs(imaginaryPart)}${imaginaryUnitSymbol}`;
    }
};
export const sin = (x: number | ComplexNumber): number =>
{
    const realPart = getRealPart(x);
    const imaginaryPart = getImaginaryPart(x);
    switch(true)
    {
    case 0 === imaginaryPart:
        return Math.sin(realPart);
    case 0 === realPart:
        return Math.sinh(imaginaryPart);
    case Math.PI / 2 === realPart:
        return sin_half_pi_i(imaginaryPart);
    default:
        return NaN;
    }
}
export const cos = (x: number | ComplexNumber): number =>
{
    const realPart = getRealPart(x);
    const imaginaryPart = getImaginaryPart(x);
    switch(true)
    {
    case 0 === imaginaryPart:
        return Math.cos(realPart);
    case 0 === realPart:
        return Math.cosh(imaginaryPart);
    case Math.PI === realPart:
        return -Math.cosh(imaginaryPart);
    default:
        return NaN;
    }
};
export const sec = (x: number | ComplexNumber): number =>
{
    const realPart = getRealPart(x);
    const imaginaryPart = getImaginaryPart(x);
    switch(true)
    {
    case 0 === imaginaryPart:
        return 1 /Math.cos(realPart);
    case 0 === realPart:
        return 1 /Math.cosh(imaginaryPart);
    case Math.PI === realPart:
        return -1 /Math.cosh(imaginaryPart);
    default:
        return NaN;
    }
};
export const csc = (x: number | ComplexNumber): number =>
{
    const realPart = getRealPart(x);
    const imaginaryPart = getImaginaryPart(x);
    switch(true)
    {
    case 0 === imaginaryPart:
        return 1 /Math.sin(realPart);
    case 0 === realPart:
        return 1 /Math.cosh(imaginaryPart);
    case Math.PI / 2 === realPart:
        return -1 /Math.cosh(imaginaryPart);
    default:
        return NaN;
    }
};
export const cot = (x: number) => 1 / Math.tan(x);
export const asin = (x: number): NumberOrComplex =>
{
    switch(true)
    {
    case 1 < x:
        return { real: Math.PI / 2, imaginary: -arcosh(x), };
    case x < -1:
        return { real: -Math.PI / 2, imaginary: arcosh(-x), };
    default:
        return Math.asin(x);
    }
};
export const acos = (x: number): NumberOrComplex =>
{
    switch(true)
    {
    case 1 < x:
        return { real: 0, imaginary: arcosh(x), };
    case x < -1:
        return { real: Math.PI, imaginary: -arcosh(-x), };
    default:
        return Math.acos(x);
    }
};
export const asec = (x: number) => Math.acos(1 / x);
export const acsc = (x: number) => Math.asin(1 / x);
export const acot = (x: number) => Math.atan2(1, x);
export const arcosh = (x: number) =>
    1E15 < x ? Math.log(2 *x): // 下の方が正規の計算式。ただ、x が大きい場合に x * x でオーバーフローするので、x が大きい場合はこちらの近似式を使う。 number 型の仮数部の精度的に 1E10 以上で同じ計算結果になる。(マージンをとって 1E15 にしている)
    1 <= x ? Math.log(x + Math.sqrt(x * x - 1)):
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
// export const isFinite = Number.isFinite;
// export const isNaN = Number.isNaN;
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
export const diffRate = (a: NumberOrComplex, b: NumberOrComplex): number =>
{
    if (isZero(a) && isZero(b))
    {
        return 0;
    }
    else
    {
        return Math.sqrt(Math.pow(getRealPart(a) -getRealPart(b), 2) +Math.pow(getImaginaryPart(a) -getImaginaryPart(b), 2))
            /Math.max(absComplexNumber(a), absComplexNumber(b));
    }
};
export const isNearlyEqual = (a: NumberOrComplex, b: NumberOrComplex, epsilon: number = 1E-6): boolean =>
    Math.abs(diffRate(a, b)) <= epsilon;
