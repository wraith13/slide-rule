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
export const addDigitLane = (digitTable: Model.DigitTableKey) =>
{
    const { slide } = Model.getLastSlideAndLastLane();
    Model.addDigitLane(slide, digitTable);
    Render.markDirty();
};
export const addSiDigitLane = () => addDigitLane("si");
export const addEnDigitLane = () => addDigitLane("en");
export const addJaDigitLane = () => addDigitLane("ja");
export const addConstantLane = (constantTableKey: Model.ConstantTableKey) =>
{
    const { slide } = Model.getLastSlideAndLastLane();
    Model.addConstantLane(slide, constantTableKey);
    Render.markDirty();
};
export const addSizeLane = () => addConstantLane("size");
export const addAreaLane = () => addConstantLane("area");
export const addVolumeLane = () => addConstantLane("volume");
export const addMassLane = () => addConstantLane("mass");
export const addTimeLane = () => addConstantLane("time");
export const addSpeedLane = () => addConstantLane("speed");
export const addEnergyLane = () => addConstantLane("energy");
export const addTemperatureLane = () => addConstantLane("temperature");
export const addCountingLane = () => addConstantLane("counting");
export const addSoundFrequencyLane = () => addConstantLane("sound-frequency");
export const addEmwWavelengthLane = () => addConstantLane("emw-wavelength");
export const addEmwFrequencyLane = () => addConstantLane("emw-frequency");
export const addEmwEnergyLane = () => addConstantLane("emw-energy");
export const addHistoryLane = () => addConstantLane("history");
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
    url.searchParams.set("m", JSON.stringify(Model.data));
    url.searchParams.set("v", JSON.stringify(View.data));
    url.searchParams.set("s", JSON.stringify(Settings.getAllSettings()));
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
export const loadFromUrl = () =>
{
    const modelData = Url.get("m");
    const viewData = Url.get("v");
    const settingsData = Url.get("s");
    if (modelData && viewData && settingsData)
    {
        try
        {
            Object.assign(Model.data, JSON.parse(modelData));
            Object.assign(View.data, JSON.parse(viewData));
            Settings.applySettings(JSON.parse(settingsData) as ReturnType<typeof Settings.getAllSettings>);
            Render.markDirty();
        }
        catch (e)
        {
            alert(Locale.map("Failed to load from URL.") + `: ${e}`);
        }
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
    updateLanguage();
    updateTheme();
};
