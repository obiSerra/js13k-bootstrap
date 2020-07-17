export const appendElement = (element, parent = document.body) => parent.appendChild(element);

export const viewportDims = () => ({
  w: document.documentElement.clientWidth || 600,
  h: document.documentElement.clientHeight || 800,
});
