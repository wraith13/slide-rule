declare module "script/locale" {
    export const master: {
        en: {
            "lang-label": string;
            "lang-direction": string;
            "lang-colon-suffix": string;
            Auto: string;
            Save: string;
            "Include cursor": string;
            "Save as SVG image": string;
            "Save as PNG image": string;
            "Copy as URL": string;
            "URL copied to clipboard.": string;
            "Failed to copy URL to clipboard.": string;
            "Failed to load from URL.": string;
            Settings: string;
            Language: string;
            Theme: string;
            "Number format": string;
            "Thousands separator": string;
            "Exponential notation": string;
            "Adjust exponent to multiple of 3": string;
            Unit: string;
            Help: string;
            "NNN BCE": string;
            "NNN CE": string;
            "NNN years ago ( from BP 0 )": string;
            "in NNN years ( from BP 0 )": string;
        };
        ja: {
            "lang-label": string;
            "lang-direction": string;
            "lang-colon-suffix": string;
            Auto: string;
            Save: string;
            "Include cursor": string;
            "Save as SVG image": string;
            "Save as PNG image": string;
            "Copy as URL": string;
            "URL copied to clipboard.": string;
            "Failed to copy URL to clipboard.": string;
            "Failed to load from URL.": string;
            Settings: string;
            Language: string;
            Theme: string;
            "Number format": string;
            "Thousands separator": string;
            "Exponential notation": string;
            "Adjust exponent to multiple of 3": string;
            Unit: string;
            Help: string;
            "NNN BCE": string;
            "NNN CE": string;
            "NNN years ago ( from BP 0 )": string;
            "in NNN years ( from BP 0 )": string;
        };
    };
    export type LanguageTable = string | ({
        [key in Language]?: string;
    } & {
        en: string;
    });
    export type Label = (keyof (typeof master[keyof typeof master])) | "";
    export type Language = string & keyof typeof master;
    export const lookupValue: <T>(list: T[], value: T) => T | undefined;
    export const getLocale: () => Language;
    export const setLocale: (locale?: Language | "Auto", urlLocale?: string) => void;
    export const getDirection: (l?: Language) => "ltr" | "rtl";
    export const isRtl: (l?: Language) => boolean;
    export const isLtr: (l?: Language) => boolean;
    export const toRtl: (text: string, f?: boolean) => string;
    export const getColonSuffix: (l?: Language) => string;
    export const map: (key: Label, l?: Language) => string;
    export const resolve: <T>(table: Extract<T, null | undefined> | string | Exclude<LanguageTable, string>, l?: Language) => Extract<T, null | undefined> | string;
    export const getLocaleList: () => (Language | "Auto")[];
    export const label: (key: Label, modifier?: (text: string) => string) => { [key in Language]?: string; } & {
        en: string;
    };
}
declare module "script/url" {
    export const parseParameter: (url: string) => Record<string, string>;
    export const get: (key: string) => string | undefined;
    export const initialize: () => void;
    export const reloadParameters: () => Record<string, string>;
}
declare module "script/type" {
    export type NamedNumber = number | "phi" | "e" | "pi" | "tau";
    export const namedNumberList: NamedNumber[];
    export const isNamedNumber: (value: unknown) => value is "phi" | "e" | "pi" | "tau";
    export const phi: number;
    export const tau: number;
    export const getNext: <T>(list: readonly T[], current: T, isReverse?: boolean) => T;
    export type ThemeTable<T> = {
        light: T;
        dark: T;
    };
    export const isThemeTable: <T>(table: unknown) => table is ThemeTable<T>;
    export interface RenderingOptions {
        showCursor: boolean;
    }
    export type ValueOrThemeTable<T> = T | ThemeTable<T>;
    export const viewModeList: readonly ["ruler", "grid", "graph"];
    export type ViewMode = typeof viewModeList[number];
    export interface View {
        viewMode: ViewMode;
        viewScaleExponent: number;
        baseOfLogarithm: NamedNumber;
        isLocked: boolean;
        popup: ViewPopup | null;
    }
    export interface ViewPopup {
        popupType: string;
        child: ViewPopup | null;
    }
    export interface LanePropertyPopup extends ViewPopup {
        popupType: "lane-property";
        laneIndex: number;
    }
    export interface LaneUnitPopup extends ViewPopup {
        popupType: "lane-unit";
        laneIndex: number;
        child: null;
    }
    export const getViewScale: (view: View) => number;
    export type MultiLanguageText = string | ({
        [key in string]?: string;
    } & {
        en: string;
    });
    export type LaneType = "primary" | "invert" | "power" | "root" | "exponential" | "logarithmic" | "sine" | "cosine" | "tangent" | "secant" | "cosecant" | "cotangent" | "arcsine" | "arccosine" | "arctangent" | "arcsecant" | "arccosecant" | "arccotangent" | "digit" | "constant" | "prime" | "prime-decomposition";
    export interface LaneBase {
        name?: MultiLanguageText;
        type: LaneType;
        base?: number | "e";
        exponent?: number;
        withoutLabel?: boolean;
        table?: string;
        digit?: string;
        unit?: {
            symbol: string;
            label: MultiLanguageText;
        };
    }
    export interface Lane extends Omit<LaneBase, "name"> {
        name: MultiLanguageText | null;
    }
    export interface DigitTable {
        label?: MultiLanguageText;
        digits: DigitTableDigit[];
    }
    export interface DigitTableDigit {
        exponent: number;
        label: MultiLanguageText;
        symbol?: string;
    }
    export interface AngleTable {
        ticks: AngleTableTick[];
    }
    export interface AngleTableTick {
        angle: number;
        value: number | null;
        label: string;
    }
    export interface SourceEval {
        "$source-eval"?: string;
    }
    export interface ConstantTable extends SourceEval {
        label: MultiLanguageText;
        unit?: {
            symbol: string;
            label: MultiLanguageText;
        };
        ticks: ContantTableTick[];
        areas: ContantTableArea[];
    }
    export interface ContantTableTick extends SourceEval {
        value: number;
        label: MultiLanguageText;
        priority?: number;
        color?: ValueOrThemeTable<string>;
        unit?: {
            symbol: string;
            label: MultiLanguageText;
        };
    }
    export interface Unit {
        symbol: string;
        label: MultiLanguageText;
        value: number;
    }
    export interface ContantTableArea extends SourceEval {
        lowerBound: number | null;
        upperBound: number | null;
        fill: string;
        overlay?: AreaOverlayType;
        label?: MultiLanguageText;
        color?: ValueOrThemeTable<string>;
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
        quarter: number;
    };
    export const isValueWithBasePosition: (value: unknown) => value is ValueWithBasePosition;
    export type ValueWithPosition = {
        value: number;
        position: number;
    };
    export const isValueWithPosition: (value: unknown) => value is ValueWithPosition;
    export type ExValue = number | ValueWithBasePosition | ValueWithPosition;
    export const getExValueNumber: <T>(exValue: Extract<T, null | undefined> | ExValue) => Extract<T, null | undefined> | number;
    export const getExValuePosition: (exValue: ExValue) => number | undefined;
    export interface Tick {
        value: ExValue;
        type: TickType;
        isShowLabel?: boolean;
        label?: MultiLanguageText;
        behindTickCount?: number;
        unit?: string;
        color?: string;
        minimumFractionDigits?: number;
    }
    export const getTickValue: (tick: Tick) => number;
    export type AreaOverlayType = "none" | "top" | "bottom" | "center" | "edges";
    export interface Area {
        lowerBound: ExValue | undefined;
        upperBound: ExValue | undefined;
        fill: string;
        overlay?: AreaOverlayType;
        label?: MultiLanguageText;
        color?: string;
        details?: Area[];
    }
    export interface LaneContent {
        ticks: Tick[];
        areas: Area[];
    }
    export interface LeveledText {
        text: string;
        level: number;
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
    export const makeSure: <T extends Tag>(parent: Element, source: Source<T>, attributes?: Attributes) => ElementTagNameMap[T];
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
    export const makeSure: <T extends Tag>(parent: Element, source: Source<T>, attributes?: Attributes) => ElementTagNameMap[T];
}
declare module "script/ui" {
    export const setAriaHidden: (element: HTMLElement | SVGElement, hidden: boolean) => void;
    export const updateRoundBar: (button: HTMLButtonElement, properties: {
        low: number;
        high: number;
        rotate: number;
    } | boolean) => void;
    export const viewList: HTMLDivElement;
    export const rulerView: HTMLDivElement;
    export const rulerSvg: SVGSVGElement;
    export const rulerOverlay: SVGSVGElement;
    export const gridView: HTMLDivElement;
    export const graphView: HTMLDivElement;
    export const rulerNewSlidePanel: HTMLDivElement;
    export const addSlideButton: HTMLButtonElement;
    export const addInvertedSlideButton: HTMLButtonElement;
    export const addSiDigitLaneButton: HTMLButtonElement;
    export const addEnDigitLaneButton: HTMLButtonElement;
    export const addJaDigitLaneButton: HTMLButtonElement;
    export const addSquaredLaneButton: HTMLButtonElement;
    export const addCubedLaneButton: HTMLButtonElement;
    export const addSquareRootLaneButton: HTMLButtonElement;
    export const addCubeRootLaneButton: HTMLButtonElement;
    export const addExponentialLaneButton: HTMLButtonElement;
    export const addExponential2LaneButton: HTMLButtonElement;
    export const addExponential10LaneButton: HTMLButtonElement;
    export const addLogarithmicLaneButton: HTMLButtonElement;
    export const addLogarithmic2LaneButton: HTMLButtonElement;
    export const addLogarithmic10LaneButton: HTMLButtonElement;
    export const addSineLaneButton: HTMLButtonElement;
    export const addCosineLaneButton: HTMLButtonElement;
    export const addTangentLaneButton: HTMLButtonElement;
    export const addSecantLaneButton: HTMLButtonElement;
    export const addCosecantLaneButton: HTMLButtonElement;
    export const addCotangentLaneButton: HTMLButtonElement;
    export const addArcsineLaneButton: HTMLButtonElement;
    export const addArccosineLaneButton: HTMLButtonElement;
    export const addArctangentLaneButton: HTMLButtonElement;
    export const addArcsecantLaneButton: HTMLButtonElement;
    export const addArccosecantLaneButton: HTMLButtonElement;
    export const addArccotangentLaneButton: HTMLButtonElement;
    export const addPrimeNumbersLaneButton: HTMLButtonElement;
    export const addPrimeDecompositionLaneButton: HTMLButtonElement;
    export const addSizeLaneButton: HTMLButtonElement;
    export const addAreaLaneButton: HTMLButtonElement;
    export const addVolumeLaneButton: HTMLButtonElement;
    export const addMassLaneButton: HTMLButtonElement;
    export const addTimeLaneButton: HTMLButtonElement;
    export const addSpeedLaneButton: HTMLButtonElement;
    export const addEnergyLaneButton: HTMLButtonElement;
    export const addTemperatureLaneButton: HTMLButtonElement;
    export const addCountingLaneButton: HTMLButtonElement;
    export const addSoundFrequencyLaneButton: HTMLButtonElement;
    export const addEmwWavelengthLaneButton: HTMLButtonElement;
    export const addEmwFrequencyLaneButton: HTMLButtonElement;
    export const addEmwEnergyLaneButton: HTMLButtonElement;
    export const addHistoryLaneButton: HTMLButtonElement;
    export const rulerHelpPanel: HTMLDivElement;
    export namespace SavePanel {
        const includeCursorCheckbox: HTMLInputElement;
        const saveAsSvgImageButton: HTMLButtonElement;
        const saveAsPngImageButton: HTMLButtonElement;
        const copyAsUrlButton: HTMLButtonElement;
    }
    export namespace SettingsPanel {
        const languageSelect: HTMLSelectElement;
        const themeSelect: HTMLSelectElement;
        const threeDigitSeparatorSelect: HTMLSelectElement;
        const exponentFormatSelect: HTMLSelectElement;
        const exponentMultipleOfThreeCheckbox: HTMLInputElement;
        const numberFormatSelect: HTMLSelectElement;
    }
    export namespace ControlPanel {
        const element: HTMLDivElement;
        const viewModeButton: HTMLButtonElement;
        const viewScaleButton: HTMLButtonElement;
        const viewScalePanel: HTMLDivElement;
        const viewScaleRange: HTMLInputElement;
        const viewLockButton: HTMLButtonElement;
    }
    export namespace ToastPanel {
        const element: HTMLDivElement;
        const makeEntry: (message: string, style?: "error") => HTMLDivElement;
        const removeEntry: (entry: HTMLDivElement) => void;
        const show: (data: {
            message: string;
            style?: "error";
            duration?: number;
        }) => void;
    }
    export const updateLanguage: () => void;
    export const initialize: () => void;
}
declare module "script/settings" {
    export const isIncludeCursor: () => boolean;
    export const getTheme: () => string;
    export const getThreeDigitSeparator: () => "none" | "custom" | "thin-space";
    export const getExponentFormat: () => "e" | "x10";
    export const getExponentMultipleOfThree: () => boolean;
    export const getNumberFormat: () => "scientific" | "localized";
    export const getAllSettings: () => {
        i: boolean;
        l: string;
        t: string;
        s: "none" | "custom" | "thin-space";
        e: "e" | "x10";
        m: boolean;
        n: "scientific" | "localized";
    };
    export const applySettings: (settings: ReturnType<typeof getAllSettings>) => void;
}
declare module "script/calculation" {
    import * as Type from "script/type";
    export const isRegularNumber: (value: any) => value is number;
    export const nanToNull: (value: number) => number | null;
    export interface NumberFormatOptionsOthers {
        notation?: "standard" | "scientific" | "engineering" | "compact";
        compactDisplay?: "short" | "long";
        useGrouping?: "always" | "min2" | "auto" | true | false;
        signDisplay?: "auto" | "always" | "exceptZero" | "negative" | "never";
    }
    export type NumberFormatOptions = Intl.NumberFormatOptions & NumberFormatOptionsOthers;
    export type LocalesArgument = Parameters<typeof Number.prototype.toLocaleString>[0];
    export const sec: (x: number) => number;
    export const csc: (x: number) => number;
    export const cot: (x: number) => number;
    export const asec: (x: number) => number;
    export const acsc: (x: number) => number;
    export const acot: (x: number) => number;
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
    export const parseFloat: (string: string) => number;
    export const isFinite: (number: unknown) => boolean;
    export const isNaN: (number: unknown) => boolean;
    export const isSafeInteger: (number: unknown) => boolean;
    export const primeNumbers: number[];
    export const isPrimeNumber: (value: number) => boolean;
    export const primeDecomposition: (value: number) => number[];
    export const System: NumberConstructor;
    export const SafeOr1: (value: number) => number;
    export const roundE: (value: number, exponent?: number) => number;
    export const getNamedNumberValue: (value: Type.NamedNumber) => number;
    export const getThreeDigitSeparatorSymbol: (locales?: LocalesArgument) => string;
    export const groupDigits: (value: string, locales?: LocalesArgument) => string;
    export const getNamedNumberLabel: (value: Type.NamedNumber, locales?: LocalesArgument, options?: NumberFormatOptions) => string;
}
declare module "script/time" {
    import * as Type from "script/type";
    export const humanEpochToUniverseEpoch: (humanEpoch: Date) => number;
    export const universeEpochToHumanEpoch: (universeEpoch: number) => Date;
    export const updateCurrentUniverseEpoch: () => void;
    export const getCurrentUniverseEpoch: () => number;
    export const formatUniverseEpochDuration: (duration: number) => string;
    export const universeEpochToRelativeTimeString: (universeEpoch: number) => string;
    export const universeEpochToString: (universeEpoch: number) => string;
    export const yearsToUniverseEpoch: (years: number) => number;
    export const parseRelativeUniverseEpoch: (text: string) => number;
    export type Json = string | number | boolean | null | Json[] | {
        [key: string]: Json;
    };
    export const applyTimeValue: <T extends Json>(json: T, path?: string) => T;
    export const applyHumanCalendar: (json: Type.ConstantTable, _path?: string) => Type.ConstantTable;
    export const updateConstantTable: (json: Type.ConstantTable, path?: string) => Type.ConstantTable;
    export const initialize: () => void;
}
declare module "script/environment" {
    export const isApple: () => boolean;
    export const isDarkMode: () => boolean;
}
declare module "script/theme" {
    export const isDark: () => boolean;
    export const resolve: <T>(table: T | {
        "light": T;
        "dark": T;
    }, theme?: "light" | "dark") => T;
    export const getX: () => "light" | "dark";
    export const update: () => void;
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
    import * as Calculation from "script/calculation";
    import * as Type from "script/type";
    export const digit: {
        si: Type.DigitTable;
        en: Type.DigitTable;
        ja: Type.DigitTable;
    };
    export type DigitTableKey = keyof typeof digit;
    export const getDigitTable: (name: DigitTableKey) => Type.DigitTable;
    export const constant: {
        size: {
            "$file-name": string;
            label: {
                en: string;
                ja: string;
            };
            unit: {
                symbol: string;
                label: {
                    en: string;
                    ja: string;
                };
            };
            ticks: ({
                value: number;
                label: {
                    en: string;
                    ja: string;
                };
                priority: number;
                unit?: undefined;
                color?: undefined;
            } | {
                value: number;
                label: {
                    en: string;
                    ja: string;
                };
                unit: {
                    symbol: string;
                    label: {
                        en: string;
                        ja: string;
                    };
                };
                priority: number;
                color?: undefined;
            } | {
                value: number;
                label: {
                    en: string;
                    ja: string;
                };
                color: string;
                priority: number;
                unit?: undefined;
            })[];
            areas: never[];
        };
        area: {
            "$file-name": string;
            label: {
                en: string;
                ja: string;
            };
            unit: {
                symbol: string;
                label: {
                    en: string;
                    ja: string;
                };
            };
            ticks: {
                value: number;
                label: {
                    en: string;
                    ja: string;
                };
                priority: number;
            }[];
            areas: never[];
        };
        volume: {
            "$file-name": string;
            label: {
                en: string;
                ja: string;
            };
            unit: {
                symbol: string;
                label: {
                    en: string;
                    ja: string;
                };
            };
            ticks: ({
                value: number;
                label: {
                    en: string;
                    ja: string;
                };
                priority: number;
                color?: undefined;
            } | {
                value: number;
                label: {
                    en: string;
                    ja: string;
                };
                priority: number;
                color: string;
            })[];
            areas: never[];
        };
        mass: {
            "$file-name": string;
            label: {
                en: string;
                ja: string;
            };
            unit: {
                symbol: string;
                label: {
                    en: string;
                    ja: string;
                };
            };
            ticks: ({
                value: number;
                label: {
                    en: string;
                    ja: string;
                };
                priority: number;
                color: string;
            } | {
                value: number;
                label: {
                    en: string;
                    ja: string;
                };
                priority: number;
                color?: undefined;
            })[];
            areas: never[];
        };
        time: {
            "$file-name": string;
            "$time-require": string[];
            label: {
                en: string;
                ja: string;
            };
            unit: {
                symbol: string;
                label: {
                    en: string;
                    ja: string;
                };
            };
            ticks: ({
                value: number;
                label: {
                    en: string;
                    ja: string;
                    "$source-eval"?: undefined;
                };
                priority: number;
                "$source-eval": {
                    value: string;
                };
                "$time-value"?: undefined;
            } | {
                value: number;
                label: {
                    en: string;
                    ja: string;
                    "$source-eval"?: undefined;
                };
                priority: number;
                "$source-eval"?: undefined;
                "$time-value"?: undefined;
            } | {
                value: number;
                label: {
                    en: string;
                    ja: string;
                    "$source-eval": {
                        en: string;
                        ja: string;
                    };
                };
                priority: number;
                "$source-eval": {
                    value: string;
                };
                "$time-value"?: undefined;
            } | {
                value: number;
                label: {
                    en: string;
                    ja: string;
                    "$source-eval"?: undefined;
                };
                priority: number;
                "$source-eval": {
                    value: string;
                };
                "$time-value": {
                    value: string;
                };
            })[];
            areas: never[];
        };
        speed: {
            "$file-name": string;
            label: string;
            unit: {
                symbol: string;
                label: {
                    en: string;
                    ja: string;
                };
            };
            ticks: ({
                value: number;
                label: string;
                priority: number;
                "$source-eval": {
                    value: string;
                };
                color?: undefined;
            } | {
                value: number;
                label: string;
                priority: number;
                "$source-eval"?: undefined;
                color?: undefined;
            } | {
                value: number;
                label: {
                    en: string;
                    ja: string;
                };
                priority: number;
                color: string;
                "$source-eval"?: undefined;
            })[];
            areas: never[];
        };
        energy: {
            "$file-name": string;
            label: {
                en: string;
                ja: string;
            };
            unit: {
                symbol: string;
                label: {
                    en: string;
                    ja: string;
                };
            };
            ticks: ({
                value: number;
                label: {
                    en: string;
                    ja: string;
                };
                priority: number;
                "$source-eval"?: undefined;
                color?: undefined;
            } | {
                value: number;
                label: {
                    en: string;
                    ja: string;
                };
                priority: number;
                "$source-eval": {
                    value: string;
                };
                color?: undefined;
            } | {
                value: number;
                label: {
                    en: string;
                    ja: string;
                };
                priority: number;
                color: string;
                "$source-eval"?: undefined;
            })[];
            areas: never[];
        };
        temperature: {
            "$file-name": string;
            label: {
                en: string;
                ja: string;
            };
            unit: {
                symbol: string;
                label: {
                    en: string;
                    ja: string;
                };
            };
            ticks: ({
                value: number;
                label: {
                    en: string;
                    ja: string;
                };
                priority: number;
                unit?: undefined;
            } | {
                value: number;
                label: {
                    ja: string;
                    en: string;
                };
                unit: {
                    symbol: string;
                    label: {
                        en: string;
                        ja: string;
                    };
                };
                priority: number;
            } | {
                value: number;
                label: string;
                priority: number;
                unit?: undefined;
            })[];
            areas: never[];
        };
        counting: {
            "$file-name": string;
            label: {
                en: string;
                ja: string;
            };
            unit: {
                label: {
                    en: string;
                    ja: string;
                };
            };
            ticks: ({
                value: number;
                label: {
                    en: string;
                    ja: string;
                };
                priority: number;
                color?: undefined;
            } | {
                value: number;
                label: {
                    en: string;
                    ja: string;
                };
                priority: number;
                color: string;
            })[];
            areas: never[];
        };
        "sound-frequency": {
            "$file-name": string;
            label: {
                en: string;
                ja: string;
            };
            unit: {
                symbol: string;
                label: {
                    en: string;
                    ja: string;
                };
            };
            ticks: ({
                value: number;
                label: {
                    en: string;
                    ja: string;
                };
                priority: number;
                "$source-eval": {
                    value: string;
                };
                color?: undefined;
            } | {
                value: number;
                label: {
                    en: string;
                    ja: string;
                };
                priority: number;
                "$source-eval"?: undefined;
                color?: undefined;
            } | {
                value: number;
                label: string;
                priority: number;
                "$source-eval": {
                    value: string;
                };
                color?: undefined;
            } | {
                value: number;
                label: {
                    en: string;
                    ja: string;
                };
                priority: number;
                color: string;
                "$source-eval"?: undefined;
            })[];
            areas: never[];
        };
        "emw-wavelength": {
            "$file-name": string;
            label: {
                en: string;
                ja: string;
            };
            unit: {
                symbol: string;
                label: {
                    en: string;
                    ja: string;
                };
            };
            ticks: {
                value: number;
                label: {
                    en: string;
                    ja: string;
                };
                "$source-eval": {
                    value: string;
                };
                priority: number;
            }[];
            areas: ({
                lowerBound: number;
                upperBound: number;
                label: {
                    en: string;
                    ja: string;
                };
                fill: string;
                details?: undefined;
            } | {
                lowerBound: number;
                upperBound: number;
                label: {
                    en: string;
                    ja: string;
                };
                fill: string;
                details: ({
                    lowerBound: number;
                    upperBound: number;
                    label: {
                        en: string;
                        ja: string;
                    };
                    fill: string;
                    details?: undefined;
                } | {
                    lowerBound: number;
                    upperBound: number;
                    label: {
                        en: string;
                        ja: string;
                    };
                    fill: string;
                    details: {
                        lowerBound: number;
                        upperBound: number;
                        label: {
                            en: string;
                            ja: string;
                        };
                        fill: string;
                    }[];
                })[];
            } | {
                lowerBound: number;
                upperBound: null;
                label: {
                    en: string;
                    ja: string;
                };
                fill: string;
                details: ({
                    lowerBound: number;
                    upperBound: number;
                    label: {
                        en: string;
                        ja: string;
                    };
                    fill: string;
                } | {
                    lowerBound: number;
                    upperBound: null;
                    fill: string;
                    label?: undefined;
                })[];
            })[];
        };
        "emw-frequency": {
            "$file-name": string;
            label: {
                en: string;
                ja: string;
            };
            unit: {
                symbol: string;
                label: {
                    en: string;
                    ja: string;
                };
            };
            "x-$source-eval": {
                ticks: string;
                areas: string;
            };
            ticks: {
                value: number;
                label: {
                    en: string;
                    ja: string;
                };
                priority: number;
            }[];
            areas: ({
                lowerBound: null;
                upperBound: number;
                label: {
                    en: string;
                    ja: string;
                };
                fill: string;
                details: ({
                    lowerBound: null;
                    upperBound: number;
                    fill: string;
                    label?: undefined;
                } | {
                    lowerBound: number;
                    upperBound: number;
                    label: {
                        en: string;
                        ja: string;
                    };
                    fill: string;
                })[];
            } | {
                lowerBound: number;
                upperBound: number;
                label: {
                    en: string;
                    ja: string;
                };
                fill: string;
                details: ({
                    lowerBound: number;
                    upperBound: number;
                    label: {
                        en: string;
                        ja: string;
                    };
                    fill: string;
                    details: {
                        lowerBound: number;
                        upperBound: number;
                        label: {
                            en: string;
                            ja: string;
                        };
                        fill: string;
                    }[];
                } | {
                    lowerBound: number;
                    upperBound: number;
                    label: {
                        en: string;
                        ja: string;
                    };
                    fill: string;
                    details?: undefined;
                })[];
            } | {
                lowerBound: number;
                upperBound: number;
                label: {
                    en: string;
                    ja: string;
                };
                fill: string;
                details?: undefined;
            })[];
        };
        "emw-energy": {
            "$file-name": string;
            label: {
                en: string;
                ja: string;
            };
            unit: {
                symbol: string;
                label: {
                    en: string;
                    ja: string;
                };
            };
            "x-$source-eval": {
                "\u26A0\uFE0Fcaution": {
                    ja: string;
                    en: string;
                };
                ticks: string;
                areas: string;
            };
            ticks: {
                value: number;
                label: {
                    en: string;
                    ja: string;
                };
                priority: number;
            }[];
            areas: ({
                lowerBound: null;
                upperBound: number;
                label: {
                    en: string;
                    ja: string;
                };
                fill: string;
                details: ({
                    lowerBound: null;
                    upperBound: number;
                    fill: string;
                    label?: undefined;
                } | {
                    lowerBound: number;
                    upperBound: number;
                    label: {
                        en: string;
                        ja: string;
                    };
                    fill: string;
                })[];
            } | {
                lowerBound: number;
                upperBound: number;
                label: {
                    en: string;
                    ja: string;
                };
                fill: string;
                details: ({
                    lowerBound: number;
                    upperBound: number;
                    label: {
                        en: string;
                        ja: string;
                    };
                    fill: string;
                    details: {
                        lowerBound: number;
                        upperBound: number;
                        label: {
                            en: string;
                            ja: string;
                        };
                        fill: string;
                    }[];
                } | {
                    lowerBound: number;
                    upperBound: number;
                    label: {
                        en: string;
                        ja: string;
                    };
                    fill: string;
                    details?: undefined;
                })[];
            } | {
                lowerBound: number;
                upperBound: number;
                label: {
                    en: string;
                    ja: string;
                };
                fill: string;
                details?: undefined;
            })[];
        };
        history: {
            "$file-name": string;
            "$time-require": string[];
            label: string;
            unit: {
                symbol: string;
                label: {
                    en: string;
                    ja: string;
                };
            };
            ticks: {
                label: string;
                "label[jp]": string;
                value: number;
                priority: number;
                "$source-eval": {
                    value: string;
                };
            }[];
            areas: ({
                lowerBound: null;
                upperBound: number;
                label: string;
                fill: string;
                "label[jp]"?: undefined;
                "$source-eval"?: undefined;
                "$time-value"?: undefined;
                details?: undefined;
            } | {
                lowerBound: number;
                upperBound: number;
                label: string;
                fill: string;
                "label[jp]"?: undefined;
                "$source-eval"?: undefined;
                "$time-value"?: undefined;
                details?: undefined;
            } | {
                lowerBound: number;
                upperBound: number;
                label: string;
                "label[jp]": string;
                fill: string;
                "$source-eval": {
                    upperBound: string;
                    lowerBound?: undefined;
                };
                "$time-value": {
                    upperBound: string;
                    lowerBound?: undefined;
                };
                details: ({
                    lowerBound: number;
                    upperBound: number;
                    label: string;
                    "label[jp]": string;
                    fill: string;
                    details: {
                        lowerBound: number;
                        upperBound: number;
                        label: string;
                        "label[jp]": string;
                        fill: string;
                    }[];
                    "$source-eval"?: undefined;
                    "$time-value"?: undefined;
                } | {
                    lowerBound: number;
                    upperBound: number;
                    label: string;
                    "label[jp]": string;
                    fill: string;
                    "$source-eval": {
                        upperBound: string;
                    };
                    "$time-value": {
                        upperBound: string;
                    };
                    details: ({
                        lowerBound: number;
                        upperBound: number;
                        label: string;
                        "label[jp]": string;
                        fill: string;
                        details: {
                            lowerBound: number;
                            upperBound: number;
                            label: string;
                            "label[jp]": string;
                            fill: string;
                        }[];
                        "$source-eval"?: undefined;
                        "$time-value"?: undefined;
                    } | {
                        lowerBound: number;
                        upperBound: number;
                        label: string;
                        "label[jp]": string;
                        fill: string;
                        "$source-eval": {
                            upperBound: string;
                        };
                        "$time-value": {
                            upperBound: string;
                        };
                        details: ({
                            lowerBound: number;
                            upperBound: number;
                            label: string;
                            "label[jp]": string;
                            fill: string;
                            "$source-eval"?: undefined;
                            "$time-value"?: undefined;
                        } | {
                            lowerBound: number;
                            upperBound: number;
                            label: string;
                            "label[jp]": string;
                            fill: string;
                            "$source-eval": {
                                upperBound: string;
                            };
                            "$time-value": {
                                upperBound: string;
                            };
                        })[];
                    })[];
                })[];
            } | {
                lowerBound: number;
                upperBound: null;
                label: string;
                fill: string;
                "$source-eval": {
                    lowerBound: string;
                    upperBound?: undefined;
                };
                "$time-value": {
                    lowerBound: string;
                    upperBound?: undefined;
                };
                "label[jp]"?: undefined;
                details?: undefined;
            })[];
        };
    };
    export type ConstantTableKey = keyof typeof constant;
    export const getConstantTable: (name: ConstantTableKey) => Type.ConstantTable;
    export const data: Type.Model;
    export const ticksCache: number[][];
    export const RootSlideIndex = 0;
    export const RootLaneIndex = 0;
    export const getAllLaneCount: () => number;
    export const getAllLanes: () => Type.Lane[];
    export const isInvertedLane: (lane: Type.Lane) => boolean;
    export const isInvertedSlide: (slide: Type.SlideUnit) => boolean;
    export const getPrimaryPeriod: (lane: Type.Lane) => number | undefined;
    export const isPeriodicLane: (lane: Type.Lane) => boolean;
    export const isOscillatingLane: (lane: Type.Lane) => boolean;
    export const isDiscreteLane: (lane: Type.Lane) => boolean;
    export const getSlidePositionAt: (slide: Type.SlideUnit, value: Type.ExValue, view: Type.View) => number;
    export const getPrimaryTick: (lane: Type.Lane) => Type.Tick | undefined;
    export const getAngleTable: (lane: Type.Lane) => Type.AngleTable;
    export const getAngleTick: (lane: Type.Lane, angle: number) => Type.Tick;
    export const getMinValue: (lane: Type.Lane) => number;
    export const getMaxValue: (lane: Type.Lane) => number;
    export const getPrimaryValueAt: (lane: Type.Lane, position: number) => number;
    export const getPrimaryPositionAt: (lane: Type.Lane, value: number, quarter?: number) => number;
    export const angleToQuarter: (angle: number) => number;
    export const getValueAt: (slide: Type.SlideUnit, lane: Type.Lane, position: number, view: Type.View) => Type.ValueWithPosition | undefined;
    export const getLinearPositionAt: (slide: Type.SlideUnit, lane: Type.Lane, value: Type.ExValue) => number;
    export const getRawViewPositionAt: (slide: Type.SlideUnit, lane: Type.Lane, value: Type.ExValue, view: Type.View) => number;
    export const getAnchorSlideAndLane: (slide: Type.SlideUnit) => {
        anchorSlide?: Type.SlideUnit;
        anchorLane?: Type.Lane;
    };
    export const getSlideOffset: (slide: Type.SlideUnit, view: Type.View) => number;
    export const getPositionAt: (slide: Type.SlideUnit, lane: Type.Lane, value: Type.ExValue, view: Type.View) => number;
    export const getWidth: (slide: Type.SlideUnit, lane: Type.Lane, bottom: Type.ExValue, top: Type.ExValue, view: Type.View, isInverted?: boolean | "auto") => number;
    export const getConvenientWidth: (slide: Type.SlideUnit, lane: Type.Lane, bottom: number, top: number, view: Type.View, isInverted?: boolean | "auto") => number;
    export const getSnapReferenceLaneIndex: (slide: Type.SlideUnit) => number;
    export type PositionTickWindow = {
        topPosition: number;
        bottomPosition: number;
    };
    export type ValueTickWindow = {
        topValue: Type.ExValue;
        bottomValue: Type.ExValue;
    };
    export type TickWindow = PositionTickWindow | ValueTickWindow;
    export const PositionTickWindowToValueTickWindow: (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, positionTickWindow: PositionTickWindow) => ValueTickWindow;
    export const ValueTickWindowToPositionTickWindow: (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, valueTickWindow: ValueTickWindow) => PositionTickWindow;
    export const makePositionTickWindowFromWindow: () => PositionTickWindow;
    export const makePositionTickWindowFromPositionAndWidth: (position: number, width: number) => PositionTickWindow;
    export const getLongTickSpaceWidth: (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, ticks: Type.Tick[], value: number) => {
        tick: Type.Tick | undefined;
        width: number;
    };
    export const designTickType: (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, ticks: Type.Tick[], value: number) => Type.TickType;
    export const designLogarithmicTicks10: (view: Type.View, slide: Type.SlideUnit, lane: Type.Lane, base: number, unit: number, parent: {
        index: number;
        width: number;
    }, tickWindow: ValueTickWindow, ticks: Type.Tick[]) => Type.Tick[];
    export const designLinearTicks10: (view: Type.View, slide: Type.SlideUnit, lane: Type.Lane, base: number, unitDigt: number, tickWindow: ValueTickWindow) => Type.Tick[];
    export const designCurvedTicks10: (view: Type.View, slide: Type.SlideUnit, lane: Type.Lane, base: number, unitDigt: number, tickWindow: ValueTickWindow) => Type.Tick[];
    export const designAngleTicksRegular10: (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, basePosition: number, startPosition: number, endPosition: number, quarter: number, base: number, unitDigt: number) => Type.Tick[];
    export const designAngleTicksInverted10: (_slide: Type.SlideUnit, _view: Type.View, _lane: Type.Lane, _basePosition: number, _startPosition: number, _endPosition: number, _quarter: number, _base: number, _unitDigt: number) => Type.Tick[];
    export const designAngleTicks10: (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, startPosition: number, endPosition: number, angleBase: number) => Type.Tick[];
    export const designAngleTicks30: (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, startPosition: number, endPosition: number, angleBase: number) => Type.Tick[];
    export const designAngleTicks90: (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, startPosition: number, endPosition: number, angleBase: number) => Type.Tick[];
    export const designAngleTicks360: (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, lowPosition: number, highPosition: number) => Type.Tick[];
    export const addConstTicks: (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, ticks: Type.Tick[], tickWindow: ValueTickWindow, constTicks: {
        value: number;
        label?: string;
        color?: string;
    }[]) => void;
    export const designLogarithmicTicks: (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow) => Type.LaneContent;
    export const designLinearTicks: (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow) => Type.LaneContent;
    export const designCurvedTicks: (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow) => Type.LaneContent;
    export const designPrimeNumbersTicks: (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow) => Type.LaneContent;
    export const factorsToString: (factors: number[], locales?: Calculation.LocalesArgument) => string;
    export const designPrimeDecompositionTicks: (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow) => Type.LaneContent;
    export const makeDigitLabel: (digit: Type.DigitTableDigit) => Type.MultiLanguageText;
    export const designDigitTicks: (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow) => Type.LaneContent;
    export const designConstantAreas: (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow, area: Type.ContantTableArea) => Type.Area[];
    export const designConstantTickColor: (tick: Type.ContantTableTick) => string;
    export const designConstantTickType: (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, ticks: Type.Tick[], value: number) => Type.TickType;
    export const makeConstantStandardTickUnit: <T>(unit: Extract<T, undefined> | {
        symbol: string;
        label: Type.MultiLanguageText;
    }) => string | Extract<T, undefined>;
    export const designConstantTicks: (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow) => Type.LaneContent;
    export const getUnitList: (lane: Type.Lane) => Type.Unit[];
    export const designPeriodicTicks: (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: PositionTickWindow) => Type.LaneContent;
    export const designOscillatingTicks: (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: PositionTickWindow) => Type.LaneContent;
    export const complementMinMaxArea: (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: PositionTickWindow, content: Type.LaneContent) => Type.LaneContent;
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
    export const addDigitLane: (slide: Type.SlideUnit, digitTableKey: DigitTableKey) => void;
    export const addConstantLane: (slide: Type.SlideUnit, constantTableKey: ConstantTableKey) => void;
    export const makeLane: (laneSeed: Type.LaneBase) => Type.Lane;
    export const removeLane: (index: number) => void;
    export const makeSure: () => void;
    export const getCursorPosition: (view: Type.View) => number;
    export const getCursorValue: (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View) => Type.ValueWithPosition | undefined;
    export const getCursorValues: (view: Type.View) => (Type.ValueWithPosition | undefined)[];
    export const getLaneContext: (lane: Type.Lane) => Type.LaneContext;
    export const initialize: () => void;
}
declare module "script/view" {
    import * as Type from "script/type";
    export const data: Type.View;
    export const hasPopup: () => boolean;
    export const getViewMode: () => Type.ViewMode;
    export const isRulerView: () => boolean;
    export const isGridView: () => boolean;
    export const isGraphView: () => boolean;
    export const setViewMode: (mode: Type.ViewMode) => void;
    export const getViewScale: () => number;
    export const setViewScaleExponent: (exponent: number) => void;
    export const isLocked: () => boolean;
    export const setLocked: (locked: boolean) => void;
    export const initialize: () => void;
}
declare module "script/render" {
    import * as Type from "script/type";
    export namespace RenderItemId {
        const AllItems = "$ALL";
        const Size = "$SIZE";
        const Popup = "$POPUP";
    }
    let currentRenderer: (model: Type.Model, view: Type.View, dirty: Set<string>, timeLimit?: number, options?: Type.RenderingOptions) => unknown;
    export const isDirty: () => boolean;
    export const markDirty: (item?: string) => void;
    export const requestRender: () => void;
    export const resetDirty: (item: string) => void;
    export const resize: () => void;
    export const setRenderer: (renderer: typeof currentRenderer) => void;
    export const parseLeveledTextRegex: RegExp;
    export const parseLeveledText: (text: string) => Type.LeveledText[];
    export const getLevelName: (leveledText: Type.LeveledText) => string;
    export const isRegularSizeText: (text: Type.LeveledText) => boolean;
    export const clearPopup: () => void;
    export const newPopup: <T extends Type.ViewPopup>(popup: T) => void;
    export const backPopup: () => void;
    export const nextPopup: (popup: Type.ViewPopup) => void;
}
declare module "script/ruler" {
    import * as Type from "script/type";
    export let scale: number;
    export let LaneWidths: number[];
    export const setLaneWidth: (laneIndex: number, width: number) => void;
    export const renderer: (model: Type.Model, view: Type.View, dirty: Set<string>, timeLimit?: number, options?: Type.RenderingOptions) => void;
    export const getLaneIndexFromPosition: (position: number) => number | null;
    export const drawGradientDefines: (_model: Type.Model, _view: Type.View) => void;
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
    export const makeVerticalGradient: (defs: SVGDefsElement, id: string, stops: {
        offset: string;
        color: string;
        opacity: number;
    }[]) => SVGLinearGradientElement;
    export const makeStops: (stops: {
        [offset: string]: number;
    }, color: string) => {
        offset: string;
        color: string;
        opacity: number;
    }[];
    export const makeSureSlide: (slideIndex: number) => SVGGElement;
    export const getLeftOfLane: (laneIndex: number) => number;
    export const drawLeveledText: (label: SVGTextElement, text: string) => {
        currentDy: number;
    };
    export const drawLane: (view: Type.View, slide: Type.SlideUnit, lane: Type.Lane) => void;
    export const getAreaFill: (isInverted: boolean, area: Type.Area) => string;
    export const drawAreas: (view: Type.View, group: SVGGElement, slide: Type.SlideUnit, lane: Type.Lane, areas: Type.Area[], indent?: number) => void;
    export const makeNumberLabel: (tick: Type.Tick) => string;
    export const makeShortNumberLabel: (value: number) => string;
    export const getFractionDigitsFromUnit: (unit: number) => number | undefined;
    export const calculateMinimumFractionDigits: (ticks: Type.Tick[]) => Type.Tick[];
    export const drawTicks: (view: Type.View, group: SVGGElement, slide: Type.SlideUnit, lane: Type.Lane, ticks: Type.Tick[]) => void;
    export const garbageCollectLanes: (_view: Type.View) => void;
    export type SnapPositionEvent = KeyboardEvent | PointerEvent | WheelEvent | TouchEvent | MouseEvent | "NOSNAP";
    export const getReferenceLaneIndexFromEvent: (event: SnapPositionEvent) => number | null;
    export const regulateReferencePositions: (referencePositions: number[]) => number[];
    export const snapPosition: (position: number, referencePositions: number[]) => number;
    export const nextPosition: (position: number, referencePositions: number[], direction: "PREVIOUS" | "NEXT") => number;
    export const getAreaPositions: (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, areas: Type.Area[]) => number[];
    export const snapVerticalPosition: (event: SnapPositionEvent, view: Type.View, position: number, referenceLaneIndex?: number) => number;
    export const snapHorizontalPosition: (event: SnapPositionEvent, position: number) => number;
    export const slideCursor: (model: Type.Model, view: Type.View, event: PointerEvent | WheelEvent, position: number) => number;
    export const drawAnchorLine: (model: Type.Model, view: Type.View, options?: Type.RenderingOptions) => void;
    export const drawPopup: (view: Type.View, popup?: Type.ViewPopup | null) => void;
    export const drawLanePropertyPopup: (_view: Type.View, _popup: Type.LanePropertyPopup) => void;
    export const drawLaneUnitPopup: (_view: Type.View, popup: Type.LaneUnitPopup) => void;
    export const resize: () => void;
    export const getRulerWidth: () => number;
    export const initialize: () => void;
}
declare module "script/json-eval-updater" {
    import * as Url from "script/url";
    import * as Type from "script/type";
    import * as Time from "script/time";
    import * as UI from "script/ui";
    import * as Model from "script/model";
    import * as View from "script/view";
    import * as Ruler from "script/ruler";
    import * as Render from "script/render";
    export const dummy: {
        Url: typeof Url;
        Type: typeof Type;
        Time: typeof Time;
        UI: typeof UI;
        Model: typeof Model;
        View: typeof View;
        Event: {
            new (type: string, eventInitDict?: EventInit): Event;
            prototype: Event;
            readonly NONE: 0;
            readonly CAPTURING_PHASE: 1;
            readonly AT_TARGET: 2;
            readonly BUBBLING_PHASE: 3;
        };
        Ruler: typeof Ruler;
        Render: typeof Render;
        config: {
            applicationTitle: string;
            repositoryUrl: string;
            canonicalUrl: string;
            description: string;
            noscriptMessage: string;
            time: {
                anchor: {
                    humanEpoch: string;
                    universeEpoch: number;
                };
                gregorianYearLength: number;
                julianYearLength: number;
                pureGregorianYearsRange: {
                    lowerBound: number;
                    upperBound: number;
                };
                considerGregorianYearsRange: {
                    lowerBound: number;
                    upperBound: number;
                };
            };
            symbols: {
                thinSpace: string;
                multiplication: string;
                power: string;
                subscript: string;
                exponent: string;
                miniSymbols: string[];
            };
            model: {
                lane: {
                    root: {
                        type: string;
                    };
                    presets: {
                        x: {
                            type: string;
                        };
                        "1/x": {
                            type: string;
                        };
                        "x^2": {
                            type: string;
                            exponent: number;
                        };
                        "x^3": {
                            type: string;
                            exponent: number;
                        };
                        "sqrt(x)": {
                            type: string;
                            exponent: number;
                        };
                        "cbrt(x)": {
                            type: string;
                            exponent: number;
                        };
                        "e^x": {
                            type: string;
                            base: string;
                        };
                        "2^x": {
                            type: string;
                            base: number;
                        };
                        "10^x": {
                            type: string;
                            base: number;
                        };
                        "log(x)": {
                            type: string;
                            base: string;
                        };
                        "log2(x)": {
                            type: string;
                            base: number;
                        };
                        "log10(x)": {
                            type: string;
                            base: number;
                        };
                        sine: {
                            type: string;
                        };
                        cosine: {
                            type: string;
                        };
                        tangent: {
                            type: string;
                        };
                        secant: {
                            type: string;
                        };
                        cosecant: {
                            type: string;
                        };
                        cotangent: {
                            type: string;
                        };
                        arcsine: {
                            type: string;
                        };
                        arccosine: {
                            type: string;
                        };
                        arctangent: {
                            type: string;
                        };
                        arcsecant: {
                            type: string;
                        };
                        arccosecant: {
                            type: string;
                        };
                        arccotangent: {
                            type: string;
                        };
                        prime: {
                            type: string;
                        };
                        A: {
                            type: string;
                        };
                        B: {
                            type: string;
                        };
                        C: {
                            type: string;
                        };
                        D: {
                            type: string;
                        };
                        CI: {
                            type: string;
                        };
                        DI: {
                            type: string;
                        };
                        K: {
                            type: string;
                        };
                        L: {
                            type: string;
                        };
                        S: {
                            type: string;
                        };
                        T: {
                            type: string;
                        };
                        ST: {
                            type: string;
                        };
                        P: {
                            type: string;
                        };
                        LL: {
                            type: string;
                        };
                    };
                };
                defaultCursor: number;
                exponentialNumber: {
                    calculateLowerLimit: number;
                };
                primeNumber: {
                    limit: number;
                    maxRange: number;
                    cacheSize: number;
                };
                constantTable: {
                    standardNumberColor: {
                        light: string;
                        dark: string;
                    };
                    primaryNumberColor: {
                        light: string;
                        dark: string;
                    };
                    defaultNumberColor: {
                        light: string;
                        dark: string;
                    };
                    estimatedNumberColor: {
                        light: string;
                        dark: string;
                    };
                    fictionalNumberColor: {
                        light: string;
                        dark: string;
                    };
                };
            };
            view: {
                defaultViewMode: string;
                defaultScaleMode: string;
                baseOfLogarithm: {
                    presets: (string | number)[];
                    default: number;
                };
                defaultZoomLevel: number;
                zoomRate: number;
                zooomUnit: number;
                minZoomLevel: number;
                maxZoomLevel: number;
                scrollUnit: number;
                touchZoomThreshold: number;
            };
            render: {
                ruler: {
                    frameRenderTimeLimit: number;
                    foregroundColor: {
                        light: string;
                        dark: string;
                    };
                    backgroundColor: {
                        light: string;
                        dark: string;
                    };
                    lineColor: string;
                    lineWidth: number;
                    laneBackgroundColor: {
                        light: string;
                        dark: string;
                    };
                    laneWidth: number;
                    slideSeparator: {
                        width: number;
                        color: {
                            light: string;
                            dark: string;
                        };
                    };
                    laneSeparator: {
                        width: number;
                        color: {
                            light: string;
                            dark: string;
                        };
                    };
                    laneSeparatorWidth: number;
                    denseAreaColor: string;
                    minusAreaColor: string;
                    minAreaColor: string;
                    maxAreaColor: string;
                    sparseAreaColor: string;
                    nanAreaColor: string;
                    laneLabelBackgroundColor: {
                        light: string;
                        dark: string;
                    };
                    primaryTickColor: string;
                    tick: {
                        mini: {
                            length: number;
                            width: number;
                            color: {
                                light: string;
                                dark: string;
                            };
                        };
                        short: {
                            length: number;
                            width: number;
                            color: {
                                light: string;
                                dark: string;
                            };
                        };
                        medium: {
                            length: number;
                            width: number;
                            color: {
                                light: string;
                                dark: string;
                            };
                        };
                        long: {
                            length: number;
                            width: number;
                            color: {
                                light: string;
                                dark: string;
                            };
                        };
                    };
                    tickLabel: {
                        fontFamily: string;
                        fontSize: number;
                        fontColor: {
                            light: string;
                            dark: string;
                        };
                        offset: number;
                        minInterval: number;
                        maxInterval: number;
                    };
                    tickDensityThreshold_E243: number;
                    tickDensityThreshold_E81: number;
                    tickDensityThreshold_E27: number;
                    tickDensityThreshold_E9: number;
                    tickDensityThreshold_E3: number;
                    tickDensityThreshold_5: number;
                    tickDensityThreshold_10: number;
                };
            };
        };
    };
    export const nestEvalUpdate: <Source, Target>(obj: Source, getList: (obj: Source) => Target[], updater: (value: Target) => Target, getChild: (obj: Target) => Source) => Source;
    export const midiNoteToFrequency: (midiNote: number) => number;
    export const waveLengthToFrequency: <T>(wavelength: Extract<T, null | undefined> | number) => Extract<T, null | undefined> | number;
    export const frequencyToWaveLength: <T>(frequency: Extract<T, null | undefined> | number) => Extract<T, null | undefined> | number;
    export const frequencyToEV: <T>(frequency: Extract<T, null | undefined> | number) => Extract<T, null | undefined> | number;
    export const roundE: (value: number, exponent?: number) => number;
    export type Json = string | number | boolean | null | Json[] | {
        [key: string]: Json;
    };
    export const updateJsonWithEval: (json: Json, path?: string) => Json;
    export const saveJson: (json: Json) => void;
}
declare module "script/command" {
    import * as Type from "script/type";
    import * as Model from "script/model";
    export const addSlide: (laneSeed: Type.LaneBase) => void;
    export const addLane: (laneSeed: Type.LaneBase) => void;
    export const addDigitLane: (digitTable: Model.DigitTableKey) => void;
    export const addSiDigitLane: () => void;
    export const addEnDigitLane: () => void;
    export const addJaDigitLane: () => void;
    export const addConstantLane: (constantTableKey: Model.ConstantTableKey) => void;
    export const addSizeLane: () => void;
    export const addAreaLane: () => void;
    export const addVolumeLane: () => void;
    export const addMassLane: () => void;
    export const addTimeLane: () => void;
    export const addSpeedLane: () => void;
    export const addEnergyLane: () => void;
    export const addTemperatureLane: () => void;
    export const addCountingLane: () => void;
    export const addSoundFrequencyLane: () => void;
    export const addEmwWavelengthLane: () => void;
    export const addEmwFrequencyLane: () => void;
    export const addEmwEnergyLane: () => void;
    export const addHistoryLane: () => void;
    export const saveAsSvgImage: () => void;
    export const saveAsPngImage: () => void;
    export const copyAsUrl: () => void;
    export const loadFromUrl: () => void;
    export const updateLanguage: () => void;
    export const updateTheme: () => void;
    export const initialize: () => void;
}
declare module "script/grid" {
    import * as Type from "script/type";
    export const renderer: (_model: Type.Model, _view: Type.View, _dirty: Set<string>) => void;
}
declare module "script/graph" {
    import * as Type from "script/type";
    export const renderer: (_model: Type.Model, _view: Type.View, _dirty: Set<string>) => void;
}
declare module "script/event" {
    import * as Type from "script/type";
    import * as Ruler from "script/ruler";
    export const updateViewModeRoundBar: () => void;
    export const getViewScaleRate: () => number;
    export const getViewScaleExponentFromRate: (rate: number) => number;
    export const updateViewScaleRoundBar: () => void;
    export const updateViewLockRoundBar: () => void;
    export const zoomIn: () => void;
    export const zoomOut: () => void;
    export type ZoomCenterEvent = PointerEvent | WheelEvent;
    export const getZoomCenter: (event?: ZoomCenterEvent) => number;
    export const zoom: (delta: number, event?: ZoomCenterEvent) => void;
    export const zoomByRange: (value: number) => void;
    export const shiftSlide: (event: Ruler.SnapPositionEvent, slide: Type.SlideUnit, delta: number) => void;
    export const verticalScroll: (event: Ruler.SnapPositionEvent, delta: number, slide?: Type.SlideUnit) => void;
    export const horizontalScroll: (event: Ruler.SnapPositionEvent, delta: number) => void;
    export const resetZoom: () => void;
    export const bindCommandToButton: (button: HTMLButtonElement, command: () => void) => void;
    export const initialize: () => void;
}
declare module "script/index" { }
