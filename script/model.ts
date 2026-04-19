import * as Number from "./number";
import * as Type from "./type";
import * as Url from "./url";
import * as Comparer from "./comparer";
import config from "@resource/config.json";
export const data: Type.Model =
{
    slides: [],
    cursor: 0,
    offset: { x: 0, y: 0, },
};
export type ValueWithBasePosition = { value: number; basePosition: number; };
export type ExValue = number | ValueWithBasePosition;
export const RootSlideIndex = 0;
export const RootLaneIndex = 0;
export const getAllLaneCount = (): number =>
    data.slides.reduce((count, slide) => count +slide.lanes.length, 0);
export const getAllLanes = (): Type.Lane[] =>
    data.slides.reduce((allLanes, slide) => allLanes.concat(slide.lanes), [] as Type.Lane[]);
export const isInvertLane = (lane: Type.Lane): boolean =>
{
    let result = false;
    const slide = getSlideFromLane(lane);
    for(const i of slide.lanes)
    {
        switch(i.type)
        {
        case "invert":
            result = ! result;
            break;
        }
        if (i === lane)
        {
            break;
        }
    }
    return result;
};
export const getPrimaryPeriod = (lane: Type.Lane): number | undefined =>
{
    switch(lane.type)
    {
    case "sine":
    case "cosine":
        return 2 *Math.PI;
    case "tangent":
    case "cotangent":
        return Math.PI;
    default:
        return undefined;
    }
};
export const isPeriodicLane = (lane: Type.Lane): boolean =>
{
    const slide = getSlideFromLane(lane);
    for(const i of slide.lanes)
    {
        if (undefined !== getPrimaryPeriod(i))
        {
            return true;
        }
        if (i === lane)
        {
            break;
        }
    }
    return false;
};
// export const getPrimaryAmplitude = (lane: Type.Lane): number =>
// {
//     switch(lane.type)
//     {
//     case "sine":
//     case "cosine":
//         return 1;
//     case "tangent":
//     case "cotangent":
//         return 1;
//     default:
//         return 0;
//     }
// };
export const getPrimaryValueAt = (lane: Type.Lane, position: number): number =>
{
    switch(lane.type)
    {
    case "logarithmic":
    case "2^n":
    case "prime":
    case "constant":
        return position;
    case "invert":
        return 1 /position;
    case "power":
        return Number.clamp(Math.pow(position, lane.exponent ?? 1));
    case "sine":
        return Math.sin(position);
    case "cosine":
        return Math.cos(position);
    case "tangent":
        return Math.tan(position);
    case "cotangent":
        return 1 /Math.tan(position);
    default:
        throw new Error(`🦋 FIXME: getPrimaryValueAt not implemented for lane type: ${lane.type}`);
    }
};
export const getPrimaryPositionAt = (lane: Type.Lane, value: number): number =>
{
    switch(lane.type)
    {
    case "logarithmic":
    case "2^n":
    case "prime":
    case "constant":
        return value;
    case "invert":
        return 1 /value;
    case "power":
        return Number.clamp(Math.pow(value, 1 / (lane.exponent ?? 1)));
    case "sine":
        return Math.asin(value);
    case "cosine":
        return Math.acos(value);
    case "tangent":
        return Math.atan(value);
    case "cotangent":
        return Math.atan(1 /value);
    default:
        throw new Error(`🦋 FIXME: getPrimaryPositionAt not implemented for lane type: ${lane.type}`);
    }
};
export const getValueAt = (slide: Type.SlideUnit, lane: Type.Lane, position: number, view: Type.View): ValueWithBasePosition | undefined =>
{
    try
    {
        const viewScale = Type.getViewScale(view);
        const offset = getSlideOffset(slide, view);
        const rawPosition = Math.exp((position -offset) /viewScale);
        let value = rawPosition;
        let basePosition = 0;
        for(const i of slide.lanes)
        {
            const period = getPrimaryPeriod(i);
            if (undefined !== period)
            {
                basePosition += Math.floor(value / period) *period;
            }
            value = Number.clamp(getPrimaryValueAt(i, value));
            if (i === lane)
            {
                break;
            }
        }
        return { value, basePosition };
    }
    catch(error)
    {
        console.error(`Error in getValueAt: ${error}`);
        return undefined;
    }
};
export const getLinearPositionAt = (lane: Type.Lane, value: ExValue): number =>
{
    const valueWithBasePosition = typeof value === "number" ? { value, basePosition: 0 }: value;
    const basePosition = valueWithBasePosition.basePosition;
    let linearPosition = valueWithBasePosition.value;
    const slide = getSlideFromLane(lane);
    for(const i of slide.lanes)
    {
        linearPosition = Number.clamp(getPrimaryPositionAt(i, linearPosition));
        if (i === lane)
        {
            break;
        }
    }
    return basePosition +linearPosition;
};
export const getRawViewPositionAt = (lane: Type.Lane, value: ExValue, view: Type.View): number =>
    Math.log(getLinearPositionAt(lane, value)) *Type.getViewScale(view);
export const getAnchorSlideAndLane = (slide: Type.SlideUnit): { anchorSlide?: Type.SlideUnit, anchorLane?: Type.Lane, } =>
{
    const slideIndex = getSlideIndex(slide);
    if (slideIndex <= RootSlideIndex)
    {
        return { anchorSlide: undefined, anchorLane: undefined };
    }
    else
    {
        const anchorSlide = data.slides[slideIndex -1];
        const anchorLane = anchorSlide.lanes[anchorSlide.lanes.length -1];
        return { anchorSlide, anchorLane: anchorLane };
    }
};
export const getSlideOffset = (slide: Type.SlideUnit, view: Type.View): number =>
{
    const { anchorSlide, anchorLane } = getAnchorSlideAndLane(slide);
    if (undefined === anchorSlide || undefined === anchorLane)
    {
        // return slide.anchor;
        return data.offset.y;
    }
    else
    {
        return getPositionAt(anchorSlide, anchorLane, slide.anchor, view);
    }
};
export const getPositionAt = (slide: Type.SlideUnit, lane: Type.Lane, value: ExValue, view: Type.View): number =>
    getRawViewPositionAt(lane, value, view) +getSlideOffset(slide, view);
export const getWidth = (slide: Type.SlideUnit, lane: Type.Lane, bottom: number, top: number, view: Type.View, isInvert: boolean | "auto" = false): number =>
{
    const a = getPositionAt(slide, lane, top, view);
    const b = getPositionAt(slide, lane, bottom, view);
    const width = a -b;
    return "auto" === isInvert ?
        Math.abs(width):
        ( ! isInvert) ? width: -width;
};
export const getSnapReferenceLaneIndex = (slide: Type.SlideUnit): number =>
{
    const slideIndex = getSlideIndex(slide);
    if (0 <= slideIndex)
    {
        const previousSlide = data.slides[slideIndex -1];
        if (0 < previousSlide.lanes.length)
        {
            return getLaneIndex(previousSlide.lanes[previousSlide.lanes.length -1]);
        }
        else
        {
            throw new Error(`🦋 FIXME: getSnapReferenceLaneIndex: previous slide has no lanes`);
        }
    }
    else
    {
        throw new Error(`🦋 FIXME: getSnapReferenceLaneIndex: slide index out of range: ${slideIndex}`);
    }
};
// 🔥 Periodic レーン対応の為に、ValueTickWindow(旧TickWindow) から PositionTickWindow に全面移行する。
// ( Periodic になると position から value は取得できるが value から position は取得できなくなるため )
// getPositionAt() もどうにか Periodic 対応しないとあかんのだけど、どうすりゃいいんだ、これ？？？ ->　position を linear postion と view position (現position)に分けて base linear position をモテば良いのでは？
export type PositionTickWindow = { topPosition: number; bottomPosition: number; };
export type ValueTickWindow = { topValue: ValueWithBasePosition; bottomValue: ValueWithBasePosition; };
export type TickWindow = PositionTickWindow | ValueTickWindow;
export const PositionTickWindowToValueTickWindow = (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, positionTickWindow: PositionTickWindow): ValueTickWindow =>
{
    const isInvert = isInvertLane(lane);
    const topValue = getValueAt(slide, lane, positionTickWindow.topPosition, view) ??
        { value:( ! isInvert ? Number.MAX_VALUE: Number.MIN_VALUE), basePosition: 0 };
    const bottomValue = getValueAt(slide, lane, positionTickWindow.bottomPosition, view) ??
        { value:( ! isInvert ? Number.MIN_VALUE: Number.MAX_VALUE), basePosition: 0 };
    return { topValue, bottomValue };
};
export const makePositionTickWindowFromWindow = (): PositionTickWindow =>
({
    topPosition: 0,
    bottomPosition: window.innerHeight
});
export const makePositionTickWindowFromPositionAndWidth = (position: number, width: number): PositionTickWindow =>
({
    topPosition: position -(width /2),
    bottomPosition: position +(width /2)
});
export const getLongTickSpaceWidth = (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, ticks: Type.Tick[], value: number): number =>
{
    let result = Infinity;
    const position = getPositionAt(slide, lane, value, view);
    for(const i of ticks.filter(i => "long" === i.type))
    {
        const tickPosition = getPositionAt(slide, lane, i.value, view);
        const spaceWidth = Math.abs(position - tickPosition);
        if (spaceWidth < result)
        {
            result = spaceWidth;
        }
    }
    return result;
};
export const designTickType = (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, ticks: Type.Tick[], value: number): Type.TickType =>
{
    const tickThreshold = config.render.ruler.tickDensityThreshold_5;
    const width = getLongTickSpaceWidth(slide, lane, view, ticks, value);
    switch(true)
    {
    case tickThreshold <= width:
        return "long";
    case tickThreshold <= width *2:
        return "medium";
    case tickThreshold <= width *4:
        return "short";
    case tickThreshold <= width *8:
        return "mini";
    default:
        return "none";
    }
}
export const designTicks10 = (view: Type.View, slide: Type.SlideUnit, lane: Type.Lane, base: number, unit: number, parent: { index: number, width: number }, tickWindow: ValueTickWindow): Type.Tick[] =>
{
    const { topValue, bottomValue } = tickWindow;
    const ticks: Type.Tick[] = [];
    const isInvert = isInvertLane(lane);
    const highValue = ( ! isInvert) ? bottomValue: topValue;
    const lowValue = ( ! isInvert) ? topValue: bottomValue;
    if (0 < base && base <= highValue.value && lowValue.value <= Number.minMax(base +unit))
    {
        const width = getWidth(slide, lane, base, base + unit, view, isInvert);
        switch(true)
        {
        case config.render.ruler.tickDensityThreshold_10 <= width:
            ticks.push(...designTicks10(view, slide, lane, base, unit / 10, { index: 0, width }, tickWindow));
            break;
        case config.render.ruler.tickDensityThreshold_5 <= width:
            ticks.push({ value: base +(unit *0.5), type: "mini", });
            break;
        }
    }
    for(let b = 1; b <= 9; ++b)
    {
        const value = base + (unit *b);
        const nextValue = base + (unit *(b +1));
        if (lowValue.value < nextValue)
        {
            if (value <= highValue.value)
            {
                const width = getWidth(slide, lane, value, nextValue, view, isInvert);
                switch(true)
                {
                case config.render.ruler.tickDensityThreshold_10 <= width:
                    ticks.push({ value, type: "long", });
                    ticks.push(...designTicks10(view, slide, lane, value, unit / 10, { index: b, width }, tickWindow));
                    break;
                case base <= 0 && 0 === parent.index && 1 === b:
                    ticks.push({ value, type: "long", });
                    break;
                case 5 === b:
                    ticks.push({ value, type: "medium" });
                    break;
                default:
                    ticks.push({ value, type: "short", });
                    break;
                }
                switch(true)
                {
                case config.render.ruler.tickDensityThreshold_10 <= width:
                    break;
                default:
                    if (config.render.ruler.tickDensityThreshold_5 <= width)
                    {
                        ticks.push({ value: value +(unit *0.5), type: "mini", });
                    }
                    break;
                }
            }
            else
            {
                break;
            }
        }
    }
    return ticks;
};
export const designRegularTicks = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow): Type.LaneContent =>
{
    const { topValue, bottomValue } = tickWindow;
    const ticks: Type.Tick[] = [];
    const isInvert = isInvertLane(lane);
    const beginDigit = Math.floor(Math.log10(( ! isInvert) ? topValue.value: bottomValue.value));
    const endDigit = Math.ceil(Math.log10(( ! isInvert) ? bottomValue.value: topValue.value));
    const scale = 10;
    for(let digit = beginDigit; digit <= endDigit; ++digit)
    {
        const a = Math.pow(10, digit);
        const width = getWidth(slide, lane, a, a * scale, view, isInvert);
        switch(true)
        {
        case config.render.ruler.tickDensityThreshold_10 <= width:
            ticks.push(...designTicks10(view, slide, lane, 0, a, { index: 0, width }, tickWindow));
            break;
        case config.render.ruler.tickDensityThreshold_5 <= width:
            ticks.push
            ({
                value: a,
                type: "long",
                color: Math.abs(digit) %3 === 0 ? undefined: "gray",
            });
            ticks.push({ value: a *5, type: "medium", });
            break;
        case config.render.ruler.tickDensityThreshold_E3 <= width:
            ticks.push
            ({
                value: a,
                type: 0 === Math.abs(digit) %3 ? "long": "medium",
            });
            break;
        case config.render.ruler.tickDensityThreshold_E9 <= width:
            if (0 === Math.abs(digit) %3)
            {
                ticks.push
                ({
                    value: a,
                    type: 0 === Math.abs(digit) %9 ? "long": "medium",
                });
            }
            break;
        case config.render.ruler.tickDensityThreshold_E27 <= width:
            if (0 === Math.abs(digit) %9)
            {
                ticks.push
                ({
                    value: a,
                    type: 0 === Math.abs(digit) %27 ? "long": "medium",
                });
            }
            break;
        case config.render.ruler.tickDensityThreshold_E81 <= width:
            if (0 === Math.abs(digit) %27)
            {
                ticks.push
                ({
                    value: a,
                    type: 0 === Math.abs(digit) %81 ? "long": "medium",
                });
            }
            break;
        default:
            if (0 === Math.abs(digit) %81)
            {
                ticks.push
                ({
                    value: a,
                    type: 0 === Math.abs(digit) %243 ? "long": "medium",
                });
            }
            break;
        }
    }
    const width = getWidth(slide, lane, 1, 2, view, isInvert);
    if (config.render.ruler.tickDensityThreshold_5 <= width)
    {
        const lowwerBoundValue = Math.min(topValue.value, bottomValue.value);
        const upperBoundValue = Math.max(topValue.value, bottomValue.value);
        for(const namedNumber of Type.namedNumberList)
        {
            const value = Type.getNamedNumberValue(namedNumber);
            if (lowwerBoundValue <= value && value <= upperBoundValue)
            {
                const label = Type.getNamedNumberLabel(namedNumber);
                ticks.push({ value, type: "long", color: "blue", label });
            }
        }
    }
    // console.log(`designed ticks for lane: ${lane.name ?? "unnamed"}, ticks: ${ticks.map(tick => `${tick.value} (${tick.type})`).join(", ")}`);
    // console.log(`min: ${min}, max: ${max}`);
    const result =
    {
        ticks: ticks,
        areas: []
    };
    return result;
};
export const design2nTicks = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow): Type.LaneContent =>
{
    const { topValue, bottomValue } = tickWindow;
    const ticks: Type.Tick[] = [];
    const isInvert = isInvertLane(lane);
    const beginDigit = Math.floor(Math.log2(( ! isInvert) ? topValue.value: bottomValue.value));
    const endDigit = Math.ceil(Math.log2(( ! isInvert) ? bottomValue.value: topValue.value));
    const scale = 2;
    for(let digit = beginDigit; digit <= endDigit; ++digit)
    {
        const value = Math.pow(2, digit);
        const width = getWidth(slide, lane, value, value * scale, view, isInvert);
        const density = -Math.floor(Math.log2(width /config.render.ruler.tickDensityThreshold_5));
        const threshold = Math.pow(2, density -1);
        const label = `2^${digit}`;
        switch(true)
        {
        // case config.render.ruler.tickDensityThreshold_5 <= width:
        case density <= 0:
            ticks.push
            ({
                value,
                label,
                type: "long",
            });
            break;
        // case config.render.ruler.tickDensityThreshold_5 <= width *2:
        case density <= 1:
            ticks.push
            ({
                value,
                label,
                type: 0 === Math.abs(digit) %2 ? "long": "medium",
            });
            break;
        // case config.render.ruler.tickDensityThreshold_5 <= width *4:
        case density <= 2:
            if (0 === Math.abs(digit) %2)
            {
                ticks.push
                ({
                    value,
                    label,
                    type: 0 === Math.abs(digit) %4 ? "long": "medium",
                });
            }
            break;
        default:
            if (0 === Math.abs(digit) %threshold)
            {
                ticks.push
                ({
                    value,
                    label,
                    type: 0 === Math.abs(digit) % (threshold * 4) ? "long": "medium",
                });
            }
            break;
        }
    }
    const result =
    {
        ticks: ticks,
        areas: []
    };
    return result;
};
export const designPrimeNumbersTicks = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow): Type.LaneContent =>
{
    const { topValue, bottomValue } = tickWindow;
    const { limit, maxRange } = config.model.primeNumber;
    // const { maxRange } = config.model.primeNumber;
    const ticks: Type.Tick[] = [];
    const areas: Type.Area[] = [];
    const isInvert = isInvertLane(lane);
    const lowwerBoundValue = Math.min(topValue.value, bottomValue.value);
    const upperBoundValue = Math.max(topValue.value, bottomValue.value);
    const lowerBoundInvertDecimalValue = Math.ceil(1 /Math.min(1, upperBoundValue));
    const upperBoundInvertDecimalValue = Number.SafeOr1(Math.min(limit, Math.floor(1 /Math.min(1, lowwerBoundValue))));
    // const upperBoundInvertDecimalValue = Number.SafeOr1(Math.floor(1 /Math.min(1, lowwerBoundValue)));
    const tickTypeThreshold = config.render.ruler.tickDensityThreshold_5;
    if (2 <= upperBoundInvertDecimalValue)
    {
        if (limit <= lowerBoundInvertDecimalValue)
        {
            areas.push
            ({
                lowerBound: Number.MIN_VALUE,
                upperBound: 1 /lowerBoundInvertDecimalValue,
                fill: ( ! isInvert) ? "url(#upper-dense-area-gradient)": "url(#lower-dense-area-gradient)"
            });
        }
        else
        {
            if (lowerBoundInvertDecimalValue <= 2)
            {
                const value = 2;
                ticks.push
                ({
                    value: 1 /value,
                    label: `1/${value.toLocaleString()}`,
                    type: "long",
                    color: "green"
                });
            }
            const start = Number.SafeOr1(Math.max(3, lowerBoundInvertDecimalValue));
            const limitEnd = Math.min(start +maxRange, limit);
            // const limitEnd = start +maxRange;
            for(let value = start; value <= upperBoundInvertDecimalValue; value += 2)
            {
                const width = getWidth(slide, lane, 1 /(value +1), 1 /value, view, isInvert);
                if (width *Math.log(value) < 1 || limitEnd <= value)
                {
                    areas.push
                    ({
                        lowerBound: Number.MIN_VALUE,
                        upperBound: 1 /Math.min(value, limit),
                        // upperBound: 1 /value,
                        fill: ( ! isInvert) ? "url(#upper-dense-area-gradient)": "url(#lower-dense-area-gradient)"
                    });
                    break;
                }
                //if (Number.isPrimeNumber(value))
                if (3 === value || (0 !== value %3 && Number.isPrimeNumber(value)))
                {
                    ticks.push
                    ({
                        value: 1 /value,
                        label: `1/${value.toLocaleString()}`,
                        type: tickTypeThreshold <= getLongTickSpaceWidth(slide, lane, view, ticks, 1 /value) ?
                            "long":
                            "medium",
                        color: "green"
                    });
                }
            }
        }
    }
    const lowwerBoundIntegerValue = Math.max(2, Math.ceil(lowwerBoundValue));
    const upperBoundIntegerValue = Number.SafeOr1(Math.min(Math.max(2, Math.floor(upperBoundValue)), limit));
    // const upperBoundIntegerValue = Number.SafeOr1(Math.max(2, Math.floor(upperBoundValue)));
    if (2 <= upperBoundIntegerValue)
    {
        if (limit <= lowwerBoundIntegerValue)
        {
            areas.push
            ({
                lowerBound: Math.max(2, lowwerBoundValue),
                upperBound: Number.MAX_VALUE,
                fill: ( ! isInvert) ? "url(#lower-dense-area-gradient)": "url(#upper-dense-area-gradient)"
            });
        }
        else
        {
            if (2 <= lowwerBoundIntegerValue)
            {
                const value = 2;
                ticks.push
                ({
                    value,
                    label: `${value.toLocaleString()}`,
                    type: "long",
                    color: "green"
                });
            }
            const start = Number.SafeOr1(Math.max(3, lowwerBoundIntegerValue));
            const limitEnd = Math.min(start +maxRange, limit);
            // const limitEnd = start +maxRange;
            for(let value = start; value <= upperBoundIntegerValue; value += 2)
            {
                const width = getWidth(slide, lane, value, value +1, view, isInvert);
                if (width *Math.log(value) < 1 || limitEnd <= value)
                {
                    if (value < upperBoundValue)
                    {
                        areas.push
                        ({
                            lowerBound: Math.min(value, limit),
                            // lowerBound: value,
                            upperBound: Number.MAX_VALUE,
                            fill: ( ! isInvert) ? "url(#lower-dense-area-gradient)": "url(#upper-dense-area-gradient)"
                        });
                    }
                    break;
                }
                //if (Number.isPrimeNumber(value))
                if (3 === value || (0 !== value %3 && Number.isPrimeNumber(value)))
                {
                    ticks.push
                    ({
                        value,
                        label: `${value.toLocaleString()}`,
                        type: tickTypeThreshold <= getLongTickSpaceWidth(slide, lane, view, ticks, value) ?
                            "long":
                            "medium",
                        color: "green"
                    });
                }
            }
        }
    }
    ticks.push
    (
        {
            value: 1 /Number.MAX_SAFE_INTEGER,
            label: "1 / max safe integer",
            type: "long",
            color: "blue"
        },
        {
            value: 1 /limit,
            label: "1 / calculation limit",
            type: "long",
            color: "blue"
        },
        {
            value: limit,
            label: "calculation limit",
            type: "long",
            color: "blue"
        },
        {
            value: 41024320,
            label: "number of digits in the largest known prime (Mersenne prime)",
            type: "long",
            color: "blue"
        },
        {
            value: Number.MAX_SAFE_INTEGER,
            label: "max safe integer",
            type: "long",
            color: "blue"
        }
    );
    const result =
    {
        ticks: ticks,
        areas,
    };
    return result;
};
export const designConstantAreas = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow, area: Type.ContantTableArea): Type.Area[] =>
{
    const { topValue, bottomValue } = tickWindow;
    const result: Type.Area[] = [];
    const isInvert = isInvertLane(lane);
    const lowwerBoundValue = Math.min(topValue.value, bottomValue.value);
    const upperBoundValue = Math.max(topValue.value, bottomValue.value);
    const lowerBound = area.lowerBound ?? Number.MIN_VALUE;
    const upperBound = area.upperBound ?? Number.MAX_VALUE;
    const width = getWidth(slide, lane, lowerBound, upperBound, view, isInvert);
    const threshold = config.render.ruler.tickDensityThreshold_5;
    if ((lowwerBoundValue <= upperBound && lowerBound <= upperBoundValue) || (lowerBound <= upperBoundValue && lowwerBoundValue <= upperBound))
    {
        const detailsCount = (area.details ?? []).length;
        const details = 0 < detailsCount && threshold *Math.max(5, detailsCount *1.25) <= width ?
            (area.details ?? []).map(detail => designConstantAreas(slide, view, lane, tickWindow, detail)).reduce((a, b) => a.concat(b), [] as Type.Area[]):
            undefined;
        result.push
        ({
            lowerBound,
            upperBound,
            fill: area.fill,
            overlay: area.overlay,
            label: threshold <= width *1.5 ? area.label : undefined,
            color: area.color,
            details,
        });
    }
    return result;
};
export const designConstantTicks = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow): Type.LaneContent =>
{
    const { topValue, bottomValue } = tickWindow;
    const ticks: Type.Tick[] = [];
    const areas: Type.Area[] = [];
    // const isInvert = isInvertLane(lane);
    const lowwerBoundValue = Math.min(topValue.value, bottomValue.value);
    const upperBoundValue = Math.max(topValue.value, bottomValue.value);
    if (undefined !== lane.table)
    {
        if (undefined !== lane.table.unit)
        {
            ticks.push
            ({
                value: 1,
                label: `1 ${lane.table.unit}`,
                type: "long",
                color: "blue",
            });
        }
        const sourceTicks = lane.table.ticks
            .filter(i => lowwerBoundValue <= i.value && i.value <= upperBoundValue)
            .sort(Comparer.make([ i => i.priority ?? 0, ]));
        for(const i of sourceTicks.filter(i => (i.priority ?? 0) <= 0))
        {
            ticks.push
            ({
                value: i.value,
                label: i.label,
                type: "long",
                color: i.color ?? ((i.priority ?? 0) <= 0 ? "green": "purple"),
            });
        }
        for(const i of sourceTicks.filter(i => 0 < (i.priority ?? 0)))
        {
            const type = designTickType(slide, lane, view, ticks, i.value);
            if ("none" !== type)
            {
                ticks.push
                ({
                    value: i.value,
                    label: i.label,
                    type,
                    color: i.color ?? "purple",
                });
            }
        }
        for(const i of lane.table.areas)
        {
            areas.push(...designConstantAreas(slide, view, lane, tickWindow, i));
        }
    }
    const result =
    {
        ticks,
        areas,
    };
    return result;
};
export const designPeriodicTicks = (_slide: Type.SlideUnit, _view: Type.View, _lane: Type.Lane, _tickWindow: PositionTickWindow): Type.LaneContent =>
{
    const ticks: Type.Tick[] = [];
    const areas: Type.Area[] = [];
    const result =
    {
        ticks,
        areas,
    };
    return result;
};
export const designTicks = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: PositionTickWindow): Type.LaneContent =>
{
    if (isPeriodicLane(lane))
    {
        return designPeriodicTicks(slide, view, lane, tickWindow);
    }
    else
    {
        const valueTickWindow = PositionTickWindowToValueTickWindow(slide, lane, view, tickWindow);
        switch(lane.type)
        {
        case "2^n":
            return design2nTicks(slide, view, lane, valueTickWindow);
        case "prime":
            return designPrimeNumbersTicks(slide, view, lane, valueTickWindow);
        case "constant":
            return designConstantTicks(slide, view, lane, valueTickWindow);
        default:
            return designRegularTicks(slide, view, lane, valueTickWindow);
        }
    }
};
export const makeRootLane = (): Type.Lane =>
{
    const { type, exponent } = config.model.lane.root as Type.LaneBase;
    return makeLane
    ({
        type: type as Type.PrimaryLane,
        exponent,
    });
};
export const getRootLane = (): Type.Lane =>
    getLane(RootLaneIndex);
export const isRootLane = (indexOrLane: number | Type.Lane): boolean =>
    (typeof indexOrLane === "number" ? RootLaneIndex: getLane(RootLaneIndex)) === indexOrLane;
export const isPrimaryLane = (lane: Type.Lane): boolean =>
    getSlideFromLane(lane).lanes[0] === lane;
export const getRootSlide = (): Type.SlideUnit =>
    data.slides[0];
export const getRootSlideAndRootLane = () =>
    ({ slide: getRootSlide(), lane: getRootLane() });
export const isRootSlide = (indexOrSlide: number | Type.SlideUnit): boolean =>
    (0 === (typeof indexOrSlide === "number" ? indexOrSlide : getSlideIndex(indexOrSlide)));
export const getSlideIndex = (slide: Type.SlideUnit): number =>
{
    const index = data.slides.indexOf(slide);
    if (0 <= index)
    {
        return index;
    }
    throw new Error(`🦋 FIXME: Model.getSlideIndex: slide not found`);
};
export const getSlideIndexFromLane = (lane: Type.Lane): number =>
{
    for(let i = 0; i < data.slides.length; ++i)
    {
        const slide = data.slides[i];
        if (slide.lanes.includes(lane))
        {
            return i;
        }
    }
    throw new Error(`🦋 FIXME: Model.getSlideIndexFromLane: lane not found in any slide`);
};
export const getLaneIndex = (lane: Type.Lane): number =>
{
    let i = 0;
    for(const slide of data.slides)
    {
        for(const l of slide.lanes)
        {
            if (l === lane)
            {
                return i;
            }
            ++i;
        }
    }
    throw new Error(`🦋 FIXME: Model.getLaneIndex: lane not found`);
};
export const makeSlide = (anchor: number = 1): Type.SlideUnit =>
({
    lanes: [],
    anchor,
});
export const makeSureSlide = (): Type.SlideUnit =>
{
    if (data.slides.length <= 0)
    {
        const slide = makeSlide();
        slide.lanes.push(makeRootLane());
        data.slides.push(slide);
    }
    return data.slides[data.slides.length - 1];
};
export const getSlideAndLane = (index: number): { slide: Type.SlideUnit, lane: Type.Lane, } =>
{
    let i = 0;
    for(const slide of data.slides)
    {
        for(const lane of slide.lanes)
        {
            if (i === index)
            {
                return { slide, lane };
            }
            ++i;
        }
    }
    throw new Error(`🦋 FIXME: Model.getLane: index out of range: ${index}`);
};
export const getLastSlideAndLastLane = (): { slide: Type.SlideUnit, lane: Type.Lane, } =>
{
    if (data.slides.length <= 0)
    {
        throw new Error(`🦋 FIXME: Model.getLastSlideAndLastLane: no slide exists`);
    }
    const slide = data.slides[data.slides.length - 1];
    if (slide.lanes.length <= 0)
    {
        throw new Error(`🦋 FIXME: Model.getLastSlideAndLastLane: no lane exists in the last slide`);
    }
    const lane = slide.lanes[slide.lanes.length - 1];
    return { slide, lane };
};
export const getLane = (index: number): Type.Lane =>
    getSlideAndLane(index).lane;
export const getSlideFromLane = (lane: Type.Lane): Type.SlideUnit =>
{
    for(const slide of data.slides)
    {
        if (slide.lanes.includes(lane))
        {
            return slide;
        }
    }
    throw new Error(`🦋 FIXME: Model.getSlideFromLane: lane not found in any slide`);
};
export const addLane = (lane: Type.Lane): void =>
{
    makeSureSlide().lanes.push(lane);
};
const getLaneName = (laneSeed: Type.LaneBase): string | null =>
{
    if ("string" === typeof laneSeed.name)
    {
        return laneSeed.name;
    }
    for(const i of Object.keys(config.model.lane.presets) as Array<keyof typeof config.model.lane.presets>)
    {
        const preset = config.model.lane.presets[i];
        if
        (
            // data.slides.every(slide => slide.lanes.every(lane => lane.name !== i)) &&
            preset.type === laneSeed.type &&
            // preset.isInvert === laneSeed.isInvert &&
            // preset.logScale === laneSeed.logScale
            (preset as any).exponent === laneSeed.exponent
        )
        {
            return i;
        }
    }
    return null;
};
export const makeLane = (laneSeed: Type.LaneBase): Type.Lane =>
({
    type: laneSeed.type,
    exponent: laneSeed.exponent,
    name: getLaneName(laneSeed),
    table: laneSeed.table,
});
export const removeLane = (index: number): void =>
{
    if (isRootLane(index))
    {
        throw new Error(`🦋 FIXME: Model.removeLane: cannot remove root lane`);
    }
    else
    {
        const { slide, lane } = getSlideAndLane(index);
        slide.lanes.splice(slide.lanes.indexOf(lane), 1);
    }
};
export const makeSure = (): void =>
{
    makeSureSlide();
};
export const getCursorPosition = (view: Type.View): number =>
    getPositionAt(getRootSlide(), getRootLane(), data.cursor, view);
export const getCursorValue = (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View) =>
    getValueAt(slide, lane, getCursorPosition(view), view);
export const getCursorValues = (view: Type.View) =>
    data.slides.map(slide => getCursorValue(slide, slide.lanes[0], view));
export const getLaneContext = (lane: Type.Lane): Type.LaneContext =>
{
    const slide = getSlideFromLane(lane);
    switch(true)
    {
    case slide.lanes.length <= 1:
        return "single";
    case lane === slide.lanes[0]:
        return "left-end";
    case lane === slide.lanes[slide.lanes.length - 1]:
        return "right-end";
    default:
        return "center";
    }
};
export const initialize = () =>
{
    data.cursor = Number.parse(Url.get("cursor")) ?? config.model.defaultCursor;
    console.log(`Model initialized: cursor=${data.cursor}`);
    makeSure();
};
