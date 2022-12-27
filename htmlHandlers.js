"use strict";

// html elements
const playPauseBtn = document.getElementById("playpausebtn");
const resetBtn = document.getElementById("resetbtn");
const debugModeCheckbox = document.getElementById("debugModeCheckbox");
const soundOnCheckbox = document.getElementById("soundOnCheckbox");
const globalSpeedSlider = document.getElementById("globalSpeedSlider");
const globalSpeedIndicator = document.getElementById("globalSpeedIndicator");
const globalSpeedResetBtn = document.getElementById("globalSpeedResetBtn");
const globalVolumeSlider = document.getElementById("globalVolumeSlider");
const globalVolumeResetBtn = document.getElementById("globalVolumeResetBtn");
const globalProgressSlider = document.getElementById("globalProgressSlider");
const globalProgressResetBtn = document.getElementById("globalProgressResetBtn");
const strokeWeightSlider = document.getElementById("strokeWeightSlider");
const strokeWeightSliderResetBtn = document.getElementById("strokeWeightSliderResetBtn");


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

debugModeCheckbox.checked = false;
debugModeCheckbox.oninput = e => {
    e.target.blur();
    debug = e.target.checked;
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
    globalProgress = Math.floor(globalProgress) + e.target.value / PROGRESS_SLIDER_RESOLUTION;
    setMasterPolyRhythmProgress();
    paint();
}

globalProgressResetBtn.onclick = e => {
    e.target.blur();
    globalProgressSlider.value = 0;
    globalProgressSlider.oninput({ target: globalProgressSlider })
}

strokeWeightSlider.value = 0;

strokeWeightSlider.oninput = e => {
    currentPatch.strokeWeight = e.target.value / 50;
    fullRefresh();
}