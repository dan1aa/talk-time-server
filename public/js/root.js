let _menuItems = document.querySelectorAll('.header__menu__item')
const CURRENT_PAGE = window.location.href.split('/');

if (_menuItems) {
    _menuItems.forEach(_menuItem => {
        if (CURRENT_PAGE.join('').includes(_menuItem.textContent.slice(0, -1).toLowerCase().replace(' ', ''))) {
            _menuItem.classList.toggle('active__menu')
        }
    })
}