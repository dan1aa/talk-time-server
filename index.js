const express = require('express')
let app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 3000
const MONGODB_URL = process.env.MONGODB_URL

const messageRoute = require('./routes/messages')

app.use(cors({origin: '*'}))


app.use(express.urlencoded({ extended: true }));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())

app.use(messageRoute)

async function start() {
    try {
        await mongoose.connect(MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        app.listen(PORT, () => {
            console.log(`server is running on ${PORT}`);
        });
    } catch (e) {
        throw new Error(e)
    }
}

start();