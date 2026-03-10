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
    export const scaleModeList: readonly ["logarithmic", "linear"];
    export type ScaleMode = typeof scaleModeList[number];
    export interface View {
        viewMode: ViewMode;
        viewScaleExponent: number;
        scaleMode: ScaleMode;
        baseOfLogarithm: NamedNumber;
    }
    export const getViewScale: (view: View) => number;
    export type PrimaryLane = "logarithmic" | "sine" | "cosine" | "tangent" | "cotangent" | "linear";
    export interface LaneBase {
        type: PrimaryLane;
        isInverted: boolean;
        logScale: NamedNumber;
    }
    export interface Lane extends LaneBase {
        name: string | null;
        isLinked: boolean;
        offset: number;
    }
    export interface SlideUnit {
        lanes: Lane[];
        anchor: number;
    }
    export interface Model {
        slides: SlideUnit[];
        anchor: number;
    }
    export type TickType = "mini" | "short" | "medium" | "long";
    export interface Tick {
        value: NamedNumber;
        type: TickType;
        color?: string;
    }
}
declare module "script/ui" {
    export const setAriaHidden: (element: HTMLElement | SVGElement, hidden: boolean) => void;
    export const setTextContent: (element: HTMLElement, text: string) => boolean;
    export const setAttribute: (element: HTMLElement, name: string, value: string | undefined) => boolean;
    export const setStyle: (element: HTMLElement, name: string, value: string | undefined) => boolean;
    export const updateRoundBar: (button: HTMLButtonElement, properties: {
        low: number;
        high: number;
        rotate: number;
    }) => void;
    export const viewList: HTMLDivElement;
    export const rulerView: HTMLDivElement;
    export const rulerSvg: SVGSVGElement;
    export const gridView: HTMLDivElement;
    export const graphView: HTMLDivElement;
    export const controlPanel: HTMLDivElement;
    export const viewModeButton: HTMLButtonElement;
    export const scaleModeButton: HTMLButtonElement;
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
    export const MAX_VALUE: number;
    export const MIN_VALUE: number;
}
declare module "script/model" {
    import * as Type from "script/type";
    export const data: Type.Model;
    export const RootLaneIndex = 0;
    export const getAllLanes: () => Type.Lane[];
    export const getValueAt: (lane: Type.Lane, position: number, view: Type.View) => number | undefined;
    export const getRawPositionAt: (lane: Type.Lane, value: number, view: Type.View) => number;
    export const getPositionAt: (lane: Type.Lane, value: number, view: Type.View) => number;
    export const getWidth: (lane: Type.Lane, bottom: number, top: number, view: Type.View) => number;
    export const designTicks10: (view: Type.View, lane: Type.Lane, base: number, unit: number, parent: {
        index: number;
        width: number;
    }) => Type.Tick[];
    export const designTicks: (view: Type.View, lane: Type.Lane) => Type.Tick[];
    export const makeRootLane: () => Type.Lane;
    export const getRootLane: () => Type.Lane;
    export const isRootLane: (indexOrLane: number | Type.Lane) => boolean;
    export const getRootSlide: () => Type.SlideUnit;
    export const isRootSlide: (indexOrSlide: number | Type.SlideUnit) => boolean;
    export const getSlideIndex: (slide: Type.SlideUnit) => number;
    export const getLaneIndex: (lane: Type.Lane) => number;
    export const makeSlide: (anchor?: number) => Type.SlideUnit;
    export const makeSureSlide: () => Type.SlideUnit;
    export const getLaneAndSlide: (index: number) => {
        lane: Type.Lane;
        slide: Type.SlideUnit;
    };
    export const getLane: (index: number) => Type.Lane;
    export const getSlideFromLane: (lane: Type.Lane) => Type.SlideUnit;
    export const addLane: (lane: Type.Lane) => void;
    export const makeLane: (laneSeed: Type.LaneBase) => Type.Lane;
    export const removeLane: (index: number) => void;
    export const makeSure: () => void;
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
    export const getScaleMode: () => Type.ScaleMode;
    export const isLogarithmicScale: () => boolean;
    export const isLinearScale: () => boolean;
    export const setScaleMode: (mode: Type.ScaleMode) => void;
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
    export type Attributes = Exclude<{
        [key: string]: string | number;
    }, "tag" | "events"> | {
        events?: Events;
    };
    export const addEvents: <T extends Element>(element: T, events: Events) => T;
    export const removeEvents: <T extends Element>(element: T, events: Events) => T;
    export const setAttributes: <T extends Element>(element: T, attributes: Attributes) => T;
    export const makeSelector: (source: {
        tag?: Tag;
    } & Attributes) => string;
}
declare module "script/svg" {
    import * as ELEMENT from "script/element";
    export type Tag = ELEMENT.SvgTag;
    export type ElementTagNameMap = SVGElementTagNameMap;
    export type EventListener<key extends keyof GlobalEventHandlersEventMap> = ELEMENT.EventListener<key>;
    export type Events = ELEMENT.Events;
    export type Attributes = ELEMENT.Attributes;
    export const addEvents: <T extends Element>(element: T, events: ELEMENT.Events) => T;
    export const removeEvents: <T extends Element>(element: T, events: ELEMENT.Events) => T;
    export const setAttributes: <T extends Element>(element: T, attributes: ELEMENT.Attributes) => T;
    export const makeSelector: (source: {
        tag?: ELEMENT.Tag;
    } & ELEMENT.Attributes) => string;
    export const makeElement: <T extends Tag>(tag: T) => ElementTagNameMap[T];
    export const make: <T extends Tag>(source: {
        tag: T;
    } & Attributes) => ElementTagNameMap[T];
    export const makeSure: <T extends Tag>(parent: Element, source: {
        tag: T;
    } & Attributes) => ElementTagNameMap[T];
}
declare module "script/ruler" {
    import * as Type from "script/type";
    export let scale: number;
    export let LaneWidths: number[];
    export const snapTargetPositions: number[][];
    export const renderer: (model: Type.Model, view: Type.View, dirty: boolean | Set<number>) => void;
    export const drawDefines: (model: Type.Model, view: Type.View) => void;
    export const drawErrorAreaDefines: (_model: Type.Model, _view: Type.View, defs: SVGDefsElement) => void;
    export const drawSlide: (view: Type.View, slide: Type.SlideUnit) => void;
    export const drawLane: (view: Type.View, group: SVGGElement, lane: Type.Lane) => void;
    export const drawErrorArea: (view: Type.View, group: SVGGElement, lane: Type.Lane) => void;
    export const makeNumberLabel: (value: Type.NamedNumber) => string;
    export const drawTick: (view: Type.View, group: SVGGElement, lane: Type.Lane, tick: Type.Tick) => void;
    export const snapPosition: (event: PointerEvent, position: number) => number;
    export const drawAnchorLine: (model: Type.Model, view: Type.View) => void;
    export const resize: () => unknown;
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
declare module "script/event" {
    export const updateViewModeRoundBar: () => void;
    export const updateScaleModeRoundBar: () => void;
    export const getViewScaleRate: () => number;
    export const getViewScaleExponentFromRate: (rate: number) => number;
    export const updateViewScaleRoundBar: () => void;
    export const zoomIn: () => void;
    export const zoomOut: () => void;
    export const getZoomCenter: () => number;
    export const zoom: (delta: number) => void;
    export const zoomByRange: (value: number) => void;
    export const scroll: (delta: number) => void;
    export const resetZoom: () => void;
    export const initialize: () => void;
}
declare module "script/index" { }
