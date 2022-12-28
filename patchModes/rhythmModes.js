const RHYTHM_MODES = Object.freeze({
    CUSTOM: "custom",
    NATURALS: "naturals",
    PRIMES: "primes",
    FIBONACCI: "fibonacci"
});

const rhythmModeOptions = [
    {
        name: RHYTHM_MODES.CUSTOM,
        displayName: "Custom",
        func: () => console.warn("no array can be generated for the custom rhythm list option")
    },
    {
        name: "naturals",
        displayName: "Naturals",
        func: (count, offset=0, reverse=false) => {
            let arr = Array.from({length: count}, (_,i) => offset + i);

            if (reverse){
                arr.reverse();
            }
            
            return arr;
        }
    },
    {
        name: "primes",
        displayName: "Primes",
        func: (count, offset=0, reverse=false) => {
            let max = 3;
            let arr = eratosthenes(max);
            while (arr.length < count){
                max *= 2;
                arr = eratosthenes(max);
            }

            arr = arr.slice(offset, offset + count);

            if (reverse){
                arr.reverse();
            }

            return arr;
        }
    },
    {
        name: "fibonacci",
        displayName: "Fibonacci Series",
        func: (count, offset=0, reverse=false) => {
            let arr = [1,1];
            while (arr.length < count + offset){
                arr.push(arr[arr.length - 1] + arr[arr.length - 2]);
            }

            arr = arr.slice(offset, offset + count);

            if (reverse){
                arr.reverse();
            }

            return arr;
        }
    }
]

const rhythmModeOptionsMap = {}

for (let option of rhythmModeOptions){
    rhythmModeOptionsMap[option.name] = option;
}

// populate rhythmModeDropdown options
for (let option of rhythmModeOptions){
    let optionElem = document.createElement('option');
    optionElem.value = option.name;
    optionElem.innerText = option.displayName;
    rhythmModeDropdown.appendChild(optionElem);
}


function getRhythmOptionNameFromIndex(idx){
    return rhythmModeDropdown.children[idx].value;
}

function getIndexOfRhythmModeOption(optionName){
    for(let i = 0; i < rhythmModeDropdown.children.length; i++){
        if (rhythmModeDropdown.children[i].value === optionName){
            return i;
        }
    }

    throw new Error(`option ${optionName} not found in dropdown`);
}


function rhythmModeIsValid(mode){
    for (let option of rhythmModeOptions){
        if (option.name === mode) return true;
    }

    return false;
}

function rhythmOffsetIsValid(offset){
    return Number.isFinite(offset) && offset >= 0;
}

function rhythmCountIsValid(count){
    return Number.isFinite(count) && count > 0;
}

function rhythmListIsValid(rhythms){
    if (rhythms.length < 1) return false;

    for (let r of rhythms){
        if ((!Number.isFinite(r)) || r < 0){
            return false;
        }
    }

    return true;
}

/**
 * if the rhythms list has items in it that contradict the mode and other rhythm settings,
 * the mode will be set to custom but the other settings will remain in the patch for use
 * if the user desires so
 */
function resolveConflictsBetweenRhythmListAndModeInCurrentPatch(){
    if (!(currentPatch.rhythmMode === RHYTHM_MODES.CUSTOM)){
        let expectedRhythms = rhythmModeOptionsMap[currentPatch.rhythmMode].func(currentPatch.rhythmCount, currentPatch.rhythmOffset, currentPatch.rhythmIsReversed);
        if (!(JSON.stringify(expectedRhythms) === JSON.stringify(currentPatch.rhythms))){
            currentPatch.rhythmMode = RHYTHM_MODES.CUSTOM;
        }
    }
}


function initializeRhythmUIBasedOnCurrentPatch(){
    if (!rhythmModeIsValid(currentPatch.rhythmMode))
        throw new Error("rhythm mode is invalid:", currentPatch.rhythmMode);
    
    if (!rhythmOffsetIsValid(currentPatch.rhythmOffset))
        throw new Error("rhythm offset is invalid:", currentPatch.rhythmOffset);

    if (!rhythmCountIsValid(currentPatch.rhythmCount))
        throw new Error("rhythm count is invalid:", currentPatch.rhythmCount);

    if (!rhythmListIsValid(currentPatch.rhythms)){
        if(currentPatch.rhythmMode === RHYTHM_MODES.CUSTOM){
            throw new Error("given rhythm list was invalid and rhythm mode was custom, cannot create polyrhythm.");
        }
        else{
            console.warn("given rhythm list was invalid; using other rhythm settings");
            currentPatch.rhythms = rhythmModeOptionsMap[currentPatch.rhythmMode].func(currentPatch.rhythmCount, currentPatch.rhythmOffset, currentPatch.rhythmIsReversed)
        }
    }
    
    resolveConflictsBetweenRhythmListAndModeInCurrentPatch();

    // display the rhythm list
    rhythmListInput.value = currentPatch.rhythms.join();

    // set the rhythm mode in the dropdown
    rhythmModeDropdown.selectedIndex = getIndexOfRhythmModeOption(currentPatch.rhythmMode);

    // set count and offset
    rhythmListCountInput.value = currentPatch.rhythmCount;
    rhythmListOffsetInput.value = currentPatch.rhythmOffset;

    // set reversed
    rhythmListIsReversedCheckbox.checked = !!currentPatch.rhythmIsReversed;
    
    // refresh with html handler
    rhythmModeDropdown.oninput();
}


