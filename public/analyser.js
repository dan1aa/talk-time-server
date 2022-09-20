window.onload = async function () {
    let addVideo = document.querySelector('button')
    let file = document.querySelector('.file')
    let videoLink = document.querySelector('.src')
    let video = document.querySelector('video')
    let chat = document.querySelector('.chat')
    let startMessage = document.querySelector('.start-message')
    let header = document.querySelector('.about-partial');
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

    function validateTime(time) {
        var regex = new RegExp("([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])");
      
        return regex.test(time) ? true : false
      }

    document.querySelector('.question-modal').remove()

    let instructionButton = document.createElement('button');
    instructionButton.innerHTML = 'Watch instruction'
    instructionButton.className = 'instruction-button';
    header.prepend(instructionButton);

    showBookmarksButton.onclick = function() {
        bookmarksWrapper.style.display = 'flex'
    }

    allBookmarks.forEach(bookmark => {
        bookmark.onclick = function() {
            let splitted = this.querySelector('h4').textContent.split(':')
            let seconds = +splitted[0] * 60 * 60 + +splitted[1] * 60 + +splitted[2];
            if(seconds <= video.duration) {
                video.currentTime = seconds
            }
        }
    })

    //https://rr5---sn-c0q7lnse.c.drive.google.com/videoplayback?expire=1663439428&ei=BNolY96YOfLvu7APwL2s0Ag&ip=213.109.232.1&cp=QVRLVUVfWFRQSVhPOmU4NGdvT1kxYnp0VFE3MmhWWHRBcFpST0p1ZGFMeUpzdDlDV1ExeGJNaXI&id=3475fbaaa74a8ce0&itag=18&source=webdrive&requiressl=yes&mh=iR&mm=32&mn=sn-c0q7lnse&ms=su&mv=m&mvi=5&pl=24&sc=yes&ttl=transient&susc=dr&driveid=1xpjGIMDiNCTCa1hDYALUgCOXnzsx89QU&app=explorer&mime=video/mp4&vprv=1&prv=1&dur=8298.602&lmt=1662839109721989&mt=1663424689&subapp=DRIVE_WEB_FILE_VIEWER&txp=0011224&sparams=expire,ei,ip,cp,id,itag,source,requiressl,ttl,susc,driveid,app,mime,vprv,prv,dur,lmt&sig=AOq0QJ8wRQIhAMl_XwN4mHIm1ee6EXx9MKFud644AmtCnshYK7zcdEtfAiAJ834scWTApiVL9vPev6YmMseR7BYvP5p7QhR9zTxqAQ==&lsparams=mh,mm,mn,ms,mv,mvi,pl,sc&lsig=AG3C_xAwRQIhAMzxiqhwXItYTc9IQSqwaStZzPCBpPuf6fJbRTuQDmUhAiBnSe3hdTTr9IfSIQMWiDkGMJYZScMiqmQnFrx4ZV9NnQ==&cpn=FK78nKbzgTYAhWyp&c=WEB_EMBEDDED_PLAYER&cver=1.20220914.01.01

    closeCreateBookmark.onclick = function() {
        bookmarkPopUp.style.display = 'none'
    }

    closeBookmarks.onclick = function() {
        bookmarksWrapper.style.display = 'none'
    }

    bookmarkButton.onclick = function() {
        bookmarkPopUp.style.display = 'flex'
    }

    createBookmark.onclick = function(event) {
        let timeValue = time.value;

        if(!validateTime(timeValue)) {
            time.setAttribute('class', 'time-shaking')
            timeLabel.setAttribute('class', 'time-shaking')
        }
    }

    addVideo.onclick = function () {
        if (!videoLink.value.trim()) {
            videoLink.style.border = '1px solid tomato'
            return;
        }
        video.src = videoLink.value
    }

    file.onchange = function () {
        startMessage.style.display = 'none'
        document.querySelector('.down').style.display = 'flex'
        let reader = new FileReader()
        reader.readAsText(this.files[0], 'utf-8')
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
        setTimeout(() => {
            document.querySelector('.down').onclick = function () {
                chat.scroll({
                    top: chat.scrollHeight,
                    left: 0,
                    behavior: 'smooth'
                })
            }
        }, 2000);
    }
}