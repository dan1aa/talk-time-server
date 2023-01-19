window.onload = function() {
    const _badgesLevels = document.querySelectorAll('.user__badge__show__level');
    _badgesLevels.forEach(_badgeLevel => {
        if(_badgeLevel.style.width === '100%') {
            _badgeLevel.style.background = '#FFD700'
        }
    })
}