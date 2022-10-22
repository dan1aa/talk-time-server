window.onload = async function () {

    const nameEl = document.querySelector('.username')
    const name = nameEl.textContent;
    
    const urlEl = document.querySelector('.url')
    const url = urlEl.textContent;

    function groupAverage(arr) {
        var result = [];
        for (var i = 0; i < arr.length;) {
            var sum = 0;
            for (var j = 0; j < 8; j++) {
                sum += +arr[i++] || 0;
            }
            result.push(sum / 8);
        }
        let mapped = result.map((item) => Math.round(item));
        return mapped;
    }

    let arr = []

    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
    })
        .then(function (stream) {
            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

            analyser.smoothingTimeConstant = 0.8;
            analyser.fftSize = 1024;

            microphone.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);
            scriptProcessor.onaudioprocess = function () {
                const array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                const arraySum = array.reduce((a, value) => a + value, 0);
                const average = arraySum / array.length;
                arr.push(Math.round(average) * 100)
            };
            let res;
            let av = []
            setInterval(() => {
                arr.forEach(item => {
                    if (item === 0) item = 1
                    let sum = 0;
                    sum += item;
                    res = Math.round(sum / (arr.length / 2));
                })
                av.push(res)
                console.log(av)
                document.querySelector('.button-meeting-ends').onclick = function () {
                    this.disabled = true;
                    let averageArray = groupAverage(av)
                    fetch(`http://localhost:3000/vad/${url}/${name}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            array: averageArray
                        })
                    })
                }
            }, 1000)
        })
        .catch(function (err) {
            console.error(err);
        });
}