const questions = {
    webdevelopment: {
        q1: 'test',
        q2: 'test adsf a',
        q3: 'test'
    }
}
let userAnswers = []
let count = 0;

window.onload = function() {
    const url = window.location.href.split('/').at(-2);
    const quizName = window.location.href.split('/').at(-1).split('-').join('');
    const answers = document.querySelectorAll('.answer')
    const endQuiz = document.querySelector('.end-quiz')
    const retake = document.querySelector('.retake')
    const select = document.querySelector('select')
    let currentQuestions = questions[quizName.toLowerCase()]
    answers.forEach(answer => {
        answer.onclick = function() {
            this.setAttribute('data-selected', true)
            this.style.background = 'rgb(43, 149, 194)'
            this.style.color = 'white'
            let notSelected = this.parentElement.querySelectorAll('[data-selected="false"]')
            notSelected.forEach(elem => {
                elem.disabled = true;
            })
            userAnswers.push(answer.textContent)
        }
    })
    endQuiz.onclick = function() {
        if(select.value !== 'Choose your name') {
            if(userAnswers.length === Object.values(currentQuestions).length) {
                userAnswers.forEach((ans, idx) => {
                    if(ans === Object.values(currentQuestions)[idx]) {
                        count += 1
                    }
                })
                window.location = `https://talk-time-server.onrender.com/quizend/${quizName}/${url}?count=${count}&username=${select.value}` 
            } 
            else alert('Please, fill all fields!')
        }
        else {
            alert('Please, choose your name')
        }
    }
    retake.onclick = function() {
        window.location.reload()
    }
}