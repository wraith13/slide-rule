import * as Type from "./type";
import * as Number from "./number";
import * as Model from "./model";
import * as UI from "./ui";
import * as Render from "./render";
import * as SVG from "./svg";
import config from "@resource/config.json";
export let scale = 1.0;
export let LaneWidths: number[] = [];
//export const snapTargetPositions: number[][] = [];
export const renderer = (model: Type.Model, view: Type.View, dirty: boolean | Set<number>) =>
{
    if (false !== dirty)
    {
        if (true === dirty)
        {
            drawDefines(model, view);
        }
        for(const slide of model.slides)
        {
            if ("boolean" === typeof dirty || dirty.has(Model.getSlideIndex(slide)))
            {
                drawSlide(view, slide);
            }
        }
        //if (...)
        //{
            drawMenuLane(view);
        //}
        if (true === dirty || dirty.has(-1))
        {
            drawAnchorLine(model, view);
        }
    }
};
export const getLaneIndexFromPosition = (position: number): number | null =>
{
    let accumulatedWidth = 0;
    for(let i = 0; i < LaneWidths.length; i++)
    {
        accumulatedWidth += LaneWidths[i];
        if (position < accumulatedWidth)
        {
            return i;
        }
    }
    return null;
};
export const drawDefines = (model: Type.Model, view: Type.View) =>
{
    const defs = SVG.makeSure
    (
        UI.rulerSvg,
        {
            tag: "defs",
        }
    );
    drawErrorAreaDefines(model, view, defs);
};
export const drawErrorAreaDefines = (_model: Type.Model, _view: Type.View, defs: SVGDefsElement) =>
{
    const minErrorAreaGradient = SVG.makeSure
    (
        defs,
        {
            tag: "linearGradient",
            id: "min-error-area-gradient",
            x1: "0%",
            y1: "0%",
            x2: "0%",
            y2: "100%",
        }
    );
    SVG.makeSure
    (
        minErrorAreaGradient,
        {
            tag: "stop",
            offset: "0%",
            "stop-color": config.render.ruler.minErrorAreaColor,
            "stop-opacity": 1,
        }
    );
    SVG.makeSure
    (
        minErrorAreaGradient,
        {
            tag: "stop",
            offset: "100%",
            "stop-color": config.render.ruler.minErrorAreaColor,
            "stop-opacity": 0,
        }
    );
    const maxErrorAreaGradient = SVG.makeSure
    (
        defs,
        {
            tag: "linearGradient",
            id: "max-error-area-gradient",
            x1: "0%",
            y1: "0%",
            x2: "0%",
            y2: "100%",
        }
    );
    SVG.makeSure
    (
        maxErrorAreaGradient,
        {
            tag: "stop",
            offset: "0%",
            "stop-color": config.render.ruler.maxErrorAreaColor,
            "stop-opacity": 0,
        }
    );
    SVG.makeSure
    (
        maxErrorAreaGradient,
        {
            tag: "stop",
            offset: "100%",
            "stop-color": config.render.ruler.maxErrorAreaColor,
            "stop-opacity": 1,
        }
    );
};
export const drawSlide = (view: Type.View, slide: Type.SlideUnit): void =>
{
    const slideIndex = Model.getSlideIndex(slide);
    const group = SVG.makeSure
    (
        UI.rulerSvg,
        {
            tag: "g",
            class: "slide-group",
            "data-slide-index": slideIndex,
        }
    );
    group.innerHTML = "";
    for(const lane of slide.lanes)
    {
        drawLane(view, group, slide, lane);
    }
};
export const getLeftOfLane = (laneIndex: number): number =>
    LaneWidths.slice(0, laneIndex).reduce((a, b) => a + b, 0) -Model.data.offset.x;
export const drawLane = (view: Type.View, group: SVGGElement, slide: Type.SlideUnit, lane: Type.Lane): void =>
{
    const laneIndex = Model.getLaneIndex(lane);
    const left = getLeftOfLane(laneIndex);
    const width = config.render.ruler.laneWidth;;
    LaneWidths[laneIndex] = width;
    const tickGroup = SVG.makeSure
    (
        group,
        {
            tag: "g",
            class: "tick-group",
        }
    );
    group.append
    (
        SVG.make
        ({
            tag: "rect",
            class: "lane-background",
            x: left,
            y: 0,
            width: width,
            height: group.ownerSVGElement!.viewBox.baseVal.height,
            fill: config.render.ruler.laneBackgroundColor,
        }),
        tickGroup,
        SVG.make
        ({
            tag: "rect",
            class: "lane-label-background",
            x: left + 8,
            y: 8,
            rx: 8,
            ry: 8,
            width: width - 16,
            height: 24,
            fill: config.render.ruler.laneLabelBackgroundColor,
        }),
        SVG.make
        ({
            tag: "text",
            class: "lane-label",
            x: left + 16,
            y: 26,
            fill: "#000000",
            "font-size": 16,
            textContent: lane.name ?? `Lane ${laneIndex}`,
        }),
        SVG.make
        ({
            tag: "line",
            class: "lane-separator",
            x1: left + width,
            y1: 0,
            x2: left + width,
            y2: group.ownerSVGElement!.viewBox.baseVal.height,
            stroke: config.render.ruler.laneSeparatorColor,
            "stroke-width": config.render.ruler.laneSeparatorWidth,
        })
    );
    drawErrorArea(view, tickGroup, slide, lane);
    const ticks = Model.designTicks(slide, view, lane, Model.makeTickWindowFromView(slide, lane, view));
    // snapTargetPositions[laneIndex] = [];
    ticks.forEach
    (
        tick => drawTick(view, tickGroup, slide, lane, tick)
    );
};
export const drawErrorArea = (view: Type.View, group: SVGGElement, slide: Type.SlideUnit, lane: Type.Lane): void =>
{
    const laneIndex = Model.getLaneIndex(lane);
    const left = getLeftOfLane(laneIndex);
    const width = config.render.ruler.laneWidth;;
    const height = window.innerHeight;
    const min = Math.max(Model.getValueAt(slide, lane, 0, view) ?? Number.MIN_VALUE, Number.MIN_VALUE);
    if (min <= Number.MIN_VALUE)
    {
        const minPosition = Model.getPositionAt(slide, lane, Number.MIN_VALUE, view);
        group.appendChild
        (
            SVG.make
            ({
                tag: "rect",
                class: "error-area",
                x: left,
                y: 0,
                width: width,
                height: minPosition,
                fill: "url(#min-error-area-gradient)",
            })
        );
    }
    const max = Math.min(Model.getValueAt(slide, lane, height, view) ?? Number.MAX_VALUE, Number.MAX_VALUE);
    if (Number.MAX_VALUE <=max)
    {
        const maxPosition = Model.getPositionAt(slide, lane, Number.MAX_VALUE, view);
        group.appendChild
        (
            SVG.make
            ({
                tag: "rect",
                class: "error-area",
                x: left,
                y: maxPosition,
                width: width,
                height: group.ownerSVGElement!.viewBox.baseVal.height - maxPosition,
                fill: "url(#max-error-area-gradient)",
            })
        );
    }
};
export const makeNumberLabel = (value: Type.NamedNumber): string =>
{
    if (Type.isNamedNumber(value))
    {
        return Type.getNamedNumberLabel(value);
    }
    else
    {
        if (value < 0.001 || 100000000 <= value)
        {
            return Type.getNamedNumberLabel(value, undefined, { notation: "scientific", minimumSignificantDigits: 6, maximumSignificantDigits: 6, });
            // return Type.getNamedNumberLabel(value, undefined, { notation: "compact", compactDisplay: "long" });
        }
        else
        {
            return Type.getNamedNumberLabel(value, undefined, { maximumFractionDigits: 8, });
            // return Type.getNamedNumberLabel(value, undefined, { notation: "compact", compactDisplay: "long" });
        }
    }
};
export const drawTick = (view: Type.View, group: SVGGElement, slide: Type.SlideUnit, lane: Type.Lane, tick: Type.Tick): void =>
{
    const isPrimaryLane = Model.isPrimaryLane(lane);
    const isPrimaryTick = isPrimaryLane && 1 === tick.value;
    const laneIndex = Model.getLaneIndex(lane);
    const position = Model.getPositionAt(slide, lane, Type.getNamedNumberValue(tick.value), view);
    // snapTargetPositions[laneIndex].push(position);
    const isRootSlide = Model.isRootSlide(Model.getSlideFromLane(lane));
    const width = config.render.ruler.laneWidth;;
    const left = getLeftOfLane(laneIndex);
    const right = left + width;
    const color = tick.color ?? (isPrimaryTick ? config.render.ruler.primaryTickColor:config.render.ruler.tick[tick.type].color);
    group.appendChild
    (
        SVG.make
        ({
            tag: "line",
            class: `tick tick-${tick.type}`,
            x1: isRootSlide ? right : left,
            y1: position,
            x2: isRootSlide ? right - config.render.ruler.tick[tick.type].length : left + config.render.ruler.tick[tick.type].length,
            y2: position,
            // stroke: config.render.ruler.tick[tick.type].color,
            stroke: color,
            "stroke-width": config.render.ruler.tick[tick.type].width,
        })
    );
    if (tick.type === "long")
    {
        group.appendChild
        (
            SVG.make
            ({
                tag: "text",
                class: "tick-label",
                x: isRootSlide ? right - config.render.ruler.tick[tick.type].length - 4 : left + config.render.ruler.tick[tick.type].length + 4,
                y: position + 4,
                //fill: config.render.ruler.tick[tick.type].color,
                fill: color,
                "font-size": 12,
                "text-anchor": isRootSlide ? "end" : "start",
                textContent: makeNumberLabel(tick.value),
            })
        );
    }
};
let anchorDragStartY = 0;
let initialDraggingAnchorPosition: number | undefined = undefined;
export type SnapPositionEvent = KeyboardEvent | PointerEvent | WheelEvent | TouchEvent | MouseEvent | "NOSNAP";
export const snapPosition = (event: SnapPositionEvent, view: Type.View, position: number, referenceLaneIndex?: number): number =>
{
    if ("NOSNAP" !== event && event.shiftKey)
    {
        const laneIndex = referenceLaneIndex ??
            (("clientX" in event) ? (getLaneIndexFromPosition(event.clientX +Model.data.offset.x) ?? 0) : 0);
        const { slide, lane } = Model.getSlideAndLane(laneIndex);
        const ticks = Model.designTicks(slide, view, lane, Model.makeTickWindowFromPosition(slide, lane, view, position, 32));
        const tickPositions = ticks.map(i => Model.getPositionAt(slide, lane, Type.getNamedNumberValue(i.value), view));
        let snappedPosition = position;
        let minDistance = Number.MAX_VALUE;
        tickPositions.forEach
        // snapTargetPositions[laneIndex].forEach
        (
            targetPosition =>
            {
                const distance = Math.abs(position - targetPosition);
                if (distance < minDistance)
                {
                    minDistance = distance;
                    snappedPosition = targetPosition;
                }
            }
        );
        return snappedPosition;
    }
    else
    {
        return position;
    }
};
export const slideAnchor = (model: Type.Model, view: Type.View, event: PointerEvent | WheelEvent, position: number): number =>
{
    const { slide, lane } = Model.getSlideAndLane(getLaneIndexFromPosition(event.clientX) ?? 0);
    const minPosition = Model.getPositionAt(slide, lane, Number.MIN_VALUE, view) ?? -Number.MAX_VALUE;
    const maxPosition = Model.getPositionAt(slide, lane, Number.MAX_VALUE, view) ?? Number.MAX_VALUE;
    const snappedPosition = snapPosition(event, view, position);
    const resultPosition = Math.min(maxPosition, Math.max(minPosition, snappedPosition));
    model.cursor = Model.getValueAt(slide, lane, resultPosition, view) ?? model.cursor;
    Render.markDirty();
    return snappedPosition -position;
};
export const drawAnchorLine = (model: Type.Model, view: Type.View): void =>
{
    const { slide, lane } = Model.getRootSlideAndRootLane();
    const svg = UI.rulerOverlay;
    const color = config.render.ruler.lineColor;
    const handleRadius = 24;
    const line = SVG.makeSure
    (
        svg,
        {
            tag: "line",
            class: "anchor-line",
        }
    );
    const events: SVG.Events =
    {
        pointermove:
        {
            listener: event =>
            {
                if (undefined !== initialDraggingAnchorPosition)
                {
                    event.stopPropagation();
                    const deltaY = event.clientY - anchorDragStartY;
                    slideAnchor(model, view, event, initialDraggingAnchorPosition + deltaY);
                }
            },
            options:
            {
                passive: false,
            }
        },
        pointerup:
        {
            listener: event =>
            {
                if (undefined !== initialDraggingAnchorPosition)
                {
                    event.stopPropagation();
                    const deltaY = event.clientY - anchorDragStartY;
                    slideAnchor(model, view, event, initialDraggingAnchorPosition + deltaY);
                }
                SVG.removeEvents(UI.rulerOverlay, events);
                SVG.setAttribute(UI.rulerOverlay, "pointer-events", "none");
            },
            options:
            {
                passive: false,
            }
        },
        pointercancel:
        {
            listener: event =>
            {
                if (undefined !== initialDraggingAnchorPosition)
                {
                    event.stopPropagation();
                    const position = initialDraggingAnchorPosition;
                    model.cursor = Model.getValueAt(slide, lane, position, view) ?? model.cursor;
                    initialDraggingAnchorPosition = undefined;
                    Render.markDirty();
                }
                SVG.removeEvents(UI.rulerOverlay, events);
                SVG.setAttribute(UI.rulerOverlay, "pointer-events", "none");
            },
            options:
            {
                passive: false,
            }
        },
    };
    const handle = SVG.makeSure
    (
        svg,
        {
            tag: "circle",
            class: "anchor-drag-handle",
            "pointer-events": "auto",
            events:
            {
                pointerdown:
                {
                    listener: event =>
                    {
                        initialDraggingAnchorPosition = Model.getPositionAt(slide, lane, model.cursor, view);
                        if (undefined !== initialDraggingAnchorPosition)
                        {
                            event.preventDefault();
                            event.stopPropagation();
                            anchorDragStartY = event.clientY;
                            SVG.addEvents(UI.rulerOverlay, events);
                            SVG.setAttribute(UI.rulerOverlay, "pointer-events", "auto");
                        }
                    },
                    options:
                    {
                        passive: false,
                    }
                },
            },
        }
    );
    const position = Model.getPositionAt(slide, lane, model.cursor, view);
    if (0 <= position && position <= UI.rulerSvg.viewBox.baseVal.height)
    {
        //const color = "red";
        SVG.setAttributes
        (
            line,
            {
                visibility: "visible",
                x1: 0,
                y1: position,
                x2: svg.viewBox.baseVal.width,
                y2: position,
                stroke: color,
                "stroke-width": config.render.ruler.lineWidth,
            }
        );
        SVG.setAttributes
        (
            handle,
            {
                cx: svg.viewBox.baseVal.width - handleRadius,
                cy: position,
                r: handleRadius,
                fill: color,
            }
        );
    }
    else
    {
        SVG.setAttributes
        (
            line,
            {
                visibility: "hidden",
            }
        );
        if (position < 0)
        {
            SVG.setAttributes
            (
                handle,
                {
                    cx: svg.viewBox.baseVal.width - handleRadius,
                    cy: 0,
                    r: handleRadius,
                    fill: color,
                }
            );
        }
        else
        {
            SVG.setAttributes
            (
                handle,
                {
                    cx: svg.viewBox.baseVal.width - handleRadius,
                    cy: svg.viewBox.baseVal.height,
                    r: handleRadius,
                    fill: color,
                }
            );
        }
    }
};
export const drawMenuLane = (_view: Type.View): void =>
{
    const laneIndex = Model.getAllLaneCount();
    const left = getLeftOfLane(laneIndex);
    UI.rulerNewSlidePanel.style.left = `${left}px`;
    UI.rulerHelpPanel.style.left = `${UI.rulerNewSlidePanel.clientWidth +left}px`;
};
export const resize = () =>
{
    const attributes =
    {
        width: document.body.clientWidth,
        height: document.body.clientHeight,
        viewBox: `0 0 ${document.body.clientWidth} ${document.body.clientHeight}`,
    } as const;
    SVG.setAttributes(UI.rulerSvg, attributes);
    SVG.setAttributes(UI.rulerOverlay, attributes);
};
export const getRulerWidth = (): number => LaneWidths.reduce((a, b) => a + b, 0);
export const initialize = (): void =>
{
    resize();
};

