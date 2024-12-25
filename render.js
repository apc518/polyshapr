const chunks = [];

function recordVideo() {
    chunks.length = 0;
    let stream = p5canvas.canvas.captureStream(60);
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => {
        if (e.data.size) {
            chunks.push(e.data);
        }
    };
    recorder.onstop = exportVideo;
    recordVideoBtn.onclick = e => {
        recorder.stop();
        recordVideoBtn.textContent = 'start recording';
        recordVideoBtn.onclick = recordVideo;
    };
    recorder.start();
    recordVideoBtn.textContent = 'stop recording';
}

function exportVideo(e) {
    var blob = new Blob(chunks);
    var vid = document.createElement('video');
    vid.id = 'recorded'
    vid.controls = true;
    vid.src = URL.createObjectURL(blob);
    document.body.appendChild(vid);
    vid.play();
}

recordVideoBtn.onclick = recordVideo;