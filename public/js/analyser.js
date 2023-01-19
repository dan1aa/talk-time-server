window.onload = async function () {
    let video = document.querySelector('video')
    let chat = document.querySelector('.chat')
    let bookmarkButton = document.querySelector('.open-bookmark-popup');
    let bookmarkPopUp = document.querySelector('.bookmark-popup');
    let createBookmark = document.querySelector('.create-bookmark')
    let time = document.querySelector('input[name="time"]');
    let closeCreateBookmark = document.querySelector('.close-create-bookmark-popup');
    let closeBookmarks = document.querySelector('.close-bookmarks-popup');
    let timeLabel = document.querySelector('.time-label')
    let showBookmarksButton = document.querySelector('.show-bookmarks');
    let bookmarksWrapper = document.querySelector('.all-bookmarks')
    let allBookmarks = document.querySelectorAll('.bookmark')
    let loadChatButton = document.querySelector('.load-chat')
    let chatWarningMessage = document.querySelector('.chat-warning')
    let chatLink = document.querySelector('.chat-link')
    let loadingText = document.querySelector('.loading-text')
    let audioLink = document.querySelector('.audio-link')
    let play = document.querySelector('.play')
    let pause = document.querySelector('.pause')
    let positions = document.querySelectorAll('.positions > span')

    let wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'violet',
        progressColor: 'purple',
        backend: 'MediaElement'
    });

    wavesurfer.load(`/${audioLink.textContent}`);

    wavesurfer.setMute(true)

    let wave = document.querySelector('wave')
    wave.style.display = 'none'

    play.onclick = function () {
        wavesurfer.play()
        video.play()
    }

    pause.onclick = function () {
        wavesurfer.pause()
        video.pause()
    }

    wavesurfer.on('waveform-ready', function (e) {
        wave.style.display = 'block'
        play.disabled = false;
        pause.disabled = false;
        document.querySelector('.loader-wrapper').style.display = 'none'
        let duration = video.duration;
        let piece = Math.round(duration / 4);
        let pos = [
            '00:00:00', 
            new Date(Math.round(piece) * 1000).toISOString().substr(11, 8),
            new Date(Math.round(piece * 2) * 1000).toISOString().substr(11, 8), 
            new Date(Math.round(piece * 3) * 1000).toISOString().substr(11, 8),
            new Date(Math.round(duration) * 1000).toISOString().substr(11, 8)
        ]

        positions.forEach((span, index) => {
            span.innerHTML = pos[index]
        })
})

wavesurfer.on('interaction', function () {
    video.currentTime = wavesurfer.getCurrentTime()
})


let i = 0;
let txt = 'Loading video graph...It`ll take a few seconds';
let speed = 80;

function typeWriter() {
    if (i < txt.length) {
        loadingText.innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
    else if (i >= txt.length) {
        setTimeout(() => {
            loadingText.innerHTML = '';
            i = 0;
            typeWriter()
        }, 300)
    }
}

typeWriter()

function validateTime(time) {
    var regex = new RegExp("([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])");

    return regex.test(time) ? true : false
}


if (showBookmarksButton) {
    showBookmarksButton.onclick = function () {
        bookmarksWrapper.style.display = 'flex'
    }
}

loadChatButton.onclick = async function () {
    this.style.display = 'none'
    chatWarningMessage.style.display = 'none'
    chat.style.display = 'block'
    let response = await fetch(`/${chatLink.textContent}`)
    let data = await response.blob()

    let file = new File([data], "test.txt", {})
    let reader = new FileReader()
    reader.readAsText(file, 'utf-8')
    reader.onload = function () {
        const res = reader.result.split(/\n\s*\n/)
        let messagesAndTime = [];
        res.forEach(oneMessage => {
            let [time, ...message] = oneMessage.split(/\r?\n/)
            messagesAndTime.push([
                time,
                message.join('')
            ])
        })
        for (let i = 0; i < messagesAndTime.length; i++) {
            let time = messagesAndTime[i][0].slice(0, 8)
            let message = messagesAndTime[i][1]
            let chatItem = `
                    <div class="chat-item">
                        <span class="time">${time}</span><br/>
                        <span style="font-weight: bold; margin-top: -20px;">${message}</span>
                    </div>
                `;
            chat.innerHTML += chatItem
        }
    }
    let allChatItems;
    setTimeout(() => {
        allChatItems = document.querySelectorAll('.chat-item');
        allChatItems.forEach(chatItem => {
            let time = chatItem.querySelector('.time')
            let splitted = time.textContent.split(':');
            let seconds = +splitted[0] * 60 * 60 + +splitted[1] * 60 + +splitted[2];
            chatItem.setAttribute('seconds', seconds)
            chatItem.onclick = function () {
                let goTime = this.getAttribute('seconds');
                video.currentTime = goTime;
                wavesurfer.setCurrentTime(goTime)
            }
        })
    }, 1500)
    video.ontimeupdate = function () {
        let currTime = Math.round(this.currentTime)
        allChatItems = document.querySelectorAll('.chat-item');
        allChatItems.forEach(chatItem => {
            let seconds = chatItem.getAttribute('seconds');
            if (seconds === "NaN") {
                chatItem.remove()
            }
            if (seconds > currTime) {
                chatItem.style.display = 'none'
            }
            else if (seconds === currTime || seconds < currTime) {
                chatItem.style.display = 'flex'
            }
        })
    }
}

allBookmarks.forEach(bookmark => {
    bookmark.onclick = function () {
        let splitted = this.querySelector('h4').textContent.split(':')
        let seconds = +splitted[0] * 60 * 60 + +splitted[1] * 60 + +splitted[2];
        if (seconds <= video.duration) {
            video.currentTime = seconds
        }
    }
})


closeCreateBookmark.onclick = function () {
    bookmarkPopUp.style.display = 'none'
}

closeBookmarks.onclick = function () {
    bookmarksWrapper.style.display = 'none'
}

bookmarkButton.onclick = function () {
    bookmarkPopUp.style.display = 'flex'
}

createBookmark.onclick = function () {
    let timeValue = time.value;

    if (!validateTime(timeValue)) {
        time.setAttribute('class', 'time-shaking')
        timeLabel.setAttribute('class', 'time-shaking')
    }
}
setTimeout(() => {
    document.querySelector('.down').onclick = function () {
        chat.scroll({
            top: chat.scrollHeight,
            left: 0,
            behavior: 'smooth'
        })
    }
}, 2000);
    // }
}