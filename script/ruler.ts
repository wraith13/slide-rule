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
        //`g.slide-group[data-slide-index="${slideIndex}"]`,
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
    const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
    tick.classList.add("tick", `tick-${type}`);
    const left = LaneWidths.slice(0, laneIndex).reduce((a, b) => a + b, 0);
    const position = Model.getPositionAt(lane, Type.getNamedNumberValue(value), view);
    const isRootSlide = Model.isRooeSlide(Model.getSlideFromLane(lane));
    if (isRootSlide)
    {
        const width = config.render.ruler.laneWidth;;
        const right = left + width;
        tick.setAttribute("x1", right.toString());
        tick.setAttribute("y1", position.toString());
        tick.setAttribute("x2", (right - config.render.ruler.tick[type].length).toString());
        tick.setAttribute("y2", position.toString());
    }
    else
    {
        tick.setAttribute("x1", (left).toString());
        tick.setAttribute("y1", position.toString());
        tick.setAttribute("x2", (left + config.render.ruler.tick[type].length).toString());
        tick.setAttribute("y2", position.toString());
    }
    tick.setAttribute("stroke", config.render.ruler.tick[type].color);
    tick.setAttribute("stroke-width", config.render.ruler.tick[type].toString());
    group.appendChild(tick);
    if (type === "long")
    {
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.classList.add("tick-label");
        if (isRootSlide)
        {
            const width = config.render.ruler.laneWidth;;
            const right = left + width;
            label.setAttribute("x", (right - config.render.ruler.tick[type].length - 4).toString());
        }
        else
        {
            label.setAttribute("x", (left + config.render.ruler.tick[type].length + 4).toString());
        }
        label.setAttribute("y", (position + 4).toString());
        label.setAttribute("fill", "#000000");
        label.setAttribute("font-size", "12");
        label.setAttribute("text-anchor", Model.isRooeSlide(Model.getSlideFromLane(lane)) ? "end" : "start");
        label.textContent = Type.getNamedNumberLabel(value);
        group.appendChild(label);
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
            //"line.ankor-line",
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
            //"circle.ankor-drag-handle",
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

