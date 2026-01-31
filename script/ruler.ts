import { Type } from "./type";
import { UI } from "./ui";
export namespace Ruler
{
    export const renderer = (model: Type.Model, _view: Type.View, _dirty: boolean | Set<number>) =>
    {
        drawAnkorLine(model.anchor);
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
        const color = "#BB0000AA";
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", "1");
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
}
