"use strict";

// graphics constants
const CANVAS_WIDTH_DEFAULT = 800;
const CANVAS_HEIGHT_DEFAULT = 800;
let canvasWidth = CANVAS_WIDTH_DEFAULT;
let canvasHeight = CANVAS_HEIGHT_DEFAULT;
const colorList = [];
const DEFAULT_SIZE_MULTIPLIER = 1;

// physics constants
const FRAMERATE = 60;

// misc constants
const PROGRESS_SLIDER_RESOLUTION = 1000;
const SPACE_KEYCODE = 32;
const UP_ARROW_KEYCODE = 38;
const DOWN_ARROW_KEYCODE = 40;
const F_KEYCODE = 70;
const ESC_KEYCODE = 27;
const DEBUG_LEVEL_ZERO = 0; // no debug messages; ideally the console will not produce any output after initialization
const DEBUG_LEVEL_ONE = 1; // on-demand debug messages; only a certain finite number of debug messages per user interaction
const DEBUG_LEVEL_TWO = 2; // indefinite debug messages but not every frame i.e. a debug message for every collision
const DEBUG_LEVEL_THREE = 3; // spammy debug messaging i.e. a debug message for every frame


// enums

const SQUARE_STYLES = Object.freeze({
    SOLID: "solid",
    WIREFRAME: "wireframe"
});
