function setupAnimationModeEventHandlers(){
    for (let option of animationModeOptions){
        // the html elem id for the corresponding radio button for a given animation mode
        // should be the mode plus "OptionBtn"
        let elem = document.getElementById(option.htmlId);
        elem.onclick = () => {
            currentPatch.animationMode = option.name;
            clearColorList();
            populateColorList();
            clearSoundList();
            populateSoundListFromPreset();
            option.func();
    
            if (!isLooping()){
                setMasterPolyRhythmProgress();
                paint();
            }
        };
    }
}

function displayAnimationModeSettings(){
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

    setupAnimationModeEventHandlers();
}
