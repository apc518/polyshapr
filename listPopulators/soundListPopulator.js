function clearSoundList(){
    while (soundList.length > 0){
        soundList.pop();
    }
}


function populateSoundListFromPreset(){
    if (currentPatch.pitchMode !== PITCH_MODES.CUSTOM){
        currentPatch.pitches = pitchModeOptionsMap[currentPatch.pitchMode].func(currentPatch.rhythms.length);
    }

    if (currentPatch.tuningMode === TUNING_MODES.RAW){
        for (let speed of currentPatch.pitches){
            if (Number.isFinite(currentPatch.pitchMultiplier)){
                speed *= currentPatch.pitchMultiplier;
            }
            else{
                console.warn("pitch multiplier was not a number in currentPatch:", currentPatch);
            }

            soundList.push(new Sound(audioFileName, speed));
        }
    }
    else if (currentPatch.tuningMode === TUNING_MODES.EDO12){
        let offset = 0;

        if (Number.isFinite(currentPatch.pitchOffset)){
            offset = currentPatch.pitchOffset;
        }
        else{
            console.warn("pitch offset was not a number in currentPatch:", currentPatch);
        }

        for (let note of currentPatch.pitches){
            let speed = Math.pow(2, (note + offset) / 12);

            soundList.push(new Sound(audioFileName, speed));
        }
    }
    else{
        console.error("pitch mode unrecognized in currentPatch:", currentPatch);
    }
}
