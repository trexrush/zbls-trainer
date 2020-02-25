var allowStartingTimer;
/// invokes generateScramble() and sets scramble string
function showScramble()
{
    window.allowStartingTimer = false;
    var s;
    if (selCases.length == 0)
        s = "click \"select cases\" above and pick some ZBLLs to practice";
    else {
        s = "scramble: " + generateScramble();
        window.allowStartingTimer = true;
    }

    document.getElementById("scramble").innerHTML = s;
}

function randomElement(arr)
{
    return arr[Math.floor(Math.random()*arr.length)];
}

var lastScramble = "";
var lastZbllCase = "";

function displayPracticeInfo() {
    var s = " | <b> " + window.selCases.length + "</b> selected";
    if (window.recaps.length > 0)
        s += " | <b>" + window.recaps.length + "</b> to recap";

    document.getElementById("selInfo").innerHTML = s;
}

function generateScramble()
{
    displayPracticeInfo();
    // get random case
    var zbllCase;
    if (recaps.length == 0) {
        // train mode
        zbllCase = randomElement(window.selCases);
    } else {
        // recap mode: select the case
        zbllCase = randomElement(window.recaps);
        // remove it from the array
        const index = window.recaps.indexOf(zbllCase);
        window.recaps.splice(index, 1);
    }
    var alg = inverse_scramble(randomElement(zbllCase.algs));
    var finalAlg = applyRotationButLessB(alg);

    window.lastScramble = finalAlg;
    window.lastZbllCase = zbllCase;

    return finalAlg;
}

// shuffles array in place. \param a an array containing the items.
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

// applies 2 random 'y' rotations to the given \param alg and returns the one with less B moves in it
function applyRotationButLessB(alg) {
    var yArr = shuffle(["", "y", "y2", "y'"]);
    let a1 = applyRotationForAlgorithm(alg, yArr[0]);
    let a2 = applyRotationForAlgorithm(alg, yArr[2]);

    let numB1 = (a1.match(/B/g) || []).length;
    let numB2 = (a2.match(/B/g) || []).length;

    return numB1 < numB2 ? a1 : a2;
}

// http://stackoverflow.com/questions/15604140/replace-multiple-strings-with-multiple-other-strings
function replaceAll(str,mapObj) {
    if (!mapObj)
        return str;
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");

    return str.replace(re, function(matched){
        return mapObj[matched];
    });
}

// returns new string with transformed algorithm.
// Returnes sequence of moves that get the cube to the same position as (alg + rot) does, but without cube rotations.
// Example: applyRotationForAlgorithm("R U R'", "y") = "F U F'"
function applyRotationForAlgorithm(alg, rot)
{
    var mapObj;
    if (rot=="y")
        mapObj = {R:"F",F:"L",L:"B",B:"R"};
    if (rot=="y'")
        mapObj = {R:"B",B:"L",L:"F",F:"R"};
    if (rot=="y2")
        mapObj = {R:"L",L:"R",B:"F",F:"B"};

    return replaceAll(alg, mapObj);
}

function inverse_scramble(s)
{
    if (s == "noAuf")
        return s;
    var arr = s.split(" ");
    var result = "";
    for (var i = 0; i < arr.length; i++)
    {
        var it = arr[i];
        if (it.length == 0)
            continue;
        if (it[it.length - 1] == '2')
            result = it + " " + result;
        else if (it[it.length - 1] == '\'')
            result = it.substr(0, it.length - 1) + " " + result;
        else
            result = it + "' " + result;
    }

    return result.substr(0, result.length-1);
}

/*        TIMER        */

var startMilliseconds, stopMiliseconds; // date and time when timer was started
var allowed = true; // allowed var is for preventing auto-repeat when you hold a button
var running = false; var waiting = false;
var timer = document.getElementById("timer");

function isMobile() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

welcomeMessage = isMobile() ? "touch to start" : "ready";
timer.innerHTML = welcomeMessage;

var timerActivatingButton = 32; // 17 for ctrl
var timeout;

function msToHumanReadable(duration) {
    if (!Number.isFinite(duration))
        return "-";
    var milliseconds = parseInt((duration%1000)/10)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10 && (minutes > 0 || hours > 0)) ? "0" + seconds : seconds;
    milliseconds = (milliseconds < 10) ? "0" + milliseconds : milliseconds;

    hoursString = (hours == 0) ? "" : hours + ":";
    minutesString = (minutes == 0) ? "" : minutes + ":";

    return hoursString + minutesString + seconds + "." + milliseconds;
}

function displayTime() {
    if (running)
    {
        var d = new Date();
        var diff = d.getTime() - window.startMilliseconds;
        if (diff >= 0)
            timer.innerHTML = msToHumanReadable(diff);
    }
}

/// handles keypup and keydown events. Starts timer etc.
document.getElementById("bodyid").addEventListener("keydown", function(event) {
    // delete hotkey - remove last
    if (event.keyCode == 46 && !running)
    {
        if (!!window.event.shiftKey)
            confirmClear();
        else
            confirmRemLast();
        return;
    }

    if (!allowed || !window.allowStartingTimer)
        return; // preventing auto-repeat and empty scrambles

    if (event.keyCode != 16) // shift
        allowed = false;

    if (running)
    {
        // stop timer on any button
        timerStop();
        return;
    }
    else if (event.keyCode == timerActivatingButton && currentMode != 0)
    {
        timerSetReady();
        return;
    }
});

/// keyup event for starting the timer
document.getElementById("bodyid").addEventListener("keyup", function(event) {
    allowed = true;
    if (!window.allowStartingTimer)
        return; // preventing auto-repeat
    if (!running && !waiting && (event.keyCode == timerActivatingButton) && currentMode != 0) {
        timerStart();
    }
    else {
        timerAfterStop();
    }
});

timer.addEventListener("touchstart", handleTouchStart, false);
timer.addEventListener("touchend", handleTouchEnd, false);

function handleTouchEnd() {
    if (!window.allowStartingTimer)
        return; // preventing auto-repeat
    if (!running && !waiting) {
        timerStart();
    }
    else {
        timerAfterStop();
    }
}

function handleTouchStart() {
    if (running)
        timerStop();
    else {
        timerSetReady(); // set green back
    }
}

function timerStop() {
    waiting = true;
    running = false;
    clearTimeout(timeout);

    var d = new Date();
    stopMiliseconds = d.getTime();
    timer.innerHTML = msToHumanReadable(stopMiliseconds - startMilliseconds);
    timer.style.color = "#850000";

    appendStats();
    showScramble();
}

function timerSetReady() {
    waiting = false;
    timer.innerHTML = "0.00";
    timer.style.color = "#008500";
}

function timerStart() {
    var d = new Date();
    startMilliseconds = d.getTime();
    running = true;
    timeout = setInterval(displayTime, 10);
    timer.style.color = document.getElementById( "textcolor_in" ).value;
}

function timerAfterStop() {
    timer.style.color = document.getElementById( "textcolor_in" ).value;
}


// sizes. Too tired, cannot produce normal code
var defTimerSize = 60;
var defScrambleSize = 25;
var timerSize = parseInt(loadLocal("zblltimerSize", ''));
if (isNaN(timerSize) || timerSize <= 0)
    timerSize = defTimerSize;
var scrambleSize = parseInt(loadLocal("zbllscrambleSize",''));
if (isNaN(scrambleSize) || scrambleSize <= 0)
    scrambleSize = defScrambleSize;

adjustSize('scramble', 0);
adjustSize('timer', 0);

function adjustSize(item, inc)
{
    if (item == 'timer')
    {
        window.timerSize += inc
        document.getElementById('timer').style.fontSize = window.timerSize + "px";
        saveLocal("zblltimerSize", window.timerSize);
    }

    if (item == 'scramble')
    {
        window.scrambleSize += inc
        document.getElementById('scramble').style.fontSize = window.scrambleSize + "px";
        saveLocal("zbllscrambleSize", window.scrambleSize);
    }
}

function resetDefaults()
{
    window.timerSize = defTimerSize;
    window.scrambleSize = defScrambleSize;
    adjustSize('scramble', 0);
    adjustSize('timer', 0);
}

/* STATS */

// http://stackoverflow.com/questions/1787322/htmlspecialchars-equivalent-in-javascript
function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

/// [0: ResultInstance, 1: ResultInstance, ...]
var timesArray = [];
try {
    var loadedTa = JSON.parse(loadLocal("zblltimesarray", '[]'));
    if (loadedTa != null)
        timesArray = loadedTa;
} catch (e) {
    console.warn("can\'t load times. Running ZBLL trainer for the first time?");
}
displayStats();

// invoked right after the timer stopped
function appendStats()
{
    // assuming the time can be grabbed from timer label, and the case - window.lastPllCaseName
    window.timesArray.push(makeResultInstance());
    displayStats();
}

/// removes time from array and invokes displayStats()
function removeTime(i)
{
    window.timesArray.splice(i, 1);
    displayStats();
}

/// requests confirmation and deletes result
function confirmRem(i)
{
    var inst = window.timesArray[i];
    if (confirm("Are you sure you want to remove this time?\n\n" + inst["time"]))
    {
        removeTime(i);
        updateInstancesIndeces();
        displayStats();
    }
}

function changeSelection(i) {
    var r = window.timesArray[i];
    var selected = !(window.zbllMap[r["oll"]][r["coll"]][r["zbll"]]["c"]);
    window.zbllMap[r["oll"]][r["coll"]][r["zbll"]]["c"] = selected;
    document.getElementById("changeSelBtn").innerHTML = selected ? "yes" : "no";
    fillSelected();
    //showScramble();
    displayPracticeInfo();
}

function confirmRemLast()
{
    var i = window.timesArray.length;
    if (i != 0)
        confirmRem(i - 1);
}

/// requests confirmation and empty times array (clear session)
function confirmClear()
{
    if (confirm("Are you sure you want to clear session?")) {
        window.timesArray = [];
        displayStats();
    }
}

/// \param i index of result instance
function timeClicked(i) {
    fillResultInfo(window.timesArray[i]);
}

/// \param r - result instance (see makeResultInstance)
/// \returns html code for displaying a single instance
function makeResultLabelHtml(r) {
    return "<span class='timeResult' onclick='timeClicked(" + r["index"] + ")'>" + r["time"] + "</span>";
}

/// calculates preview picture size based on the available space we have
function getPicSize() {
    var pictureTop = document.getElementById("previewPic").getBoundingClientRect().top;
    var cRect = document.getElementById("resultinfo").getBoundingClientRect();
    var minSize = Math.min(cRect.top + cRect.height - pictureTop, cRect.width);
    return Math.max(50, Math.round(minSize) - 5);
}

/// fills resultInfo container with info about given result instance
/// \param r result instsnce (see makeResultInstance)
/// set \param r to null if you want to clear result info
function fillResultInfo(r) {
    var picContainer = document.getElementById("resultPicContainer");
    if (r != null) {
        // header
        var delBtn = "<a style='color: " + document.getElementById("linkscolor_in").value + "'" +
                    "onclick='confirmRem(" + r["index"] + ")'>"+
                    "delete</a>";
        document.getElementById("resultInfoHeader").innerHTML = "result #" + (r["index"] + 1) + "<b>: " + r["time"]
                + "</b> (" +  delBtn + ")";
        var s = "";
        s += "<b>Scramble</b>: " + r["scramble"] + "<br>";
        s += "<b>Case</b>: " + r["oll"] +"-"+ r["coll"] +", "+ r["zbll"].replace("s", "/") + "<br>";
        s += "<b>Selected</b>: <a id='changeSelBtn' style='color: " +
            document.getElementById("linkscolor_in").value +
            "' onclick='changeSelection(" + r["index"] + ")'>"+
            (window.zbllMap[r["oll"]][r["coll"]][r["zbll"]]["c"] ? "yes" : "no") + "</a><br>";


        document.getElementById("resultInfoContainer").innerHTML = s;
        // picture from visualcube
        var picurl = "http://cube.crider.co.uk/visualcube.php?fmt=svg&bg=t&stage=ll&r=y35x-30&alg=" +
            encodeURI(r["scramble"]).replace(/\'/g, "%27");
        picContainer.innerHTML = "<img id='previewPic' src='" + picurl + "'/>";
        picContainer.style.height = getPicSize() + "px";
    }
    else {
        document.getElementById("resultInfoHeader").innerHTML = "results info will be displayed there";
        document.getElementById("resultInfoContainer").innerHTML = "";
        picContainer.innerHTML = "";
    }

}

/// calculates average of \param n in window.timesArray in interval from (end-n, end]
function getAverage(end, n) {
    if (end < n-1)
        return Infinity;
    var sum = 0, ms, best=Infinity, worst=-1;
    for (var i = end; i > end-n; i--) {
        ms = window.timesArray[i]["ms"];
        if (ms < best)
            best = ms;
        if (ms > worst)
            worst = ms;
        sum += ms;
    }
    return (sum-best-worst)/(n-2);
}

/// displays averages etc.
function displayStatsBox() {
    var len = window.timesArray.length;
    document.getElementById("resultInfoHeader").innerHTML = "stats: " + len + " solves";
    document.getElementById("resultPicContainer").innerHTML = "";
    var s = "";
    if (len > 1) {
        var best = Infinity, worst = -1, sum = 0, bestIns, worstIns, bestAo5 = best, bestAo12 = best, ao5, ao12;
        for (var i = 0; i < len; i++) {
            var ms = window.timesArray[i]["ms"];
            sum += ms;
            // best and worst
            if (ms < best) {
                best = ms;
                bestIns = window.timesArray[i];
            } if (ms > worst) {
                worst = ms;
                worstIns = window.timesArray[i];
            }
            // averages
            ao5 = getAverage(i, 5);
            if (ao5 < bestAo5)
                bestAo5 = ao5;
            ao12 = getAverage(i, 12);
            if (ao12 < bestAo12)
                bestAo12 = ao12;
        }
        s += "best time: " + makeResultLabelHtml(bestIns) + "<br>";
        s += "worst time: " + makeResultLabelHtml(worstIns) + "<br><br>";
        s += "current ao5: " + msToHumanReadable(ao5) + "<br>";
        s += "best ao5: " + msToHumanReadable(bestAo5) + "<br><br>";
        s += "current ao12: " + msToHumanReadable(ao12) + "<br>";
        s += "best ao12: " + msToHumanReadable(bestAo12) + "<br><br>";
        s += "session avg: " + msToHumanReadable((sum-best-worst)/(len-2)) + "<br>";
        s += "session mean: " + msToHumanReadable(sum/len) + "<br>";
    }

    document.getElementById("resultInfoContainer").innerHTML = s;
}

/// fills "times" right panel with times and last result info
function displayStats() {
    saveLocal("zblltimesarray", JSON.stringify(window.timesArray));
    var len = window.timesArray.length

    var el = document.getElementById("times");
    el.innerHTML = "";

    if (len == 0) {
        fillResultInfo(null);
        return;
    }

    for (var i = 0; i < window.timesArray.length; i++) {
        el.innerHTML += makeResultLabelHtml(window.timesArray[i]);
        if (i != len - 1)
            el.innerHTML += ", ";
    }
    fillResultInfo(window.timesArray[window.timesArray.length - 1]);
}

/// foreach result instances, assign its index to number in array.
/// might be helpful after user deleted the time
function updateInstancesIndeces() {
    for (var i = 0; i < window.timesArray.length; i++)
        window.timesArray[i]["index"] = i;
}

function makeResultInstance() {
    var currentTime = document.getElementById("timer").innerHTML;
    return {
        "time": currentTime,
        "scramble": window.lastScramble,
        "name": window.lastZbllCase.name,
        "ms": timeStringToMseconds(currentTime) * 10, // *10 because current time 1.23 display only hundreths, not thousandth of a second
        "index": window.timesArray.length,
        "oll": window.lastZbllCase.oll,
        "coll": window.lastZbllCase.coll,
        "zbll": window.lastZbllCase.zbll,
    };
}

// converts timestring to milliseconds (int)
// 1:06.15 -> 6615
function timeStringToMseconds(s) {
        if (s == "")
            return -1;
        var parts = s.split(":");
        var secs = parseFloat(parts[parts.length - 1]);
        if (parts.length > 1) // minutes
            secs += parseInt(parts[parts.length - 2]) * 60;
        if (parts.length > 2) // hrs
            secs += parseInt(parts[parts.length - 3]) * 3600;
        if (isNaN(secs))
            return -1;
        return Math.round(secs * 100);
}

//saves to localstorage
function savestyle() {
    try {
        localStorage.setItem('bgcolor_in', document.getElementById("bgcolor_in").value);
        localStorage.setItem('textcolor_in', document.getElementById("textcolor_in").value);
        localStorage.setItem('linkscolor_in', document.getElementById("linkscolor_in").value);
        return true;
    }
    catch(e) { return false; }
}

//loads from localstorage
function loadstyle() {
    try {
        var bgcolor = localStorage.getItem('bgcolor_in');
        if (bgcolor.length > 0) {
            document.getElementById("bgcolor_in").value = localStorage.getItem('bgcolor_in');
            document.getElementById("textcolor_in").value = localStorage.getItem('textcolor_in');
            document.getElementById("linkscolor_in").value = localStorage.getItem('linkscolor_in');
            return true;
        }
    }
    catch(e) { return false; }
}

function applystyle() {
    document.getElementById("bodyid").style.backgroundColor = document.getElementById("bgcolor_in").value;
    document.getElementById("bodyid").style.color = timer.style.color = document.getElementById("textcolor_in").value;
    var inputs = document.getElementsByClassName("settinginput");
    Array.prototype.forEach.call(inputs, function(el) {
        el.style.backgroundColor = document.getElementById("bgcolor_in").value;
        el.style.color = document.getElementById("textcolor_in").value;
    });
    var links = document.getElementsByTagName("a");
    Array.prototype.forEach.call(links, function(el) {
        el.style.color = document.getElementById("linkscolor_in").value;
    });
    savestyle();
}

function resetStyle(dark) {
    document.getElementById("bgcolor_in").value = dark ? "#161616" : "#f5f5f5";
    document.getElementById("textcolor_in").value = dark? "white" : "black";
    document.getElementById("linkscolor_in").value = dark ? "#0ff" : "#004411";
    applystyle();
    savestyle();
}

function toggleColorSettings() {
    var d = document.getElementById("colorSettings").style.display;
    console.log(d);
    document.getElementById("colorSettings").style.display = (d == "inline") ?  "none" : "inline";
    console.log(document.getElementById("colorSettings").style.display);
}

// add key listeners to blur settings inputs
var inputs = document.getElementsByClassName("settinginput");
Array.prototype.forEach.call(inputs, function(el) {
    el.addEventListener("keydown", function(event) {
        if (event.keyCode == 13 || event.keyCode == 32 || event.keyCode == 27) {
            event.preventDefault()
            el.blur();
        }
    });

});

loadstyle();
applystyle();
