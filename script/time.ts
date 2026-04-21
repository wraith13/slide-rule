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
export const getCurrentUniverseEpoch = (): number =>
        humanEpochToUniverseEpoch(new Date());
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
    else if (duration < 3600 *24 *365.2422)
    {
        return `${duration / (3600 *24)} days`;
    }
    else if (duration < 3600 *24 *365.2422 *100) // Up to 100 years, use Gregorian calendar year
    {
        return `${duration / (3600 *24 *365.2422)} years`;
    }
    else if (duration < 3600 *24 *365.25 *1000) // After 100 years, use Julian calendar year
    {
        return `${duration / (3600 *24 *365.25)} years`;
    }
    else if (duration < 3600 *24 *365.25 *1000)
    {
        return `${duration / (3600 *24 *365.25 *1000)} kilo years`;
    }
    else if (duration < 3600 *24 *365.25 *1000 *1000 *1000)
    {
        return `${duration / (3600 *24 *365.25 *1000 *1000)} mega years`;
    }
    else
    {
        return `${duration / (3600 *24 *365.25 *1000 *1000 *1000)} giga years`;
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
export const parseRelativeUniverseEpoch = (text: string): number =>
{
    const now = config.time.anchor.universeEpoch;
    const match = text.match(/^\s*(?:(in)\s+)?(\d+(?:\.\d+)?)\s*(seconds?|minutes?|hours?|days?|years?|kilo years?|mega years?|giga years?)\s*(ago)?\s*$/);
    const hasAgo = null !== match && match[4].trim().endsWith("ago");
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
            if (value <= 100)
            {
                // For durations up to 100 years, use the average length of a year in the Gregorian calendar, which accounts for leap years
                return now +value *3600 *24 *365.2422 *direction;
            }
            else
            {
                // For durations longer than 100 years, use the average length of a year in the Julian calendar, which is a simple 365.25 days per year and is often used for long-term astronomical calculations
                return now +value *3600 *24 *365.25 *direction;
            }
        case "kilo year":
        case "kilo years":
            return now +value *3600 *24 *365.25 *1000 *direction;
        case "mega year":
        case "mega years":
            return now +value *3600 *24 *365.25 *1000 *1000 *direction;
        case "giga year":
        case "giga years":
            return now +value *3600 *24 *365.25 *1000 *1000 *1000 *direction;
        default:
            throw new Error(`🦋 FIXME: Model.parseRelativeUniverseEpoch: invalid unit: ${unit}`);
        }
    }
    else
    {
        throw new Error(`🦋 FIXME: Model.parseRelativeUniverseEpoch: invalid format: ${text}`);
    }
};
export const initialize = () =>
{
};
