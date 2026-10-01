export type ThemePreference = "light" | "dark" | "system";

export const themeStorageKey = "umojaverse-theme";
const themeChangeEvent = "umojaverse-theme-change";

function normalizePreference(
  value: string | null | undefined,
): ThemePreference {
  return value === "light" || value === "dark" ? value : "system";
}

export function getThemePreference(): ThemePreference {
  return normalizePreference(document.documentElement.dataset.themePreference);
}

export function getServerThemePreference(): ThemePreference {
  return "system";
}

function applyTheme(preference: ThemePreference) {
  const dark =
    preference === "dark" ||
    (preference === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.documentElement.dataset.themePreference = preference;
}

export function setThemePreference(preference: ThemePreference) {
  applyTheme(preference);
  try {
    localStorage.setItem(themeStorageKey, preference);
  } catch {
    // The current page still works when the browser disallows storage.
  }
  window.dispatchEvent(new Event(themeChangeEvent));
}

export function subscribeToTheme(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    applyTheme(getThemePreference());
    onChange();
  };
  const onStorageChange = (event: StorageEvent) => {
    if (event.key !== themeStorageKey && event.key !== null) return;
    applyTheme(normalizePreference(event.newValue));
    onChange();
  };
  media.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorageChange);
  window.addEventListener(themeChangeEvent, onChange);
  // Recheck in case the device theme changed before hydration completed.
  onSystemChange();
  return () => {
    media.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorageChange);
    window.removeEventListener(themeChangeEvent, onChange);
  };
}

// Runs in the document head before paint; keeps saved preferences out of server rendering.
export const themeInitScript = `(function(){
  var preference="system";
  try {
    var saved=localStorage.getItem("umojaverse-theme");
    if(saved==="light"||saved==="dark") preference=saved;
  } catch(e) {}
  var dark=preference==="dark"||(preference==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme=dark?"dark":"light";
  document.documentElement.dataset.themePreference=preference;
})();`;
