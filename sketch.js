"use strict";

//// global variables

let p5canvas = null;
let soundOn = true;
let currentPatch = new Patch(presets[0]);
let allHowls = [];

// physics
let globalSpeed = 1;
let globalProgress = 0;

// root PolyRhythm
let rootPr;

let hits = 0;

function onHit(soundIdx){
    debugLog("onhit called for idx", soundIdx);
    hits += 1;

    // color ripple
    if (currentPatch.doColorRipple && isLooping()){
        colorList.push(colorList.shift());
    }

    soundList[mod(soundIdx, soundList.length)].on = true;
}


/**
 * soundList consists of Sound objects with a boolean `on` property and a `snd` property upon
 * which we can call .play()
 * 
 * When polyrhythms hit a boundary, they will set their `on` property to true, and
 * we may then choose to play it.
 * 
 * After every frame, all the `on` properties must be set to false.
 */
const soundList = [];

function logb(base, x) {
    return Math.log(x) / Math.log(base);
}


function convertSliderValueToAmplitude(sliderVal) {
    // use exponential scale to go from 0 to 1 so the volume slider feels more natural
    const tension = 50; // how extreme the curve is (higher = more extreme, slower start faster end)
    const n = 1 / (1 - logb(1 / tension, 1 + (1 / tension)));         
    const val = Math.pow(1 / tension, 1 - (sliderVal / 100) / n) - 1 / tension;
    return val;
}


function playPause(){
    if (isLooping()) pause_();
    else play_();
}


function play_(){
    try{
        rootPr.playIfOnBounds();
    }catch(e){}
    
    loop();
    playPauseBtn.textContent = "Pause";
}


function pause_(){
    noLoop();
    playPauseBtn.textContent = "Play";
}


function drawGlobalBorder(){
    // draw a border
    push();
    noFill();
    stroke(255);
    strokeWeight(currentPatch.strokeWeight);
    rect(0, 0, canvasWidth, canvasHeight);
    pop();
}


function getProgressIncrement(){
    return globalSpeed * (1 / FRAMERATE) / currentPatch.cycleTime;
}


function incrementGlobalProgress(){
    globalProgress += getProgressIncrement();

    // update global progress slider accordingly
    globalProgressSlider.value = globalProgress * PROGRESS_SLIDER_RESOLUTION % PROGRESS_SLIDER_RESOLUTION;
}


function setMasterPolyRhythmProgress(){
    rootPr.setProgress(globalProgress, getProgressIncrement());
}


/**
 * paint the screen without updating physics
 */
function paint(){
    background(currentPatch ? currentPatch.backgroundColor : 0);
    drawGlobalBorder();
    frameRate(FRAMERATE);
    rootPr.draw();

    if(DEBUG)
        rootPr.drawBounds();
}

function initializeCurrentPatch(){
    clearColorList();
    populateColorList();
    clearSoundList();
    populateSoundListFromPreset();
    createRootPr();
}

/**
 * reflect the current patch on the screen, regardless of whether the animation is playing or paused
*/
function fullRefresh(){
    initializeCurrentPatch();
    setMasterPolyRhythmProgress();
    paint();
}


function setupPatchUI() {
    setupAnimationModeUI();
    setupPresetDropdown();
    setupRhythmUI();
    setupPitchUI();
    setupColorUI();
}


/**
 * show the settings of the current patch in the settings UI
*/
function updatePatchUI(){
    updateAudioSampleUI();
    updateAnimationModeUI();
    updateRhythmUI();
    cycleTimeInput.value = currentPatch.cycleTime;
    updatePitchUI();
    updateColorUI();
    colorRippleCheckbox.checked = currentPatch.doColorRipple;
    strokeWeightSlider.value = currentPatch.strokeWeight * strokeWeightSliderResolution;
}


function setupPresetDropdown(){
    for (let preset of presets){
        if (!preset.patchName){
            console.error("patch had no patchName:", patch);
        }

        let elem = document.createElement('option');
        elem.value = preset.patchName;
        elem.innerText = preset.patchName;

        presetDropdown.appendChild(elem);

        elem.onclick = e => {
            if (e) return; // should only be called from oninput handler for presetDropdown, with no arguments

            currentPatch = preset;

            updatePatchUI();
            fullRefresh();
        };
    }
}


function setup(){
    noLoop();
    p5canvas = createCanvas(canvasWidth, canvasHeight);
    p5canvas.parent(document.getElementById("p5canvas"));

    playbackSettingsDetails.open = true;
    patchSettingsDetails.open = true;

    let welcomeMessage = Helper.isFirstVisit() ? "Welcome to PolyShapr!" : "Welcome back to PolyShapr!";
    
    Swal.fire({ title: welcomeMessage, icon: 'info', text: "Click OK to enable audio" })
    .then(() => {
        Helper.setNotFirstVisit();
        displayAudioSampleSettings();
        setupPatchUI();
        updatePatchUI();
        globalVolumeSlider.oninput();
        fullRefresh();
    });
    
    // if running locally, run tests
    if(["127.0.0.1", "localhost"].includes(window.location.hostname))
        runTests();
}


function tryPlaySounds(){
    // print(soundList.map(s => s.on).filter(a => a));
    if(soundOn) soundList.filter(s => s.on).forEach(s => s.play());
    soundList.forEach(s => {s.on = false});
}


// I want my frame update function to be called `updateAll` but
// p5 calls it `draw` and I dont want to implement the game loop
function draw() { 
    if (!p5canvas) return;
    if (!isLooping()) return;
    
    updateAll();
}

/**
 * basically an alias for p5js `draw`, i.e. the function that the gameloop calls
 */
function updateAll(){
    tryPlaySounds();
    let prevGlobProg = globalProgress
    incrementGlobalProgress();
    if (globalProgress % 1 < prevGlobProg % 1){
        debugLog("Loop!");
    }
    setMasterPolyRhythmProgress();
    paint();
}

function keyPressed(e){
    if (e.target.nodeName.toLowerCase() === "input"){
        return;
    }
    if (keyCode === SPACE_KEYCODE){
        playPause();
    }
    if(keyCode === RIGHT_ARROW){
        incrementGlobalProgress();
        setMasterPolyRhythmProgress();
        paint();
    }
    if(keyCode === LEFT_ARROW){
        globalSpeed *= -1;
        incrementGlobalProgress();
        globalSpeed *= -1;
        setMasterPolyRhythmProgress();
        paint();
    }

    // up and down arrow transpose by a semitone
    if(keyCode === UP_ARROW_KEYCODE || keyCode === DOWN_ARROW_KEYCODE){
        // it just so happens that up is 38 and down is 40 so we can do
        // some clever math hehe
        let transposition = 39 - keyCode;
        
        // let newNoteSpeeds = Array.from(notes, n => Math.pow(2, (n + transposition)/12));
        if (currentPatch.pitchMode === TUNING_MODES.RAW){
            currentPatch.pitchMultiplier *= Math.pow(2, transposition / 12);
        }
        else if (currentPatch.pitchMode === TUNING_MODES.EDO12){
            currentPatch.pitchOffset += transposition;
        }

        fullRefresh();
    }
}
