import * as Url from "./url";
import * as Type from "./type";
import * as Calculation from "./calculation";
import * as Time from "./time";
import * as UI from "./ui";
import * as Model from "./model";
import * as View from "./view";
import * as Ruler from "./ruler";
import * as Render from "./render";
import config from "@resource/config.json";
export const dummy = // for eval in json
{
    Url,
    Type,
    Time,
    UI,
    Model,
    View,
    Event,
    Ruler,
    Render,
    config
};
export const nestEvalUpdate = <Source, Target>(obj: Source, getList: (obj: Source) => Target[], updater: (value: Target) => Target, getChild: (obj: Target) => Source): Source =>
{
    const list = getList(obj);
    if (list !== undefined)
    {
        for (let i of list)
        {
            const child = getChild(i);
            if (child !== undefined)
            {
                nestEvalUpdate(child, getList, updater, getChild);
            }
            updater(i);
        }
    }
    return obj;
};
export const midiNoteToFrequency = (midiNote: number): number =>
    440 * Math.pow(2, (midiNote - 69) / 12);
const c = 299792458; // 光速 / EN: speed of light in vacuum (m/s)
const h = 6.62607015e-34; // プランク定数 / EN: Planck constant (J·s)
const ev = 1.602176634e-19; // 電子ボルト / EN: electron volt (J)
export const waveLengthToFrequency = <T>(wavelength: Extract<T, null | undefined> | number): Extract<T, null | undefined> | number =>
    "number" === typeof wavelength ? c / wavelength: wavelength;
export const frequencyToWaveLength = <T>(frequency: Extract<T, null | undefined> | number): Extract<T, null | undefined> | number =>
    "number" === typeof frequency ? c / frequency: frequency;
export const frequencyToEV = <T>(frequency: Extract<T, null | undefined> | number): Extract<T, null | undefined> | number =>
    "number" === typeof frequency ? (h / ev) *frequency: frequency;
export const roundE = Calculation.roundE;
export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
export const updateJsonWithEval = (json: Json, path?: string): Json =>
{
    // console.log(`Updating JSON with eval: ${path ?? "root"}`);
    if ("object" === typeof json && null !== json)
    {
        if (Array.isArray(json))
        {
            // console.log(`Processing array at ${path ?? "root"} with length ${json.length}`);
            return json.map
            (
                (item, index) => updateJsonWithEval(item, `${path ?? ""}[${index}]`)
            );
        }
        else
        {
            // console.log(`Processing object at ${path ?? "root"} with keys: ${Object.keys(json).join(", ")}`);
            const result: any = {};
            for (const key of Object.keys(json))
            {
                const value = json[key];
                result[key] = updateJsonWithEval(value, `${path ?? ""}.${key}`);
            }
            if ("$source-eval" in result)
            {
                const source = result["$source-eval"];
                if ("object" === typeof source && null !== source && ! Array.isArray(source))
                {
                    for (const key of Object.keys(source))
                    {
                        const currentPath = `${path ?? ""}.$source-eval.${key}`;
                        const value = source[key];
                        if ("string" === typeof value)
                        {
                            try
                            {
                                const evalResult = eval(value);
                                if ( ! currentPath.startsWith("$SILENT"))
                                {
                                    console.log(`Evaluated ${currentPath}: ${value} =>`, evalResult);
                                }
                                result[key] = evalResult;
                            }
                            catch (error)
                            {
                                console.error(`Error evaluating ${currentPath}: ${value}`, error);
                            }
                        }
                        else
                        {
                            console.warn(`Invalid ${currentPath} value: ${value}`);
                        }
                    }
                }
                else
                {
                    console.warn(`Invalid ${path ?? ""}.$source-eval value: ${source}`);
                }
            }
            return result;
        }
    }
    return json;
};
export const saveJson = (json: Json): void =>
{
    const filename = (json as any)["$file-name"] ?? "updated.json";
    const blob = new Blob([JSON.stringify(json, null, 4)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};
