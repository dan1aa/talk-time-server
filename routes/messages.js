const router = require('express').Router()
const Message = require('../models/Message')

router.get('/', async (req, res) => {
    const messages = await Message.find({})
    res.json(messages)
    res.end()
})

router.post('/add', async (req, res) => {
    const { text, from, to, url } = req.body;
    const newMessage = new Message({
        text,
        from,
        to,
        url
    })

    await newMessage.save()
    res.end()
})

router.delete('/', async (req, res) => {
    const { name, url } = req.body;
    await Message.deleteMany({ to: name, url })
    .then(() => res.end())
    .catch(err => {throw new Error(err)})
})

module.exports = router;