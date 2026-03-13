export type HtmlTag = keyof HTMLElementTagNameMap;
export type SvgTag = keyof SVGElementTagNameMap;
export type Tag = HtmlTag | SvgTag;
export type PrimitiveEventListener<key extends keyof GlobalEventHandlersEventMap> = (event: GlobalEventHandlersEventMap[key]) => void;
export type EventListener<key extends keyof GlobalEventHandlersEventMap> = PrimitiveEventListener<key> | { listener: PrimitiveEventListener<key>; options?: boolean | AddEventListenerOptions; };
export type Events = { [key in keyof GlobalEventHandlersEventMap]?: EventListener<key>; };
export type Style = { [key: string]: string | undefined; };
export type Attributes = Exclude<{ [key: string]: string | number | undefined; }, "tag" | "events"> | { events?: Events; } | { style?: string | Style };
export const addEvents = <T extends Element>(element: T, events: Events): T =>
{
    for(const [event, listener] of Object.entries(events) as [keyof Events, EventListener<any>][])
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
    return element;
};
export const removeEvents = <T extends Element>(element: T, events: Events): T =>
{
    for(const [event, listener] of Object.entries(events) as [keyof Events, EventListener<any>][])
    {
        if ("listener" in listener)
        {
            element.removeEventListener(event, listener.listener, listener.options);
        }
        else
        {
            element.removeEventListener(event, listener);
        }
    }
    return element;
};
export const setTextContent = (element: Node, text: string) =>
{
    if (element.textContent !== text)
    {
        element.textContent = text;
        return true;
    }
    return false;
};
export const setAttribute = (element:Element, name: string, value: string | undefined) =>
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
export const setStyle = (element: HTMLElement | SVGElement, name: string, value: string | undefined) =>
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
export const setStyles = (element: HTMLElement | SVGElement, styles: Style) =>
{
    let changed = false;
    for(const [name, value] of Object.entries(styles))
    {
        changed ||= setStyle(element, name, value);
    }
    return changed;
};
export const setAttributes = <T extends HTMLElement | SVGElement>(element: T, attributes: Attributes): T =>
{
    for(const [key, value] of Object.entries(attributes))
    {
        switch(key)
        {
        case "tag":
            // Ignore
            break;
        case "textContent":
            setTextContent(element, value.toString());
            break;
        case "events":
            addEvents(element, value as Events);
            break;
        case "style":
            if ("string" === typeof value || undefined === value || null === value)
            {
                setAttribute(element, key, undefined === value ? value: value.toString());
            }
            else
            {
                setStyles(element, value as Style);
            }
            break;
        default:
            setAttribute(element, key, undefined === value ? value: value.toString());
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
