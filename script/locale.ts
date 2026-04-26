export const master =
{
    "en": {
        "lang-label": "English",
        "lang-direction": "ltr",
        "lang-colon-suffix": ":",
        "Auto": "Auto"
    },
    "ja": {
        "lang-label": "日本語",
        "lang-direction": "ltr",
        "lang-colon-suffix": "：",
        "Auto": "自動"
    }
};
export type LanguageTable = string | ({ [key in Language]?: string; } & { en: string; });
export type Label = (keyof (typeof master[keyof typeof master])) | "";
export type Language = string & keyof typeof master; // "string &" is a workaround for foolish TypeScript
const supportedLangs = Object.keys(master) as Language[];
const getSegments = (text: string, separator: string, segments: number): string =>
    text.split(separator).slice(0, segments).join(separator);
export const lookupValue = <T>(list: T[], value: T): T | undefined =>
    list.includes(value) ? value : undefined;
const getMatchLang = (lang: string, canonicalLangs: Language[] = supportedLangs): Language | undefined =>
    lookupValue(canonicalLangs, getSegments(lang, "-", 2) as Language) ??
    lookupValue(canonicalLangs, getSegments(lang, "-", 1) as Language);
const getDefaultLang = (): Language =>
    getMatchLang(navigator.language.toLowerCase()) ??
    navigator.languages.map(i => getMatchLang(i.toLowerCase())).filter(i => i !== undefined)[0] ??
    "en";
let lang: Language = getDefaultLang();
export const getLocale = () => lang;
export const setLocale = (locale?: Language | "Auto", urlLocale?: string) =>
{
    switch(locale)
    {
    case undefined:
    case "Auto":
        if (urlLocale)
        {
            lang = getMatchLang(urlLocale) ?? getDefaultLang();
        }
        else
        {
            lang = getDefaultLang();
        }
        break;
    default:
        lang = locale;
        break;
    }
};
export const getDirection = (l?: Language) =>
    master[l ?? lang]["lang-direction"] as "ltr" | "rtl";
export const isRtl = (l?: Language) =>
    "rtl" === getDirection(l);
export const isLtr = (l?: Language) =>
    "ltr" === getDirection(l);
export const toRtl = (text: string, f?: boolean): string =>
    false === f ? text : `\u202B${text}\u202C`;
export const getColonSuffix = (l?: Language) =>
    (master[l ?? lang]["lang-colon-suffix"] ?? ":") as string;
export const map = (key: Label, l?: Language) =>
    "" === key ? "" : master[l ?? lang][key];
export const resolve = <T>(table: Extract<T, null | undefined> | string | Exclude<LanguageTable, string>, l?: Language): Extract<T, null | undefined> | string =>
    "string" === typeof table || ( ! table) ?
        table:
        table[getMatchLang(l ?? lang, Object.keys(table) as Language[]) ?? "en"] ?? table["en"];
export const getLocaleList = (): (Language | "Auto")[] =>
    ["Auto", ...supportedLangs] as (Language | "Auto")[];
