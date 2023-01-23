const ANIMATION_MODES = Object.freeze({
    SQUARES: "squares",
    TRIANGLES: "triangles",
    NGONS: "ngons"
});


const animationModeOptions = [
    {
        mode: ANIMATION_MODES.SQUARES,
        displayName: "Squares",
        func: () => {
            if (currentPatch) {
                debugLog("squares with", currentPatch);
                rootPr = squarePolyRhythmRecursive();
            }
            else{
                console.warn("currentPatch was not defined when squares func was called");
            }
        }
    },
    {
        mode: ANIMATION_MODES.TRIANGLES,
        displayName: "Triangles",
        func: () => {
            if (currentPatch){
                debugLog("triangles with ", currentPatch);
                rootPr = trianglePolyrhythmRecursive();
            }
            else{
                console.warn("currentPatch was not defined when triangles func was called");
            }
        }
    },
    {
        mode: ANIMATION_MODES.NGONS,
        displayName: "N-Gons",
        func: () => {
            if(currentPatch){
                debugLog("ngons with ", currentPatch);
                while (currentPatch.skips.length < currentPatch.rhythms.length){
                    currentPatch.skips.push(0);
                }

                Helper.showNgonLt2WarningIfNecessary();

                rootPr = nGonPolyrhythmRecursive();
            }
            else{
                console.warn("currentPatch was not defined when ngons func was called");
            }
        }
    }
];


const animationModeOptionsMap = {}

// populate animationModeOptionsMap
for (let option of animationModeOptions){
    animationModeOptionsMap[option.mode] = option;
    option.htmlId = option.mode + "OptionBtn";
}


function createRootPr(){
    if(currentPatch){
        animationModeOptionsMap[currentPatch.animationMode].func();
    }
    else{
        console.warn("currentPatch was not defined when createRootPr was called");
    }
}
