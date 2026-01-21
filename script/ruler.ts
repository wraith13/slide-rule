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
        line.setAttribute("x1", position.toString());
        line.setAttribute("y1", "0");
        line.setAttribute("x2", position.toString());
        line.setAttribute("y2", svg.viewBox.baseVal.height.toString());
    };
}
