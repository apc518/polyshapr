class Sound {
    constructor(src, extension, speed){
        if (extension.startsWith(".")){
            extension = extension.slice(1);
        }

        this.snd = new Howl({
            src: src,
            rate: speed,
            format: [ extension ]
        });

        this.speed = speed;
        this.on = false;
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
