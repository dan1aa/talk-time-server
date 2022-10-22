window.onload = function () {

    const percentsElement = document.querySelectorAll('.user-percents')
    const usernamesElement = document.querySelectorAll('.username-graph')
    let usernames = []
    let percents = []

    percentsElement.forEach(percent => {
        percents.push(+percent.textContent.slice(0, -1))
    })

    usernamesElement.forEach(username => {
        usernames.push(username.textContent)
    })

    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: usernames,
            datasets: [{
                label: 'Percents of talking',
                data: percents,
                backgroundColor: [
                    'rgb(8, 149, 210)'
                ],
                borderColor: [
                    'rgb(8, 149, 210)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const url = window.location.href.split('/').at(-1);
    const addConclusionInput = document.querySelector('.conclusion-input')
    const addConclusionButton = document.querySelector('.add-conclusion')
    const conclusionsWrapper = document.querySelector('.conclusions')
    const users = document.querySelectorAll('.participant')

    users.forEach(user => {
        user.onclick = function() {
            let link = `https://talk-time-server.herokuapp.com/feedbacks/${url}/${this.querySelector('div > .username-graph').textContent}`;
            window.location.href = link
        }
    })

    addConclusionButton.onclick = function () {
        document.querySelector('.no-conclusion').style.display = 'none'
        if (!addConclusionInput.value.trim()) return;
        let conclusion = document.createElement('div')
        conclusion.className = 'conclusion'
        let li = document.createElement('li')
        li.innerHTML = addConclusionInput.value;
        conclusion.appendChild(li)
        conclusionsWrapper.appendChild(conclusion)
        fetch(`https://talk-time-server.herokuapp.com/newconclusion/${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: addConclusionInput.value,
                url
            })
        })
        addConclusionInput.value = ''
    }
}