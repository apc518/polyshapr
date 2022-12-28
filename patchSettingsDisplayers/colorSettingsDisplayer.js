function initializeColorUIBasedOnCurrentPatch(){
    colorKeyFrameInput0.children[0].value = currentPatch.colorKeyFrames[0].values[0];
    colorKeyFrameInput0.children[1].value = currentPatch.colorKeyFrames[0].values[1];
    colorKeyFrameInput0.children[2].value = currentPatch.colorKeyFrames[0].values[2];
    
    colorKeyFrameInput1.children[0].value = currentPatch.colorKeyFrames[1].values[0];
    colorKeyFrameInput1.children[1].value = currentPatch.colorKeyFrames[1].values[1];
    colorKeyFrameInput1.children[2].value = currentPatch.colorKeyFrames[1].values[2];

    colorModeDropdown.selectedIndex = getIndexOfColorOption(currentPatch.colorMode);

    colorModeDropdown.oninput();
}


function displayColorSettings(){
    for (let option of colorModeOptions){
        let elem = document.createElement('option');
        elem.value = option.name;
        elem.innerText = option.displayName;
        colorModeDropdown.appendChild(elem);
    }

    initializeColorUIBasedOnCurrentPatch();
}
