import * as UI from "./ui";
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
