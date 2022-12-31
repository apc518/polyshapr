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
    for (let i = 0; i < colorInterpolationModeDropdown.children.length; i++){
        if (colorInterpolationModeDropdown.children[i].value === optionName){
            return i;
        }
    }

    throw new Error(`could not find color mode option index in color mode dropdown for option \"${optionName}\"`);
}

function getColorOptionNameByIndex(idx){
    return colorInterpolationModeDropdown.children[idx].value;
}
