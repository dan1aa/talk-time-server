window.onload = function () {
    const URL = window.location.href.split('/').at(-1);
    let _feedbacksSearchInput = document.querySelector('.feedbacks__search')
    let _feedbacksUsers = document.querySelectorAll('.feedbacks__user')
    let _leaveFeedbackButtons = document.querySelectorAll('.feedbacks__leave__feedback')
    let _seeFeedbacksButtons = document.querySelectorAll('.feedbacks__see__feedbacks')
    let _seeBadgesButtons = document.querySelectorAll('.feedbacks__see__badges')
    let _refreshButton = document.querySelector('.feedbacks__refresh')

    _refreshButton.onclick = function() {
        window.location.reload()
    }

    _leaveFeedbackButtons.forEach(_leaveFeedbackButton => {
        _leaveFeedbackButton.onclick = function() {
            window.location = `/newfeedback/${URL}/${this.parentElement.parentElement.querySelector('.feedbacks__user__name').textContent}` 
        }
    })

    _seeFeedbacksButtons.forEach(_seeFeedbacksButton => {
        _seeFeedbacksButton.onclick = function() {
            window.location = `/feedbacks/${URL}/${this.parentElement.parentElement.querySelector('.feedbacks__user__name').textContent}`               
        }
    })

    _seeBadgesButtons.forEach(_seeBadgesButton => {
        _seeBadgesButton.onclick = function() {
            window.location = `/badges/${URL}/${this.parentElement.parentElement.querySelector('.feedbacks__user__name').textContent}`
        }
    })  

    _feedbacksSearchInput.oninput = function() {
        let _value = this.value.toLowerCase()
        _feedbacksUsers.forEach(_feedbackUser => {
            if(!_feedbackUser.textContent.toLowerCase().includes(_value) && _value) {
                _feedbackUser.style.display = 'none'
            }
            else {
                _feedbackUser.style.display = 'flex'
            }
        })
    }
}