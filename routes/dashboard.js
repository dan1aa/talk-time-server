const router = require('express').Router()
const User = require('../models/User')
const Conclusion = require('../models/Conclusion')
const Feedback = require('../models/Feedback')

const LINK = process.env.LINK;

router.get('/dashboard/:url', async (req, res) => {
    const { url } = req.params;
    let usersObject = {}
    const users = await User.find({
        url
    })
    const feedbacks = await Feedback.find({ url })
    users.forEach(user => {
        usersObject[user.name] = {
            name: user.name,
            rating: [],
            avatar: user.avatar,
            percents: user.percents
        }
    })
    const conclusions = await Conclusion.find({ url })
    const ratings = await Feedback.find({ url })
    ratings.forEach(rating => {
        usersObject[rating.receiver].rating.push(rating.rating)
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
        res.render('dashboard', {
            cssFileName: 'dashboard',
            usersObject,
            title: 'Dashboard',
            link: LINK,
            url,
            conclusions,
            usersLength: users.length,
            feedbacksLength: feedbacks.length,
            conclusionsLength: conclusions.length
        })
    }
})

router.post('/percentage/:url', async (req, res) => {
    const { url } = req.params;
    const { percents } = req.body;
    
    percents.forEach(async percent => {
        await User.findOneAndUpdate({name: percent.name, url}, {percents: percent.percent})
    })

    res.status(200).end()
})


router.post('/newconclusion/:url', async (req, res) => {
    const { url, text } = req.body;

    const newConclusion = new Conclusion({
        text,
        url
    })

    await newConclusion.save()
})

module.exports = router;