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
export const MIN_VALUE = Number.MIN_VALUE;
export const MAX_VALUE = Number.MAX_VALUE;
