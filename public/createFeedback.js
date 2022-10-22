window.onload = function() {
    const textarea = document.querySelector('textarea')
    const characterCount = document.querySelector('.characters-count')
    const nameSelect = document.querySelector('.sender-input');
    const selectedSpan = document.querySelector('.selected')
    let checkbox = document.querySelector('.anonymous')

    checkbox.onclick = function() {
        if(this.checked) {
            selectedSpan.innerHTML = 'Selected: Anonymous'
            nameSelect.value = 'Anonymous'
        }
        else {
            selectedSpan.innerHTML = 'Selected: '
            nameSelect.disabled = false
        }
    }


    nameSelect.onchange = function() {
        selectedSpan.innerHTML = 'Selected:'
        selectedSpan.innerHTML += ` ${this.value}`
    }

    textarea.onkeyup = function() {
        characterCount.innerHTML = `Characters left: ${400 - this.value.length}`
    }
}