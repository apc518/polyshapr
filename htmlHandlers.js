"use strict";

const textFieldErrorColor = "#f88";
const textFieldOkayColor = "#fff";

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
const cycleTimeInput = document.getElementById("cycleTimeInput");


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
    let nums = rhythmListInput.value.split(",").map(r => parseFloat(r));
    
    // if we dont have a valid list yet just return
    if (!Patch.rhythmListIsValid(nums)){
        rhythmListInput.style.backgroundColor = textFieldErrorColor;
        return;
    }

    rhythmListInput.style.backgroundColor = textFieldOkayColor;

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
    
    rhythmListInput.value = currentPatch.rhythms.join();

    // count and offset
    currentPatch.rhythmCount = rhythmListCountInput.valueAsNumber;
    currentPatch.rhythmOffset = rhythmListOffsetInput.valueAsNumber;

    // reversed
    currentPatch.rhythmIsReversed = rhythmListIsReversedCheckbox.checked;

    fullRefresh();
}

rhythmModeDropdown.oninput = () => {
    let disabled = getRhythmOptionNameFromIndex(rhythmModeDropdown.selectedIndex) === RHYTHM_MODES.CUSTOM;
    rhythmListCountInput.disabled = rhythmListOffsetInput.disabled = rhythmListIsReversedCheckbox.disabled = disabled;
    updateRhythmsFromPresetInput();
}

rhythmListCountInput.oninput = () => {
    if (Patch.rhythmCountIsValid(rhythmListCountInput.valueAsNumber)){
        updateRhythmsFromPresetInput();
        rhythmListCountInput.style.backgroundColor = textFieldOkayColor;
    }
    else{
        rhythmListCountInput.style.backgroundColor = textFieldErrorColor;
    }
}

rhythmListOffsetInput.oninput = () => {
    if (Patch.rhythmOffsetIsValid(rhythmListCountInput.valueAsNumber)){
        updateRhythmsFromPresetInput();
        rhythmListCountInput.style.backgroundColor = textFieldOkayColor;
    }
    else{
        rhythmListCountInput.style.backgroundColor = textFieldErrorColor;
    }
}

rhythmListIsReversedCheckbox.oninput = () => {
    updateRhythmsFromPresetInput();
}

cycleTimeInput.oninput = () => {
    if (Patch.cycleTimeIsValid(cycleTimeInput.valueAsNumber)){
        currentPatch.cycleTime = cycleTimeInput.valueAsNumber;
        cycleTimeInput.style.backgroundColor = textFieldOkayColor;
    }
    else{
        cycleTimeInput.style.backgroundColor = textFieldErrorColor;
    }
}