import * as Number from "./number";
import * as Type from "./type";
import * as Url from "./url";
import config from "@resource/config.json";
export const data: Type.Model =
{
    slides: [],
    cursor: 0,
    offset: { x: 0, y: 0, },
};
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
        if ("invert" === i.type)
        {
            result = ! result;
        }
        if (i === lane)
        {
            break;
        }
    }
    return result;
};
export const getPrimaryValueAt = (lane: Type.Lane, position: number): number =>
{
    switch(lane.type)
    {
    case "logarithmic":
    case "2^n":
    case "prime":
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
export const getValueAt = (slide: Type.SlideUnit, lane: Type.Lane, position: number, view: Type.View): number | undefined =>
{
    try
    {
        const viewScale = Type.getViewScale(view);
        const offset = getSlideOffset(slide, view);
        const rawPosition = Math.exp((position -offset) /viewScale);
        let value = rawPosition;
        for(const i of slide.lanes)
        {
            value = Number.clamp(getPrimaryValueAt(i, value));
            if (i === lane)
            {
                break;
            }
        }
        return value;
    }
    catch(error)
    {
        console.error(`Error in getValueAt: ${error}`);
        return undefined;
    }
};
export const getRawPositionAt = (lane: Type.Lane, value: number, view: Type.View): number =>
{
    let rawPosition = value;
    const slide = getSlideFromLane(lane);
    for(const i of slide.lanes)
    {
        rawPosition = Number.clamp(getPrimaryPositionAt(i, rawPosition));
        if (i === lane)
        {
            break;
        }
    }
    return Type.getViewScale(view) *Math.log(rawPosition);
};
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
export const getPositionAt = (slide: Type.SlideUnit, lane: Type.Lane, value: number, view: Type.View): number =>
    getRawPositionAt(lane, value, view) +getSlideOffset(slide, view);
export const getWidth = (slide: Type.SlideUnit, lane: Type.Lane, bottom: number, top: number, view: Type.View): number =>
    getPositionAt(slide, lane, top, view) - getPositionAt(slide, lane, bottom, view);
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
export type TickWindow = { topValue: number; bottomValue: number; };
export const makeTickWindow = (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, topPosition: number, bottomPosition: number): TickWindow =>
{
    const isInverted = isInvertLane(lane);
    const rawTopValue = getValueAt(slide, lane, topPosition, view);
    const rawBottomValue = getValueAt(slide, lane, bottomPosition, view);
    const topValue = Number.clamp(rawTopValue ?? ( ! isInverted ? Number.MAX_VALUE: Number.MIN_VALUE));
    const bottomValue = Number.clamp(rawBottomValue ?? ( ! isInverted ? Number.MIN_VALUE: Number.MAX_VALUE));
    return { topValue, bottomValue };
};
export const makeTickWindowFromView = (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View): TickWindow =>
    makeTickWindow(slide, lane, view, 0, window.innerHeight);
export const makeTickWindowFromPosition = (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, position: number, width: number): TickWindow =>
    makeTickWindow(slide, lane, view, position -(width /2), position +(width /2));
export const designTicks10 = (view: Type.View, slide: Type.SlideUnit, lane: Type.Lane, base: number, unit: number, parent: { index: number, width: number }, tickWindow: TickWindow): Type.Tick[] =>
{
    const { topValue, bottomValue } = tickWindow;
    const ticks: Type.Tick[] = [];
    const isInverted = isInvertLane(lane);
    const highValue = ( ! isInverted) ? bottomValue: topValue;
    const lowValue = ( ! isInverted) ? topValue: bottomValue;
    if (0 < base && base <= highValue && lowValue <= Number.minMax(base +unit))
    {
        const width = ( ! isInverted) ?
            getWidth(slide, lane, base, base + unit, view):
            getWidth(slide, lane, base + unit, base, view);
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
        if (lowValue < nextValue)
        {
            if (value <= highValue)
            {
                const width = ( ! isInverted) ?
                    getWidth(slide, lane, value, nextValue, view):
                    getWidth(slide, lane, nextValue, value, view);
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
    return ticks.filter(tick => lowValue <= Type.getNamedNumberValue(tick.value) && Type.getNamedNumberValue(tick.value) <= highValue);
};
export const designRegularTicks = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: TickWindow): Type.LaneContent =>
{
    const { topValue, bottomValue } = tickWindow;
    const ticks: Type.Tick[] = [];
    const isInverted = isInvertLane(lane);
    const beginDigit = Math.floor(Math.log10(( ! isInverted) ? topValue: bottomValue));
    const endDigit = Math.ceil(Math.log10(( ! isInverted) ? bottomValue: topValue));
    const scale = 10;
    for(let digit = beginDigit; digit <= endDigit; ++digit)
    {
        const a = Math.pow(10, digit);
        const width = ( ! isInverted) ?
            getWidth(slide, lane, a, a * scale, view):
            getWidth(slide, lane, a * scale, a, view);
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
    const width = ( ! isInverted) ?
        getWidth(slide, lane, 1, 2, view):
        getWidth(slide, lane, 2, 1, view);
    if (config.render.ruler.tickDensityThreshold_5 <= width)
    {
        const lowwerBoundValue = Math.min(topValue, bottomValue);
        const upperBoundValue = Math.max(topValue, bottomValue);
        for(const value of Type.namedNumberList)
        {
            const actualNumber = Type.getNamedNumberValue(value);
            if (lowwerBoundValue <= actualNumber && actualNumber <= upperBoundValue)
            {
                ticks.push({ value, type: "long", color: "blue" });
            }
        }
    }
    // console.log(`designed ticks for lane: ${lane.name ?? "unnamed"}, ticks: ${ticks.map(tick => `${Type.getNamedNumberValue(tick.value)} (${tick.type})`).join(", ")}`);
    // console.log(`min: ${min}, max: ${max}`);
    if ( ! isInverted)
    {
        const result =
        {
            ticks: ticks.filter(tick => topValue <= Type.getNamedNumberValue(tick.value) && Type.getNamedNumberValue(tick.value) <= bottomValue),
            areas: []
        };
        return result;
    }
    else
    {
        const result =
        {
            ticks: ticks.filter(tick => bottomValue <= Type.getNamedNumberValue(tick.value) && Type.getNamedNumberValue(tick.value) <= topValue),
            areas: []
        };
        return result;
    }
};
export const design2nTicks = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: TickWindow): Type.LaneContent =>
{
    const { topValue, bottomValue } = tickWindow;
    const ticks: Type.Tick[] = [];
    const isInverted = isInvertLane(lane);
    const beginDigit = Math.floor(Math.log2(( ! isInverted) ? topValue: bottomValue));
    const endDigit = Math.ceil(Math.log2(( ! isInverted) ? bottomValue: topValue));
    const scale = 2;
    for(let digit = beginDigit; digit <= endDigit; ++digit)
    {
        const a = Math.pow(2, digit);
        const width = ( ! isInverted) ?
            getWidth(slide, lane, a, a * scale, view):
            getWidth(slide, lane, a * scale, a, view);
        const density = -Math.floor(Math.log2(width /config.render.ruler.tickDensityThreshold_5));
        const threshold = Math.pow(2, density -1);
        switch(true)
        {
        // case config.render.ruler.tickDensityThreshold_5 <= width:
        case density <= 0:
            ticks.push
            ({
                value: a,
                type: "long",
            });
            break;
        // case config.render.ruler.tickDensityThreshold_5 <= width *2:
        case density <= 1:
            ticks.push
            ({
                value: a,
                type: 0 === Math.abs(digit) %2 ? "long": "medium",
            });
            break;
        // case config.render.ruler.tickDensityThreshold_5 <= width *4:
        case density <= 2:
            if (0 === Math.abs(digit) %2)
            {
                ticks.push
                ({
                    value: a,
                    type: 0 === Math.abs(digit) %4 ? "long": "medium",
                });
            }
            break;
        // case config.render.ruler.tickDensityThreshold_5 <= width *16:
        //     if (0 === Math.abs(digit) %4)
        //     {
        //         ticks.push
        //         ({
        //             value: a,
        //             type: 0 === Math.abs(digit) %16 ? "long": "medium",
        //         });
        //     }
        //     break;
        // default:
        //     if (0 === Math.abs(digit) %16)
        //     {
        //         ticks.push
        //         ({
        //             value: a,
        //             type: 0 === Math.abs(digit) %64 ? "long": "medium",
        //         });
        //     }
        //     break;
        default:
            if (0 === Math.abs(digit) %threshold)
            {
                ticks.push
                ({
                    value: a,
                    type: 0 === Math.abs(digit) % (threshold * 4) ? "long": "medium",
                });
            }
            break;
        }
    }
    if ( ! isInverted)
    {
        const result =
        {
            ticks: ticks.filter(tick => topValue <= Type.getNamedNumberValue(tick.value) && Type.getNamedNumberValue(tick.value) <= bottomValue),
            areas: []
        };
        return result;
    }
    else
    {
        const result =
        {
            ticks: ticks.filter(tick => bottomValue <= Type.getNamedNumberValue(tick.value) && Type.getNamedNumberValue(tick.value) <= topValue),
            areas: []
        };
        return result;
    }
};
export const designPrimeNumbersTicks = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: TickWindow): Type.LaneContent =>
{
    const { topValue, bottomValue } = tickWindow;
    const ticks: Type.Tick[] = [];
    const areas: Type.Area[] = [];
    const isInverted = isInvertLane(lane);
    const lowwerBoundValue = Math.min(topValue, bottomValue);
    const upperBoundValue = Math.max(topValue, bottomValue);
    const lowerBoundInvertDecimalValue = Math.ceil(1 /Math.min(1, upperBoundValue));
    const upperBoundInvertDecimalValue = Math.floor(1 /Math.min(1, lowwerBoundValue));
    if (2 <= upperBoundInvertDecimalValue)
    {
        for(let value = Math.max(2, lowerBoundInvertDecimalValue); value <= upperBoundInvertDecimalValue; ++value)
        {
            const width = ( ! isInverted) ?
                getWidth(slide, lane, 1 /(value +1), 1 /value, view):
                getWidth(slide, lane, 1 /value, 1 /(value +1), view);
            if (width *Math.log(value) < 1.5)
            {
                areas.push
                ({
                    lowerBound: Number.MIN_VALUE,
                    upperBound: 1 /value,
                    color: ( ! isInverted) ? "url(#upper-dense-area-gradient)": "url(#lower-dense-area-gradient)"
                });
                break;
            }
            if (Number.isPrimeNumber(value))
            {
                ticks.push
                ({
                    value: 1 /value,
                    label: `1/${value}`,
                    type: config.render.ruler.tickDensityThreshold_5 <= width *4 ?
                        "long":
                        "medium",
                    color: "green"
                });
            }
        }
    }
    const lowwerBoundIntegerValue = Math.max(2, Math.ceil(lowwerBoundValue));
    const upperBoundIntegerValue = Math.min(Math.max(2, Math.floor(upperBoundValue)), Number.MAX_SAFE_INTEGER);
    if (2 <= upperBoundIntegerValue)
    {
        if (Number.MAX_SAFE_INTEGER <= lowwerBoundIntegerValue)
        {
            areas.push
            ({
                lowerBound: Math.max(2, lowwerBoundValue),
                upperBound: Number.MAX_VALUE,
                color: ( ! isInverted) ? "url(#lower-dense-area-gradient)": "url(#upper-dense-area-gradient)"
            });
        }
        else
        {
            for(let value = lowwerBoundIntegerValue; value <= upperBoundIntegerValue; ++value)
            {
                const width = ( ! isInverted) ?
                    getWidth(slide, lane, value, value +1, view):
                    getWidth(slide, lane, value +1, value, view);
                if (width *Math.log(value) < 1.5)
                {
                    if (value < upperBoundValue)
                    {
                        areas.push
                        ({
                            lowerBound: value,
                            upperBound: Number.MAX_VALUE,
                            color: ( ! isInverted) ? "url(#lower-dense-area-gradient)": "url(#upper-dense-area-gradient)"
                        });
                    }
                    break;
                }
                if (Number.isPrimeNumber(value))
                {
                    ticks.push
                    ({
                        value,
                        type: config.render.ruler.tickDensityThreshold_5 <= width *4 ?
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
            value: Number.MAX_SAFE_INTEGER,
            label: "safe int limit",
            type: "long",
            color: "blue"
        },
        {
            value: 228159585,
            label: "tick limit",
            type: "long",
            color: "blue"
        },
        {
            // value: Math.pow(10, 6) *3.556549,
            value: 3556549,
            label: "label limit",
            type: "long",
            color: "blue"
        },
        {
            value: 1 /Number.MAX_SAFE_INTEGER,
            label: "safe int limit",
            type: "long",
            color: "blue"
        },
        {
            value: 1 /228159585,
            label: "tick limit",
            type: "long",
            color: "blue"
        },
        {
            // value: 1 /(Math.pow(10, 6) *3.556549),
            value: 1 /3556549,
            label: "label limit",
            type: "long",
            color: "blue"
        }
    );
    if ( ! isInverted)
    {
        const result =
        {
            ticks: ticks.filter(tick => topValue <= Type.getNamedNumberValue(tick.value) && Type.getNamedNumberValue(tick.value) <= bottomValue),
            areas,
        };
        return result;
    }
    else
    {
        const result =
        {
            ticks: ticks.filter(tick => bottomValue <= Type.getNamedNumberValue(tick.value) && Type.getNamedNumberValue(tick.value) <= topValue),
            areas,
        };
        return result;
    }
    // return ticks;
};
export const designTicks = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: TickWindow): Type.LaneContent =>
{
    switch(lane.type)
    {
    case "2^n":
        return design2nTicks(slide, view, lane, tickWindow);
    case "prime":
        return designPrimeNumbersTicks(slide, view, lane, tickWindow);
    default:
        return designRegularTicks(slide, view, lane, tickWindow);
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
    for(const i of Object.keys(config.model.lane.presets) as Array<keyof typeof config.model.lane.presets>)
    {
        const preset = config.model.lane.presets[i];
        if
        (
            // data.slides.every(slide => slide.lanes.every(lane => lane.name !== i)) &&
            preset.type === laneSeed.type &&
            // preset.isInverted === laneSeed.isInverted &&
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
