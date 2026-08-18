import * as UI from "./ui";
export const isIncludeCursor = (): boolean => UI.SavePanel.includeCursorCheckbox.checked;
// export const getLanguage = (): string => UI.SettingsPanel.languageSelect.value;
export const getTheme = (): string => UI.SettingsPanel.themeSelect.value;
export const getThreeDigitSeparator = (): "none" | "custom" | "thin-space" =>
    UI.SettingsPanel.threeDigitSeparatorSelect.value as ReturnType<typeof getThreeDigitSeparator>;
export const getExponentFormat = (): "e" | "x10" =>
    UI.SettingsPanel.exponentFormatSelect.value as ReturnType<typeof getExponentFormat>;
export const getExponentMultipleOfThree = (): boolean =>
    UI.SettingsPanel.exponentMultipleOfThreeCheckbox.checked;
export const getNumberFormat = (): "scientific" | "localized" =>
    UI.SettingsPanel.numberFormatSelect.value as ReturnType<typeof getNumberFormat>;
export const getShowComplexSolutions = (): boolean =>
    UI.SettingsPanel.showComplexSolutionsCheckbox.checked;
export const getAllSettings = () => // URL パラメーターで使うので短く！ / EN: Short for URL parameters!
({
    i: isIncludeCursor(),
    l: UI.SettingsPanel.languageSelect.value,
    t: getTheme(),
    s: getThreeDigitSeparator(),
    e: getExponentFormat(),
    m: getExponentMultipleOfThree(),
    n: getNumberFormat(),
    c: getShowComplexSolutions(),
});
export const applySettings = (settings: ReturnType<typeof getAllSettings>) =>
{
    UI.SavePanel.includeCursorCheckbox.checked = settings.i;
    UI.SettingsPanel.languageSelect.value = settings.l;
    UI.SettingsPanel.themeSelect.value = settings.t;
    UI.SettingsPanel.threeDigitSeparatorSelect.value = settings.s;
    UI.SettingsPanel.exponentFormatSelect.value = settings.e;
    UI.SettingsPanel.exponentMultipleOfThreeCheckbox.checked = settings.m;
    UI.SettingsPanel.numberFormatSelect.value = settings.n;
    UI.SettingsPanel.showComplexSolutionsCheckbox.checked = settings.c;
};
