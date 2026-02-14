import * as ELEMENT from "./element.js";
export type Tag = ELEMENT.HtmlTag;
export const setAttributes = ELEMENT.setAttributes;
export const makeSelector = ELEMENT.makeSelector;
export const make = <T extends Tag>(source: { tag: T } & { [key: string]: string | number; }): HTMLElementTagNameMap[T] =>
    setAttributes(document.createElement(source.tag), source);
export const makeSure = <T extends Tag>(parent: Element, source: { tag: T } & { [key: string]: string | number; }): HTMLElementTagNameMap[T] =>
{
    let element = parent.querySelector<HTMLElementTagNameMap[T]>(makeSelector(source));
    if ( ! element)
    {
        element = make(source);
        parent.appendChild(element);
    }
    return element;
};
