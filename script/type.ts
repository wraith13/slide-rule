export type NamedNumber = number | "phi" | "e" | "pi";
export const namedNumberList: NamedNumber[] = [ "phi", "e", "pi" ];
export const isNamedNumber = (value: unknown): value is "phi" | "e" | "pi" =>
    namedNumberList.includes(value as NamedNumber);
export const phi = (1 + Math.sqrt(5)) / 2;
// phi approximately 1.618033988749895
// e approximately 2.718281828459045
// pi approximately 3.141592653589793
export const getNamedNumberValue = (value: NamedNumber): number =>
{
    switch (value)
    {
        case "phi": return phi;
        case "e": return Math.E;
        case "pi": return Math.PI;
        default: return value;
    }
};
export const getNamedNumberLabel = (value: NamedNumber, locales?: Intl.LocalesArgument, options?: Intl.NumberFormatOptions): string =>
{
    switch (value)
    {
        case "phi": return "φ";
        case "e": return "e";
        case "pi": return "π";
        default: return value.toLocaleString(locales, options);
    }
}
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
export const viewModeList = [ "ruler", "grid", "graph" ] as const;
export type ViewMode = typeof viewModeList[number]; // to be deprecated
export interface View
{
    viewMode: ViewMode;
    viewScaleExponent: number;
    baseOfLogarithm: NamedNumber;
}
export const getViewScale = (view: View): number => Math.pow(10, view.viewScaleExponent);
export type PrimaryLane = "logarithmic" | "invert" | "power" | "2^n" | "prime" | "sine" | "cosine" | "tangent" | "cotangent" | "constant";
export interface LaneBase // 🔥 後で evil-type.ts ベースに！
{
    name?: string;
    type: PrimaryLane;
    // isInverted: boolean;
    exponent?: number;
    withoutLabel?: boolean;
    table?: ContantTable;
}
export interface Lane extends Omit<LaneBase, "name"> // 🔥 後で evil-type.ts ベースに！
{
    name: string | null;
}
export interface ContantTable
{
    label: string;
    unit?: string;
    ticks: { value: number, label: string; priority?: number; color?: string; }[];
    areas: { lowerBound: number | null; upperBound: number | null; fill: string; label?: string; color?: string; details?: ContantTable["areas"] }[];
    
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
export type TickType = "mini" | "short" | "medium" | "long";
export type ValueWithBasePosition = { value: number; basePosition: number; };
export type ExValue = number | ValueWithBasePosition;
export const getExValueNumber = (exValue: ExValue): number =>
    "number" === typeof exValue ? exValue : exValue.value;
export interface Tick
{
    value: ExValue;
    type: TickType;
    label?: string;
    color?: string;
    minimumFractionDigits?: number;
}
export const getTickValue = (tick: Tick): number =>
    getExValueNumber(tick.value);
export interface Area
{
    lowerBound: number | undefined;
    upperBound: number | undefined;
    fill: string;
    label?: string;
    color?: string;
}
export interface LaneContent
{
    ticks: Tick[];
    areas: Area[];
}
