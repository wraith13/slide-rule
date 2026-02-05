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
        viewScale: number;
        scaleMode: ScaleMode;
        baseOfLogarithm: NamedNumber;
    }
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
    export const rulerView: HTMLDivElement;
    export const rulerSvg: SVGSVGElement;
    export const gridView: HTMLDivElement;
    export const graphView: HTMLDivElement;
    export const controlPanel: HTMLDivElement;
    export const viewModeButton: HTMLButtonElement;
    export const scaleModeButton: HTMLButtonElement;
    export const initialize: () => void;
}
declare module "script/number" {
    export const parse: (value: string | undefined) => number | undefined;
    export const orUndefined: (value: any) => number | undefined;
}
declare module "script/model" {
    import * as Type from "script/type";
    export const data: Type.Model;
    export const RootLaneIndex = 0;
    export const getAllLanes: () => Type.Lane[];
    export const getValueAt: (lane: Type.Lane, position: number, view: Type.View) => number;
    export const getPositionAt: (lane: Type.Lane, value: number, view: Type.View) => number;
    export const makeRootLane: () => Type.Lane;
    export const isRootLane: (indexOrLane: number | Type.Lane) => boolean;
    export const isRooeSlide: (indexOrSlide: number | Type.SlideUnit) => boolean;
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
    export const getScaleMode: () => Type.ScaleMode;
    export const isLogarithmicScale: () => boolean;
    export const isLinearScale: () => boolean;
    export const setScaleMode: (mode: Type.ScaleMode) => void;
    export const initialize: () => void;
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
    export type TickType = "short" | "medium" | "long";
    export let LaneWidths: number[];
    export const renderer: (model: Type.Model, _view: Type.View, dirty: boolean | Set<number>) => void;
    export const drawSlide: (slide: Type.SlideUnit) => void;
    export const drawLane: (group: SVGGElement, lane: Type.Lane) => void;
    export const drawTick: (group: SVGGElement, lane: Type.Lane, position: number, type: TickType) => void;
    export const drawAnkorLine: (position: number) => void;
    export const resize: () => void;
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
    export const initialize: () => void;
}
declare module "script/index" { }
