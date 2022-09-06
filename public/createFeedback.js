window.onload = function() {
    let fileInput = document.querySelector('.file');
    const textarea = document.querySelector('textarea')
    const characterCount = document.querySelector('.characters-count')
    textarea.onkeyup = function() {
        characterCount.innerHTML = `Characters left: ${400 - this.value.length}`
    }
}