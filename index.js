const express = require('express')
const path = require('path')
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const exhbs = require("express-handlebars");
const Handlebars = require("handlebars");
const bodyParser = require('body-parser')
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access");

let app = express()

const PORT = process.env.PORT || 3000
const MONGODB_URL = process.env.MONGODB_URL

const hbs = exhbs.create({
    defaultLayout: "mainLayout",
    extname: "hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    helpers: {
        convert: (str) => str.slice(0, -4)
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")
    }
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));

app.use(express.json())


const messageRoute = require('./routes/messages')
const pagesRoute = require('./routes/pages')
const feedbackRoute = require('./routes/feedback')
const vadRoute = require('./routes/vad')
const analyseRoute = require('./routes/analyser')

app.use(cors({ origin: '*' }))

app.use(messageRoute)
app.use(pagesRoute)
app.use(feedbackRoute)
app.use(vadRoute)
app.use(analyseRoute)

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