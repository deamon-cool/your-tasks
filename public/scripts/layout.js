let showNavButton = document.getElementById('show-nav-button');
let nav = document.querySelector('nav');

showNavButton.addEventListener('click', (e) => {
    e.preventDefault();
    nav.classList.add('show-nav');
});

nav.addEventListener('mouseleave', () => {
    if (nav.className === 'show-nav') {
        nav.classList.remove('show-nav');
    }
});
