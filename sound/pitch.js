// each function will accept a Number argument specifying the number of pitches
// and will return a list of the speeds of each pitch according to the mode
const rawPitchPresetFunctions = {};

rawPitchPresetFunctions[PITCH_PRESETS.HARMONIC_SERIES] = n => Array.from({length: n}, (_,i) => i+1);


// each function will accept a Number argumetns specifying the number of pitches
// and will return a list of the chromatic scale degrees, aka semitone offsets from root
const edo12PitchPresetFunctions = {};

edo12PitchPresetFunctions[PITCH_PRESETS.PENTATONIC] = n => {
    let lst = [];
    let v = 0;
    for (let i = 0; i < n; i++){
        lst.push(v);
        if (i % 5 === 2 || i % 5 === 4)
            v += 3
        else
            v += 2
    }

    return lst;
}

edo12PitchPresetFunctions[PITCH_PRESETS.SUHMM_SCALE] = n => {
    let lst = [];
    let v = 0;
    for (let i = 0; i < n; i++){
        lst.push(v);
        if ((i+1) % 4 == 0) v += 1;
        else v += 2;
    }

    return lst;
}

edo12PitchPresetFunctions[PITCH_PRESETS.SUHMM_CHORD] = n => {
    let scaleNotes = edo12PitchPresetFunctions[PITCH_PRESETS.SUHMM_SCALE](n*2);

    let lst = [];
    for (let i = 0; i < scaleNotes.length; i++){
        if (i % 2 === 0){
            lst.push(scaleNotes[i]);
        }
    }

    return lst;
}

edo12PitchPresetFunctions[PITCH_PRESETS.MAJOR] = n => {
    let lst = [];
    let v = 0;
    for (let i = 0; lst.length <= n; i++){
        lst.push(v);
        v += 2; // W
        lst.push(v);
        v += 2; // W
        lst.push(v);
        v += 1; // H
        lst.push(v);
        v += 2; // W
        lst.push(v);
        v += 2; // W
        lst.push(v);
        v += 2; // W
        lst.push(v);
        v += 1; // H
    }

    return lst.slice(0, n);
}

edo12PitchPresetFunctions[PITCH_PRESETS.MINOR] = n => {
    let lst = [];
    let v = 0;
    for (let i = 0; lst.length <= n; i++){
        lst.push(v);
        v += 2; // W
        lst.push(v);
        v += 1; // H
        lst.push(v);
        v += 2; // W
        lst.push(v);
        v += 2; // W
        lst.push(v);
        v += 1; // H
        lst.push(v);
        v += 2; // W
        lst.push(v);
        v += 2; // W
    }

    return lst.slice(0, n);
}