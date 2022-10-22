window.onload = function() {
    const allClose = document.querySelectorAll('.close-img');
    const allViewImage = document.querySelectorAll('.view-image');
    const leaveComment = document.querySelector('.leave-comment');
    const cancelComment = document.querySelector('.cancel-comment');
    const commentWrapper = document.querySelector('.leave-comment-wrapper');

    cancelComment.onclick = function(e) {
        e.preventDefault()
        commentWrapper.style.display = 'none'
        leaveComment.style.display = 'block'
    }

    leaveComment.onclick = function() {
        this.style.display = 'none';
        commentWrapper.style.display = 'flex'
    }

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