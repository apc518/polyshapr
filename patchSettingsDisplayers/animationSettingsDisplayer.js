function updateAnimationModeUI(){
    for (let elem of animationModeButtons.children){
        elem.checked = currentPatch.animationMode === elem.mode;
    }
}


function setupAnimationModeUI(){
    for (let option of animationModeOptions){
        let elem = document.createElement('input');
        elem.type = 'radio';
        elem.id = option.htmlId;
        elem.mode = option.mode;
        elem.innerText = option.displayName;
        elem.name = "animationModeOptionBtn";
        elem.className = "animationModeOptionBtn";
        animationModeButtons.appendChild(elem);

        elem.onclick = () => {
            currentPatch.animationMode = option.mode;
            fullRefresh();
        }

        elem.checked = currentPatch.animationMode === option.mode;
    
        // make label
        let labelElem = document.createElement('label');
        labelElem.htmlFor = option.htmlId;
        labelElem.innerText = option.displayName;
        animationModeButtons.appendChild(labelElem);
    }
}
