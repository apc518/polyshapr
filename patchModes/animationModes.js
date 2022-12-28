const ANIMATION_MODES = Object.freeze({
    SQUARES: "squares",
    TRIANGLES: "triangles",
    NGONS: "ngons"
});


const animationModeOptions = [
    {
        name: ANIMATION_MODES.SQUARES,
        displayName: "Squares",
        func: () => {
            if (currentPatch) {
                debugLog("squares with", currentPatch);
                master_pr = squarePolyRhythmRecursive();
            }
            else{
                console.warn("currentPatch was not defined when squares func was called");
            }
        }
    },
    {
        name: ANIMATION_MODES.TRIANGLES,
        displayName: "Triangles",
        func: () => {
            if (currentPatch){
                debugLog("triangles with ", currentPatch);
                master_pr = trianglePolyrhythmRecursive();
            }
            else{
                console.warn("currentPatch was not defined when triangles func was called");
            }
        }
    },
    {
        name: ANIMATION_MODES.NGONS,
        displayName: "N-Gons",
        func: () => {
            if(currentPatch){
                debugLog("ngons with ", currentPatch);
                while (currentPatch.skips.length < currentPatch.rhythms.length){
                    currentPatch.skips.push(0);
                }
                master_pr = makeNGonRecursive();
            }
            else{
                console.warn("currentPatch was not defined when ngons func was called");
            }
        }
    }
]


const animationModeOptionsMap = {}

// populate animationModeOptionsMap
for (let option of animationModeOptions){
    animationModeOptionsMap[option.name] = option;
    option.htmlId = option.name + "OptionBtn";
}

// populate HTML
for (let option of animationModeOptions){
    let elem = document.createElement('input');
    elem.type = 'radio';
    elem.id = option.htmlId;
    elem.innerText = option.displayName;
    elem.name = "animationModeOptionBtn";
    elem.className = "animationModeOptionBtn";
    animationModeButtons.appendChild(elem);

    // make label
    let labelElem = document.createElement('label');
    labelElem.htmlFor = option.htmlId;
    labelElem.innerText = option.displayName;
    animationModeButtons.appendChild(labelElem);
}