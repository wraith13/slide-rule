export type HtmlTag = keyof HTMLElementTagNameMap;
export type SvgTag = keyof SVGElementTagNameMap;
export type Tag = HtmlTag | SvgTag;
export type PrimitiveEventListener<key extends keyof GlobalEventHandlersEventMap> = (event: GlobalEventHandlersEventMap[key]) => void;
export type EventListener<key extends keyof GlobalEventHandlersEventMap> = PrimitiveEventListener<key> | { listener: PrimitiveEventListener<key>; options?: boolean | AddEventListenerOptions; };
export type Attributes = Exclude<{ [key: string]: string | number; }, "tag" | "events"> & { events?: { [key in keyof GlobalEventHandlersEventMap]?: EventListener<key>; } };
export const setAttributes = <T extends Element>(element: T, attributes: Attributes): T =>
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
        case "events":
            for(const [event, listener] of Object.entries(value) as [string, EventListener<any>][])
            {
                if ("listener" in listener)
                {
                    element.addEventListener(event, listener.listener, listener.options);
                }
                else
                {
                    element.addEventListener(event, listener);
                }
            }
            break;
        default:
            element.setAttribute(key, value.toString());
            break;
        }
    }
    return element;
};
export const makeSelector = (source: { tag?: Tag } & Attributes): string =>
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
        case "events":
            // Ignore
            break;
        default:
            selector += `[${key}="${value}"]`;
            break;
        }
    }
    return selector;
};
