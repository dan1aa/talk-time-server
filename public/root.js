const URL = window.location.href.split('/').filter(item => item).at(-2);
const menuItems = document.querySelectorAll('.menu div a');
const menu = document.querySelector('.menu')
const hideShow = document.querySelector('.hide-show-menu')

if (menu) {
    hideShow.onclick = function () {
        if (hideShow.getAttribute('is-opened') === 'true') {
            menuHelper('none', 70, 0, 70)
            hideShow.setAttribute('is-opened', 'false')
        }
        else {
            menuHelper('flex', 300, 300, 300)
            hideShow.setAttribute('is-opened', 'true')
        }
    }
    menuItems.forEach(item => {
        if (item.textContent.toLowerCase().includes(URL)) {
            item.style.color = 'white'
            item.style.borderBottom = '4px solid white'
        }
    })

    function menuHelper(display, menuWidth, timeout, containerWidth) {
        const children = menu.querySelectorAll('*:not(.hide-show-menu > *):not(.hide-show-menu):not(.menu-wrapper)');
        console.log(children)
        const containers = document.querySelectorAll('.about-container, .dashboard-container, .list-container, .feedbacks, .badge-container, .badge-display-container')
        containers.forEach(container => {
            if(container) {
                container.style.width = `calc(100vw - ${containerWidth}px)`
            }
        })
        setTimeout(() => {
            children.forEach(child => {
                child.style.display = display
            })
        }, timeout)
        menu.style.width = `${menuWidth}px`
    }
}