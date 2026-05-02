import * as Type from "./type";
import * as View from "./view";
import * as Model from "./model";
import config from "@resource/config.json";
export const AllItems = "$ALL";
const timelimit = config.render.ruler.frameRenderTimeLimit;
let renderRequested = false;
let dirty = new Set<string>();
let currentRenderer: (model: Type.Model, view: Type.View, dirty: Set<string>, timeLimit?: number) => unknown;
export const isDirty = (): boolean =>
    0 < dirty.size;
export const markDirty = (item?: string) =>
{
    dirty.add(item ?? AllItems);
    requestRender();
};
export const requestRender = () =>
{
    if ( ! renderRequested)
    {
        renderRequested = true;
        requestAnimationFrame
        (
            () =>
            {
                renderRequested = false;
                if (isDirty())
                {
                    currentRenderer(Model.data, View.data, dirty, performance.now() +timelimit);
                    requestRender();
                }
            }
        );
    }
};
export const resetDirty = (item: string) =>
{
    // if (undefined !== item)
    // {
        dirty.delete(item);
    // }
    // else
    // {
    //     dirty.clear();
    // }
};
export const setRenderer = (renderer: typeof currentRenderer) =>
    currentRenderer = renderer;

