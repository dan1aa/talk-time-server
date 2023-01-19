window.onload = function() {
    const _leaveCommentButton = document.querySelector('.leave__comment__button');
    const _cancelComment = document.querySelector('.leave__comment__cancel');
    const _commentWrapper = document.querySelector('.comment__section__wrapper');
    const _comments = document.querySelector('.comments')

    _cancelComment.onclick = function(e) {
        e.preventDefault()
        _commentWrapper.style.display = 'none'
        _leaveCommentButton.style.display = 'block'
        _comments.style.display = 'flex'
    }

    _leaveCommentButton.onclick = function() {
        this.style.display = 'none';
        _commentWrapper.style.display = 'flex'
        _comments.style.display = 'none'
    }
}