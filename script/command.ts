import * as Locale from "./locale";
import * as Url from "./url";
import * as Type from "./type";
import * as UI from "./ui";
import * as Settings from "./settings";
import * as Theme from "./theme";
import * as Model from "./model";
import * as View from "./view";
import * as Render from "./render";
import * as Ruler from "./ruler";
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
export const addSlide = (laneSeed: Type.LaneBase) =>
{
    const { slide: lastSlide, lane: lastLane } = Model.getLastSlideAndLastLane();
    const lastValue = Model.getCursorValue(lastSlide, lastLane, View.data)?.value ?? 1;
    const slide = Model.makeSlide(lastValue);
    slide.lanes.push(Model.makeLane(laneSeed));
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
    unit: constant.unit,
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
export const saveAsSvgImage = () =>
{
    if (!UI.SavePanel.includeCursorCheckbox.checked)
    {
        Ruler.renderer(Model.data, View.data, new Set(["ANCHOR_LINE"]), undefined, { showCursor: false });
        Render.markDirty("ANCHOR_LINE"); // 保存が終わったらカーソルを描画させる様にリクエストしておく。 / EN: Request to draw the cursor after saving.
    }
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
export const saveAsPngImage = () =>
{
    const canvas = document.createElement("canvas");
    canvas.width = UI.rulerSvg.viewBox.baseVal.width;
    canvas.height = UI.rulerSvg.viewBox.baseVal.height;
    const ctx = canvas.getContext("2d");
    if (ctx)
    {
        if (!UI.SavePanel.includeCursorCheckbox.checked)
        {
            Ruler.renderer(Model.data, View.data, new Set(["ANCHOR_LINE"]), undefined, { showCursor: false });
        }
        const img = new Image();
        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(UI.rulerSvg);
        const url = URL.createObjectURL(new Blob([source], { type: "image/svg+xml" }));
        img.onload = () =>
        {
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);
            canvas.toBlob
            (
                (blob) =>
                {
                    if (blob)
                    {
                        const pngUrl = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = pngUrl;
                        a.download = `smart-rule-${new Date().toISOString()}.png`;
                        a.click();
                        URL.revokeObjectURL(pngUrl);
                    }
                },
                "image/png"
            );
            Render.markDirty("ANCHOR_LINE");
        };
        img.src = url;
    }
};
export const copyAsUrl = () =>
{
    const url = new URL(window.location.href.replace(/#/g, "?"));
    url.searchParams.set("mode", JSON.stringify(Model.data));
    url.searchParams.set("view", JSON.stringify(View.data));
    url.searchParams.set("settings", JSON.stringify(Settings.getAllSettings()));
    const text = url.toString().replace(/\?/g, "#");
    if (navigator.clipboard)
    {
        navigator.clipboard.writeText(text).then
        (
            () => alert(Locale.map("URL copied to clipboard.")),
            (err) => alert(Locale.map("Failed to copy URL to clipboard.") + `: ${err}`)
        );
    }
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
    constant["size"] = JsonEvalUpdater.updateJsonWithEval(constantSize as unknown as JsonEvalUpdater.Json, "$SILENT.size") as unknown as Type.ConstantTable;
    constant["area"] = JsonEvalUpdater.updateJsonWithEval(constantArea as unknown as JsonEvalUpdater.Json, "$SILENT.area") as unknown as Type.ConstantTable;
    constant["volume"] = JsonEvalUpdater.updateJsonWithEval(constantVolume as unknown as JsonEvalUpdater.Json, "$SILENT.volume") as unknown as Type.ConstantTable;
    constant["mass"] = JsonEvalUpdater.updateJsonWithEval(constantMass as unknown as JsonEvalUpdater.Json, "$SILENT.mass") as unknown as Type.ConstantTable;
    constant["time"] = JsonEvalUpdater.updateJsonWithEval(constantTime as unknown as JsonEvalUpdater.Json, "$SILENT.time") as unknown as Type.ConstantTable;
    constant["speed"] = JsonEvalUpdater.updateJsonWithEval(constantSpeed as unknown as JsonEvalUpdater.Json, "$SILENT.speed") as unknown as Type.ConstantTable;
    constant["energy"] = JsonEvalUpdater.updateJsonWithEval(constantEnergy as unknown as JsonEvalUpdater.Json, "$SILENT.energy") as unknown as Type.ConstantTable;
    constant["temperature"] = JsonEvalUpdater.updateJsonWithEval(constantTemperature as unknown as JsonEvalUpdater.Json, "$SILENT.temperature") as unknown as Type.ConstantTable;
    constant["counting"] = JsonEvalUpdater.updateJsonWithEval(constantCounting as unknown as JsonEvalUpdater.Json, "$SILENT.counting") as unknown as Type.ConstantTable;
    constant["sound-frequency"] = JsonEvalUpdater.updateJsonWithEval(constantSoundFrequency as unknown as JsonEvalUpdater.Json, "$SILENT.sound-frequency") as unknown as Type.ConstantTable;
    constant["emw-wavelength"] = JsonEvalUpdater.updateJsonWithEval(constantEmwWavelength as unknown as JsonEvalUpdater.Json, "$SILENT.emw-wavelength") as unknown as Type.ConstantTable;
    constant["emw-frequency"] = JsonEvalUpdater.updateJsonWithEval(constantEmwFrequency as unknown as JsonEvalUpdater.Json, "$SILENT.emw-frequency") as unknown as Type.ConstantTable;
    constant["emw-energy"] = JsonEvalUpdater.updateJsonWithEval(constantEmwEnergy as unknown as JsonEvalUpdater.Json, "$SILENT.emw-energy") as unknown as Type.ConstantTable;
    constant["history"] = JsonEvalUpdater.updateJsonWithEval(constantHistory as unknown as JsonEvalUpdater.Json, "$SILENT.history") as unknown as Type.ConstantTable;
    updateLanguage();
    updateTheme();
};
