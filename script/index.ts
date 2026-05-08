import * as Locale from "./locale";
import * as Url from "./url";
import * as Number from "./number";
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
import constantSize from "@resource/constant/size.json";
import constantArea from "@resource/constant/area.json";
import constantVolume from "@resource/constant/volume.json";
import constantMass from "@resource/constant/mass.json";
import constantTime from "@resource/constant/time.json";
import constantSpeed from "@resource/constant/speed.json";
import constantEnergy from "@resource/constant/energy.json";
import constantTemperature from "@resource/constant/temperature.json";
import constantCounting from "@resource/constant/counting.json";
import constantSoundFrequency from "@resource/constant/sound-frequency.json";
import constantEmwWavelength from "@resource/constant/emw-wavelength.json";
import constantEmwFrequency from "@resource/constant/emw-frequency.json";
import constantEmwEnergy from "@resource/constant/emw-energy.json";
import constantHistory from "@resource/constant/history.json";
console.log("🚀 Slide Rule build script");
const constant =
{
    size: constantSize,
    area: constantArea,
    volume: constantVolume,
    mass: constantMass,
    time: constantTime,
    speed: constantSpeed,
    energy: constantEnergy,
    temperature: constantTemperature,
    counting: constantCounting,
    soundFrequency: constantSoundFrequency,
    emwWavelength: constantEmwWavelength,
    emwFrequency: constantEmwFrequency,
    emwEnergy: constantEmwEnergy,
    history: constantHistory,
};
const global =
{
    Locale,
    Url,
    Number,
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
    constant,
    nestEvalUpdate: JsonEvalUpdater.nestEvalUpdate,
    soundScaleToFrequency: JsonEvalUpdater.midiNoteToFrequency,
    waveLengthToFrequency: JsonEvalUpdater.waveLengthToFrequency,
    frequencyToWaveLength: JsonEvalUpdater.frequencyToWaveLength,
    roundE: JsonEvalUpdater.roundE,
    updateJsonWithEval: (json: typeof constant[keyof typeof constant]) =>
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
