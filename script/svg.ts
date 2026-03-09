import * as ELEMENT from "./element.js";
export type Tag = ELEMENT.SvgTag;
export type ElementTagNameMap = SVGElementTagNameMap;
export type EventListener<key extends keyof GlobalEventHandlersEventMap> = ELEMENT.EventListener<key>;
export type Events = ELEMENT.Events;
export type Attributes = ELEMENT.Attributes;
export const addEvents = ELEMENT.addEvents;
export const removeEvents = ELEMENT.removeEvents;
export const setAttributes = ELEMENT.setAttributes;
export const makeSelector = ELEMENT.makeSelector;
export const makeElement = <T extends Tag>(tag: T): ElementTagNameMap[T] =>
    document.createElementNS("http://www.w3.org/2000/svg", tag);
export const make = <T extends Tag>(source: { tag: T } & Attributes): ElementTagNameMap[T] =>
    setAttributes(makeElement(source.tag), source);
export const makeSure = <T extends Tag>(parent: Element, source: { tag: T } & Attributes): ElementTagNameMap[T] =>
    parent.querySelector<ElementTagNameMap[T]>(makeSelector(source)) ??
    parent.appendChild(make(source));
