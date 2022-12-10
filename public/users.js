window.onload = function() {
    const input = document.querySelector('.search')
    const allUsers = document.querySelectorAll('.users')
    input.oninput = function () {
        let value = this.value.toLowerCase();
        let isEmpty = value.trim() === ''
        allUsers.forEach(user => {
            if (value) {
                let name = user.querySelector('.username').textContent
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
}