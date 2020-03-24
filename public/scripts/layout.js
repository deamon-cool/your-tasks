let toggle = document.getElementById('toggle');
let nav = document.querySelector('nav');

toggle.addEventListener('click', () => {
    nav.classList.toggle('show-nav');
});

window.addEventListener('click', (e) => {
    if (e.target !== toggle) {
        nav.classList.remove('show-nav');
    }
});
