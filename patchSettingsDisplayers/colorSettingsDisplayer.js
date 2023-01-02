function initializeColorUIBasedOnCurrentPatch(){
    colorKeyFrameInput0.value = rgbArrayToHex(currentPatch.colorKeyFrames[0].rgbValues);
    colorKeyFrameInput1.value = rgbArrayToHex(currentPatch.colorKeyFrames[1].rgbValues);

    colorInterpolationModeDropdown.selectedIndex = getIndexOfColorOption(currentPatch.colorInterpolationMode);

    colorInterpolationModeDropdown.oninput();
}


function setupColorSettings(){
    for (let option of colorInterpolationMode){
        let elem = document.createElement('option');
        elem.value = option.name;
        elem.innerText = option.displayName;
        colorInterpolationModeDropdown.appendChild(elem);
    }
}
    
    

function displayColorSettings(){
    if (colorInterpolationModeDropdown.children.length === 0){
        setupColorSettings();
    }

    initializeColorUIBasedOnCurrentPatch();
}


function rgbArrayToHex(rgbArray){
    if (!Patch.colorValuesValidation(rgbArray, COLOR_INTERPOLATION_MODES.RGB)){
        throw new Error("Invalid rgb array");
    }

    let hex = "#";

    for (let value of rgbArray){
        hex += Number(value).toString(16).padStart(2, "0");
    }

    return hex;
}


function hexToRgbArray(hex){
    if (hex.length !== 7) throw new Error("hex string must be exactly 7 characters");
    if (!hex.startsWith("#")) throw new Error("hex string must start with '#'");
    
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return [r,g,b];
}


function rgbToHsl(rgbArray){
    if (!Patch.colorValuesValidation(rgbArray, COLOR_INTERPOLATION_MODES.RGB)){
        throw new Error("Invalid rgb array");
    }

    let r = rgbArray[0];
    let g = rgbArray[1];
    let b = rgbArray[2];

    hex = rgbArrayToHex(rgbArray);

    r /= 255;
    g /= 255;
    b /= 255;

    let bigM = Math.max(r,g,b);
    let m = Math.min(r,g,b);
    let d = bigM-m;
    
    if (d == 0)
        h = 0;
    else if (bigM == r)
        h = ((g - b) / d) % 6;
    else if (bigM == g)
        h = (b - r) / d + 2;
    else
        h = (r - g) / d + 4;
    
    h *= 60;
    
    if (h < 0)
        h += 360;
    
    let l = (bigM + m) / 2;
    
    if (d == 0)
        s = 0;
    else
        s = d/(1-Math.abs(2*l-1));

    s *= 100;
    l *= 100;

    return [
        parseInt(h.toFixed(0)),
        parseInt(s.toFixed(0)),
        parseInt(l.toFixed(0))
    ];
}
