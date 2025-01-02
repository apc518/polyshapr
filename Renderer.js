class Renderer {
    static _isRendering = false;
    static globalProgressEnd = 0;
    static outAudioBuffer;

    static isRendering() {
        return Renderer._isRendering;
    }
    
    static startRender(cycleCount, canvasSize, videoBitrate, audioBitrate) {
        Renderer._isRendering = true;
        resizeCanvasAndRefresh(canvasSize, canvasSize);
        resetAnimation();
        Renderer.renderAudio();
    }

    static renderVideo(){
        // create PNGs for every frame without timing (as fast as possible)
        // do audio render
        
        // set up a media recorder to record the (a secondary?) canvas that we put the pngs on
        // which hopefully will always be fast enough to keep up with 60fps
        // we will bundle the audio and video by creating a howl with the rendered audio
        // and recording that stream just as we do with the normal recording process in record.js
    }

    static renderAudio(){
        let audioFileName;

        if (currentPatch.audioSampleIsCustom){
            let audioFileBytes = base64ToTypedArray(currentPatch.audioSampleBase64).buffer;
            audioFileName = URL.createObjectURL(new Blob([audioFileBytes]));
        }
        else{
            audioFileName = currentPatch.audioSampleFilename;
        }

        fetch(audioFileName)
        .then(res => res.arrayBuffer())
        .then(arrayBuffer => {
            console.log(arrayBuffer);
            let audioCtx = new window.AudioContext();
            audioCtx.decodeAudioData(arrayBuffer)
            .then(async (audioBuffer) => {
                let channelOutBuffers = [];
                let totalSamplesToProcess = audioBuffer.sampleRate * currentPatch.cycleTime * 4;
                let samplesProcessed = 0;
                let lastSleepTime = Date.now();
                const PROGRESS_CHECK_INTERVAL = 100_000; // samples

                const letUIUpdate = async () => {
                    let now = Date.now();
                    if (now - lastSleepTime > 1000 / FRAMERATE) {
                        lastSleepTime = now;
                        document.getElementById("renderProgressGauge").innerText = (100 * samplesProcessed / totalSamplesToProcess).toPrecision(3);
                        debugLog(DEBUG_LEVEL_THREE, [samplesProcessed / totalSamplesToProcess, Date.now() / 1000]);
                        await new Promise(r => setTimeout(r, 0));
                    }
                }

                // add up how many samples will be processed in the main rendering inner loop
                let inputAudioClipChannelData = audioBuffer.getChannelData(0);
                for (let rhythmIdx = 0; rhythmIdx < currentPatch.rhythms.length; rhythmIdx++){
                    let pitchMult = soundList[rhythmIdx % soundList.length].speed;
                    let rhythm = currentPatch.rhythms[rhythmIdx];
                    totalSamplesToProcess += rhythm * floor(inputAudioClipChannelData.length / pitchMult);
                }
                totalSamplesToProcess *= audioBuffer.numberOfChannels;

                for(let channelIdx = 0; channelIdx < audioBuffer.numberOfChannels; channelIdx++){
                    let inputAudioClipChannelData = audioBuffer.getChannelData(channelIdx);
                    let outputArray = new Float32Array(audioBuffer.sampleRate * currentPatch.cycleTime);

                    // render!!!
                    for (let rhythmIdx = 0; rhythmIdx < currentPatch.rhythms.length; rhythmIdx++){
                        let pitchMult = soundList[rhythmIdx % soundList.length].speed;
                        let rhythm = currentPatch.rhythms[rhythmIdx]
                        for (let hitIdx = 0; hitIdx < rhythm; hitIdx++){
                            let numAudioFramesForThisHit = floor(inputAudioClipChannelData.length / pitchMult);
                            for (let scaledInputAudioFrameIdx = 0; scaledInputAudioFrameIdx < numAudioFramesForThisHit; scaledInputAudioFrameIdx++){
                                let s1_idx = floor(scaledInputAudioFrameIdx * pitchMult);
                                let s2_idx = ceil(scaledInputAudioFrameIdx * pitchMult);
                                s2_idx = s2_idx >= inputAudioClipChannelData.length ? s1_idx : s2_idx; // set sample 2's index to be the same as sample 1 if its out of bounds
                                let s1 = inputAudioClipChannelData[s1_idx];
                                let s2 = inputAudioClipChannelData[s2_idx];
                                let portion = scaledInputAudioFrameIdx * pitchMult - floor(scaledInputAudioFrameIdx * pitchMult);
                                let inputSample = lerp(s1, s2, portion);

                                let outputIdx =  hitIdx * outputArray.length / rhythm + scaledInputAudioFrameIdx;
                                let o1_idx = floor(outputIdx);
                                let o2_idx = ceil(outputIdx);
                                if (o1_idx === o2_idx){
                                    outputArray[o1_idx] += inputSample;
                                }
                                else{
                                    let o1_portion = outputIdx - o1_idx;
                                    let o2_portion = o2_idx - outputIdx;
                                    
                                    outputArray[o1_idx] += o1_portion * inputSample;
                                    outputArray[o2_idx] += o2_portion * inputSample;
                                }
                                
                                samplesProcessed += 1;
                                
                                if (samplesProcessed % PROGRESS_CHECK_INTERVAL === 0){
                                    await letUIUpdate();

                                    if (!Renderer._isRendering) break; // check for cancellation
                                }
                            }
                            if (!Renderer._isRendering) break;
                        }
                        if (!Renderer._isRendering) break;
                    }
 
                    // normalize
                    let maxAmplitude = 0;
                    for (let value of outputArray){
                        maxAmplitude = abs(value) > maxAmplitude ? value : maxAmplitude;
                        samplesProcessed += 1;
                        if (samplesProcessed % PROGRESS_CHECK_INTERVAL === 0){
                            await letUIUpdate();
                        }
                        if (!Renderer._isRendering) break;
                    }
                    for (let outIdx = 0; outIdx < outputArray.length; outIdx++){
                        outputArray[outIdx] /= maxAmplitude;
                        samplesProcessed += 1;
                        if (samplesProcessed % PROGRESS_CHECK_INTERVAL === 0){
                            await letUIUpdate();
                        }
                        if (!Renderer._isRendering) break;
                    }

                    channelOutBuffers.push(outputArray);
                }

                // create the output audio buffer
                Renderer.outAudioBuffer = new AudioBuffer({
                    length: channelOutBuffers[0].length,
                    numberOfChannels: channelOutBuffers.length,
                    sampleRate: audioBuffer.sampleRate
                });

                for (let i = 0; i < channelOutBuffers.length; i++){
                    Renderer.outAudioBuffer.copyToChannel(channelOutBuffers[i], i);
                }

                document.getElementById("renderProgressGauge").innerText = 100;

                Renderer.generateDownload();
            });
        });
    }

    static stopRender(){
        if (Renderer._isRendering){
            Renderer._isRendering = false;
            // recorder.stop();
            pause_();
            resizeCanvasAndRefresh(currentPatch.canvasWidth, currentPatch.canvasHeight);
            recordVideoBtn.textContent = 'Start Recording Now';
        }
    }

    static makeSawWaveLol(){
        let sampleRate = 44100;
        let outputArray = new Float64Array(sampleRate * 1);
        let frequency = 220;

        for (let outputSample = 0; outputSample < outputArray.length; outputSample++){
            let k = 0;
            let n = 100;
            for (let i = 1; i < n; i++){
                // outputArray[outputSample] += sin(pow(k, i) * PI + i * frequency * 2 * PI * outputSample / sampleRate) / i;
                outputArray[outputSample] += sin(k * PI + i * frequency * 2 * PI * outputSample / sampleRate) / i;
            }
            // outputArray[outputSample] = sin(frequency * 2 * PI * outputSample / sampleRate);
        }

        console.log(outputArray);

        
        // normalize
        let maxAmplitude = 0;
        for (let value of outputArray){
            maxAmplitude = abs(value) > maxAmplitude ? value : maxAmplitude;
        }
        for (let outIdx = 0; outIdx < outputArray.length; outIdx++){
            outputArray[outIdx] /= maxAmplitude;
        }

        let f32outArray = new Float32Array(sampleRate * 1);
        for (let i = 0; i < f32outArray.length; i++){
            f32outArray[i] = outputArray[i];
        }
        
        console.log("post normalization:", outputArray);

        // create the output audio buffer
        Renderer.outAudioBuffer = new AudioBuffer({
            length: f32outArray.length,
            numberOfChannels: 1,
            sampleRate: sampleRate
        });

        Renderer.outAudioBuffer.copyToChannel(f32outArray, 0);
    }

    static generateDownload(){
        // function by Russell Good, some modifications by me https://www.russellgood.com/how-to-convert-audiobuffer-to-audio-file/
        const bufferToWave = (abuffer) => {
            const numOfChan = abuffer.numberOfChannels;
            const length = abuffer.length * numOfChan * 2 + 44;
            let buffer = new ArrayBuffer(length);
            let view = new DataView(buffer);
            let channels = [];
            let pos = 0;
            let offset = 0;
            
            const writeUint16 = (data) => {
                // little endian
                view.setUint16(pos, data, true);
                pos += 2;
            }
            
            const writeUint32 = (data) => {
                // little endian
                view.setUint32(pos, data, true);
                pos += 4;
            }

            // write WAVE header
            writeUint32(0x46464952); // "RIFF" backwards (since setUint32 does little endian, but this needs to actually be forwards)
            writeUint32(length - 8); // bytes in file after this word
            writeUint32(0x45564157); // "WAVE" also backwards, see two lines above
            writeUint32(0x20746d66); // "fmt " also backwards
            writeUint32(16); // length of file up until this point
            writeUint16(1); // type PCM
            writeUint16(numOfChan);
            writeUint32(abuffer.sampleRate);
            writeUint32(abuffer.sampleRate * 2 * numOfChan); // average bytes/sec
            writeUint16(numOfChan * 2) // block alignment (bits/sample * number of channels)
            writeUint16(16) // bit depth

            writeUint32(0x61746164); // "data" backwards, since setUint32 does little endian but this needs to actually be forwards
            writeUint32(length - pos - 4); // number of bytes

            // write interleaved data
            for(let i = 0; i < numOfChan; i++){
                channels.push(abuffer.getChannelData(i));
            }

            // write the data
            while(pos < length) {
                for(let i = 0; i < numOfChan; i++){
                    let sample = max(-1, min(1, channels[i][offset]));
                    sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
                    view.setInt16(pos, sample, true);
                    pos += 2;
                }
                offset++;
            }

            // create Blob
            return new Blob([buffer], { type: "audio/wav" });
        }


        Renderer.outAudioObjURL = URL.createObjectURL(bufferToWave(Renderer.outAudioBuffer))

        let downloadElem = document.createElement('a');
        downloadElem.target = "_blank";
        downloadElem.download = `polyshapr-${hashCode(JSON.stringify(currentPatch))}.wav`;
        downloadElem.href = Renderer.outAudioObjURL;
        downloadElem.click();
    }
}