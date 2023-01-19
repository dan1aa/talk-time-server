window.onload = function() {
    let _peaksToDelete = document.querySelectorAll('.peaks__wrapper div:nth-child(-n + 3)')
    let _peaks = document.querySelectorAll('.peaks')
    let _peaksWrappers = document.querySelectorAll('.peaks__wrapper')

    _peaks.forEach(_peak => {
        if(_peak.style.height == '0px') {
            _peak.style.display = 'none'
        }
    })

    _peaksToDelete.forEach(_peakToDelete => {
        _peakToDelete.style.display = 'none'
    })

    _peaksWrappers.forEach(_peaksWrapper => {
        Array.from(_peaksWrapper.children).forEach(_children => {
            if(_children.tagName == 'DIV' && _children.style.display == 'none') {
                _peaksWrapper.removeChild(_children)
            }
        })
        if(!_peaksWrapper.children.length) {
            let _noDataSpan = document.createElement('span')
            _noDataSpan.innerHTML = 'No data'
            _noDataSpan.className = 'user__activity__nodata'
            _peaksWrapper.appendChild(_noDataSpan)
        }
    })
}