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
        copy.push(new ColorKeyFrame(k));
    }
    
    return copy;
}
