import { Number } from "./number";
import { Type } from "./type";
import { Url } from "./url";
import config from "@resource/config.json";
export namespace Model
{
    export const data: Type.Model =
    {
        lanes: [],
        anchor: 0
    };
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
    export const add = (lane: Type.Lane): void =>
    {
        data.lanes.push(lane);
    };
    const getLaneName = (laneSeed: Type.LaneBase): string | null =>
    {
        for(const i of Object.keys(config.model.lane.presets) as Array<keyof typeof config.model.lane.presets>)
        {
            const preset = config.model.lane.presets[i];
            if
            (
                data.lanes.every(lane => lane.name !== i) &&
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
    {
        return {
            type: laneSeed.type,
            isInverted: laneSeed.isInverted,
            logScale: laneSeed.logScale,
            name: getLaneName(laneSeed),
            offset: 0
        };
    };
    export const remove = (index: number): void =>
    {
        if (0 <= index && index < data.lanes.length)
        {
            data.lanes.splice(index, 1);
        }
        else
        {
            throw new Error(`🦋 FIXME: Model.remove: index out of range: ${index}`);
        }
    };
    export const initialize = () =>
    {
        data.anchor = Number.parse(Url.get("anchor")) ?? 100;
        console.log(`Model initialized: anchor=${data.anchor}`);
    };
}
