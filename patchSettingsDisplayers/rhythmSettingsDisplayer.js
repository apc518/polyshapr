/**
 * if the rhythms list has items in it that contradict the mode and other rhythm settings,
 * the mode will be set to custom but the other settings will remain in the patch for use
 * if the user desires so
 */
function resolveConflictsBetweenRhythmListAndModeInCurrentPatch(){
    if (!(currentPatch.rhythmMode === RHYTHM_MODES.CUSTOM)){
        let expectedRhythms = rhythmModeOptionsMap[currentPatch.rhythmMode].func(currentPatch.rhythmCount, currentPatch.rhythmOffset, currentPatch.rhythmIsReversed);
        if (!(JSON.stringify(expectedRhythms) === JSON.stringify(currentPatch.rhythms))){
            currentPatch.rhythmMode = RHYTHM_MODES.CUSTOM;
        }
    }
}


function initializeRhythmUIBasedOnCurrentPatch(){
    if (!Patch.rhythmModeIsValid(currentPatch.rhythmMode))
        throw new Error("rhythm mode is invalid:", currentPatch.rhythmMode);
    
    if (!Patch.rhythmOffsetIsValid(currentPatch.rhythmOffset))
        throw new Error("rhythm offset is invalid:", currentPatch.rhythmOffset);

    if (!Patch.rhythmCountIsValid(currentPatch.rhythmCount))
        throw new Error("rhythm count is invalid:", currentPatch.rhythmCount);

    if (!Patch.rhythmListIsValid(currentPatch.rhythms)){
        if(currentPatch.rhythmMode === RHYTHM_MODES.CUSTOM){
            throw new Error("given rhythm list was invalid and rhythm mode was custom, cannot create polyrhythm.");
        }
        else{
            currentPatch.rhythms = rhythmModeOptionsMap[currentPatch.rhythmMode].func(currentPatch.rhythmCount, currentPatch.rhythmOffset, currentPatch.rhythmIsReversed)
        }
    }
    
    resolveConflictsBetweenRhythmListAndModeInCurrentPatch();

    // display the rhythm list
    rhythmListInput.value = currentPatch.rhythms.join();

    // set the rhythm mode in the dropdown
    rhythmModeDropdown.selectedIndex = getIndexOfRhythmModeOption(currentPatch.rhythmMode);

    // set count and offset
    rhythmListCountInput.value = currentPatch.rhythmCount;
    rhythmListOffsetInput.value = currentPatch.rhythmOffset;

    // set reversed
    rhythmListIsReversedCheckbox.checked = !!currentPatch.rhythmIsReversed;
    
    // refresh with html handler
    rhythmModeDropdown.oninput();
}


function setupRhythmSettings(){
    for (let option of rhythmModeOptions){
        let optionElem = document.createElement('option');
        optionElem.value = option.name;
        optionElem.innerText = option.displayName;
        rhythmModeDropdown.appendChild(optionElem);
    }
}


function displayRhythmSettings(){
    if (rhythmModeDropdown.children.length === 0){
        setupRhythmSettings();
    }

    initializeRhythmUIBasedOnCurrentPatch();
}
