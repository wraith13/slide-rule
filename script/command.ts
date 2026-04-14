import * as Type from "./type";
import * as Model from "./model";
import * as Render from "./render";
import constantSize from "@resource/constant/size.json";
import constantMass from "@resource/constant/mass.json";
export const addLane = (laneSeed: Type.LaneBase) =>
{
    const { slide } = Model.getLastSlideAndLastLane();
    const lane = Model.makeLane(laneSeed);
    slide.lanes.push(lane);
    Render.markDirty();
};
export const addSizeLane = () => addLane
({
        name: constantSize.label,
        type: "constant",
        table: constantSize as Type.ContantTable,
});
export const addMassLane = () => addLane
({
    name: constantMass.label,
    type: "constant",
    table: constantMass as Type.ContantTable,
});
