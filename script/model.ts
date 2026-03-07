import * as Number from "./number";
import * as Type from "./type";
import * as Url from "./url";
import config from "@resource/config.json";
export const data: Type.Model =
{
    slides: [],
    anchor: 0
};
export const RootLaneIndex = 0;
export const getAllLanes = (): Type.Lane[] =>
    data.slides.reduce((allLanes, slide) => allLanes.concat(slide.lanes), [] as Type.Lane[]);
export const getValueAt = (lane: Type.Lane, position: number, view: Type.View): number | undefined =>
{
    try
    {
        const viewScale = Type.getViewScale(view);
        switch(lane.type)
        {
        case "logarithmic":
            if ("logarithmic" === view.scaleMode)
            {
                const logScale = Type.getNamedNumberValue(lane.logScale);
                const value = Math.pow(logScale, (position +lane.offset) /viewScale);
                // console.log(`getValueAt: lane: ${lane.name ?? "unnamed"}, position: ${position}, offset: ${lane.offset}, value: ${value}`);
                // console.log(`logScale: ${logScale}, viewScale: ${viewScale}`);
                return lane.isInverted ? (logScale - value) : value;
            }
            else // linear
            {
                const value = (position +lane.offset) /viewScale;
                return lane.isInverted ? (Type.getNamedNumberValue(lane.logScale) -value): value;
            }
        default:
            throw new Error(`🦋 FIXME: getValueAt not implemented for lane type: ${lane.type}`);
        }
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
    switch(lane.type)
    {
    case "logarithmic":
        if ("logarithmic" === view.scaleMode)
        {
            const logScale = Type.getNamedNumberValue(lane.logScale);
            const position = Math.log(lane.isInverted ? logScale -value: value) /Math.log(logScale) *viewScale;
            return position;
        }
        else // linear
        {
            const position = (lane.isInverted ? 1 / value: value) *viewScale;
            return position;
        }
    default:
        throw new Error(`🦋 FIXME: getRawPositionAt not implemented for lane type: ${lane.type}`);
    }
};
export const getPositionAt = (lane: Type.Lane, value: number, view: Type.View): number =>
    getRawPositionAt(lane, value, view) - lane.offset;
export const getWidth = (lane: Type.Lane, bottom: number, top: number, view: Type.View): number =>
    getPositionAt(lane, top, view) - getPositionAt(lane, bottom, view);
export const designTicks10 = (view: Type.View, lane: Type.Lane, base: number, unit: number, parent: { index: number, width: number }): Type.Tick[] =>
{
    const height = window.innerHeight;
    const min = Math.max(getValueAt(lane, 0, view) ?? Number.MIN_VALUE, Number.MIN_VALUE);
    const max = Math.min(getValueAt(lane, height, view) ?? Number.MAX_VALUE, Number.MAX_VALUE);
    const ticks: Type.Tick[] = [];
    if (0 < base && base <= max && min <= Math.min(base +unit, Number.MAX_VALUE))
    {
        const width = getWidth(lane, base, base + unit, view);
        switch(true)
        {
        case config.render.ruler.tickDensityThreshold10 <= width:
            ticks.push(...designTicks10(view, lane, base, unit / 10, { index: 0, width }));
            break;
        case config.render.ruler.tickDensityThreshold5 <= width:
            ticks.push({ value: base +(unit *0.5), type: "mini", });
            break;
        }
    }
    for(let b = 1; b <= 9; ++b)
    {
        const value = base + (unit *b);
        const nextValue = base + (unit *(b +1));
        if (min < nextValue)
        {
            if (value <= max)
            {
                const width = getWidth(lane, value, nextValue, view);
                switch(true)
                {
                case config.render.ruler.tickDensityThreshold10 <= width:
                    ticks.push({ value, type: "long", });
                    ticks.push(...designTicks10(view, lane, value, unit / 10, { index: b, width }));
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
                case config.render.ruler.tickDensityThreshold10 <= width:
                    break;
                default:
                    if (config.render.ruler.tickDensityThreshold5 <= width)
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
    return ticks.filter(tick => min <= Type.getNamedNumberValue(tick.value) && Type.getNamedNumberValue(tick.value) <= max);
};
export const designTicks = (view: Type.View, lane: Type.Lane): Type.Tick[] =>
{
    const viewScale = Type.getViewScale(view);
    const height = window.innerHeight;
    const min = Math.max(getValueAt(lane, 0, view) ?? Number.MIN_VALUE, Number.MIN_VALUE);
    const max = Math.min(getValueAt(lane, height, view) ?? Number.MAX_VALUE, Number.MAX_VALUE);
    const ticks: Type.Tick[] = [];
    // switch(view.scaleMode)
    // {
    // case "logarithmic":
    //     {
            const beginDigit = Math.floor(Math.log10(min));
            const endDigit = Math.ceil(Math.log10(max));
            const scale = 10;
            // const begin = Math.pow(10, beginDigit);
            // const end = Math.pow(10, endDigit);
            for(let digit = beginDigit; digit <= endDigit; ++digit)
            {
                const a = Math.pow(10, digit);
                const width = getWidth(lane, a, a * scale, view);
                switch(true)
                {
                case config.render.ruler.tickDensityThreshold10 <= width:
                    ticks.push(...designTicks10(view, lane, 0, a, { index: 0, width }));
                    break;
                case config.render.ruler.tickDensityThreshold5 <= width:
                    ticks.push
                    ({
                        value: a,
                        type: "long",
                        color: Math.abs(digit) %3 === 0 ? undefined: "gray",
                    });
                    ticks.push({ value: a *5, type: "medium", });
                    break;
                default:
                    ticks.push
                    ({
                        value: a,
                        type: Math.abs(digit) %3 === 0 ? "long": "medium",
                    });
                    break;
                }
            }
    //     }
    //     break;
    // case "linear":
    //     {
    //         const labelUnit = viewScale * 10;
    //         for(let value = Math.ceil(min / labelUnit) * labelUnit; value <= max; value += labelUnit)
    //         {
    //             ticks.push({ value, type: "long", });
    //             for(let i = 1; i < 10; ++i)
    //             {
    //                 const minorValue = value + labelUnit * i / 10;
    //                 if (minorValue <= max)
    //                 {
    //                     ticks.push
    //                     ({
    //                         value: minorValue,
    //                         type: 5 !== i ? "short": "medium",
    //                     });
    //                 }
    //             }
    //         }
    //     }
    //     break;
    // default:
    //     throw new Error(`🦋 FIXME: designTicks not implemented for scale mode: ${view.scaleMode}`);
    // }
    if (100 < viewScale)
    {
        Type.namedNumberList.forEach
        (
            value =>
            {
                const actualNumber = Type.getNamedNumberValue(value);
                if (min <= actualNumber && actualNumber <= max)
                {
                    ticks.push({ value, type: "long", color: "blue" });
                }
            }
        );
    }
    // console.log(`designed ticks for lane: ${lane.name ?? "unnamed"}, ticks: ${ticks.map(tick => `${Type.getNamedNumberValue(tick.value)} (${tick.type})`).join(", ")}`);
    // console.log(`min: ${min}, max: ${max}`);
    return ticks.filter(tick => min <= Type.getNamedNumberValue(tick.value) && Type.getNamedNumberValue(tick.value) <= max);
}
export const makeRootLane = (): Type.Lane =>
{
    const { type, isInverted, logScale } = config.model.lane.root as Type.LaneBase;
    return makeLane
    ({
        type: type as Type.PrimaryLane,
        isInverted,
        logScale,
    });
};
export const getRootLane = (): Type.Lane =>
    getLane(RootLaneIndex);
export const isRootLane = (indexOrLane: number | Type.Lane): boolean =>
    (typeof indexOrLane === "number" ? RootLaneIndex: getLane(RootLaneIndex)) === indexOrLane;
export const getRootSlide = (): Type.SlideUnit =>
    data.slides[0];
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
export const makeSlide = (anchor: number = 0): Type.SlideUnit =>
({
    lanes: [],
    anchor: anchor
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
export const getLaneAndSlide = (index: number): { lane: Type.Lane, slide: Type.SlideUnit, } =>
{
    let i = 0;
    for(const slide of data.slides)
    {
        for(const lane of slide.lanes)
        {
            if (i === index)
            {
                return { lane, slide };
            }
            ++i;
        }
    }
    throw new Error(`🦋 FIXME: Model.getLane: index out of range: ${index}`);
};
export const getLane = (index: number): Type.Lane =>
    getLaneAndSlide(index).lane;
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
            data.slides.every(slide => slide.lanes.every(lane => lane.name !== i)) &&
            preset.type === laneSeed.type &&
            preset.isInverted === laneSeed.isInverted &&
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
    isInverted: laneSeed.isInverted,
    logScale: laneSeed.logScale,
    name: getLaneName(laneSeed),
    isLinked: false,
    offset: 0
});
export const removeLane = (index: number): void =>
{
    if (isRootLane(index))
    {
        throw new Error(`🦋 FIXME: Model.removeLane: cannot remove root lane`);
    }
    else
    {
        const { slide, lane } = getLaneAndSlide(index);
        slide.lanes.splice(slide.lanes.indexOf(lane), 1);
    }
};
export const makeSure = (): void =>
{
    makeSureSlide();
};
export const initialize = () =>
{
    data.anchor = Number.parse(Url.get("anchor")) ?? config.model.defaultAnchor;
    console.log(`Model initialized: anchor=${data.anchor}`);
    makeSure();
};
