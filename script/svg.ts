import * as ELEMENT from "./element.js";
export type Tag = ELEMENT.SvgTag;
export type ElementTagNameMap = SVGElementTagNameMap;
export type EventListener<key extends keyof GlobalEventHandlersEventMap> = ELEMENT.EventListener<key>;
export type Events = ELEMENT.Events;
export type Attributes = ELEMENT.Attributes;
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
export const make = <T extends Tag>(source: { tag: T } & Attributes): ElementTagNameMap[T] =>
    setAttributes(makeElement(source.tag), source);
export const makeSure = <T extends Tag>(parent: Element, source: { tag: T } & Attributes): ElementTagNameMap[T] =>
    parent.querySelector<ElementTagNameMap[T]>(makeSelector(source)) ??
    parent.appendChild(make(source));
