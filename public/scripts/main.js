//-------------------- Setting left window side

let groupsDiv = document.querySelector('#groups');

// Setting Window for creating new Group/List
function setWindow(actionForm, title, inputHint) {
    let windowContainer = groupsDiv.querySelector('.window-container');
    let form = windowContainer.querySelector('.window-create-new form');
    let label = form.querySelector('label');
    let input = form.querySelector('input[type=text]');

    form.setAttribute('action', actionForm);
    label.textContent = title;
    input.setAttribute('placeholder', inputHint);

    let cancelButton = form.querySelector('.row input[type=button]');

    cancelButton.addEventListener('click', () => {
        windowContainer.style.display = 'none';
    });

    return windowContainer;
}

// Showing set window
function showWindow(window) {
    window.style.display = 'block';
}


// Creating new Group -> Window Functionality
let newGroupButton = groupsDiv.querySelector('.new-group-button');
newGroupButton.addEventListener('click', () => {
    let groupWindow = setWindow('/main/store/group', 'New Group:', 'Group Name');

    showWindow(groupWindow);
});

// Creating new List -> Window Functionality
let groupsLi = groupsDiv.querySelectorAll('.groups-ul>li');
groupsLi.forEach(group => {
    let newListButton = group.querySelector('.new-list-button');

    newListButton.addEventListener('click', () => {
        let listWindow = setWindow('/main/store/list/:' + group.id, 'New List:', 'List Name');
        showWindow(listWindow);
    });
});


//-------------------- Setting right window side









// !!! TODO !!! Draging and droping tasks LOOK: if you have too long list then you need scroll. So when you drag task you must consider auto scrolling too
