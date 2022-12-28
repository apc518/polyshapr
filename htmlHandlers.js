"use strict";

// html elements
const playPauseBtn = document.getElementById("playpausebtn");
const resetBtn = document.getElementById("resetbtn");
const soundOnCheckbox = document.getElementById("soundOnCheckbox");
const animationModeButtons = document.getElementById("animationModeButtons");
const globalSpeedSlider = document.getElementById("globalSpeedSlider");
const globalSpeedIndicator = document.getElementById("globalSpeedIndicator");
const globalSpeedResetBtn = document.getElementById("globalSpeedResetBtn");
const globalVolumeSlider = document.getElementById("globalVolumeSlider");
const globalVolumeResetBtn = document.getElementById("globalVolumeResetBtn");
const globalProgressSlider = document.getElementById("globalProgressSlider");
const strokeWeightSlider = document.getElementById("strokeWeightSlider");
const strokeWeightSliderResetBtn = document.getElementById("strokeWeightSliderResetBtn");
const rhythmListInput = document.getElementById("rhythmListInput");
const rhythmModeDropdown = document.getElementById("rhythmModeDropdown");
const rhythmListCountInput = document.getElementById("rhythmListCountInput");
const rhythmListOffsetInput = document.getElementById("rhythmListOffsetInput");
const rhythmListIsReversedCheckbox = document.getElementById("rhythmListIsReversedCheckbox");


// html elem event listeners
playPauseBtn.onclick = e => {
    e.target.blur();
    playPause();
}

resetBtn.onclick = e => {
    e.target.blur();
    globalProgress = 0;
    try{
        master_pr.reset();
    }catch(e){}

    pause_();
    globalProgressSlider.value = 0;
    globalProgressSlider.oninput({ target: globalProgressSlider })
    paint();
}

soundOnCheckbox.checked = true;
soundOnCheckbox.oninput = e => {
    e.target.blur();
    soundOn = e.target.checked;
}

const globalSpeedSliderMax = Math.max(1, parseInt(globalSpeedSlider.max))
globalSpeedSlider.value = globalSpeedSliderMax / 2;
globalSpeedSlider.oninput = e => {
    globalSpeed = Math.pow(1/10, (1 - e.target.value * 2 / globalSpeedSliderMax));
    globalSpeedIndicator.innerText = globalSpeed.toFixed(2);
}

globalSpeedResetBtn.onclick = e => {
    e.target.blur();
    globalSpeedSlider.value = globalSpeedSliderMax / 2;
    globalSpeedSlider.oninput({target: globalSpeedSlider});
}

globalVolumeSlider.value = parseInt(globalVolumeSlider.max) / 2;
globalVolumeSlider.oninput = e => {
    Howler.volume(convertSliderValueToAmplitude(e.target.value));
}

globalVolumeResetBtn.onclick = e => {
    e.target.blur();
    globalVolumeSlider.value = 50;
    globalVolumeSlider.oninput({target: globalVolumeSlider})
}

globalProgressSlider.value = 0;

globalProgressSlider.oninput = e => {
    globalProgress = Math.floor(globalProgress) + Math.min(e.target.value, PROGRESS_SLIDER_RESOLUTION - 1) / PROGRESS_SLIDER_RESOLUTION;
    setMasterPolyRhythmProgress();
    paint();
}

const strokeWeightSliderResolution = 50;

strokeWeightSlider.value = 0;
strokeWeightSlider.oninput = e => {
    currentPatch.strokeWeight = e.target.value / strokeWeightSliderResolution;
    fullRefresh();
}

const strokeWeightDefault = 3;
strokeWeightSliderResetBtn.onclick = () => {
    strokeWeightSlider.value = strokeWeightDefault * strokeWeightSliderResolution;
    currentPatch.strokeWeight = strokeWeightDefault;
    fullRefresh();
}

rhythmListInput.oninput = () => {
    rhythmModeDropdown.selectedIndex = 0;
    applyRhythmsFromInput();
}

function applyRhythmsFromInput(){
    let sNums = rhythmListInput.value.split(",");
    let nums = [];
    
    for (let sNum of sNums){
        let parsedNum = parseFloat(sNum);
        if (Number.isFinite(parsedNum) && parsedNum >= 0){
            nums.push(parsedNum);
        }
    }

    // if we dont have a valid list yet just return
    if (nums.length < 1){
        return;
    }

    currentPatch.rhythms = nums;
    rhythmListCountInput.value = nums.length;

    // set selected rhythm mode to custom
    let customIdx = -1;
    rhythmModeOptions.forEach((option, idx) => option.name === RHYTHM_MODES.CUSTOM ? customIdx = idx : 0 );
    rhythmModeDropdown.selectedIndex = customIdx;
    rhythmModeDropdown.oninput();

    fullRefresh();
}


function updateRhythmsFromPresetInput(){
    if (rhythmModeDropdown.selectedIndex === getIndexOfRhythmModeOption(RHYTHM_MODES.CUSTOM)) return;

    // rhythm list
    currentPatch.rhythms = rhythmModeOptions[rhythmModeDropdown.selectedIndex]
        .func(rhythmListCountInput.valueAsNumber, rhythmListOffsetInput.valueAsNumber, rhythmListIsReversedCheckbox.checked);
    console.log(currentPatch.rhythms);
    rhythmListInput.value = currentPatch.rhythms.join();

    // count and offset
    currentPatch.rhythmCount = rhythmListCountInput.valueAsNumber;
    currentPatch.rhythmOffset = rhythmListOffsetInput.valueAsNumber;

    // reversed
    currentPatch.rhythmIsReversed = rhythmListIsReversedCheckbox.checked;

    fullRefresh();
}

rhythmModeDropdown.oninput = (e) => {
    rhythmListCountInput.disabled = rhythmListOffsetInput.disabled = getRhythmOptionNameFromIndex(rhythmModeDropdown.selectedIndex) === RHYTHM_MODES.CUSTOM;
    updateRhythmsFromPresetInput();
}

rhythmListCountInput.oninput = e => {
    updateRhythmsFromPresetInput();
}

rhythmListOffsetInput.oninput = e => {
    updateRhythmsFromPresetInput();
}

rhythmListIsReversedCheckbox.oninput = e => {
    updateRhythmsFromPresetInput();
}