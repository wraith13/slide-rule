import { Type } from "./type";
import { Url } from "./url";
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
    }
    export const initialize = () =>
    {
        data.anchor = Number(Url.params["anchor"]) || 100;
        console.log(`Model initialized: anchor=${data.anchor}`);
    };
}
