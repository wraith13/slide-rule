import * as Locale from "./locale";
import * as Type from "./type";
import * as Number from "./number";
import * as Model from "./model";
import * as UI from "./ui";
import * as Render from "./render";
import * as SVG from "./svg";
import * as Comparer from "./comparer";
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
        const backgroundRect = SVG.makeSure
        (
            UI.rulerSvg,
            {
                tag: "rect",
                class: "ruler-background",
            }
        );
        SVG.setAttributes
        (
            backgroundRect,
            {
                x: 0,
                y: 0,
                width: Model.getAllLaneCount() *config.render.ruler.laneWidth -Model.data.offset.x,
                height: UI.rulerSvg.viewBox.baseVal.height,
                fill: config.render.ruler.laneBackgroundColor,
            }
        );
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
    for(let i = 0; i < LaneWidths.length; ++i)
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
    drawOverlayDefines(model, view, defs);
    drawErrorAreaDefines(model, view, defs);
    drawDenseAreaDefines(model, view, defs);
};
export const makeLinerGradient = (defs: SVGDefsElement, id: string, line: { x1: string, y1: string, x2: string, y2: string }, stops: { offset: string, color: string, opacity: number }[]): SVGLinearGradientElement =>
{
    const gradient = SVG.makeSure
    (
        defs,
        {
            tag: "linearGradient",
            id: id,
            x1: line.x1,
            y1: line.y1,
            x2: line.x2,
            y2: line.y2,
        }
    );
    for(const stop of stops)
    {
        SVG.makeSure
        (
            gradient,
            {
                tag: "stop",
                offset: stop.offset,
                "stop-color": stop.color,
                "stop-opacity": stop.opacity,
            }
        );
    }
    return gradient;
};
export const drawOverlayDefines = (_model: Type.Model, _view: Type.View, defs: SVGDefsElement) =>
{
    const backgroundColor = config.render.ruler.laneBackgroundColor;
    makeLinerGradient
    (
        defs,
        "overlay-top-gradient",
        { x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
        [
            { offset: "0%", color: backgroundColor, opacity: 1 },
            { offset: "100%", color: backgroundColor, opacity: 0 },
        ]
    );
    makeLinerGradient
    (
        defs,
        "overlay-bottom-gradient",
        { x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
        [
            { offset: "0%", color: backgroundColor, opacity: 0 },
            { offset: "100%", color: backgroundColor, opacity: 1 },
        ]
    );
    makeLinerGradient
    (
        defs,
        "overlay-center-gradient",
        { x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
        [
            { offset: "0%", color: backgroundColor, opacity: 0 },
            { offset: "50%", color: backgroundColor, opacity: 1 },
            { offset: "100%", color: backgroundColor, opacity: 0 },
        ]
    );
    makeLinerGradient
    (
        defs,
        "overlay-edges-gradient",
        { x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
        [
            { offset: "0%", color: backgroundColor, opacity: 1 },
            { offset: "50%", color: backgroundColor, opacity: 0 },
            { offset: "100%", color: backgroundColor, opacity: 1 },
        ]
    );
};
export const drawErrorAreaDefines = (_model: Type.Model, _view: Type.View, defs: SVGDefsElement) =>
{
    makeLinerGradient
    (
        defs,
        "min-error-area-gradient",
        { x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
        [
            { offset: "0%", color: config.render.ruler.minErrorAreaColor, opacity: 1 },
            { offset: "100%", color: config.render.ruler.minErrorAreaColor, opacity: 0 },
        ]
    );
    makeLinerGradient
    (
        defs,
        "max-error-area-gradient",
        { x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
        [
            { offset: "0%", color: config.render.ruler.maxErrorAreaColor, opacity: 0 },
            { offset: "100%", color: config.render.ruler.maxErrorAreaColor, opacity: 1 },
        ]
    );
    makeLinerGradient
    (
        defs,
        "invert-min-error-area-gradient",
        { x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
        [
            { offset: "0%", color: config.render.ruler.minErrorAreaColor, opacity: 0 },
            { offset: "100%", color: config.render.ruler.minErrorAreaColor, opacity: 1 },
        ]
    );
    makeLinerGradient
    (
        defs,
        "invert-max-error-area-gradient",
        { x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
        [
            { offset: "0%", color: config.render.ruler.maxErrorAreaColor, opacity: 1 },
            { offset: "100%", color: config.render.ruler.maxErrorAreaColor, opacity: 0 },
        ]
    );
};
export const drawDenseAreaDefines = (_model: Type.Model, _view: Type.View, defs: SVGDefsElement) =>
{
    makeLinerGradient
    (
        defs,
        "upper-dense-area-gradient",
        { x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
        [
            { offset: "0%", color: config.render.ruler.denseAreaColor, opacity: 1 },
            { offset: "100%", color: config.render.ruler.denseAreaColor, opacity: 0 },
        ]
    );
    makeLinerGradient
    (
        defs,
        "lower-dense-area-gradient",
        { x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
        [
            { offset: "0%", color: config.render.ruler.denseAreaColor, opacity: 0 },
            { offset: "100%", color: config.render.ruler.denseAreaColor, opacity: 1 },
        ]
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
    const isLastLane = lane === slide.lanes[slide.lanes.length -1];
    const laneIndex = Model.getLaneIndex(lane);
    const left = getLeftOfLane(laneIndex);
    const width = config.render.ruler.laneWidth;
    LaneWidths[laneIndex] = width;
    const tickGroup = SVG.make
    ({
            tag: "g",
            class: "tick-group",
    });
    group.append
    (
        // SVG.make
        // ({
        //     tag: "rect",
        //     class: "lane-background",
        //     x: left,
        //     y: 0,
        //     width: width,
        //     height: group.ownerSVGElement!.viewBox.baseVal.height,
        //     fill: config.render.ruler.laneBackgroundColor,
        // }),
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
            textContent: Locale.resolve(lane.name) ?? `Lane ${laneIndex}`,
        }),
        SVG.make
        ({
            tag: "line",
            class: "lane-separator",
            x1: left + width,
            y1: 0,
            x2: left + width,
            y2: group.ownerSVGElement!.viewBox.baseVal.height,
            stroke: isLastLane ?
                config.render.ruler.slideSeparatorColor:
                config.render.ruler.laneSeparatorColor,
            "stroke-width": config.render.ruler.laneSeparatorWidth,
        })
    );
    const content = Model.designTicks(slide, view, lane, Model.makePositionTickWindowFromWindow());
    drawErrorArea(view, tickGroup, slide, lane);
    drawAreas(view, tickGroup, slide, lane, content.areas);
    drawTicks(view, tickGroup, slide, lane, calculateMinimumFractionDigits(content.ticks));
};
export const drawAreas = (view: Type.View, group: SVGGElement, slide: Type.SlideUnit, lane: Type.Lane, areas: Type.Area[], indent: number = 0): void =>
{
    const indentUnit = 20;
    const laneIndex = Model.getLaneIndex(lane);
    const left = getLeftOfLane(laneIndex) +indent;
    const width = config.render.ruler.laneWidth -indent;
    const isInvert = Model.isInvertLane(lane);
    for(const area of areas)
    {
        const lowerPosition = undefined === area.lowerBound ?
            (( ! isInvert) ? 0: group.ownerSVGElement!.viewBox.baseVal.height):
            Model.getPositionAt(slide, lane, area.lowerBound, view);
        const upperPosition = undefined === area.upperBound ?
            (( ! isInvert) ? group.ownerSVGElement!.viewBox.baseVal.height: 0):
            Model.getPositionAt(slide, lane, area.upperBound, view);
        const y = Math.max(0, ( ! isInvert) ? lowerPosition: upperPosition);
        const height = Math.min
        (
            group.ownerSVGElement!.viewBox.baseVal.height -y,
            ( ! isInvert) ? upperPosition -y: lowerPosition -y
        );
        const hasDetails = 0 < (area.details ?? []).length;
        if (hasDetails)
        {
            const width = indentUnit;
            group.appendChild
            (
                SVG.make
                ({
                    tag: "rect",
                    class: "area",
                    x: left,
                    y: y,
                    width,
                    height,
                    fill: area.fill,
                })
            );
            if ("none" !== (area.overlay ?? "none"))
            {
                group.appendChild
                (
                    SVG.make
                    ({
                        tag: "rect",
                        class: "area",
                        x: left,
                        y: y,
                        width,
                        height,
                        fill: `url(#overlay-${area.overlay}-gradient)`,
                    })
                );
            }
            if (undefined !== area.label)
            {
                group.appendChild
                (
                    SVG.make
                    ({
                        tag: "text",
                        class: "area-label",
                        x: left +16,
                        y: y +height -8,
                        transform: `rotate(-90, ${left +16}, ${y +height -8})`,
                        fill: area.color ?? "#000000",
                        "font-size": 12,
                        textContent: Locale.resolve(area.label),
                    })
                );
            }
            drawAreas(view, group, slide, lane, area.details!, indent +indentUnit);
        }
        else
        {
            group.appendChild
            (
                SVG.make
                ({
                    tag: "rect",
                    class: "area",
                    x: left,
                    y: y,
                    width,
                    height,
                    fill: area.fill,
                })
            );
            if ("none" !== (area.overlay ?? "none"))
            {
                group.appendChild
                (
                    SVG.make
                    ({
                        tag: "rect",
                        class: "area",
                        x: left,
                        y: y,
                        width,
                        height,
                        fill: `url(#overlay-${area.overlay}-gradient)`,
                    })
                );
            }
            if (undefined !== area.label)
            {
                group.appendChild
                (
                    SVG.make
                    ({
                        tag: "text",
                        class: "area-label",
                        x: left + 8,
                        y: y +(height /2) +4,
                        fill: area.color ?? "#000000",
                        "font-size": 12,
                        textContent: Locale.resolve(area.label),
                    })
                );
            }
        }
    }
}
export const drawErrorArea = (view: Type.View, group: SVGGElement, slide: Type.SlideUnit, lane: Type.Lane): void =>
{
    const isInvert = Model.isInvertLane(lane);
    const min = Number.maxMin(Model.getValueAt(slide, lane, ( ! isInvert) ? 0 : group.ownerSVGElement!.viewBox.baseVal.height, view)?.value);
    if (min <= Number.MIN_VALUE)
    {
        drawAreas
        (
            view,
            group,
            slide,
            lane,
            [{
                lowerBound: undefined,
                upperBound: Number.MIN_VALUE,
                fill: ( ! isInvert) ? "url(#min-error-area-gradient)": "url(#invert-min-error-area-gradient)"
            }]
        );
    }
    const max = Number.maxMin(Model.getValueAt(slide, lane, ( ! isInvert) ? group.ownerSVGElement!.viewBox.baseVal.height : 0, view)?.value);
    if (Number.MAX_VALUE <= max)
    {
        drawAreas
        (
            view,
            group,
            slide,
            lane,
            [{
                lowerBound: Number.MAX_VALUE,
                upperBound: undefined,
                fill: ( ! isInvert) ? "url(#max-error-area-gradient)": "url(#invert-max-error-area-gradient)"
            }]
        );
    }
};
export const makeNumberLabel = (tick: Type.Tick): string =>
{
    const { label, minimumFractionDigits } = tick;
    const value = Type.getTickValue(tick);
    const unit = undefined === tick.unit ? "": ` ${tick.unit}`;
    switch(true)
    {
    case undefined !== label:
        return Locale.resolve(label);
    case value < 0.000000000001 || 10000000000000 <= value:
        return Type.getNamedNumberLabel(value, undefined, { notation: "scientific", minimumSignificantDigits: 11, maximumSignificantDigits: 11, minimumFractionDigits }) +unit;
        // return Type.getNamedNumberLabel(value, undefined, { notation: "compact", compactDisplay: "long" });
    default:
        return Type.getNamedNumberLabel(value, undefined, { maximumFractionDigits: Math.max(13, minimumFractionDigits ?? 13), minimumFractionDigits }) +unit;
        // return Type.getNamedNumberLabel(value, undefined, { notation: "compact", compactDisplay: "long" });
    }
};
export const getFractionDigitsFromUnit = (unit: number): number | undefined =>
{
    if (0 < unit)
    {
        const log10 = Math.log10(unit);
        if (0 <= log10)
        {
            return undefined;
        }
        else
        {
            // 本来は Math.round はなく Math.ceil でないといけないが計算誤差により log10 がわずかに大きくなってしまう場合があるため、Math.round を使用する
            return Math.round(-log10);
        }
    }
    return undefined;
};
export const calculateMinimumFractionDigits = (ticks: Type.Tick[]): Type.Tick[] =>
{
    const numericTicks = ticks
        .filter(i => "number" === typeof i.value && "long" === i.type)
        .sort(Comparer.make(i => i.value as number));
    if (1 < numericTicks.length)
    {
        numericTicks[0].minimumFractionDigits = getFractionDigitsFromUnit((numericTicks[1].value as number) - (numericTicks[0].value as number));
        const lastIndex = numericTicks.length -1;
        numericTicks[lastIndex].minimumFractionDigits = getFractionDigitsFromUnit((numericTicks[lastIndex].value as number) - (numericTicks[lastIndex -1].value as number));
    }
    for(var i = 1; i < numericTicks.length -1; ++i)
    {
        const prev = numericTicks[i -1];
        const current = numericTicks[i];
        const next = numericTicks[i +1];
        const prevDelta = (current.value as number) - (prev.value as number);
        const nextDelta = (next.value as number) - (current.value as number);
        const unit = Math.max(prevDelta, nextDelta);
        current.minimumFractionDigits = getFractionDigitsFromUnit(unit);
    }
    return ticks;
};
export const drawTicks = (view: Type.View, group: SVGGElement, slide: Type.SlideUnit, lane: Type.Lane, ticks: Type.Tick[]): void =>
{
    const isConstantTable = "constant" === lane.type;
    const isPrimaryLane = Model.isPrimaryLane(lane);
    const laneIndex = Model.getLaneIndex(lane);
    const laneContext = Model.getLaneContext(lane);
    const isRootSlide = Model.isRootSlide(Model.getSlideFromLane(lane));
    const width = config.render.ruler.laneWidth;;
    const left = getLeftOfLane(laneIndex);
    const right = left + width;
    for(const tick of ticks)
    {
        const value = Type.getTickValue(tick);
        const position = Model.getPositionAt(slide, lane, value, view);
        if (0 <= position && position <= group.ownerSVGElement!.viewBox.baseVal.height && "none" !== tick.type)
        {
            const isPrimaryTick = isPrimaryLane && 1 === value;
            const color = tick.color ?? (isPrimaryTick ? config.render.ruler.primaryTickColor:config.render.ruler.tick[tick.type].color);
            const drawLeftTick = ! isRootSlide && ("left-end" === laneContext || "center" === laneContext || "single" === laneContext);
            const drawRightTick = isRootSlide || "right-end" === laneContext || "single" === laneContext;
            if (drawLeftTick)
            {
                group.appendChild
                (
                    SVG.make
                    ({
                        tag: "line",
                        class: `tick tick-${tick.type}`,
                        x1: left,
                        y1: position,
                        x2: left + config.render.ruler.tick[tick.type].length,
                        y2: position,
                        // stroke: config.render.ruler.tick[tick.type].color,
                        stroke: color,
                        "stroke-width": config.render.ruler.tick[tick.type].width,
                        "data-tick-value": value,
                    })
                );
            }
            if (drawRightTick)
            {
                group.appendChild
                (
                    SVG.make
                    ({
                        tag: "line",
                        class: `tick tick-${tick.type}`,
                        x1: right,
                        y1: position,
                        x2: right - config.render.ruler.tick[tick.type].length,
                        y2: position,
                        // stroke: config.render.ruler.tick[tick.type].color,
                        stroke: color,
                        "stroke-width": config.render.ruler.tick[tick.type].width,
                        "data-tick-value": value,
                    })
                );
            }
            if (tick.type === "long")
            {
                const drawLabelDirection =
                    ! drawLeftTick ? "right" :
                    ! drawRightTick ? "left" :
                    value < 1 ? "left" : "right";
                const x = "left" === drawLabelDirection ?
                    // left + config.render.ruler.tick[tick.type].length + 4:
                    left + config.render.ruler.tick[tick.type].length + 8:
                    right - config.render.ruler.tick[tick.type].length - 4;
                const y = position + 4;
                const text = SVG.make
                ({
                    tag: "text",
                    class: "tick-label",
                    x: x,
                    y: y,
                    //fill: config.render.ruler.tick[tick.type].color,
                    transform: isConstantTable ? `rotate(-45 ${x} ${y})` : undefined,
                    fill: color,
                    "font-size": 12,
                    "text-anchor": "left" === drawLabelDirection ? "start" : "end",
                    textContent: makeNumberLabel(tick),
                });
                group.appendChild(text);
                if (tick.behindTickCount && 0 < tick.behindTickCount)
                {
                    text.appendChild
                    (
                        SVG.make
                        ({
                            tag: "tspan",
                            class: "tick-label behind-tick-count",
                            fill: "#888888",
                            "font-size": 10.5,
                            textContent: ` (+${tick.behindTickCount})`,
                        })
                    );
                }
            }
        }
    }
};
let anchorDragStartY = 0;
let initialDraggingAnchorPosition: number | undefined = undefined;
export type SnapPositionEvent = KeyboardEvent | PointerEvent | WheelEvent | TouchEvent | MouseEvent | "NOSNAP";
export const getReferenceLaneIndexFromEvent = (event: SnapPositionEvent): number | null =>
{
    if ("NOSNAP" !== event && "clientX" in event)
    {
        return getLaneIndexFromPosition(event.clientX +Model.data.offset.x);
    }
    else
    {
        return null;
    }
};
export const regulateReferencePositions = (referencePositions: number[]): number[] =>
    Array.from(new Set(referencePositions))
    .sort(Comparer.make<number>(a => a));
export const snapPosition = (position: number, referencePositions: number[]): number =>
{
    let result = position;
    let minDistance = Number.MAX_VALUE;
    for(const targetPosition of referencePositions)
    {
        const distance = Math.abs(position - targetPosition);
        if (distance < minDistance)
        {
            minDistance = distance;
            result = targetPosition;
        }
    }
    return result;
};
export const nextPosition = (position: number, referencePositions: number[], direction: "PREVIOUS" | "NEXT"): number =>
{
    let result = position;
    let minDistance = Number.MAX_VALUE;
    for(const targetPosition of referencePositions)
    {
        const distance = direction === "PREVIOUS" ? position - targetPosition : targetPosition - position;
        if (0 < distance && distance < minDistance)
        {
            minDistance = distance;
            result = targetPosition;
        }
    }
    return result;
};
export const getAreaPositions = (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, areas: Type.Area[]): number[] =>
{
    const positions: number[] = [];
    for(const area of areas)
    {
        if (undefined !== area.lowerBound)
        {
            const lowerPosition = Model.getPositionAt(slide, lane, area.lowerBound, view);
            positions.push(lowerPosition);
        }
        if (undefined !== area.upperBound)
        {
            const upperPosition = Model.getPositionAt(slide, lane, area.upperBound, view);
            positions.push(upperPosition);
        }
        if (0 < (area.details ?? []).length)
        {
            positions.push(...getAreaPositions(slide, lane, view, area.details!));
        }
    }
    return positions;
};
export const snapVerticalPosition = (event: SnapPositionEvent, view: Type.View, position: number, referenceLaneIndex?: number): number =>
{
    if ("NOSNAP" !== event && ! event.shiftKey)
    {
        const laneIndex = referenceLaneIndex ?? getReferenceLaneIndexFromEvent(event) ?? 0;
        const { slide, lane } = Model.getSlideAndLane(laneIndex);
        const tickWindow = Model.makePositionTickWindowFromPositionAndWidth(position, 32);
        const content = Model.designTicks(slide, view, lane, tickWindow);
        const tickPositions = content.ticks.map(i => Model.getPositionAt(slide, lane, i.value, view));
        tickPositions.push(...getAreaPositions(slide, lane, view, content.areas));
        tickPositions.push(Model.getCursorPosition(view));
        console.log(`snapVerticalPosition.self.content.areas: ${content.areas.length}`);
        if ("number" === typeof referenceLaneIndex)
        {
            const selfLaneIndex = referenceLaneIndex +1;
            if (selfLaneIndex < Model.getAllLaneCount())
            {
                const { slide: selfSlide, lane: selfLane } = Model.getSlideAndLane(selfLaneIndex);
                const currentPosition = Model.getPositionAt(slide, lane, selfSlide.anchor, view);
                const delta = position - currentPosition;
                const oppositePosition = Model.getPositionAt(slide, lane, 1, view);
                const tickWindow = Model.makePositionTickWindowFromPositionAndWidth(oppositePosition -delta, 32);
                const content = Model.designTicks(selfSlide, view, selfLane, tickWindow);
                tickPositions.push
                (
                    ...content.ticks
                        .map(i => Model.getPositionAt(selfSlide, selfLane, i.value, view))
                        .map(i => currentPosition +(oppositePosition -i))
                );
                // これはあってもいいけど、多分、機能する事がない。
                // content.areas.forEach
                // (
                //     area =>
                //     {
                //         if (undefined !== area.lowerBound)
                //         {
                //             const lowerPosition = Model.getPositionAt(selfSlide, selfLane, area.lowerBound, view);
                //             tickPositions.push(currentPosition +(oppositePosition -lowerPosition));
                //         }
                //         if (undefined !== area.upperBound)
                //         {
                //             const upperPosition = Model.getPositionAt(selfSlide, selfLane, area.upperBound, view);
                //             tickPositions.push(currentPosition +(oppositePosition -upperPosition));
                //         }
                //     }
                // );
            }
        }
        return snapPosition(position, regulateReferencePositions(tickPositions));
    }
    else
    {
        return position;
    }
};
export const snapHorizontalPosition = (event: SnapPositionEvent, position: number): number =>
{
    if ("NOSNAP" !== event && ! event.shiftKey)
    {
        const referencePositions = [];
        referencePositions.push(0);
        const max = Math.max(0, getRulerWidth() - (window.innerWidth -(UI.rulerNewSlidePanel.clientWidth +UI.rulerHelpPanel.clientWidth)));
        if (0 < max)
        {
            let accumulatedWidth = 0;
            for(const laneWidth of LaneWidths)
            {
                // for(var i = 0; i < 3; ++i)
                // {
                //     accumulatedWidth += laneWidth /4;
                //     if (accumulatedWidth < max)
                //     {
                //         referencePositions.push(accumulatedWidth);
                //     }
                // }
                accumulatedWidth += laneWidth;
                if (accumulatedWidth < max)
                {
                    referencePositions.push(accumulatedWidth);
                }
                else
                {
                    break
                }
            }
            referencePositions.push(max);
        }
        return snapPosition(position, referencePositions);
    }
    else
    {
        return position;
    }
}
export const slideCursor = (model: Type.Model, view: Type.View, event: PointerEvent | WheelEvent, position: number): number =>
{
    const { slide, lane } = Model.getRootSlideAndRootLane();
    const minPosition = Model.getPositionAt(slide, lane, Number.MIN_VALUE, view) ?? -Number.MAX_VALUE;
    const maxPosition = Model.getPositionAt(slide, lane, Number.MAX_VALUE, view) ?? Number.MAX_VALUE;
    const snappedPosition = snapVerticalPosition(event, view, position);
    const resultPosition = Math.min(maxPosition, Math.max(minPosition, snappedPosition));
    model.cursor = Model.getValueAt(slide, lane, resultPosition, view)?.value ?? model.cursor;
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
                    slideCursor(model, view, event, initialDraggingAnchorPosition + deltaY);
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
                    slideCursor(model, view, event, initialDraggingAnchorPosition + deltaY);
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
                    model.cursor = Model.getValueAt(slide, lane, position, view)?.value ?? model.cursor;
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
                x2: svg.viewBox.baseVal.width -(handleRadius *2),
                y2: position,
                stroke: color,
                "stroke-width": config.render.ruler.lineWidth,
            }
        );
        SVG.setAttributes
        (
            handle,
            {
                cx: svg.viewBox.baseVal.width -handleRadius,
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
                    cx: svg.viewBox.baseVal.width -handleRadius,
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
                    cx: svg.viewBox.baseVal.width -handleRadius,
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

