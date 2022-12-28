"use strict";

// graphics constants
const canvasWidth = 800;
const canvasHeight = 800;
const colorList = [];
const DEFAULT_SIZE = 1;

// physics constants
const FRAMERATE = 60;

// misc constants
const PROGRESS_SLIDER_RESOLUTION = 1000;
const SPACE_KEYCODE = 32;
const UP_ARROW_KEYCODE = 38;
const DOWN_ARROW_KEYCODE = 40;
const DEBUG = false;


// enums

const TUNING_MODES = Object.freeze({
    EDO12: "edo12", // 12-edo
    RAW: "raw" // useful for a harmonic series kind of thing
});

const PITCH_MODES = Object.freeze({
    NONE: "none",
    PENTATONIC: "pentatonic",
    MAJOR: "major",
    MINOR: "minor",
    SUHMM_SCALE: "suhmm-scale",
    SUHMM_CHORD: "suhmm-chord",
    HARMONIC_SERIES: "harmonic"
});

const COLOR_MODES = Object.freeze({
    RGB: "rgb",
    HSL: "hsl"
});

const SQUARE_STYLES = Object.freeze({
    SOLID: "solid",
    WIREFRAME: "wireframe"
});
