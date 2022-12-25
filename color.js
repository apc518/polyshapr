class ColorKeyFrame {
    constructor({ idx, values }){
        /**
         *  idx is the index of the shape that should have this exact color by default
         *  if idx is -1, that means "last", e.g. the last child of the deepest nested polyrhythm object will have that color by default
         */
        if (!Number.isFinite(idx)){
            throw new Error("idx paramter was invalid; must be a nonnegative integer");
        }
        this.idx = idx;

        /**
         * a list of numbers that go into the color. These might be RGB or HSL values, or even RGBA
         */
        if (!Array.isArray(values) || values.length < 3){
            console.log(values);
            throw new Error("values parameter was invalid; must be an array of length >= 3");
        }
        this.values = values.slice();
    }
}


function copyColorKeyFrameList(colorKeyFrameList){
    let copy = [];
    for (let k of colorKeyFrameList){
        console.log(k);
        copy.push(new ColorKeyFrame(k));
    }
    
    return copy;
}


function clearColorList(){
    while (colorList.length > 0){
        colorList.pop();
    }
}


function populateColorList(){
    // TODO: make this work with >2 keyframes

    let colorKeyFrames = currentPatch.colorKeyFrames;
    let numColors = currentPatch.rhythms.length;
    let colorMode = currentPatch.colorMode;

    // special cases
    if (currentPatch.animationMode === ANIMATION_MODES.SQUARES){
        numColors = Math.ceil(numColors / 2);
    }

    if (currentPatch.animationMode === ANIMATION_MODES.NGONS){
        numColors += 1;
    }

    const portion = i => i / Math.max(1, numColors - 1);

    if (colorMode == COLOR_MODES.RGB){
        for (let i = 0; i < numColors; i++) {
            colorList.push([
                lerp(colorKeyFrames[0].values[0], colorKeyFrames[1].values[0], portion(i)),
                lerp(colorKeyFrames[0].values[1], colorKeyFrames[1].values[1], portion(i)),
                lerp(colorKeyFrames[0].values[2], colorKeyFrames[1].values[2], portion(i))
            ])
        }
    }
    else if (colorMode == COLOR_MODES.HSL){
        for (let i = 0; i < numColors; i++){
            let value1 = lerp(colorKeyFrames[0].values[0], colorKeyFrames[1].values[0], portion(i));
            let value2 = lerp(colorKeyFrames[0].values[1], colorKeyFrames[1].values[1], portion(i));
            let value3 = lerp(colorKeyFrames[0].values[2], colorKeyFrames[1].values[2], portion(i));

            colorList.push(`hsl(${Math.floor(value1)}, ${Math.floor(value2)}%, ${Math.floor(value3)}%)`);
        }
    }
}
