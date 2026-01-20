export namespace Type
{
    export type NamedNumber = number | "phi" | "e" | "pi";
    export const phi = (1 + Math.sqrt(5)) / 2;
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
    export type PrimaryLane = "primary" | "inverse" | "sine" | "cosine" | "tangent" | "cotangent";
}
