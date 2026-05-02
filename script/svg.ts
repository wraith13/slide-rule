import * as ELEMENT from "./element.js";
export type Tag = ELEMENT.SvgTag;
export type ElementTagNameMap = SVGElementTagNameMap;
export type EventListener<key extends keyof GlobalEventHandlersEventMap> = ELEMENT.EventListener<key>;
export type Events = ELEMENT.Events;
export type Attributes = ELEMENT.Attributes;
export type Source<T extends Tag> = { tag: T; children?: (Node | Source<Tag>)[]; } & Attributes;
export type Child = Required<Source<Tag>>["children"][number];
export const addEvents = ELEMENT.addEvents;
export const removeEvents = ELEMENT.removeEvents;
export const setTextContent = ELEMENT.setTextContent;
export const setAttribute = ELEMENT.setAttribute;
export const setStyle = ELEMENT.setStyle;
export const setAttributes = ELEMENT.setAttributes;
export const makeSelector = ELEMENT.makeSelector;
export const getElementById = <T extends keyof ElementTagNameMap>(tag: T, id: string): ElementTagNameMap[T] =>
{
    const element = document.getElementById(id) as SVGElement | null;
    if ( ! element)
    {
        throw new Error(`🦋 FIXME: SVGElement not found: ${id}`);
    }
    if (tag !== element.tagName.toLowerCase())
    {
        throw new Error(`🦋 FIXME: SVGElement is not <${tag}>: ${id}`);
    }
    return element as ElementTagNameMap[T];
};
export const makeElement = <T extends Tag>(tag: T): ElementTagNameMap[T] =>
    document.createElementNS("http://www.w3.org/2000/svg", tag);
export const make = <T extends Tag>(source: Source<T>): ElementTagNameMap[T] =>
{
    const result = makeElement(source.tag);
    setAttributes(result, source);
    if (source.children)
    {
        for(const child of source.children)
        {
            if (child instanceof Node)
            {
                result.appendChild(child);
            }
            else
            {
                result.appendChild(make(child));
            }
        }
    }
    return result;
};
export const makeSure = <T extends Tag>(parent: Element, source: Source<T>, attributes?: Attributes): ElementTagNameMap[T] =>
{
    const result =
        parent.querySelector<ElementTagNameMap[T]>(makeSelector(source)) ??
        parent.appendChild(make(source));
    if (undefined !== attributes)
    {
        setAttributes(result, attributes);
    }
    return result;
};
