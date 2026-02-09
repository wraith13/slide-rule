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
export const getValueAt = (lane: Type.Lane, position: number, view: Type.View): number =>
{
    switch(lane.type)
    {
    case "logarithmic":
        if ("logarithmic" === view.scaleMode)
        {
            const logScale = Type.getNamedNumberValue(lane.logScale);
            const value = Math.pow(logScale, position / view.viewScale);
            return lane.isInverted ? (logScale - value) : value;
        }
        else // linear
        {
            const value = position / view.viewScale;
            return lane.isInverted ? (Type.getNamedNumberValue(lane.logScale) - value) : value;
        }
    default:
        throw new Error(`🦋 FIXME: getValueAt not implemented for lane type: ${lane.type}`);
    }
};
export const getPositionAt = (lane: Type.Lane, value: number, view: Type.View): number =>
{
    switch(lane.type)
    {
    case "logarithmic":
        if ("logarithmic" === view.scaleMode)
        {
            const logScale = Type.getNamedNumberValue(lane.logScale);
            const position = Math.log(value) / Math.log(logScale) * view.viewScale;
            return lane.isInverted ? (Math.log(logScale - value) / Math.log(logScale) * view.viewScale) : position;
        }
        else // linear
        {
            const position = value * view.viewScale;
            return lane.isInverted ? ((Type.getNamedNumberValue(lane.logScale) - value) * view.viewScale) : position;
        }
    default:
        throw new Error(`🦋 FIXME: getPositionAt not implemented for lane type: ${lane.type}`);
    }
};
export const getFirstLabelValue = (lane: Type.Lane, view: Type.View): { firstLabelValue: number, labelValueUnit: number, } =>
{
    const minValue = getValueAt(lane, 0, view);
    //const maxValue = getValueAt(lane, config.render.ruler.tickLabel.maxInterval, view);
    switch(view.scaleMode)
    {
    case "logarithmic":
        {
            const logScale = Type.getNamedNumberValue(lane.logScale);
            const firstLabelValue = Math.pow(logScale, Math.floor(Math.log(minValue) / Math.log(logScale)));
            const labelValueUnit = firstLabelValue * (logScale - 1);
            return { firstLabelValue, labelValueUnit, };
        }
    case "linear":
        {
            const labelValueUnit = view.viewScale *10;
            const firstLabelValue = Math.floor(minValue / labelValueUnit) * labelValueUnit;
            return { firstLabelValue, labelValueUnit, };
        }
    default:
        throw new Error(`🦋 FIXME: getFirstLabelValue not implemented for scale mode: ${view.scaleMode}`);
    }
}
export const designTicks = (view: Type.View, lane: Type.Lane): { value: Type.NamedNumber, type: Type.TickType, }[] =>
{
    const ticks: { value: Type.NamedNumber, type: Type.TickType, }[] = [];
    const height = window.innerHeight;
    const min = getValueAt(lane, 0, view);
    const max = getValueAt(lane, height, view);
    if (min <= Type.phi && Type.phi <= max)
    {
        ticks.push({ value: "phi", type: "long", });
    }
    if (min <= Math.E && Math.E <= max)
    {
        ticks.push({ value: "e", type: "long", });
    }
    if (min <= Math.PI && Math.PI <= max)
    {
        ticks.push({ value: "pi", type: "long", });
    }
    return ticks;
}
export const makeRootLane = (): Type.Lane =>
{
    const { type, isInverted, logScale } = config.model.lane.root;
    return makeLane
    ({
        type: type as Type.PrimaryLane,
        isInverted,
        logScale,
    });
};
export const isRootLane = (indexOrLane: number | Type.Lane): boolean =>
    (typeof indexOrLane === "number" ? RootLaneIndex: getLane(RootLaneIndex)) === indexOrLane;
export const isRooeSlide = (indexOrSlide: number | Type.SlideUnit): boolean =>
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
    data.anchor = Number.parse(Url.get("anchor")) ?? 100;
    console.log(`Model initialized: anchor=${data.anchor}`);
    makeSure();
};
