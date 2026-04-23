import * as Type from "./type";
import * as Model from "./model";
import * as View from "./view";
import * as Render from "./render";
import * as JsonEvalUpdater from "./json-eval-updater";
import constantSize from "@resource/constant/size.json";
import constantMass from "@resource/constant/mass.json";
import constantTime from "@resource/constant/time.json";
import constantSpeed from "@resource/constant/speed.json";
import constantTemperature from "@resource/constant/temperature.json";
import constantHistory from "@resource/constant/history.json";
import constantEMWavelength from "@resource/constant/em-wavelength.json";
const constant: { [key: string]: Type.ContantTable } = { };
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
export const addSizeLane = () => AddConstantLane(constant["size"]);
export const addMassLane = () => AddConstantLane(constant["mass"]);
export const addTimeLane = () => AddConstantLane(constant["time"]);
export const addSpeedLane = () => AddConstantLane(constant["speed"]);
export const addTemperatureLane = () => AddConstantLane(constant["temperature"]);
export const addHistoryLane = () => AddConstantLane(constant["history"]);
export const addEmWavelengthLane = () => AddConstantLane(constant["em-wavelength"]);
export const initialize = () =>
{
    constant["size"] = JsonEvalUpdater.updateJsonWithEval(constantSize as JsonEvalUpdater.Json, "$SLIENT") as unknown as Type.ContantTable;
    constant["mass"] = JsonEvalUpdater.updateJsonWithEval(constantMass as JsonEvalUpdater.Json, "$SLIENT") as unknown as Type.ContantTable;
    constant["time"] = JsonEvalUpdater.updateJsonWithEval(constantTime as JsonEvalUpdater.Json, "$SLIENT") as unknown as Type.ContantTable;
    constant["speed"] = JsonEvalUpdater.updateJsonWithEval(constantSpeed as JsonEvalUpdater.Json, "$SLIENT") as unknown as Type.ContantTable;
    constant["temperature"] = JsonEvalUpdater.updateJsonWithEval(constantTemperature as JsonEvalUpdater.Json, "$SLIENT") as unknown as Type.ContantTable;
    constant["history"] = JsonEvalUpdater.updateJsonWithEval(constantHistory as JsonEvalUpdater.Json, "$SLIENT") as unknown as Type.ContantTable;
    constant["em-wavelength"] = JsonEvalUpdater.updateJsonWithEval(constantEMWavelength as JsonEvalUpdater.Json, "$SLIENT") as unknown as Type.ContantTable;
};