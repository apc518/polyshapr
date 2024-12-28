class Renderer {
    static isRendering = false;
    static globalProgressEnd = 0;
    
    static startRender(cycleCount, canvasSize, videoBitrate, audioBitrate) {
        resizeCanvasAndRefresh(canvasSize, canvasSize);
        resetAnimation();
        Renderer.isRendering = true;
        Renderer.globalProgressEnd = cycleCount;
        recordVideo(videoBitrate, audioBitrate);
        setTimeout(() => {
            play_();
        }, 0);
    }

    static stopRender(){
        if (Renderer.isRendering){
            recorder.stop();
            pause_();
            Renderer.isRendering = false;
            resizeCanvasAndRefresh(currentPatch.canvasWidth, currentPatch.canvasHeight);
            recordVideoBtn.textContent = 'Start Recording Now';
        }
    }
}