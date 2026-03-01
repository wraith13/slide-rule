// import * as Model from "./model";
import * as Type from "./type";
import * as Environment from "./environment";
import * as View from "./view";
import * as Model from "./model";
import * as UI from "./ui";
import * as Render from "./render";
import * as Ruler from "./ruler";
import * as Grid from "./grid";
import * as Graph from "./graph";
import config from "@resource/config.json";
export const updateViewModeRoundBar = () => UI.updateRoundBar
(
    UI.viewModeButton,
    {
        low: 0 /Type.viewModeList.length,
        high: 1 /Type.viewModeList.length,
        rotate: Type.viewModeList.indexOf(View.getViewMode()) /Type.viewModeList.length,
    }
);
export const updateScaleModeRoundBar = () => UI.updateRoundBar
(
    UI.scaleModeButton,
    {
        low: 0 /Type.scaleModeList.length,
        high: 1 /Type.scaleModeList.length,
        rotate: Type.scaleModeList.indexOf(View.getScaleMode()) /Type.scaleModeList.length,
    }
);
export const zoomIn = (): void =>
    zoom(config.view.zooomUnit);
export const zoomOut = (): void =>
    zoom(-config.view.zooomUnit);
export const zoom = (delta: number): void =>
{
    const current = View.data.viewScaleExponent;
    const next = Math.min(config.view.maxZoomLevel, Math.max(config.view.minZoomLevel, current +delta));
    const lane = Model.getRootLane();
    const anchorValue = Model.getValueAt(lane, Model.data.anchor, View.data);
    View.setViewScaleExponent(next);
    const newAnchorPosition = Model.getPositionAt(lane, anchorValue, View.data);
    scroll(newAnchorPosition - Model.data.anchor);
    Render.markDirty();
    console.log(`Zoomed(${delta}): ${current} -> ${next}`);
};
export const scroll = (delta: number): void =>
{
    const rootLane = Model.getRootLane();
    const current = rootLane.offset;
    const next = current + delta;
    rootLane.offset = next;
    Render.markDirty();
    console.log(`Scrolled(${delta}): ${current} -> ${next}`);
};
export const resetZoom = (): void =>
{
    const current = View.data.viewScaleExponent;
    const next = config.view.defaultZoomLevel;
    View.setViewScaleExponent(next);
    Render.markDirty();
    console.log(`Zoom reset: ${current} -> ${next}`);
};
let touchZoomPreviousDistance: number | null = null;
const activeTouches = new Map<number, { x: number; y: number, type: string }>();
export const initialize = () =>
{
    console.log("Event initialized");
    window.addEventListener
    (
        "resize",
        () =>
        {
            Ruler.resize();
            Render.markDirty();
        }
    );
    window.addEventListener
    (
        "wheel",
        event =>
        {

            if (Environment.isApple() ? event.metaKey : event.ctrlKey)
            {
                event.preventDefault();
                zoom(event.deltaY * config.view.zoomRate);
            }
            else
            {
                scroll(event.deltaY);
            }
        },
        {
            passive: false,
        }
    );
    window.addEventListener
    (
        "keydown",
        event =>
        {
            if (Environment.isApple() ? event.metaKey : event.ctrlKey)
            {
                switch(event.key)
                {
                case "+":
                case ";":
                case "=":
                    event.preventDefault();
                    zoomIn();
                    break;
                case "-":
                case "_":
                    event.preventDefault();
                    zoomOut();
                    break;
                case "0":
                    event.preventDefault();
                    resetZoom();
                    break;
                default:
                    console.log(`Keydown event: key=${event.key}`);
                    break;
                }
            }
            else
            {
                switch(event.key)
                {
                case "ArrowUp":
                    event.preventDefault();
                    scroll(-config.view.scrollUnit);
                    break;
                case "ArrowDown":
                    event.preventDefault();
                    scroll(config.view.scrollUnit);
                    break;
                default:
                    console.log(`Keydown event: key=${event.key}`);
                    break;
                }
            }
        }
    );
    document.addEventListener
    (
        "pointerdown",
        event =>
        {
            //if ("touch" === event.pointerType)
            //{
                activeTouches.set(event.pointerId, { x: event.clientX, y: event.clientY, type: event.pointerType });
                // prevent default to avoid browser gestures interfering if desired
                // keep passive false on pointerdown to allow preventDefault if necessary
                event.preventDefault();
                touchZoomPreviousDistance = null;
            //}
        },
        {
            passive: false,
        }
    );

    document.addEventListener
    (
        "pointerup",
        event =>
        {
            //if ("touch" === event.pointerType)
            //{
                activeTouches.delete(event.pointerId);
                touchZoomPreviousDistance = null;
            //}
        },
        {
            passive: false,
        }
    );

    document.addEventListener
    (
        "pointercancel",
        event =>
        {
            //if ("touch" === event.pointerType)
            //{
                activeTouches.delete(event.pointerId);
                touchZoomPreviousDistance = null;
            //}
        },
        {
            passive: false,
        }
    );
    document.addEventListener
    (
        "pointermove",
        event =>
        {
            //if ("touch" === event.pointerType)
            //{
                if (activeTouches.has(event.pointerId))
                {
                    activeTouches.set(event.pointerId, { x: event.clientX, y: event.clientY, type: event.pointerType });
                    if (1 === activeTouches.size)
                    {
                        scroll(-event.movementY);
                    }
                    if (2 === activeTouches.size)
                    {
                        event.preventDefault();
                        const iter = activeTouches.values();
                        const a = iter.next().value;
                        const b = iter.next().value;
                        if (a && "touch" === a.type && b && "touch" === b.type)
                        {
                            const currentDistance = Math.hypot(b!.x - a!.x, b!.y - a!.y);
                            if (null !== touchZoomPreviousDistance)
                            {
                                const delta = currentDistance - touchZoomPreviousDistance;
                                if (Math.abs(delta) <= config.view.touchZoomThreshold)
                                {
                                    zoom(delta * config.view.zoomRate);
                                }
                            }
                            touchZoomPreviousDistance = currentDistance;
                        }
                        else
                        {
                            touchZoomPreviousDistance = null;
                        }
                    }
                    else
                    {
                        touchZoomPreviousDistance = null;
                    }
                }
            //}
        },
        {
            passive: false,
        }
    );
    UI.viewModeButton.addEventListener
    (
        "click",
        () =>
        {
            const current = View.getViewMode();
            const next = Type.getNext(Type.viewModeList, current);
            View.setViewMode(next);
            updateViewModeRoundBar();
            switch(next)
            {
            case "ruler":
                Render.setRenderer(Ruler.renderer);
                break;
            case "grid":
                Render.setRenderer(Grid.renderer);
                break;
            case "graph":
                Render.setRenderer(Graph.renderer);
                break;
            }
            Render.markDirty();
            console.log(`View mode changed: ${current} -> ${next}`);
        }
    );
    UI.scaleModeButton.addEventListener
    (
        "click",
        () =>
        {
            const current = View.getScaleMode();
            const next = Type.getNext(Type.scaleModeList, current);
            View.setScaleMode(next);
            updateScaleModeRoundBar();
            Render.markDirty();
            console.log(`Scale mode changed: ${current} -> ${next}`);
        }
    );
    updateViewModeRoundBar();
    updateScaleModeRoundBar();
};

