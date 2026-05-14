import * as Type from "./type";
import config from "@resource/config.json";
const anchorHumanEpochTime = new Date(config.time.anchor.humanEpoch).getTime();
export const humanEpochToUniverseEpoch = (humanEpoch: Date): number =>
    (humanEpoch.getTime() -anchorHumanEpochTime) /1000 +config.time.anchor.universeEpoch;
export const universeEpochToHumanEpoch = (universeEpoch: number): Date =>
{
    try
    {
        return new Date((universeEpoch -config.time.anchor.universeEpoch) /1000 +anchorHumanEpochTime);
    }
    catch(e)
    {
        console.error(`🦋 FIXME: Model.universeEpochToHumanEpoch: invalid universe epoch: ${universeEpoch}`);
        return new Date(NaN);
    }
};
let currentUniverseEpoch: number | null = null;
export const updateCurrentUniverseEpoch = (): void =>
{
    currentUniverseEpoch = humanEpochToUniverseEpoch(new Date());
};
export const getCurrentUniverseEpoch = (): number =>
{
    if (null === currentUniverseEpoch)
    {
        updateCurrentUniverseEpoch();
    }
    return currentUniverseEpoch!;
};
export const formatUniverseEpochDuration = (duration: number): string =>
{
    if (duration < 60)
    {
        return `${duration} seconds`;
    }
    else if (duration < 3600)
    {
        return `${duration /60} minutes`;
    }
    else if (duration < 3600 *24)
    {
        return `${duration /3600} hours`;
    }
    else if (duration < 3600 *24 *config.time.gregorianYearLength)
    {
        return `${duration / (3600 *24)} days`;
    }
    else if (duration < 3600 *24 *config.time.gregorianYearLength *100) // Up to 100 years, use Gregorian calendar year
    {
        return `${duration / (3600 *24 *config.time.gregorianYearLength)} years`;
    }
    else if (duration < 3600 *24 *config.time.julianYearLength *1000) // After 100 years, use Julian calendar year
    {
        return `${duration / (3600 *24 *config.time.julianYearLength)} years`;
    }
    else if (duration < 3600 *24 *config.time.julianYearLength *1000)
    {
        return `${duration / (3600 *24 *config.time.julianYearLength *1000)} kilo years`;
    }
    else if (duration < 3600 *24 *config.time.julianYearLength *1000 *1000 *1000)
    {
        return `${duration / (3600 *24 *config.time.julianYearLength *1000 *1000)} mega years`;
    }
    else
    {
        return `${duration / (3600 *24 *config.time.julianYearLength *1000 *1000 *1000)} giga years`;
    }
};
export const universeEpochToRelativeTimeString = (universeEpoch: number): string =>
{
    const currentUniverseEpoch = config.time.anchor.universeEpoch;
    const diff = universeEpoch -currentUniverseEpoch;
    if (diff < 0)
    {
        return `${formatUniverseEpochDuration(-diff)} ago`;
    }
    else
    {
        return `in ${formatUniverseEpochDuration(diff)}`;
    }
};
export const universeEpochToString = (universeEpoch: number): string =>
{
    const humanEpoch = universeEpochToHumanEpoch(universeEpoch);
    if (Number.isNaN(humanEpoch.getTime()))
    {
        return universeEpochToRelativeTimeString(universeEpoch);
    }
    else
    {
        return humanEpoch.toISOString();
    }
};
export const yearsToUniverseEpoch = (years: number): number =>
{
    // JP: 「現在」は 1950-01-01T00:00:00Z ( config.time.anchor.humanEpoch )とし、グレゴリオ暦の年の長さを365.2422日( config.time.gregorianYearLength )、ユリウス暦の年の長さを365.25日( config.time.julianYearLength ) とする。
    // EN: Consider "now" as 1950-01-01T00:00:00Z ( config.time.anchor.humanEpoch ), the length of a year in the Gregorian calendar as 365.2422 days ( config.time.gregorianYearLength ), and the length of a year in the Julian calendar as 365.25 days ( config.time.julianYearLength ).
    switch(true)
    {
    case years < config.time.considerGregorianYearsRange.lowerBound:
        // JP: -100000年を超える場合は、長期の天文計算によく使用される、単純な1年あたり365.25日のユリウス暦の平均的な年の長さを使用する
        // EN: For years beyond -100,000, use the average length of a year in the Julian calendar, which is a simple 365.25 days per year, commonly used for long-term astronomical calculations
        return years *3600 *24 *config.time.julianYearLength;
    case years <= config.time.pureGregorianYearsRange.lowerBound:
        // JP: -100000年までは、最初の50年はグレゴリオ暦の年の長さを使用し、残りの年はユリウス暦の年の長さを使用する加重平均を使用する
        // EN: For years up to -100,000, use a weighted average that uses the length of a year in the Gregorian calendar for the first 50 years and the length of a year in the Julian calendar for the remaining years
        return (config.time.pureGregorianYearsRange.lowerBound *3600 *24 *config.time.gregorianYearLength)+ ((years -config.time.pureGregorianYearsRange.lowerBound) *3600 *24 *config.time.julianYearLength);
    case years <= config.time.pureGregorianYearsRange.upperBound:
        // JP: -50(1900)年 から +150(2100)年までは、グレゴリオ暦の平均的な年の長さを使用する
        // EN: From -50 (1900) to +150 (2100), use the average length of a year in the Gregorian calendar
        return years *3600 *24 *config.time.gregorianYearLength;
    case years <= config.time.considerGregorianYearsRange.upperBound:
        // JP: 100000年までは、最初の150年はグレゴリオ暦の年の長さを使用し、残りの年はユリウス暦の年の長さを使用する加重平均を使用する
        // EN: For years up to 100,000, use a weighted average that uses the length of a year in the Gregorian calendar for the first 150 years and the length of a year in the Julian calendar for the remaining years
        return (config.time.pureGregorianYearsRange.upperBound *3600 *24 *config.time.gregorianYearLength)+ ((years -config.time.pureGregorianYearsRange.upperBound) *3600 *24 *config.time.julianYearLength);
    default:
        // JP: 100000年を超える場合は、長期の天文計算によく使用される、単純な1年あたり365.25日のユリウス暦の平均的な年の長さを使用する
        // EN: For years beyond 100,000, use the average length of a year in the Julian calendar, which is a simple 365.25 days per year, commonly used for long-term astronomical calculations
        return years *3600 *24 *config.time.julianYearLength;
    }
};
export const parseRelativeUniverseEpoch = (text: string): number =>
{
    const now = config.time.anchor.universeEpoch;
    const match = text.match(/^\s*(?:(in)\s+)?(\d+(?:\.\d+)?)\s*(seconds?|minutes?|hours?|days?|years?|kilo years?|mega years?|giga years?)\s*(ago)?\s*$/);
    const hasAgo = null !== match && match[4] && match[4].trim().endsWith("ago");
    const direction = hasAgo ? -1 : 1;
    if (null !== match)
    {
        const value = Number.parseFloat(match[2]);
        const unit = match[3];
        switch(unit)
        {
        case "second":
        case "seconds":
            return now +value *1 *direction;
        case "minute":
        case "minutes":
            return now +value *60 *direction;
        case "hour":
        case "hours":
            return now +value *3600 *direction;
        case "day":
        case "days":
            return now +value *3600 *24 *direction;
        case "year":
        case "years":
            return now +yearsToUniverseEpoch(value *direction);
        case "kilo year":
        case "kilo years":
            return now +yearsToUniverseEpoch(value *direction *1000);
        case "mega year":
        case "mega years":
            return now +yearsToUniverseEpoch(value *direction *1000 *1000);
        case "giga year":
        case "giga years":
            return now +yearsToUniverseEpoch(value *direction *1000 *1000 *1000);
        default:
            throw new Error(`🦋 FIXME: Model.parseRelativeUniverseEpoch: invalid unit: ${unit}`);
        }
    }
    else
    {
        throw new Error(`🦋 FIXME: Model.parseRelativeUniverseEpoch: invalid format: ${text}`);
    }
};
export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
export const applyTimeValue = <T extends Json>(json: T, path?: string): T =>
{
    // console.log(`Updating JSON with eval: ${path ?? "root"}`);
    if ("object" === typeof json && null !== json)
    {
        if (Array.isArray(json))
        {
            // console.log(`Processing array at ${path ?? "root"} with length ${json.length}`);
            return json.map
            (
                (item, index) => applyTimeValue(item, `${path ?? ""}[${index}]`)
            ) as unknown as T;
        }
        else
        {
            // console.log(`Processing object at ${path ?? "root"} with keys: ${Object.keys(json).join(", ")}`);
            const result: any = {};
            for (const key of Object.keys(json))
            {
                const value = json[key];
                result[key] = applyTimeValue(value, `${path ?? ""}.${key}`);
            }
            if ("$time-value" in result)
            {
                const source = result["$time-value"];
                if ("object" === typeof source && null !== source && ! Array.isArray(source))
                {
                    for (const key of Object.keys(source))
                    {
                        const currentPath = `${path ?? ""}.$time-value.${key}`;
                        const value = source[key];
                        switch(value)
                        {
                        case "$current-time":
                            result[key] = getCurrentUniverseEpoch();
                            if ( ! currentPath.startsWith("$SILENT"))
                            {
                                console.log(`Applied $current-time to ${currentPath}: ${result[key]}`);
                            }
                            break;
                        case "$human-calendar":
                            result[key] = applyHumanCalendar(result[key], path);
                            if ( ! currentPath.startsWith("$SILENT"))
                            {
                                console.log(`Applied $human-calendar to ${currentPath}: ${result[key]}`);
                            }
                            break;
                        default:
                            console.warn(`Invalid ${currentPath} value: ${value}`);
                        }
                    }
                }
                else
                {
                    console.warn(`Invalid ${path ?? ""}.$time-value: ${source}`);
                }
            }
            return result;
        }
    }
    return json;
};
export const applyHumanCalendar = (json: Type.ConstantTable, _path?: string): Type.ConstantTable =>
{
    return json;
};
export const updateConstantTable = (json: Type.ConstantTable, path?: string): Type.ConstantTable =>
{
    let updatedJson = json;
    if ("object" === typeof json && null !== json && ! Array.isArray(json) && "$time-require" in json)
    {
        const timeRequire = json["$time-require"];
        if (Array.isArray(timeRequire))
        {
            for (const timeValue of timeRequire)
            {
                switch(timeValue)
                {
                case "$current-time":
                    updatedJson = applyTimeValue(updatedJson as (Json & Type.ConstantTable), path);
                    break;
                case "$human-calendar":
                    updatedJson = applyHumanCalendar(updatedJson, path);
                    break;
                default:
                    console.warn(`Invalid ${path ?? ""}.$time-require value: ${timeValue}`);
                }
            }
        }
        else
        {
            console.warn(`Invalid ${path ?? ""}.$time-require value: ${timeRequire}`);
        }
    }
    return updatedJson;
};
export const initialize = () =>
{
};
