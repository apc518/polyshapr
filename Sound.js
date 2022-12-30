class Sound {
    static allHowls = [];

    // howl is a howler.js Howl object
    constructor(src, extension, speed){
        if (extension.startsWith(".")){
            extension = extension.slice(1);
        }

        // arguments
        this.snd = new Howl({
            src: src,
            rate: speed,
            format: [ extension ]
        });

        Sound.allHowls.push(this.snd);

        this.speed = speed;

        // data
        this.on = false;
        this.initial_speed = speed;
    }

    play(){
        this.snd.stop();
        this.snd.play();
    }

    stop(){
        this.snd.stop();
    }

    setRate(rate){
        this.snd.rate(rate);
    }
}
