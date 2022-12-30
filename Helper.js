/**
 * helps the user understand whats going on, and remembers what has been told already
 * via localStorage
 */

const polyshaprSettingsKey = "polyshapr";

class Helper {
    static settings = {
        firstVisit: true,
        ngonLt2WarningGiven: false,
        colorInfoGiven: false
    };

    static isLoaded = false;

    static write(){
        localStorage[polyshaprSettingsKey] = JSON.stringify(Helper.settings);
    }

    static load(){
        if (!Helper.isLoaded){
            let polyshaprJson = localStorage[polyshaprSettingsKey];
            if (!polyshaprJson){
                Helper.write();
            }
            else{
                Helper.settings = JSON.parse(polyshaprJson);
                Helper.isLoaded = true;
            }
        }
    }

    static isFirstVisit(){
        Helper.load();
        return Helper.settings.firstVisit;
    }

    static setNotFirstVisit(){
        Helper.settings.firstVisit = false;
        Helper.write();
    }

    static hasNgonLt2WarningBeenGiven(){
        Helper.load();
        return Helper.settings.ngonLt2WarningGiven;
    }

    static setHasNgonLt2WarningBeenGiven(){
        Helper.settings.ngonLt2WarningGiven = true;
        Helper.write();
    }

    static hasColorInfoBeenGiven(){
        Helper.load();
        return Helper.settings.colorInfoGiven;
    }

    static setHasColorInfoBeenGiven(){
        Helper.settings.colorInfoGiven = true;
        Helper.write();
    }


    static showNgonLt2WarningIfNecessary(){
        if (Helper.hasNgonLt2WarningBeenGiven()) return;

        let necessary = false;

        for (let r of currentPatch.rhythms){
            if (r < 3){
                necessary = true;
            }
        }

        if (!necessary) return;

        Swal.fire({ 
            title: "N-Gons with rhythms < 3",
            icon: "info",
            text: "N-Gons might look weird if you have any rhythms less than 3. Thats because in n-gons mode, the number of sides of each shape corresponds to its rhythm. But polygons with less than 3 sides don't really make any sense in our geometry. The rhythm will still play but maybe stick with rhythms >2 for n-gons :)"
        }).then(() => {
            Helper.setHasNgonLt2WarningBeenGiven();
        });
    }
}