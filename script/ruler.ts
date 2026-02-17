import * as Type from "./type";
import * as UI from "./ui";
import * as Model from "./model";
import * as SVG from "./svg";
import config from "@resource/config.json";
export let scale = 1.0;
export let LaneWidths: number[] = [];
export const renderer = (model: Type.Model, _view: Type.View, dirty: boolean | Set<number>) =>
{
    if (false !== dirty)
    {
        for(const slide of model.slides)
        {
            if ("boolean" === typeof dirty || dirty.has(Model.getSlideIndex(slide)))
            {
                drawSlide(slide);
            }
        }
        if (true === dirty || dirty.has(-1))
        {
            drawAnkorLine(model.anchor);
        }
    }
};
export const drawSlide = (slide: Type.SlideUnit): void =>
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
        drawLane(group, lane);
    }
};
export const drawLane = (group: SVGGElement, lane: Type.Lane): void =>
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
};
export const drawTick = (view: Type.View, group: SVGGElement, lane: Type.Lane, value: Type.NamedNumber, type: Type.TickType): void =>
{
    const laneIndex = Model.getLaneIndex(lane);
    const position = Model.getPositionAt(lane, Type.getNamedNumberValue(value), view);
    const isRootSlide = Model.isRooeSlide(Model.getSlideFromLane(lane));
    const width = config.render.ruler.laneWidth;;
    const left = LaneWidths.slice(0, laneIndex).reduce((a, b) => a + b, 0);
    const right = left + width;
    group.appendChild
    (
        SVG.make
        ({
            tag: "line",
            class: `tick tick-${type}`,
            x1: isRootSlide ? right : left,
            y1: position,
            x2: isRootSlide ? right - config.render.ruler.tick[type].length : left + config.render.ruler.tick[type].length,
            y2: position,
            stroke: config.render.ruler.tick[type].color,
            "stroke-width": config.render.ruler.tick[type].width,
        })
    );
    if (type === "long")
    {
        group.appendChild
        (
            SVG.make
            ({
                tag: "text",
                class: "tick-label",
                x: isRootSlide ? right - config.render.ruler.tick[type].length - 4 : left + config.render.ruler.tick[type].length + 4,
                y: position + 4,
                fill: "#000000",
                "font-size": 12,
                "text-anchor": isRootSlide ? "end" : "start",
                textContent: Type.getNamedNumberLabel(value),
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

