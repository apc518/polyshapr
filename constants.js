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
const DEBUG = false;


// enums

const SQUARE_STYLES = Object.freeze({
    SOLID: "solid",
    WIREFRAME: "wireframe"
});
