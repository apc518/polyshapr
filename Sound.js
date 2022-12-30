class Sound {
    // howl is a howler.js Howl object
    constructor(src, speed){
        // arguments
        this.snd = new Howl({ src: src, rate: speed });
        this.speed = speed;

        // data
        this.on = false;
        this.initial_speed = speed;
    }

    play(){
        this.snd.stop();
        this.snd.play();
    }

    setRate(rate){
        this.snd.rate(rate);
    }
}
