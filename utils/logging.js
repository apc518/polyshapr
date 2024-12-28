function debugLog(level, args){
    if (debugLevel >= level){
        console.log(...args);
    }
}

function debugWarn(level, args){
    if (debugLevel >= level){
        console.warn(...args);
    }
}

function debugError(level, args){
    if (debugLevel >= level){
        console.error(...args);
    }
}