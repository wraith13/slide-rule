import * as Locale from "./locale";
import * as Calculation from "./calculation";
import * as Type from "./type";
import * as Url from "./url";
import * as Theme from "./theme";
import * as Comparer from "./comparer";
// import * as JsonEvalUpdater from "./json-eval-updater";
import config from "@resource/config.json";
import digitSI from "@resource/digit/$si.json";
import digitEN from "@resource/digit/en.json";
import digitJA from "@resource/digit/ja.json";
import angleSin from "@resource/angle/sin.json";
import angleCos from "@resource/angle/cos.json";
import angleTan from "@resource/angle/tan.json";
import angleSec from "@resource/angle/sec.json";
import angleCsc from "@resource/angle/csc.json";
import angleCot from "@resource/angle/cot.json";
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
export const digit =
{
    "si": digitSI as unknown as Type.DigitTable,
    "en": digitEN as unknown as Type.DigitTable,
    "ja": digitJA as unknown as Type.DigitTable,
};
export type DigitTableKey = keyof typeof digit;
export const getDigitTable = (name: DigitTableKey): Type.DigitTable =>
    digit[name] as Type.DigitTable;
export const constant =
{
    "size": constantSize,
    "area": constantArea,
    "volume": constantVolume,
    "mass": constantMass,
    "time": constantTime,
    "speed": constantSpeed,
    "energy": constantEnergy,
    "temperature": constantTemperature,
    "counting": constantCounting,
    "sound-frequency": constantSoundFrequency,
    "emw-wavelength": constantEmwWavelength,
    "emw-frequency": constantEmwFrequency,
    "emw-energy": constantEmwEnergy,
    "history": constantHistory,
};
export type ConstantTableKey = keyof typeof constant;
export const getConstantTable = (name: ConstantTableKey): Type.ConstantTable =>
    constant[name] as Type.ConstantTable;
export const data: Type.Model =
{
    slides: [],
    cursor: 0,
    offset: { x: 0, y: 0, },
};
export const ticksCache: number[][] = [];
// export type ValueWithBasePosition = { value: number; basePosition: number; };
// export type ExValue = number | ValueWithBasePosition;
export const RootSlideIndex = 0;
export const RootLaneIndex = 0;
export const getAllLaneCount = (): number =>
    data.slides.reduce((count, slide) => count +slide.lanes.length, 0);
export const getAllLanes = (): Type.Lane[] =>
    data.slides.reduce((allLanes, slide) => allLanes.concat(slide.lanes), [] as Type.Lane[]);
export const isInvertedLane = (lane: Type.Lane): boolean =>
{
    let result = false;
    const slide = getSlideFromLane(lane);
    // for(const i of slide.lanes)
    // {
    //     switch(i.type)
    //     {
    //     case "invert":
    //         result = ! result;
    //         break;
    //     }
    //     if (i === lane)
    //     {
    //         break;
    //     }
    // }
    if ("invert" === slide.lanes[0].type)
    {
        result = ! result;
    }
    if (lane !== slide.lanes[0])
    {
        switch(lane.type)
        {
        case "invert":
            result = ! result;
            break;
        case "arccosine":
        case "arccosecant":
        case "arccotangent":
            result = ! result;
            break;
        }
    }
    return result;
};
export const isInvertedSlide = (slide: Type.SlideUnit): boolean =>
    isInvertedLane(slide.lanes[0]);
export const getSlidePosition = (slide: Type.SlideUnit, position: number): number =>
    isInvertedSlide(slide) ? 1 /position: position;
export const getPrimaryPeriod360 = (lane: Type.Lane): number | undefined =>
{
    switch(lane.type)
    {
    case "sine":
        return 360;
    case "cosine":
        return 360;
    case "tangent":
        return 180;
    case "secant":
        return 360;
    case "cosecant":
        return 360;
    case "cotangent":
        return 180;
    default:
        return undefined;
    }
};
export const getPrimaryPeriod = (lane: Type.Lane): number | undefined =>
{
    const period360 = getPrimaryPeriod360(lane);
    if ("number" === typeof period360)
    {
        return (period360 /180) *Math.PI;
    }
    else
    {
        return undefined;
    }
};
export const isPeriodicLane = (lane: Type.Lane): boolean =>
{
    return undefined !== getPrimaryPeriod(lane);
    // const slide = getSlideFromLane(lane);
    // for(const i of slide.lanes)
    // {
    //     if (undefined !== getPrimaryPeriod(i))
    //     {
    //         return true;
    //     }
    //     if (i === lane)
    //     {
    //         break;
    //     }
    // }
    // return false;
};
export const isOscillatingLane = (lane: Type.Lane): boolean =>
{
    // logarithmic、特殊な機能を持つ prime 系、データセット系のいずれか以外で designRegularTicks 
    // では対応できない次の特徴を持つレーンの判定。具体的には次の特徴のいずれか１つ以上を持つレーンだが、
    // 現状では三角関数である事と同義。
    //
    // - 入力値の値域によっては NaN になる
    // - 周期を持つ -> 周期を持たない ( 三角関数は PeriodicLane として扱い処理するので除外する )
    // - 0 以下の値を持つ
    // - 極小値あるいは極大値で、0 や 1 以外の値に収束する( 例えば Math.pi /2 の様な値に収束されると designRegularTicks では 1 から Math.pi /2 までの処理が正常に行えない。 )
    //
    // なお、周期を持つレーンに関しては designPeriodicTicks で対応し、 designOscillatingTicks でもその前提は三角関数の範囲であり、
    // 不規則的に振動する様なレーンには対応できない。
    switch(lane.type)
    {
    // 三角関数は PeriodicLane として扱い処理するので除外する
    // case "sine":
    // case "cosine":
    // case "tangent":
    // case "secant":
    // case "cosecant":
    // case "cotangent":
    case "arcsine":
    case "arccosine":
    case "arctangent":
    case "arcsecant":
    case "arccosecant":
    case "arccotangent":
        return true;
    default:
        return false;
    }
};
export const isDiscreteLane = (lane: Type.Lane): boolean =>
{
    switch(lane.type)
    {
    case "digit":
    case "constant":
    case "prime":
    case "prime-decomposition":
        return true;
    default:
        return false;
    }
};
// export const getPrimaryAmplitude = (lane: Type.Lane): number =>
// {
//     switch(lane.type)
//     {
//     case "sine":
//     case "cosine":
//         return 1;
//     case "tangent":
//     case "cotangent":
//         return 1;
//     default:
//         return 0;
//     }
// };
export const getSlidePositionAt = (slide: Type.SlideUnit, value: Type.ExValue, view: Type.View): number =>
{
    const slideOffset = getSlideOffset(slide, view);
    if (Type.isValueWithPosition(value))
    {
        // return Math.log(value.position) *Type.getViewScale(view) +slideOffset;
        return Math.log(value.value) *Type.getViewScale(view) +slideOffset;
    }
    else
    {
        const valueWithBasePosition = typeof value === "number" ? { value, basePosition: 0 }: value;
        const basePosition = valueWithBasePosition.basePosition;
        let linearPosition = valueWithBasePosition.value;
        // const slideOffset = getSlideOffset(slide, view);
        return Math.log(basePosition +linearPosition) *Type.getViewScale(view) +slideOffset;
    }
};
export const getPrimaryTick = (lane: Type.Lane): Type.Tick | undefined =>
{
    switch(lane.type)
    {
    case "primary":
        return undefined;
    case "prime":
        return undefined;
    case "prime-decomposition":
        return undefined;
    case "digit":
        return undefined;
    case "constant":
        return undefined;
    case "invert":
        return undefined;
    case "power":
        return undefined;
    case "root":
        return undefined;
    case "exponential":
        return undefined;
    case "logarithmic":
        return undefined;
    case "sine":
        return {
            value: 0,
            type: "long",
            color: "green",
        };
    case "cosine":
        return {
            value: 1,
            type: "long",
            color: "green",
        };
    case "tangent":
        return {
            value: { value: NaN, position: Math.PI /2, },
            label: "±∞",
            type: "long",
            color: "green",
        };
    case "secant":
        return {
            value: 0,
            type: "long",
            color: "green",
        };
    case "cosecant":
        return {
            value: { value: NaN, position: 0, },
            label: "±∞",
            type: "long",
            color: "green",
        };
    case "cotangent":
        return {
            value: { value: NaN, position: 0, },
            label: "±∞",
            type: "long",
            color: "green",
        };
    case "arcsine":
        return {
            value: Math.PI /2,
            label: "π/2",
            type: "long",
            color: "green",
        };
    case "arccosine":
        return undefined;
    case "arctangent":
        return undefined;
    case "arcsecant":
        return undefined;
    case "arccosecant":
        return {
            value: Math.PI /2,
            label: "π/2",
            type: "long",
            color: "green",
        };
    case "arccotangent":
        return undefined;
    default:
        throw new Error(`🦋 FIXME: getPrimaryTick not implemented for lane type: ${lane.type}`);
    }
};
export const getAngleTable = (lane: Type.Lane): Type.AngleTable =>
{
    switch(lane.type)
    {
    case "sine":
        return angleSin;
    case "cosine":
        return angleCos;
    case "tangent":
        return angleTan;
    case "secant":
        return angleSec;
    case "cosecant":
        return angleCsc;
    case "cotangent":
        return angleCot;
    default:
        return { ticks: [], }
    }
};
export const getAngleTick = (lane: Type.Lane, angle: number, position: number): Type.Tick =>
{
    const angle360 = angle %(getPrimaryPeriod360(lane) ?? 360);
    const angleTable = getAngleTable(lane);
    const tick = angleTable.ticks.find(i => angle360 === i.angle);
    const quarter = angleToQuarter(angle360);
    if (undefined !== tick)
    {
        const value = tick.value ?? NaN;
        const result =
        {
            value: { value, quarter, position, },
            label: tick.label,
            type: "long",
            color: Theme.resolve(config.render.ruler.elementaryTickColor),
        };
        // console.log(`getAngleTick: lane: ${lane.type}, angle: ${angle}, position: ${position}, angleTick: ${JSON.stringify(result)}`);
        const primaryValueAt = getPrimaryValueAt(lane, (angle360 /180) *Math.PI);
        if (! Calculation.isNearlyEqual(result.value.value, primaryValueAt))
        {
            console.error(`🦋 FIXME: lane: ${lane.type}, angle: ${angle}, position: ${position}, angleTick: ${JSON.stringify(result)}, primaryValueAt: ${primaryValueAt}`);
        }
        return result as Type.Tick;
    }
    else
    {
        const value = getPrimaryValueAt(lane, (angle360 /180) *Math.PI);
        const result: Type.Tick =
        {
            value: { value, quarter, position, },
            type: "long",
        };
        console.error(`🦋 FIXME: lane: ${lane.type}, angle: ${angle}, position: ${position}, angleTick: ${JSON.stringify(result)}`);
        return result;
    }
};
export const getWidthValueRatioFromAngleTicks = (view: Type.View, angle1: { value: number, position: number }, angle2: { value: number, position: number }): number =>
{
    if (isNaN(angle1.value) || isNaN(angle2.value))
    {
        return 1;
    }
    else
    {
        const width = (Math.log(angle2.position) -Math.log(angle1.position)) *Type.getViewScale(view);
        const valueDiff = angle2.value -angle1.value;
        return Math.abs(width / valueDiff);
    }
};
export const getMinValue = (lane: Type.Lane): number =>
{
    switch(lane.type)
    {
    case "primary":
    case "prime":
    case "prime-decomposition":
    case "digit":
    case "constant":
        return Calculation.MIN_VALUE;
    case "invert":
        return Calculation.MIN_VALUE;
    case "power":
        return Calculation.MIN_VALUE;
    case "root":
        return Calculation.MIN_VALUE;
    case "exponential":
        return config.model.exponentialNumber.calculateLowerLimit;
    case "logarithmic":
        return -Calculation.MAX_VALUE;
    case "sine":
        return -1;
    case "cosine":
        return -1;
    case "tangent":
        return -Calculation.MAX_VALUE;
    case "secant":
        return config.model.exponentialNumber.calculateLowerLimit;
    case "cosecant":
        return -Calculation.MIN_VALUE;
    case "cotangent":
        return -Calculation.MIN_VALUE;
    case "arcsine":
        return 0;
    case "arccosine":
        return 0;
    case "arctangent":
        return 0;
    case "arcsecant":
        return 0;
    case "arccosecant":
        return 0;
    case "arccotangent":
        return 0;
    default:
        throw new Error(`🦋 FIXME: getMinValue not implemented for lane type: ${lane.type}`);
    }
};
export const getMaxValue = (lane: Type.Lane): number =>
{
    switch(lane.type)
    {
    case "primary":
    case "prime":
    case "prime-decomposition":
    case "digit":
    case "constant":
        return Calculation.MAX_VALUE;
    case "invert":
        return Calculation.MAX_VALUE;
    case "power":
        return Calculation.MAX_VALUE;
    case "root":
        return Calculation.MAX_VALUE;
    case "exponential":
        return Calculation.MAX_VALUE;
    case "logarithmic":
        return Calculation.MAX_VALUE;
    case "sine":
        return 1;
    case "cosine":
        return 1;
    case "tangent":
        return Calculation.MAX_VALUE;
    case "secant":
        return Calculation.MAX_VALUE;
    case "cosecant":
        return Calculation.MAX_VALUE;
    case "cotangent":
        return Calculation.MAX_VALUE;
    case "arcsine":
        return Math.PI /2;
    case "arccosine":
        return Math.PI /2;
    case "arctangent":
        return Math.PI /2;
    case "arcsecant":
        return Math.PI /2;
    case "arccosecant":
        return Math.PI /2;
    case "arccotangent":
        return Math.PI /2;
    default:
        throw new Error(`🦋 FIXME: getMaxValue not implemented for lane type: ${lane.type}`);
    }
};
export const getPrimaryValueAt = (lane: Type.Lane, position: number): number =>
{
    switch(lane.type)
    {
    case "primary":
    case "prime":
    case "prime-decomposition":
    case "digit":
    case "constant":
        return Calculation.clamp(position);
    case "invert":
        return Calculation.clamp(1 /position);
    case "power":
        return Calculation.clamp(Math.pow(position, lane.exponent ?? 1));
    case "root":
        return Calculation.clamp(Math.pow(position, 1 / (lane.exponent ?? 1)));
    case "exponential":
        return Math.min(Calculation.MAX_VALUE, Math.max(getMinValue(lane), "e" === lane.base ? Math.exp(position): Math.pow(lane.base ?? Math.E, position)));
    case "logarithmic":
        return "e" === lane.base ? Math.log(position): Math.log(position) /Math.log(lane.base ?? Math.E);
    case "sine":
        return Math.sin(position);
    case "cosine":
        return Math.cos(position);
    case "tangent":
        return Math.tan(position);
    case "secant":
        return Calculation.sec(position);
    case "cosecant":
        return Calculation.csc(position);
    case "cotangent":
        return Calculation.cot(position);
    case "arcsine":
        return Math.asin(position);
    case "arccosine":
        return Math.acos(position);
    case "arctangent":
        return Math.atan(position);
    case "arcsecant":
        return Calculation.asec(position);
    case "arccosecant":
        return Calculation.acsc(position);
    case "arccotangent":
        return Calculation.acot(position);
    default:
        throw new Error(`🦋 FIXME: getPrimaryValueAt not implemented for lane type: ${lane.type}`);
    }
};
export const getPrimaryPositionAt = (lane: Type.Lane, value: number, quarter?: number): number =>
{
    switch(lane.type)
    {
    case "primary":
    case "prime":
    case "prime-decomposition":
    case "digit":
    case "constant":
        return value;
    case "invert":
        return 1 /value;
    case "power":
        return Math.pow(value, 1 / (lane.exponent ?? 1));
    case "root":
        return Math.pow(value, lane.exponent ?? 1);
    case "exponential":
        return "e" === lane.base ? Math.log(value): Math.log(value) /Math.log(lane.base ?? Math.E);
    case "logarithmic":
        return "e" === lane.base ? Math.exp(value): Math.pow(lane.base ?? Math.E, value);
    case "sine":
        switch(quarter)
        {
        case 0:
            return Math.asin(value);
        case 1:
            return Math.PI -Math.asin(value);
        case 2:
            return Math.PI -Math.asin(value);
        case 3:
            return 2 *Math.PI +Math.asin(value);
        default:
            throw new Error(`🦋 FIXME: getPrimaryPositionAt: invalid quarter value: ${quarter}, lane type: ${lane.type}`);
        }
    case "cosine":
        switch(quarter)
        {
        case 0:
            return Math.acos(value);
        case 1:
            return Math.acos(value);
        case 2:
            return 2 *Math.PI -Math.acos(value);
        case 3:
            return 2 *Math.PI -Math.acos(value);
        default:
            throw new Error(`🦋 FIXME: getPrimaryPositionAt: invalid quarter value: ${quarter}, lane type: ${lane.type}`);
        }
    case "tangent":
        switch(quarter)
        {
        case 0:
            if (Calculation.isRegularNumber(value))
            {
                return Math.atan(value);
            }
            else
            {
                return 0.5 *Math.PI;
            }
        case 1:
            if (Calculation.isRegularNumber(value))
            {
                return Math.PI +Math.atan(value);
            }
            else
            {
                return 0.5 *Math.PI;
            }
        case 2:
            if (Calculation.isRegularNumber(value))
            {
                return Math.PI +Math.atan(value);
            }
            else
            {
                return 1.5 *Math.PI;
            }
        case 3:
            if (Calculation.isRegularNumber(value))
            {
                return 2 *Math.PI +Math.atan(value);
            }
            else
            {
                return 1.5 *Math.PI;
            }
        default:
            throw new Error(`🦋 FIXME: getPrimaryPositionAt: invalid quarter value: ${quarter}, lane type: ${lane.type}`);
        }
    case "secant":
        switch(quarter)
        {
        case 0:
            if (Calculation.isRegularNumber(value))
            {
                return Calculation.asec(value);
            }
            else
            {
                return 0.5 *Math.PI;
            }
        case 1:
            if (Calculation.isRegularNumber(value))
            {
                return Calculation.asec(value);
            }
            else
            {
                return 0.5 *Math.PI;
            }
        case 2:
            if (Calculation.isRegularNumber(value))
            {
                return 2 *Math.PI -Calculation.asec(value);
            }
            else
            {
                return 1.5 *Math.PI;
            }
        case 3:
            if (Calculation.isRegularNumber(value))
            {
                return 2 *Math.PI -Calculation.asec(value);
            }
            else
            {
                return 1.5 *Math.PI;
            }
        default:
            throw new Error(`🦋 FIXME: getPrimaryPositionAt: invalid quarter value: ${quarter}, lane type: ${lane.type}`);
        }
    case "cosecant":
        switch(quarter)
        {
        case 0:
            if (Calculation.isRegularNumber(value))
            {
                return Calculation.acsc(value);
            }
            else
            {
                return 0;
            }
        case 1:
            if (Calculation.isRegularNumber(value))
            {
                return Math.PI -Calculation.acsc(value);
            }
            else
            {
                return Math.PI;
            }
        case 2:
            if (Calculation.isRegularNumber(value))
            {
                return Math.PI -Calculation.acsc(value);
            }
            else
            {
                return Math.PI;
            }
        case 3:
            if (Calculation.isRegularNumber(value))
            {
                return 2 *Math.PI +Calculation.acsc(value);
            }
            else
            {
                return 2 *Math.PI;
            }
        default:
            throw new Error(`🦋 FIXME: getPrimaryPositionAt: invalid quarter value: ${quarter}, lane type: ${lane.type}`);
        }
    case "cotangent":
        switch(quarter)
        {
        case 0:
            if (Calculation.isRegularNumber(value))
            {
                return Calculation.acot(value);
            }
            else
            {
                return 0;
            }
        case 1:
            if (Calculation.isRegularNumber(value))
            {
                return Calculation.acot(value);
            }
            else
            {
                return Math.PI;
            }
        case 2:
            if (Calculation.isRegularNumber(value))
            {
                return Math.PI +Calculation.acot(value);
            }
            else
            {
                return Math.PI;
            }
        case 3:
            if (Calculation.isRegularNumber(value))
            {
                return Math.PI -Calculation.acot(value);
            }
            else
            {
                return 2 *Math.PI;
            }
        default:
            throw new Error(`🦋 FIXME: getPrimaryPositionAt: invalid quarter value: ${quarter}, lane type: ${lane.type}`);
        }
    case "arcsine":
        if (0 <= value && value <= Math.PI /2)
        {
            return Math.sin(value);
        }
        else
        {
            return NaN;
        }
    case "arccosine":
        if (0 <= value && value <= Math.PI /2)
        {
            return Math.cos(value);
        }
        else
        {
            return NaN;
        }
    case "arctangent":
        if (0 <= value && value <= Math.PI /2)
        {
            return Math.tan(value);
        }
        else
        {
            return NaN;
        }
    case "arcsecant":
        if (0 <= value && value <= Math.PI /2)
        {
            return Calculation.sec(value);
        }
        else
        {
            return NaN;
        }
    case "arccosecant":
        if (0 <= value && value <= Math.PI /2)
        {
            return Calculation.csc(value);
        }
        else
        {
            return NaN;
        }
    case "arccotangent":
        if (0 <= value && value <= Math.PI /2)
        {
            return Calculation.cot(value);
        }
        else
        {
            return NaN;
        }
    default:
        throw new Error(`🦋 FIXME: getPrimaryPositionAt not implemented for lane type: ${lane.type}`);
    }
};
export const angleToQuarter = (angle: number): number =>
    Math.floor(angle /90) %4;
export const getRawValueAt = (slide: Type.SlideUnit, lane: Type.Lane, rawPosition: number): Type.ValueWithPosition | undefined =>
{
    try
    {
        let value = rawPosition;
        if (lane !== slide.lanes[0])
        {
            // value = Calculation.clamp(getPrimaryValueAt(slide.lanes[0], value));
            value = getPrimaryValueAt(slide.lanes[0], value);
        }
        // const period = getPrimaryPeriod(lane);
        // if (undefined !== period)
        // {
        //     basePosition += Math.floor(value / period) *period;
        // }
        // value = Calculation.clamp(getPrimaryValueAt(lane, value));
        value = getPrimaryValueAt(lane, value);
        return value ? { value, position: rawPosition, }: undefined;
    }
    catch(error)
    {
        console.error(`Error in getValueAt: ${error}`);
        return undefined;
    }
};
export const getValueAt = (slide: Type.SlideUnit, lane: Type.Lane, position: number, view: Type.View): Type.ValueWithPosition | undefined =>
{
    try
    {
        const viewScale = Type.getViewScale(view);
        // const offset = getSlideOffset(slide, view);
        // const rawPosition = Math.exp((position -offset) /viewScale);
        const rawPosition = Math.exp((position  -getSlideOffset(slide, view)) /viewScale);
        return getRawValueAt(slide, lane, rawPosition);
    }
    catch(error)
    {
        console.error(`Error in getValueAt: ${error}`);
        return undefined;
    }
};
export const getLinearPositionAt = (slide: Type.SlideUnit, lane: Type.Lane, value: Type.ExValue): number =>
{
    if (Type.isValueWithPosition(value))
    {
        return value.position;
    }
    else
    {
        const valueWithBasePosition = typeof value === "number" ? { value, basePosition: 0, quarter: 0 }: value;
        const basePosition = valueWithBasePosition.basePosition;
        const quarter = valueWithBasePosition.quarter;
        let linearPosition = valueWithBasePosition.value;
        // const slide = getSlideFromLane(lane);
        // for(const i of slide.lanes)
        // {
        //     linearPosition = Number.clamp(getPrimaryPositionAt(i, linearPosition));
        //     if (i === lane)
        //     {
        //         break;
        //     }
        // }
        linearPosition = basePosition +Calculation.clamp(getPrimaryPositionAt(lane, linearPosition, quarter));
        if (lane !== slide.lanes[0])
        {
            linearPosition = Calculation.clamp(getPrimaryPositionAt(slide.lanes[0], linearPosition, quarter));
        }
        return linearPosition;
    }
};
export const linearPositionToLogPosition = (linearPosition: number, view: Type.View): number =>
    Math.log(linearPosition) *Type.getViewScale(view);
export const logPositionToLinearPosition = (logPosition: number, view: Type.View): number =>
    Math.exp(logPosition /Type.getViewScale(view));
export const getRawViewPositionAt = (slide: Type.SlideUnit, lane: Type.Lane, value: Type.ExValue, view: Type.View): number =>
    linearPositionToLogPosition(getLinearPositionAt(slide, lane, value), view);
export const getAnchorSlideAndLane = (slide: Type.SlideUnit): { anchorSlide?: Type.SlideUnit, anchorLane?: Type.Lane, } =>
{
    const slideIndex = getSlideIndex(slide);
    if (slideIndex <= RootSlideIndex)
    {
        return { anchorSlide: undefined, anchorLane: undefined };
    }
    else
    {
        const anchorSlide = data.slides[slideIndex -1];
        //const anchorLane = anchorSlide.lanes[anchorSlide.lanes.length -1];
        const anchorLane = anchorSlide.lanes[0];
        return { anchorSlide, anchorLane: anchorLane };
    }
};
export const getSlideOffset = (slide: Type.SlideUnit, view: Type.View): number =>
{
    const { anchorSlide, anchorLane } = getAnchorSlideAndLane(slide);
    if (undefined === anchorSlide || undefined === anchorLane)
    {
        // return slide.anchor;
        return data.offset.y;
    }
    else
    {
        return getPositionAt(anchorSlide, anchorLane, slide.anchor, view);
    }
};
export const getPositionAt = (slide: Type.SlideUnit, lane: Type.Lane, value: Type.ExValue, view: Type.View): number =>
    getRawViewPositionAt(slide, lane, value, view) +getSlideOffset(slide, view);
export const getWidth = (slide: Type.SlideUnit, lane: Type.Lane, bottom: Type.ExValue, top: Type.ExValue, view: Type.View, isInverted: boolean | "auto" = false): number =>
{
    const a = getRawViewPositionAt(slide, lane, top, view);
    const b = getRawViewPositionAt(slide, lane, bottom, view);
    const width = a -b;
    return "auto" === isInverted ?
        Math.abs(width):
        ( ! isInverted) ? width: -width;
};
export const getConvenientWidth = (slide: Type.SlideUnit, lane: Type.Lane, bottom: number, top: number, view: Type.View, isInverted: boolean | "auto" = false): number =>
{
    let ap = top;
    let bp = bottom;
    let a = getRawViewPositionAt(slide, lane, top, view);
    let b = getRawViewPositionAt(slide, lane, bottom, view);
    if (isNaN(a) && isNaN(b))
    {
        return NaN;
    }
    if (isNaN(a))
    {
        ap = ( ! isInverted) ? getMinValue(lane): getMaxValue(lane);
        a = getRawViewPositionAt(slide, lane, ap, view);
    }
    if (isNaN(b))
    {
        bp = ( ! isInverted) ? getMaxValue(lane): getMinValue(lane);
        b = getRawViewPositionAt(slide, lane, bp, view);
    }
    const rete = (top -bottom) /(ap -bp);
    const width = (a -b) *rete;
    return "auto" === isInverted ?
        Math.abs(width):
        ( ! isInverted) ? width: -width;
};
export const getSnapReferenceLaneIndex = (slide: Type.SlideUnit): number =>
{
    const slideIndex = getSlideIndex(slide);
    if (0 <= slideIndex)
    {
        const previousSlide = data.slides[slideIndex -1];
        if (0 < previousSlide.lanes.length)
        {
            return getLaneIndex(previousSlide.lanes[previousSlide.lanes.length -1]);
        }
        else
        {
            throw new Error(`🦋 FIXME: getSnapReferenceLaneIndex: previous slide has no lanes`);
        }
    }
    else
    {
        throw new Error(`🦋 FIXME: getSnapReferenceLaneIndex: slide index out of range: ${slideIndex}`);
    }
};
// 🔥 Periodic レーン対応の為に、ValueTickWindow(旧TickWindow) から PositionTickWindow に全面移行する。
// ( Periodic になると position から value は取得できるが value から position は取得できなくなるため )
// getPositionAt() もどうにか Periodic 対応しないとあかんのだけど、どうすりゃいいんだ、これ？？？ ->　position を linear postion と view position (現position)に分けて base linear position をモテば良いのでは？
export type PositionTickWindow = { topPosition: number; bottomPosition: number; };
export type ValueTickWindow = { topValue: Type.ExValue; bottomValue: Type.ExValue; };
export type TickWindow = PositionTickWindow | ValueTickWindow;
export const PositionTickWindowToValueTickWindow = (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, positionTickWindow: PositionTickWindow): ValueTickWindow =>
{
    const isInverted = isInvertedLane(lane);
    let topValue = getValueAt(slide, lane, positionTickWindow.topPosition, view) ??
        ( ! isInverted ? getMinValue(lane): getMaxValue(lane));
    let bottomValue = getValueAt(slide, lane, positionTickWindow.bottomPosition, view) ??
        ( ! isInverted ? getMaxValue(lane): getMinValue(lane));
    return { topValue, bottomValue };
};
export const ValueTickWindowToPositionTickWindow = (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, valueTickWindow: ValueTickWindow): PositionTickWindow =>
{
    const isInverted = isInvertedLane(lane);
    const topPosition = getPositionAt(slide, lane, Type.getExValueNumber(valueTickWindow.topValue), view) ??
        ( ! isInverted ? Calculation.MIN_VALUE: Calculation.MAX_VALUE);
    const bottomPosition = getPositionAt(slide, lane, Type.getExValueNumber(valueTickWindow.bottomValue), view) ??
        ( ! isInverted ? Calculation.MAX_VALUE: Calculation.MIN_VALUE);
    return { topPosition, bottomPosition };
};
export const makePositionTickWindowFromWindow = (): PositionTickWindow =>
({
    topPosition: 0,
    bottomPosition: window.innerHeight
});
export const makePositionTickWindowFromPositionAndWidth = (position: number, width: number): PositionTickWindow =>
({
    topPosition: position -(width /2),
    bottomPosition: position +(width /2)
});
export const getLongTickSpaceWidth = (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, ticks: Type.Tick[], value: number) =>
{
    let tick: Type.Tick | undefined;
    let width = Infinity;
    const position = getPositionAt(slide, lane, value, view);
    for(const i of ticks.filter(i => "long" === i.type))
    {
        const tickPosition = getPositionAt(slide, lane, i.value, view);
        const spaceWidth = Math.abs(position - tickPosition);
        if (spaceWidth < width)
        {
            tick = i;
            width = spaceWidth;
        }
    }
    return { tick, width };
};
export const designTickType = (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, ticks: Type.Tick[], value: number): Type.TickType =>
{
    const tickThreshold = config.render.ruler.tickDensityThreshold_5;
    const width = getLongTickSpaceWidth(slide, lane, view, ticks, value).width;
    switch(true)
    {
    case tickThreshold <= width:
        return "long";
    case tickThreshold <= width *2:
        return "medium";
    case tickThreshold <= width *4:
        return "short";
    case tickThreshold <= width *8:
        return "mini";
    default:
        return "none";
    }
};
export const designLogarithmicTicks10 = (view: Type.View, slide: Type.SlideUnit, lane: Type.Lane, base: number, unit: number, parent: { index: number, width: number }, tickWindow: ValueTickWindow, ticks: Type.Tick[]): Type.Tick[] =>
{
    const { topValue, bottomValue } = tickWindow;
    // const ticks: Type.Tick[] = [];
    const isInverted = isInvertedLane(lane);
    const lowValue = Calculation.nanToNull(Type.getExValueNumber( ! isInverted ? topValue: bottomValue)) ?? getMinValue(lane);
    const highValue = Calculation.nanToNull(Type.getExValueNumber( ! isInverted ? bottomValue: topValue)) ?? getMaxValue(lane);
    const unitDigt = Math.floor(Math.log10(unit));
    for(let b = 0; b <= 9; ++b)
    {
        const value = Calculation.roundE(base + (unit *b), unitDigt -3);
        const nextValue = Calculation.roundE(base + (unit *(b +1)), unitDigt -3);
        if (lowValue < Calculation.minMax(nextValue))
        {
            if (value <= highValue)
            {
                const width = getWidth(slide, lane, value, nextValue, view, isInverted);
                if (0 < b)
                {
                    switch(true)
                    {
                    case config.render.ruler.tickDensityThreshold_10 <= width:
                        ticks.push({ value, type: "long", });
                        break;
                    case base <= 0 && 0 === parent.index && 1 === b:
                        ticks.push({ value, type: "long", });
                        break;
                    case 5 === b:
                        ticks.push({ value, type: "medium", isShowLabel: config.render.ruler.tickDensityThreshold_5 *0.3 <= width, });
                        break;
                    default:
                        ticks.push({ value, type: "short", isShowLabel: config.render.ruler.tickDensityThreshold_5 *0.9 <= width, });
                        break;
                    }
                }
                if (0 < base || 0 < b)
                {
                    switch(true)
                    {
                    case config.render.ruler.tickDensityThreshold_10 <= width:
                        designLogarithmicTicks10(view, slide, lane, value, unit / 10, { index: b, width }, tickWindow, ticks);
                        break;
                    case config.render.ruler.tickDensityThreshold_5 <= width:
                        ticks.push({ value: value +(unit *0.5), type: "mini", });
                        break;
                    default:
                        break;
                    }
                }
            }
            else
            {
                break;
            }
        }
    }
    return ticks;
};
export const designLinearTicks10 = (view: Type.View, slide: Type.SlideUnit, lane: Type.Lane, base: number, unitDigt: number, tickWindow: ValueTickWindow): Type.Tick[] =>
{
    const { topValue, bottomValue } = tickWindow;
    const ticks: Type.Tick[] = [];
    const isInverted = isInvertedLane(lane);
    const lowValue = Calculation.nanToNull(Type.getExValueNumber( ! isInverted ? topValue: bottomValue)) ?? getMinValue(lane);
    const highValue = Calculation.nanToNull(Type.getExValueNumber( ! isInverted ? bottomValue: topValue)) ?? getMaxValue(lane);
    const unit = Math.pow(10, unitDigt);
    const width = getWidth(slide, lane, base, base + unit, view, isInverted);
    for(let b = 0; b <= 9; ++b)
    {
        const value = Calculation.roundE(base + (unit *b), unitDigt -3);
        const nextValue = Calculation.roundE(base + (unit *(b +1)), unitDigt -3);
        if (lowValue < nextValue)
        {
            if (value <= highValue)
            {
                // const width = getWidth(slide, lane, value, nextValue, view, isInverted);
                if (0 < b)
                {
                    switch(true)
                    {
                    case config.render.ruler.tickDensityThreshold_10 <= width:
                        ticks.push({ value, type: "long" });
                        break;
                    // case base <= 0 && 0 === parent.index && 1 === b:
                    //     ticks.push({ value, type: "long", });
                    //     break;
                    case 5 === b:
                        ticks.push({ value, type: "medium", isShowLabel: config.render.ruler.tickDensityThreshold_5 *0.3 <= width, });
                        break;
                    default:
                        ticks.push({ value, type: "short", isShowLabel: config.render.ruler.tickDensityThreshold_5 *0.9 <= width, });
                        break;
                    }
                }
                switch(true)
                {
                case config.render.ruler.tickDensityThreshold_10 <= width:
                    ticks.push(...designLinearTicks10(view, slide, lane, value, unitDigt -1, tickWindow));
                    break;
                case config.render.ruler.tickDensityThreshold_5 <= width:
                    ticks.push({ value: value +(unit *0.5), type: "mini", });
                    break;
                default:
                    break;
                }
            }
            else
            {
                break;
            }
        }
    }
    return ticks;
};
export const designCurvedTicks10 = (view: Type.View, slide: Type.SlideUnit, lane: Type.Lane, base: number, unitDigt: number, tickWindow: ValueTickWindow): Type.Tick[] =>
{
    const { topValue, bottomValue } = tickWindow;
    const ticks: Type.Tick[] = [];
    const isInverted = isInvertedLane(lane);
    const lowValue = Calculation.nanToNull(Type.getExValueNumber( ! isInverted ? topValue: bottomValue)) ?? getMinValue(lane);
    const highValue = Calculation.nanToNull(Type.getExValueNumber( ! isInverted ? bottomValue: topValue)) ?? getMaxValue(lane);
    const unit = Math.pow(10, unitDigt);
    const primaryTick = getPrimaryTick(lane);
    const primaryTickValue = undefined !== primaryTick ? Type.getExValueNumber(primaryTick.value): undefined;
    for(let b = 0; b <= 9; ++b)
    {
        const value = Calculation.roundE(base + (unit *b), unitDigt -3);
        const nextValue = Calculation.roundE(value +unit, unitDigt -3);
        if (value < nextValue)
        {
            if (lowValue < nextValue)
            {
                if (value <= highValue)
                {
                    const width = undefined !== primaryTickValue ?
                        (getWidth(slide, lane, value, nextValue, view, isInverted) ?? getWidth(slide, lane, value, primaryTickValue, view, "auto")):
                        getConvenientWidth(slide, lane, value, nextValue, view, isInverted);
                    if (0 < b)
                    {
                        switch(true)
                        {
                        case config.render.ruler.tickDensityThreshold_10 <= width:
                            ticks.push({ value, type: "long", });
                            break;
                        // case base <= 0 && 0 === parent.index && 1 === b:
                        //     ticks.push({ value, type: "long", });
                        //     break;
                        // case 5 === b:
                        //     ticks.push({ value, type: "medium", isShowLabel: config.render.ruler.tickDensityThreshold_5 *0.3 <= width, });
                        //     break;
                        // default:
                        //     ticks.push({ value, type: "short", isShowLabel: config.render.ruler.tickDensityThreshold_5 *0.9 <= width, });
                        //     break;
                        case config.render.ruler.tickDensityThreshold_5 <= width:
                            ticks.push
                            ({
                                value,
                                type: "long",
                                // color: Math.abs(Math.log10(value)) %3 === 0 ? undefined: "gray",
                            });
                            break;
                        case config.render.ruler.tickDensityThreshold_E3 <= width:
                            ticks.push
                            ({
                                value,
                                type: 0 === Math.abs(Math.log10(value)) %3 ? "long": "medium",
                            });
                            break;
                        case config.render.ruler.tickDensityThreshold_E9 <= width:
                            if (0 === Math.abs(Math.log10(value)) %3)
                            {
                                ticks.push
                                ({
                                    value,
                                    type: 0 === Math.abs(Math.log10(value)) %9 ? "long": "medium",
                                });
                            }
                            break;
                        case config.render.ruler.tickDensityThreshold_E27 <= width:
                            if (0 === Math.abs(Math.log10(value)) %9)
                            {
                                ticks.push
                                ({
                                    value,
                                    type: 0 === Math.abs(Math.log10(value)) %27 ? "long": "medium",
                                });
                            }
                            break;
                        case config.render.ruler.tickDensityThreshold_E81 <= width:
                            if (0 === Math.abs(Math.log10(value)) %27)
                            {
                                ticks.push
                                ({
                                    value,
                                    type: 0 === Math.abs(Math.log10(value)) %81 ? "long": "medium",
                                });
                            }
                            break;
                        case config.render.ruler.tickDensityThreshold_E243 <= width:
                            if (0 === Math.abs(Math.log10(value)) %81)
                            {
                                ticks.push
                                ({
                                    value,
                                    type: 0 === Math.abs(Math.log10(value)) %243 ? "long": "medium",
                                });
                            }
                            break;
                        default:
                            if (0 === Math.abs(Math.log10(value)))
                            {
                                ticks.push
                                ({
                                    value,
                                    type: "long",
                                });
                            }
                            break;
                        }
                    }
                    switch(true)
                    {
                    case config.render.ruler.tickDensityThreshold_10 <= width:
                        ticks.push(...designCurvedTicks10(view, slide, lane, value, unitDigt -1, tickWindow));
                        break;
                    case config.render.ruler.tickDensityThreshold_5 <= width:
                        ticks.push({ value: Calculation.roundE(value +(unit *0.5), unitDigt -3), type: "medium", });
                        break;
                    default:
                        break;
                    }
                }
                else
                {
                    break;
                }
            }
        }
    }
    return ticks;
};
export const getDigitIndexFromWidth = (width: number): number =>
{
    switch(true)
    {
    case config.render.ruler.tickDensityThreshold_E3 <= width:
        return Math.pow(3, 0);
    case config.render.ruler.tickDensityThreshold_E9 <= width:
        return Math.pow(3, 1);
    case config.render.ruler.tickDensityThreshold_E27 <= width:
        return Math.pow(3, 2);
    case config.render.ruler.tickDensityThreshold_E81 <= width:
        return Math.pow(3, 3);
    case config.render.ruler.tickDensityThreshold_E243 <= width:
        return Math.pow(3, 4);
    default:
        return 0;
    }
}
export const makeTick = (tick: Omit<Type.Tick, "type" | "isShowLabel">, width: number, majorRate: number, b: number, debugColor?: Type.Tick["color"]): Type.Tick =>
{
    let color = debugColor ?? tick.color;
    let type: Type.TickType = "short";
    let isShowLabel: boolean | undefined = undefined;
    const absoluteLog10 = Math.abs(Math.log10(Type.getExValueNumber(tick.value)));
    switch(true)
    {
    // case config.render.ruler.tickDensityThreshold_10 <= width:
    //     type = "long";
    //     break;
    case config.render.ruler.tickDensityThreshold_5 <= width:
        type = "long";
        break;
    case config.render.ruler.tickDensityThreshold_5 <= width *majorRate:
        type = "long";
        color = absoluteLog10 %3 === 0 ? color: (color ?? "gray");
        break;
    case config.render.ruler.tickDensityThreshold_E3 <= width *majorRate && 5 === b:
        type = "medium";
        isShowLabel = config.render.ruler.tickDensityThreshold_5 *0.3 <= width;
        break;
    default:
        if (1 === b)
        {
            const digitIndex = getDigitIndexFromWidth(width *majorRate);
            if (0 < digitIndex)
            {
                if (digitIndex <= 1 || 0 === absoluteLog10 %digitIndex)
                {
                    type = 0 === absoluteLog10 %(digitIndex *3) ? "long": "short";
                }
            }
            else
            {
                if (0 === absoluteLog10)
                {
                    type = "long";
                }
            }
        }
        break;
    }
    const result: Type.Tick =
    {
        ...tick,
        type,
        isShowLabel,
        color,
    };
    return result;
};
export const designAngleTicksRegular10 = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, basePosition: number, startPosition: number, endPosition: number, quarter: number, sign: 1 | -1, base: number, unitDigt: number, widthValueRatio: number): Type.Tick[] =>
{
    // console.log(`🚀 designAngleTicksRegular10: basePosition: ${basePosition}, startPosition: ${startPosition}, endPosition: ${endPosition}, quarter: ${quarter}, sign: ${sign}, base: ${base}, unitDigt: ${unitDigt}, widthValueRatio: ${widthValueRatio}`);
    const result: Type.Tick[] = [];
    const period = Math.PI /12;
    const isInverted = isInvertedLane(lane);
    const startLinearPosition = ! isInverted ? startPosition: getSlidePosition(slide, endPosition);
    const endLinearPosition = ! isInverted ? endPosition: getSlidePosition(slide, startPosition);
    const viewScale = Type.getViewScale(view);
    const startPrimaryTickPosition = linearPositionToLogPosition(Math.floor(startLinearPosition /period) * period, view);
    const endPrimaryTickPosition = linearPositionToLogPosition(Math.ceil(endLinearPosition /period) * period, view);
    const unit = sign *Math.pow(10, unitDigt);
    for(let b = 0; b <= 9; ++b)
    {
        const value = { value: Calculation.roundE(base +(unit *b), unitDigt -3), basePosition, quarter, };
        const nextValue = { value: Calculation.roundE(base +(unit *(b +1)), unitDigt -3), basePosition, quarter, };
        const currentLinearPosition = getLinearPositionAt(slide, lane, value);
        const nextLinearPosition = getLinearPositionAt(slide, lane, nextValue);
        // console.log(`designAngleTicksRegular10: value: ${value.value}, currentLinearPosition: ${currentLinearPosition}, nextLinearPosition: ${nextLinearPosition}, startPosition: ${startPosition}, endPosition: ${endPosition}, startLinearPosition: ${startLinearPosition}, endLinearPosition: ${endLinearPosition}, basePosition: ${basePosition}, quarter: ${quarter}, b: ${b}`);
        if (startLinearPosition < nextLinearPosition || isNaN(nextLinearPosition))
        {
            console.log("designAngleTicksRegular10: startLinearPosition < nextLinearPosition || isNaN(nextLinearPosition)");
            if (currentLinearPosition <= endLinearPosition || (isNaN(currentLinearPosition) && ! isNaN(nextLinearPosition)))
            {
                console.log("designAngleTicksRegular10: currentLinearPosition <= endLinearPosition || (isNaN(currentLinearPosition) && ! isNaN(nextLinearPosition))");
                const majorRate =
                    0 === base && 1 === b ? 3.5:
                    // 0 === base ? 3:
                    // 0 === b ? 1.2:
                    1;
                const currentPosition = Math.log(currentLinearPosition) *viewScale;
                const nextPosition = Math.log(nextLinearPosition) *viewScale;
                const width = Math.min
                (
                    ...[
                        // startPrimaryTickPosition -currentPosition,
                        isNaN(currentPosition) ? widthValueRatio *unit *100: endPrimaryTickPosition -currentPosition,
                        (isNaN(currentPosition) || isNaN(nextPosition)) ? widthValueRatio *unit *100: nextPosition -currentPosition,
                    ]
                    .map(i => Math.abs(i))
                );
                // console.log(`designAngleTicksRegular10: value: ${value.value}, position: ${currentPosition}, nextPosition: ${nextPosition}, viewScale: ${viewScale}, width: ${width}`);
                const tick = makeTick({ value, }, width, majorRate, b);
                if (0 < b)
                {
                    result.push(tick);
                }
                switch(true)
                {
                case config.render.ruler.tickDensityThreshold_10 <= width:
                    // console.log(`🚩 designAngleTicksRegular10: width: ${width} >= ${config.render.ruler.tickDensityThreshold_10}, adding more ticks, value: ${value.value}, unit: ${unit}, unitDigt: ${unitDigt}`);
                    result.push(...designAngleTicksRegular10(slide, view, lane, basePosition, startPosition, endPosition, quarter, sign, value.value, unitDigt -1, widthValueRatio));
                    break;
                case config.render.ruler.tickDensityThreshold_5 <= width:
                    // console.log("🚩 designAngleTicksRegular10: config.render.ruler.tickDensityThreshold_5 <= width");
                    result.push
                    ({
                        value: { value: Calculation.roundE(base + (unit *(b +0.5)), unitDigt -3), basePosition, quarter, },
                        type: Type.getNextTickType(tick.type, "shorter"),
                    });
                    break;
                default:
                    break;
                }
            }
            else
            if ( ! isNaN(currentLinearPosition))
            {
                break;
            }
        }
    }
    const isTargetSpan = (tick: Type.Tick): boolean =>
    {
        const tickPosition = getRawViewPositionAt(slide, lane, tick.value, view);
        return startPrimaryTickPosition < tickPosition && tickPosition < endPrimaryTickPosition;
    };
    return result.filter(isTargetSpan);
};
export const designAngleTicksInverted10 = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, basePosition: number, startPosition: number, endPosition: number, quarter: number, sign: 1 | -1, base: number, unitDigt: number, widthValueRatio: number): Type.Tick[] =>
{
    // console.log(`🚀 designAngleTicksInverted10: basePosition: ${basePosition}, startPosition: ${startPosition}, endPosition: ${endPosition}, quarter: ${quarter}, sign: ${sign}, base: ${base}, unitDigt: ${unitDigt}, widthValueRatio: ${widthValueRatio}`);
    const result: Type.Tick[] = [];
    const period = Math.PI /12;
    const isInverted = isInvertedLane(lane);
    const startLinearPosition = ! isInverted ? startPosition: getSlidePosition(slide, endPosition);
    const endLinearPosition = ! isInverted ? endPosition: getSlidePosition(slide, startPosition);
    const viewScale = Type.getViewScale(view);
    const startPrimaryTickPosition = linearPositionToLogPosition(Math.ceil(startLinearPosition /period) * period, view);
    const endPrimaryTickPosition = linearPositionToLogPosition(Math.floor(endLinearPosition /period) * period, view);
    const unit = sign *Math.pow(10, unitDigt);
    for(let b = 0; b <= 9; ++b)
    {
        const value = { value: Calculation.roundE(base +(unit *b), unitDigt -3), basePosition, quarter, };
        const nextValue = { value: Calculation.roundE(base +(unit *(b +1)), unitDigt -3), basePosition, quarter, };
        const currentLinearPosition = getLinearPositionAt(slide, lane, value);
        const nextLinearPosition = getLinearPositionAt(slide, lane, nextValue);
        // console.log(`designAngleTicksInverted10: value: ${value.value}, currentLinearPosition: ${currentLinearPosition}, nextLinearPosition: ${nextLinearPosition}, startPosition: ${startPosition}, endPosition: ${endPosition}, startLinearPosition: ${startLinearPosition}, endLinearPosition: ${endLinearPosition}, basePosition: ${basePosition}, quarter: ${quarter}, b: ${b}`);
        if (nextLinearPosition < startLinearPosition || isNaN(nextLinearPosition))
        {
            // console.log("designAngleTicksInverted10: nextLinearPosition < startLinearPosition || isNaN(nextLinearPosition)");
            if (endLinearPosition <= currentLinearPosition || (isNaN(currentLinearPosition) && ! isNaN(nextLinearPosition)))
            {
                // console.log("designAngleTicksInverted10: endLinearPosition <= currentLinearPosition || (isNaN(currentLinearPosition) && ! isNaN(nextLinearPosition))");
                const majorRate =
                    0 === base && 1 === b ? 3.5:
                    // 0 === base ? 3:
                    // 0 === b ? 1.2:
                    1;
                const currentPosition = Math.log(currentLinearPosition) *viewScale;
                const nextPosition = Math.log(nextLinearPosition) *viewScale;
                const width = Math.min
                (
                    ...[
                        // startPrimaryTickPosition -currentPosition,
                        isNaN(currentPosition) ? widthValueRatio *unit *100: endPrimaryTickPosition -currentPosition,
                        (isNaN(currentPosition) || isNaN(nextPosition)) ? widthValueRatio *unit *100: nextPosition -currentPosition,
                    ]
                    .map(i => Math.abs(i))
                );
                // console.log(`designAngleTicksInverted10: value: ${value.value}, position: ${currentPosition}, nextPosition: ${nextPosition}, viewScale: ${viewScale}, width: ${width}`);
                const tick = makeTick({ value, }, width, majorRate, b);
                if (0 < b)
                {
                    result.push(tick);
                }
                switch(true)
                {
                case config.render.ruler.tickDensityThreshold_10 <= width:
                    // console.log(`🚩 designAngleTicksInverted10: width: ${width} >= ${config.render.ruler.tickDensityThreshold_10}, adding more ticks, value: ${value.value}, unit: ${unit}, unitDigt: ${unitDigt}`);
                    result.push(...designAngleTicksInverted10(slide, view, lane, basePosition, startPosition, endPosition, quarter, sign, value.value, unitDigt -1, widthValueRatio));
                    break;
                case config.render.ruler.tickDensityThreshold_5 <= width:
                    // console.log("🚩 designAngleTicksInverted10: config.render.ruler.tickDensityThreshold_5 <= width");
                    result.push
                    ({
                        value: { value: Calculation.roundE(base + (unit *(b +0.5)), unitDigt -3), basePosition, quarter, },
                        type: Type.getNextTickType(tick.type, "shorter"),
                    });
                    break;
                default:
                    break;
                }
            }
            else
            if ( ! isNaN(currentLinearPosition))
            {
                break;
            }
        }
    }
    const isTargetSpan = (tick: Type.Tick): boolean =>
    {
        const tickPosition = getRawViewPositionAt(slide, lane, tick.value, view);
        return endPrimaryTickPosition < tickPosition && tickPosition < startPrimaryTickPosition;
    };
    return result.filter(isTargetSpan);
};
export const designAngleTicks10 = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, startPosition: number, endPosition: number, angleBase: number, widthValueRatio: number): Type.Tick[] =>
{
    // console.log(`🚀 designAngleTicks10: startPosition: ${startPosition}, endPosition: ${endPosition}, angleBase: ${angleBase}`);
    const isInverted = isInvertedSlide(slide);
    const period = getPrimaryPeriod(lane)!;
    const basePosition = Math.floor(startPosition /period) * period;
    const angleUnit = 15;
    const positionUnit = (angleUnit /360) *2 *Math.PI;
    const startAngleTick = getAngleTick(lane, angleBase, basePosition);
    const endAngleTick = getAngleTick(lane, (angleBase +angleUnit) %360, basePosition +positionUnit);
    // console.log(`designAngleTicks10: startAngleTick: ${JSON.stringify(startAngleTick)}, endAngleTick: ${JSON.stringify(endAngleTick)}`);
    const startAngleTickRawValue = Type.getExValueNumber(startAngleTick.value);
    const endAngleTickRawValue = Type.getExValueNumber(endAngleTick.value);
    const startAngleTickValue = Calculation.isRegularNumber(startAngleTickRawValue) ? startAngleTickRawValue: (0 <= endAngleTickRawValue ? Calculation.MAX_VALUE: -Calculation.MAX_VALUE);
    const endAngleTickValue = Calculation.isRegularNumber(endAngleTickRawValue) ? endAngleTickRawValue: (0 <= startAngleTickRawValue ? Calculation.MAX_VALUE: -Calculation.MAX_VALUE);
    const isReverse = endAngleTickValue < startAngleTickValue;
    const isMinus = startAngleTickValue < 0 || endAngleTickValue < 0;
    const sign = isMinus ? -1: 1;
    const quarter = angleToQuarter(angleBase);
    const miniPositionStep = config.render.ruler.tickDensityThreshold_5 *0.25;
    const position = logPositionToLinearPosition
    (
        linearPositionToLogPosition
        (
            isMinus === isReverse ?
                endPosition:
                startPosition,
            view
        )
            +miniPositionStep
            *((isMinus === isReverse) === isInverted ? -1: 1),
        view
    );
    const value = Type.getExValueNumber(getRawValueAt(slide, lane, getSlidePosition(slide, position)));
    if (undefined !== value)
    {
        const unitDigt = Math.floor(Math.log10(Math.abs(Type.getExValueNumber(value))));
        const base = 0;
        // console.log(`designAngleTicks10: startAngleTickValue: ${startAngleTickValue}, endAngleTickValue: ${endAngleTickValue}, base: ${base}, unitDigt: ${unitDigt}, isReverse: ${isReverse}, isInverted: ${isInverted}, isMinus: ${isMinus}`);
        if ((isInverted === isReverse) !== isMinus)
        {
            return designAngleTicksRegular10(slide, view, lane, basePosition, startPosition, endPosition, quarter, sign, base, unitDigt, widthValueRatio);
        }
        else
        {
            return designAngleTicksInverted10(slide, view, lane, basePosition, endPosition, startPosition, quarter, sign, base, unitDigt, widthValueRatio);
        }
    }
    return [];
};
export const getMajorRateCore = (maxAngle: number, angle: number): number =>
    Math.min(maxAngle, [360, 180, 90, 30, 15].find(rate => 0 === angle %rate) ?? 1);
export const getMajorRateFromAngle = (maxAngle: number, angle: number, angleUnit: number): number =>
    getMajorRateCore(maxAngle, angle) /getMajorRateCore(maxAngle, angleUnit);
export const designAngleTicks30 = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, base: number, startPosition: number, endPosition: number, angleBase: number): Type.Tick[] =>
{
    const result: Type.Tick[] = [];
    const maxAngle = getPrimaryPeriod360(lane) ?? 360;
    const angleUnit = 15;
    const unit = Math.PI /12;
    let i = Math.max(0, Math.floor((startPosition -base) /unit));
    let position = base + (i * unit);
    while (position < endPosition && i < 2)
    {
        const angle = (angleBase + (i *angleUnit)) %360;
        const majorRate = getMajorRateFromAngle(maxAngle, angle, angleUnit);
        const width = (Math.log(position +unit) -Math.log(position)) *Type.getViewScale(view);
        const angleTick = getAngleTick(lane, angle, position);
        const tick = makeTick
        (
            {
                ...angleTick,
                value:
                {
                    value: Type.getTickValue(angleTick),
                    // position,
                    position: getSlidePosition(slide, position),
                },
                // color: "blue",
            },
            width,
            majorRate,
            i
        );
        // const logPosition = getSlidePosition(slide, linearPositionToLogPosition(position, view));
        const next = i +1;
        const nextAngle = (angleBase + (next *angleUnit)) %360;
        const nextPosition = base + (next * unit);
        const nextAngleTick = getAngleTick(lane, nextAngle, nextPosition);
        // const nextLogPosition = getSlidePosition(slide, linearPositionToLogPosition(nextPosition, view));
        // console.log(`designAngleTicks30: i: ${i}, position: ${position}, angle: ${angle}, width: ${width}, unit: ${unit}`);
        result.push(makeTick(tick, width, majorRate, i));
        switch(true)
        {
        case config.render.ruler.tickDensityThreshold_5 <= width:
            // console.log(`designAngleTicks30: position: ${position}, angle: ${angle}, width: ${width} => 10`);
            console.log(`designAngleTicks30: label: ${angleTick.label ?? "$LABEL"} position: ${position}, angle: ${angle}, width: ${width} => 10`);
            const widthValueRatio = getWidthValueRatioFromAngleTicks
            (
                view,
                {
                    value: Type.getTickValue(angleTick),
                    position: getSlidePosition(slide, position),
                },
                {
                    value: Type.getTickValue(nextAngleTick),
                    position: getSlidePosition(slide, nextPosition),
                }
            );
            result.push
            (
                ...designAngleTicks10(slide, view, lane, Math.max(position, startPosition), Math.min(endPosition, position +unit), angle, widthValueRatio)
                    // .filter
                    // (
                    //     i =>
                    //     {
                    //         const minDifference = 1;
                    //         const tickPosition = getRawViewPositionAt(slide, lane, i.value, view);
                    //         const result =
                    //             (logPosition +minDifference < tickPosition && tickPosition < nextLogPosition -minDifference) ||
                    //             (nextLogPosition +minDifference < tickPosition && tickPosition < logPosition -minDifference);
                    //         return result;
                    //     }
                    // )
            );
            break;
        default:
            break;
        }
        ++i;
        position = base + (i * unit);
    }
    return result;
};
export const designAngleTicks90 = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, base: number, startPosition: number, endPosition: number, angleBase: number): Type.Tick[] =>
{
    const result: Type.Tick[] = [];
    const maxAngle = getPrimaryPeriod360(lane) ?? 360;
    const angleUnit = 30;
    const unit = Math.PI /6;
    let i = Math.max(0, Math.floor((startPosition -base) /unit));
    let position = base + (i * unit);
    while(position < endPosition && i < 3)
    {
        const angle = (angleBase + (i *angleUnit)) %360;
        const majorRate = getMajorRateFromAngle(maxAngle, angle, angleUnit);
        const width = (Math.log(position +unit) -Math.log(position)) *Type.getViewScale(view);
        const angleTick = getAngleTick(lane, angle, position);
        const tick = makeTick
        (
            {
                ...angleTick,
                value:
                {
                    value: Type.getTickValue(angleTick),
                    // position,
                    position: getSlidePosition(slide, position),
                },
                // color: "red",
            },
            width,
            majorRate,
            i
        );
        // console.log(`designAngleTicks90: i: ${i}, position: ${position}, angle: ${angle}, width: ${width}`);
        if (width < config.render.ruler.tickDensityThreshold_5)
        {
            result.push(tick);
        }
        if (config.render.ruler.tickDensityThreshold_5 <= width)
        {
            // console.log(`designAngleTicks90: position: ${position}, angle: ${angle}, width: ${width} => 10`);
            result.push(...designAngleTicks30(slide, view, lane, position, Math.max(position, startPosition), Math.min(endPosition, position +unit), angle));
        }
        else if (config.render.ruler.tickDensityThreshold_5 <= width *majorRate || angleBase === angle)
        {
            // console.log(`designAngleTicks90: label: ${angleTick.label ?? "$LABEL"} position: ${position}, angle: ${angle}, width: ${width} => 5`);
            const angleTick15 = getAngleTick(lane, angle +15, position + (unit /2));
            result.push
            (
                makeTick
                (
                    {
                        ...angleTick15,
                        value:
                        {
                            value: Type.getTickValue(angleTick15),
                            position: getSlidePosition(slide, position + (unit /2)),
                        },
                        // type: Type.getNextTickType(tick.type, "shorter"),
                    },
                    width /2,
                    0.5,
                    1
                )
            );
        }
        ++i;
        position = base + (i * unit);
    }
    return result;
};
export const designAngleTicks360 = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, base: number, lowPosition: number, highPosition: number): Type.Tick[] =>
{
    const result: Type.Tick[] = [];
    const maxAngle = getPrimaryPeriod360(lane) ?? 360;
    const angleUnit = 90;
    const unit = Math.PI /2;
    let i = Math.max(0, Math.floor((lowPosition -base) /unit));
    const end = maxAngle /angleUnit;
    let position = base + (i * unit);
    while(position < highPosition && i < end)
    {
        const angle = (i *angleUnit) %360;
        const majorRate = getMajorRateFromAngle(maxAngle, angle, angleUnit);
        const width = (Math.log(position +unit) -Math.log(position)) *Type.getViewScale(view);
        // const width = Math.abs(Math.log(getSlidePosition(slide, position +unit)) -Math.log(getSlidePosition(slide, position))) *Type.getViewScale(view);
        const angleTick = getAngleTick(lane, angle, position);
        const tick = makeTick
        (
            {
                ...angleTick,
                value:
                {
                    value: Type.getTickValue(angleTick),
                    // position,
                    position: getSlidePosition(slide, position),
                },
                // color: "purple",
            },
            width,
            majorRate,
            9
        );
        // console.log(`designAngleTicks360: i: ${i}, value: ${Type.getTickValue(angleTick)}, position: ${position}, angle: ${angle}, width: ${width}`);
        if (width < config.render.ruler.tickDensityThreshold_5)
        {
            result.push(tick);
        }
        if (config.render.ruler.tickDensityThreshold_5 <= width)
        {
            // console.log(`designAngleTicks360: position: ${position}, angle: ${angle}, width: ${width} => 10`);
            result.push(...designAngleTicks90(slide, view, lane, position, Math.max(position, lowPosition), highPosition, angle));
        }
        // else if (config.render.ruler.tickDensityThreshold_5 <= width *majorRate)
        else if (config.render.ruler.tickDensityThreshold_E3 <= width)
        {
            // console.log(`designAngleTicks360: label: ${angleTick.label ?? "$LABEL"} position: ${position}, angle: ${angle}, width: ${width} => 5`);
            const type = Type.getNextTickType(tick.type, "shorter");
            const angleTick30 = getAngleTick(lane, angle +30, position + (unit /3));
            result.push
            (
                // makeTick
                // (
                    {
                        ...angleTick30,
                        value:
                        {
                            value: Type.getTickValue(angleTick30),
                            position: getSlidePosition(slide, position + (unit /3)),
                        },
                        type,
                        // color: "red",
                    },
                //     width /3,
                //     0.5,
                //     9
                // )
            );
            const angleTick60 = getAngleTick(lane, angle +60, position + (2 *(unit /3)));
            result.push
            (
                // makeTick
                // (
                    {
                        ...angleTick60,
                        value:
                        {
                            value: Type.getTickValue(angleTick60),
                            position: getSlidePosition(slide, position + 2 *(unit /3)),
                        },
                        type,
                        // color: "red",
                    },
                //     width /3,
                //     0.5,
                //     9
                // )
            );
        }
        ++i;
        position = base + (i * unit);
    }
    return result;
};
export const addConstTicks = (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, ticks: Type.Tick[], tickWindow: ValueTickWindow, constTicks: { value: number, label?: string, color?: string }[]): void =>
{
    const { topValue, bottomValue } = tickWindow;
    const lowwerBoundValue = Math.min(Type.getExValueNumber(topValue), Type.getExValueNumber(bottomValue));
    const upperBoundValue = Math.max(Type.getExValueNumber(topValue), Type.getExValueNumber(bottomValue));
    for(const i of constTicks)
    {
        const value = i.value;
        if (lowwerBoundValue <= value && value <= upperBoundValue)
        {
            // const tickThreshold = config.render.ruler.tickDensityThreshold_5;
            const { tick, width, } = getLongTickSpaceWidth(slide, lane, view, ticks, value);
            const label = i.label;
            const color = i.color;
            switch(true)
            {
            // case tickThreshold <= width:
            //     ticks.push({ value, type: "long", color, label });
            //     break;
            // case tickThreshold <= width *2:
            //     ticks.push({ value, type: "medium", color, label });
            //     break;
            // case tickThreshold <= width *4:
            //     ticks.push({ value, type: "short", color, label });
            //     break;
            case 1.25 <= width:
                // ticks.push({ value, type: "mini", color, label });
                ticks.push({ value, type: "long", color, label });
                break;
            default:
                if (tick)
                {
                    tick.behindTickCount = (tick?.behindTickCount ?? 0) +1;
                }
            }
        }
    }
};
export const designLogarithmicTicks = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow): Type.LaneContent =>
{
    const { topValue, bottomValue } = tickWindow;
    const ticks: Type.Tick[] = [];
    const isInverted = isInvertedLane(lane);
    const lowValue = Calculation.nanToNull(Type.getExValueNumber( ! isInverted ? topValue: bottomValue)) ?? getMinValue(lane);
    const highValue = Calculation.nanToNull(Type.getExValueNumber( ! isInverted ? bottomValue: topValue)) ?? getMaxValue(lane);
    const beginDigit = Math.max(Math.floor(Math.log10(lowValue)), -308);
    const endDigit = Math.min(Math.ceil(Math.log10(highValue)), 308);
    const scale = 10;
    for(let digit = beginDigit; digit <= endDigit; ++digit)
    {
        const a = Math.pow(10, digit);
        const width = getWidth(slide, lane, a, a * scale, view, isInverted);
        switch(true)
        {
        case config.render.ruler.tickDensityThreshold_10 <= width:
            designLogarithmicTicks10(view, slide, lane, 0, a, { index: 0, width }, tickWindow, ticks);
            break;
        case config.render.ruler.tickDensityThreshold_5 <= width:
            ticks.push
            ({
                value: a,
                type: "long",
                color: 0 === Math.abs(digit) %3 ? undefined: "gray",
            });
            ticks.push({ value: a *5, type: "medium", });
            break;
        case config.render.ruler.tickDensityThreshold_E3 <= width:
            ticks.push
            ({
                value: a,
                type: 0 === Math.abs(digit) %3 ? "long": "medium",
            });
            break;
        case config.render.ruler.tickDensityThreshold_E9 <= width:
            if (0 === Math.abs(digit) %3)
            {
                ticks.push
                ({
                    value: a,
                    type: 0 === Math.abs(digit) %9 ? "long": "medium",
                });
            }
            break;
        case config.render.ruler.tickDensityThreshold_E27 <= width:
            if (0 === Math.abs(digit) %9)
            {
                ticks.push
                ({
                    value: a,
                    type: 0 === Math.abs(digit) %27 ? "long": "medium",
                });
            }
            break;
        case config.render.ruler.tickDensityThreshold_E81 <= width:
            if (0 === Math.abs(digit) %27)
            {
                ticks.push
                ({
                    value: a,
                    type: 0 === Math.abs(digit) %81 ? "long": "medium",
                });
            }
            break;
        case config.render.ruler.tickDensityThreshold_E243 <= width:
            if (0 === Math.abs(digit) %81)
            {
                ticks.push
                ({
                    value: a,
                    type: 0 === Math.abs(digit) %243 ? "long": "medium",
                });
            }
            break;
        default:
            if (0 === digit)
            {
                ticks.push
                ({
                    value: a,
                    type: "long",
                });
            }
            break;
        }
    }
    addConstTicks
    (
        slide,
        lane,
        view,
        ticks,
        tickWindow,
        Type.namedNumberList
            .map
            (
                namedNumber =>
                ({
                    value: Calculation.getNamedNumberValue(namedNumber),
                    label: Calculation.getNamedNumberLabel(namedNumber),
                    color: Theme.resolve(config.model.constantTable.elementaryNumberColor),
                })
            )
    );
    // console.log(`designed ticks for lane: ${lane.name ?? "unnamed"}, ticks: ${ticks.map(tick => `${tick.value} (${tick.type})`).join(", ")}`);
    // console.log(`min: ${min}, max: ${max}`);
    const result =
    {
        ticks: ticks.filter(tick => lowValue <= Type.getExValueNumber(tick.value) && Type.getExValueNumber(tick.value) <= highValue),
        areas: []
    };
    if (slide.lanes[0] === lane)
    {
        const slideOffset = getSlideOffset(slide, view);
        ticksCache[getSlideIndex(slide)] = ticks
            .filter(tick => "long" === tick.type)
            .map(tick => getRawViewPositionAt(slide, lane, tick.value, view) +slideOffset);
    }
    return result;
};
export const designLinearTicks = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow): Type.LaneContent =>
{
    const { topValue, bottomValue } = tickWindow;
    const ticks: Type.Tick[] = [];
    const isInverted = isInvertedLane(lane);
    const lowValue = Type.getExValueNumber( ! isInverted ? topValue: bottomValue);
    const highValue = Type.getExValueNumber( ! isInverted ? bottomValue: topValue);
    const unit = Calculation.floorTo1Mantissa(highValue -lowValue);
    const unitDigt = Math.round(Math.log10(unit));
    const beginValue = Math.floor(lowValue / unit) * unit;
    const endValue = Math.ceil(highValue / unit) * unit;
    const width = getWidth(slide, lane, lowValue, highValue, view, isInverted);
    if (config.render.ruler.tickDensityThreshold_5 <= width)
    {
        for(let i = beginValue; i <= endValue; i += unit)
        {
            ticks.push({ value: Calculation.roundE(i, unitDigt -3), type: "long", });
            ticks.push(...designLinearTicks10(view, slide, lane, i, unitDigt -1, tickWindow));
        }
    }
    else
    {
        ticks.push({ value: 0, type: "long", });
    }
    addConstTicks
    (
        slide,
        lane,
        view,
        ticks,
        tickWindow,
        Type.namedNumberList
            .map
            (
                namedNumber =>
                ({
                    value: Calculation.getNamedNumberValue(namedNumber),
                    label: Calculation.getNamedNumberLabel(namedNumber),
                    color: Theme.resolve(config.model.constantTable.elementaryNumberColor),
                })
            )
    );
    // console.log(`designed ticks for lane: ${lane.name ?? "unnamed"}, ticks: ${ticks.map(tick => `${tick.value} (${tick.type})`).join(", ")}`);
    // console.log(`min: ${min}, max: ${max}`);
    const result =
    {
        ticks: ticks.filter(tick => lowValue <= Type.getExValueNumber(tick.value) && Type.getExValueNumber(tick.value) <= highValue),
        areas: []
    };
    if (slide.lanes[0] === lane)
    {
        const slideOffset = getSlideOffset(slide, view);
        ticksCache[getSlideIndex(slide)] = ticks
            .filter(tick => "long" === tick.type)
            .map(tick => getRawViewPositionAt(slide, lane, tick.value, view) +slideOffset);
    }
    return result;
};
export const designCurvedTicks = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow): Type.LaneContent =>
{
    const { topValue, bottomValue } = tickWindow;
    const ticks: Type.Tick[] = [];
    const isInverted = isInvertedLane(lane);
    const lowValue = Type.getExValueNumber( ! isInverted ? topValue: bottomValue);
    const highValue = Type.getExValueNumber( ! isInverted ? bottomValue: topValue);
    const unit = Calculation.floorTo1Mantissa(highValue -lowValue);
    const unitDigt = Math.round(Math.log10(unit));
    const beginValue = Math.floor(lowValue / unit) * unit;
    const endValue = Math.ceil(highValue / unit) * unit;
    const primaryTick = getPrimaryTick(lane);
    const primaryTickValue = undefined !== primaryTick ? Type.getExValueNumber(primaryTick.value): undefined;
    if (undefined !== primaryTick && ! isPeriodicLane(lane))
    {
        ticks.push(primaryTick);
    }
    let previousValue = beginValue -unit;
    for(let i = beginValue; i <= endValue; i += unit)
    {
        if (previousValue < i)
        {
            previousValue = i;
            const value = Calculation.roundE(i, unitDigt -3);
            // const width = getConvenientWidth(slide, lane, value, value +unit, view, isInverted);
            const width = undefined !== primaryTickValue ?
                (getWidth(slide, lane, value, value +unit, view, isInverted) ?? getWidth(slide, lane, value, primaryTickValue, view, "auto")):
                getConvenientWidth(slide, lane, value, value +unit, view, isInverted);
            // if (config.render.ruler.tickDensityThreshold_5 <= width)
            // {
            //     ticks.push({ value, type: "long", });
            //     ticks.push(...designCurvedTicks10(view, slide, lane, value, unitDigt -1, tickWindow));
            // }
            // else
            // {
            //     ticks.push({ value, type: "long", });
            // }
            switch(true)
            {
            case config.render.ruler.tickDensityThreshold_10 <= width:
                ticks.push({ value, type: "long", });
                ticks.push(...designCurvedTicks10(view, slide, lane, value, unitDigt -1, tickWindow));
                break;
            case config.render.ruler.tickDensityThreshold_5 <= width:
                ticks.push
                ({
                    value,
                    type: "long",
                    color: Math.abs(Math.log10(value)) %3 === 0 ? undefined: "gray",
                });
                ticks.push({ value: Calculation.roundE(value +(unit *0.5), unitDigt -3), type: "medium", });
                break;
            case config.render.ruler.tickDensityThreshold_E3 <= width:
                ticks.push
                ({
                    value,
                    type: 0 === Math.abs(Math.log10(value)) %3 ? "long": "medium",
                });
                break;
            case config.render.ruler.tickDensityThreshold_E9 <= width:
                if (0 === Math.abs(Math.log10(value)) %3)
                {
                    ticks.push
                    ({
                        value,
                        type: 0 === Math.abs(Math.log10(value)) %9 ? "long": "medium",
                    });
                }
                break;
            case config.render.ruler.tickDensityThreshold_E27 <= width:
                if (0 === Math.abs(Math.log10(value)) %9)
                {
                    ticks.push
                    ({
                        value,
                        type: 0 === Math.abs(Math.log10(value)) %27 ? "long": "medium",
                    });
                }
                break;
            case config.render.ruler.tickDensityThreshold_E81 <= width:
                if (0 === Math.abs(Math.log10(value)) %27)
                {
                    ticks.push
                    ({
                        value,
                        type: 0 === Math.abs(Math.log10(value)) %81 ? "long": "medium",
                    });
                }
                break;
            case config.render.ruler.tickDensityThreshold_E243 <= width:
                if (0 === Math.abs(Math.log10(value)) %81)
                {
                    ticks.push
                    ({
                        value,
                        type: 0 === Math.abs(Math.log10(value)) %243 ? "long": "medium",
                    });
                }
                break;
            default:
                if (0 === Math.abs(Math.log10(value)))
                {
                    ticks.push
                    ({
                        value,
                        type: "long",
                    });
                }
                break;
            }
        }
        else
        {
            // 計算が桁落ちしてるので、ここで break しないと無限ループになる。 / EN: The calculation is suffering from loss of significance, so if we don't break here, it will result in an infinite loop.
            break;
        }
    }
    addConstTicks
    (
        slide,
        lane,
        view,
        ticks,
        tickWindow,
        Type.namedNumberList
            .map
            (
                namedNumber =>
                ({
                    value: Calculation.getNamedNumberValue(namedNumber),
                    label: Calculation.getNamedNumberLabel(namedNumber),
                    color: Theme.resolve(config.model.constantTable.elementaryNumberColor),
                })
            )
    );
    // console.log(`designed ticks for lane: ${lane.name ?? "unnamed"}, ticks: ${ticks.map(tick => `${tick.value} (${tick.type})`).join(", ")}`);
    // console.log(`min: ${min}, max: ${max}`);
    const result =
    {
        ticks: ticks.filter(tick => lowValue <= Type.getExValueNumber(tick.value) && Type.getExValueNumber(tick.value) <= highValue),
        areas: []
    };
    if (slide.lanes[0] === lane)
    {
        const slideOffset = getSlideOffset(slide, view);
        ticksCache[getSlideIndex(slide)] = ticks
            .filter(tick => "long" === tick.type)
            .map(tick => getRawViewPositionAt(slide, lane, tick.value, view) +slideOffset);
    }
    return result;
};
export const designPrimeNumbersTicks = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow): Type.LaneContent =>
{
    const locales = Locale.getLocale();
    const { topValue, bottomValue } = tickWindow;
    const { limit, maxRange } = config.model.primeNumber;
    // const { maxRange } = config.model.primeNumber;
    const ticks: Type.Tick[] = [];
    const areas: Type.Area[] = [];
    const isInverted = isInvertedLane(lane);
    const lowwerBoundValue = Math.min(Type.getExValueNumber(topValue), Type.getExValueNumber(bottomValue));
    const upperBoundValue = Math.max(Type.getExValueNumber(topValue), Type.getExValueNumber(bottomValue));
    const lowerBoundInvertDecimalValue = Math.ceil(1 /Math.min(1, upperBoundValue));
    const upperBoundInvertDecimalValue = Calculation.SafeOr1(Math.min(limit, Math.floor(1 /Math.min(1, lowwerBoundValue))));
    // const upperBoundInvertDecimalValue = Number.SafeOr1(Math.floor(1 /Math.min(1, lowwerBoundValue)));
    const tickTypeThreshold = config.render.ruler.tickDensityThreshold_5;
    if (2 <= upperBoundInvertDecimalValue)
    {
        if (limit <= lowerBoundInvertDecimalValue)
        {
            areas.push
            ({
                lowerBound: undefined,
                upperBound: 1 /lowerBoundInvertDecimalValue,
                fill: "$DENSE"
            });
        }
        else
        {
            if (lowerBoundInvertDecimalValue <= 2)
            {
                const value = 2;
                ticks.push
                ({
                    value: 1 /value,
                    label: `1/${Calculation.groupDigits(`${value}`, locales)}`,
                    type: "long",
                    color: "green"
                });
            }
            const start = Calculation.SafeOr1(Math.max(3, lowerBoundInvertDecimalValue));
            const limitEnd = Math.min(start +maxRange, limit);
            // const limitEnd = start +maxRange;
            for(let value = start; value <= upperBoundInvertDecimalValue; value += 2)
            {
                const width = getWidth(slide, lane, 1 /(value +1), 1 /value, view, isInverted);
                if (width *Math.log(value) < 1 || limitEnd <= value)
                {
                    areas.push
                    ({
                        lowerBound: undefined,
                        upperBound: 1 /Math.min(value, limit),
                        // upperBound: 1 /value,
                        fill: "$DENSE"
                    });
                    break;
                }
                //if (Number.isPrimeNumber(value))
                if (3 === value || (0 !== value %3 && Calculation.isPrimeNumber(value)))
                {
                    ticks.push
                    ({
                        value: 1 /value,
                        label: `1 / ${Calculation.groupDigits(`${value}`, locales)}`,
                        type: tickTypeThreshold <= getLongTickSpaceWidth(slide, lane, view, ticks, 1 /value).width ?
                            "long":
                            "medium",
                        color: "green"
                    });
                }
            }
        }
    }
    const lowwerBoundIntegerValue = Math.max(2, Math.ceil(lowwerBoundValue));
    const upperBoundIntegerValue = Calculation.SafeOr1(Math.min(Math.max(2, Math.floor(upperBoundValue)), limit));
    // const upperBoundIntegerValue = Number.SafeOr1(Math.max(2, Math.floor(upperBoundValue)));
    if (2 <= upperBoundIntegerValue)
    {
        if (limit <= lowwerBoundIntegerValue)
        {
            areas.push
            ({
                lowerBound: Math.max(2, lowwerBoundValue),
                upperBound: undefined,
                fill: "$DENSE"
            });
        }
        else
        {
            if (2 <= lowwerBoundIntegerValue)
            {
                const value = 2;
                ticks.push
                ({
                    value,
                    label: `${Calculation.groupDigits(`${value}`, locales)}`,
                    type: "long",
                    color: "green"
                });
            }
            const start = Calculation.SafeOr1(Math.max(3, lowwerBoundIntegerValue));
            const limitEnd = Math.min(start +maxRange, limit);
            // const limitEnd = start +maxRange;
            for(let value = start; value <= upperBoundIntegerValue; value += 2)
            {
                const width = getWidth(slide, lane, value, value +1, view, isInverted);
                if (width *Math.log(value) < 1 || limitEnd <= value)
                {
                    if (value < upperBoundValue)
                    {
                        areas.push
                        ({
                            lowerBound: Math.min(value, limit),
                            // lowerBound: value,
                            upperBound: undefined,
                            fill: "$DENSE"
                        });
                    }
                    break;
                }
                //if (Number.isPrimeNumber(value))
                if (3 === value || (0 !== value %3 && Calculation.isPrimeNumber(value)))
                {
                    ticks.push
                    ({
                        value,
                        label: `${Calculation.groupDigits(`${value}`, locales)}`,
                        type: tickTypeThreshold <= getLongTickSpaceWidth(slide, lane, view, ticks, value).width ?
                            "long":
                            "medium",
                        color: "green"
                    });
                }
            }
        }
    }
    addConstTicks
    (
        slide,
        lane,
        view,
        ticks,
        tickWindow,
        [
            {
                value: 1 /Calculation.MAX_SAFE_INTEGER,
                label: "1 / max safe integer",
                color: "blue"
            },
            {
                value: 1 /limit,
                label: "1 / calculation limit",
                color: "blue"
            },
            {
                value: limit,
                label: "calculation limit",
                color: "blue"
            },
            {
                value: Calculation.MAX_SAFE_INTEGER,
                label: "max safe integer",
                color: "blue"
            }
        ]
    );
    const result =
    {
        ticks: ticks,
        areas,
    };
    return result;
};
export const factorsToString = (factors: number[], locales?: Calculation.LocalesArgument): string =>
{
    const factorCounts: { [factor: number]: number } = {};
    for(const factor of factors)
    {
        if (undefined === factorCounts[factor])
        {
            factorCounts[factor] = 1;
        }
        else
        {
            factorCounts[factor] += 1;
        }
    }
    const parts: string[] = [];
    for(const factor in factorCounts)
    {
        const count = factorCounts[factor];
        const factorString = Calculation.groupDigits(`${factor}`, locales);
        if (1 < count)
        {
            parts.push(`${factorString}${config.symbols.power}${count}`);
        }
        else
        {
            parts.push(factorString);
        }
    }
    //return parts.join(" × ");
    // return parts.join("\u2009×\u2009");
    return parts.join(`${config.symbols.thinSpace}${config.symbols.multiplication}${config.symbols.thinSpace}`);
};
export const designPrimeDecompositionTicks = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow): Type.LaneContent =>
{
    const locales = Locale.getLocale();
    const { topValue, bottomValue } = tickWindow;
    const { limit, maxRange } = config.model.primeNumber;
    // const { maxRange } = config.model.primeNumber;
    const ticks: Type.Tick[] = [];
    const areas: Type.Area[] = [];
    const isInverted = isInvertedLane(lane);
    const lowwerBoundValue = Math.min(Type.getExValueNumber(topValue), Type.getExValueNumber(bottomValue));
    const upperBoundValue = Math.max(Type.getExValueNumber(topValue), Type.getExValueNumber(bottomValue));
    const lowerBoundInvertDecimalValue = Math.ceil(1 /Math.min(1, upperBoundValue));
    const upperBoundInvertDecimalValue = Math.min(limit, Math.floor(1 /Math.min(1, lowwerBoundValue)));
    const tickTypeThreshold = config.render.ruler.tickDensityThreshold_5 *0.75;
    const type = "long";
    if (2 <= upperBoundInvertDecimalValue)
    {
        if (limit <= lowerBoundInvertDecimalValue)
        {
            areas.push
            ({
                lowerBound: undefined,
                upperBound: 1 /lowerBoundInvertDecimalValue,
                fill: "$DENSE"
            });
        }
        else
        {
            const start = Math.max(2, lowerBoundInvertDecimalValue);
            const limitEnd = Math.min(start +maxRange, limit);
            // const limitEnd = start +maxRange;
            for(let value = start; value <= upperBoundInvertDecimalValue; ++value)
            {
                const width = getWidth(slide, lane, 1 /(value +1), 1 /value, view, isInverted);
                if (width < tickTypeThreshold || limitEnd <= value)
                {
                    areas.push
                    ({
                        lowerBound: undefined,
                        upperBound: 1 /Math.min(value, limit),
                        // upperBound: 1 /value,
                        fill: "$DENSE"
                    });
                    break;
                }
                const factors = Calculation.primeDecomposition(value);
                ticks.push
                ({
                    value: 1 /value,
                    label: `1/( ${factorsToString(factors, locales)} )`,
                    type,
                    color: factors.length <= 1 ? "green": undefined,
                });
            }
        }
    }
    const lowwerBoundIntegerValue = Math.ceil(lowwerBoundValue);
    const upperBoundIntegerValue = Math.min(Math.floor(upperBoundValue), limit);
    if (1 <= upperBoundIntegerValue)
    {
        if (limit <= lowwerBoundIntegerValue)
        {
            areas.push
            ({
                lowerBound: Math.max(2, lowwerBoundValue),
                upperBound: undefined,
                fill: "$DENSE"
            });
        }
        else
        {
            const start = Math.max(1, lowwerBoundIntegerValue);
            const limitEnd = Math.min(start +maxRange, limit);
            // const limitEnd = start +maxRange;
            for(let value = start; value <= upperBoundIntegerValue; ++value)
            {
                const width = getWidth(slide, lane, value, value +1, view, isInverted);
                if (width < tickTypeThreshold || limitEnd <= value)
                {
                    if (value < upperBoundValue)
                    {
                        areas.push
                        ({
                            lowerBound: Math.min(value, limit),
                            // lowerBound: value,
                            upperBound: undefined,
                            fill: "$DENSE"
                        });
                    }
                    break;
                }
                const factors = Calculation.primeDecomposition(value);
                ticks.push
                ({
                    value,
                    label: `${factorsToString(factors, locales)}`,
                    type,
                    color: factors.length <= 1 ? "green": undefined,
                });
            }
        }
    }
    ticks.push
    ({
        value: 1,
        type: "long",
    });
    addConstTicks
    (
        slide,
        lane,
        view,
        ticks,
        tickWindow,
        [
            {
                value: 1 /Calculation.MAX_SAFE_INTEGER,
                label: "1 / max safe integer",
                color: "blue"
            },
            // {
            //     value: 1 /limit,
            //     label: "1 / calculation limit",
            //     color: "blue"
            // },
            // {
            //     value: limit,
            //     label: "calculation limit",
            //     color: "blue"
            // },
            {
                value: Calculation.MAX_SAFE_INTEGER,
                label: "max safe integer",
                color: "blue"
            }
        ]
    );
    // ticks.push
    // (
    //     {
    //         value: 1 /Number.MAX_SAFE_INTEGER,
    //         label: "1 / max safe integer",
    //         type: "long",
    //         color: "blue"
    //     },
    //     // {
    //     //     value: 1 /limit,
    //     //     label: "1 / calculation limit",
    //     //     type: "long",
    //     //     color: "blue"
    //     // },
    //     {
    //         value: 1,
    //         type: "long",
    //     },
    //     // {
    //     //     value: limit,
    //     //     label: "calculation limit",
    //     //     type: "long",
    //     //     color: "blue"
    //     // },
    //     {
    //         value: Number.MAX_SAFE_INTEGER,
    //         label: "max safe integer",
    //         type: "long",
    //         color: "blue"
    //     }
    // );
    const result =
    {
        ticks: ticks,
        areas,
    };
    return result;
};
export const makeDigitLabel = (digit: Type.DigitTableDigit): Type.MultiLanguageText =>
{
    if (undefined === digit.symbol)
    {
        return digit.label;
    }
    else
    {
        if ("string" === typeof digit.label)
        {
            return `${digit.symbol} (${digit.label})`;
        }
        else
        {
            const result = { } as Exclude<Type.MultiLanguageText, string>;
            for(const lang in digit.label)
            {
                result[lang] = `${digit.symbol} (${digit.label[lang]})`;
            }
            return result;
        }
    }
};
export const designDigitTicks = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow): Type.LaneContent =>
{
    const { topValue, bottomValue } = tickWindow;
    const ticks: Type.Tick[] = [];
    const areas: Type.Area[] = [];
    // const isInverted = isInvertedLane(lane);
    const lowwerBoundValue = Math.min(Type.getExValueNumber(topValue), Type.getExValueNumber(bottomValue));
    const upperBoundValue = Math.max(Type.getExValueNumber(topValue), Type.getExValueNumber(bottomValue));
    if (undefined !== lane.digit)
    {
        const digit = getDigitTable(lane.digit as DigitTableKey);
        if (digit)
        {
            ticks.push
            ({
                value: 1,
                type: "long",
                color: Theme.resolve(config.model.constantTable.standardNumberColor),
            });
            for(const i of digit.digits)
            {
                const value = Math.pow(10, i.exponent);
                if (lowwerBoundValue <= value && value <= upperBoundValue)
                {
                    const type = designConstantTickType(slide, lane, view, ticks, value);
                    if ("none" !== type)
                    {
                        ticks.push
                        ({
                            value,
                            label: makeDigitLabel(i),
                            type,
                            color: Theme.resolve(config.model.constantTable.elementaryNumberColor),
                        });
                    }
                }
            }
        }
        else
        {
            console.error(`🦋 digit table not found for lane: ${lane.name ?? "unnamed"}`);
        }
    }
    else
    {
        console.error(`🦋 digit table not specified for lane: ${lane.name ?? "unnamed"}`);
    }
    const result =
    {
        ticks,
        areas,
    };
    return result;
};
export const designConstantAreas = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow, area: Type.ContantTableArea): Type.Area[] =>
{
    const { topValue, bottomValue } = tickWindow;
    const result: Type.Area[] = [];
    const isInverted = isInvertedLane(lane);
    const lowwerBoundValue = Math.min(Type.getExValueNumber(topValue), Type.getExValueNumber(bottomValue));
    const upperBoundValue = Math.max(Type.getExValueNumber(topValue), Type.getExValueNumber(bottomValue));
    const lowerBound = area.lowerBound ?? Calculation.MIN_VALUE;
    const upperBound = area.upperBound ?? Calculation.MAX_VALUE;
    const threshold = config.render.ruler.tickDensityThreshold_5;
    const width = getWidth(slide, lane, lowerBound, upperBound, view, isInverted);
    const isGreatPressed = (null === area.lowerBound || null === area.upperBound) && view.viewScaleExponent <= -1;
    if ((lowwerBoundValue <= upperBound && lowerBound <= upperBoundValue) || (lowerBound <= upperBoundValue && lowwerBoundValue <= upperBound))
    {
        const detailsCount = (area.details ?? []).length;
        const details = 0 < detailsCount && threshold *Math.max(5, detailsCount *1.25) <= width ?
            (area.details ?? []).map(detail => designConstantAreas(slide, view, lane, tickWindow, detail)).reduce((a, b) => a.concat(b), [] as Type.Area[]):
            undefined;
        result.push
        ({
            lowerBound: area.lowerBound ?? undefined,
            upperBound: area.upperBound ?? undefined,
            fill: area.fill,
            overlay: area.overlay,
            label: (threshold <= width *1.5 || isGreatPressed) ? area.label : undefined,
            color: Theme.resolve(area.color),
            details,
        });
    }
    return result;
};
export const designConstantTickColor = (tick: Type.ContantTableTick) =>
{
    const color = Theme.resolve(tick.color);
    switch(color)
    {
    case undefined:
        return Theme.resolve
        (
            (tick.priority ?? 0) <= 0 ?
                config.model.constantTable.elementaryNumberColor:
                config.model.constantTable.defaultNumberColor
        );
    case "$ESTIMATED":
        return Theme.resolve(config.model.constantTable.estimatedNumberColor);
    case "$FICTION":
        return Theme.resolve(config.model.constantTable.fictionalNumberColor);
    default:
        return color;
    }
};
export const designConstantTickType = (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View, ticks: Type.Tick[], value: number): Type.TickType =>
{
    const tickThreshold = config.render.ruler.tickDensityThreshold_5 *0.8;
    const { tick, width, } = getLongTickSpaceWidth(slide, lane, view, ticks, value);
    switch(true)
    {
    // case tickThreshold <= width:
    //     return "long";
    // case tickThreshold <= width *2:
    //     return "medium";
    // case tickThreshold <= width *4:
    //     return "short";
    // case tickThreshold <= width *8:
    //     return "mini";
    // default:
    //     return "none";
    case tickThreshold <= width:
        return "long";
    case 1.25 <= width:
        return "medium";
    default:
        if (tick)
        {
            tick.behindTickCount = (tick?.behindTickCount ?? 0) +1;
        }
        return "none";
    }
};
export const makeConstantStandardTickUnit = <T>(unit: Extract<T, undefined> | { symbol: string; label: Type.MultiLanguageText; }): string | Extract<T, undefined> =>
{
    if (undefined !== unit)
    {
        const label = Locale.resolve(unit.label);
        if (undefined !== unit.symbol)
        {
            if (undefined !== label)
            {
                return `${unit.symbol} (${label})`;
            }
            else
            {
                return unit.symbol;
            }
        }
        else
        {
            return label;
        }
    }
    return undefined as Extract<T, undefined>;
};
export const designConstantTicks = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: ValueTickWindow): Type.LaneContent =>
{
    const { topValue, bottomValue } = tickWindow;
    const ticks: Type.Tick[] = [];
    const areas: Type.Area[] = [];
    // const isInverted = isInvertedLane(lane);
    const lowwerBoundValue = Math.min(Type.getExValueNumber(topValue), Type.getExValueNumber(bottomValue));
    const upperBoundValue = Math.max(Type.getExValueNumber(topValue), Type.getExValueNumber(bottomValue));
    if (undefined !== lane.table)
    {
        const table = getConstantTable(lane.table as ConstantTableKey);
        if (null !== table)
        {
            const unit = table.unit?.symbol;
            ticks.push
            ({
                value: 1,
                unit: makeConstantStandardTickUnit(table.unit),
                type: "long",
                color: Theme.resolve(config.model.constantTable.standardNumberColor),
            });
            const sourceTicks = table.ticks
                .filter(i => lowwerBoundValue <= i.value && i.value <= upperBoundValue)
                .sort(Comparer.make([ i => i.priority ?? 0, ]));
            for(const i of sourceTicks)
            {
                const type = designConstantTickType(slide, lane, view, ticks, i.value);
                if ("none" !== type)
                {
                    ticks.push
                    ({
                        value: i.value,
                        label: i.label,
                        unit,
                        type,
                        color: designConstantTickColor(i),
                    });
                }
            }
            for(const i of table.areas)
            {
                areas.push(...designConstantAreas(slide, view, lane, tickWindow, i));
            }
        }
        else
        {
            console.warn(`🦋 Model.designConstantTicks: constant table not found for lane: ${lane.name ?? "unnamed"}, table key: ${lane.table}`);
        }
    }
    else
    {
        console.warn(`🦋 Model.designConstantTicks: lane table is null for constant lane: ${lane.name ?? "unnamed"}`);
    }
    const result =
    {
        ticks,
        areas,
    };
    return result;
};
export const getUnitList = (lane: Type.Lane): Type.Unit[] =>
{
    switch(lane.type)
    {
    case "constant":
        const result: Type.Unit[] = [];
        if (lane.table)
        {
            const table = getConstantTable(lane.table as ConstantTableKey);
            if (null !== table)
            {
                if (table.unit)
                {
                    result.push({ ...table.unit, value: 1 });
                }
                for(const tick of table.ticks)
                {
                    if (tick.unit)
                    {
                        result.push({ ...tick.unit, value: tick.value });
                    }
                }
            }
            else
            {
                console.warn(`🦋 Model.getUnitList: constant table not found for lane: ${lane.name ?? "unnamed"}, table key: ${lane.table}`);
            }
        }
        else
        {
            console.warn(`🦋 Model.getUnitList: lane table is null for constant lane: ${lane.name ?? "unnamed"}`);
        }
        return result;
    default:
        console.warn(`🦋 Model.getUnitList: unsupported lane type for unit: ${lane.type}`);
        return [];
    }
};
export const designPeriodicTicks = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: PositionTickWindow): Type.LaneContent =>
{
    const isInverted = isInvertedSlide(slide);
    const period = getPrimaryPeriod(lane);
    const primaryTick = getPrimaryTick(lane);
    if (undefined !== period && undefined !== primaryTick)
    {
        // const value = Type.getExValueNumber(primaryTick.value);
        // const offset = Type.getExValuePosition(primaryTick.value) ?? period;
        // const label = primaryTick.label;
        // const type = primaryTick.type;
        // const color = primaryTick.color;
        const ticks: Type.Tick[] = [];
        const areas: Type.Area[] = [];
        // const isInverted = isInvertedLane(lane);
        const lowValue = getValueAt(slide, slide.lanes[0], ! isInverted ? tickWindow.topPosition: tickWindow.bottomPosition, view)?.value ?? getMinValue(slide.lanes[0]);
        const highValue = getValueAt(slide, slide.lanes[0], ! isInverted ? tickWindow.bottomPosition: tickWindow.topPosition, view)?.value ?? getMaxValue(slide.lanes[0]);
        const base = Math.floor(lowValue /period) * period;
        let i = 0;
        let position = base + i* period;
        while(position <= highValue)
        {
            const width = Math.abs(Math.log(position +period) -Math.log(position)) *Type.getViewScale(view);
            const currentLowValue = Math.max(position, lowValue);
            const currentHighValue = Math.min(position +period, highValue);
            if (config.render.ruler.tickDensityThreshold_10 *(period / (Math.PI /2)) <= width *8)
            {
                ticks.push(...designAngleTicks360(slide, view, lane, position, currentLowValue, currentHighValue));
                ++i;
                position = base + i* period;
            }
            else
            {
                // ++;
                // position = base + i* period;
                areas.push
                ({
                    lowerBound:
                    {
                        value: 0,
                        position: getSlidePosition(slide, position),
                    },
                    upperBound: undefined,
                    fill: "$DENSE",
                });
                break;
            }
        }
        return complementMinMaxArea(slide, view, lane, tickWindow, { ticks, areas, });
        // const valueTickWindow = PositionTickWindowToValueTickWindow(slide, lane, view, tickWindow);
        // // const positionTickWindow = ValueTickWindowToPositionTickWindow(slide, lane, view, valueTickWindow);
        // // const clippedTickWindow = PositionTickWindowToValueTickWindow(slide, lane, view, positionTickWindow);
        // // const result = complementMinMaxArea(slide, view, lane, tickWindow, designRegularTicks(slide, view, lane, clippedTickWindow));
        // const result = complementMinMaxArea(slide, view, lane, tickWindow, designCurvedTicks(slide, view, lane, valueTickWindow));
        // // const ticks: Type.Tick[] = [];
        // // const areas: Type.Area[] = [];
        // // const result =
        // // {
        // //     ticks,
        // //     areas,
        // // };
        // // const primaryTick = getPrimaryTick(lane);
        // // if (undefined !== primaryTick)
        // // {
        // //     const period = getPrimaryPeriod(lane);
        // //     if (Type.isValueWithPosition(primaryTick) && undefined !== period)
        // //     {
        // //         primaryTick.position = getPrimaryPositionAt(slide.lanes[0], period);
        // //     }
        // //     result.ticks.push(primaryTick);
        // //     console.log(`🦋 designPeriodicTicks: added primary tick for lane: ${lane.name ?? "unnamed"}, tick: ${JSON.stringify(primaryTick)}`);
        // // }
        // return result;
    }
    else
    {
        console.warn(`🦋 Model.designPeriodicTicks: primary period is undefined for lane: ${lane.name ?? "unnamed"}`);
        return { ticks: [], areas: [], };
    }
};
export const designOscillatingTicks = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: PositionTickWindow): Type.LaneContent =>
{
    const valueTickWindow = PositionTickWindowToValueTickWindow(slide, lane, view, tickWindow);
    const positionTickWindow = ValueTickWindowToPositionTickWindow(slide, lane, view, valueTickWindow);
    if (tickWindow.topPosition <= positionTickWindow.bottomPosition && positionTickWindow.topPosition <= tickWindow.bottomPosition)
    {
        // const clippedTickWindow = PositionTickWindowToValueTickWindow(slide, lane, view, positionTickWindow);
        // return complementMinMaxArea(slide, view, lane, tickWindow, designCurvedTicks(slide, view, lane, clippedTickWindow));
        return complementMinMaxArea(slide, view, lane, tickWindow, designCurvedTicks(slide, view, lane, valueTickWindow));
    }
    else
    {
        const ticks: Type.Tick[] = [];
        const areas: Type.Area[] = [];
        const result =
        {
            ticks,
            areas,
        };
        return complementMinMaxArea(slide, view, lane, tickWindow, result);
    }
};
export const complementMinMaxArea = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: PositionTickWindow, content: Type.LaneContent): Type.LaneContent =>
{
    const isInverted = isInvertedLane(lane);
    const valueTickWindow = PositionTickWindowToValueTickWindow(slide, lane, view, tickWindow);
    const positionTickWindow = ValueTickWindowToPositionTickWindow(slide, lane, view, valueTickWindow);
    const hasMinus = getMinValue(lane) < 0;
    const isExponential = "exponential" === lane.type;
    const minColor = hasMinus ? "$MINUS":
        isExponential ? "$SPARSE":
        "$MIN";
    switch(lane.type)
    {
    case "sine":
        content.areas.push
        (
            ! isInverted ?
            {
                lowerBound: undefined,
                upperBound: { value: 0, position: Calculation.MIN_VALUE, },
                fill: "$MIN",
            }:
            {
                upperBound: { value: 0, position: Calculation.MAX_VALUE, },
                lowerBound: undefined,
                fill: "$MIN",
            }
        );
        break;
    case "cosine":
        content.areas.push
        (
            ! isInverted ?
            {
                lowerBound: undefined,
                upperBound: { value: Calculation.MIN_VALUE, position: Calculation.MIN_VALUE, },
                fill: "$SPARSE",
                label: "≈1"
            }:
            {
                upperBound: { value: Calculation.MIN_VALUE, position: Calculation.MAX_VALUE, },
                lowerBound: undefined,
                fill: "$SPARSE",
                label: "≈1"
            }
        );
        break;
    case "tangent":
        content.areas.push
        (
            ! isInverted ?
            {
                lowerBound: undefined,
                upperBound: { value: 0, position: Calculation.MIN_VALUE, },
                fill: "$MIN",
            }:
            {
                upperBound: { value: 0, position: Calculation.MAX_VALUE, },
                lowerBound: undefined,
                fill: "$MIN",
            }
        );
        break;
    case "secant":
        content.areas.push
        (
            ! isInverted ?
            {
                lowerBound: undefined,
                upperBound: { value: getMinValue(lane), position: Calculation.MIN_VALUE, },
                fill: "$SPARSE",
                label: "≈1"
            }:
            {
                upperBound: { value: getMinValue(lane), position: Calculation.MAX_VALUE, },
                lowerBound: undefined,
                fill: "$SPARSE",
                label: "≈1"
            }
        );
        break;
    case "cosecant":
        content.areas.push
        (
            ! isInverted ?
            {
                lowerBound: undefined,
                upperBound: { value: Calculation.MAX_VALUE, position: Calculation.MIN_VALUE, },
                fill: "$MAX",
            }:
            {
                upperBound: { value: Calculation.MAX_VALUE, position: Calculation.MAX_VALUE, },
                lowerBound: undefined,
                fill: "$MAX",
            }
        );
        break;
    case "cotangent":
        content.areas.push
        (
            ! isInverted ?
            {
                lowerBound: undefined,
                upperBound: { value: 0, position: Calculation.MIN_VALUE, },
                fill: "$MAX",
            }:
            {
                upperBound: { value: 0, position: Calculation.MAX_VALUE, },
                lowerBound: undefined,
                fill: "$MAX",
            }
        );
        break;
    case "arcsine":
        content.areas.push
        ({
            lowerBound: undefined,
            upperBound: 0,
            fill: "$MIN",
        });
        content.areas.push
        ({
            lowerBound: Math.PI /2,
            upperBound: undefined,
            fill: "$NAN",
            label: "NaN",
        });
        break;
    case "arccosine":
        content.areas.push
        ({
            lowerBound: undefined,
            upperBound: 0,
            fill: "$NAN",
            label: "NaN",
        });
        content.areas.push
        ({
            lowerBound: Math.PI /2,
            upperBound: undefined,
            fill: "$SPARSE",
            label: "≈π/2",
        });
        break;
    case "arctangent":
        content.areas.push
        ({
            lowerBound: undefined,
            upperBound: Calculation.MIN_VALUE,
            fill: "$MIN",
        });
        content.areas.push
        ({
            lowerBound: Math.PI /2,
            upperBound: undefined,
            fill: "$SPARSE",
            label: "≈π/2",
        });
        break;
    case "arcsecant":
        content.areas.push
        ({
            lowerBound: undefined,
            upperBound: Calculation.MIN_VALUE,
            fill: "$NAN",
            label: "NaN",
        });
        content.areas.push // 🔥 これは仮置き。正規のロジックで設定される様にする時にこちらは要削除
        ({
            lowerBound: Math.PI /2,
            upperBound: undefined,
            fill: "$SPARSE",
            label: "≈π/2",
        });
        break;
    case "arccosecant":
        // ⚠️ this lane is a inverted lane.
        content.areas.push
        ({
            lowerBound: undefined,
            upperBound: Calculation.MIN_VALUE,
            fill: "$MIN",
        });
        content.areas.push
        ({
            lowerBound: Math.PI /2,
            upperBound: undefined,
            fill: "$NAN",
            label: "NaN",
        });
        break;
    case "arccotangent":
        // ⚠️ this lane is a inverted lane.
        content.areas.push
        ({
            lowerBound: undefined,
            upperBound: Calculation.MIN_VALUE,
            fill: "$MIN",
        });
        content.areas.push
        ({
            lowerBound: Math.PI /2,
            upperBound: undefined,
            fill: "$SPARSE",
            label: "≈π/2",
        });
        break;
    default:
        if (tickWindow.topPosition < positionTickWindow.topPosition)
        {
            if (content.areas.findIndex(( ! isInverted) ? area => undefined === area.lowerBound: area => undefined === area.upperBound) < 0)
            {
                content.areas.push
                ({
                    lowerBound: ( ! isInverted) ? undefined:  Type.getExValueNumber(valueTickWindow.topValue),
                    upperBound: ( ! isInverted) ? (isExponential ? getMinValue(lane): Type.getExValueNumber(valueTickWindow.topValue)): undefined,
                    fill: ( ! isInverted) ? minColor: "$MAX",
                    label: ! isInverted && isExponential ? "≈1": undefined,
                });
            }
        }
        if (positionTickWindow.bottomPosition < tickWindow.bottomPosition)
        {
            if (content.areas.findIndex(( ! isInverted) ? area => undefined === area.upperBound: area => undefined === area.lowerBound) < 0)
            {
                content.areas.push
                ({
                    lowerBound: ( ! isInverted) ? Type.getExValueNumber(valueTickWindow.bottomValue): undefined,
                    upperBound: ( ! isInverted) ? undefined: (isExponential ? getMinValue(lane): Type.getExValueNumber(valueTickWindow.bottomValue)),
                    fill: ( ! isInverted) ? "$MAX": minColor,
                    label: isInverted && isExponential ? "≈1": undefined,
                });
            }
        }
    }
    return content;
};
export const designTicks = (slide: Type.SlideUnit, view: Type.View, lane: Type.Lane, tickWindow: PositionTickWindow): Type.LaneContent =>
{
    if (isPeriodicLane(lane))
    {
        return designPeriodicTicks(slide, view, lane, tickWindow);
    }
    else
    if (isOscillatingLane(lane))
    {
        // 🔥 両端の処理を改善すれば、必要に応じて inverted にするだけで designRegularTicks でイケそうなので、
        // その方向で進める。上手くいけば、 isOscillatingLane() も designOscillatingTicks() も廃止。
        return designOscillatingTicks(slide, view, lane, tickWindow);
    }
    else
    {
        const valueTickWindow = PositionTickWindowToValueTickWindow(slide, lane, view, tickWindow);
        let result: Type.LaneContent;
        switch(lane.type)
        {
        case "prime":
            result = designPrimeNumbersTicks(slide, view, lane, valueTickWindow);
            break;
        case "prime-decomposition":
            result = designPrimeDecompositionTicks(slide, view, lane, valueTickWindow);
            break;
        case "digit":
            result = designDigitTicks(slide, view, lane, valueTickWindow);
            break;
        case "constant":
            result = designConstantTicks(slide, view, lane, valueTickWindow);
            break;
        case "logarithmic": // 全体が対数ベースなので logarithmic が逆にリニアになる / EN: Since the entire lane is logarithmic base, logarithmic becomes linear instead
            result = designLinearTicks(slide, view, lane, valueTickWindow);
            break;
        default:
            result = designLogarithmicTicks(slide, view, lane, valueTickWindow);
            break;
        }
        return complementMinMaxArea(slide, view, lane, tickWindow, result);
    }
};
export const makeRootLane = (): Type.Lane =>
{
    const { type, exponent } = config.model.lane.root as Type.LaneBase;
    return makeLane
    ({
        type: type as Type.LaneType,
        exponent,
    });
};
export const getRootLane = (): Type.Lane =>
    getLane(RootLaneIndex);
export const isRootLane = (indexOrLane: number | Type.Lane): boolean =>
    (typeof indexOrLane === "number" ? RootLaneIndex: getLane(RootLaneIndex)) === indexOrLane;
export const isPrimaryLane = (lane: Type.Lane): boolean =>
    getSlideFromLane(lane).lanes[0] === lane;
export const getRootSlide = (): Type.SlideUnit =>
    data.slides[0];
export const getRootSlideAndRootLane = () =>
    ({ slide: getRootSlide(), lane: getRootLane() });
export const isRootSlide = (indexOrSlide: number | Type.SlideUnit): boolean =>
    (0 === (typeof indexOrSlide === "number" ? indexOrSlide : getSlideIndex(indexOrSlide)));
export const getSlideIndex = (slide: Type.SlideUnit): number =>
{
    const index = data.slides.indexOf(slide);
    if (0 <= index)
    {
        return index;
    }
    throw new Error(`🦋 FIXME: Model.getSlideIndex: slide not found`);
};
export const getSlideIndexFromLane = (lane: Type.Lane): number =>
{
    for(let i = 0; i < data.slides.length; ++i)
    {
        const slide = data.slides[i];
        if (slide.lanes.includes(lane))
        {
            return i;
        }
    }
    throw new Error(`🦋 FIXME: Model.getSlideIndexFromLane: lane not found in any slide`);
};
export const getLaneIndex = (lane: Type.Lane): number =>
{
    let i = 0;
    for(const slide of data.slides)
    {
        for(const l of slide.lanes)
        {
            if (l === lane)
            {
                return i;
            }
            ++i;
        }
    }
    throw new Error(`🦋 FIXME: Model.getLaneIndex: lane not found`);
};
export const makeSlide = (anchor: number = 1): Type.SlideUnit =>
({
    lanes: [],
    anchor,
});
export const makeSureSlide = (): Type.SlideUnit =>
{
    if (data.slides.length <= 0)
    {
        const slide = makeSlide();
        slide.lanes.push(makeRootLane());
        data.slides.push(slide);
    }
    return data.slides[data.slides.length - 1];
};
export const getSlideAndLane = (index: number): { slide: Type.SlideUnit, lane: Type.Lane, } =>
{
    let i = 0;
    for(const slide of data.slides)
    {
        for(const lane of slide.lanes)
        {
            if (i === index)
            {
                return { slide, lane };
            }
            ++i;
        }
    }
    throw new Error(`🦋 FIXME: Model.getLane: index out of range: ${index}`);
};
export const getLastSlideAndLastLane = (): { slide: Type.SlideUnit, lane: Type.Lane, } =>
{
    if (data.slides.length <= 0)
    {
        throw new Error(`🦋 FIXME: Model.getLastSlideAndLastLane: no slide exists`);
    }
    const slide = data.slides[data.slides.length - 1];
    if (slide.lanes.length <= 0)
    {
        throw new Error(`🦋 FIXME: Model.getLastSlideAndLastLane: no lane exists in the last slide`);
    }
    const lane = slide.lanes[slide.lanes.length - 1];
    return { slide, lane };
};
export const getLane = (index: number): Type.Lane =>
    getSlideAndLane(index).lane;
export const getSlideFromLane = (lane: Type.Lane): Type.SlideUnit =>
{
    for(const slide of data.slides)
    {
        if (slide.lanes.includes(lane))
        {
            return slide;
        }
    }
    throw new Error(`🦋 FIXME: Model.getSlideFromLane: lane not found in any slide`);
};
export const addLane = (lane: Type.Lane): void =>
{
    makeSureSlide().lanes.push(lane);
};

export const addDigitLane = (slide: Type.SlideUnit, digitTableKey: DigitTableKey) =>
{
    const digit = getDigitTable(digitTableKey);
    if (null === digit)
    {
        throw new Error(`🦋 FIXME: Model.addDigitLane: digit table not found for key: ${digitTableKey}`);
    }
    else
    {
        const lane = makeLane
        ({
            name: digit.label,
            type: "digit",
            digit: digitTableKey,
        });
        slide.lanes.push(lane);
    }
};
export const addConstantLane = (slide: Type.SlideUnit, constantTableKey: ConstantTableKey) =>
{
    const constant = getConstantTable(constantTableKey);
    if (null === constant)
    {
        throw new Error(`🦋 FIXME: Model.addConstantLane: constant table not found for key: ${constantTableKey}`);
    }
    else
    {
        const lane = makeLane
        ({
            name: constant.label,
            type: "constant",
            table: constantTableKey,
            unit: constant.unit,
        });
        slide.lanes.push(lane);
    }
};
const getLaneName = (laneSeed: Type.LaneBase): Type.MultiLanguageText | null =>
{
    if (undefined !== laneSeed.name && null !== laneSeed.name)
    {
        return laneSeed.name;
    }
    return null;
};
export const makeLane = (laneSeed: Type.LaneBase): Type.Lane =>
({
    type: laneSeed.type,
    base: laneSeed.base,
    exponent: laneSeed.exponent,
    name: getLaneName(laneSeed),
    table: laneSeed.table,
    digit: laneSeed.digit,
    unit: laneSeed.unit,
});
export const removeLane = (index: number): void =>
{
    if (isRootLane(index))
    {
        throw new Error(`🦋 FIXME: Model.removeLane: cannot remove root lane`);
    }
    else
    {
        const { slide, lane } = getSlideAndLane(index);
        slide.lanes.splice(slide.lanes.indexOf(lane), 1);
    }
};
export const makeSure = (): void =>
{
    makeSureSlide();
};
export const getCursorPosition = (view: Type.View): number =>
    getPositionAt(getRootSlide(), getRootLane(), data.cursor, view);
export const getCursorValue = (slide: Type.SlideUnit, lane: Type.Lane, view: Type.View) =>
    getValueAt(slide, lane, getCursorPosition(view), view);
export const getCursorValues = (view: Type.View) =>
    data.slides.map(slide => getCursorValue(slide, slide.lanes[0], view));
export const getLaneContext = (lane: Type.Lane): Type.LaneContext =>
{
    const slide = getSlideFromLane(lane);
    switch(true)
    {
    case slide.lanes.length <= 1:
        return "single";
    case lane === slide.lanes[0]:
        return "left-end";
    case lane === slide.lanes[slide.lanes.length - 1]:
        return "right-end";
    default:
        return "center";
    }
};
export const hasDataArea = (areas: Type.Area[]): boolean =>
    areas.some(area => undefined !== area.label || (undefined !== area.details && hasDataArea(area.details)));
export const initialize = () =>
{
    data.cursor = Calculation.parse(Url.get("cursor")) ?? config.model.defaultCursor;
    console.log(`Model initialized: cursor=${data.cursor}`);
    makeSure();
};
