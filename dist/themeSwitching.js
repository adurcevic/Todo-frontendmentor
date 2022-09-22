"use strict";
let themeBtn;
let moonIcon;
let sunIcon;
const storageKey = "theme";
let theme;
const darkTheme = () => {
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
};
const lightTheme = () => {
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
};
const getColorPreference = () => {
    if (localStorage.getItem(storageKey))
        return localStorage.getItem(storageKey);
    else
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
};
theme = { value: getColorPreference() };
const reflectPreference = () => {
    document.firstElementChild.setAttribute("data-theme", theme.value);
    if (themeBtn) {
        themeBtn.setAttribute("aria-label", theme.value);
        if (theme.value === "light")
            lightTheme();
        if (theme.value === "dark")
            darkTheme();
    }
};
const setPreference = () => {
    localStorage.setItem(storageKey, theme.value);
    reflectPreference();
};
const onClick = () => {
    theme.value = theme.value === "light" ? "dark" : "light";
    setPreference();
};
reflectPreference();
window.onload = () => {
    reflectPreference();
    themeBtn = document.querySelector(".button-theme");
    moonIcon = document.querySelector(".moon-icon");
    sunIcon = document.querySelector(".sun-icon");
    themeBtn.addEventListener("click", onClick);
};
window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", ({ matches: isDark }) => {
    theme.value = isDark ? "dark" : "light";
    setPreference();
});
