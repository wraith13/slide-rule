// import * as Model from "./model";
import * as Type from "./type";
import * as Number from "./number";
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
export const getViewScaleRate = () =>
    (View.data.viewScaleExponent - config.view.minZoomLevel) / (config.view.maxZoomLevel - config.view.minZoomLevel);
export const getViewScaleExponentFromRate = (rate: number) =>
    config.view.minZoomLevel + (rate * (config.view.maxZoomLevel - config.view.minZoomLevel));
export const updateViewScaleRoundBar = () =>
{
    UI.updateRoundBar
    (
        UI.viewScaleButton,
        {
            low: 0,
            high: getViewScaleRate(),
            rotate: 0,
        }
    );
    UI.viewScaleRange.value = (getViewScaleRate() * 100).toString();
};
export const zoomIn = (): void =>
    zoom(config.view.zooomUnit);
export const zoomOut = (): void =>
    zoom(-config.view.zooomUnit);
export const getZoomCenter = (): number =>
{
    const { slide, lane } = Model.getRootSlideAndRootLane();
    const cursorPosition = Model.getPositionAt(slide, lane, Model.data.cursor, View.data);
    if (undefined !== cursorPosition && 0 <= cursorPosition && cursorPosition <= window.innerHeight)
    {
        return cursorPosition;
    }
    return window.innerHeight / 2;
};
export const zoom = (delta: number): void =>
{
    const current = View.data.viewScaleExponent;
    const next = Math.min(config.view.maxZoomLevel, Math.max(config.view.minZoomLevel, current +delta));
    const { slide, lane } = Model.getRootSlideAndRootLane();
    const zoomCenter = getZoomCenter();
    // const cursorValues = Model.getCursorValues(View.data);
    const centerValue = Model.getValueAt(slide, lane, zoomCenter, View.data) ?? (delta < 0 ? Number.MIN_VALUE : Number.MAX_VALUE);
    View.setViewScaleExponent(next);
    const temporaryCursorPosition = Model.getPositionAt(slide, lane, centerValue, View.data);
    verticalScroll("NOSNAP", temporaryCursorPosition - zoomCenter);
    // const newCursorPosition = Model.getPositionAt(slide, lane, centerValue, View.data);
    // for(let i = 1; i < cursorValues.length; ++i)
    // {
    //     const cursorValue = cursorValues[i];
    //     if (undefined !== cursorValue)
    //     {
    //         const slide = Model.data.slides[i];
    //         const lane = slide.lanes[0];
    //         const cursorPosition = Model.getPositionAt(slide, lane, cursorValue, View.data);
    //         shiftSlide(slide, cursorPosition -newCursorPosition);
    //     }
    // }
    Render.markDirty();
    updateViewScaleRoundBar();
    console.log(`Zoomed(${delta}): ${current} -> ${next}`);
};
export const zoomByRange = (value: number): void =>
    zoom(getViewScaleExponentFromRate(value *0.01) -View.data.viewScaleExponent);
export const shiftSlide = (event: Ruler.SnapPositionEvent, slide: Type.SlideUnit, delta: number): void =>
{
    const slideIndex = Model.getSlideIndex(slide);
    if (slideIndex <= 0)
    {
        const current = Model.data.offset.y;
        const next = current -delta;
        const lane = slide.lanes[0];
        const halfWindowHeight = window.innerHeight / 2;
        const minPosition = (Model.getRawPositionAt(lane, Number.MIN_VALUE, View.data) ?? -Number.MAX_VALUE) +halfWindowHeight;
        const maxPosition = (Model.getRawPositionAt(lane, Number.MAX_VALUE, View.data) ?? Number.MAX_VALUE) +halfWindowHeight;
        Model.data.offset.y = Math.min(maxPosition, Math.max(minPosition, next));
    }
    else
    {
        const previousSlide = Model.data.slides[slideIndex -1];
        const previousLane = previousSlide.lanes[previousSlide.lanes.length -1];
        const currentPosition = Model.getPositionAt(previousSlide, previousLane, slide.anchor, View.data);
        const nextPosition = currentPosition -(delta +verticalSnapDelta);
        const snappedNextPosition = Ruler.snapVerticalPosition(event, View.data, nextPosition, Model.getLaneIndex(previousLane));
        updateVerticalSnapDelta(snappedNextPosition - nextPosition);
        const nextValue = Model.getValueAt(previousSlide, previousLane, snappedNextPosition, View.data);
        if (undefined === nextValue)
        {
            console.warn(`🦋 FIXME: shiftSlide: nextValue is undefined, slideIndex=${slideIndex}, currentPosition=${currentPosition}, delta=${delta}`);
        }
        else
        {
            slide.anchor = Number.clamp(nextValue);
        }
    }
};
export const verticalScroll = (event: Ruler.SnapPositionEvent, delta: number, slide: Type.SlideUnit = Model.getRootSlide()): void =>
{
    // Model.data.slides.forEach(slide => shiftSlide(slide, delta));
    shiftSlide(event, slide, delta);
    Render.markDirty();
};
export const horizontalScroll = (event: Ruler.SnapPositionEvent, delta: number): void =>
{
    const current = Model.data.offset.x;
    const min = 0;
    const max = Math.max(0, Ruler.getRulerWidth() - (window.innerWidth -(UI.rulerNewSlidePanel.clientWidth +UI.rulerHelpPanel.clientWidth)));
    const next = Math.min(max, Math.max(min, current +delta -horizontalSnapDelta));
    const snappedPosition = Ruler.snapHorizontalPosition(event, next);
    updateHorizontalSnapDelta(snappedPosition - next);
    Model.data.offset.x = snappedPosition;
    Render.markDirty();
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
let verticalSnapDelta = 0;
const updateVerticalSnapDelta = (value: number): unknown =>
    verticalSnapDelta = Math.min(Math.max(value, -32), 32);
let horizontalSnapDelta = 0;
const updateHorizontalSnapDelta = (value: number): unknown =>
    horizontalSnapDelta = Math.min(Math.max(value, -200), 200);
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
            horizontalScroll("NOSNAP", 0);
            Render.markDirty();
        }
    );
    window.addEventListener
    (
        "wheel",
        event =>
        {

            if (Environment.isApple() ? (event.metaKey && event.ctrlKey): (event.ctrlKey && event.altKey))
            {
                event.preventDefault();
                const { slide, lane } = Model.getRootSlideAndRootLane();
                const cursorPosition = Model.getPositionAt(slide, lane, Model.data.cursor, View.data) ?? 0;
                updateVerticalSnapDelta(Ruler.slideCursor(Model.data, View.data, event, cursorPosition -(-event.deltaY +verticalSnapDelta)));
                const newCursorPosition = Model.getPositionAt(slide, lane, Model.data.cursor, View.data) ?? 0;
                const cursorDelta = newCursorPosition -cursorPosition;
                verticalScroll(event, cursorDelta, Model.getRootSlide());
            }
            else
            if (Environment.isApple() ? event.metaKey: event.ctrlKey)
            {
                event.preventDefault();
                zoom(event.deltaY * config.view.zoomRate);
            }
            else
            if (Environment.isApple() ? event.ctrlKey: event.altKey)
            {
                event.preventDefault();
                const { slide, lane } = Model.getRootSlideAndRootLane();
                const cursorPosition = Model.getPositionAt(slide, lane, Model.data.cursor, View.data) ?? 0;
                updateVerticalSnapDelta(Ruler.slideCursor(Model.data, View.data, event, cursorPosition -(event.deltaY +verticalSnapDelta)));
            }
            else
            {
                verticalScroll
                (
                    event,
                    event.deltaY,
                    Model.getSlideFromLane
                    (
                        Model.getLane
                        (
                            Ruler.getLaneIndexFromPosition(event.clientX +Model.data.offset.x) ?? 0
                        )
                    )
                );
                horizontalScroll(event, event.deltaX);
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
                    verticalScroll(event, -config.view.scrollUnit);
                    break;
                case "ArrowDown":
                    event.preventDefault();
                    verticalScroll(event, config.view.scrollUnit);
                    break;
                case "ArrowLeft":
                    event.preventDefault();
                    horizontalScroll(event, config.view.scrollUnit);
                    break;
                case "ArrowRight":
                    event.preventDefault();
                    horizontalScroll(event, -config.view.scrollUnit);
                    break;
                default:
                    console.log(`Keydown event: key=${event.key}`);
                    break;
                }
            }
        }
    );
    UI.viewList.addEventListener
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
    UI.viewList.addEventListener
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
    UI.viewList.addEventListener
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
    let pointerMoveTimeout: ReturnType<typeof setTimeout> | null = null;
    const clearPointerMoveTimeout = () =>
    {
        if (null !== pointerMoveTimeout)
        {
            clearTimeout(pointerMoveTimeout);
            pointerMoveTimeout = null;
        }
    };
    const forcePointerClear = () =>
    {
        clearPointerMoveTimeout();
        activeTouches.clear();
        touchZoomPreviousDistance = null;
    };
    UI.viewList.addEventListener
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
                        verticalScroll
                        (
                            event,
                            -event.movementY,
                            Model.getSlideFromLane
                            (
                                Model.getLane
                                (
                                    Ruler.getLaneIndexFromPosition(event.clientX +Model.data.offset.x) ?? 0
                                )
                            )
                        );
                        horizontalScroll(event, -event.movementX);
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
                clearPointerMoveTimeout();
                pointerMoveTimeout = setTimeout(forcePointerClear, 350);
            //}
        },
        {
            passive: false,
        }
    );
    UI.viewModeButton.addEventListener
    (
        "click",
        event =>
        {
            event.preventDefault();
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
        event =>
        {
            event.preventDefault();
            const current = View.getScaleMode();
            const next = Type.getNext(Type.scaleModeList, current);
            const { slide, lane } = Model.getRootSlideAndRootLane();
            const anchorValue = Model.getValueAt(slide, lane, Model.data.cursor, View.data);
            View.setScaleMode(next);
            if (undefined !== anchorValue)
            {
                const newAnchorPosition = Model.getPositionAt(slide, lane, anchorValue, View.data);
                verticalScroll(event, newAnchorPosition - Model.data.cursor);
            }
            updateScaleModeRoundBar();
            Render.markDirty();
            console.log(`Scale mode changed: ${current} -> ${next}`);
        }
    );
    UI.viewScaleButton.addEventListener
    (
        "click",
        event =>
        {
            event.preventDefault();
            UI.viewScalePanel.classList.toggle("show", UI.viewScaleButton.classList.toggle("on"));
        }
    );
    UI.viewScaleRange.addEventListener
    (
        "input",
        () => zoomByRange(UI.viewScaleRange.valueAsNumber)
    );
    UI.viewScaleRange.addEventListener
    (
        "change",
        () => zoomByRange(UI.viewScaleRange.valueAsNumber)
    );
    UI.addSlideButton.addEventListener
    (
        "click",
        event =>
        {
            event.preventDefault();
            const { slide: lastSlide, lane: lastLane } = Model.getLastSlideAndLastLane();
            const lastValue = Model.getCursorValue(lastSlide, lastLane, View.data) ?? 1;
            const slide = Model.makeSlide(lastValue);
            slide.lanes.push
            (
                Model.makeLane
                ({
                    type: "logarithmic",
                    isInverted: false,
                    logScale: "e"
                })
            );
            Model.data.slides.push(slide);
            Render.markDirty();
        }
    );
    UI.addLaneButton.addEventListener
    (
        "click",
        event =>
        {
            event.preventDefault();
            const { slide } = Model.getLastSlideAndLastLane();
            const lane = Model.makeLane
            ({
                type: "logarithmic",
                isInverted: true,
                logScale: "e"
            });
            slide.lanes.push(lane);
            Render.markDirty();
        }
    );
    updateViewModeRoundBar();
    updateScaleModeRoundBar();
    updateViewScaleRoundBar();
    shiftSlide("NOSNAP", Model.getRootSlide(), Model.getCursorPosition(View.data) -(window.innerHeight /2));
};
