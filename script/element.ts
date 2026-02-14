export type HtmlTag = keyof HTMLElementTagNameMap;
export type SvgTag = keyof SVGElementTagNameMap;
export type Tag = HtmlTag | SvgTag;
export const setAttributes = <T extends Element>(element: T, attributes: { [key: string]: string | number; }): T =>
{
    for(const [key, value] of Object.entries(attributes))
    {
        switch(key)
        {
        case "tag":
            // Ignore
            break;
        case "textContent":
            element.textContent = value.toString();
            break;
        default:
            element.setAttribute(key, value.toString());
            break;
        }
    }
    return element;
};
export const makeSelector = (source: { tag?: Tag } & { [key: string]: string | number; }): string =>
{
    let selector = "";
    if ("tag" in source)
    {
        selector += source.tag;
    }
    if ("id" in source)
    {
        selector += `#${source.id}`;
    }
    if ("class" in source)
    {
        selector += `${source.class}`
            .split(/\s+/)
            .filter(Boolean)
            .map(c => `.${c}`)
            .join("");
    }
    for(const [key, value] of Object.entries(source))
    {
        switch(key)
        {
        case "tag":
        case "id":
        case "class":
        case "textContent":
            // Ignore
            break;
        default:
            selector += `[${key}="${value}"]`;
            break;
        }
    }
    return selector;
};
