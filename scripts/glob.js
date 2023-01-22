// global variables storage
import { loadPresets } from "./presets.js";
import { loadLocal } from "./saveload.js";

let topOr3D = loadLocal("topOr3D", "top"); // "top" = top view, "3D" = 3D view
let indexViewing = 0; // index of time instance currently viewing in timer

function onBodyLoaded() {
    loadPresets();
}

window.topOr3D = topOr3D
window.indexViewing = indexViewing
window.onBodyLoaded = onBodyLoaded
export { topOr3D } // just to get this script to load before selection