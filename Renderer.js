class Renderer {
    static _isRendering = false;
    static globalProgressEnd = 0;
    static outAudioBuffer;
    static samplesProcessed;
    static lastSleepTime;
    static totalSamplesToProcess;
    static PROGRESS_CHECK_INTERVAL = 100_000; // samples
    static renderedAudioHowl;

    static isRendering() {
        return Renderer._isRendering;
    }
    
    static startRender(cycleCount, canvasSize, videoBitrate, audioBitrate, leaveRemainder, exportVideo) {
        Renderer._isRendering = true;
        if (exportVideoCheckbox.checked){
            resizeCanvasAndRefresh(canvasSize, canvasSize);
            resetAnimation();
            Renderer.globalProgressEnd = cycleCount;
        }
        Renderer.renderAudio(cycleCount, leaveRemainder).then(outAudioObjURL => {
            if (!outAudioObjURL) return;

            console.log(outAudioObjURL);

            document.getElementById("renderProgressGauge").innerText = 100;
    
            if (exportVideo) {
                console.log("INITIAL STATE", isLooping(), globalProgress);

                Renderer.renderedAudioHowl = new Howl({ src: outAudioObjURL, format: "wav"});
                Renderer.renderedAudioHowl.on('end', () => {
                    Renderer.stopRender();
                });
                recordVideo(videoBitrate, audioBitrate);
                Renderer.letUIUpdate().then(() => {
                    Renderer.renderedAudioHowl.play();
                    play_();
                });
            }
            else{
                let downloadElem = document.createElement('a');
                downloadElem.target = "_blank";
                downloadElem.download = `polyshapr-${hashCode(JSON.stringify(currentPatch))}.wav`;
                downloadElem.href = outAudioObjURL;
                downloadElem.click();
                Renderer.stopRender();
            }
        });
    }

    static renderVideo(){
        // pause buffering? try calling recorder.start() and then immediately (or maybe after one round of the event loop?) call recorder.pause()
        // then paint the next frame, then repeat until done

        // how to combine the video with the audio?
    }

    static async letUIUpdate() {
        let now = Date.now();
        if (now - Renderer.lastSleepTime > 1000 / FRAMERATE) {
            Renderer.lastSleepTime = now;
            // TODO: deal with the event in which total samples to process is 0. Probably want to just skip the rendering loop
            // altogether and thus not call this function at all, but still in this function I should deal with it
            document.getElementById("renderProgressGauge").innerText = (100 * Renderer.samplesProcessed / Renderer.totalSamplesToProcess).toPrecision(3);
            debugLog(DEBUG_LEVEL_THREE, [Renderer.samplesProcessed / Renderer.totalSamplesToProcess, Date.now() / 1000]);
            await new Promise(r => setTimeout(r, 0));
        }
    }

    static async renderAudio(cycleCount, leaveRemainder){
        let audioSampleFileName;

        if (currentPatch.audioSampleIsCustom){
            let audioFileBytes = base64ToTypedArray(currentPatch.audioSampleBase64).buffer;
            audioSampleFileName = URL.createObjectURL(new Blob([audioFileBytes]));
        }
        else{
            audioSampleFileName = currentPatch.audioSampleFilename;
        }

        let res = await fetch(audioSampleFileName);
        let arrayBuffer = await res.arrayBuffer();
        console.log(arrayBuffer);
        let audioCtx = new window.AudioContext();
        let audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        let channelOutputBuffers = [];

        // calculate output audio length in audio frames
        let outputLength = audioBuffer.sampleRate * currentPatch.cycleTime * cycleCount;
        if (leaveRemainder){
            let maxOutputIdx = 0;
            for (let rhythmIdx = 0; rhythmIdx < currentPatch.rhythms.length; rhythmIdx++){
                let rhythm = currentPatch.rhythms[rhythmIdx];
                let pitchMult = soundList[rhythmIdx % soundList.length].speed;
                if (pitchMult === 0 || rhythm === 0) continue;
                let numAudioFramesForThisHit = floor(audioBuffer.getChannelData(0).length / pitchMult);
                let lastRhythmThatPlaysIdx = floor(rhythm * cycleCount) === rhythm * cycleCount ? floor(rhythm * cycleCount) - 1 : floor(rhythm * cycleCount);
                console.log(`lastRhythmThatPlaysIdx=${lastRhythmThatPlaysIdx} for rhythm ${rhythm}`);
                maxOutputIdx = max(maxOutputIdx, ceil(lastRhythmThatPlaysIdx * audioBuffer.sampleRate * currentPatch.cycleTime / rhythm + numAudioFramesForThisHit));
            }
            outputLength = max(maxOutputIdx, outputLength);
        }

        console.log(JSON.stringify({
            leaveRemainder,
            outputLength,
            outputLengthSeconds: outputLength / audioBuffer.sampleRate,
            cycleCount,
            cycleTime: currentPatch.cycleTime
        }));

        console.log(`Original length: ${audioBuffer.sampleRate * currentPatch.cycleTime * cycleCount}, with leaving remainder: ${outputLength}`);

        Renderer.totalSamplesToProcess = outputLength * 3 * audioBuffer.numberOfChannels; // for the normalization and wav file writing passes
        Renderer.samplesProcessed = 0;
        Renderer.lastSleepTime = Date.now();

        // add up how many samples will be processed in the main rendering inner loop
        for (let rhythmIdx = 0; rhythmIdx < currentPatch.rhythms.length; rhythmIdx++){
            let rhythm = currentPatch.rhythms[rhythmIdx];
            let pitchMult = soundList[rhythmIdx % soundList.length].speed;
            if (pitchMult === 0 || rhythm === 0) continue;
            Renderer.totalSamplesToProcess += rhythm * floor(audioBuffer.getChannelData(0).length / pitchMult * cycleCount);
        }
        Renderer.totalSamplesToProcess *= audioBuffer.numberOfChannels;

        for(let channelIdx = 0; channelIdx < audioBuffer.numberOfChannels; channelIdx++){
            let inputAudioClipChannelData = audioBuffer.getChannelData(channelIdx);
            let outputArray = new Float32Array(outputLength);

            // render!!!
            for (let rhythmIdx = 0; rhythmIdx < currentPatch.rhythms.length; rhythmIdx++){
                let rhythm = currentPatch.rhythms[rhythmIdx];
                let pitchMult = soundList[rhythmIdx % soundList.length].speed;
                if (pitchMult === 0 || rhythm === 0) continue;
                let numAudioFramesForThisHit = floor(inputAudioClipChannelData.length / pitchMult);
                let lastRhythmThatPlaysIdx = floor(rhythm * cycleCount) === rhythm * cycleCount ? floor(rhythm * cycleCount) - 1 : floor(rhythm * cycleCount);
                for (let hitIdx = 0; hitIdx <= lastRhythmThatPlaysIdx; hitIdx++){
                    for (let scaledInputAudioFrameIdx = 0; scaledInputAudioFrameIdx < numAudioFramesForThisHit; scaledInputAudioFrameIdx++){
                        let s1_idx = floor(scaledInputAudioFrameIdx * pitchMult);
                        let s2_idx = ceil(scaledInputAudioFrameIdx * pitchMult);
                        s2_idx = s2_idx >= inputAudioClipChannelData.length ? s1_idx : s2_idx; // set sample 2's index to be the same as sample 1 if its out of bounds
                        let s1 = inputAudioClipChannelData[s1_idx];
                        let s2 = inputAudioClipChannelData[s2_idx];
                        let portion = scaledInputAudioFrameIdx * pitchMult - floor(scaledInputAudioFrameIdx * pitchMult);
                        let inputSample = lerp(s1, s2, portion);

                        let outputIdx =  hitIdx * audioBuffer.sampleRate * currentPatch.cycleTime / rhythm + scaledInputAudioFrameIdx;

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
                        
                        Renderer.samplesProcessed += 1;
                        
                        if (Renderer.samplesProcessed % Renderer.PROGRESS_CHECK_INTERVAL === 0){
                            await Renderer.letUIUpdate();

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
                Renderer.samplesProcessed += 1;
                if (Renderer.samplesProcessed % Renderer.PROGRESS_CHECK_INTERVAL === 0){
                    await Renderer.letUIUpdate();
                }
                if (!Renderer._isRendering) break;
            }
            for (let outIdx = 0; outIdx < outputArray.length; outIdx++){
                outputArray[outIdx] /= maxAmplitude;
                Renderer.samplesProcessed += 1;
                if (Renderer.samplesProcessed % Renderer.PROGRESS_CHECK_INTERVAL === 0){
                    await Renderer.letUIUpdate();
                }
                if (!Renderer._isRendering) break;
            }

            channelOutputBuffers.push(outputArray);
        }

        // create the output audio buffer
        Renderer.outAudioBuffer = new AudioBuffer({
            length: channelOutputBuffers[0].length,
            numberOfChannels: channelOutputBuffers.length,
            sampleRate: audioBuffer.sampleRate
        });

        for (let i = 0; i < channelOutputBuffers.length; i++){
            Renderer.outAudioBuffer.copyToChannel(channelOutputBuffers[i], i);
        }

        return await Renderer.generateDownload();
    }

    static stopRender(){
        if (Renderer._isRendering){
            Renderer._isRendering = false;
            Renderer.renderedAudioHowl?.stop();
            videoRecorder?.stop();
            Renderer.letUIUpdate().then(() => {
                resizeCanvasAndRefresh(currentPatch.canvasWidth, currentPatch.canvasHeight);
                recordVideoBtn.textContent = 'Start Recording Now';
            });
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

    static async generateDownload(){
        // function by Russell Good, some modifications by me https://www.russellgood.com/how-to-convert-audiobuffer-to-audio-file/
        const bufferToWave = async (abuffer) => {
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

                    Renderer.samplesProcessed += 1;
                    if (Renderer.samplesProcessed % Renderer.PROGRESS_CHECK_INTERVAL === 0){
                        await Renderer.letUIUpdate();
                    }
                    if (!Renderer._isRendering) break;
                }
                offset++;
            }

            // create Blob
            return new Blob([buffer], { type: "audio/wav" });
        }

        let res = await bufferToWave(Renderer.outAudioBuffer);
        
        if (Renderer._isRendering){
            return URL.createObjectURL(res);
        }
    }
}