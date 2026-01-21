import { Type } from "./type";
import { Url } from "./url";
import { UI } from "./ui";
import { Render } from "./render";
// import { Ruler } from "./ruler";
// import { Grid } from "./grid";
import config from "@resource/config.json";
export namespace View
{
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
    export const setViewMode = (mode: Type.ViewMode): void =>
    {
        data.viewMode = mode;
        Url.addParameter("view-mode", mode);
        document.body.classList.toggle("grid-view", isGridView());
        document.body.classList.toggle("ruler-view", isRulerView());
        UI.setAriaHidden(UI.rulerView, ! isRulerView());
        UI.setAriaHidden(UI.gridView, ! isGridView());
        // if (isRulerView())
        // {
        //     Render.setRenderer(Ruler.renderer);
        // }
        // else if (isGridView())
        // {
        //     Render.setRenderer(Grid.renderer);
        // }
        Render.markDirty();
    };
    export const initialize = () =>
    {
        setViewMode(Url.params["view-mode"] as Type.ViewMode ?? config.view?.defaultMode ?? "ruler");
        data.viewScale = Number(Url.params["view-scale"]) || 1;
        data.scaleMode = Url.params["scale-mode"] as Type.ScaleMode ?? config.view?.defaultScale ?? "logarithmic";
        data.baseOfLogarithm = Number(Type.getNamedNumberValue(Url.params["base"] as Type.NamedNumber))
            || config.view?.baseOfLogarithm?.default
            || 10;
        console.log(`View initialized: mode=${data.viewMode}, scale=${data.viewScale}, scaleMode=${data.scaleMode}, base=${data.baseOfLogarithm}`);
    };
}
