// Switching Light Dark Theme
let themeBtn: null | HTMLButtonElement;
let moonIcon: null | SvgInHtml;
let sunIcon: null | SvgInHtml;
const storageKey = "theme";
let theme: { value: string };

const darkTheme = (): void => {
  sunIcon!.classList.remove("hidden");
  moonIcon!.classList.add("hidden");
};

const lightTheme = (): void => {
  sunIcon!.classList.add("hidden");
  moonIcon!.classList.remove("hidden");
};

const getColorPreference = (): string => {
  if (localStorage.getItem(storageKey))
    return localStorage.getItem(storageKey) as string;
  else
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
};

theme = { value: getColorPreference() };

const reflectPreference = (): void => {
  (document.firstElementChild as HTMLElement).setAttribute(
    "data-theme",
    theme.value
  );
  if(themeBtn) {
    themeBtn.setAttribute("aria-label", theme.value);
    if (theme.value === "light") lightTheme();
    if (theme.value === "dark") darkTheme();
  }
};

const setPreference = (): void => {
  localStorage.setItem(storageKey, theme.value);
  reflectPreference();
};

const onClick = (): void => {
  theme.value = theme.value === "light" ? "dark" : "light";
  setPreference();
};

reflectPreference();

window.onload = (): void => {
  reflectPreference();
  themeBtn = document.querySelector(".button-theme") as HTMLButtonElement;
  moonIcon = document.querySelector(".moon-icon") as SvgInHtml;
  sunIcon = document.querySelector(".sun-icon") as SvgInHtml;
  themeBtn.addEventListener("click", onClick);
};

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches: isDark }) => {
    theme.value = isDark ? "dark" : "light";
    setPreference();
  });
