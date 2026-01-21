import { Type } from "./type";
import { View } from "./view";
import { Model } from "./model";
export namespace Render
{
    let dirty: boolean | Set<number> = false;
    let currentRenderer: (model: Type.Model, view: Type.View, dirty: boolean | Set<number>) => unknown;
    export const isDirty = (): boolean =>
        false !== dirty;
    export const markDirty = (laneIndex?: number) =>
    {
        const isFirstDirty = ! isDirty();
        if (undefined !== laneIndex)
        {
            if (false === dirty)
            {
                dirty = new Set<number>();
            }
            if (dirty instanceof Set)
            {
                dirty.add(laneIndex);
            }
        }
        else
        {
            dirty = true;
        }
        if (isFirstDirty)
        {
            requestAnimationFrame
            (
                () =>
                {
                    currentRenderer(Model.data, View.data, dirty);
                    dirty = false;
                }
            );
        }
    };
    export const setRenderer = (renderer: typeof currentRenderer) =>
        currentRenderer = renderer;
}
