//-------------------- Setting left window side

let groupsDiv = document.querySelector('#groups');

// Setting Window for creating new Group/List
function setWindow(actionForm, title, inputHint) {
    let windowContainer = groupsDiv.querySelector('.window-container');
    let windowCreateNew = windowContainer.querySelector('.window-create-new');
    let form = windowCreateNew.querySelector('form');
    let label = form.querySelector('label');
    let input = form.querySelector('input[type=text]');

    form.setAttribute('action', actionForm);
    label.textContent = title;
    input.setAttribute('placeholder', inputHint);

    let cancelButton = form.querySelector('.row input[type=button]');

    cancelButton.addEventListener('click', () => {
        windowContainer.style.display = 'none';
    });

    windowCreateNew.addEventListener('mouseleave', () => {
        windowContainer.style.display = 'none';
    });

    return windowContainer;
}

// Showing set window
function showWindow(window) {
    window.style.display = 'block';

    let firstInput = window.querySelectorAll('input')[0];
    firstInput.focus();
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

let listsDiv = document.querySelector('#lists');

// Setting Window for creating new Task
function setNewTaskWindow(actionForm) {
    let windowContainer = listsDiv.querySelector('.window-container');
    let windowCreateNew = windowContainer.querySelector('.window-create-new');
    let form = windowCreateNew.querySelector('form');
    let timeInputs = form.querySelectorAll('input[type=time]');

    form.setAttribute('action', actionForm);

    timeInputs.forEach(input => {
        if(input.value === '') {
            input.value = '00:00';
        }
    });

    let cancelButton = form.querySelector('.row input[type=button]');

    cancelButton.addEventListener('click', () => {
        windowContainer.style.display = 'none';
    });

    windowCreateNew.addEventListener('mouseleave', () => {
        windowContainer.style.display = 'none';
    });

    return windowContainer;
}

// Creating new Task -> Window Functionality
let listContainers = listsDiv.querySelectorAll('.list-container');
listContainers.forEach(list => {
    let newTaskButton = list.querySelector('.header button:first-of-type');

    newTaskButton.addEventListener('click', () => {
        let taskWindow = setNewTaskWindow('/main/store/task/:' + list.id);
        showWindow(taskWindow);
    });
});

