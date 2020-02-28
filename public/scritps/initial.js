let creatInitialListLink = document.querySelector('.initial-add');

creatInitialListLink.addEventListener('click', (e) => {
    e.preventDefault();

    let title = getListTitle();
    localStorage.setItem('initialListTitle', title);

    let container = document.querySelector('.container');
    let initialView = document.querySelector('.initial-view');
    container.removeChild(initialView);

    window.location.href = '/lists';
});

function getListTitle() {
    let title = prompt('Write title for your first Todo list:');
    if (title === '' || title === null) {
        getListTitle();
    }
    return title;
}






