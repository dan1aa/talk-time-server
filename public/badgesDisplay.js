window.onload = function() {
    const allProgress = document.querySelectorAll('.badge-level div');
    allProgress.forEach(progress => {
        if(progress.style.width === '100%') {
            progress.style.background = '#FFD700'
        }
    })
}