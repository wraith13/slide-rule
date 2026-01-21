export namespace UI
{
    const getHtmlElementById = <T extends keyof HTMLElementTagNameMap>(tag: T, id: string): HTMLElementTagNameMap[T] =>
    {
        const element = document.getElementById(id);
        if ( ! element)
        {
            throw new Error(`🦋 FIXME: HtmlElement not found: ${id}`);
        }
        if (tag !== element.tagName.toLowerCase())
        {
            throw new Error(`🦋 FIXME: HtmlElement is not <${tag}>: ${id}`);
        }
        return element as HTMLElementTagNameMap[T];
    };
    const getSvgElementById = <T extends keyof SVGElementTagNameMap>(tag: T, id: string): SVGElementTagNameMap[T] =>
    {
        const element = document.getElementById(id) as SVGElement | null;
        if ( ! element)
        {
            throw new Error(`🦋 FIXME: SvgElement not found: ${id}`);
        }
        if (tag !== element.tagName.toLowerCase())
        {
            throw new Error(`🦋 FIXME: SvgElement is not <${tag}>: ${id}`);
        }
        return element as SVGElementTagNameMap[T];
    };
    export const setAriaHidden = (element: HTMLElement | SVGElement, hidden: boolean) =>
    {
        const attributeKey = "aria-hidden";
        if (hidden)
        {
            const attribute = document.createAttribute(attributeKey);
            attribute.value = "true";
            element.attributes.setNamedItem(attribute);
        }
        else
        {
            if (element.attributes.getNamedItem(attributeKey))
            {
                element.attributes.removeNamedItem(attributeKey);
            }
        }
    };
    export const setTextContent = (element: HTMLElement, text: string) =>
    {
        if (element.textContent !== text)
        {
            element.textContent = text;
            return true;
        }
        return false;
    };
    export const setAttribute = (element: HTMLElement, name: string, value: string | undefined) =>
    {
        if ((element.getAttribute(name) ?? "") !== (value ?? ""))
        {
            if (undefined === value || null === value)
            {
                element.removeAttribute(name);
            }
            else
            {
                element.setAttribute(name, value);
            }
            return true;
        }
        return false;
    };
    export const setStyle = (element: HTMLElement, name: string, value: string | undefined) =>
    {
        if ((element.style.getPropertyValue(name) ?? "") !== (value ?? ""))
        {
            if (undefined === value || null === value || "" === value)
            {
                element.style.removeProperty(name);
            }
            else
            {
                element.style.setProperty(name, value);
            }
            return true;
        }
        return false;
    };
    export const updateRoundBar = (button: HTMLButtonElement, properties: { low: number, high: number, rotate: number, }) =>
    {
        // console.log("updateRoundBar", button, properties);
        /* For older environments where the 'initial-value' setting isn't supported, all values must be specified. */
        setStyle(button, "--low", properties.low.toFixed(3));
        setStyle(button, "--high", properties.high.toFixed(3));
        setStyle(button, "--rotate", properties.rotate.toFixed(3));
    };
    export const rulerView: HTMLDivElement = getHtmlElementById("div", "ruler-view");
    export const rulerSvg: SVGSVGElement = getSvgElementById("svg", "ruler-svg");
    export const gridView: HTMLDivElement = getHtmlElementById("div", "grid-view");
    export const graphView: HTMLDivElement = getHtmlElementById("div", "graph-view");
    export const controlPanel: HTMLDivElement = getHtmlElementById("div", "control-panel");
    export const viewModeButton: HTMLButtonElement = getHtmlElementById("button", "view-mode-button");
    export const scaleModeButton: HTMLButtonElement = getHtmlElementById("button", "scale-mode-button");
    export const initialize = () =>
    {
        console.log("UI initialized");
    };
}
