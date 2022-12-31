const TUNING_MODES = Object.freeze({
    EDO12: "edo12", // 12-edo
    RAW: "raw" // useful for a harmonic series kind of thing
});

const PITCH_MODES = Object.freeze({
    CUSTOM: "custom",
    PENTATONIC: "pentatonic",
    IONIAN: "ionian",
    DORIAN: "dorian",
    PHRYGIAN: "phrygian",
    LYDIAN: "lydian",
    MIXOLYDIAN: "mixolydian",
    AEOLIAN: "aeolian",
    LOCRIAN: "locrian",
    SUHMM_SCALE: "suhmm-scale",
    SUHMM_CHORD: "suhmm-chord",
    HARMONIC_SERIES: "harmonic"
});

const tuningModeOptions = [
    {
        name: TUNING_MODES.EDO12,
        displayName: "12-EDO"
    },
    {
        name: TUNING_MODES.RAW,
        displayName: "Raw"
    }
];

/**
 * diatonicOffset in diatonic steps (not semitones) from ionian
 * e.g. diatonicOffset of 2 would mean phrygian, 6 would mean locrian, etc
 */
function diatonic(n, diatonicOffset){
    let lst = [];
    let v = 0;
    let steps = [2,2,1,2,2,2,1];

    for (let i = 0; i < diatonicOffset; i++){
        steps.push(steps.shift());
    }

    for (let i = 0; lst.length <= n; i++){
        lst.push(v);
        v += steps[i % 7];
    }

    return lst.slice(0, n);
}

function suhmmScale(n){
    let lst = [];
    let v = 0;
    for (let i = 0; i < n; i++){
        lst.push(v);
        if ((i+1) % 4 == 0) v += 1;
        else v += 2;
    }

    return lst;
}

const pitchModeOptions = [
    {
        name: PITCH_MODES.CUSTOM,
        displayName: "Custom",
        func: () => currentPatch.pitches
    },
    {
        name: PITCH_MODES.HARMONIC_SERIES,
        displayName: "Harmonic Series",
        func: n => Array.from({length: n}, (_,i) => i+1)
    },
    {
        name: PITCH_MODES.PENTATONIC,
        displayName: "Pentatonic",
        func: n => {
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
    },
    {
        name: PITCH_MODES.IONIAN,
        displayName: "Ionian",
        func: n => {
            return diatonic(n, 0);
        }
    },
    {
        name: PITCH_MODES.DORIAN,
        displayName: "Dorian",
        func: n => {
            return diatonic(n, 1);
        }
    },
    {
        name: PITCH_MODES.PHRYGIAN,
        displayName: "Phrygian",
        func: n => {
            return diatonic(n, 2);
        }
    },
    {
        name: PITCH_MODES.LYDIAN,
        displayName: "Lydian",
        func: n => {
            return diatonic(n, 3);
        }
    },
    {
        name: PITCH_MODES.MIXOLYDIAN,
        displayName: "Mixolydian",
        func: n => {
            return diatonic(n, 4);
        }
    },
    {
        name: PITCH_MODES.AEOLIAN,
        displayName: "Aeolian",
        func: n => {
            return diatonic(n, 5);
        }
    },
    {
        name: PITCH_MODES.LOCRIAN,
        displayName: "Locrian",
        func: n => {
            return diatonic(n, 6);
        }
    },
    {
        name: PITCH_MODES.SUHMM_SCALE,
        displayName: "SUHMM Lydian (scale)",
        func: n => {
            return suhmmScale(n);
        }
    },
    {
        name: PITCH_MODES.SUHMM_CHORD,
        displayName: "SUHMM Lydian (chord)",
        func: n => {
            let scaleNotes = suhmmScale(n*2);

            let lst = [];
            for (let i = 0; i < scaleNotes.length; i++){
                if (i % 2 === 0){
                    lst.push(scaleNotes[i]);
                }
            }

            return lst;
        }
    }
];

const pitchModeOptionsMap = {};

for (let option of pitchModeOptions){
    pitchModeOptionsMap[option.name] = option;
}

function getPitchOptionNameByIndex(idx){
    return pitchModeOptions[idx].name;
}

function getIndexOfPitchModeOption(optionName){
    for (let i = 0; i < pitchModeDropdown.children.length; i++){
        if (pitchModeDropdown.children[i].value === optionName){
            return i;
        }
    }

    throw new Error(`pitch mode option ${optionName} not found in pitch mode dropdown`);
}

function getTuningOptionNameByIndex(idx){
    return tuningModeOptions[idx].name;
}

function getIndexOfTuningModeOption(optionName){
    for (let i = 0; i < tuningModeDropdown.children.length; i++){
        if (tuningModeDropdown.children[i].value === optionName){
            return i;
        }
    }

    throw new Error(`tuning mode option ${optionName} not found in tuning mode dropdown`);
}
