"use strict";

// global variables
let p5canvas = null;
let soundOn = true;
let debug = false;

// physics
let globalSpeed = 1;
let globalProgress = 0;

// root PolyRhythm
let master_pr;

// visual variables
let doColorRipple = false;

let currentPatch = new Patch(presets[0]);
let transposition = 0;

let hitForgiveness = 1;

const prOptions = {}

prOptions[ANIMATION_MODES.SQUARES] = () => {
    if (currentPatch) {
        debugLog("squares with", currentPatch);
        master_pr = squarePolyRhythmRecursive();
    }
    else{
        // TODO: pop up an error message? set to some basic pr?
    }
}

prOptions[ANIMATION_MODES.TRIANGLES] = () => {
    if (currentPatch){
        debugLog("triangles with ", currentPatch);
        master_pr = trianglePolyrhythmRecursive();
    }
}

prOptions[ANIMATION_MODES.NGONS] = () => {
    if(currentPatch){
        debugLog("ngons with ", currentPatch);
        while (currentPatch.skips.length < currentPatch.rhythms.length){
            currentPatch.skips.push(0);
        }
        master_pr = makeNGonRecursive();
    }
    else{

    }
}

// set up event handlers for the pressing of each animation mode button
for (let option of [ANIMATION_MODES.NGONS, ANIMATION_MODES.SQUARES, ANIMATION_MODES.TRIANGLES]){
    // the html elem id for the corresponding radio button for a given animation mode
    // should be the mode plus "OptionBtn"
    let elem = document.getElementById(option + "OptionBtn");
    elem.onclick = () => {
        currentPatch.animationMode = option;
        clearColorList();
        populateColorList(currentPatch);
        clearSoundList();
        populateSoundList(currentPatch);
        prOptions[option]();

        if (!isLooping()){
            setMasterPolyRhythmProgress();
            paint();
        }
    };
}


function onHit(soundIdx){
    debugLog("onhit called for idx", soundIdx);

    // color ripple
    if (currentPatch.doColorRipple){
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

globalVolumeSlider.oninput({ target: globalVolumeSlider })

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
        master_pr.playIfOnBounds();
    }catch(e){}
    
    loop();
    playPauseBtn.textContent = "Pause";
}


function pause_(){
    noLoop();
    playPauseBtn.textContent = "Play";
}


function multiplyGlobalPitch(n){
    soundList.forEach(s => s.setRate(s.initial_speed * n));
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
    master_pr.setProgress(globalProgress, getProgressIncrement());
}


/**
 * paint the screen without updating physics
 */
function paint(){
    background(currentPatch ? currentPatch.backgroundColor : 0);
    drawGlobalBorder();
    frameRate(FRAMERATE);
    master_pr.draw();

    if(debug)
        master_pr.drawBounds();
}

/**
 * reflect the current patch on the screen, regardless of whether the animation is playing or paused
 */
function fullRefresh(){
    initializeCurrentPatch();
    setMasterPolyRhythmProgress();
    paint();
}

function initializeCurrentPatch(){
    document.getElementById(currentPatch.animationMode + "OptionBtn").click();
}

function setup(){
    noLoop();
    p5canvas = createCanvas(canvasWidth, canvasHeight);
    p5canvas.canvas.style.marginTop = "1rem";

    fullRefresh();
    
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
        console.log("Loop!");
    }
    setMasterPolyRhythmProgress();
    paint();
}

function keyPressed(){
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
        transposition += 39 - keyCode;
        
        // let newNoteSpeeds = Array.from(notes, n => Math.pow(2, (n + transposition)/12));
        multiplyGlobalPitch(Math.pow(2, transposition / 12));

        console.log(soundList);
    }
}