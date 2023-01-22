function updateAudioSampleUI(){
    for (let i = 0; i < audioSampleDropdown.children.length; i++){
        if (audioSampleDropdown.children[i].value === currentPatch.audioSampleFilename){
            audioSampleDropdown.selectedIndex = i;
        }
    }
}

function displayAudioSampleSettings(){
    audioSampleDropdown.replaceChildren([]);
    
    for (let option of audioSampleOptions){
        let elem = document.createElement('option');
        elem.value = option.filepath;
        elem.innerText = option.displayName;
        audioSampleDropdown.appendChild(elem);
        
        elem.onclick = e => {
            if (e) return;

            currentPatch.audioSampleIsCustom = !!option.custom;
            currentPatch.audioSampleFilename = option.filepath;
            currentPatch.audioSampleDisplayName = option.displayName;
            currentPatch.audioSampleBase64 = option.base64;

            fullRefresh();
        }
    }
}
