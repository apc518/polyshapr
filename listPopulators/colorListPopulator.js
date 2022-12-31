function clearColorList(){
    while (colorList.length > 0){
        colorList.pop();
    }
}


function populateColorList(){
    // TODO: make this work with >2 keyframes

    let colorKeyFrames = currentPatch.colorKeyFrames;
    let numColors = currentPatch.rhythms.length;
    let colorInterpolationMode = currentPatch.colorInterpolationMode;

    // special cases
    if (currentPatch.animationMode === ANIMATION_MODES.SQUARES){
        numColors = Math.ceil(numColors / 2);
    }

    if (currentPatch.animationMode === ANIMATION_MODES.NGONS){
        numColors += 1;
    }

    const portion = i => i / Math.max(1, numColors - 1);

    if (colorInterpolationMode == COLOR_INTERPOLATION_MODES.RGB){
        for (let i = 0; i < numColors; i++) {
            colorList.push([
                lerp(colorKeyFrames[0].rgbValues[0], colorKeyFrames[1].rgbValues[0], portion(i)),
                lerp(colorKeyFrames[0].rgbValues[1], colorKeyFrames[1].rgbValues[1], portion(i)),
                lerp(colorKeyFrames[0].rgbValues[2], colorKeyFrames[1].rgbValues[2], portion(i))
            ])
        }
    }
    else if (colorInterpolationMode == COLOR_INTERPOLATION_MODES.HSL){
        let keyframe0Values = rgbToHsl(currentPatch.colorKeyFrames[0].rgbValues);
        let keyframe1Values = rgbToHsl(currentPatch.colorKeyFrames[1].rgbValues);

        for (let i = 0; i < numColors; i++){
            let value1 = lerp(keyframe0Values[0], keyframe1Values[0], portion(i));
            let value2 = lerp(keyframe0Values[1], keyframe1Values[1], portion(i));
            let value3 = lerp(keyframe0Values[2], keyframe1Values[2], portion(i));

            colorList.push(`hsl(${Math.floor(value1)}, ${Math.floor(value2)}%, ${Math.floor(value3)}%)`);
        }
    }
}
