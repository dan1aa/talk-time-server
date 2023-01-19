window.onload = function () {
    const URL = window.location.href.split('/').at(-1);
    let _conclusionInputWrapper = document.querySelector('.conclusion__input__wrapper')
    let _addConclusionButton = document.querySelector('.add__conclusion')
    let _addConclusionInput = document.querySelector('.conclusion__input')
    let _conclusions = document.querySelector('.conclusions')
    let _emptyConclusionsWarning = document.querySelector('.empty__conclusions__warning')
    let _meetingParticipants = document.querySelectorAll('.meeting__participant')
    let _statisticsRatios = document.querySelectorAll('.statistics__ratio')
    let _tagsList = document.querySelector('.tags__list')
    let _tagsSelectArrow = document.querySelector('.tags__select__arrow')
    let _tagsSelectClose = document.querySelector('.tags__select__close')
    let _tagElements = document.querySelectorAll('.tag__element')
    let _allChecked = document.querySelectorAll('.is__checked')

    let _tags = []

    _tagElements.forEach(_tagElement => {
        _tagElement.onclick = function () {
            _isChecked = this.querySelector('.is__checked')
            if (_isChecked.textContent == '✓') {
                _isChecked.innerHTML = ''
                _tags = _tags.filter(_tag => {
                    return _tag.tag !== this.textContent.slice(0, -1).trim()
                })
            }
            else {
                _tags.push({tag: this.querySelector('.tag__name').textContent})
                _isChecked.innerHTML = '✓'
            }

        }
    })

    _tagsSelectArrow.onclick = function () {
        _tagsList.style.visibility = 'visible'
        _tagsList.style.opacity = '1'
        this.style.display = 'none'
        _tagsSelectClose.style.display = 'inline'
    }

    _tagsSelectClose.onclick = function () {
        _tagsList.style.visibility = 'hidden'
        _tagsList.style.opacity = '0'
        this.style.display = 'none'
        _tagsSelectArrow.style.display = 'inline'
    }

    _meetingParticipants.forEach(_meetingParticipant => {
        _meetingParticipant.onclick = function () {
            window.location = `/feedbacks/${URL}/${this.querySelector('.participant__name').textContent}`
        }
    })

    _addConclusionButton.onclick = function () {
        console.log(_tags)
        _tagsList.style.visibility = 'hidden'
        _tagsList.style.opacity = '0'
        _tagsSelectClose.style.display = 'none'
        _tagsSelectArrow.style.display = 'inline'
        let value = _addConclusionInput.value;
        if (!value.trim()) {
            _conclusionInputWrapper.classList.toggle('wrong__conclusion')
            return;
        }
        let _conclusionHTML = `
        ${Object.values(_tags).map(_tag => {
            return `<span class="conclusion__tag">${_tag.tag}</span>`
        }).join('')}
        <span class="conclusion">${'- ' + value}</span>
        <span class="conclusion__star">☆</span>
        <span class="conclusion__id"></span>
        <img src="/img/trash.png" class="conclusion__delete" />
    `
        let _conclusionWrapper = document.createElement('div')
        _conclusionWrapper.className = 'conclusion__wrapper'
        _conclusionWrapper.innerHTML = _conclusionHTML
        _conclusions.prepend(_conclusionWrapper)
        fetch(`/newconclusion/${URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: _addConclusionInput.value,
                url: URL,
                tags: _tags
            })
        })
            .then(response => response.json())
            .then(res => {
                _conclusionWrapper.querySelector('.conclusion__id').innerHTML = res._id
            })
        _tags = []
        _allChecked.forEach(_checked => {
            _checked.innerHTML = ''
        })
        _addConclusionInput.value = ''
        _emptyConclusionsWarning.style.display = 'none'
    }

    _conclusions.onclick = function (e) {
        let _target = e.target
        if (_target.className == 'conclusion__delete') {
            fetch('/deleteconclusion', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: _target.previousElementSibling.textContent
                })
            })
            _conclusions.removeChild(_target.parentElement)
            if (_conclusions.children[0].tagName == 'SPAN') {
                _conclusions.children[0].style.display = 'inline'
            }
        }
        if (_target.className == 'conclusion__star') {
            _target.innerHTML = '★'
            fetch(`/importantconclusion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: _target.nextElementSibling.textContent
                })
            })
        }

    }

    _statisticsRatios.forEach(_statisticRatio => {
        let _percentValue = +_statisticRatio.parentElement.querySelector('.statistics__percents').textContent.slice(0, -1)
        let _readyPercentValue = _percentValue < 10 ? _percentValue / 10 : _percentValue / 100
        _statisticRatio.style.setProperty('--before__prop', `conic-gradient(#662afd 0 calc(${_readyPercentValue} * 360deg), #ede1ff calc(${_readyPercentValue} * 360deg) 360deg)`)
    })

}