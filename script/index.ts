import * as Locale from "./locale";
import * as Url from "./url";
import * as Calculation from "./calculation";
import * as Type from "./type";
import * as JsonEvalUpdater from "./json-eval-updater";
import * as Time from "./time";
import * as UI from "./ui";
import * as Settings from "./settings";
import * as Model from "./model";
import * as View from "./view";
import * as Ruler from "./ruler";
import * as Render from "./render";
import * as Command from "./command";
import * as Event from "./event";
import config from "@resource/config.json";
console.log("🚀 Slide Rule build script");
const global =
{
    Locale,
    Url,
    Calculation,
    Type,
    Time,
    UI,
    Settings,
    Model,
    View,
    Event,
    Ruler,
    Render,
    Command,
    config,
    constant: Model.constant,
    nestEvalUpdate: JsonEvalUpdater.nestEvalUpdate,
    soundScaleToFrequency: JsonEvalUpdater.midiNoteToFrequency,
    waveLengthToFrequency: JsonEvalUpdater.waveLengthToFrequency,
    frequencyToWaveLength: JsonEvalUpdater.frequencyToWaveLength,
    roundE: JsonEvalUpdater.roundE,
    updateJsonWithEval: (json: typeof Model.constant[keyof typeof Model.constant]) =>
        JsonEvalUpdater.saveJson(JsonEvalUpdater.updateJsonWithEval(json as JsonEvalUpdater.Json, (json as any)["$file-name"] as string || undefined)),
};
for (const key of Object.keys(global) as (keyof typeof global)[])
{
    (window as any)[key] = global[key];
}
Type;
Url.initialize();
Time.initialize();
UI.initialize();
Model.initialize();
View.initialize();
Ruler.initialize();
Command.initialize();
Event.initialize();
Render.setRenderer(Ruler.renderer);
Command.loadFromUrl();
for(const tableKey of Object.keys(Model.constant) as (keyof typeof Model.constant)[])
{
    if ("$time-require" in Model.constant[tableKey])
    {
        Model.constant[tableKey] = Time.updateConstantTable
        (
            Model.constant[tableKey] as unknown as Type.ConstantTable,
            `$SILENT.${tableKey}`
        ) as unknown as any;
    }
}
// リリース時にはここは DEBUG モード時にのみ動作させる様にする。
for(const tableKey of Object.keys(Model.constant) as (keyof typeof Model.constant)[])
{
    Model.constant[tableKey] = JsonEvalUpdater.updateJsonWithEval
    (
        Model.constant[tableKey] as unknown as JsonEvalUpdater.Json,
        `$SILENT.${tableKey}`
    ) as unknown as any;
}
