import * as Environment from "./environment";
import * as Type from "./type";
import * as Settings from "./settings";
export const isDark = (): boolean =>
{
    switch(Settings.getTheme())
    {
    case "light":
        return false;
    case "dark":
        return true;
    default:
        return Environment.isDarkMode();
    }
};
export const resolve = <T>(table: T | { "light": T, "dark": T }, theme?: "light" | "dark"): T =>
    Type.isThemeTable(table) ? table[theme ?? getX()]: table;
export const getX = (): "light" | "dark" =>
    ! isDark() ? "light" : "dark";
export const update = () =>
{
    document.documentElement.classList.toggle("dark-theme", isDark());
    document.documentElement.classList.toggle("light-theme", ! isDark());
};
