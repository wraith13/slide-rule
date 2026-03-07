import * as ELEMENT from "./element.js";
export type Tag = ELEMENT.HtmlTag;
export type ElementTagNameMap = HTMLElementTagNameMap;
export type Attributes = ELEMENT.Attributes;
export const makeElement = <T extends Tag>(tag: T): ElementTagNameMap[T] =>
    document.createElement(tag);
export const setAttributes = ELEMENT.setAttributes;
export const makeSelector = ELEMENT.makeSelector;
export const make = <T extends Tag>(source: { tag: T } & Attributes): ElementTagNameMap[T] =>
    setAttributes(makeElement(source.tag), source);
export const makeSure = <T extends Tag>(parent: Element, source: { tag: T } & Attributes): ElementTagNameMap[T] =>
    parent.querySelector<ElementTagNameMap[T]>(makeSelector(source)) ??
    parent.appendChild(make(source));
