window.onload = function() {
    const allClose = document.querySelectorAll('.close-img');
    const allViewImage = document.querySelectorAll('.view-image');

    allViewImage.forEach(image => {
        image.onclick = function() {
            const modal = this.parentElement.querySelector('.feedback-img-wrapper')
            modal.style.display = 'flex'
        }
    })

    allClose.forEach(close => {
        close.onclick = function() {
            const modal = this.parentElement;
            modal.style.display = 'none';
        }
    })
}