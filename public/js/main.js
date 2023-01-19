window.onload = function() {
    new WOW().init()

    let _mainExplore = document.querySelector('.main__explore')
    let _select = document.querySelector('.select')
    let _selectInput = document.querySelector('.select__input')
    let _selectItems = document.querySelector('.select__items')
    let _closeSelectInput = document.querySelector('.close__input')
    let _meetingSearch = document.querySelector('.meeting__search')
    let _allSelectItems = document.querySelectorAll('.select__item')
    let _exploreQuestion = document.querySelector('.explore__question')
    let _questionWrapper = document.querySelector('.question__wrapper')
    let _closeQuestion = document.querySelector('.close__question')

    _mainExplore.onclick = function() {
        window.scrollBy(0, window.innerHeight)
    }

    _select.onclick = function() {
        _select.style.display = 'none'
        _selectInput.style.display = 'block'
        _selectItems.style.visibility = 'visible'
        _selectItems.style.opacity = '1'
    }
    
    _closeSelectInput.onclick = function() {
        _selectInput.style.display = 'none'
        _select.style.display = 'flex'
        _selectItems.style.visibility = 'hidden'
        _selectItems.style.opacity = '0'
        _meetingSearch.value = ''
        _allSelectItems.forEach(_selectItem => {
            _selectItem.style.display = 'flex'
        })
    }

    _exploreQuestion.onclick = function() {
        _questionWrapper.style.display = 'block'
    }
    _closeQuestion.onclick = function() {
        _questionWrapper.style.display = 'none'
    }

    _meetingSearch.oninput = function() {
        let value = this.value.toLowerCase()
        _allSelectItems.forEach(_selectItem => {
            if(!_selectItem.textContent.toLowerCase().includes(value) && value) {
                _selectItem.style.display = 'none'
            }
            else {
                _selectItem.style.display = 'flex'
            }
        })
    }

    _allSelectItems.forEach(_selectItem => {
        _selectItem.onclick = function() {
            window.location = `/searchlist/${this.textContent}`
        }
    })
}