const chunks = [];

let videoRecorder;

let dataAvailableEventCount = 0;

function recordVideo(videoBitrate, audioBitrate) {
    chunks.length = 0;
    let stream = p5canvas.canvas.captureStream(60);
    let audioMediaDestNode = Howler.ctx.createMediaStreamDestination()
    Howler.masterGain.connect(audioMediaDestNode);
    stream.addTrack(audioMediaDestNode.stream.getAudioTracks()[0]);
    videoRecorder = new MediaRecorder(stream, {
        videoBitsPerSecond: videoBitrate,
        audioBitsPerSecond: audioBitrate,
    });
    videoRecorder.ondataavailable = e => {
        dataAvailableEventCount++;
        if (e.data.size) {
            chunks.push(e.data);
        }
    };
    videoRecorder.onstop = exportVideo;
    recordVideoBtn.onclick = e => {
        videoRecorder.stop();
        recordVideoBtn.textContent = 'Start Recording Now';
        recordVideoBtn.onclick = () => {
            recordVideo(VIDEO_BITRATE_DEFAULT, AUDIO_BITRATE_DEFAULT);
        }
    };
    videoRecorder.start();
    recordVideoBtn.textContent = 'Stop Recording';
}

function exportVideo() {
    var blob = new Blob(chunks);
    let downloadElem = document.createElement('a');
    downloadElem.target = "_blank";
    downloadElem.download = "polyshapr-render.webm";
    downloadElem.href = URL.createObjectURL(blob);
    downloadElem.click();
}

recordVideoBtn.onclick = () => {
    recordVideo(VIDEO_BITRATE_DEFAULT, AUDIO_BITRATE_DEFAULT);
}
