window.onload = function() {
    const _feedbackBody = document.querySelector('.send__feedback__body')
    const _characterCount = document.querySelector('.send__feedback__characters')
    const _feedbackSender = document.querySelector('.sender__input');
    const _selectedName = document.querySelector('.selected')
    const _anonymousCheckbox = document.querySelector('.anonymous__checkbox')

    _anonymousCheckbox.onclick = function() {
        if(this.checked) {
            _selectedName.innerHTML = 'Selected: Anonymous'
            _feedbackSender.value = 'Anonymous'
        }
        else {
            _selectedName.innerHTML = 'Selected: '
            _feedbackSender.disabled = false
        }
    }


    _selectedName.onchange = function() {
        _selectedName.innerHTML = 'Selected:'
        _selectedName.innerHTML += ` ${this.value}`
    }

    _feedbackBody.onkeyup = function() {
        _characterCount.innerHTML = `Characters left: ${400 - this.value.length}`
    }
}