const router = require('express').Router()
const LINK = process.env.LINK

router.get('/extension/about', (req, res) => {
    res.render('about', {
        cssFileName: 'about',
        link: LINK,
    })
})

router.get('/badges', (req, res) => {
    res.render('badges', {
        cssFileName: 'feedback',
        link: LINK,
        isBadges: true
    })
})

module.exports = router