/**
 * represents all user-configurable settings pertaining to a given polyrhythm animation
 * Patch is intended to be serializable such that patches can be saved and loaded
 */
class Patch {
    // this works as a copy constructor in addition to constructing from a simple js struct
    constructor({ animationMode, rhythmMode, rhythmOffset, rhythmCount, rhythmIsReversed, rhythms, cycleTime,
                  pitchMode, tuningMode, pitches, pitchOffset, pitchMultiplier, skips, colorMode, colorKeyFrames,
                  doColorRipple, strokeWeight, canvasWidth, canvasHeight, ngonShrinkFactor, ngonInnerPolygonSideCount,
                  squareStyle, size, backgroundColor }){
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
        this.colorMode = colorMode;
        this.colorKeyFrames = Array.from(colorKeyFrames, k => new ColorKeyFrame(k));
        this.doColorRipple = doColorRipple;
        this.strokeWeight = strokeWeight;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.ngonShrinkFactor = ngonShrinkFactor;
        this.ngonInnerPolygonSideCount = ngonInnerPolygonSideCount;
        this.squareStyle = squareStyle;
        this.size = size;
        this.backgroundColor = backgroundColor;
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
        return Number.isFinite(count) && count > 0;
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
}