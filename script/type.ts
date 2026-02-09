export type NamedNumber = number | "phi" | "e" | "pi";
export const namedNumberList: NamedNumber[] = [ "phi", "e", "pi" ];
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
export type ViewMode = typeof viewModeList[number];
export const scaleModeList = [ "logarithmic", "linear" ] as const;
export type ScaleMode = typeof scaleModeList[number];
export interface View
{
    viewMode: ViewMode;
    viewScale: number;
    scaleMode: ScaleMode;
    baseOfLogarithm: NamedNumber;
}
export type PrimaryLane = "logarithmic" | "sine" | "cosine" | "tangent" | "cotangent" | "linear";
export interface LaneBase // 🔥 後で evil-type.ts ベースに！
{
    type: PrimaryLane;
    isInverted: boolean;
    logScale: NamedNumber;
}
export interface Lane extends LaneBase // 🔥 後で evil-type.ts ベースに！
{
    name: string | null;
    isLinked: boolean;
    offset: number;
}
export interface SlideUnit // 🔥 後で evil-type.ts ベースに！
{
    lanes: Lane[];
    anchor: number;
}
export interface Model // 🔥 後で evil-type.ts ベースに！
{
    slides: SlideUnit[];
    anchor: number;
}
export type TickType = "short" | "medium" | "long";
