function debugLog(){
    if (debug){
        console.log(...arguments);
    }
}

function debugWarn(){
    if (debug){
        console.warn(...arguments);
    }
}

function debugError(){
    if (debug){
        console.error(...arguments);
    }
}