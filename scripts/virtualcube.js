import { TwistyPlayer } from "https://cdn.cubing.net/js/cubing/twisty"
// import { debugKeyboardConnect } from "https://cdn.cubing.net/js/cubing/bluetooth";
// import { Alg, Move, keyToMove } from "https://cdn.cubing.net/js/cubing/alg";
import { isMobile } from "./timer.js";

let virtMoves
window.virtMoves = virtMoves;
// disable virtual cube controls (for now) if on mobile
var virtEnabled = false

if (isMobile()) {
    document.getElementById("vctoggle").remove();
    document.getElementById("vcoptions").remove();
}
else {
    document.getElementById('vctoggle').addEventListener('click', toggleVC);
}

// fetch container to insert VC
const timer = document.getElementById("timer");

// cubing.js player
const virtualCube = new TwistyPlayer({
    puzzle: "3x3x3",
    hintFacelets: "none",
    backView: "none",
    background: "none",
    controlPanel: "none",
    // experimentalDragInput: "none",
    tempoScale: "5",
    cameraLatitude: 45,
    cameraLongitude: 1,
    cameraLatitudeLimit: 45,
});
virtualCube.style.display = "none"
virtualCube.style.margin = "auto"
virtualCube.style.width = "100%"
virtualCube.style.height = "70%"

timer.prepend(virtualCube);

function toggleVC() {
    if (virtEnabled) {
        // DISABLE VC

        document.getElementById("vcoptions").style.display = "none"
        document.getElementById("vctoggle").innerHTML = `Enable Virtual Cube`
        document.getElementById("vctoggle").style.backgroundColor = "#c6cbcb"

        document.querySelector("twisty-player").style.display = "none";
    }
    else {
        // ENABLE VC

        document.getElementById("vcoptions").style.display = null
        document.getElementById("vctoggle").innerHTML = `<b>Disable Virtual Cube</b>`
        document.getElementById("vctoggle").style.backgroundColor = "#95a5a6"


        document.querySelector("twisty-player").style.display = "grid";
        // timer.innerText = ""

    }

    virtEnabled = !virtEnabled
}

let keymap = {
    73: "R",
    75: "R'",
    69: "L'",
    68: "L",
    74: "U",
    70: "U'",
    72: "F",
    71: "F'",
    83: "D",
    76: "D'",
    87: "B",
    79: "B'",
    78: "x'",
    67: "l",
    82: "l'",
    85: "r",
    77: "r'",
    88: "d",
    188: "d'",
    84: "x",
    89: "x",
    66: "x'",
    186: "y",
    59: "y",
    65: "y'",
    80: "z",
    81: "z'",
    90: "M'",
    190: "M'",
}

function processVirtInput(keyCode) {
    if (keyCode in keymap) {
        window.virtMoves += " " + keymap[keyCode]
        virtualCube.alg = window.virtMoves
    }
}

// TODO - configurable keymaps, sticker masking (VHLS filter like in twizzle), smoother / better VC control, stopping timer when f2l + EO is done)
export { virtEnabled, virtualCube, processVirtInput }


