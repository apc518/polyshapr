const COLOR_INTERPOLATION_MODES = Object.freeze({
    RGB: "rgb",
    HSL: "hsl"
});

const portion = i => i / Math.max(1, numColors - 1);

// arguments "keyframe1" and "keyframe2" are expected to be lists

const colorInterpolationMode = [
    {
        name: COLOR_INTERPOLATION_MODES.RGB,
        displayName: "RGB"
    },
    {
        name: COLOR_INTERPOLATION_MODES.HSL,
        displayName: "HSL"
    }
];

const colorInterpolationModeMap = {}

for (let option of colorInterpolationMode){
    colorInterpolationModeMap[option.name] = option;
}


function getIndexOfColorOption(optionName){
    for (let i = 0; i < colorModeDropdown.children.length; i++){
        if (colorModeDropdown.children[i].value === optionName){
            return i;
        }
    }

    throw new Error(`could not find color mode option index in color mode dropdown for option \"${optionName}\"`);
}

function getColorOptionNameByIndex(idx){
    return colorModeDropdown.children[idx].value;
}
