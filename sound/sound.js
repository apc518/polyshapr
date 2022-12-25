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

function populateSoundList(patch){
    if (patch.pitchMode === PITCH_MODES.RAW){
        let noteSpeeds;

        if (Object.keys(rawPitchPresetFunctions).includes(patch.pitchPreset)){
            noteSpeeds = rawPitchPresetFunctions[patch.pitchPreset](patch.rhythms.length);
        }
        else if (patch.pitches && patch.pitches.length === patch.rhythms.length){
            noteSpeeds = patch.pitches;
        }
        else{
            throw new Error("no pitch preset or valid pitches list was found in patch");
        }

        for (let speed of noteSpeeds){
            if (Number.isFinite(patch.pitchMultiplier)){
                speed *= patch.pitchMultiplier;
            }
            else{
                console.warn("pitch multiplier was not a number in patch:", patch);
            }

            let howl = new Howl({ src: audioFileName });

            soundList.push(new Sound(howl, speed));
        }
    }
    else if (patch.pitchMode === PITCH_MODES.EDO12){
        let notes;
        if (Object.keys(edo12PitchPresetFunctions).includes(patch.pitchPreset)){
            notes = edo12PitchPresetFunctions[patch.pitchPreset](patch.rhythms.length);
        }
        else if (patch.pitches && patch.pitches.length === patch.rhythms.length){
            notes = patch.pitches;
        }
        else{
            console.error("no pitch preset or valid pitches list was found in patch:", patch);
        }
        
        let offset = 0;

        if (Number.isFinite(patch.pitchOffset)){
            offset = patch.pitchOffset;
        }
        else{
            console.warn("pitch offset was not a number in patch:", patch);
        }

        for (let note of notes){
            let speed = Math.pow(2, (note + offset) / 12);

            let howl = new Howl({ src: audioFileName });

            soundList.push(new Sound(howl, speed));
        }
    }
    else{
        console.error("pitch mode unrecognized in patch:", patch);
    }
}
