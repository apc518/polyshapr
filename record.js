const chunks = [];

function recordVideo() {
    chunks.length = 0;
    let stream = p5canvas.canvas.captureStream(60);
    let audioMediaDestNode = Howler.ctx.createMediaStreamDestination()
    Howler.masterGain.connect(audioMediaDestNode);
    stream.addTrack(audioMediaDestNode.stream.getAudioTracks()[0]);
    recorder = new MediaRecorder(stream, {
        videoBitsPerSecond: 6 * 1024 * 1024 * 8,
        audioBitsPerSecond: 192 * 1024,
    });
    recorder.ondataavailable = e => {
        if (e.data.size) {
            chunks.push(e.data);
        }
    };
    recorder.onstop = exportVideo;
    recordVideoBtn.onclick = e => {
        recorder.stop();
        recordVideoBtn.textContent = 'Start Recording';
        recordVideoBtn.onclick = recordVideo;
    };
    recorder.start();
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

recordVideoBtn.onclick = recordVideo;
