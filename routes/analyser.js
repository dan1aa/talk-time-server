const router = require('express').Router();
const Bookmark = require('../models/Bookmark')

const LINK = process.env.LINK;

router.get('/analyser/:id', async (req, res) => {
    const splittedURL = req.url.split('/')
    const url = splittedURL[splittedURL.length - 1]
    const bookmarks = await Bookmark.find({ url })
    res.render('analyser', {
        title: 'Analyser',
        cssFileName: 'analyser',
        link: LINK,
        url,
        bookmarks
    })
})

router.post('/analyser/:url', async (req, res) => {
        const splittedURL = req.url.split('/')
        const url = splittedURL[splittedURL.length - 1]

        let { name, bookmark, time } = req.body;
    
        let newBookmark = new Bookmark({
            name,
            bookmark,
            time,
            url
        })
    
        await newBookmark.save()
        
        res.redirect(`/analyser/${url}`)
})

module.exports = router;