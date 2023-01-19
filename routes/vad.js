const router = require('express').Router()
const User = require('../models/User')

router.post('/vad/:url/:name', async (req, res) => {
    const { name, url } = req.params;
    const { array } = req.body;
    User.updateOne({ name, url }, { peaks: array }, { multi: true }, function (err, nums) { })
})

router.get('/vad/:url/:name', async (req, res) => {
    const { url, name } = req.params;
    res.render('vad', {
        title: "VAD",
        cssFileName: 'vad',
        name,
        url
    })
})

router.get('/audioactivity/:url', async (req, res) => {
    const { url } = req.params;
    const currentUsers = await User.find({ url })
    currentUsers.forEach(user => {
        user.peaks.forEach(item => {
            if (!item) item += 1
        })
    })
    res.render('activity', {
        users: currentUsers,
        title: 'Detailed Analyser',
        url,
        cssFileName: 'activity'
    })
})

module.exports = router;