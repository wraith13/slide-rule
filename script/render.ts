import * as Type from "./type";
import * as View from "./view";
import * as Model from "./model";
import config from "@resource/config.json";
export const AllItems = "$ALL";
export const Size = "$SIZE";
export const Popup = "$POPUP";
const timelimit = config.render.ruler.frameRenderTimeLimit;
let renderRequested = false;
let dirty = new Set<string>();
let currentRenderer: (model: Type.Model, view: Type.View, dirty: Set<string>, timeLimit?: number, options?: Type.RenderingOptions) => unknown;
export const isDirty = (): boolean =>
    0 < dirty.size;
export const markDirty = (item?: string) =>
{
    dirty.add(item ?? AllItems);
    if (item !== Popup && View.hasPopup())
    {
        clearPopup();
    }
    requestRender();
};
export const requestRender = () =>
{
    if ( ! renderRequested)
    {
        renderRequested = true;
        requestAnimationFrame
        (
            () =>
            {
                renderRequested = false;
                if (isDirty())
                {
                    currentRenderer(Model.data, View.data, dirty, performance.now() +timelimit);
                    requestRender();
                }
            }
        );
    }
};
export const resetDirty = (item: string) =>
{
    // if (undefined !== item)
    // {
        dirty.delete(item);
    // }
    // else
    // {
    //     dirty.clear();
    // }
};
export const resize = () =>
{
    markDirty(Size);
};
export const setRenderer = (renderer: typeof currentRenderer) =>
{
    currentRenderer = renderer;
    markDirty();
};
export const parseLeveledTextRegex = new RegExp(`[\\${config.symbols.power}\\${config.symbols.subscript}]((?:\\{[^}]*\\})|(?:[\\+\\-]?\\d+(?:[,\\.]\\d+)*))`);
export const parseLeveledText = (text: string): Type.LeveledText[] =>
{
    // "^" を上付き文字のマーカーとする。１つの数値だけを上付き文字とし、その他の複数文字の場合は { } で括る。
    // "_" を下付き文字のマーカーとする。１つの数値だけを下付き文字とし、その他の複数文字の場合は { } で括る。
    // 上付きや下付きの記述が終わったら、レベルを元に戻す。
    // 乗数の乗数の様なモノには今回は対応しない。 / EN: We will not support things like exponents of exponents for now.
    const result: Type.LeveledText[] = [];
    let restText = text;
    while(true)
    {
        const match = restText.match(parseLeveledTextRegex);
        if ( ! match)
        {
            result.push({ text: restText, level: 0 });
            break;
        }
        {
            const index = match.index!;
            if (0 < index)
            {
                result.push({ text: restText.slice(0, index), level: 0 });
            }
            restText = restText.slice(index + match[0].length);
            const marker = match[0][0];
            const content = match[1] ?? "";
            const level = "^" === marker ? 1 : -1;
            if (content.startsWith("{") && content.endsWith("}"))
            {
                result.push({ text: content.slice(1, -1), level });
            }
            else
            {
                result.push({ text: content, level });
            }
        }
    }
    // 無駄に複雑な表記の正規化などは今回は行わず、そのまま返す。/ EN: We will not perform normalization of unnecessarily complex notations, etc., and will return it as is.
    // console.log(`Parsed leveled text: ${text} => ${JSON.stringify(result)}`);
    return result;
}
export const isRegularSizeText = (text: Type.LeveledText): boolean =>
    0 === text.level || config.symbols.miniSymbols.includes(text.text);
export const clearPopup = (): void =>
{
    console.log(`clearPopup`);
    View.data.popup = null;
    markDirty(Popup);
};
export const newPopup = <T extends Type.ViewPopup>(popup: T): void =>
{
    console.log(`newPopup: ${JSON.stringify(popup)}`);
    View.data.popup = popup;
    markDirty(Popup);
};
export const backPopup = (): void =>
{
    console.log(`backPopup: current popup = ${JSON.stringify(View.data.popup)}`);
    if (null !== View.data.popup)
    {
        if (null !== View.data.popup.child)
        {
            View.data.popup = null;
        }
        else
        {
            let parent = View.data.popup;
            while(true)
            {
                if (null === (parent.child?.child ?? null))
                {
                    parent.child = null;
                    break;
                }
                else
                {
                    parent = parent.child!;
                }
            }
        }
        markDirty(Popup);
    }
};
export const nextPopup = (popup: Type.ViewPopup): void =>
{
    console.log(`nextPopup: ${popup.popupType}`);
    if (null === View.data.popup)
    {
        View.data.popup = popup;
    }
    else
    {
        let current = View.data.popup;
        while(true)
        {
            if (null === current.child)
            {
                current.child = popup;
                break;
            }
            else
            {
                current = current.child;
            }
        }
    }
    markDirty(Popup);
};