import { createStage } from "./stage.js";
import { appendElement, viewportDims } from "./domUtils";
const stage = createStage(viewportDims());

appendElement(stage);
