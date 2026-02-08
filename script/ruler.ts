import * as Type from "./type";
import * as UI from "./ui";
import * as Model from "./model";
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
    const svg = UI.rulerSvg;
    let group = svg.querySelector<SVGGElement>(`g.slide-group[data-slide-index="${Model.getSlideIndex(slide)}"]`);
    if ( ! group)
    {
        group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.classList.add("slide-group");
        group.setAttribute("data-slide-index", Model.getSlideIndex(slide).toString());
        svg.appendChild(group);
    }
    // Clear previous lines
    group.innerHTML = "";
    for(const lane of slide.lanes)
    {
        drawLane(group, lane);
    }
};
export type SvgTag = keyof SVGElementTagNameMap;
export const setAttributes = <T extends (SVGElement | SvgTag)>(elementOrTag: T, attributes: { [key: string]: string | number; }): T extends SvgTag ? SVGElementTagNameMap[T]: T =>
{
    const element: ReturnType<typeof setAttributes> = ("string" === typeof elementOrTag) ?
        document.createElementNS("http://www.w3.org/2000/svg", elementOrTag):
        elementOrTag;
    for(const [key, value] of Object.entries(attributes))
    {
        element.setAttribute(key, value.toString());
    }
    return element as any;
};
export const drawLane = (group: SVGGElement, lane: Type.Lane): void =>
{
    const laneIndex = Model.getLaneIndex(lane);
    const left = LaneWidths.slice(0, laneIndex).reduce((a, b) => a + b, 0);
    const width = config.render.ruler.laneWidth;;
    LaneWidths[laneIndex] = width;
    const rect = setAttributes
    (
        "rect",
        {
            class: "lane-background",
            x: left,
            y: 0,
            width: width,
            height: group.ownerSVGElement!.viewBox.baseVal.height,
            fill: config.render.ruler.laneBackgroundColor,
        }
    );
    group.appendChild(rect);
    const laneLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    laneLabel.classList.add("lane-label");
    laneLabel.setAttribute("x", (left + 8).toString());
    laneLabel.setAttribute("y", "20");
    laneLabel.setAttribute("fill", "#000000");
    laneLabel.setAttribute("font-size", "16");
    laneLabel.textContent = lane.name ?? `Lane ${laneIndex}`;
    group.appendChild(laneLabel);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.classList.add("lane-separator");
    line.setAttribute("x1", (left +width).toString());
    line.setAttribute("y1", "0");
    line.setAttribute("x2", (left +width).toString());
    line.setAttribute("y2", group.ownerSVGElement!.viewBox.baseVal.height.toString());
    line.setAttribute("stroke", config.render.ruler.laneSeparatorColor);
    line.setAttribute("stroke-width", config.render.ruler.laneSeparatorWidth.toString());
    group.appendChild(line);
};
export const drawTick = (group: SVGGElement, lane: Type.Lane, position: Type.NamedNumber, type: Type.TickType): void =>
{
    const laneIndex = Model.getLaneIndex(lane);
    const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
    tick.classList.add("tick", `tick-${type}`);
    const left = LaneWidths.slice(0, laneIndex).reduce((a, b) => a + b, 0);
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
        label.setAttribute("y", (Type.getNamedNumberValue(position) + 4).toString());
        label.setAttribute("fill", "#000000");
        label.setAttribute("font-size", "12");
        label.setAttribute("text-anchor", Model.isRooeSlide(Model.getSlideFromLane(lane)) ? "end" : "start");
        label.textContent = Type.getNamedNumberLabel(position);
        group.appendChild(label);
    }
};
export const drawAnkorLine = (position: number): void =>
{
    const svg = UI.rulerSvg;
    let line = svg.querySelector<SVGLineElement>("line.ankor-line");;
    if ( ! line)
    {
        line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.classList.add("ankor-line");
        svg.appendChild(line);
    }
    line.setAttribute("x1", "0");
    line.setAttribute("y1", position.toString());
    line.setAttribute("x2", svg.viewBox.baseVal.width.toString());
    line.setAttribute("y2", position.toString());
    //const color = "red";
    const color = config.render.ruler.lineColor;
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", config.render.ruler.lineWidth.toString());
    let dragHandle = svg.querySelector<SVGCircleElement>("circle.ankor-drag-handle");
    if ( ! dragHandle)
    {
        dragHandle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dragHandle.classList.add("ankor-drag-handle");
        svg.appendChild(dragHandle);
    }
    const handleRadius = 24;
    dragHandle.setAttribute("cx", (svg.viewBox.baseVal.width - handleRadius).toString());
    dragHandle.setAttribute("cy", position.toString());
    dragHandle.setAttribute("r", handleRadius.toString());
    dragHandle.setAttribute("fill", color);
};
export const resize = (): void =>
{
    const svg = UI.rulerSvg;
    document.body
    svg.setAttribute("width", document.body.clientWidth.toString());
    svg.setAttribute("height", document.body.clientHeight.toString());
    svg.setAttribute("viewBox", `0 0 ${document.body.clientWidth} ${document.body.clientHeight}`);
};
export const initialize = (): void =>
{
    resize();
};

