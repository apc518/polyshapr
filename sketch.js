"use strict";

//// global variables

let p5canvas = null;
let soundOn = true;
let currentPatch = new Patch(presets[0]); 
let allHowls = [];
let debugLevel = isDevelopmentEnvironment() ? DEBUG_LEVEL_ONE : DEBUG_LEVEL_ZERO;

// physics
let globalSpeed = 1;
let globalProgress = 0;

// root PolyRhythm
let rootPr;

let hits = 0;

function onHit(soundIdx){
    debugLog(DEBUG_LEVEL_TWO, ["onhit called for idx", soundIdx]);
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
    strokeWeight(currentPatch.getCanvasScaledPhysicalStrokeWeight());
    rect(0, 0, canvasWidth, canvasHeight);
    pop();
}


function getProgressIncrement(){
    return globalSpeed * (1 / FRAMERATE) / currentPatch.cycleTime;
}


function incrementGlobalProgress(){
    globalProgress += getProgressIncrement();

    if (Renderer.isRendering && Renderer.globalProgressEnd - globalProgress < getProgressIncrement()){
        Renderer.stopRender();
    }

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
    if (currentPatch.drawBackground)
        background(currentPatch ? currentPatch.backgroundColor : 0);

    for (let i = 0; i < currentPatch.rotateCount; i++){
        push();
    
        let globalRotationProgress = i / currentPatch.rotateCount + (globalProgress % 1) * currentPatch.globalRotationSpeed;
        let v = createVector(0, 1);
        v = v.mult((canvasWidth / 2) / (sin(PI/4))).rotate((2 * PI * globalRotationProgress) + PI * 3 / 4);
        v = v.add(createVector(canvasWidth / 2, canvasHeight / 2));
        translate(v);
        rotate(globalRotationProgress * 2 * PI);
    
        if (currentPatch.drawGlobalBorder){
            drawGlobalBorder();
        }
        frameRate(FRAMERATE);
        rootPr.draw();
    
        pop();
    }

    if(debugLevel >= DEBUG_LEVEL_TWO)
        rootPr.drawBounds();
}

function initializeCurrentPatch(initSounds=false){
    populateColorList();
    if (initSounds) populateSoundList();
    createRootPr();
    updateProjectedMaxFileSize();
}

/**
 * reflect the current patch on the screen, regardless of whether the animation is playing or paused
*/
function fullRefresh(refreshSounds=false){
    if (p5canvas.width != canvasWidth || p5canvas.height != canvasHeight){
        p5canvas.resize(canvasWidth, canvasHeight);
    }
    initializeCurrentPatch(refreshSounds);
    setMasterPolyRhythmProgress();
    paint();
}


function setupPatchUI() {
    setupPresetDropdown();
    setupAnimationModeUI();
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
    strokeWeightSlider.value = strokeWeightToSliderValue(currentPatch.strokeWeight);
}


function setupPresetDropdown(){
    presetDropdown.replaceChildren([]);

    for (let preset of presets){
        if (!preset.patchName){
            console.error("patch had no patchName:", preset);
        }

        let elem = document.createElement('option');
        elem.value = preset.patchName;
        elem.innerText = preset.patchName;

        presetDropdown.appendChild(elem);

        elem.onclick = e => {
            if (e) return; // should only be called from oninput handler for presetDropdown, with no arguments

            currentPatch = new Patch(preset);

            updatePatchUI();
            fullRefresh(true);
        };
    }
}


function setup(){
    noLoop();
    p5canvas = createCanvas(canvasWidth, canvasHeight);
    p5canvas.parent(document.getElementById("p5canvas"));

    let welcomeMessage = Helper.isFirstVisit() ? "Welcome to PolyShapr!" : "Welcome back to PolyShapr!";
    
    Swal.fire({ title: welcomeMessage, icon: 'info', text: "Click OK to enable audio" })
    .then(() => {
        Helper.setNotFirstVisit();
        displayAudioSampleSettings();
        setupPatchUI();
        updatePatchUI();
        globalVolumeSlider.oninput();
        fullRefresh(true);
    });
    
    // if running locally, run tests
    if(isDevelopmentEnvironment())
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

let globalRotation = 0;


/**
 * basically an alias for p5js `draw`, i.e. the function that the gameloop calls
 */
function updateAll(){
    tryPlaySounds();
    let prevGlobProg = globalProgress
    incrementGlobalProgress();
    if (globalProgress % 1 < prevGlobProg % 1){
        debugLog(DEBUG_LEVEL_TWO, ["Loop!"]);
    }
    setMasterPolyRhythmProgress();
    
    paint();
}

/** if no arguments are given the canvas is reset to the default size */
function resizeCanvasAndRefresh(width, height){
    if (width && height){
        canvasWidth = width;
        canvasHeight = height;
    }
    else if (width || height){
        console.error("Must provide either both height and width to resize, or neither to reset canvas size");
        return;
    }
    else{
        canvasWidth = CANVAS_WIDTH_DEFAULT;
        canvasHeight = CANVAS_HEIGHT_DEFAULT;
    }
    
    p5canvas.resize(canvasWidth, canvasHeight);
    debugLog(DEBUG_LEVEL_ONE, [`New canvas size: ${canvasWidth}x${canvasHeight}`]);

    fullRefresh();
}

function toggleHideUI(){
    if (appDrawer.hidden){
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement){
            document.exitFullscreen(p5canvas.canvas);
        }
        appDrawer.hidden = false;
        resizeCanvasAndRefresh();
    }
    else {
        p5canvas.canvas.requestFullscreen();
        appDrawer.hidden = true;
        let newSize = Math.min(window.displayWidth, window.displayHeight);
        resizeCanvasAndRefresh(newSize, newSize);
    }

    bottomControlBar.hidden = appDrawer.hidden;
    footerContainer.hidden = appDrawer.hidden;
}

function mousePressed(){
    debugLog(DEBUG_LEVEL_ONE, [mouseX, mouseY]);
}

function keyPressed(e){
    if (e.target.nodeName.toLowerCase() === "input"){
        return;
    }
    debugLog(DEBUG_LEVEL_ONE, ["key pressed:", keyCode]);
    if (keyCode === F_KEYCODE){
        fWasPressed = true;
        toggleHideUI();
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
}
