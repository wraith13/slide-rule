import * as Number from "./number";
import * as Type from "./type";
import * as Url from "./url";
import * as UI from "./ui";
import config from "@resource/config.json";
export const data: Type.View =
{
    viewMode: "ruler",
    viewScale: 1,
    scaleMode: "logarithmic",
    baseOfLogarithm: 10,
};
export const getViewMode = (): Type.ViewMode => data.viewMode;
export const isRulerView = (): boolean => data.viewMode === "ruler";
export const isGridView = (): boolean => data.viewMode === "grid";
export const isGraphView = (): boolean => data.viewMode === "graph";
export const setViewMode = (mode: Type.ViewMode): void =>
{
    data.viewMode = mode;
    Url.addParameter("view-mode", mode);
    document.body.classList.toggle("ruler-view", isRulerView());
    document.body.classList.toggle("grid-view", isGridView());
    document.body.classList.toggle("graph-view", isGraphView());
    UI.setAriaHidden(UI.rulerView, ! isRulerView());
    UI.setAriaHidden(UI.gridView, ! isGridView());
};
export const getScaleMode = (): Type.ScaleMode => data.scaleMode;
export const isLogarithmicScale = (): boolean => data.scaleMode === "logarithmic";
export const isLinearScale = (): boolean => data.scaleMode === "linear";
export const setScaleMode = (mode: Type.ScaleMode): void =>
{
    data.scaleMode = mode;
    Url.addParameter("scale-mode", mode);
    document.body.classList.toggle("logarithmic-scale", mode === "logarithmic");
    document.body.classList.toggle("linear-scale", mode === "linear");
};
export const initialize = () =>
{
    setViewMode(Url.get("view-mode") as Type.ViewMode ?? config.view?.defaultViewMode ?? "ruler");
    setScaleMode(Url.get("scale-mode") as Type.ScaleMode ?? config.view?.defaultScaleMode ?? "logarithmic");
    data.viewScale = Number.parse(Url.get("view-scale")) ?? 1;
    data.baseOfLogarithm = Number.orUndefined(Type.getNamedNumberValue(Url.get("base") as Type.NamedNumber)) ??
        config.view?.baseOfLogarithm?.default ??
        10;
    console.log(`View initialized: mode=${data.viewMode}, scale=${data.viewScale}, scaleMode=${data.scaleMode}, base=${data.baseOfLogarithm}`);
};

