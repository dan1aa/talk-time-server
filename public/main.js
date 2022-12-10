window.onload = function () {
    const questionImg = document.querySelector('.img-question')
    const question = document.querySelector('.select-question') 
    const closeSpan = document.querySelector('.close-image-span')
    const select = document.querySelector('.select')
    const itemsWrapper = document.querySelector('.items-wrapper')
    const inputWrapper = document.querySelector('.input-wrapper')
    const searchInput = document.querySelector('.input-wrapper input')
    const closeMeetingsSelect = document.querySelector('.close-meetings-select')
    const allMenuItems = document.querySelectorAll('.item')
    
    itemsWrapper.style.width = `${select.offsetWidth}px`

    allMenuItems.forEach(item => {
        item.onclick = function() {
            window.location = `http://localhost:3000/searchlist/${this.textContent}`
        }
    })

    select.onclick = function() {
         domHelper('130px', 'flex', 'none', select)
    }
    closeMeetingsSelect.onclick = function() {
        domHelper('0', 'none', 'flex', select)
    }
    question.onclick = function() {
        questionImg.style.display = 'inline'
        closeSpan.style.display = 'inline'
    }
    questionImg.onclick = function() {
        this.style.display = 'none'
        closeSpan.style.display = 'none'
    }
    searchInput.oninput = function () {
        let value = this.value.toLowerCase();
        let isEmpty = value.trim() === ''
        allMenuItems.forEach(item => {
            if (value) {
                let text = item.textContent
                if (!text.toLowerCase().includes(value)) {
                    item.style.display = 'none'
                }
                else {
                    item.style.display = 'flex'
                }
            }
            else if (isEmpty) {
                item.style.display = 'flex'
            }
        })
    }
    function domHelper(first, second, third, elem) {
        itemsWrapper.style.height = first
        inputWrapper.style.display = second
        elem.style.display = third
    }
}