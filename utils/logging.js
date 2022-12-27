function debugLog(){
    if (DEBUG){
        console.log(...arguments);
    }
}

function debugWarn(){
    if (DEBUG){
        console.warn(...arguments);
    }
}

function debugError(){
    if (DEBUG){
        console.error(...arguments);
    }
}