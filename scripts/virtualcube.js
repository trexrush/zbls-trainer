import { TwistyPlayer } from "https://cdn.cubing.net/js/cubing/twisty"
// import { debugKeyboardConnect } from "https://cdn.cubing.net/js/cubing/bluetooth";
// import { Alg, Move, keyToMove } from "https://cdn.cubing.net/js/cubing/alg";
import { isMobile } from "./timer.js";

let virtMoves
window.virtMoves = virtMoves;
let virtEnabled = false

// disable virtual cube controls (for now) if on mobile
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
    experimentalDragInput: "none",
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

const legalMoves = ["U", "R", "L", "D", "B", "F", "M", "E", "S", "u", "r", "l", "d", "b", "f", "x", "y", "z",
    "U'", "R'", "L'", "D'", "B'", "F'", "M'", "E'", "S'", "u'", "r'", "l'", "d'", "b'", "f'", "x'", "y'", "z'",
    "U2", "R2", "L2", "D2", "B2", "F2", "M2", "E2", "S2", "u2", "r2", "l2", "d2", "b2", "f2", "x2", "y2", "z2", ""]

let defaultKeymap = {
    // code of key: move it applies
    "Digit1": ["1", ""],
    "Digit2": ["2", "S'"],
    "Digit3": ["3", ""],
    "Digit4": ["4", "M"],
    "Digit5": ["5", "M"],
    "Digit6": ["6", ""],
    "Digit7": ["7", "M"],
    "Digit8": ["8", "M"],
    "Digit9": ["9", ""],
    "Digit0": ["0", "S"],
    "Minus": ["-", ""],
    "Equal": ["=", ""],

    "KeyQ": ["Q", "z'"],
    "KeyW": ["W", "B"],
    "KeyE": ["E", "L'"],
    "KeyR": ["R", "l"],
    "KeyT": ["T", "x"],
    "KeyY": ["Y", "x"],
    "KeyU": ["U", "r"],
    "KeyI": ["I", "R"],
    "KeyO": ["O", "B'"],
    "KeyP": ["P", "z"],
    "BracketLeft": ["[", ""],
    "BracketRight": ["]", ""],
    "Backslash": ["\\", ""],

    "KeyA": ["A", "y'"],
    "KeyS": ["S", "D'"],
    "KeyD": ["D", "L"],
    "KeyF": ["F", "U'"],
    "KeyG": ["G", "F'"],
    "KeyH": ["H", "F"],
    "KeyJ": ["J", "U"],
    "KeyK": ["K", "R'"],
    "KeyL": ["L", "D"],
    "Semicolon": [";", "y"],
    "Quote": ["\'", ""],

    "KeyZ": ["Z", "d'"],
    "KeyX": ["X", "M'"],
    "KeyC": ["C", "l'"],
    "KeyV": ["V", "x'"],
    "KeyB": ["B", "x'"],
    "KeyN": ["N", ""],
    "KeyM": ["M", "r'"],
    "Comma": [",", "M'"],
    "Period": [".", "d"],
    "Slash": ["/", "d"],

    "Numpad7": ["7", ""],
    "Numpad4": ["4", ""],
    "Numpad1": ["3", ""],
    "NumpadDivide": ["/", ""],
    "Numpad8": ["8", ""],
    "Numpad5": ["5", ""],
    "Numpad2": ["1", ""],
    "NumpadMultiply": ["*", ""],
    "Numpad9": ["9", ""],
    "Numpad6": ["6", ""],
    "Numpad3": ["2", ""],
    "NumpadSubtract": ["-", ""],
    "NumpadAdd": ["+", ""],
    "Numpad0": ["0", ""],
    "NumpadDecimal": [".", ""],

}

let keymap = defaultKeymap

function processVirtInput(keyCode) {
    if (keyCode in keymap) {
        window.virtMoves += " " + keymap[keyCode][1]
        virtualCube.alg = window.virtMoves
    }
}

let options = [
    // [Name of option, default, type of option, onClick]
    // oh dear god I miss you TS and react, take me back please
    ["Drag Rotating with Mouse",
        false,
        "bool",
        setOption => {
            options[0][1] ? virtualCube.experimentalDragInput = "none" : virtualCube.experimentalDragInput = "auto"
            options[0][1] = !options[0][1]
            console.log("Dragging set to " + options[0][1])
        }
    ],
    ["ZBLS Stickering",
        false,
        "bool",
        setOption => {
            options[1][1] ? virtualCube.experimentalStickering = "full" : virtualCube.experimentalStickering = "ZBLS"
            options[1][1] = !options[1][1]
            console.log("ZBLS now " + options[1][1])
        }
    ],
]

const tileSize = 50

function initializeVCConfig() {
    let optionsDiv = document.getElementById("vconfigOptions")

    // OPTIONS
    for (let i = 0; i < options.length; i++) {
        let optionDiv = document.createElement('div')
        optionDiv.innerText = options[i][0]
        if (options[i][2] == "bool") {
            optionDiv.classList.add('vconfigButton', 'vconfigOption')
            optionDiv.addEventListener('click', options[i][3])
        }
        //the only option type I have rn is bool
        else {
            console.warn("Virtual Cube setting " + options[i][0] + " is not a valid option type. This option will not be shown in the config menu.")
            continue
        }
        optionsDiv.appendChild(optionDiv)
    }

    // KEYMAP REBIND
    initializeKeyBindOptions()
}

function initializeKeyBindOptions() {
    let optionsDiv = document.getElementById("vconfigOptions")
    // the values determine where a keyboard grouping ends (ex. the rows of a keyboard)
    let keyboardVisGroupingSplits = [-1, 11, 24, 35, 45, 48, 52, 56, 58, 60]
    let currkeyboardVisGroup = 1

    // the whole keyboard will be shown here
    let keyboardVisDiv = document.createElement('div')
    keyboardVisDiv.style.width = 'fit-content'
    keyboardVisDiv.style.height = 'fit-content'
    keyboardVisDiv.style.padding = '14px'
    keyboardVisDiv.style.display = 'flex'
    keyboardVisDiv.style.justifyContent = 'space-between'

    // characters and digits
    let kDiv = document.createElement('div')
    kDiv.id = 'keyboardKeys'
    kDiv.style.display = 'flex'
    kDiv.style.flexDirection = 'column'
    kDiv.style.width = 'fit-content'
    kDiv.style.height = 'fit-content'
    keyboardVisDiv.appendChild(kDiv)

    // space out keyboard and numpad
    keyboardVisDiv.appendChild(createKeybindSpacer(4.85, 'y'))

    // numpad
    let nDiv = document.createElement('div')
    nDiv.id = 'numberpadKeys'
    nDiv.style.position = 'relative'
    nDiv.style.display = 'flex'
    nDiv.style.flexDirection = 'row'
    nDiv.style.width = 'fit-content'
    nDiv.style.height = 'fit-content'
    keyboardVisDiv.appendChild(nDiv)

    let groupDiv

    // index of a key since keyMap is an object and not an array
    let i = 0
    // tbh not really sure why i didnt loop by group then by key, this works tho
    for (let keyCode in keymap) {
        if (keyboardVisGroupingSplits.includes(i - 1)) {
            groupDiv = document.createElement('div')
            groupDiv.id = "keyboardVisGroup" + currkeyboardVisGroup
            groupDiv.style.display = 'flex'
            groupDiv.style.flexDirection = [1, 2, 3, 4, 9].includes(currkeyboardVisGroup) ? 'row' : 'column'
            groupDiv.style.width = 'fit-content'
            groupDiv.style.height = 'fit-content'
            if ([9].includes(currkeyboardVisGroup)) {
                groupDiv.style.position = 'absolute'
                groupDiv.style.bottom = '0'
                groupDiv.style.left = '0'
            }
            // spacer at the start of the group
            if ([2].includes(currkeyboardVisGroup)) { groupDiv.appendChild(createKeybindSpacer(.4, 'x')) }
            if ([3].includes(currkeyboardVisGroup)) { groupDiv.appendChild(createKeybindSpacer(.8, 'x')) }
            if ([4].includes(currkeyboardVisGroup)) { groupDiv.appendChild(createKeybindSpacer(1.2, 'x')) }
            if ([5].includes(currkeyboardVisGroup)) { groupDiv.appendChild(createKeybindSpacer()) }
        }

        let keyDiv = createKeybindButton(i, keyCode, keymap[keyCode][0], keymap[keyCode][1])
        keyDiv.addEventListener("click", e => updateKey(keyDiv, keyCode))
        groupDiv.appendChild(keyDiv)

        if (keyboardVisGroupingSplits.includes(i)) {
            // spacer at the end of the group
            if ([1].includes(currkeyboardVisGroup)) { groupDiv.appendChild(createKeybindSpacer(1.67, 'x')) }
            if ([3].includes(currkeyboardVisGroup)) { groupDiv.appendChild(createKeybindSpacer(1.87, 'x')) }
            if ([4].includes(currkeyboardVisGroup)) { groupDiv.appendChild(createKeybindSpacer(2.77, 'x')) }
            // bit of a hack 5 gets a spacer solely to accommodate group 9 (0 and . on the numpad)'s absolute positioning
            if ([5, 8, 9].includes(currkeyboardVisGroup)) { groupDiv.appendChild(createKeybindSpacer()) }

            // attach group to the correct part of the keyboard
            if ([1, 2, 3, 4].includes(currkeyboardVisGroup)) { kDiv.appendChild(groupDiv) }
            else { nDiv.appendChild(groupDiv) }

            currkeyboardVisGroup++
        }
        i++
    }

    optionsDiv.appendChild(keyboardVisDiv)
}


function createKeybindButton(index, code, keyName, mappedMove) {
    let el = document.createElement('div')
    el.id = "key" + index + "-" + code
    el.innerText = keyName
    el.style.backgroundColor = '#555'
    el.style.position = 'relative'
    el.style.width = code == 'Numpad0' ? `${2 * tileSize + 14}px` : `${tileSize}px`
    el.style.height = code == 'NumpadAdd' ? `${2 * tileSize + 14}px` : `${tileSize}px`
    el.style.fontSize = '20px'
    el.style.color = '#777'
    el.style.cursor = 'pointer'
    el.style.padding = '5px'
    el.style.margin = '2px'

    let move = document.createElement('div')
    move.id = "key" + index + "-" + code + "mappedMove"
    move.innerText = mappedMove
    move.style.fontSize = '30px'
    move.style.color = '#ccc'
    move.style.textAlign = 'right'

    el.appendChild(move)
    return el
}

// tilesize of one
function createKeybindSpacer(tileMult, axis) {
    let el = document.createElement('div')
    el.style.backgroundColor = '#444'
    el.style.width = tileMult && (axis == 'x') ? `${tileSize * tileMult}px` : `${tileSize}px`
    el.style.height = tileMult && (axis == 'y') ? `${tileSize * tileMult}px` : `${tileSize}px`
    el.style.padding = '5px'
    el.style.margin = '2px'

    return el
}

// mapping: Move[] with a length of 60 (0-59 indicies), strings should be valid cube moves or ''
function loadKeymap(mapping) { }

// keyElement gets updated
function updateKey(keyElement, keyCode) {
    // cancel current keybind attempt
    window.updatingKeybind ? document.getElementById('moveKeybindInput').remove() : ''
    window.updatingKeybind = true

    let awaitingKeystroke = document.createElement('div')
    awaitingKeystroke.id = 'moveKeybindInput'
    awaitingKeystroke.style.position = 'absolute'
    awaitingKeystroke.style.zIndex = '2'
    awaitingKeystroke.style.transform = 'translate(70px, 0px)'
    awaitingKeystroke.innerText = 'Type out the move to assign then press enter'
    awaitingKeystroke.style.color = '#222'
    awaitingKeystroke.style.backgroundColor = '#ddd'
    awaitingKeystroke.style.width = '300%'
    keyElement.appendChild(awaitingKeystroke)
    // esc to exit
    document.addEventListener('keydown', excHandler)
    function excHandler(e) {
        if (e.key == 'Escape') {
            awaitingKeystroke.remove()
            window.updatingKeybind = false
            return
        }
    } 
    
    window.inputMoveKeybind = ''
    let form = document.createElement('form')
    let input = document.createElement('input')
    input.setAttribute('type', 'text');
    form.appendChild(input)
    awaitingKeystroke.appendChild(form)
    input.focus()
    form.onsubmit = e => {
        e.preventDefault()
        let value = input.value
        if (legalMoves.includes(value)) {
            keyElement.childNodes[1].innerText = value
            console.log(keymap[keyCode][1] + " is now set to " + value)
            keymap[keyCode][1] = value
        }
        else {
            alert('' + value + ' is not a valid cube move.')
        }
        awaitingKeystroke.remove()
        window.updatingKeybind = false
    }
}

// update localstorage and currentkeyMap
function saveCustomKeyBind() { }

function displayVConfig() {
    document.getElementById("vconfigWindowBack").style.display = 'initial';
    document.getElementById("vconfigWindow").style.display = 'initial';
}

function closeVConfig() {
    if (document.getElementById("vconfigWindowBack").style.display != 'none') {
        document.getElementById("vconfigWindowBack").style.display = 'none';
        document.getElementById("vconfigWindow").style.display = 'none';
    }
}

initializeVCConfig()

window.displayVConfig = displayVConfig
window.closeVConfig = closeVConfig

// TODO - keymap templates + saving (trainyu, cstimer, custom, empty), smoother / better VC control, stopping timer when f2l + EO is done), saving of options, ffs clean up the codebase / tsify it
export { virtEnabled, virtualCube, processVirtInput }


