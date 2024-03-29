const router = require('express').Router()
const General = require('../models/General')
const User = require('../models/User')


router.get('/extension/:url', (req, res) => {
    const { url } = req.params;
    res.render('about', {
        cssFileName: 'about',
        url
    })
})

router.get('/badges/:url', (req, res) => {
    const { url } = req.params;
    res.render('badges', {
        cssFileName: 'badges',
        isBadges: true,
        url
    })
})

router.get('/main', async (req, res) => {
    const generals = await General.find({})
    res.render('main', {
        cssFileName: 'main',
        title: 'Main',
        generals
    })
})

router.post('/addgeneral', async (req, res) => {
    const { name, meetUrl } = req.body;
    const general = await General.findOne({ name })
    if (!general) {
        const newGeneral = new General({
            name,
            meetings: [meetUrl],
        })
        await newGeneral.save()
    }
    else {
        await General.updateOne({ name }, { $addToSet: { meetings: meetUrl } })
    }
})

router.get('/searchlist/:name', async (req, res) => {
    const { name } = req.params;
    const generals = await General.find({ name })
    res.render('searchlist', {
        title: name,
        meetings: generals || [],
        cssFileName: 'searchlist'
    })
})

router.get('/quizes/:url', (req, res) => {
    const { url } = req.params;
    res.render('quizes', {
        cssFileName: 'quizes',
        url,
        title: 'Quizes List',
    })
})

router.get('/quiz/:url/:name', async (req, res) => {
    const { name, url } = req.params;
    const users = await User.find({ url })
    res.render('quizPage', {
        title: `${name} quiz`,
        cssFileName: 'quizes',
        url,
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
    })

})

router.get('/users/:url', async (req, res) => {
    const { url } = req.params;
    const users = await User.find({})
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