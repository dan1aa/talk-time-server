window.onload = function() {
    const _closeImageButtons = document.querySelectorAll('.personal__feedback__close__img');
    const _viewImageButtons = document.querySelectorAll('.personal__feedback__view__image__button');

    _viewImageButtons.forEach(_viewImageButton => {
        _viewImageButton.onclick = function() {
            let _currentImage = this.parentElement.parentElement.parentElement.nextElementSibling
            _currentImage.style.visibility = 'visible'
            _currentImage.style.opacity = '1'
        }
    })
    _closeImageButtons.forEach(_closeImageButton => {
        _closeImageButton.onclick = function() {
            this.parentElement.style.visibility = 'hidden';
            this.parentElement.style.opacity = '0';
        }
    })
}