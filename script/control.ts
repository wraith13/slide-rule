// original: web-media-player: library/control.ts
//import { Array as ToolsArray } from "@tools/array";
//import { UI } from "./ui";
// original: web-media-player: tools/type-guards.ts
export const hasValue = <T>(value: T | null | undefined): value is T =>
    value !== null && value !== undefined;
// original: web-media-player: tools/array.ts
export const joinable = <T>(value: T, condition?: boolean) =>
    hasValue(value) && (condition ?? true) ? [ value, ]: [];
// original: web-media-player: library/ui.ts
export type Attributes = Record<string, string | number | boolean>;
export type Styles = Partial<CSSStyleDeclaration>;
export type Events =
{
    [K in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[K]) => void;
};
export type ElementSource<T extends HtmlTag = any> = CreateElementArguments<T> | HTMLElementTagNameMap[T];
export interface ElementOptions
{
    className?: string;
    text?: string;
    attributes?: Attributes;
    children?: ElementSource[];
    styles?: Styles;
    events?: Events;
}
export interface CreateElementArguments<T extends HtmlTag> extends ElementOptions
{
    tag: T;
}
export type HtmlTag = keyof HTMLElementTagNameMap;
export const setOptions = <T extends HTMLElement>(element: T, options: ElementOptions = {}): T =>
{
    const { className, text, attributes = {}, children = [], styles = {}, events = {} } = options;
    if ("string" === typeof className)
    {
        element.className = className;
    }
    if ("string" === typeof text)
    {
        element.textContent = text;
    }
    Object.entries(attributes).forEach
    (
        ([key, value]) => element.setAttribute(key, String(value))
    );
    Object.entries(styles).forEach
    (
        ([key, value]) => (element.style as any)[key] = value
    );
    Object.entries(events).forEach
    (
        ([event, handler]) => element.addEventListener(event, handler as EventListener)
    );
    children.forEach(child => appendChild(element, child));
    return element;
};
export const createNode = <T extends HtmlTag>(element: ElementSource<T> | Text | string): HTMLElementTagNameMap[T] | Text =>
    "string" === typeof element ? document.createTextNode(element):
    element instanceof Node ? element:
        setOptions(document.createElement(element.tag), element);
export const removeAllChildren = <ParentT extends HTMLElement>(parent: ParentT): ParentT =>
{
    Array.from(parent.children).forEach(i => parent.removeChild(i));
    return parent;
};
    export const appendChild = <ParentT extends HTMLElement, T extends HtmlTag>(parent: ParentT, element: ElementSource<T>): ParentT =>
    {
        parent.appendChild(createNode(element));
        return parent;
    };
export const appendChildren = <ParentT extends HTMLElement, T extends HtmlTag>(parent: ParentT, elements: ElementSource<T>[]): ParentT =>
{
    if ("append" in parent)
    {
        parent.append(...elements.map(i => createNode(i)));
    }
    else
    {
        elements.forEach(i => appendChild(parent, i));
    }
    return parent;
};
export const replaceChildren = <ParentT extends HTMLElement, T extends HtmlTag>(parent: ParentT, elements: ElementSource<T>[]): ParentT =>
{
    removeAllChildren(parent);
    return appendChildren(parent, elements);
};
// export namespace Control
// {
    const makeSelectOption = (value: string, text: string) =>
    {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = text;
        return option;
    };
    export interface ArgumentsBaseDom<T extends HTMLElement>
    {
        dom: T;
    }
    export interface ArgumentsBaseId
    {
        id: string;
    }
    export type ArgumentsBase<T extends HTMLElement> = ArgumentsBaseDom<T> | ArgumentsBaseId;
    export const getDom = <T extends HTMLElement>(data: ArgumentsBase<T>): T =>
    {
        const result = "dom" in data ?
            data.dom:
            <T>document.getElementById(data.id);
        if (null == result || undefined === result)
        {
            console.error("🦋 FIXME: Contorl.getDom.NotExistsDom", data);
        }
        else
        if ( ! (result instanceof HTMLElement))
        {
            console.error("🦋 FIXME: Contorl.getDom.InvalidDom", data, result);
        }
        return result;
    }
    export const getDomId = <T extends HTMLElement>(data: ArgumentsBase<T>): string | undefined =>
        "id" in data ? data.id:
        "dom" in data ? data.dom.id:
            undefined;
    export const eventLog = <T extends HTMLElement>(data: { control: { data: ArgumentsBase<T> }, event: Event | string, message: string, value?: any }) =>
        console.log
        (
            data.message,
            ...
            [
                ...joinable(getDomId(data.control.data)),
                data.event,
                data.control,
                ...joinable(data.value),
            ]
        );
    export interface ButtonArgumentsBase<T extends HTMLElement>
    {
        click?: (event: Event | null, select: Button<T>) => unknown;
    }
    export type ButtonArguments<T extends HTMLElement = HTMLButtonElement> = ArgumentsBase<T> & ButtonArgumentsBase<T>;
    export class Button<T extends HTMLElement>
    {
        public dom: T;
        constructor(public data: ButtonArguments<T>)
        {
            this.dom = getDom(data);
            this.dom.addEventListener
            (
                "click",
                event =>
                {
                    eventLog({ control: this, event, message: "👆 Button.Click:" });
                    this.data.click?.(event, this);
                }
            );
        }
        getId = () => getDomId(this.data);
        setClick = (click: (event: Event | null, select: Button<T>) => unknown) =>
            this.data.click = click;
        fire = () => this.data.click?.(null, this);
    }
    export interface SelectArgumentsBase<T>
    {
        enum: T[];
        default: T;
    }
    export interface SelectOptions<T>
    {
        makeLabel?: (value: T) => string;
        change?: (event: Event | null, select: Select<T>) => unknown;
        preventOnChangeWhenNew?: boolean;
    }
    export const preventOnChange = "preventOnChange" as const;
    export type SelectArguments<T> = ArgumentsBase<HTMLSelectElement> & SelectArgumentsBase<T>;
    export class Select<T>
    {
        public dom: HTMLSelectElement;
        public saveParameter?: (key: string, value: string) => unknown;
        constructor(public data: SelectArguments<T>, public options?: SelectOptions<T>)
        {
            this.dom = getDom(data);
            if ( ! (this.dom instanceof HTMLSelectElement))
            {
                console.error("🦋 FIXME: Contorl.Select.InvalidDom", data, this.dom);
            }
            this.reloadOptions(this.data.default);
            this.dom.addEventListener
            (
                // Without this, in Chromium-based browsers, selecting from the dropdown triggers the label's click event, causing the dropdown to reopen.
                "click", event => event.stopPropagation()
            );
            this.dom.addEventListener
            (
                "change", event =>
                {
                    eventLog({ control: this, event, message: "👆 Select.Change:", value: this.get() });
                    this.options?.change?.(event, this);
                    this.saveParameter?.(this.getId() as string, this.get());
                }
            );
        }
        catchUpRestore = (params?: Record<string, string>) =>
        {
            if ((params?.[this.dom.id] ?? `${this.data.default}`) !== this.get())
            {
                eventLog({ control: this, event: "catchUpRestore", message: "👆 Select.Change:", value: this.get() });
                this.options?.change?.(null, this);
                this.saveParameter?.(this.getId() as string, this.get());
            }
        };
        getId = () => getDomId(this.data);
        setChange = (change: (event: Event | null, select: Select<T>) => unknown) =>
            this.options = { ...this.options, change };
        reloadOptions = (value?: T) =>
        {
            const oldValue = value ?? (this.get() as T);
            replaceChildren
            (
                this.dom,
                this.data.enum.map(i => makeSelectOption(`${i}`, this.options?.makeLabel?.(i) ?? `${i}`))
            );
            this.switch(oldValue, preventOnChange);
        };
        private getNextIndex = (index: number, direction: boolean) =>
            index + (direction ? -1 : 1);
        private getNextIndexClamp = (length: number, index: number, direction: boolean) =>
        {
            const next = this.getNextIndex(index, direction);
            return 0 <= next && next < length ? next: index;
        };
        private getNextIndexCycle = (length: number, index: number, direction: boolean) =>
            (this.getNextIndex(index, direction) + length) % length;
        switch =
        (
            valueOrDirection: T | boolean,
            preventOnChange?: "preventOnChange" | "forceOnChange",
            getNextIndex: (length: number, index: number, direction: boolean) => number = this.getNextIndexClamp
        ) =>
        {
            const oldValue = this.get();
            if ("boolean" === typeof valueOrDirection)
            {
                const options = Array.from(this.dom.getElementsByTagName("option"));
                const optionValues = options.map(i => i.value);
                const index = optionValues.indexOf(this.dom.value);
                const nextIndex = getNextIndex(optionValues.length, index, valueOrDirection);
                const nextValue = optionValues[nextIndex];
                if (undefined !== nextValue)
                {
                    this.dom.value = nextValue;
                }
            }
            else
            {
                if (this.hasOption(valueOrDirection))
                {
                    this.dom.value = `${valueOrDirection}`;
                }
            }
            if (undefined === preventOnChange && (oldValue !== this.get() || "forceOnChange" === preventOnChange))
            {
                this.fire();
            }
        };
        hasOption = (value: T) =>
        {
            const options = Array.from(this.dom.getElementsByTagName("option"));
            return undefined !== options.find(i => i.value === `${value}`);
        };
        cycle = (direction: boolean, preventOnChange?: "preventOnChange" | "forceOnChange") => this.switch
        (
            direction,
            preventOnChange,
            this.getNextIndexCycle
        );
        get = () => this.dom.value;
        fire = () => this.options?.change?.(null, this);
        loadParameter = (params: Record<string, string>, saveParameter?: (key: string, value: string) => unknown) =>
        {
            const value = params[this.dom.id];
            if (undefined !== value)
            {
                if (this.hasOption(value as T))
                {
                    this.switch(value as T);
                }
                else
                {
                    console.warn("🚫 Select.loadParameter: Unknown option value:", this.dom.id, value, this);
                }
            }
            if (undefined !== saveParameter)
            {
                this.saveParameter = saveParameter;
            }
            return this;
        }
    }
    export interface CheckboxArgumentsBase
    {
        default?: boolean;
    }
    export interface CheckboxOptions
    {
        change?: (event: Event | null, checked: Checkbox) => unknown;
        preventOnChangeWhenNew?: boolean;
    }
    export type CheckboxArguments = ArgumentsBase<HTMLInputElement> & CheckboxArgumentsBase;
    export class Checkbox
    {
        public dom: HTMLInputElement;
        public saveParameter?: (key: string, value: string) => unknown;
        constructor(public data: CheckboxArguments, public options?: CheckboxOptions)
        {
            this.dom = getDom(data);
            if ( ! (this.dom instanceof HTMLInputElement) || "checkbox" !== this.dom.type.toLowerCase())
            {
                console.error("🦋 FIXME: Contorl.Checkbox.InvalidDom", data, this.dom);
            }
            if (undefined !== this.data.default)
            {
                this.toggle
                (
                    this.data.default,
                    [preventOnChange][false !== this.options?.preventOnChangeWhenNew ? 0: 1]
                );
            }
            this.dom.addEventListener
            (
                "change",
                event =>
                {
                    eventLog({ control: this, event, message: "👆 Checkbox.Change:", value: this.get() });
                    this.options?.change?.(event, this);
                    this.saveParameter?.(this.getId() as string, this.get() ? "true": "false");
                }
            );
        }
        catchUpRestore = (params?: Record<string, string>) =>
        {
            const urlParam = params?.[this.dom.id];
            if
            (
                (
                    undefined !== urlParam ?
                        "true" === urlParam:
                        (this.data.default ?? false)
                ) !== this.get()
            )
            {
                eventLog({ control: this, event: "catchUpRestore", message: "👆 Checkbox.Change:", value: this.get() });
                this.options?.change?.(null, this);
                this.saveParameter?.(this.getId() as string, this.get() ? "true": "false");
            }
        };
        getId = () => getDomId(this.data);
        setChange = (change: (event: Event | null, checked: Checkbox) => unknown) =>
            this.options = { ...this.options, change };
        toggle = (checked?: boolean, preventOnChange?: "preventOnChange" | "forceOnChange") =>
        {
            if (checked !== this.get() || "forceOnChange" === preventOnChange)
            {
                this.dom.checked = checked ?? ! this.get();
                if (undefined === preventOnChange)
                {
                    this.options?.change?.(null, this);
                }
            }
        };
        get = () => this.dom.checked;
        fire = () => this.options?.change?.(null, this);
        loadParameter = (params: Record<string, string>, saveParameter?: (key: string, value: string) => unknown) =>
        {
            const value = params[this.dom.id];
            if (undefined !== value)
            {
                this.toggle("true" === value);
            }
            if (undefined !== saveParameter)
            {
                this.saveParameter = saveParameter;
            }
            return this;
        }
    }
    export interface ToggleLabelArgumentsBase
    {
        default?: boolean;
    }
    export interface ToggleLabelOptions
    {
        change?: (event: Event | null, toggleLabel: ToggleLabel) => unknown;
        preventOnChangeWhenNew?: boolean;
    }
    export type ToggleLabelArguments = ArgumentsBase<HTMLLabelElement> & ToggleLabelArgumentsBase;
    export class ToggleLabel
    {
        public dom: HTMLLabelElement;
        public saveParameter?: (key: string, value: string) => unknown;
        constructor(public data: ToggleLabelArguments, public options?: ToggleLabelOptions)
        {
            this.dom = getDom(data);
            if ( ! (this.dom instanceof HTMLLabelElement) || "label" !== this.dom.tagName.toLowerCase())
            {
                console.error("🦋 FIXME: Contorl.ToggleLabel.InvalidDom", data, this.dom);
            }
            if (undefined !== this.data.default)
            {
                this.toggle
                (
                    this.data.default,
                    [preventOnChange][false !== this.options?.preventOnChangeWhenNew ? 0: 1]
                );
            }
            this.dom.addEventListener
            (
                "click",
                event =>
                {
                    eventLog({ control: this, event, message: "👆 ToggleLabel.Click:", value: ! this.get() });
                    this.toggle();
                    this.options?.change?.(event, this);
                    this.saveParameter?.(this.getId() as string, this.get() ? "true": "false");
                }
            );
        }
        catchUpRestore = (params?: Record<string, string>) =>
        {
            const urlParam = params?.[this.dom.id];
            if
            (
                (
                    undefined !== urlParam ?
                        "true" === urlParam:
                        (this.data.default ?? false)
                ) !== this.get()
            )
            {
                eventLog({ control: this, event: "catchUpRestore", message: "👆 Checkbox.Change:", value: this.get() });
                this.options?.change?.(null, this);
                this.saveParameter?.(this.getId() as string, this.get() ? "true": "false");
            }
        };
        getId = () => getDomId(this.data);
        setChange = (change: (event: Event | null, toggleLabel: ToggleLabel) => unknown) =>
            this.options = { ...this.options, change };
        toggle = (checked?: boolean, preventOnChange?: "preventOnChange" | "forceOnChange") =>
        {
            const newChecked = checked ?? ! this.get();
            if (newChecked !== this.get() || "forceOnChange" === preventOnChange)
            {
                this.dom.classList.toggle("on", newChecked);
                this.dom.querySelector("span[data-lang-key='on']")?.setAttribute("aria-hidden", newChecked ? "false": "true");
                this.dom.querySelector("span[data-lang-key='off']")?.setAttribute("aria-hidden", newChecked ? "true": "false");
                if (undefined === preventOnChange)
                {
                    this.options?.change?.(null, this);
                }
            }
        };
        get = () => this.dom.classList.contains("on");
        fire = () => this.options?.change?.(null, this);
        loadParameter = (params: Record<string, string>, saveParameter?: (key: string, value: string) => unknown) =>
        {
            const value = params[this.dom.id];
            if (undefined !== value)
            {
                this.toggle("true" === value);
            }
            if (undefined !== saveParameter)
            {
                this.saveParameter = saveParameter;
            }
            return this;
        }
    }
    export interface ToggleButtonArgumentsBase
    {
        default?: boolean;
    }
    export interface ToggleButtonOptions
    {
        change?: (event: Event | null, toggleButton: ToggleButton) => unknown;
        preventOnChangeWhenNew?: boolean;
    }
    export type ToggleButtonArguments = ArgumentsBase<HTMLButtonElement> & ToggleButtonArgumentsBase;
    export class ToggleButton
    {
        public dom: HTMLButtonElement;
        public saveParameter?: (key: string, value: string) => unknown;
        constructor(public data: ToggleButtonArguments, public options?: ToggleButtonOptions)
        {
            this.dom = getDom(data);
            if ( ! (this.dom instanceof HTMLButtonElement) || "button" !== this.dom.tagName.toLowerCase())
            {
                console.error("🦋 FIXME: Contorl.ToggleButton.InvalidDom", data, this.dom);
            }
            if (undefined !== this.data.default)
            {
                this.toggle
                (
                    this.data.default,
                    [preventOnChange][false !== this.options?.preventOnChangeWhenNew ? 0: 1]
                );
            }
            this.dom.addEventListener
            (
                "click",
                event =>
                {
                    eventLog({ control: this, event, message: "👆 ToggleButton.Click:", value: ! this.get() });
                    this.toggle();
                    this.options?.change?.(event, this);
                    this.saveParameter?.(this.getId() as string, this.get() ? "true": "false");
                }
            );
        }
        catchUpRestore = (params?: Record<string, string>) =>
        {
            const urlParam = params?.[this.dom.id];
            if
            (
                (
                    undefined !== urlParam ?
                        "true" === urlParam:
                        (this.data.default ?? false)
                ) !== this.get()
            )
            {
                eventLog({ control: this, event: "catchUpRestore", message: "👆 Checkbox.Change:", value: this.get() });
                this.options?.change?.(null, this);
                this.saveParameter?.(this.getId() as string, this.get() ? "true": "false");
            }
        };
        getId = () => getDomId(this.data);
        setChange = (change: (event: Event | null, toggleButton: ToggleButton) => unknown) =>
            this.options = { ...this.options, change };
        toggle = (checked?: boolean, preventOnChange?: "preventOnChange" | "forceOnChange") =>
        {
            const newChecked = checked ?? ! this.get();
            if (newChecked !== this.get() || "forceOnChange" === preventOnChange)
            {
                this.dom.classList.toggle("on", newChecked);
                this.dom.querySelector("span[data-lang-key='on']")?.setAttribute("aria-hidden", newChecked ? "false": "true");
                this.dom.querySelector("span[data-lang-key='off']")?.setAttribute("aria-hidden", newChecked ? "true": "false");
                if (undefined === preventOnChange)
                {
                    this.options?.change?.(null, this);
                }
            }
        };
        get = () => this.dom.classList.contains("on");
        fire = () => this.options?.change?.(null, this);
        loadParameter = (params: Record<string, string>, saveParameter?: (key: string, value: string) => unknown) =>
        {
            const value = params[this.dom.id];
            if (undefined !== value)
            {
                this.toggle("true" === value);
            }
            if (undefined !== saveParameter)
            {
                this.saveParameter = saveParameter;
            }
            return this;
        }
    }
    export interface RangeArgumentsBase
    {
        min?: number;
        max?: number;
        step?: number;
        default?: number;
    }
    export interface RangeOptions
    {
        change?: (event: Event | null, range: Range) => unknown;
        preventOnChangeWhenNew?: boolean;
    }
    export type RangeArguments = ArgumentsBase<HTMLInputElement> & RangeArgumentsBase;
    export class Range
    {
        public dom: HTMLInputElement;
        public saveParameter?: (key: string, value: string) => unknown;
        constructor(public data: RangeArguments, public options?: RangeOptions)
        {
            this.dom = getDom(data);
            if ( ! (this.dom instanceof HTMLInputElement) || "range" !== this.dom.type.toLowerCase())
            {
                console.error("🦋 FIXME: Contorl.Range.InvalidDom", data, this.dom);
            }
            this.dom.min = `${this.data.min ?? 0}`;
            this.dom.max = `${this.data.max ?? 100}`;
            this.dom.step = `${this.data.step ?? 1}`;
            if (undefined !== this.data.default)
            {
                this.set(this.data.default, [preventOnChange][false !== this.options?.preventOnChangeWhenNew ? 0: 1]);
            }
            this.dom.addEventListener
            (
                "change",
                event =>
                {
                    eventLog({ control: this, event, message: "👆 Range.Change:", value: this.get() });
                    this.options?.change?.(event, this);
                    this.saveParameter?.(this.getId() as string, `${this.get()}`);
                }
            );
            this.dom.addEventListener
            (
                "input",
                event =>
                {
                    eventLog({ control: this, event, message: "👆 Range.Input:", value: this.get() });
                    this.options?.change?.(event, this);
                    this.saveParameter?.(this.getId() as string, `${this.get()}`);
                }
            );
        }
        catchUpRestore = (params?: Record<string, string>) =>
        {
            const urlParam = params?.[this.dom.id];
            if (undefined !== urlParam && urlParam !== `${this.get()}`)
            {
                eventLog({ control: this, event: "catchUpRestore", message: "👆 Range.Change:", value: this.get() });
                this.options?.change?.(null, this);
                this.saveParameter?.(this.getId() as string, `${this.get()}`);
            }
        };
        getId = () => getDomId(this.data);
        setChange = (change: (event: Event | null, range: Range) => unknown) =>
            this.options = { ...this.options, change };
        set = (value: number, preventOnChange?: "preventOnChange") =>
        {
            this.dom.value = `${value}`;
            if (undefined === preventOnChange)
            {
                this.options?.change?.(null, this);
            }
        };
        get = () => parseFloat(this.dom.value);
        fire = () => this.options?.change?.(null, this);
        loadParameter = (params: Record<string, string>, saveParameter?: (key: string, value: string) => unknown) =>
        {
            const value = params[this.dom.id];
            if (undefined !== value)
            {
                this.set(parseFloat(value));
            }
            if (undefined !== saveParameter)
            {
                this.saveParameter = saveParameter;
            }
            return this;
        }
    }
// }