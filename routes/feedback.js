const router = require('express').Router()
const Feedback = require('../models/Feedback')
const User = require('../models/User')
let multer = require('multer')
const path = require('path')
const config = require('../badge_config/config')

const LINK = process.env.LINK
const DEFAULT_SELECT_BADGE = 'Choose the Badge (not necessarily)'
const DEFAULT_TECH_BADGE = 'Select Technology'

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


router.get('/feedbacks/:url', async (req, res) => {
    const { url } = req.params;
    const users = await User.find({
        url
    })

    if (users.length === 0) {
        res.status(404).render('notfound', {
            cssFileName: 'feedback',
            message: 'Meeting URL not found, maybe you enter a wrong URL',
            title: 'Not found',
            link: LINK,
            url
        })
    }
    else {
        res.render('feedbacks', {
            cssFileName: 'feedback',
            users,
            title: 'Feedbacks',
            link: LINK,
            url
        })
    }
})

router.post('/feedbacks/:url', async (req, res) => {
    if (req.headers['token'] === process.env.HEADER) {
        const { url } = req.params;
        const { users } = req.body;
        if (users.length) {
            for (let i = 0; i < users.length; i++) {
                const user = await User.findOne({ name: users[i].name, url })
                if (!user) {
                    const newUser = new User({
                        name: users[i].name,
                        url,
                        avatar: users[i].img,
                        badges: []
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
        })
    }
})

router.get('/newfeedback/:url/:name', async (req, res) => {
    const { url , name } = req.params;
    const users = await User.find({ url })
    const currentUser = await User.findOne({name, url})
    let apprenticeCount = 0;
    currentUser?.techs.forEach(tech => {
        tech.badge.endsWith('2') ? apprenticeCount += 1 : undefined
    })
    res.render('form', {
        cssFileName: 'feedback',
        name,
        url,
        title: 'Leave feedback',
        link: LINK,
        users,
        masteryUnlocked: apprenticeCount >= 2
    })
})

router.post('/newfeedback/:url/:name', async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            throw new Error(err)
        }
        let senderImg;

        let { sender, rating, feedback, badge, tech, level } = req.body;

        let sendUser = await User.findOne({ name: sender })

        if (badge !== DEFAULT_SELECT_BADGE) {
            key = `${badge.toLowerCase().split(' ').join('_')}`;
            value = config[key]
            badge = `${key}${value}.png`
        }

        senderImg = sendUser ? sendUser.avatar : 'https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png'

        const { url, name } = req.params;
        const receiver = req.params.name;


        if (badge !== DEFAULT_SELECT_BADGE) {
            console.log(badge)
            await User.findOneAndUpdate({ name: receiver, url }, { $push: { badges: { badge } } })
        }
        if(level || tech) {
            if(tech !== DEFAULT_TECH_BADGE && tech !== undefined) {
                let techBadge = `${tech}${level}`
                await User.updateMany({name: receiver}, { $push: { techs: {badge: techBadge} } })
            }
        }

        let newFeedback = new Feedback({
            sender,
            receiver,
            feedback,
            rating,
            url,
            senderImg,
            feedbackImg: '',
            date: new Date().toLocaleDateString()
        });

        if (req.file) {
            newFeedback.feedbackImg = '/uploads/' + req.file.filename || '';
        }

        await newFeedback.save()
            .then(() => {
                res.render('success', {
                    cssFileName: 'feedback',
                    url,
                    title: 'Success',
                    message: 'Success',
                    link: LINK
                })
            })

    })

})

router.get('/feedbacks/:url/:name', async (req, res) => {
    const name = req.params.name.replaceAll("%20", " ");
    const { url } = req.params;
    const feedbacks = await Feedback.find({
        receiver: name,
        url
    })
    res.render('feedbacksOfOne', {
        cssFileName: 'feedback',
        name,
        feedbacks,
        link: LINK,
        url
    })
})

router.get('/feedback/:url/:id', async (req, res) => {
    const { id, url } = req.params;
    let feedback = await Feedback.findOne({ _id: id, url })
    const users = await User.find({ url })
    res.render('feedbackComment', {
        title: "Comment",
        cssFileName: 'feedbackComment',
        feedback,
        link: LINK,
        users,
        url
    })
})

router.post('/newcomment/:url/:id', async (req, res) => {
    const { id, url } = req.params;
    const { commentName, comment } = req.body;
    await Feedback.findOneAndUpdate({ _id: id, url }, { $push: { comments: { commentName, comment, date: new Date().toLocaleDateString() } } })
    res.render('success', {
        cssFileName: 'feedback',
        title: 'Success',
        url,
        message: 'Success',
        link: LINK
    })
})


router.get('/allbadges/:url/:name', async (req, res) => {
    const { name, url } = req.params;
    let users = await User.find({ name })
    let badges = []

    users.forEach(user => {
        if (user.badges.length) {
            badges.push(user.badges)
        }
    })
    console.log(badges)

    let flattedBadges = badges.flat()

    let result = {};
    flattedBadges.forEach(function (v) {
        result[v.badge] = (result[v.badge] || 0) + 1;
    });

    flattedBadges = flattedBadges.filter(
        (value, index, self) =>
            index === self.findIndex((t) => t.badge === value.badge)
    );

    flattedBadges.map((item, idx) => {
        item.count = Object.values(result)[idx]
    })


    res.render('badgesDisplay', {
        title: `${name}'s badges`,
        cssFileName: 'feedback',
        badges: flattedBadges,
        link: LINK,
        url,
        name
    })
})

router.post('/givebadge/:name', async (req, res) => {
    const { name } = req.params;
    const { badge } = req.body;
    await User.findOneAndUpdate({ name }, { $push: { badges: { badge } } })
    console.log('hey')
})

module.exports = router;