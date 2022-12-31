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
const presetDropdown = document.getElementById("presetDropdown");
const audioSampleDropdown = document.getElementById("audioSampleDropdown");
const strokeWeightSlider = document.getElementById("strokeWeightSlider");
const strokeWeightSliderResetBtn = document.getElementById("strokeWeightSliderResetBtn");
const rhythmListInput = document.getElementById("rhythmListInput");
const rhythmModeDropdown = document.getElementById("rhythmModeDropdown");
const rhythmListCountInput = document.getElementById("rhythmListCountInput");
const rhythmListOffsetInput = document.getElementById("rhythmListOffsetInput");
const rhythmListIsReversedCheckbox = document.getElementById("rhythmListIsReversedCheckbox");
const cycleTimeInput = document.getElementById("cycleTimeInput");
const pitchListInput = document.getElementById("pitchListInput");
const tuningModeDropdown = document.getElementById("tuningModeDropdown");
const pitchModeDropdown = document.getElementById("pitchModeDropdown");
const pitchOffsetInput = document.getElementById("pitchOffsetInput");
const pitchMultiplierInput = document.getElementById("pitchMultiplierInput");
const colorInterpolationModeDropdown = document.getElementById("colorInterpolationModeDropdown");
const colorKeyFrameInput0 = document.getElementById("colorKeyFrameInput0");
const colorKeyFrameInput1 = document.getElementById("colorKeyFrameInput1");
const colorRippleCheckbox = document.getElementById("colorRippleCheckbox");

const audioSampleFileInput = document.createElement('input');
audioSampleFileInput.type = 'file';
audioSampleFileInput.multiple = false;


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

    Howler.stop();

    pause_();
    globalProgressSlider.value = 0;
    globalProgressSlider.oninput({ target: globalProgressSlider })
    paint();
}

soundOnCheckbox.checked = true;
soundOnCheckbox.oninput = e => {
    e.target.blur();
    soundOn = soundOnCheckbox.checked;
    if (!soundOn){
        Howler.stop();
    }
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

presetDropdown.oninput = () => {

}

audioSampleDropdown.oninput = () => {
    audioSampleDropdown.children[audioSampleDropdown.selectedIndex].onclick();
}

audioSampleFileInput.onchange = e => {
    audioSampleFileInput.files[0].arrayBuffer().then(res => {
        let filenameSplitByDot = audioSampleFileInput.files[0].name.split(".")
        audioFileExtension = filenameSplitByDot[filenameSplitByDot.length - 1];

        let blob = URL.createObjectURL(new Blob([res]), { type: audioSampleFileInput.files[0].type });
        audioFileName = blob;

        fullRefresh();
    });
}

const strokeWeightSliderResolution = 25;

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
    rhythmModeDropdown.selectedIndex = getIndexOfRhythmModeOption(RHYTHM_MODES.CUSTOM);

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
    let disabled = getRhythmOptionNameByIndex(rhythmModeDropdown.selectedIndex) === RHYTHM_MODES.CUSTOM;
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
    if (Patch.rhythmOffsetIsValid(rhythmListOffsetInput.valueAsNumber)){
        updateRhythmsFromPresetInput();
        rhythmListOffsetInput.style.backgroundColor = textFieldOkayColor;
    }
    else{
        rhythmListOffsetInput.style.backgroundColor = textFieldErrorColor;
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


pitchListInput.oninput = () => {
    let nums = pitchListInput.value.split(",").map(r => parseFloat(r));

    // if we dont have a valid list yet just return
    if (!Patch.pitchListIsValid(nums)){
        pitchListInput.style.backgroundColor = textFieldErrorColor;
        return;
    }
    
    pitchListInput.style.backgroundColor = textFieldOkayColor;
    
    currentPatch.pitches = nums;
    
    // set selected pitch mode to custom
    currentPatch.pitchMode = PITCH_MODES.CUSTOM;
    pitchModeDropdown.selectedIndex = getIndexOfPitchModeOption(PITCH_MODES.CUSTOM);

    fullRefresh();
}


function updatePitchesFromPresetInput(){
    // pitch list
    currentPatch.pitches = pitchModeOptionsMap[getPitchOptionNameByIndex(pitchModeDropdown.selectedIndex)]
        .func(currentPatch.rhythms.length);
    
    pitchListInput.value = currentPatch.pitches.join();

    // count and offset
    currentPatch.pitchOffset = pitchOffsetInput.valueAsNumber;
    currentPatch.pitchMultiplier = pitchMultiplierInput.valueAsNumber;

    fullRefresh();
}


tuningModeDropdown.oninput = () => {
    currentPatch.tuningMode = getTuningOptionNameByIndex(tuningModeDropdown.selectedIndex);

    let tuningModeIsRaw = currentPatch.tuningMode === TUNING_MODES.RAW;
    pitchOffsetInput.disabled = tuningModeIsRaw;
    pitchMultiplierInput.disabled = !tuningModeIsRaw;
    updatePitchesFromPresetInput();
}

pitchModeDropdown.oninput = () => {
    currentPatch.pitchMode = getPitchOptionNameByIndex(pitchModeDropdown.selectedIndex);
    updatePitchesFromPresetInput();
}

pitchOffsetInput.oninput = () => {
    if (Patch.pitchOffsetIsValid(pitchOffsetInput.valueAsNumber)){
        updatePitchesFromPresetInput();
    }
}

pitchMultiplierInput.oninput = () => {
    if (Patch.pitchMultiplierIsValid(pitchMultiplierInput.valueAsNumber)){
        updatePitchesFromPresetInput();
    }
}


function updateColorsFromInput(){
    currentPatch.colorInterpolationMode = getColorOptionNameByIndex(colorInterpolationModeDropdown.selectedIndex);
    
    currentPatch.colorKeyFrames = [
        new ColorKeyFrame({ idx: 0, rgbValues: hexToRgbArray(colorKeyFrameInput0.value) }),
        new ColorKeyFrame({ idx: 1, rgbValues: hexToRgbArray(colorKeyFrameInput1.value) })
    ];

    fullRefresh();
}

colorInterpolationModeDropdown.oninput = () => {
    updateColorsFromInput();
}

colorKeyFrameInput0.oninput = () => {
    updateColorsFromInput();
}

colorKeyFrameInput1.oninput = () => {
    updateColorsFromInput();
}

colorRippleCheckbox.oninput = () => {
    currentPatch.doColorRipple = colorRippleCheckbox.checked;
    colorRippleCheckbox.blur();
}
