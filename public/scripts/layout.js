let showNavButton = document.getElementById('show-nav-button');
let navMenu = document.getElementById('nav-layout');

showNavButton.addEventListener('click', (e) => {
    e.preventDefault();
    navMenu.classList.add('show-nav');
});

navMenu.addEventListener('mouseleave', () => {
    if (navMenu.className === 'show-nav') {
        navMenu.classList.remove('show-nav');
    }
});

// !!! TODO !!! Add handlers for all buttons