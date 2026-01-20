import { Url } from "./url";
import { Type } from "./type";
import config from "@resource/config.json";
export namespace View
{
    export type ViewMode = "grid" | "ruler";
    export let viewMode: ViewMode;
    export let viewScale: number;
    export type ScaleMode = "linear" | "logarithmic";
    export let scaleMode: ScaleMode;
    export let baseOfLogarithm: Type.NamedNumber;
    export const initialize = () =>
    {
        viewMode = Url.params["view-mode"] as ViewMode ?? config.view?.defaultMode ?? "ruler";
        viewScale = Number(Url.params["view-scale"]) || 1;
        scaleMode = Url.params["scale-mode"] as ScaleMode ?? config.view?.defaultScale ?? "logarithmic";
        baseOfLogarithm = Number(Type.getNamedNumberValue(Url.params["base"] as Type.NamedNumber))
            || config.view?.baseOfLogarithm?.default
            || 10;
    };
}
