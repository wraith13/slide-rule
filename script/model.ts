import { Number } from "./number";
import { Type } from "./type";
import { Url } from "./url";
import config from "@resource/config.json";
export namespace Model
{
    export const data: Type.Model =
    {
        slides: [],
        anchor: 0
    };
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
    export const makeSlide = (anchor: number = 0): Type.SlideUnit =>
    ({
        lanes: [],
        anchor: anchor
    });
    export const makeSureSlide = (): Type.SlideUnit =>
    {
        if (data.slides.length <= 0)
        {
            data.slides.push(makeSlide());
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
        const { slide, lane } = getLaneAndSlide(index);
        slide.lanes.splice(slide.lanes.indexOf(lane), 1);
    };
    export const initialize = () =>
    {
        data.anchor = Number.parse(Url.get("anchor")) ?? 100;
        console.log(`Model initialized: anchor=${data.anchor}`);
    };
}
