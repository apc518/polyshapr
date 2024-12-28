"use strict";

const textFieldErrorColor = "#f88";
const textFieldOkayColor = "#fff";

// existing html elements

// high-level UI elements
const mainElement = document.getElementById("main");
const appDrawer = document.getElementById("appDrawer");
const bottomControlBar = document.getElementById("bottomControlBar");
const footerContainer = document.getElementById("footerContainer");
const centralDiv = document.getElementById("centralDiv");

// play/pause/reset controls
const globalProgressSlider = document.getElementById("globalProgressSlider");
const playPauseBtn = document.getElementById("playpausebtn");
const resetBtn = document.getElementById("resetbtn");

// playback ui elements
const playbackSettingsDetails = document.getElementById("playbackSettingsDetails");
const globalVolumeSlider = document.getElementById("globalVolumeSlider");

// patch ui elements
const presetDropdown = document.getElementById("presetDropdown");
const patchSaveButton = document.getElementById("patchSaveButton");
const patchLoadButton = document.getElementById("patchLoadButton");
const audioSampleDropdown = document.getElementById("audioSampleDropdown");
const audioSampleLoadButton = document.getElementById("audioSampleLoadButton");
const animationModeButtons = document.getElementById("animationModeButtons");
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
const colorScaleInput = document.getElementById("colorScaleInput");
const colorRippleCheckbox = document.getElementById("colorRippleCheckbox");
const colorReflectionCheckbox = document.getElementById("colorReflectionCheckbox");
const globalBorderCheckbox = document.getElementById("globalBorderCheckbox");
const strokeWeightSlider = document.getElementById("strokeWeightSlider");
const strokeWeightSliderResetBtn = document.getElementById("strokeWeightSliderResetBtn");

// invisible input elements

const patchFileInput = document.createElement('input');
patchFileInput.type = 'file';
patchFileInput.multiple = false;

const audioSampleFileInput = document.createElement('input');
audioSampleFileInput.type = 'file';
audioSampleFileInput.multiple = false;
audioSampleFileInput.accept = ".wav,.mp4,.mp3,.ogg,.aiff,.flac,.m4a,.aac,.wmv,.wma,.alac"


// html elem event listeners
playPauseBtn.onclick = e => {
    e?.target.blur();
    playPause();
}

resetBtn.onclick = e => {
    e?.target.blur();
    
    Howler.stop();
    Howler.ctx.close();
    Howler.init();

    Howler.volume(convertSliderValueToAmplitude(globalVolumeSlider.value));

    pause_();
    
    globalProgress = 0;
    globalProgressSlider.value = 0;
    globalProgressSlider.oninput({ target: globalProgressSlider })
    
    fullRefresh(true);
}

globalVolumeSlider.value = parseInt(globalVolumeSlider.max) / 2;
globalVolumeSlider.oninput = e => {
    const value = globalVolumeSlider.valueAsNumber;
    soundOn = value >= 1;
    if (!soundOn){
        Howler.stop();
    }
    Howler.volume(convertSliderValueToAmplitude(value));
}

globalVolumeSlider.onmouseup = e => e?.target.blur();

globalProgressSlider.value = 0;

globalProgressSlider.oninput = e => {
    globalProgress = Math.floor(globalProgress) + Math.min(e.target.value, PROGRESS_SLIDER_RESOLUTION - 1) / PROGRESS_SLIDER_RESOLUTION;
    setMasterPolyRhythmProgress();
    paint();
}

globalProgressSlider.onmouseup = e => e?.target.blur();

presetDropdown.oninput = e => {
    e?.target.blur();
    presetDropdown.children[presetDropdown.selectedIndex].onclick();
}

patchSaveButton.onclick = e => {
    e?.target.blur();

    let patchJson = JSON.stringify(currentPatch);
    let blob = URL.createObjectURL(new Blob([patchJson], { type: "application/json" }));
    let downloadElem = document.createElement('a');

    downloadElem.href = blob;
    
    Swal.fire({
        title: "Name:",
        input: "text",
        showCancelButton: true
    }).then(res => {
        if(res.isConfirmed){
            let name = res.value;
            if(name === ""){
                name = "New.polyshapr"
            }
            else if (!name.endsWith(".polyshapr")){
                name = name + ".polyshapr";
            }
            downloadElem.download = name;
            downloadElem.click();
            Swal.fire({
                icon: "success",
                text: "Success",
                timer: 1000,
                showConfirmButton: false
            });
        }
    });
}

patchLoadButton.onclick = e => {
    e?.target.blur();
    patchFileInput.click()
}

patchFileInput.onchange = e => {
    e?.target.blur();
    patchFileInput.files[0].text().then(res => {
        let obj;
        
        try{
            obj = JSON.parse(res);
            let name = patchFileInput.files[0].name;
            if (name.endsWith(".polyshapr")){
                name = name.slice(0, name.length - 10);
            }
            
            obj.patchName = name;
            
            presets.push(obj);
            
            setupPresetDropdown();

            presetDropdown.selectedIndex = presetDropdown.children.length - 1;
            presetDropdown.children[presetDropdown.children.length - 1].onclick();
        }
        catch(e){
            debugError(DEBUG_LEVEL_ONE, [e]);
            Swal.fire({
                icon: "error",
                title: "Invalid Polyshapr File",
                text: `"${patchFileInput.files[0].name}" could not be parsed. Are you sure its a polyshapr file?"`
            });
        }

        
    })
}

audioSampleDropdown.oninput = e => {
    e?.target.blur();
    audioSampleDropdown.children[audioSampleDropdown.selectedIndex].onclick();
}

audioSampleLoadButton.onclick = e => {
    e?.target.blur();
    audioSampleFileInput.click();
}

audioSampleFileInput.onchange = e => {
    e?.target.blur();
    audioSampleFileInput.files[0].arrayBuffer().then(res => {
        audioSampleOptions.push({
            filepath: audioSampleFileInput.files[0].name,
            displayName: audioSampleFileInput.files[0].name,
            custom: true,
            base64: typedArrayToBase64(new Uint8Array(res))
        });

        displayAudioSampleSettings();

        audioSampleDropdown.selectedIndex = audioSampleDropdown.children.length - 1;
        audioSampleDropdown.oninput();
        
    });
}

function setBackgroundColorForRhythmInputs() {
    if (!rhythmListInput.disabled){
        let nums = rhythmListInput.value.split(",").map(r => parseFloat(r));
        rhythmListInput.style.backgroundColor = Patch.rhythmListIsValid(nums) ? textFieldOkayColor : textFieldErrorColor;
    }

    if (!rhythmListCountInput.disabled){
        rhythmListCountInput.style.backgroundColor = Patch.rhythmCountIsValid(rhythmListCountInput.valueAsNumber) ? textFieldOkayColor : textFieldErrorColor;
    }

    if (!rhythmListOffsetInput.disabled){
        rhythmListOffsetInput.style.backgroundColor = Patch.rhythmOffsetIsValid(rhythmListOffsetInput.valueAsNumber) ? textFieldOkayColor : textFieldErrorColor;
    }
}

rhythmListInput.oninput = e => {
    rhythmModeDropdown.selectedIndex = getIndexOfRhythmModeOption(RHYTHM_MODES.CUSTOM);
    rhythmListCountInput.disabled = rhythmListOffsetInput.disabled = rhythmListIsReversedCheckbox.disabled = true;

    let nums = rhythmListInput.value.split(",").map(r => parseFloat(r));
    
    setBackgroundColorForRhythmInputs();
    
    // if we dont have a valid list yet just return
    if (!Patch.rhythmListIsValid(nums)) return;
    
    // just return if its the same as the current rhythms
    if (JSON.stringify(currentPatch.rhythms) === JSON.stringify(nums)){
        return;
    }
    
    currentPatch.rhythms = nums;
    rhythmListCountInput.value = nums.length;
    
    // set selected rhythm mode to custom
    rhythmModeDropdown.selectedIndex = getIndexOfRhythmModeOption(RHYTHM_MODES.CUSTOM);
    
    // rhythmModeDropdown.oninput();
    
    fullRefresh(true);
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

    fullRefresh(true);
}

rhythmModeDropdown.oninput = e => {
    e?.target.blur();
    let disabled = getRhythmOptionNameByIndex(rhythmModeDropdown.selectedIndex) === RHYTHM_MODES.CUSTOM;
    rhythmListCountInput.disabled = rhythmListOffsetInput.disabled = rhythmListIsReversedCheckbox.disabled = disabled;
    updateRhythmsFromPresetInput();
    setBackgroundColorForRhythmInputs();
}

rhythmListCountInput.oninput = e => {
    if (Patch.rhythmCountIsValid(rhythmListCountInput.valueAsNumber)){
        updateRhythmsFromPresetInput();
    }

    setBackgroundColorForRhythmInputs();
}

rhythmListOffsetInput.oninput = e => {
    if (Patch.rhythmOffsetIsValid(rhythmListOffsetInput.valueAsNumber)){
        updateRhythmsFromPresetInput();
    }

    setBackgroundColorForRhythmInputs();
}

rhythmListIsReversedCheckbox.oninput = e => {
    e?.target.blur();
    updateRhythmsFromPresetInput();
    setBackgroundColorForRhythmInputs();
}

cycleTimeInput.oninput = e => {
    if (Patch.cycleTimeIsValid(cycleTimeInput.valueAsNumber)){
        currentPatch.cycleTime = cycleTimeInput.valueAsNumber;
        cycleTimeInput.style.backgroundColor = textFieldOkayColor;
    }
    else{
        cycleTimeInput.style.backgroundColor = textFieldErrorColor;
    }
}


pitchListInput.oninput = e => {
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

    fullRefresh(true);
}


function updatePitchesFromPresetInput(){
    // pitch list
    currentPatch.pitches = pitchModeOptionsMap[getPitchOptionNameByIndex(pitchModeDropdown.selectedIndex)]
        .func(currentPatch.rhythms.length);
    
    pitchListInput.value = currentPatch.pitches.join();

    // count and offset
    currentPatch.pitchOffset = pitchOffsetInput.valueAsNumber;
    currentPatch.pitchMultiplier = pitchMultiplierInput.valueAsNumber;

    fullRefresh(true);
}


function disableAppropriatePitchUIElements(){
    let tuningModeIsRaw = currentPatch.tuningMode === TUNING_MODES.RAW;
    pitchOffsetInput.disabled = tuningModeIsRaw;
    pitchMultiplierInput.disabled = !tuningModeIsRaw;
}

tuningModeDropdown.oninput = e => {
    e?.target.blur();
    currentPatch.tuningMode = getTuningOptionNameByIndex(tuningModeDropdown.selectedIndex);
    disableAppropriatePitchUIElements();
    updatePitchesFromPresetInput();
}

pitchModeDropdown.oninput = e => {
    e?.target.blur();
    currentPatch.pitchMode = getPitchOptionNameByIndex(pitchModeDropdown.selectedIndex);
    updatePitchesFromPresetInput();
}

pitchOffsetInput.oninput = e => {
    if (Patch.pitchOffsetIsValid(pitchOffsetInput.valueAsNumber)){
        updatePitchesFromPresetInput();
    }
}

pitchMultiplierInput.oninput = e => {
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

    fullRefresh(false);
}

colorInterpolationModeDropdown.oninput = e => {
    e?.target.blur();
    updateColorsFromInput();
}

colorKeyFrameInput0.oninput = e => {
    e?.target.blur();
    updateColorsFromInput();
}

colorKeyFrameInput1.oninput = e => {
    e?.target.blur();
    updateColorsFromInput();
}

colorScaleInput.oninput = e => {
    if (Patch.colorScaleIsValid(colorScaleInput.valueAsNumber)){
        colorScaleInput.style.backgroundColor = textFieldOkayColor;
        currentPatch.colorScale = colorScaleInput.valueAsNumber;
        fullRefresh(false);
    }
    else{
        colorScaleInput.style.backgroundColor = textFieldErrorColor;
    }
}

colorRippleCheckbox.oninput = e => {
    e?.target.blur();
    currentPatch.doColorRipple = colorRippleCheckbox.checked;
    colorRippleCheckbox.blur();
}

colorReflectionCheckbox.oninput = e => {
    e?.target.blur();
    currentPatch.doColorReflection = colorReflectionCheckbox.checked;
    colorReflectionCheckbox.blur();

    fullRefresh(false);
}

globalBorderCheckbox.checked = true;

globalBorderCheckbox.oninput = e => {
    e?.target.blur();
    currentPatch.drawGlobalBorder = globalBorderCheckbox.checked;
    globalBorderCheckbox.blur();

    fullRefresh(false);
}

const strokeWeightSliderResolution = 25;

strokeWeightSlider.value = 0;
strokeWeightSlider.oninput = e => {
    currentPatch.strokeWeight = e.target.value / strokeWeightSliderResolution;
    fullRefresh(false);
}

strokeWeightSlider.onmouseup = e => e?.target.blur();

const strokeWeightDefault = 3;

strokeWeightSliderResetBtn.onclick = e => {
    e?.target.blur();
    strokeWeightSlider.value = strokeWeightDefault * strokeWeightSliderResolution;
    currentPatch.strokeWeight = strokeWeightDefault;
    fullRefresh(false);
}

window.addEventListener('keydown', function(e) {
    if(e.key == " " && e.target == document.body) {
        e.preventDefault();
    }
});

let fWasPressed = false;

document.addEventListener('fullscreenchange', e => {
    debugLog(DEBUG_LEVEL_ONE, ["fullscreenchange event captured"]);
    if (fWasPressed){
        fWasPressed = false;
    }
    else {
        toggleHideUI();
    }
});

const recordVideoBtn = document.getElementById("recordVideoBtn");

recordVideoBtn.onclick = e => {
    e?.target.blur();
}