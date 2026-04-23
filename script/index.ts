import * as Url from "./url";
import * as Type from "./type";
import * as JsonEvalUpdater from "./json-eval-updater";
import * as Time from "./time";
import * as UI from "./ui";
import * as Model from "./model";
import * as View from "./view";
import * as Ruler from "./ruler";
import * as Render from "./render";
import * as Command from "./command";
import * as Event from "./event";
import config from "@resource/config.json";
import constantSize from "@resource/constant/size.json";
import constantMass from "@resource/constant/mass.json";
import constantTime from "@resource/constant/time.json";
import constantSpeed from "@resource/constant/speed.json";
import constantTemperature from "@resource/constant/temperature.json";
import constantHistory from "@resource/constant/history.json";
import constantEMWavelength from "@resource/constant/em-wavelength.json";
console.log("🚀 Slide Rule build script");
const constat =
{
    size: constantSize,
    mass: constantMass,
    time: constantTime,
    speed: constantSpeed,
    temperature: constantTemperature,
    history: constantHistory,
    emWavelength: constantEMWavelength,
};
(window as any)["Type"] = Type;
(window as any)["Url"] = Url;
(window as any)["Time"] = Time;
(window as any)["UI"] = UI;
(window as any)["Model"] = Model;
(window as any)["View"] = View;
(window as any)["Event"] = Event;
(window as any)["Ruler"] = Ruler;
(window as any)["Render"] = Render;
(window as any)["config"] = config;
(window as any)["constant"] = constat;
(window as any)["roundE"] = JsonEvalUpdater.roundE;
(window as any)["updateJsonWithEval"] = (json: typeof constat[keyof typeof constat]) =>
    JsonEvalUpdater.saveJson(JsonEvalUpdater.updateJsonWithEval(json as JsonEvalUpdater.Json));
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
Render.markDirty();
