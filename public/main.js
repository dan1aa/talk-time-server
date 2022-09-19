// let id = window.location.pathname.substring(1)

// navigator.mediaDevices.getUserMedia({ audio: true })
//     .then(stream => {
//         const mediaRecorder = new MediaRecorder(stream);
//         mediaRecorder.start()
//         const audioChunks = [];
//         mediaRecorder.addEventListener("dataavailable", event => {
//             audioChunks.push(event.data);
//         });

//         setInterval(() => {
//             mediaRecorder.stop()
//         }, 3000)

//         mediaRecorder.addEventListener("stop", () => {
//             const audioBlob = new Blob(audioChunks, {
//                 type: 'audio/mpeg-3'
//             });
//             console.log(audioBlob)
//             let formData = new FormData()
//             formData.append('file', audioBlob)
//             fetch(`http://localhost:3000/${id}`, {
//                 method: 'POST',
//                 body: formData
//             })
//             audioChunks.length = 0
//             mediaRecorder.start()

//         });
    

//     });

window.onload = function() {
    const refreshButton = document.querySelector('.refresh');
    const questionButton = document.querySelector('.question');
    const modal = document.querySelector('.question-modal');
    const container = document.querySelector('.container')
    const closeModal = document.querySelector('.close-modal');
    const openBadgesModal = document.querySelectorAll('.see-badges');
    const closeBadges = document.querySelectorAll('.close-badge');
    let URL = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
    const leaveFeedbackButtons = document.querySelectorAll('.leave-feedback')

    openBadgesModal.forEach(button => {
        button.onclick = function() {
            const modal = this.nextElementSibling;
            modal.style.display = 'flex'
        }
    })

    closeBadges.forEach(button => {
        button.onclick = function() {
            const modal = this.parentElement.parentElement;
            modal.style.display = 'none'
        }
    })

    leaveFeedbackButtons.forEach(button => {
        dynamic(button, 'newfeedback')
    })
    const seeFeedbackButtons = document.querySelectorAll('.see-feedback')
    seeFeedbackButtons.forEach(button => {
        dynamic(button, 'feedbacks')
    })

    refreshButton.onclick = function() {
        location.reload()
    }

    questionButton.onclick = function() {
        modal.style.display = 'flex'
        container.style.filter = 'blur(3px)'

    }

    closeModal.onclick = function() {
        modal.style.display = 'none'
        container.style.filter = 'blur(0)'
    }

    function dynamic(elem, path) {
        let name = elem.parentElement.parentElement.querySelector('.user-info').querySelector('span').textContent;
        elem.onclick = function() {
            window.location.href = `/${path}/${URL}/${name}`
        }
    }
 }