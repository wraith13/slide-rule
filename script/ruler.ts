import * as Locale from "./locale";
import * as Type from "./type";
import * as Calculation from "./calculation";
import * as Model from "./model";
import * as UI from "./ui";
import * as Theme from "./theme";
import * as Render from "./render";
import * as SVG from "./svg";
import * as Comparer from "./comparer";
import config from "@resource/config.json";
export let scale = 1.0;
export let LaneWidths: number[] = [];
export const setLaneWidth = (laneIndex: number, width: number): void =>
{
    if (LaneWidths[laneIndex] !== width)
    {
        LaneWidths[laneIndex] = width;
        Render.markDirty(Render.RenderItemId.Size);
    }
};
export const renderer = (model: Type.Model, view: Type.View, dirty: Set<string>, timeLimit?: number, options?: Type.RenderingOptions) =>
{
    if (0 < dirty.size)
    {
        if (dirty.has(Render.RenderItemId.AllItems))
        {
            Render.resetDirty(Render.RenderItemId.AllItems);
            //dirty.add("DEFINES"); こいつは初回だけで良いのでここでは登録しない。 / EN: This is only necessary for the first time, so do not register it here.
            dirty.add("BACKGROUND");
            dirty.add("ANCHOR_LINE");
            // for (let i = 0; i < Model.data.slides.length; ++i)
            // {
            //     dirty.add(`SLIDE:${i}`);
            // }
            dirty.add("LANE_GARBAGE_COLLECTOR");
            for (let i = 0; i < Model.getAllLaneCount(); ++i)
            {
                dirty.add(`LANE:${i}`);
            }
            dirty.add(Render.RenderItemId.Popup);
            // dirty.add(Render.Size); // Render.Size はその必要があれば自動的にセットされるのでここではセットしない。 / EN: Render.Size will be set automatically if necessary, so do not set it here.
        }
        if (dirty.has("LANE_GARBAGE_COLLECTOR"))
        {
            // レーンのレンダリングより必ず先に処理しておく必要がある。 / EN: This needs to be processed before rendering the lane.
            garbageCollectLanes(view);
            dirty.delete("LANE_GARBAGE_COLLECTOR");
        }
        for(const i of dirty)
        {
            switch(i)
            {
            case Render.RenderItemId.Size:
                resize();
                break;
            case "DEFINES":
                drawGradientDefines(model, view);
                break;
            case "BACKGROUND":
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
                        fill: Theme.resolve(config.render.ruler.laneBackgroundColor),
                    }
                );
                break;
            case "ANCHOR_LINE":
                drawAnchorLine(model, view, options);
                break;
            case Render.RenderItemId.Popup:
                drawPopup(view);
                break;
            default:
                if (i.startsWith("LANE:"))
                {
                    const laneIndex = Number.parseInt(i.substring("LANE:".length));
                    const { slide, lane } = Model.getSlideAndLane(laneIndex);
                    if (undefined !== lane)
                    {
                        drawLane(view, slide, lane);
                    }
                    else
                    {
                        console.warn(`🦋 FIXME: Lane not found for dirty item: ${i}`);
                    }
                }
                else
                {
                    console.warn(`🦋 FIXME: Unknown dirty item: ${i}`);
                }
                break;
            }
            Render.resetDirty(i);
            if (undefined !== timeLimit && timeLimit < performance.now())
            {
                break;
            }
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
export const drawGradientDefines = (_model: Type.Model, _view: Type.View) =>
{
    const defs = SVG.makeSure
    (
        UI.rulerSvg,
        {
            tag: "defs",
        }
    );
    const overlayBackgroundColor = Theme.resolve(config.render.ruler.laneBackgroundColor);
    makeVerticalGradient(defs, "overlay-top-gradient", makeStops({ "0%": 1, "100%": 0 }, overlayBackgroundColor));
    makeVerticalGradient(defs, "overlay-bottom-gradient", makeStops({ "0%": 0, "100%": 1 }, overlayBackgroundColor));
    makeVerticalGradient(defs, "overlay-center-gradient", makeStops({ "0%": 0, "50%": 1, "100%": 0 }, overlayBackgroundColor));
    makeVerticalGradient(defs, "overlay-edges-gradient", makeStops({ "0%": 1, "50%": 0, "100%": 1 }, overlayBackgroundColor));
    makeVerticalGradient(defs, "top-minus-gradient", makeStops({ "0%": 1, "100%": 0 }, config.render.ruler.minusAreaColor));
    makeVerticalGradient(defs, "bottom-minus-gradient", makeStops({ "0%": 0, "100%": 1 }, config.render.ruler.minusAreaColor));
    makeVerticalGradient(defs, "top-min-gradient", makeStops({ "0%": 1, "100%": 0 }, config.render.ruler.minAreaColor));
    makeVerticalGradient(defs, "bottom-min-gradient", makeStops({ "0%": 0, "100%": 1 }, config.render.ruler.minAreaColor));
    makeVerticalGradient(defs, "top-max-gradient", makeStops({ "0%": 1, "100%": 0 }, config.render.ruler.maxAreaColor));
    makeVerticalGradient(defs, "bottom-max-gradient", makeStops({ "0%": 0, "100%": 1 }, config.render.ruler.maxAreaColor));
    makeVerticalGradient(defs, "top-dense-gradient", makeStops({ "0%": 1, "100%": 0 }, config.render.ruler.denseAreaColor));
    makeVerticalGradient(defs, "bottom-dense-gradient", makeStops({ "0%": 0, "100%": 1 }, config.render.ruler.denseAreaColor));
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
export const makeVerticalGradient = (defs: SVGDefsElement, id: string, stops: { offset: string, color: string, opacity: number }[]): SVGLinearGradientElement =>
    makeLinerGradient(defs, id, { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, stops);
export const makeStops = (stops: { [offset: string]: number }, color: string): { offset: string, color: string, opacity: number }[] =>
    Object.entries(stops).map(([offset, opacity]) => ({ offset, color, opacity }));
export const makeSureSlide = (slideIndex: number): SVGGElement => SVG.makeSure
(
    UI.rulerSvg,
    {
        tag: "g",
        class: "slide-group",
        "data-slide-index": slideIndex,
    }
);
// export const drawSlide = (view: Type.View, slide: Type.SlideUnit): void =>
// {
//     const slideIndex = Model.getSlideIndex(slide);
//     const group = makeSureSlide(slideIndex);
//     group.innerHTML = "";
//     for(const lane of slide.lanes)
//     {
//         drawLane(view, slide, lane);
//     }
// };
export const getLeftOfLane = (laneIndex: number): number =>
    LaneWidths.slice(0, laneIndex).reduce((a, b) => a + b, 0) -Model.data.offset.x;
export const drawLeveledText = (label: SVGTextElement, text: string) =>
{
    let currentDy = 0;
    const leveledText = Render.parseLeveledText(text);
    if (leveledText.length <= 1)
    {
        label.textContent = text;
    }
    else
    {
        for(const i of leveledText)
        {
            const baseDy = i.level *-4.5;
            const dy = baseDy - currentDy;
            const tspan = SVG.make
            ({
                tag: "tspan",
                class: `leveled-text-${Render.getLevelName(i)}`,
                dy,
                "font-size": Render.isRegularSizeText(i) ? 12 : 9,
                textContent: i.text,
            });
            label.appendChild(tspan);
            currentDy += dy;
        }
    }
    return { currentDy, }
}
export const drawLane = (view: Type.View, slide: Type.SlideUnit, lane: Type.Lane): void =>
{
    const slideIndex = Model.getSlideIndex(slide);
    const group: SVGGElement = makeSureSlide(slideIndex);
    const isLastLane = lane === slide.lanes[slide.lanes.length -1];
    const laneIndex = Model.getLaneIndex(lane);
    const left = getLeftOfLane(laneIndex);
    const width = config.render.ruler.laneWidth;
    setLaneWidth(laneIndex, width);
    // const laneBackground = SVG.makeSure
    // (
    //     group,
    //     {
    //         tag: "rect",
    //         class: "lane-background",
    //         "data-lane-index": laneIndex,
    //     },
    //     {
    //         x: left,
    //         y: 0,
    //         width: width,
    //         height: group.ownerSVGElement!.viewBox.baseVal.height,
    //         fill: Theme.resolve(config.render.ruler.laneBackgroundColor),
    //     }
    // );
    const tickGroup = SVG.makeSure
    (
        group,
        {
            tag: "g",
            class: "tick-group",
            "data-lane-index": laneIndex,
        }
    );
    const labelGroup = SVG.makeSure
    (
        group,
        {
            tag: "g",
            class: "label-group",
            "data-lane-index": laneIndex,
            events:
            {
                click: () => Render.newPopup({ popupType: "lane-property", child: null, laneIndex, }),
            }
        }
    );
    SVG.makeSure
    (
        labelGroup,
        {
            tag: "rect",
            class: "lane-label-background",
            "data-lane-index": laneIndex,
        },
        {
            x: left + 8,
            y: 8,
            rx: 8,
            ry: 8,
            width: width - 16,
            height: 24,
            fill: Theme.resolve(config.render.ruler.laneLabelBackgroundColor),
        }
    );
    SVG.makeSure
    (
        labelGroup,
        {
            tag: "text",
            class: "lane-label",
            "data-lane-index": laneIndex,
        },
        {
            x: left + 16,
            y: 26,
            fill: Theme.resolve(config.render.ruler.foregroundColor),
            "font-size": 16,
            textContent: Locale.resolve(lane.name) ?? `Lane ${laneIndex}`,
        }
    );
    const unitLabelGroup = SVG.makeSure
    (
        group,
        {
            tag: "g",
            class: "unit-label-group",
            "data-lane-index": laneIndex,
            style: "cursor: pointer;",
            events:
            {
                click: () => Render.newPopup({ popupType: "lane-unit", child: null, laneIndex, }),
            }
        }
    );
    const unitLabelBackground = SVG.makeSure
    (
        unitLabelGroup,
        {
            tag: "rect",
            class: "lane-unit-label-background",
            "data-lane-index": laneIndex,
        }
    );
    const unitLabel = SVG.makeSure
    (
        unitLabelGroup,
        {
            tag: "text",
            class: "lane-unit-label",
            "data-lane-index": laneIndex,
        }
    );
    if (undefined !== lane.unit)
    {
        SVG.setAttributes
        (
            unitLabelGroup,
            {
                visibility: "visible",
            }
        );
        SVG.setAttributes
        (
            unitLabelBackground,
            {
                // visibility: "visible",
                x: left + 8,
                y: 36,
                rx: 8,
                ry: 8,
                width: width - 16,
                height: 20,
                fill: Theme.resolve(config.render.ruler.laneLabelBackgroundColor),
            }
        );
        SVG.setAttributes
        (
            unitLabel,
            {
                // visibility: "visible",
                x: left + 16,
                y: 50,
                fill: Theme.resolve(config.render.ruler.foregroundColor),
                "font-size": 12,
                // textContent: `${Locale.map("Unit")}${Locale.map("lang-colon-suffix")} ${Model.makeConstantStandardTickUnit(lane.unit)}`,
            }
        );
        unitLabel.innerHTML = "";
        drawLeveledText(unitLabel, `${Locale.map("Unit")}${Locale.map("lang-colon-suffix")} ${Model.makeConstantStandardTickUnit(lane.unit)}`);
    }
    else
    {
        SVG.setAttributes
        (
            unitLabelGroup,
            {
                visibility: "hidden",
            }
        );
        // SVG.setAttributes
        // (
        //     unitLabelBackground,
        //     {
        //         visibility: "hidden",
        //     }
        // );
        // SVG.setAttributes
        // (
        //     unitLabel,
        //     {
        //         visibility: "hidden",
        //     }
        // );
    }
    const separator = isLastLane ?
        config.render.ruler.slideSeparator:
        config.render.ruler.laneSeparator;
    SVG.makeSure
    (
        group,
        {
            tag: "line",
            class: "lane-separator",
            "data-lane-index": laneIndex,
        },
        {
            x1: left + width,
            y1: 0,
            x2: left + width,
            y2: group.ownerSVGElement!.viewBox.baseVal.height,
            stroke: Theme.resolve(separator.color),
            "stroke-width": separator.width,
        }
    );
    tickGroup.innerHTML = "";
    const content = Model.designTicks(slide, view, lane, Model.makePositionTickWindowFromWindow());
    drawAreas(view, tickGroup, slide, lane, content.areas);
    drawTicks(view, tickGroup, slide, lane, calculateMinimumFractionDigits(content.ticks));
};
export const getAreaFill = (isInverted: boolean, area: Type.Area): string =>
{
    const direction = (( ! isInverted) ? (undefined === area.lowerBound): (undefined === area.upperBound)) ?
        "top": "bottom";
    switch(area.fill)
    {
    case "$MINUS":
        return `url(#${direction}-minus-gradient)`;
    case "$MIN":
        return `url(#${direction}-min-gradient)`;
    case "$MAX":
        return `url(#${direction}-max-gradient)`;
    case "$DENSE":
        return `url(#${direction}-dense-gradient)`;
    default:
        return area.fill;
    }
};
export const drawAreas = (view: Type.View, group: SVGGElement, slide: Type.SlideUnit, lane: Type.Lane, areas: Type.Area[], indent: number = 0): void =>
{
    const indentUnit = 20;
    const laneIndex = Model.getLaneIndex(lane);
    const left = getLeftOfLane(laneIndex) +indent;
    const width = config.render.ruler.laneWidth -indent;
    const isInvert = Model.isInvertedLane(lane);
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
                    fill: getAreaFill(isInvert, area),
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
                        fill: area.color ?? Theme.resolve(config.render.ruler.foregroundColor),
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
                    fill: getAreaFill(isInvert, area),
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
                        fill: area.color ?? Theme.resolve(config.render.ruler.foregroundColor),
                        "font-size": 12,
                        textContent: Locale.resolve(area.label),
                    })
                );
            }
        }
    }
}
export const makeNumberLabel = (tick: Type.Tick): string =>
{
    const { label, minimumFractionDigits } = tick;
    const rawValue = Type.getTickValue(tick);
    const value = Math.abs(rawValue);
    const sign = 0 <= rawValue ? "": "-";
    const unit = undefined === tick.unit ? "": ` ${tick.unit}`;
    switch(true)
    {
    case undefined !== label:
        return Locale.resolve(label);
    case value < 0.000000000001 || 10000000000000 <= value:
        return sign +Calculation.getNamedNumberLabel(value, undefined, { notation: "scientific", minimumSignificantDigits: 11, maximumSignificantDigits: 11, minimumFractionDigits, }) +unit;
        // return Number.getNamedNumberLabel(value, undefined, { notation: "compact", compactDisplay: "long" });
    default:
        return sign +Calculation.getNamedNumberLabel(value, undefined, { maximumFractionDigits: Math.max(13, minimumFractionDigits ?? 13), minimumFractionDigits, }) +unit;
        // return Number.getNamedNumberLabel(value, undefined, { notation: "compact", compactDisplay: "long" });
    }
};
export const makeShortNumberLabel = (value: number): string =>
{
    switch(true)
    {
    case value < 0.001 || 1000 <= value:
        return Calculation.getNamedNumberLabel(value, undefined, { notation: "scientific", minimumSignificantDigits: 4, maximumSignificantDigits: 4, });
        // return Number.getNamedNumberLabel(value, undefined, { notation: "compact", compactDisplay: "long" });
    default:
        return Calculation.getNamedNumberLabel(value, undefined, { maximumFractionDigits: 3, });
        // return Number.getNamedNumberLabel(value, undefined, { notation: "compact", compactDisplay: "long" });
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
            //return Math.round(-log10);
            // 計算誤差により log10 がわずかに大きくなってしまう場合があるため、補正の為に 0.001 を引いてから Math.ceil を使用する
            return Math.ceil(-log10 -0.001);
        }
    }
    return undefined;
};
export const calculateMinimumFractionDigits = (ticks: Type.Tick[]): Type.Tick[] =>
{
    const numericTicks = (ticks.filter(i => "number" === typeof i.value && undefined === i.label) as (Type.Tick & { value: number })[])
        .filter(i => "long" === i.type || true === i.isShowLabel)
        .sort(Comparer.make(i => i.value as number));
    if (1 < numericTicks.length)
    {
        numericTicks[0].minimumFractionDigits = getFractionDigitsFromUnit(numericTicks[1].value -numericTicks[0].value);
        const lastIndex = numericTicks.length -1;
        numericTicks[lastIndex].minimumFractionDigits = getFractionDigitsFromUnit(numericTicks[lastIndex].value -numericTicks[lastIndex -1].value);
    }
    for(var i = 1; i < numericTicks.length -1; ++i)
    {
        numericTicks[i].minimumFractionDigits = getFractionDigitsFromUnit
        (
            Math.max
            (
                numericTicks[i].value -numericTicks[i -1].value,
                numericTicks[i +1].value -numericTicks[i].value
            )
        );
    }
    for(const tick of numericTicks)
    {
        const selfMinimumFractionDigits = getFractionDigitsFromUnit(tick.value);
        if (undefined !== selfMinimumFractionDigits)
        {
            tick.minimumFractionDigits = Math.max
            (
                selfMinimumFractionDigits,
                tick.minimumFractionDigits ?? selfMinimumFractionDigits
            );
        }
        if (undefined !== tick.minimumFractionDigits)
        {
            tick.value = Calculation.roundE(tick.value, -tick.minimumFractionDigits);
        }
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
            const tickTrait = config.render.ruler.tick[tick.type];
            const color = Theme.resolve
            (
                tick.color ??
                (isPrimaryTick ? config.render.ruler.primaryTickColor: tickTrait.color)
            );
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
                        x2: left + tickTrait.length,
                        y2: position,
                        // stroke: tickTrait.color,
                        stroke: color,
                        "stroke-width": tickTrait.width,
                        "data-tick-value": value,
                        ...(tick.unit ? { "data-tick-unit": tick.unit } : {}),
                        ...(tick.label ? { "data-tick-label": Locale.resolve(tick.label) } : {}),
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
                        x2: right - tickTrait.length,
                        y2: position,
                        // stroke: tickTrait.color,
                        stroke: color,
                        "stroke-width": tickTrait.width,
                        "data-tick-value": value,
                        ...(tick.unit ? { "data-tick-unit": tick.unit } : {}),
                        ...(tick.label ? { "data-tick-label": Locale.resolve(tick.label) } : {}),
                    })
                );
            }
            if (tick.type === "long" || true === tick.isShowLabel)
            {
                const tickTrait = config.render.ruler.tick["long"];
                const drawLabelDirection =
                    ! drawLeftTick ? "right" :
                    ! drawRightTick ? "left" :
                    value < 1 ? "left" : "right";
                const x = "left" === drawLabelDirection ?
                    // left + tickTrait.length + 4:
                    left + tickTrait.length + 8:
                    right - tickTrait.length - 4;
                const y = position + 4;
                const text = SVG.make
                ({
                    tag: "text",
                    class: "tick-label",
                    x: x,
                    y: y,
                    //fill: tickTrait.color,
                    transform: isConstantTable ? `rotate(-45 ${x} ${y})` : undefined,
                    fill: color,
                    "font-size": 12,
                    "text-anchor": "left" === drawLabelDirection ? "start" : "end",
                    "data-tick-value": value,
                    ...(tick.unit ? { "data-tick-unit": tick.unit } : {}),
                    ...(tick.label ? { "data-tick-label": Locale.resolve(tick.label) } : {}),
                });
                group.appendChild(text);
                const { currentDy } = drawLeveledText(text, makeNumberLabel(tick));
                if (tick.behindTickCount && 0 < tick.behindTickCount)
                {
                    text.appendChild
                    (
                        SVG.make
                        ({
                            tag: "tspan",
                            class: "tick-label behind-tick-count",
                            fill: "#888888",
                            dy: -currentDy,
                            "font-size": 10.5,
                            textContent: ` (+${tick.behindTickCount})`,
                        })
                    );
                }
            }
        }
    }
};
export const garbageCollectLanes = (_view: Type.View): void =>
{
    const slideGroups = UI.rulerSvg.querySelectorAll<SVGGElement>(".slide-group");
    let isStartRemove = false;
    for(const slideGroup of Array.from(slideGroups))
    {
        const slideIndex = Number.parseInt(slideGroup.dataset.slideIndex!);
        if (isStartRemove || undefined === Model.data.slides[slideIndex])
        {
            slideGroup.remove();
        }
        else
        {
            for(const i of Array.from(slideGroup.children))
            {
                const laneIndex = i.getAttribute("data-lane-index");
                if (null !== laneIndex)
                {
                    if (isStartRemove)
                    {
                        i.remove();
                    }
                    else
                    {
                        const { slide, lane } = Model.getSlideAndLane(Number.parseInt(laneIndex));
                        if (undefined === lane || slide !== Model.data.slides[slideIndex])
                        {
                            i.remove();
                            isStartRemove = true;
                        }
                    }
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
    let minDistance = Calculation.MAX_VALUE;
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
    let minDistance = Calculation.MAX_VALUE;
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
    const minPosition = Model.getPositionAt(slide, lane, Calculation.MIN_VALUE, view) ?? -Calculation.MAX_VALUE;
    const maxPosition = Model.getPositionAt(slide, lane, Calculation.MAX_VALUE, view) ?? Calculation.MAX_VALUE;
    const snappedPosition = snapVerticalPosition(event, view, position);
    const resultPosition = Math.min(maxPosition, Math.max(minPosition, snappedPosition));
    model.cursor = Model.getValueAt(slide, lane, resultPosition, view)?.value ?? model.cursor;
    Render.markDirty("ANCHOR_LINE");
    return snappedPosition -position;
};
export const drawAnchorLine = (model: Type.Model, view: Type.View, options?: Type.RenderingOptions): void =>
{
    const { slide, lane } = Model.getRootSlideAndRootLane();
    const svg = UI.rulerOverlay;
    const color = config.render.ruler.lineColor;
    const handleRadius = 24;
    const lineOnBackground = SVG.makeSure
    (
        UI.rulerSvg,
        {
            tag: "line",
            class: "anchor-line",
        }
    );
    const lineOnOverlay = SVG.makeSure
    (
        UI.rulerOverlay,
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
    if (0 <= position && position <= UI.rulerSvg.viewBox.baseVal.height && false !== options?.showCursor)
    {
        //const color = "red";
        SVG.setAttributes
        (
            lineOnBackground,
            {
                visibility: "visible",
                x1: 0,
                y1: position,
                x2: UI.rulerSvg.viewBox.baseVal.width,
                y2: position,
                stroke: color,
                "stroke-width": config.render.ruler.lineWidth,
            }
        );
        SVG.setAttributes
        (
            lineOnOverlay,
            {
                visibility: "visible",
                x1: UI.rulerSvg.viewBox.baseVal.width,
                y1: position,
                x2: UI.rulerOverlay.viewBox.baseVal.width -(handleRadius *2),
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
            lineOnBackground,
            {
                visibility: "hidden",
            }
        );
        SVG.setAttributes
        (
            lineOnOverlay,
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
export const drawPopup = (view: Type.View, popup: Type.ViewPopup | null = null): void =>
{
    console.warn(`🦋 drawPopup: ${popup?.popupType ?? "null"}`);
    if (null === popup)
    {
        const popups = UI.rulerOverlay.querySelectorAll<SVGElement>(".popup");
        for(const popup of Array.from(popups))
        {
            popup.remove();
        }
        if (null !== view.popup)
        {
            drawPopup(view, view.popup);
        }
    }
    else
    {
        switch(popup.popupType)
        {
        case "lane-property":
            drawLanePropertyPopup(view, popup as Type.LanePropertyPopup);
            break;
        case "lane-unit":
            drawLaneUnitPopup(view, popup as Type.LaneUnitPopup);
            break;
        default:
            console.warn(`🦋 Unknown popup type: ${(popup as any).popupType}`);
            break;
        }
    }
};
export const drawLanePropertyPopup = (_view: Type.View, _popup: Type.LanePropertyPopup): void =>
{
    console.warn("🦋 drawLanePropertyPopup is not implemented yet.");
};
export const drawLaneUnitPopup = (_view: Type.View, popup: Type.LaneUnitPopup): void =>
{
    console.warn("🚀 drawLaneUnitPopup is not implemented yet.");
    const laneIndex = popup.laneIndex;
    const lane = Model.getLane(laneIndex);
    const left = getLeftOfLane(laneIndex);
    const width = config.render.ruler.laneWidth;
    const unitlist = Model.getUnitList(lane).sort(Comparer.make(i => i.value));
    console.log(`🦋 drawLaneUnitPopup: laneIndex=${laneIndex}, unitlist=${JSON.stringify(unitlist)}`);
    // const unitPopupBackground =
    SVG.makeSure
    (
        UI.rulerOverlay,
        {
            tag: "rect",
            class: "lane-unit-popup-background popup",
            "data-lane-index": laneIndex,
            x: left + 8,
            y: 36,
            rx: 8,
            ry: 8,
            width: width - 16 +90,
            height: 20 * unitlist.length,
            fill: Theme.resolve(config.render.ruler.laneLabelBackgroundColor),
            events:
            {
                click: () => Render.newPopup({ popupType: "lane-unit", child: null, laneIndex, }),
            }
        }
    );
    for(const [index, unit] of unitlist.entries())
    {
        const unitLabel = SVG.makeSure
        (
            UI.rulerOverlay,
            {
                tag: "text",
                class: "lane-unit-popup-unit-label popup",
                "data-lane-index": laneIndex,
                "data-unit-index": index,
                x: left + 16,
                y: 36 + 20 * index +14,
                rx: 8,
                ry: 8,
                width: width - 16,
                height: 20,
                fill: Theme.resolve(config.render.ruler.foregroundColor),
                "font-size": 12,
                events:
                {
                    click: () =>
                    {
                        
                    },
                }
            }
        );
        drawLeveledText(unitLabel, `${Model.makeConstantStandardTickUnit(unit)}`);
        const unitValueLabel = SVG.makeSure
        (
            UI.rulerOverlay,
            {
                tag: "text",
                class: "lane-unit-popup-unit-label popup",
                "data-lane-index": laneIndex,
                "data-unit-index": index,
                x: left -16 +width +90,
                y: 36 + 20 * index +14,
                rx: 8,
                ry: 8,
                width: width - 16 +90,
                height: 20,
                fill: Theme.resolve(config.render.ruler.foregroundColor),
                "font-size": 12,
                "text-anchor": "end",
                events:
                {
                    click: () =>
                    {
                        
                    },
                }
            }
        );
        drawLeveledText(unitValueLabel, ` = ${makeShortNumberLabel(unit.value)} ${lane.unit?.symbol ?? Locale.resolve(lane.unit?.label) ?? ""}`);
    }
};
export const resize = () =>
{
    const laneIndex = Model.getAllLaneCount();
    const left = getLeftOfLane(laneIndex);
    UI.rulerNewSlidePanel.style.left = `${left}px`;
    UI.rulerHelpPanel.style.left = `${UI.rulerNewSlidePanel.clientWidth +left}px`;
    const width = Math.min(document.body.clientWidth, getRulerWidth());
    SVG.setAttributes
    (
        UI.rulerSvg,
        {
            width: width,
            height: document.body.clientHeight,
            viewBox: `0 0 ${width} ${document.body.clientHeight}`,
        }
    );
    SVG.setAttributes
    (
        UI.rulerOverlay,
        {
            width: document.body.clientWidth,
            height: document.body.clientHeight,
            viewBox: `0 0 ${document.body.clientWidth} ${document.body.clientHeight}`,
        }
    );
};
export const getRulerWidth = (): number => LaneWidths.reduce((a, b) => a + b, 0);
export const initialize = (): void =>
{
    Render.markDirty("DEFINES");
    Render.markDirty(Render.RenderItemId.Size);
    // resize();
};
