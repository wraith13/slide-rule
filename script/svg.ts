import * as ELEMENT from "./element.js";
export type Tag = ELEMENT.SvgTag;
export const setAttributes = ELEMENT.setAttributes;
export const makeSelector = ELEMENT.makeSelector;
export const make = <T extends Tag>(source: { tag: T } & { [key: string]: string | number; }): SVGElementTagNameMap[T] =>
    setAttributes(document.createElementNS("http://www.w3.org/2000/svg", source.tag), source);
export const makeSure = <T extends Tag>(parent: Element, source: { tag: T } & { [key: string]: string | number; }): SVGElementTagNameMap[T] =>
{
    let element = parent.querySelector<SVGElementTagNameMap[T]>(makeSelector(source));
    if ( ! element)
    {
        element = make(source);
        parent.appendChild(element);
    }
    return element;
};
