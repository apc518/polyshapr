/**
 * represents all user-configurable settings pertaining to a given polyrhythm animation
 * Patch is intended to be serializable such that patches can be saved and loaded
 */
class Patch {
    // this works as a copy constructor in addition to constructing from a simple js struct
    constructor({ animationMode, rhythmMode, rhythmOffset, rhythmCount, rhythmIsReversed, rhythms, cycleTime,
                  pitchMode, tuningMode, pitches, pitchOffset, pitchMultiplier, skips, colorInterpolationMode, colorKeyFrames, colorScale,
                  doColorRipple, doColorReflection, rotateCount, globalRotationSpeed, drawBackground, drawGlobalBorder, strokeWeight, canvasWidth, canvasHeight, ngonShrinkFactor, ngonInnerPolygonSideCount,
                  squareStyle, sizeMultiplier, backgroundColor, audioSampleIsCustom, audioSampleFilename, audioSampleDisplayName, audioSampleBase64 }){
        // rhythm
        this.rhythmMode = rhythmMode;
        this.rhythmOffset = rhythmOffset;
        this.rhythmCount = rhythmCount;
        this.rhythmIsReversed = rhythmIsReversed;
        this.rhythms = rhythms.slice();
        this.cycleTime = cycleTime;
        
        // sound
        this.pitchMode = pitchMode;
        this.tuningMode = tuningMode;
        this.pitches = pitches.slice();
        this.pitchOffset = pitchOffset; // used if pitch mode is EDO
        this.pitchMultiplier = pitchMultiplier; // used if pitch mode is RAW
        
        // visual
        this.animationMode = animationMode;
        this.skips = skips.slice(); // no skips means assume 0 skip for all
        this.colorInterpolationMode = colorInterpolationMode;
        this.colorKeyFrames = copyColorKeyFrameList(colorKeyFrames);
        this.colorScale = colorScale;
        this.doColorRipple = doColorRipple;
        this.doColorReflection = doColorReflection;
        this.rotateCount = rotateCount;
        this.globalRotationSpeed = globalRotationSpeed;
        this.drawBackground = drawBackground;
        this.drawGlobalBorder = drawGlobalBorder;
        this.strokeWeight = strokeWeight;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.ngonShrinkFactor = ngonShrinkFactor;
        this.ngonInnerPolygonSideCount = ngonInnerPolygonSideCount;
        this.squareStyle = squareStyle;
        this.sizeMultiplier = sizeMultiplier;
        this.backgroundColor = backgroundColor;

        // audio sample
        this.audioSampleIsCustom = audioSampleIsCustom;
        this.audioSampleFilename = audioSampleFilename.slice();
        this.audioSampleDisplayName = audioSampleDisplayName;
        this.audioSampleBase64 = audioSampleBase64?.slice();
    }

    static rhythmModeIsValid(mode){
        for (let option of rhythmModeOptions){
            if (option.name === mode) return true;
        }
    
        return false;
    }
    
    static rhythmOffsetIsValid(offset){
        return Number.isFinite(offset) && offset >= 0;
    }
    
    static rhythmCountIsValid(count){
        return Number.isFinite(count) && count > 0 && Math.round(count) === count;
    }
    
    static rhythmListIsValid(rhythms){
        if (rhythms.length < 1) return false;
    
        for (let r of rhythms){
            if ((!Number.isFinite(r)) || r < 0){
                return false;
            }
        }
    
        return true;
    }

    static cycleTimeIsValid(cycleTime){
        return Number.isFinite(cycleTime) && cycleTime > 0;
    }

    static pitchModeIsValid(mode){
        for (let option of pitchModeOptions){
            if (option.name === mode) return true;
        }

        return false;
    }

    static pitchOffsetIsValid(offset){
        return Number.isFinite(offset);
    }

    static pitchMultiplierIsValid(mult){
        return Number.isFinite(mult) && mult > 0;
    }

    static pitchListIsValid(pitches){
        if (pitches.length < 1) return false;

        for (let p of pitches){
            if (!Number.isFinite(p)){
                return false;
            }
        }

        return true;
    }

    /**
     * Arguments:
     *  `rgbValues` i.e. ColorKeyFrame().rgbValues
     * 
     * Returns:
     * a corresponding list of booleans that indicates the validity of each item.
     * i.e. if `rgbValues` was `[-9, 255, 0]` the returned list would be `[false, true, true]`
     */
    static colorValuesValidation(rgbValues){
        return rgbValues.map(v => Number.isFinite(v) && 0 <= v && v <= 255);
    }

    static colorScaleIsValid(colorScale){
        return Number.isFinite(colorScale) && colorScale !== 0;
    }

    getCanvasScaledPhysicalStrokeWeight(){
        return this.strokeWeight * canvasWidth / this.canvasWidth;
    }
}

function base64ToTypedArray(base64String) {
    let binaryString = window.atob(base64String);
    let len = binaryString.length;
    let buffer = new ArrayBuffer(len);
    let bytes = new Uint8Array(buffer);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

function typedArrayToBase64(typedArray) {
    let binaryString = "";
    let len = typedArray.byteLength;
    for (let i = 0; i < len; i++) {
        binaryString += String.fromCharCode(typedArray[i]);
    }
    return window.btoa(binaryString);
}
