const router = require('express').Router()
// const path = require('path')
// const fs = require('fs')
// const { exec } = require('child_process')

// const uniqueName = function (length) {
//     var result = '';
//     var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     var charactersLength = characters.length;
//     for (var i = 0; i < length; i++) {
//         result += characters.charAt(Math.floor(Math.random() *
//             charactersLength));
//     }
//     return result;
// }

// router.get('/:id', (req, res) => {
//     res.render('microphone', {
//         cssFileName: 'style',
//     })
// })

// router.post('/:id', (req, res) => {
//     // let busboy = Busboy({ headers: req?.headers });
//     // busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
//     //     var saveTo = path.join('.', `${uniqueName(6)}.mp3`);
//     //     console.log('Uploading: ' + saveTo);
//     //     file.pipe(fs.createWriteStream(saveTo));
//     // });
//     // busboy.on('finish', function () {
//     //     res.writeHead(200, { 'Connection': 'close' });
//     //     res.end("That's all folks!");
//     // });

//     // return req.pipe(busboy);
// })

router.get('/extension/about', (req, res) => {
    const LINK = process.env.LINK
    res.render('about', {
        cssFileName: 'about',
        link: LINK
    })
})

module.exports = router