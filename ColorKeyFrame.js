class ColorKeyFrame {
    constructor({ idx, rgbValues }){
        /**
         *  idx is the index of the shape that should have this exact color by default
         *  if idx is -1, that means "last", e.g. the last child of the deepest nested polyrhythm object will have that color by default
         */
        if (!Number.isFinite(idx)){
            throw new Error("idx paramter was invalid; must be a nonnegative integer");
        }
        this.idx = idx;

        /**
         * a list of numbers that go into the color.
         */
        if (!Array.isArray(rgbValues) || rgbValues.length < 3){
            console.log(rgbValues);
            throw new Error("rgbValues parameter was invalid; must be an array of length >= 3");
        }
        this.rgbValues = rgbValues.slice();
    }
}


function copyColorKeyFrameList(colorKeyFrameList){
    let copy = [];
    for (let k of colorKeyFrameList){
        copy.push(new ColorKeyFrame(k));
    }
    
    return copy;
}
