import * as Type from "./type";
import * as Number from "./number";
import * as UI from "./ui";
import * as Model from "./model";
import * as SVG from "./svg";
import config from "@resource/config.json";
export let scale = 1.0;
export let LaneWidths: number[] = [];
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
        if (true === dirty || dirty.has(-1))
        {
            drawAnkorLine(model.anchor);
        }
    }
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
        drawLane(view, group, lane);
    }
};
export const drawLane = (view: Type.View, group: SVGGElement, lane: Type.Lane): void =>
{
    const laneIndex = Model.getLaneIndex(lane);
    const left = LaneWidths.slice(0, laneIndex).reduce((a, b) => a + b, 0);
    const width = config.render.ruler.laneWidth;;
    LaneWidths[laneIndex] = width;
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
        SVG.make
        ({
            tag: "text",
            class: "lane-label",
            x: left + 8,
            y: 20,
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
    drawErrorArea(view, group, lane);
    Model.designTicks(view, lane).forEach
    (
        tick => drawTick(view, group, lane, tick)
    );
};
export const drawErrorArea = (view: Type.View, group: SVGGElement, lane: Type.Lane): void =>
{
    const laneIndex = Model.getLaneIndex(lane);
    const left = LaneWidths.slice(0, laneIndex).reduce((a, b) => a + b, 0);
    const width = config.render.ruler.laneWidth;;
    const height = window.innerHeight;
    const min = Math.max(Model.getValueAt(lane, 0, view) ?? Number.MIN_VALUE, Number.MIN_VALUE);
    if (min <= Number.MIN_VALUE)
    {
        const minPosition = Model.getPositionAt(lane, Number.MIN_VALUE, view);
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
    const max = Math.min(Model.getValueAt(lane, height, view) ?? Number.MAX_VALUE, Number.MAX_VALUE);
    if (Number.MAX_VALUE <=max)
    {
        const maxPosition = Model.getPositionAt(lane, Number.MAX_VALUE, view);
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
        }
        else
        {
            return Type.getNamedNumberLabel(value, undefined, { maximumFractionDigits: 8, });
        }
    }
};
export const drawTick = (view: Type.View, group: SVGGElement, lane: Type.Lane, tick: Type.Tick): void =>
{
    const laneIndex = Model.getLaneIndex(lane);
    const position = Model.getPositionAt(lane, Type.getNamedNumberValue(tick.value), view);
    const isRootSlide = Model.isRootSlide(Model.getSlideFromLane(lane));
    const width = config.render.ruler.laneWidth;;
    const left = LaneWidths.slice(0, laneIndex).reduce((a, b) => a + b, 0);
    const right = left + width;
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
            stroke: tick.color ?? config.render.ruler.tick[tick.type].color,
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
                fill: tick.color ?? config.render.ruler.tick[tick.type].color,
                "font-size": 12,
                "text-anchor": isRootSlide ? "end" : "start",
                textContent: makeNumberLabel(tick.value),
            })
        );
    }
};
export const drawAnkorLine = (position: number): void =>
{
    const svg = UI.rulerSvg;
    //const color = "red";
    const color = config.render.ruler.lineColor;
    const handleRadius = 24;
    SVG.setAttributes
    (
        SVG.makeSure
        (
            svg,
            {
                tag: "line",
                class: "ankor-line",
            }
        ),
        {
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
        SVG.makeSure
        (
            svg,
            {
                tag: "circle",
                class: "ankor-drag-handle",
            }
        ),
        {
            cx: svg.viewBox.baseVal.width - handleRadius,
            cy: position,
            r: handleRadius,
            fill: color,
        }
    );
};
export const resize = (): unknown => SVG.setAttributes
(
    UI.rulerSvg,
    {
        width: document.body.clientWidth,
        height: document.body.clientHeight,
        viewBox: `0 0 ${document.body.clientWidth} ${document.body.clientHeight}`,
    }
);
export const initialize = (): void =>
{
    resize();
};

