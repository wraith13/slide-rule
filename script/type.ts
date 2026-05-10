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
export type ValueWithBasePosition = { value: number; basePosition: number; };
export type ExValue = number | ValueWithBasePosition;
export const getExValueNumber = (exValue: ExValue): number =>
    "number" === typeof exValue ? exValue : exValue.value;
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
    lowerBound: number | undefined;
    upperBound: number | undefined;
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
