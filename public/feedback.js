window.onload = function () {
    const refreshButton = document.querySelector('.refresh');
    const badgesButtons = document.querySelectorAll('.see-badges');
    const leaveFeedbackButtons = document.querySelectorAll('.leave-feedback')
    const searchInput = document.querySelector('.search');
    const allUsers = document.querySelectorAll('.user-item')

    const URL = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];

    badgesButtons.forEach(badgeButton => {
        badgeButton.onclick = function() {
            let name = this.parentElement.parentElement.querySelector('.user-info > .username-span').textContent;
            window.location.href = `https://talk-time-server.onrender.com/allbadges/${URL}/${name}`
        }
    })

    leaveFeedbackButtons.forEach(button => {
        dynamic(button, 'newfeedback')
    })
    const seeFeedbackButtons = document.querySelectorAll('.see-feedback')
    seeFeedbackButtons.forEach(button => {
        dynamic(button, 'feedbacks')
    })

    refreshButton.onclick = function () {
        location.reload()
    }

    searchInput.oninput = function () {
        let value = this.value.toLowerCase();
        let isEmpty = value.trim() === ''
        allUsers.forEach(user => {
            if (value) {
                let name = user.querySelector('.username-span').textContent
                if (!name.toLowerCase().includes(value)) {
                    user.style.display = 'none'
                }
                else {
                    user.style.display = 'flex'
                }
            }
            else if (isEmpty) {
                user.style.display = 'flex'
            }
        })
    }

    function dynamic(elem, path) {
        let name = elem.parentElement.parentElement.querySelector('.user-info').querySelector('span').textContent;
        elem.onclick = function () {
            window.location.href = `/${path}/${URL}/${name}`
        }
    }
}