let container = document.querySelector('.container');
let initialAddLink = document.querySelector('.initial-add');

initialAddLink.addEventListener('click', () => {
    let name = getNameOfTheFirstList();
    let initialViewDiv = document.querySelector('.initial-view');
    container.removeChild(initialViewDiv);
});

function getNameOfTheFirstList() {
    let name = prompt('Write name of your first Todo list:');
    if (name === '') {
        getNameOfTheFirstList();
    }
}






