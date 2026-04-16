import * as Type from "./type";
import * as Model from "./model";
import * as Render from "./render";
import constantSize from "@resource/constant/size.json";
import constantMass from "@resource/constant/mass.json";
import constantTime from "@resource/constant/time.json";
import constantSpeed from "@resource/constant/speed.json";
import constantWavelength from "@resource/constant/em-wavelength.json";
export const addLane = (laneSeed: Type.LaneBase) =>
{
    const { slide } = Model.getLastSlideAndLastLane();
    const lane = Model.makeLane(laneSeed);
    slide.lanes.push(lane);
    Render.markDirty();
};
export const AddConstantLane = (constant: Type.ContantTable) => addLane
({
    name: constant.label,
    type: "constant",
    table: constant,
});
export const addSizeLane = () => AddConstantLane(constantSize as Type.ContantTable);
export const addMassLane = () => AddConstantLane(constantMass as Type.ContantTable);
export const addTimeLane = () => AddConstantLane(constantTime as Type.ContantTable);
export const addSpeedLane = () => AddConstantLane(constantSpeed as Type.ContantTable);
export const addEmWavelengthLane = () => AddConstantLane(constantWavelength as Type.ContantTable);

