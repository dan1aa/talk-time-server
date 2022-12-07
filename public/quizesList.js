window.onload = function () {
    const URL = window.location.href.split('/').filter(item => item).at(-1);
    console.log(URL)
    const links = document.querySelectorAll('.quiz-link')
    const hrefs = document.querySelectorAll('.quiz-title')
    for (let i = 0; i < links.length; i++) {
        links[i].setAttribute('href', `/quiz/${URL}/${hrefs[i].textContent}`)
    }
}