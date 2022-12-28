let audioFileName = "assets/sounds/synth-pluck-C.wav";

class Sound {
    // howl is a howler.js Howl object
    constructor(howl, speed){
        // arguments
        this.snd = howl;
        this.speed = speed;

        // data
        this.on = false;
        this.initial_speed = speed;
        
        // setup
        this.snd.rate(speed);
    }

    play(){
        this.snd.play()
    }

    setRate(rate){
        this.snd.rate(rate);
    }
}


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

            let howl = new Howl({ src: audioFileName });

            soundList.push(new Sound(howl, speed));
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

            let howl = new Howl({ src: audioFileName });

            soundList.push(new Sound(howl, speed));
        }
    }
    else{
        console.error("pitch mode unrecognized in currentPatch:", currentPatch);
    }
}
