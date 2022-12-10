const router = require('express').Router();
const Bookmark = require('../models/Bookmark')
const gmail = require('../gmail/gmailAPI')
const { google } = require('googleapis')
const fs = require('fs')
const { spawn } = require('child_process')

const LINK = process.env.LINK;
const GMAIL_DATA_LOAD_TIME = 1300;
const { DRIVE_CLIENT_ID, DRIVE_CLIENT_SECRET, DRIVE_REDIRECT_URI, DRIVE_REFRESH_TOKEN } = process.env;

const oauth2Client = new google.auth.OAuth2(
    DRIVE_CLIENT_ID, DRIVE_CLIENT_SECRET, DRIVE_REDIRECT_URI
)

oauth2Client.setCredentials({
    refresh_token: DRIVE_REFRESH_TOKEN
})

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})

router.get('/analyser/:title/:url', async (req, res) => {
    const { url } = req.params;
    const bookmarks = await Bookmark.find({ url });

    try {
        (async function () {
            let links = [];
            let titles = [];
            var uniqueLinks = [];
            let decodedMessage = '';
            let title = req.params.title.split('_').map(element => element.charAt(0).toUpperCase() + element.slice(1).toLowerCase()).join(' ');
            let titleIndex;
            const allIds = await gmail.searchGmail('from:operations@nobelhub.com');
            allIds.forEach(async item => {
                let threadId = item?.threadId;
                const message = await gmail.readGmailContent(threadId);
                // console.log(message.payload.headers.name)
                const encodedMessage = await message.payload["parts"][0].body.data;
                decodedMessage = Buffer.from(encodedMessage, "base64").toString('ascii')
                decodedMessage.split(' ').forEach((char) => {
                    if (char.includes("https://")) {
                        let link = char.split(/\r?\n/)[1].slice(1, -1);
                        if (link.startsWith('https')) {
                            links.push(link)
                        }
                        uniqueLinks = [...new Set(links)]
                    }
                });
                decodedMessage.split(/\r?\n/).forEach(str => {
                    if (str.startsWith('Subject: ')) {
                        titles.push(str)
                    }
                })
            })
            let chunk = 2;
            let modified = [];
            let linksObject = {};
            setTimeout(() => {
                for (let i = 0; i < uniqueLinks.length; i += chunk) {
                    const item = uniqueLinks.slice(i, i + chunk);
                    modified.push(item);
                }

                for (let i = 0; i < modified.length; i++) {
                    linksObject[i] = modified[i];
                }

                for (let i = 0; i < titles.length; i++) {
                    if (titles[i].includes(title)) {
                        titleIndex = titles.indexOf(titles[i])
                    }
                }

                let readyObject;

                if (titles[titleIndex]) {
                    readyObject = {
                        title: titles[titleIndex].slice(9),
                        chatLink: linksObject[titleIndex][0],
                        videoLink: linksObject[titleIndex][1],
                    }



                    const VIDEO_ID = readyObject.videoLink.split('/')[5]
                    const EDITED = `${VIDEO_ID}-editedByAnalyseApp`
                    const CHAT_ID = readyObject.chatLink.split('/')[5]

                    if (fs.existsSync(`video_chats/${VIDEO_ID}-editedByAnalyseApp.mp4`) && fs.existsSync(`video_chats/${CHAT_ID}.txt`) && fs.existsSync(`video_chats/${VIDEO_ID}-editedAudio.mp3`)) {
                        res.render('analyser', {
                            title: readyObject.title,
                            cssFileName: 'analyser',
                            link: LINK,
                            url,
                            bookmarks,
                            videoLink: `${EDITED}.mp4`,
                            chatLink: `${CHAT_ID}.txt`,
                            audioLink: `${VIDEO_ID}-editedAudio.mp3`
                        })
                        return;
                    }

                    const dest = fs.createWriteStream(`video_chats/${VIDEO_ID}.mp4`)
                    try {
                        drive.files.get({
                            fileId: CHAT_ID,
                            alt: 'media'
                        })
                            .then(res => {
                                fs.writeFileSync(`video_chats/${CHAT_ID}.txt`, res.data)
                            })

                        drive.files.get({
                            fileId: VIDEO_ID,
                            alt: 'media'
                        }, {
                            responseType: 'stream'
                        },
                            (err, response) => {
                                response.data.on('end', () => {
                                    videoStream = spawn('ffmpeg', ['-i', `video_chats/${VIDEO_ID}.mp4`, '-vf', 'scale=640x320', '-b:v', '50K', `video_chats/${EDITED}.mp4`])

                                    videoStream.on("close", () => {
                                        fs.unlink(`video_chats/${VIDEO_ID}.mp4`, (err) => {
                                            if (err) throw new Error(err)
                                            getAudioStream = spawn('ffmpeg', ['-i', `video_chats/${EDITED}.mp4`, '-q:a', '0', '-map', 'a', `video_chats/${VIDEO_ID}-audio.mp3`])

                                            getAudioStream.on('close', code => {
                                                resizeAudioStream = spawn('ffmpeg', ['-i', `video_chats/${VIDEO_ID}-audio.mp3`, '-b:v', '2M', '-b:a', '64K', `video_chats/${VIDEO_ID}-editedAudio.mp3`])

                                                resizeAudioStream.on('close', () => {
                                                    fs.unlink(`video_chats/${VIDEO_ID}-audio.mp3`, (err) => {
                                                        if (err) throw new Error(err)
                                                        res.render('analyser', {
                                                            title: readyObject.title,
                                                            videoLink: `${EDITED}.mp4`,
                                                            chatLink: `${CHAT_ID}.txt`,
                                                            audioLink: `${VIDEO_ID}-editedAudio.mp3`,
                                                            cssFileName: 'analyser',
                                                            link: LINK,
                                                            url,
                                                            bookmarks,
                                                        })

                                                    })
                                                })
                                            })

                                            getAudioStream.on('error', (err) => {
                                                console.log(err)
                                            })

                                            getAudioStream.stderr.on('data', data => { })
                                        })
                                        console.log('Ended')
                                    });

                                    videoStream.on('error', err => {
                                        throw new Error(err)
                                    })

                                    videoStream.stderr.on('data', data => {
                                    })
                                })
                                    .on('error', err => {
                                        console.log(err)
                                    })
                                    .pipe(dest)
                            })
                    } catch (e) {
                        throw new Error(e)
                    }
                }
                else {
                    res.render('notfound', {
                        cssFileName: 'feedback',
                        title: 'Not found',
                        message: 'Maybe video or chat files from meeting aren`t in a server, please wait'
                    })
                }
            }, GMAIL_DATA_LOAD_TIME)
        })()
    }
    catch (e) {
        throw new Error(e)
    }


})

router.post('/analyser/newbookmark/:url', async (req, res) => {
    const { url } = req.params;

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