const router = require('express').Router()
const User = require('../models/User')
const Conclusion = require('../models/Conclusion')
const Feedback = require('../models/Feedback')


router.get('/dashboard/:url', async (req, res) => {
    const { url } = req.params;
    const users = await User.find({url})
    const conclusions = await Conclusion.find({url})
    const feedbacks = await Feedback.find({url})
    let feedbacksByName = {}

    users.forEach(user => {
        feedbacksByName[user.name] = {
            name: user.name,
            rating: [],
            avatar: user.avatar,
        }
    })

    feedbacks.forEach(feedback => {
        feedbacksByName[feedback.receiver].rating.push(feedback.rating)
    })


    if (users.length === 0) {
        res.status(404).render('notfound', {
            cssFileName: 'feedback',
            message: 'Meeting URL not found, maybe you enter a wrong URL',
            title: 'Not found',
            url
        })
    }
    else {
        res.render('dashboard', {
            cssFileName: 'dashboard',
            title: 'Dashboard',
            url,
            users,
            conclusions,
            usersLength: users.length,
            feedbacksLength: feedbacks.length,
            conclusionsLength: conclusions.length,
            feedbacksByName,
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
    const { url, text, tags } = req.body;

    const newConclusion = new Conclusion({
        text,
        url,
        tags
    })

    await newConclusion.save()
    res.end(JSON.stringify(newConclusion))
})

router.post('/importantconclusion', async (req, res) => {
    const { id } = req.body;

    await Conclusion.findOneAndUpdate({_id: id}, {important: true})
})

router.delete('/deleteconclusion', async (req, res) => {
    const { id } = req.body;

    await Conclusion.deleteOne({_id: id})
})

module.exports = router;