declare module "script/url" {
    export namespace Url {
        const parseParameter: (url: string) => Record<string, string>;
        const make: () => string;
        const addParameter: (key: string, value: string) => Record<string, string>;
        const get: (key: string) => string | undefined;
        const initialize: () => void;
        const reloadParameters: () => Record<string, string>;
    }
}
declare module "script/type" {
    export namespace Type {
        type NamedNumber = number | "phi" | "e" | "pi";
        const phi: number;
        const getNamedNumberValue: (value: NamedNumber) => number;
        const getNamedNumberLabel: (value: NamedNumber, locales?: Intl.LocalesArgument, options?: Intl.NumberFormatOptions) => string;
        const getNext: <T>(list: readonly T[], current: T, isReverse?: boolean) => T;
        const viewModeList: readonly ["ruler", "grid", "graph"];
        type ViewMode = typeof viewModeList[number];
        const scaleModeList: readonly ["logarithmic", "linear"];
        type ScaleMode = typeof scaleModeList[number];
        interface View {
            viewMode: ViewMode;
            viewScale: number;
            scaleMode: ScaleMode;
            baseOfLogarithm: NamedNumber;
        }
        type PrimaryLane = "logarithmic" | "sine" | "cosine" | "tangent" | "cotangent" | "linear";
        interface LaneBase {
            type: PrimaryLane;
            isInverted: boolean;
            logScale: NamedNumber;
        }
        interface Lane extends LaneBase {
            name: string | null;
            isLinked: boolean;
            offset: number;
        }
        interface SlideUnit {
            lanes: Lane[];
            anchor: number;
        }
        interface Model {
            slides: SlideUnit[];
            anchor: number;
        }
    }
}
declare module "script/ui" {
    export namespace UI {
        const setAriaHidden: (element: HTMLElement | SVGElement, hidden: boolean) => void;
        const setTextContent: (element: HTMLElement, text: string) => boolean;
        const setAttribute: (element: HTMLElement, name: string, value: string | undefined) => boolean;
        const setStyle: (element: HTMLElement, name: string, value: string | undefined) => boolean;
        const updateRoundBar: (button: HTMLButtonElement, properties: {
            low: number;
            high: number;
            rotate: number;
        }) => void;
        const rulerView: HTMLDivElement;
        const rulerSvg: SVGSVGElement;
        const gridView: HTMLDivElement;
        const graphView: HTMLDivElement;
        const controlPanel: HTMLDivElement;
        const viewModeButton: HTMLButtonElement;
        const scaleModeButton: HTMLButtonElement;
        const initialize: () => void;
    }
}
declare module "script/number" {
    export namespace Number {
        const parse: (value: string | undefined) => number | undefined;
        const orUndefined: (value: any) => number | undefined;
    }
}
declare module "script/model" {
    import { Type } from "script/type";
    export namespace Model {
        const data: Type.Model;
        const getAllLanes: () => Type.Lane[];
        const getValueAt: (lane: Type.Lane, position: number, view: Type.View) => number;
        const getPositionAt: (lane: Type.Lane, value: number, view: Type.View) => number;
        const makeSlide: (anchor?: number) => Type.SlideUnit;
        const makeSureSlide: () => Type.SlideUnit;
        const addLane: (lane: Type.Lane) => void;
        const makeLane: (laneSeed: Type.LaneBase) => Type.Lane;
        const remove: (index: number) => void;
        const initialize: () => void;
    }
}
declare module "script/view" {
    import { Type } from "script/type";
    export namespace View {
        const data: Type.View;
        const getViewMode: () => Type.ViewMode;
        const isRulerView: () => boolean;
        const isGridView: () => boolean;
        const isGraphView: () => boolean;
        const setViewMode: (mode: Type.ViewMode) => void;
        const getScaleMode: () => Type.ScaleMode;
        const isLogarithmicScale: () => boolean;
        const isLinearScale: () => boolean;
        const setScaleMode: (mode: Type.ScaleMode) => void;
        const initialize: () => void;
    }
}
declare module "script/render" {
    import { Type } from "script/type";
    export namespace Render {
        let currentRenderer: (model: Type.Model, view: Type.View, dirty: boolean | Set<number>) => unknown;
        export const isDirty: () => boolean;
        export const markDirty: (laneIndex?: number) => void;
        export const setRenderer: (renderer: typeof currentRenderer) => (model: Type.Model, view: Type.View, dirty: boolean | Set<number>) => unknown;
        export {};
    }
}
declare module "script/ruler" {
    import { Type } from "script/type";
    export namespace Ruler {
        const renderer: (model: Type.Model, _view: Type.View, _dirty: boolean | Set<number>) => void;
        const drawAnkorLine: (position: number) => void;
        const resize: () => void;
        const initialize: () => void;
    }
}
declare module "script/grid" {
    import { Type } from "script/type";
    export namespace Grid {
        const renderer: (_model: Type.Model, _view: Type.View, _dirty: boolean | Set<number>) => void;
    }
}
declare module "script/graph" {
    import { Type } from "script/type";
    export namespace Graph {
        const renderer: (_model: Type.Model, _view: Type.View, _dirty: boolean | Set<number>) => void;
    }
}
declare module "script/event" {
    export namespace Event {
        const updateViewModeRoundBar: () => void;
        const updateScaleModeRoundBar: () => void;
        const initialize: () => void;
    }
}
declare module "script/index" { }
