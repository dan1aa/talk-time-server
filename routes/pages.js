const router = require('express').Router()
const LINK = process.env.LINK
const General = require('../models/General')
const User = require('../models/User')

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

router.get('/main', async (req, res) => {
    const generals = await General.find({})
    res.render('main', {
        cssFileName: 'main',
        title: 'Main',
        link: LINK,
        generals
    })
})

router.post('/addgeneral', async (req, res) => {
    const { name, meetUrl } = req.body;
    const general = await General.findOne({ name })
    if (!general) {
        const newGeneral = new General({
            name,
            meetings: [meetUrl]
        })
        await newGeneral.save()
    }
    else {
        await General.updateOne({ name }, { $addToSet: { meetings: meetUrl } })
    }
})

router.get('/searchlist/:name', async (req, res) => {
    const { name } = req.params;
    const general = await General.findOne({ name })
    res.render('searchlist', {
        title: name,
        meetings: general.meetings,
        cssFileName: 'searchlist'
    })
})

router.get('/quizes/:url', (req, res) => {
    const { url } = req.params;
    res.render('quizes', {
        cssFileName: 'quizes',
        url,
        title: 'Quizes List',
        link: LINK
    })
})

router.get('/quiz/:url/:name', async (req, res) => {
    const { name, url } = req.params;
    const users = await User.find({ url })
    res.render('quizPage', {
        title: `${name} quiz`,
        cssFileName: 'quizes',
        url,
        link: LINK,
        name,
        users
    })
})

router.get('/quizend/:name/:url', async (req, res) => {
    const { name, url } = req.params;
    const { count, username } = req.query;
    let success = count >= 2;
    let badgeName = name.toLowerCase()
    const currentUser = await User.findOne({ name: username })
    for (let i = 0; i < currentUser?.techs.length; i++) {
        if (currentUser?.techs[i]['badge'].includes(badgeName)) {
            res.render('quizEnd', {
                title: 'Quiz end',
                cssFileName: 'quizes',
                name,
                text: 'Sorry, you already pass this quiz. Try another one!',
                url,
                link: LINK
            })
            return;
        }
    }
    await User.updateMany({ name: username }, { $push: { techs: {badge: `${badgeName}1` } } })
    res.render('quizEnd', {
        title: 'Quiz end',
        cssFileName: 'quizes',
        name,
        text: count >= 2 ? `Condrats, you've passed the ${name} test and you've earned the knowlege badge!` : 'Quiz failed, try one more time',
        url,
        success,
        badgeName,
        link: LINK
    })

})

router.get('/users/:url', async (req, res) => {
    const { url } = req.params;
    const users = await User.find({})
    console.log(users.length)
    const filteredUsers = users.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.name === value.name
        ))
    )
    res.render('users', {
        title: "Users",
        cssFileName: 'users',
        url,
        filteredUsers
    })
})

module.exports = router