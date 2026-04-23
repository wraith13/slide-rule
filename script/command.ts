import * as Type from "./type";
import * as Model from "./model";
import * as View from "./view";
import * as Render from "./render";
import constantSize from "@resource/constant/size.json";
import constantMass from "@resource/constant/mass.json";
import constantTime from "@resource/constant/time.json";
import constantSpeed from "@resource/constant/speed.json";
import constantTemperature from "@resource/constant/temperature.json";
import constantHistory from "@resource/constant/history.json";
import constantEMWavelength from "@resource/constant/em-wavelength.json";
export const addSlide = () =>
{
    const { slide: lastSlide, lane: lastLane } = Model.getLastSlideAndLastLane();
    const lastValue = Model.getCursorValue(lastSlide, lastLane, View.data)?.value ?? 1;
    const slide = Model.makeSlide(lastValue);
    slide.lanes.push
    (
        Model.makeLane
        ({
            type: "logarithmic",
        })
    );
    Model.data.slides.push(slide);
    Render.markDirty();
};
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
export const addTemperatureLane = () => AddConstantLane(constantTemperature as Type.ContantTable);
export const addHistoryLane = () => AddConstantLane(constantHistory as Type.ContantTable);
export const addEmWavelengthLane = () => AddConstantLane(constantEMWavelength as Type.ContantTable);

