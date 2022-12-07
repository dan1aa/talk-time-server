const router = require('express').Router()
const User = require('../models/User')

const LINK = process.env.LINK;

router.post('/vad/:url/:name', async (req, res) => {
    const { name, url } = req.params;
    const { array } = req.body;
    User.updateOne({ name, url }, { peaks: array }, { multi: true }, function (err, nums) { })
})

router.get('/vad/:url/:name', async (req, res) => {
    const { url, name } = req.params;
    const currentUser = await User.findOne({ url, name })
    console.log(currentUser)
    if (currentUser) {
        res.render('vad', {
            title: "VAD",
            cssFileName: 'vad',
            link: LINK,
            name,
            url
        })
    }
    else {
        res.status(404).render('notfound', {
            title: 'Not found',
            message: 'User not found',
            cssFileName: 'feedback'
        })
    }


})

router.get('/activity/:url', async (req, res) => {
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