export const isApple = (): boolean =>
    /Mac|iPhone|iPad|iPod/.test(navigator.platform);
export const isDarkMode = (): boolean =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
