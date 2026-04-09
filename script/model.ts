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
        return position;
    case "invert":
        return 1 /position;
    case "squared":
        return Math.pow(position, 2);
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
        return value;
    case "invert":
        return 1 /value;
    case "squared":
        return Math.sqrt(value);
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
        const logScale = Type.getNamedNumberValue(lane.logScale);
        const rawPosition = Math.pow(logScale, (position -offset) /viewScale);
        let value = rawPosition;
        for(const i of slide.lanes)
        {
            value = getPrimaryValueAt(i, value);
            if (i === lane)
            {
                break;
            }
        }
        return value;
        //return getPrimaryValueAt(lane, rawPosition);
    }
    catch(error)
    {
        console.error(`Error in getValueAt: ${error}`);
        return undefined;
    }
};
export const getRawPositionAt = (lane: Type.Lane, value: number, view: Type.View): number =>
{
    const viewScale = Type.getViewScale(view);
    const logScale = Type.getNamedNumberValue(lane.logScale);
    const scale = viewScale /Math.log(logScale);
    //return scale *Math.log(getPrimaryPositionAt(lane, value));
    let rawPosition = value;
    const slide = getSlideFromLane(lane);
    for(const i of slide.lanes)
    {
        rawPosition = getPrimaryPositionAt(i, rawPosition);
        if (i === lane)
        {
            break;
        }
    }
    return scale *Math.log(rawPosition);
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
    if ( ! isInverted)
    {
        if (0 < base && base <= bottomValue && topValue <= Number.minMax(base +unit))
        {
            const width = getWidth(slide, lane, base, base + unit, view);
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
            if (topValue < nextValue)
            {
                if (value <= bottomValue)
                {
                    const width = getWidth(slide, lane, value, nextValue, view);
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
        return ticks.filter(tick => topValue <= Type.getNamedNumberValue(tick.value) && Type.getNamedNumberValue(tick.value) <= bottomValue);
    }
    else
    {
        if (0 < base && base <= topValue && bottomValue <= Number.minMax(base +unit))
        {
            const width = getWidth(slide, lane, base + unit, base, view);
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
            if (bottomValue < nextValue)
            {
                if (value <= topValue)
                {
                    const width = getWidth(slide, lane, nextValue, value, view);
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
        return ticks.filter(tick => bottomValue <= Type.getNamedNumberValue(tick.value) && Type.getNamedNumberValue(tick.value) <= topValue);
    }
};
export const designTicks = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: TickWindow): Type.Tick[] =>
{
    const viewScale = Type.getViewScale(view);
    const { topValue, bottomValue } = tickWindow;
    const ticks: Type.Tick[] = [];
    const isInverted = isInvertLane(lane);
    if ( ! isInverted)
    {
        const beginDigit = Math.floor(Math.log10(topValue));
        const endDigit = Math.ceil(Math.log10(bottomValue));
        const scale = 10;
        console.log(`designTicks: lane: ${lane.name ?? "unnamed"}, topValue: ${topValue}, bottomValue: ${bottomValue}, beginDigit: ${beginDigit}, endDigit: ${endDigit}`);
        for(let digit = beginDigit; digit <= endDigit; ++digit)
        {
            const a = Math.pow(10, digit);
            const width = getWidth(slide, lane, a, a * scale, view);
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
    }
    else
    {
        const beginDigit = Math.floor(Math.log10(bottomValue));
        const endDigit = Math.ceil(Math.log10(topValue));
        const scale = 10;
        for(let digit = beginDigit; digit <= endDigit; ++digit)
        {
            const a = Math.pow(10, digit);
            const width = getWidth(slide, lane, a *scale, a, view);
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
                    color: 0 === Math.abs(digit) %3 ? undefined: "gray",
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
    }
    if (100 < viewScale)
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
        return ticks.filter(tick => topValue <= Type.getNamedNumberValue(tick.value) && Type.getNamedNumberValue(tick.value) <= bottomValue);
    }
    else
    {
        return ticks.filter(tick => bottomValue <= Type.getNamedNumberValue(tick.value) && Type.getNamedNumberValue(tick.value) <= topValue);
    }
}
export const makeRootLane = (): Type.Lane =>
{
    const { type, logScale } = config.model.lane.root as Type.LaneBase;
    return makeLane
    ({
        type: type as Type.PrimaryLane,
        logScale,
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
            preset.logScale === laneSeed.logScale
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
    logScale: laneSeed.logScale,
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
