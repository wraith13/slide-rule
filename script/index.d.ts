declare module "script/url" {
    export const parseParameter: (url: string) => Record<string, string>;
    export const make: () => string;
    export const addParameter: (key: string, value: string) => Record<string, string>;
    export const get: (key: string) => string | undefined;
    export const initialize: () => void;
    export const reloadParameters: () => Record<string, string>;
}
declare module "script/type" {
    export type NamedNumber = number | "phi" | "e" | "pi";
    export const namedNumberList: NamedNumber[];
    export const isNamedNumber: (value: unknown) => value is "phi" | "e" | "pi";
    export const phi: number;
    export const getNamedNumberValue: (value: NamedNumber) => number;
    export const getNamedNumberLabel: (value: NamedNumber, locales?: Intl.LocalesArgument, options?: Intl.NumberFormatOptions) => string;
    export const getNext: <T>(list: readonly T[], current: T, isReverse?: boolean) => T;
    export const viewModeList: readonly ["ruler", "grid", "graph"];
    export type ViewMode = typeof viewModeList[number];
    export interface View {
        viewMode: ViewMode;
        viewScaleExponent: number;
        baseOfLogarithm: NamedNumber;
    }
    export const getViewScale: (view: View) => number;
    export type PrimaryLane = "logarithmic" | "invert" | "power" | "2^n" | "prime" | "sine" | "cosine" | "tangent" | "cotangent" | "constant";
    export interface LaneBase {
        name?: string;
        type: PrimaryLane;
        exponent?: number;
        withoutLabel?: boolean;
        table?: ContantTable;
    }
    export interface Lane extends Omit<LaneBase, "name"> {
        name: string | null;
    }
    export interface ContantTable {
        label: string;
        unit?: string;
        ticks: ContantTableTick[];
        areas: ContantTableArea[];
    }
    export interface ContantTableTick {
        value: number;
        label: string;
        priority?: number;
        color?: string;
    }
    export interface ContantTableArea {
        lowerBound: number | null;
        upperBound: number | null;
        fill: string;
        overlay?: AreaOverlayType;
        label?: string;
        color?: string;
        details?: ContantTableArea[];
    }
    export interface SlideUnit {
        lanes: Lane[];
        anchor: number;
    }
    export interface Model {
        slides: SlideUnit[];
        cursor: number;
        offset: {
            x: number;
            y: number;
        };
    }
    export type LaneContext = "left-end" | "center" | "right-end" | "single";
    export type TickType = "none" | "mini" | "short" | "medium" | "long";
    export type ValueWithBasePosition = {
        value: number;
        basePosition: number;
    };
    export type ExValue = number | ValueWithBasePosition;
    export const getExValueNumber: (exValue: ExValue) => number;
    export interface Tick {
        value: ExValue;
        type: TickType;
        label?: string;
        color?: string;
        minimumFractionDigits?: number;
    }
    export const getTickValue: (tick: Tick) => number;
    export type AreaOverlayType = "none" | "top" | "bottom" | "center" | "edges";
    export interface Area {
        lowerBound: number | undefined;
        upperBound: number | undefined;
        fill: string;
        overlay?: AreaOverlayType;
        label?: string;
        color?: string;
        details?: Area[];
    }
    export interface LaneContent {
        ticks: Tick[];
        areas: Area[];
    }
}
declare module "script/element" {
    export type HtmlTag = keyof HTMLElementTagNameMap;
    export type SvgTag = keyof SVGElementTagNameMap;
    export type Tag = HtmlTag | SvgTag;
    export type PrimitiveEventListener<key extends keyof GlobalEventHandlersEventMap> = (event: GlobalEventHandlersEventMap[key]) => void;
    export type EventListener<key extends keyof GlobalEventHandlersEventMap> = PrimitiveEventListener<key> | {
        listener: PrimitiveEventListener<key>;
        options?: boolean | AddEventListenerOptions;
    };
    export type Events = {
        [key in keyof GlobalEventHandlersEventMap]?: EventListener<key>;
    };
    export type Style = {
        [key: string]: string | undefined;
    };
    export type Attributes = Exclude<{
        [key: string]: string | number | undefined;
    }, "tag" | "events" | "style" | "children"> | {
        events?: Events;
        style?: string | Style;
    };
    export type Source<T extends Tag> = {
        tag: T;
        children?: (Node | Source<Tag>)[];
    } & Attributes;
    export type Child = Required<Source<Tag>>["children"][number];
    export const addEvents: <T extends Element>(element: T, events: Events) => T;
    export const removeEvents: <T extends Element>(element: T, events: Events) => T;
    export const setTextContent: (element: Node, text: string) => boolean;
    export const setAttribute: (element: Element, name: string, value: string | undefined) => boolean;
    export const setStyle: (element: HTMLElement | SVGElement, name: string, value: string | undefined) => boolean;
    export const setStyles: (element: HTMLElement | SVGElement, styles: Style) => boolean;
    export const setAttributes: <T extends HTMLElement | SVGElement>(element: T, attributes: Attributes) => T;
    export const makeSelector: (source: {
        tag?: Tag;
    } & Attributes) => string;
}
declare module "script/html" {
    import * as ELEMENT from "script/element";
    export type Tag = ELEMENT.HtmlTag;
    export type ElementTagNameMap = HTMLElementTagNameMap;
    export type EventListener<key extends keyof GlobalEventHandlersEventMap> = ELEMENT.EventListener<key>;
    export type Events = ELEMENT.Events;
    export type Attributes = ELEMENT.Attributes;
    export type Source<T extends Tag> = {
        tag: T;
        children?: (Node | Source<Tag>)[];
    } & Attributes;
    export type Child = Required<Source<Tag>>["children"][number];
    export const addEvents: <T extends Element>(element: T, events: ELEMENT.Events) => T;
    export const removeEvents: <T extends Element>(element: T, events: ELEMENT.Events) => T;
    export const setTextContent: (element: Node, text: string) => boolean;
    export const setAttribute: (element: Element, name: string, value: string | undefined) => boolean;
    export const setStyle: (element: HTMLElement | SVGElement, name: string, value: string | undefined) => boolean;
    export const setAttributes: <T extends HTMLElement | SVGElement>(element: T, attributes: ELEMENT.Attributes) => T;
    export const makeSelector: (source: {
        tag?: ELEMENT.Tag;
    } & ELEMENT.Attributes) => string;
    export const getElementById: <T extends keyof ElementTagNameMap>(tag: T, id: string) => ElementTagNameMap[T];
    export const makeElement: <T extends Tag>(tag: T) => ElementTagNameMap[T];
    export const make: <T extends Tag>(source: Source<T>) => ElementTagNameMap[T];
    export const makeSure: <T extends Tag>(parent: Element, source: Source<T>) => ElementTagNameMap[T];
}
declare module "script/svg" {
    import * as ELEMENT from "script/element";
    export type Tag = ELEMENT.SvgTag;
    export type ElementTagNameMap = SVGElementTagNameMap;
    export type EventListener<key extends keyof GlobalEventHandlersEventMap> = ELEMENT.EventListener<key>;
    export type Events = ELEMENT.Events;
    export type Attributes = ELEMENT.Attributes;
    export type Source<T extends Tag> = {
        tag: T;
        children?: (Node | Source<Tag>)[];
    } & Attributes;
    export type Child = Required<Source<Tag>>["children"][number];
    export const addEvents: <T extends Element>(element: T, events: ELEMENT.Events) => T;
    export const removeEvents: <T extends Element>(element: T, events: ELEMENT.Events) => T;
    export const setTextContent: (element: Node, text: string) => boolean;
    export const setAttribute: (element: Element, name: string, value: string | undefined) => boolean;
    export const setStyle: (element: HTMLElement | SVGElement, name: string, value: string | undefined) => boolean;
    export const setAttributes: <T extends HTMLElement | SVGElement>(element: T, attributes: ELEMENT.Attributes) => T;
    export const makeSelector: (source: {
        tag?: ELEMENT.Tag;
    } & ELEMENT.Attributes) => string;
    export const getElementById: <T extends keyof ElementTagNameMap>(tag: T, id: string) => ElementTagNameMap[T];
    export const makeElement: <T extends Tag>(tag: T) => ElementTagNameMap[T];
    export const make: <T extends Tag>(source: Source<T>) => ElementTagNameMap[T];
    export const makeSure: <T extends Tag>(parent: Element, source: Source<T>) => ElementTagNameMap[T];
}
declare module "script/ui" {
    export const setAriaHidden: (element: HTMLElement | SVGElement, hidden: boolean) => void;
    export const updateRoundBar: (button: HTMLButtonElement, properties: {
        low: number;
        high: number;
        rotate: number;
    }) => void;
    export const viewList: HTMLDivElement;
    export const rulerView: HTMLDivElement;
    export const rulerSvg: SVGSVGElement;
    export const rulerOverlay: SVGSVGElement;
    export const gridView: HTMLDivElement;
    export const graphView: HTMLDivElement;
    export const rulerNewSlidePanel: HTMLDivElement;
    export const addSlideButton: HTMLButtonElement;
    export const addInvertLaneButton: HTMLButtonElement;
    export const addSquaredLaneButton: HTMLButtonElement;
    export const addCubedLaneButton: HTMLButtonElement;
    export const addSquareRootLaneButton: HTMLButtonElement;
    export const addCubeRootLaneButton: HTMLButtonElement;
    export const add2nLaneButton: HTMLButtonElement;
    export const addPrimeNumbersLaneButton: HTMLButtonElement;
    export const addSineLaneButton: HTMLButtonElement;
    export const addCosineLaneButton: HTMLButtonElement;
    export const addTangentLaneButton: HTMLButtonElement;
    export const addCotangentLaneButton: HTMLButtonElement;
    export const addSizeLaneButton: HTMLButtonElement;
    export const addMassLaneButton: HTMLButtonElement;
    export const addTimeLaneButton: HTMLButtonElement;
    export const addSpeedLaneButton: HTMLButtonElement;
    export const addTemperatureLaneButton: HTMLButtonElement;
    export const addHistoryLaneButton: HTMLButtonElement;
    export const addEmWavelengthLaneButton: HTMLButtonElement;
    export const rulerHelpPanel: HTMLDivElement;
    export const controlPanel: HTMLDivElement;
    export const viewModeButton: HTMLButtonElement;
    export const viewScaleButton: HTMLButtonElement;
    export const viewScalePanel: HTMLDivElement;
    export const viewScaleRange: HTMLInputElement;
    export const initialize: () => void;
}
declare module "script/number" {
    export const parse: (value: string | undefined) => number | undefined;
    export const orUndefined: (value: any) => number | undefined;
    export const floorTo1Mantissa: (n: number) => number;
    export const ceilTo1Mantissa: (n: number) => number;
    export const MAX_SAFE_INTEGER: number;
    export const MAX_VALUE: number;
    export const MIN_VALUE: number;
    export const clamp: (value: number) => number;
    export const minMax: (value: number | undefined) => number;
    export const maxMin: (value: number | undefined) => number;
    export const isInteger: (number: unknown) => boolean;
    export const primeNumbers: number[];
    export const isPrimeNumber: (value: number) => boolean;
    export const System: NumberConstructor;
    export const SafeOr1: (value: number) => number;
}
declare module "script/comparer" {
    export type TypeOfResultType = "unknown" | "object" | "boolean" | "number" | "bigint" | "string" | "symbol" | "function" | string;
    export type CompareResultType = -1 | 0 | 1;
    export const basic: <valueT>(a: valueT, b: valueT) => CompareResultType;
    export interface RawSource<objectT> {
        raw: (a: objectT, b: objectT) => CompareResultType;
    }
    export interface Source<objectT, valueT, valueT2> {
        condition?: ((a: objectT, b: objectT) => boolean) | TypeSource<objectT, valueT2>;
        getter: (object: objectT) => valueT;
    }
    export interface TypeSource<objectT, valueT> {
        getter?: (object: objectT) => valueT;
        type: TypeOfResultType;
    }
    export const make: <objectT, valueT = unknown, valueT2 = unknown>(source: ((object: objectT) => valueT) | RawSource<objectT> | Source<objectT, valueT, valueT2> | ((((object: objectT) => valueT) | RawSource<objectT> | Source<objectT, valueT, valueT2>)[])) => ((a: objectT, b: objectT) => CompareResultType);
    export const lowerCase: (a: string, b: string) => CompareResultType;
}
declare module "script/model" {
    import * as Type from "script/type";
    export const data: Type.Model;
    export type ValueWithBasePosition = {
        value: number;
        basePosition: number;
    };
    export type ExValue = number | ValueWithBasePosition;
    export const RootSlideIndex = 0;
    export const RootLaneIndex = 0;
    export const getAllLaneCount: () => number;
    export const getAllLanes: () => Type.Lane[];
    export const isInvertLane: (lane: Type.Lane) => boolean;
    export const getPrimaryPeriod: (lane: Type.Lane) => number | undefined;
    export const isPeriodicLane: (lane: Type.Lane) => boolean;
    export const getPrimaryValueAt: (lane: Type.Lane, position: number) => number;
    export const getPrimaryPositionAt: (lane: Type.Lane, value: number) => number;
    export const getValueAt: (slide: Type.SlideUnit, lane: Type.Lane, position: number, view: Type.View) => ValueWithBasePosition | undefined;
    export const getLinearPositionAt: (lane: Type.Lane, value: ExValue) => number;
    export const getRawViewPositionAt: (lane: Type.Lane, value: ExValue, view: Type.View) => number;
    export const getAnchorSlideAndLane: (slide: Type.SlideUnit) => {
        anchorSlide?: Type.SlideUnit;
        anchorLane?: Type.Lane;
    };
    export const getSlideOffset: (slide: Type.SlideUnit, view: Type.View) => number;
    export const getPositionAt: (slide: Type.SlideUnit, lane: Type.Lane, value: ExValue, view: Type.View) => number;
    export const getWidth: (slide: Type.SlideUnit, lane: Type.Lane, bottom: number, top: number, view: Type.View, isInvert?: boolean | "auto") => number;
    export const getSnapReferenceLaneIndex: (slide: Type.SlideUnit) => number;
    export type PositionTickWindow = {
        topPosition: number;
        bottomPosition: number;
    };
    export type ValueTickWindow = {
        topValue: ValueWithBasePosition;
        bottomValue: ValueWithBasePosition;
    };
    export type TickWindow = PositionTickWindow | ValueTickWindow;
    export const PositionTickWindowToValueTickWindow: (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, positionTickWindow: PositionTickWindow) => ValueTickWindow;
    export const makePositionTickWindowFromWindow: () => PositionTickWindow;
    export const makePositionTickWindowFromPositionAndWidth: (position: number, width: number) => PositionTickWindow;
    export const getLongTickSpaceWidth: (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, ticks: Type.Tick[], value: number) => number;
    export const designTickType: (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, ticks: Type.Tick[], value: number) => Type.TickType;
    export const designTicks10: (view: Type.View, slide: Type.SlideUnit, lane: Type.Lane, base: number, unit: number, parent: {
        index: number;
        width: number;
    }, tickWindow: ValueTickWindow) => Type.Tick[];
    export const designRegularTicks: (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow) => Type.LaneContent;
    export const design2nTicks: (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow) => Type.LaneContent;
    export const designPrimeNumbersTicks: (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow) => Type.LaneContent;
    export const designConstantAreas: (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow, area: Type.ContantTableArea) => Type.Area[];
    export const designConstantTicks: (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow) => Type.LaneContent;
    export const designPeriodicTicks: (_slide: Type.SlideUnit, _view: Type.View, _lane: Type.Lane, _tickWindow: PositionTickWindow) => Type.LaneContent;
    export const designTicks: (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: PositionTickWindow) => Type.LaneContent;
    export const makeRootLane: () => Type.Lane;
    export const getRootLane: () => Type.Lane;
    export const isRootLane: (indexOrLane: number | Type.Lane) => boolean;
    export const isPrimaryLane: (lane: Type.Lane) => boolean;
    export const getRootSlide: () => Type.SlideUnit;
    export const getRootSlideAndRootLane: () => {
        slide: Type.SlideUnit;
        lane: Type.Lane;
    };
    export const isRootSlide: (indexOrSlide: number | Type.SlideUnit) => boolean;
    export const getSlideIndex: (slide: Type.SlideUnit) => number;
    export const getSlideIndexFromLane: (lane: Type.Lane) => number;
    export const getLaneIndex: (lane: Type.Lane) => number;
    export const makeSlide: (anchor?: number) => Type.SlideUnit;
    export const makeSureSlide: () => Type.SlideUnit;
    export const getSlideAndLane: (index: number) => {
        slide: Type.SlideUnit;
        lane: Type.Lane;
    };
    export const getLastSlideAndLastLane: () => {
        slide: Type.SlideUnit;
        lane: Type.Lane;
    };
    export const getLane: (index: number) => Type.Lane;
    export const getSlideFromLane: (lane: Type.Lane) => Type.SlideUnit;
    export const addLane: (lane: Type.Lane) => void;
    export const makeLane: (laneSeed: Type.LaneBase) => Type.Lane;
    export const removeLane: (index: number) => void;
    export const makeSure: () => void;
    export const getCursorPosition: (view: Type.View) => number;
    export const getCursorValue: (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View) => ValueWithBasePosition | undefined;
    export const getCursorValues: (view: Type.View) => (ValueWithBasePosition | undefined)[];
    export const getLaneContext: (lane: Type.Lane) => Type.LaneContext;
    export const initialize: () => void;
}
declare module "script/view" {
    import * as Type from "script/type";
    export const data: Type.View;
    export const getViewMode: () => Type.ViewMode;
    export const isRulerView: () => boolean;
    export const isGridView: () => boolean;
    export const isGraphView: () => boolean;
    export const setViewMode: (mode: Type.ViewMode) => void;
    export const getViewScale: () => number;
    export const setViewScaleExponent: (exponent: number) => void;
    export const initialize: () => void;
}
declare module "script/environment" {
    export const isApple: () => boolean;
}
declare module "script/render" {
    import * as Type from "script/type";
    let currentRenderer: (model: Type.Model, view: Type.View, dirty: boolean | Set<number>) => unknown;
    export const isDirty: () => boolean;
    export const markDirty: (laneIndex?: number) => void;
    export const setRenderer: (renderer: typeof currentRenderer) => (model: Type.Model, view: Type.View, dirty: boolean | Set<number>) => unknown;
}
declare module "script/ruler" {
    import * as Type from "script/type";
    export let scale: number;
    export let LaneWidths: number[];
    export const renderer: (model: Type.Model, view: Type.View, dirty: boolean | Set<number>) => void;
    export const getLaneIndexFromPosition: (position: number) => number | null;
    export const drawDefines: (model: Type.Model, view: Type.View) => void;
    export const makeLinerGradient: (defs: SVGDefsElement, id: string, line: {
        x1: string;
        y1: string;
        x2: string;
        y2: string;
    }, stops: {
        offset: string;
        color: string;
        opacity: number;
    }[]) => SVGLinearGradientElement;
    export const drawOverlayDefines: (_model: Type.Model, _view: Type.View, defs: SVGDefsElement) => void;
    export const drawErrorAreaDefines: (_model: Type.Model, _view: Type.View, defs: SVGDefsElement) => void;
    export const drawDenseAreaDefines: (_model: Type.Model, _view: Type.View, defs: SVGDefsElement) => void;
    export const drawSlide: (view: Type.View, slide: Type.SlideUnit) => void;
    export const getLeftOfLane: (laneIndex: number) => number;
    export const drawLane: (view: Type.View, group: SVGGElement, slide: Type.SlideUnit, lane: Type.Lane) => void;
    export const drawAreas: (view: Type.View, group: SVGGElement, slide: Type.SlideUnit, lane: Type.Lane, areas: Type.Area[], indent?: number) => void;
    export const drawErrorArea: (view: Type.View, group: SVGGElement, slide: Type.SlideUnit, lane: Type.Lane) => void;
    export const makeNumberLabel: (tick: Type.Tick) => string;
    export const getFractionDigitsFromUnit: (unit: number) => number | undefined;
    export const calculateMinimumFractionDigits: (ticks: Type.Tick[]) => Type.Tick[];
    export const drawTicks: (view: Type.View, group: SVGGElement, slide: Type.SlideUnit, lane: Type.Lane, ticks: Type.Tick[]) => void;
    export type SnapPositionEvent = KeyboardEvent | PointerEvent | WheelEvent | TouchEvent | MouseEvent | "NOSNAP";
    export const getReferenceLaneIndexFromEvent: (event: SnapPositionEvent) => number | null;
    export const regulateReferencePositions: (referencePositions: number[]) => number[];
    export const snapPosition: (position: number, referencePositions: number[]) => number;
    export const nextPosition: (position: number, referencePositions: number[], direction: "PREVIOUS" | "NEXT") => number;
    export const getAreaPositions: (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, areas: Type.Area[]) => number[];
    export const snapVerticalPosition: (event: SnapPositionEvent, view: Type.View, position: number, referenceLaneIndex?: number) => number;
    export const snapHorizontalPosition: (event: SnapPositionEvent, position: number) => number;
    export const slideCursor: (model: Type.Model, view: Type.View, event: PointerEvent | WheelEvent, position: number) => number;
    export const drawAnchorLine: (model: Type.Model, view: Type.View) => void;
    export const drawMenuLane: (_view: Type.View) => void;
    export const resize: () => void;
    export const getRulerWidth: () => number;
    export const initialize: () => void;
}
declare module "script/grid" {
    import * as Type from "script/type";
    export const renderer: (_model: Type.Model, _view: Type.View, _dirty: boolean | Set<number>) => void;
}
declare module "script/graph" {
    import * as Type from "script/type";
    export const renderer: (_model: Type.Model, _view: Type.View, _dirty: boolean | Set<number>) => void;
}
declare module "script/command" {
    import * as Type from "script/type";
    export const addLane: (laneSeed: Type.LaneBase) => void;
    export const AddConstantLane: (constant: Type.ContantTable) => void;
    export const addSizeLane: () => void;
    export const addMassLane: () => void;
    export const addTimeLane: () => void;
    export const addSpeedLane: () => void;
    export const addTemperatureLane: () => void;
    export const addHistoryLane: () => void;
    export const addEmWavelengthLane: () => void;
}
declare module "script/event" {
    import * as Type from "script/type";
    import * as Ruler from "script/ruler";
    export const updateViewModeRoundBar: () => void;
    export const getViewScaleRate: () => number;
    export const getViewScaleExponentFromRate: (rate: number) => number;
    export const updateViewScaleRoundBar: () => void;
    export const zoomIn: () => void;
    export const zoomOut: () => void;
    export const getZoomCenter: () => number;
    export const zoom: (delta: number) => void;
    export const zoomByRange: (value: number) => void;
    export const shiftSlide: (event: Ruler.SnapPositionEvent, slide: Type.SlideUnit, delta: number) => void;
    export const verticalScroll: (event: Ruler.SnapPositionEvent, delta: number, slide?: Type.SlideUnit) => void;
    export const horizontalScroll: (event: Ruler.SnapPositionEvent, delta: number) => void;
    export const resetZoom: () => void;
    export const bindCommandToButton: (button: HTMLButtonElement, command: () => void) => void;
    export const initialize: () => void;
}
declare module "script/index" { }
