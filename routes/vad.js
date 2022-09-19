const router = require('express').Router()
const { SpeechRecorder } = require('speech-recorder')

const INTERVAL_MAX = 40000000

router.get('/vad/:id', (req, res) => {

    let isSpeaking = false;
    let arr = [];
    const recorder = new SpeechRecorder({
        onAudio: ({ speaking, probability, volume }) => {
            isSpeaking = speaking ? 'Speaking' : 'Silence'
            arr.push(isSpeaking);
            setInterval(() => {
                console.log(arr)
                arr.length = 0
            }, 2000)
        }
    });
    recorder.start()

    setInterval(() => {
        recorder.stop();
    }, INTERVAL_MAX); // 4000000ms = 11 hours +-

    res.render('vad', {
        cssFileName: 'feedback',
        title: 'VAD',
        isMain: true
    })
})

module.exports = router;