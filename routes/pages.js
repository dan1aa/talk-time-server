const router = require('express').Router()
const LINK = process.env.LINK

router.get('/extension/:url', (req, res) => {
    const { url } = req.params;
    res.render('about', {
        cssFileName: 'about',
        link: LINK,
        url
    })
})

router.get('/badges/:url', (req, res) => {
    const { url } = req.params;
    res.render('badges', {
        cssFileName: 'feedback',
        link: LINK,
        isBadges: true,
        url
    })
})

module.exports = router