const lineContents = document.querySelectorAll('.program-line__content')



lineContents.forEach((elem) => {
    const line = elem.querySelector('.program-line__title')
    const lineDescr = elem.querySelector('.program-line__descr')
    line.addEventListener('click', () => {
        lineDescr.classList.toggle('active')
    })
})