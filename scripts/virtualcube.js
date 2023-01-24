import { TwistyPlayer } from "https://cdn.cubing.net/js/cubing/twisty"
// import { debugKeyboardConnect } from "https://cdn.cubing.net/js/cubing/bluetooth";
import { Alg, Move, keyToMove } from "https://cdn.cubing.net/js/cubing/alg";
// import { FaceletScaleProp } from "https://cdn.cubing.net/js/cubing/twisty/model/props/puzzle/display/FaceletScaleProp.ts"
import { isMobile } from "./timer.js";
import { keyBoardMappings, keymap } from "./keyboardMappings.js";

let virtMoves
window.virtMoves = virtMoves;
let virtEnabled = false
let updatingKeybind = false

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
    alg: new Alg()
});
virtualCube.style.display = "none"
virtualCube.style.margin = "auto"
virtualCube.style.width = "100%"
virtualCube.style.height = "70%"

timer.prepend(virtualCube);

function processVirtInput(event) {
    let keyCode = event.code
    let isShift = event.shiftKey
    if (keyCode in keymap) {
        let newMove = isShift ? keymap[keyCode][2] : keymap[keyCode][1]
        if (options[2][1]) {
            if (newMove) {
                try {
                    virtualCube.experimentalAddAlgLeaf(new Move(newMove))
                } catch (e) {
                    console.warn('Bad alg leaf ' + newMove + ' ' + e.stackTrace)
                }
            }
        }
        else {
            // virtualCube.experimentalAppendMove(new Move(newMove))
            window.virtMoves += " " + newMove
            virtualCube.alg = window.virtMoves
        }
    }
}

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
    }
    virtEnabled = !virtEnabled
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
    ["Smooth Move Animation",
        false,
        "bool",
        setOption => {
            options[2][1] = !options[2][1]
            window.smoothMovement = options[2][1]
            window.virtMoves = ''
            console.log("move animation " + options[2][1])
        }
    ],
    ["Back Hint Stickers",
        false,
        "bool",
        setOption => {
            options[3][1] ? virtualCube.hintFacelets = "none" : virtualCube.hintFacelets = "floating"
            options[3][1] = !options[3][1]
            console.log("hint stickers now " + options[3][1])
        }
    ],
    // not functional
    // ["Smaller Facelet Size",
    //     false,
    //     "bool",
    //     setOption => {
    //         options[4][1] ? virtualCube.experimentalModel.twistySceneModel.faceletScale = "auto" : virtualCube.experimentalModel.twistySceneModel.faceletScale = .5
    //         options[4][1] = !options[4][1]
    //         console.log("smaller facelet " + options[4][1])
    //     }
    // ],
]

// KEYBINDING RELATED //

const legalMoves = ["U", "R", "L", "D", "B", "F", "M", "E", "S", "u", "r", "l", "d", "b", "f", "x", "y", "z",
    "U'", "R'", "L'", "D'", "B'", "F'", "M'", "E'", "S'", "u'", "r'", "l'", "d'", "b'", "f'", "x'", "y'", "z'",
    "U2", "R2", "L2", "D2", "B2", "F2", "M2", "E2", "S2", "u2", "r2", "l2", "d2", "b2", "f2", "x2", "y2", "z2", ""]

class MoveValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "MoveValidationError";
    }
}

// mapping: String() (if I move to TS then Move[]) with a length of 61 (0-60 indicies), strings should be valid cube moves or ''
function loadKeymap(mapIndex) {
    let prevMap = keymap
    const mapping = keyBoardMappings[mapIndex]["map"]
    const shiftKeyMapping = keyBoardMappings[mapIndex]["shiftMap"]

    let i = 0
    // TODO: make these try/catch?
    for (let entry in keymap) {
        try {
            // add moves to keymap
            if (!legalMoves.includes(mapping[i])) throw new MoveValidationError("selected scheme includes illegal move " + mapping[i] + " in the normal map at position " + i)
            if (!legalMoves.includes(shiftKeyMapping[i])) throw new MoveValidationError("selected scheme includes illegal move " + shiftKeyMapping[i] + " in the shift map at position " + i)

            keymap[entry][1] = mapping[i]
            document.getElementById('key' + i + '-' + entry + 'mappedMove').innerText = mapping[i]

            keymap[entry][2] = shiftKeyMapping[i]
            document.getElementById('key' + i + '-' + entry + 'mappedMoveS').innerText = shiftKeyMapping[i]
            i++
        } catch (e) {
            // revert keymap
            keymap = prevMap
            console.error(e.name, e.message)
            break
        }
    }
}

// Debug func where I manually put in keys, run this function and copypaste the mapping from the console. 
// EDIT = might use this when saving to localStorage
function debugGetMappingFromKeymap() {
    let map = []
    let smap = []

    for (let entry in keymap) {
        map.push(keymap[entry][1])
        smap.push(keymap[entry][1])
    }
    console.log('regular map: ', map)
    console.log('shift map: ', smap)
}


// FRONTEND RELATED //


const tileSize = 50

function initializeVCConfig() {
    let optionsDiv = document.getElementById("vconfigOptions")

    // OPTIONS
    for (let i = 0; i < options.length; i++) {
        let optionDiv = document.createElement('button')
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

// keyElement gets updated
// TODO = change mapping mode to custom
// SHIFT
function updateKey(keyElement, keyCode, isShift) {
    // cancel current keybind attempt
    if (updatingKeybind) document.getElementById('moveKeybindInput').remove()
    updatingKeybind = true

    let awaitingKeystroke = document.createElement('div')
    awaitingKeystroke.id = 'moveKeybindInput'
    awaitingKeystroke.style.position = 'absolute'
    awaitingKeystroke.style.zIndex = '2'
    awaitingKeystroke.style.transform = 'translate(70px, 0px)'
    awaitingKeystroke.style.fontSize = '24px'
    awaitingKeystroke.innerText = 'Type out the move to assign then press enter'
    awaitingKeystroke.style.textAlign = 'center'
    awaitingKeystroke.style.color = '#222'
    awaitingKeystroke.style.backgroundColor = '#ddd'
    awaitingKeystroke.style.width = '400%'
    keyElement.appendChild(awaitingKeystroke)
    // esc to exit
    document.addEventListener('keydown', excHandler)
    function excHandler(e) {
        if (e.key == 'Escape') {
            awaitingKeystroke.remove()
            updatingKeybind = false
            return
        }
    }

    window.inputMoveKeybind = ''
    let form = document.createElement('form')
    let input = document.createElement('input')
    // let inputS = document.createElement('input')
    input.setAttribute('type', 'text');
    // inputS.setAttribute('type', 'text');
    input.style.border = 'none'
    input.style.width = '2em'
    input.style.height = '2em'
    input.style.fontSize = "40px"
    input.style.textAlign = "center"

    form.appendChild(input)
    // form.appendChild(inputS)
    awaitingKeystroke.appendChild(form)
    input.focus()
    form.addEventListener('submit', (e) => {
            e.preventDefault()
            let value = input.value

            // validator
            if (!legalMoves.includes(value)) {
                alert(value + ' is not a valid cube move.')
                updatingKeybind = false
                awaitingKeystroke.remove()
                return
            }

            try {
                console.log("at " + keyCode + `, ${isShift ? "shift+" + keymap[keyCode][2] : keymap[keyCode][1]} is now set to ` + value)
                keyElement.innerText = value
                isShift ? keymap[keyCode][2] = value : keymap[keyCode][1] = value
            } catch (e) {
                console.log(e.message, e)
            }

            updatingKeybind = false
            awaitingKeystroke.remove()
    })
}

// update localstorage and currentkeyMap
function saveCustomKeyBind() { }

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
            if ([4].includes(currkeyboardVisGroup)) { groupDiv.appendChild(createKeybindSpacer(1.2, 'x', 'rgb(96 95 38)')) }
            if ([5].includes(currkeyboardVisGroup)) { groupDiv.appendChild(createKeybindSpacer()) }
        }

        let keyDiv = createKeybindButton(i, keyCode, keymap[keyCode][0], keymap[keyCode][1], keymap[keyCode][2])
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

    keyBoardMappings.forEach((template, i) => {
        let el = document.createElement('div')
        el.classList.add('vconfigButton')
        el.innerText = template["title"]
        el.style.width = 'fit-content'
        el.style.width = 'fit-content'
        el.style.padding = '8px'
        el.style.fontSize = '20px'
        el.style.display = 'inline'
        el.addEventListener('click', () => { loadKeymap(i) })
        document.getElementById('vconfigOptions').appendChild(el)
    })
}

function createKeybindButton(index, code, keyName, mappedMove, mappedMoveS) {
    let el = document.createElement('div')
    el.id = "key" + index + "-" + code
    el.innerText = keyName
    el.style.backgroundColor = '#555'
    el.style.position = 'relative'
    el.style.width = code == 'Numpad0' ? `${2 * tileSize + 14}px` : `${tileSize}px`
    el.style.height = code == 'NumpadAdd' ? `${2 * tileSize + 14}px` : `${tileSize}px`
    el.style.fontSize = '20px'
    el.style.color = '#777'
    el.style.padding = '5px'
    el.style.margin = '2px'

    let move = document.createElement('div')
    move.id = "key" + index + "-" + code + "mappedMove"
    move.innerText = mappedMove
    move.style.fontSize = '30px'
    move.style.color = '#ccc'
    move.style.textAlign = 'right'
    move.style.cursor = 'pointer'
    move.style.zIndex = '2'
    move.addEventListener('click', () => { updateKey(move, code, false) })

    let shiftMove = document.createElement('div')
    shiftMove.id = "key" + index + "-" + code + "mappedMoveS"
    shiftMove.innerText = mappedMoveS
    shiftMove.style.position = 'absolute'
    shiftMove.style.right = '4px'
    shiftMove.style.top = '4px'
    shiftMove.style.width = '50%'
    shiftMove.style.height = '40%'
    shiftMove.style.fontSize = '15px'
    shiftMove.style.color = 'rgb(178 176 71)'
    shiftMove.style.textAlign = 'right'
    shiftMove.style.cursor = 'pointer'
    shiftMove.style.zIndex = '2'
    shiftMove.addEventListener('click', () => { updateKey(shiftMove, code, true) })

    el.appendChild(move)
    el.appendChild(shiftMove)
    return el
}

// tilemult = multipler of default size (tileSize variable)
function createKeybindSpacer(tileMult, axis, color) {
    let el = document.createElement('div')
    el.style.backgroundColor = color || '#444'
    el.style.width = tileMult && (axis == 'x') ? `${tileSize * tileMult}px` : `${tileSize}px`
    el.style.height = tileMult && (axis == 'y') ? `${tileSize * tileMult}px` : `${tileSize}px`
    el.style.padding = '5px'
    el.style.margin = '2px'

    return el
}

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
loadKeymap('0')

window.displayVConfig = displayVConfig
window.closeVConfig = closeVConfig

// TODO - update dark mode, split up VC file into multiple files, saving templates + options, stopping timer when f2l + EO is done), saving of options, ffs clean up the codebase / tsify it
export { virtEnabled, virtualCube, processVirtInput }


