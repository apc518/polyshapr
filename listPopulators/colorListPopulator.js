function clearColorList(){
    while (colorList.length > 0){
        colorList.pop();
    }
}


function colorLerpList(numColors, keyframe0, keyframe1){
    const portion = i => i / Math.max(1, numColors - 1);

    let colors = [];

    if (currentPatch.colorInterpolationMode == COLOR_INTERPOLATION_MODES.RGB){
        for (let i = 0; i < numColors; i++) {
            colors.push([
                lerp(keyframe0.rgbValues[0], keyframe1.rgbValues[0], portion(i)),
                lerp(keyframe0.rgbValues[1], keyframe1.rgbValues[1], portion(i)),
                lerp(keyframe0.rgbValues[2], keyframe1.rgbValues[2], portion(i))
            ]);
        }
    }
    else if (currentPatch.colorInterpolationMode == COLOR_INTERPOLATION_MODES.HSL){
        let keyframe0Values = rgbToHsl(keyframe0.rgbValues);
        let keyframe1Values = rgbToHsl(keyframe1.rgbValues);

        for (let i = 0; i < numColors; i++){
            let value1 = lerp(keyframe0Values[0], keyframe1Values[0], portion(i));
            let value2 = lerp(keyframe0Values[1], keyframe1Values[1], portion(i));
            let value3 = lerp(keyframe0Values[2], keyframe1Values[2], portion(i));

            colors.push(`hsl(${Math.floor(value1)}, ${Math.floor(value2)}%, ${Math.floor(value3)}%)`);
        }
    }

    return colors;
}


function populateColorList(){
    clearColorList();

    let numColors = currentPatch.rhythms.length;

    // special cases
    if (currentPatch.animationMode === ANIMATION_MODES.SQUARES){
        numColors = Math.ceil(numColors / 2);
    }

    if (currentPatch.animationMode === ANIMATION_MODES.NGONS){
        numColors += 1;
    }

    if (currentPatch.colorScale === 0){
        throw new Error(`color scale was zero`);
    }

    numColors = ceil(numColors * abs(currentPatch.colorScale));

    if (currentPatch.doColorReflection){
        let firstColors     = colorLerpList(numColors + 1, currentPatch.colorKeyFrames[0], currentPatch.colorKeyFrames[1]);
        let reflectedColors = colorLerpList(numColors + 1, currentPatch.colorKeyFrames[1], currentPatch.colorKeyFrames[0]);

        firstColors.pop();
        reflectedColors.pop();

        firstColors.forEach(c => colorList.push(c));
        reflectedColors.forEach(c => colorList.push(c));
    }
    else{
        let colors = colorLerpList(numColors, currentPatch.colorKeyFrames[0], currentPatch.colorKeyFrames[1]);
        colors.forEach(c => colorList.push(c));
    }

    // reverse the list is the color scale is negative
    if (currentPatch.colorScale < 0){
        colorList.reverse();
    }
}
