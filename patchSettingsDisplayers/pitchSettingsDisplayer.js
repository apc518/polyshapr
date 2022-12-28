/**
 * if the pitches list has items in it that contradict the mode and other pitch settings,
 * the mode will be set to custom but the other settings will remain in the patch for use
 * if the user desires so
 */
function resolveConflictsBetweenPitchListAndModeInCurrentPatch(){
    if (!(currentPatch.pitchMode === RHYTHM_MODES.CUSTOM)){
        let expectedPitches = pitchModeOptionsMap[currentPatch.pitchMode].func(currentPatch.rhythms.length);
        if (!(JSON.stringify(expectedPitches) === JSON.stringify(currentPatch.pitches))){
            currentPatch.pitchMode = RHYTHM_MODES.CUSTOM;
        }
    }
}


function initializePitchUIBasedOnCurrentPatch(){
    if (!Patch.pitchModeIsValid(currentPatch.pitchMode))
        throw new Error("pitch mode is invalid:", currentPatch.pitchMode);
    
    if (!Patch.pitchOffsetIsValid(currentPatch.pitchOffset))
        throw new Error("pitch offset is invalid:", currentPatch.pitchOffset);
    
    if (!Patch.pitchMultiplierIsValid(currentPatch.pitchMultiplier))
        throw new Error("pitch multiplier is invalid:", currentPatch.pitchMultiplier);

    if (!Patch.pitchListIsValid(currentPatch.pitches)){
        if(currentPatch.pitchMode === PITCH_MODES.CUSTOM){
            throw new Error("given pitch list was invalid and pitch mode was custom, cannot create polyrhythm.");
        }
        else{
            console.warn("given pitch list was invalid; using other pitch settings");
            currentPatch.pitches = pitchModeOptionsMap[currentPatch.pitchMode].func(currentPatch.rhythmCount, currentPatch.rhythmOffset, currentPatch.rhythmIsReversed)
        }
    }

    resolveConflictsBetweenPitchListAndModeInCurrentPatch();

    // display the pitch list
    pitchListInput.value = currentPatch.pitches.join();
    
    // tuning mode
    tuningModeDropdown.selectedIndex = getIndexOfTuningModeOption(currentPatch.tuningMode);

    // pitch mode
    pitchModeDropdown.selectedIndex = getIndexOfPitchModeOption(currentPatch.pitchMode);

    // offset
    pitchOffsetInput.value = currentPatch.pitchOffset;

    // multiplier
    pitchMultiplierInput.value = currentPatch.pitchMultiplier;
}

function displayPitchSettings(){
    for (let option of tuningModeOptions){
        let elem = document.createElement("option");
        elem.value = option.name;
        elem.innerText = option.displayName;
        tuningModeDropdown.appendChild(elem);
    }

    for (let option of pitchModeOptions){
        let elem = document.createElement("option");
        elem.value = option.name;
        elem.innerText = option.displayName;
        pitchModeDropdown.appendChild(elem);
    }

    initializePitchUIBasedOnCurrentPatch();
    tuningModeDropdown.oninput();
}
