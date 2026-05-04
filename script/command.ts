import * as Locale from "./locale";
import * as Url from "./url";
import * as Type from "./type";
import * as UI from "./ui";
import * as Theme from "./theme";
import * as Model from "./model";
import * as View from "./view";
import * as Render from "./render";
import * as JsonEvalUpdater from "./json-eval-updater";
import digitSI from "@resource/digit/$si.json";
import digitEN from "@resource/digit/en.json";
import digitJA from "@resource/digit/ja.json";
import constantSize from "@resource/constant/size.json";
import constantArea from "@resource/constant/area.json";
import constantVolume from "@resource/constant/volume.json";
import constantMass from "@resource/constant/mass.json";
import constantTime from "@resource/constant/time.json";
import constantSpeed from "@resource/constant/speed.json";
import constantEnergy from "@resource/constant/energy.json";
import constantTemperature from "@resource/constant/temperature.json";
import constantCounting from "@resource/constant/counting.json";
import constantSoundFrequency from "@resource/constant/sound-frequency.json";
import constantEmwWavelength from "@resource/constant/emw-wavelength.json";
import constantEmwFrequency from "@resource/constant/emw-frequency.json";
import constantEmwEnergy from "@resource/constant/emw-energy.json";
import constantHistory from "@resource/constant/history.json";
const constant: { [key: string]: Type.ConstantTable } = { };
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
export const addDigitLane = (digitTable: Type.DigitTable) => addLane
({
    name: digitTable.label,
    type: "digit",
    digit: digitTable,
});
export const addSiDigitLane = () => addDigitLane(digitSI as unknown as Type.DigitTable);
export const addEnDigitLane = () => addDigitLane(digitEN as unknown as Type.DigitTable);
export const addJaDigitLane = () => addDigitLane(digitJA as unknown as Type.DigitTable);
export const AddConstantLane = (constant: Type.ConstantTable) => addLane
({
    name: constant.label,
    type: "constant",
    table: constant,
});
export const addSizeLane = () => AddConstantLane(constant["size"]);
export const addAreaLane = () => AddConstantLane(constant["area"]);
export const addVolumeLane = () => AddConstantLane(constant["volume"]);
export const addMassLane = () => AddConstantLane(constant["mass"]);
export const addTimeLane = () => AddConstantLane(constant["time"]);
export const addSpeedLane = () => AddConstantLane(constant["speed"]);
export const addEnergyLane = () => AddConstantLane(constant["energy"]);
export const addTemperatureLane = () => AddConstantLane(constant["temperature"]);
export const addCountingLane = () => AddConstantLane(constant["counting"]);
export const addSoundFrequencyLane = () => AddConstantLane(constant["sound-frequency"]);
export const addEmwWavelengthLane = () => AddConstantLane(constant["emw-wavelength"]);
export const addEmwFrequencyLane = () => AddConstantLane(constant["emw-frequency"]);
export const addEmwEnergyLane = () => AddConstantLane(constant["emw-energy"]);
export const addHistoryLane = () => AddConstantLane(constant["history"]);
export const saveImage = () =>
{
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(UI.rulerSvg);
    const blob = new Blob([source], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `smart-rule-${new Date().toISOString()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
};
export const updateLanguage = () =>
{
    Locale.setLocale(UI.SettingsPanel.languageSelect.value as any, Url.get("locale"));
    UI.updateLanguage();
    Render.markDirty();
};
export const updateTheme = () =>
{
    Theme.update();
    Render.markDirty();
};
export const initialize = () =>
{
    constant["size"] = JsonEvalUpdater.updateJsonWithEval(constantSize as unknown as JsonEvalUpdater.Json, "$SILENT") as unknown as Type.ConstantTable;
    constant["area"] = JsonEvalUpdater.updateJsonWithEval(constantArea as unknown as JsonEvalUpdater.Json, "$SILENT") as unknown as Type.ConstantTable;
    constant["volume"] = JsonEvalUpdater.updateJsonWithEval(constantVolume as unknown as JsonEvalUpdater.Json, "$SILENT") as unknown as Type.ConstantTable;
    constant["mass"] = JsonEvalUpdater.updateJsonWithEval(constantMass as unknown as JsonEvalUpdater.Json, "$SILENT") as unknown as Type.ConstantTable;
    constant["time"] = JsonEvalUpdater.updateJsonWithEval(constantTime as unknown as JsonEvalUpdater.Json, "$SILENT") as unknown as Type.ConstantTable;
    constant["speed"] = JsonEvalUpdater.updateJsonWithEval(constantSpeed as unknown as JsonEvalUpdater.Json, "$SILENT") as unknown as Type.ConstantTable;
    constant["energy"] = JsonEvalUpdater.updateJsonWithEval(constantEnergy as unknown as JsonEvalUpdater.Json, "$SILENT") as unknown as Type.ConstantTable;
    constant["temperature"] = JsonEvalUpdater.updateJsonWithEval(constantTemperature as unknown as JsonEvalUpdater.Json, "$SILENT") as unknown as Type.ConstantTable;
    constant["counting"] = JsonEvalUpdater.updateJsonWithEval(constantCounting as unknown as JsonEvalUpdater.Json, "$SILENT") as unknown as Type.ConstantTable;
    constant["sound-frequency"] = JsonEvalUpdater.updateJsonWithEval(constantSoundFrequency as unknown as JsonEvalUpdater.Json, "$SILENT") as unknown as Type.ConstantTable;
    constant["emw-wavelength"] = JsonEvalUpdater.updateJsonWithEval(constantEmwWavelength as unknown as JsonEvalUpdater.Json, "$SILENT") as unknown as Type.ConstantTable;
    constant["emw-frequency"] = JsonEvalUpdater.updateJsonWithEval(constantEmwFrequency as unknown as JsonEvalUpdater.Json, "$SILENT") as unknown as Type.ConstantTable;
    constant["emw-energy"] = JsonEvalUpdater.updateJsonWithEval(constantEmwEnergy as unknown as JsonEvalUpdater.Json, "$SILENT") as unknown as Type.ConstantTable;
    constant["history"] = JsonEvalUpdater.updateJsonWithEval(constantHistory as unknown as JsonEvalUpdater.Json, "$SILENT") as unknown as Type.ConstantTable;
    updateLanguage();
    updateTheme();
};
