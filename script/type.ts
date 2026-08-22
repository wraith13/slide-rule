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
export const getNext = <T> (list: readonly T[], current: T, isReverse?: boolean): T =>
{
    const currentIndex = list.indexOf(current);
    if (0 <= currentIndex)
    {
        const nextIndex = (currentIndex + (isReverse ? -1 : 1) + list.length) % list.length;
        return list[nextIndex];
    }
    else
    {
        throw new Error(`🦋 FIXME: getNext: current value not found in list`);
    }
}
export type ThemeTable<T> = { light: T; dark: T; };
export const isThemeTable = <T>(table: unknown): table is ThemeTable<T> =>
    "object" === typeof table && null !== table && "light" in table && "dark" in table;
export interface RenderingOptions
{
    showCursor: boolean;
}
export type ValueOrThemeTable<T> = T | ThemeTable<T>;
export const viewModeList = [ "ruler", "grid", "graph" ] as const;
export type ViewMode = typeof viewModeList[number]; // to be deprecated
export interface View
{
    viewMode: ViewMode;
    viewScaleExponent: number;
    baseOfLogarithm: NamedNumber;
    isLocked: boolean;
    popup: ViewPopup | null;
}
export interface ViewPopup
{
    popupType: string;
    child: ViewPopup | null;
}
export interface LanePropertyPopup extends ViewPopup
{
    popupType: "lane-property";
    laneIndex: number;
}
export interface LaneUnitPopup extends ViewPopup
{
    popupType: "lane-unit";
    laneIndex: number;
    child: null;
}
export const getViewScale = (view: View): number => Math.pow(10, view.viewScaleExponent);
export type MultiLanguageText = string | ({ [key in string]?: string; } & { en: string; });
export type LaneType =
    "primary" | "invert" |
    "power" | "root" |
    "exponential" | "logarithmic" |
    "sine" | "cosine" | "tangent" | "secant" | "cosecant" | "cotangent" |
    "arcsine" | "arccosine" | "arctangent" | "arcsecant" | "arccosecant" | "arccotangent" |
    "digit" | "constant" |
    "prime" | "prime-decomposition";
export interface LaneBase // 🔥 後で evil-type.ts ベースに！
{
    name?: MultiLanguageText;
    type: LaneType;
    // isInverted: boolean;
    base?: number | "e";
    exponent?: number;
    withoutLabel?: boolean;
    table?: string;
    digit?: string;
    unit?: { symbol: string; label: MultiLanguageText; };
}
export interface Lane extends Omit<LaneBase, "name"> // 🔥 後で evil-type.ts ベースに！
{
    name: MultiLanguageText | null;
}
export interface DigitTable
{
    label?: MultiLanguageText;
    digits: DigitTableDigit[];
}
export interface DigitTableDigit
{
    exponent: number;
    label: MultiLanguageText;
    symbol?: string;
}
export interface AngleTable
{
    ticks: AngleTableTick[];
}
export interface AngleTableTick
{
    angle: number;
    value: number | null;
    label: string;
}
export interface SourceEval
{
    "$source-eval"?: string;
}
export interface ConstantTable extends SourceEval
{
    label: MultiLanguageText;
    unit?: { symbol: string; label: MultiLanguageText; };
    ticks: ContantTableTick[];
    areas: ContantTableArea[];
}
export interface ContantTableTick extends SourceEval
{
    value: number;
    label: MultiLanguageText;
    priority?: number; // 0 means always show
    color?: ValueOrThemeTable<string>;
    unit?: { symbol: string; label: MultiLanguageText; };
}
export interface Unit
{
    symbol: string;
    label: MultiLanguageText;
    value: number;
};
export interface ContantTableArea extends SourceEval
{
    lowerBound: number | null;
    upperBound: number | null;
    fill: string; // aarea color
    overlay?: AreaOverlayType;
    label?: MultiLanguageText;
    color?: ValueOrThemeTable<string>; // label color
    details?: ContantTableArea[];
}
export interface SlideUnit // 🔥 後で evil-type.ts ベースに！
{
    lanes: Lane[];
    anchor: number; // ルート Slide の anchor は使用されない
}
export interface Model // 🔥 後で evil-type.ts ベースに！
{
    slides: SlideUnit[];
    cursor: number;
    offset: { x: number; y: number; };
}
export type LaneContext = "left-end" | "center" | "right-end" | "single";
export type TickType = "none" | "mini" | "short" | "medium" | "long";
export const getNextTickType = (tickType: TickType, direction: "shorter" | "longer"): TickType =>
{
    switch(direction)
    {
    case "shorter":
        switch (tickType)
        {
        case "long":
            return "medium";
        case "medium":
            return "short";
        case "short":
            return "mini";
        case "mini":
            return "none";
        case "none":
            return "none";
        default:
            throw new Error(`🦋 FIXME: getNextTickType: unknown tickType: ${tickType}`);
        }
    case "longer":
        switch (tickType)
        {
        case "none":
            return "mini";
        case "mini":
            return "short";
        case "short":
            return "medium";
        case "medium":
            return "long";
        case "long":
            return "long";
        default:
            throw new Error(`🦋 FIXME: getNextTickType: unknown tickType: ${tickType}`);
        }
    default:
        throw new Error(`🦋 FIXME: getNextTickType: unknown direction: ${direction}`);
    }
};
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
export const regularizeComplexNumber = (value: NumberOrComplex): NumberOrComplex =>
    0 === getImaginaryPart(value) ? getRealPart(value) : value;
export const makeSureComplexNumber = (value: NumberOrComplex): ComplexNumber =>
    "number" === typeof value ? { real: value, imaginary: 0 } : value;
export const getRealPart = (value: NumberOrComplex): number =>
    "number" === typeof value ? value : value.real;
export const getImaginaryPart = (value: NumberOrComplex): number =>
    "number" === typeof value ? 0 : value.imaginary;
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
    if (0 === getImaginaryPart(value))
    {
        return `${realPart}`;
    }
    else if (0 === getRealPart(value))
    {
        return `${imaginaryPart}i`;
    }
    else
    {
        const sign = 0 <= imaginaryPart ? "+" : "-";
        return `${realPart}${sign}${Math.abs(imaginaryPart)}i`;
    }
};
export type ValueType = number;
export type ValueWithBasePosition = { value: ValueType; basePosition: number; quarter: number; };
export const isValueWithBasePosition = (value: unknown): value is ValueWithBasePosition =>
    "object" === typeof value && null !== value &&
    "value" in value && "number" === typeof value.value &&
    "basePosition" in value && "number" === typeof value.basePosition &&
    "quarter" in value && "number" === typeof value.quarter;
export type ValueWithPosition = { value: ValueType; position: number; };
export const isValueWithPosition = (value: unknown): value is ValueWithPosition =>
    "object" === typeof value && null !== value &&
    "value" in value && "number" === typeof value.value &&
    "position" in value && "number" === typeof value.position;
export type ExValue = ValueType | ValueWithBasePosition | ValueWithPosition;
export const getExValueNumber = <T>(exValue: Extract<T, null | undefined> | ExValue): Extract<T, null | undefined> | number =>
    undefined === exValue || null === exValue || "number" === typeof exValue ? exValue : exValue.value;
export const getExValuePosition = (exValue: ExValue): number | undefined =>
    "object" === typeof exValue && null !== exValue &&
    "position" in exValue && "number" === typeof exValue.position ?
        exValue.position : undefined;
export interface Tick
{
    value: ExValue;
    type: TickType;
    isShowLabel?: boolean;
    label?: MultiLanguageText;
    behindTickCount?: number;
    unit?: string;
    color?: string;
    minimumFractionDigits?: number;
}
export const getTickValue = (tick: Tick): number =>
    getExValueNumber(tick.value);
export type AreaOverlayType = "none" | "top" | "bottom" | "center" | "edges";
export interface Area
{
    lowerBound: ExValue | undefined;
    upperBound: ExValue | undefined;
    fill: string; // aarea color
    overlay?: AreaOverlayType;
    label?: MultiLanguageText;
    color?: string; // label color
    details?: Area[];
}
export interface LaneContent
{
    ticks: Tick[];
    areas: Area[];
}
export interface LeveledText
{
    text: string;
    level: number; // 1: upper, 0: normal, -1: lower
}
