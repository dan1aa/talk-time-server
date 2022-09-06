const router = require('express').Router()
const Feedback = require('../models/Feedback')
const User = require('../models/User')
let multer = require('multer')
const path = require('path')

let storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, done) {
        done(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

let upload = multer({
    storage: storage,
    limits: {
        fileSize: 3000000
    }
}).single('file');

const LINK = process.env.LINK

router.get('/feedbacks/:url', async (req, res) => {
    const url = req.url.split('/')[req.url.split('/').length - 1];
    const users = await User.find({
        url
    })

    if (users.length === 0) {
        res.status(404).render('notfound', {
            cssFileName: 'feedback',
            message: 'Meeting URL not found, maybe you enter a wrong URL',
            title: 'Not found',
            link: LINK,
            isMain: true
        })
    }
    else {
        res.render('main', {
            cssFileName: 'feedback',
            users,
            title: 'Feedbacks',
            link: LINK,
            isMain: true
        })
    }
})

router.post('/feedbacks/:url', async (req, res) => {
    if (req.headers['token'] === process.env.HEADER) {
        const url = req.url.split('/')[req.url.split('/').length - 1];
        const { users } = req.body;
        if (users.length) {
            for (let i = 0; i < users.length; i++) {
                const user = await User.findOne({ name: users[i].name, url })
                if (!user) {
                    const newUser = new User({
                        name: users[i].name,
                        url,
                        avatar: users[i].img
                    })

                    await newUser.save()
                }
            }
        }
        res.end()
    }
    else {
        res.status(404).render('notfound', {
            cssFileName: 'feedback',
            message: 'Invalid Token, access denied',
            title: 'Not found',
            link: LINK,
            isMain: true
        })
    }
})

router.get('/newfeedback/:url/:name', (req, res) => {
    const splittedURL = req.url.split('/')
    const name = splittedURL[splittedURL.length - 1].replaceAll("%20", " ")
    const url = splittedURL[splittedURL.length - 2]

    res.render('form', {
        cssFileName: 'feedback',
        name,
        url,
        title: 'Leave feedback',
        link: LINK
    })
})

router.post('/newfeedback/:url/:name', async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            throw new Error(err)
        }
        
        const { sender, rating, feedback } = req.body;
        let sendUser = await User.findOne({ name: sender })
        if (!sendUser) {
            res.status(404).render('notfound', {
                cssFileName: 'feedback',
                message: 'Invalid username, please enter your correct google meet name',
                title: 'Not found',
                link: LINK,
                isMain: true
            })
            return;
        }

        else {
            let senderImg = sendUser.avatar
            const url = req.url.split('/')[req.url.split('/').length - 2];
            const receiver = req.url.split('/')[req.url.split('/').length - 1].replaceAll("%20", " ");

            let newFeedback = new Feedback({
                sender,
                receiver,
                feedback,
                rating,
                url,
                senderImg,
                feedbackImg: ''
            });

            if(req.file) {
                newFeedback.feedbackImg = '/uploads/' + req.file.filename || '';
            }

            await newFeedback.save()
                .then(() => {
                    res.render('success', {
                        cssFileName: 'feedback',
                        url,
                        title: 'Success'
                    })
                })
        }


    })

})

router.get('/feedbacks/:url/:name', async (req, res) => {
    const name = req.url.split('/')[req.url.split('/').length - 1].replaceAll("%20", " ");
    const url = req.url.split('/')[req.url.split('/').length - 2];
    const feedbacks = await Feedback.find({
        receiver: name,
        url
    })
    res.render('feedbacksOfOne', {
        cssFileName: 'feedback',
        name,
        feedbacks,
        url
    })
})

module.exports = router;