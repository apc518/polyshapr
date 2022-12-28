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

function getRhythmOptionNameByIndex(idx){
    return rhythmModeDropdown.children[idx].value;
}

function getIndexOfRhythmModeOption(optionName){
    for(let i = 0; i < rhythmModeDropdown.children.length; i++){
        if (rhythmModeDropdown.children[i].value === optionName){
            return i;
        }
    }

    throw new Error(`rhythm option ${optionName} not found in rhythm mode dropdown`);
}
