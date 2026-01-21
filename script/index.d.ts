declare module "script/url" {
    export namespace Url {
        const parseParameter: (url: string) => Record<string, string>;
        const make: () => string;
        const addParameter: (key: string, value: string) => Record<string, string>;
        const initialize: () => void;
        const params: Record<string, string>;
    }
}
declare module "script/type" {
    export namespace Type {
        type NamedNumber = number | "phi" | "e" | "pi";
        const phi: number;
        const getNamedNumberValue: (value: NamedNumber) => number;
        const getNamedNumberLabel: (value: NamedNumber, locales?: Intl.LocalesArgument, options?: Intl.NumberFormatOptions) => string;
        type ViewMode = "ruler" | "grid";
        type ScaleMode = "linear" | "logarithmic";
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
            name: string;
            offset: number;
        }
        interface Model {
            lanes: Lane[];
            anchor: number;
        }
    }
}
declare module "script/ui" {
    export namespace UI {
        const setAriaHidden: (element: HTMLElement | SVGElement, hidden: boolean) => void;
        const rulerView: SVGSVGElement;
        const gridView: HTMLDivElement;
        const controlPanel: HTMLDivElement;
        const initialize: () => void;
    }
}
declare module "script/model" {
    import { Type } from "script/type";
    export namespace Model {
        const data: Type.Model;
        const getValueAt: (lane: Type.Lane, position: number, view: Type.View) => number;
        const getPositionAt: (lane: Type.Lane, value: number, view: Type.View) => number;
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
declare module "script/view" {
    import { Type } from "script/type";
    export namespace View {
        const data: Type.View;
        const getViewMode: () => Type.ViewMode;
        const isRulerView: () => boolean;
        const isGridView: () => boolean;
        const setViewMode: (mode: Type.ViewMode) => void;
        const initialize: () => void;
    }
}
declare module "script/event" {
    export namespace Event {
        const initialize: () => void;
    }
}
declare module "script/index" { }
