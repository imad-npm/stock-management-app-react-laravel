export const getCssVar = (name) => {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
};
