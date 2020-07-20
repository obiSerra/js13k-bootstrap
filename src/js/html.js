/**
 * Here all the interaction with HTML and DOM
 */
export const appendElement = (element, parent = document.body) => parent.appendChild(element);

export const viewportDims = () => ({
  w: document.documentElement.clientWidth || 600,
  h: document.documentElement.clientHeight || 800,
});

export const createStage = (dims = { w: 800, h: 600 }) => {
  const stage = document.createElement("canvas");
  stage.id = "stage";
  stage.width = dims.w;
  stage.height = dims.h;

  stage.style.backgroundColor = "tomato";
  return stage;
};
