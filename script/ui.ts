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
    export const rulerView: SVGSVGElement = getSvgElementById("svg", "ruler-view");
    export const gridView: HTMLDivElement = getHtmlElementById("div", "grid-view");
    export const controlPanel: HTMLDivElement = getHtmlElementById("div", "control-panel");
    export const initialize = () =>
    {
        console.log("UI initialized");
    };
}
