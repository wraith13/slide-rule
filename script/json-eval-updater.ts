import * as Url from "./url";
import * as Type from "./type";
import * as Time from "./time";
import * as UI from "./ui";
import * as Model from "./model";
import * as View from "./view";
import * as Event from "./event";
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
export const updateJsonWithEval = (json: any, path?: string): any =>
{
    console.log(`Updating JSON with eval: ${path ?? "root"}`);
    if ("object" === typeof json && null !== json)
    {
        if (Array.isArray(json))
        {
            console.log(`Processing array at ${path ?? "root"} with length ${json.length}`);
            return json.map
            (
                (item, index) => updateJsonWithEval(item, `${path ?? ""}[${index}]`)
            );
        }
        else
        {
            console.log(`Processing object at ${path ?? "root"} with keys: ${Object.keys(json).join(", ")}`);
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
                                console.log(`Evaluated ${currentPath}: ${value} =>`, evalResult);
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