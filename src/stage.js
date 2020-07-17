export const createStage = (dims = { w: 300, h: 300 }) => {
  const stage = document.createElement("canvas");
  stage.id = "stage";
  stage.width = dims.w;
  stage.height = dims.h;

  stage.style.backgroundColor = "tomato";
  return stage;
};
