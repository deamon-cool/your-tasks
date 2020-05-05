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

    windowContainer.addEventListener('click', e => {
        if (e.target === windowContainer) {
            windowContainer.style.display = 'none';
        }
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

// Get all groups
let groupsLi = groupsDiv.querySelectorAll('.groups-ul>li');
groupsLi.forEach(group => {

    // Creating new List -> Window Functionality
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
    let form = windowContainer.querySelector('.window-create-new form');
    let timeInputs = form.querySelectorAll('input[type=time]');

    form.setAttribute('action', actionForm);

    timeInputs.forEach(input => {
        if (input.value === '') {
            input.value = '00:00';
        }
    });

    let cancelButton = form.querySelector('.row input[type=button]');

    cancelButton.addEventListener('click', () => {
        windowContainer.style.display = 'none';
    });

    windowContainer.addEventListener('click', e => {
        if (e.target === windowContainer) {
            windowContainer.style.display = 'none';
        }
    });

    return windowContainer;
}

// Get all lists
let listContainers = listsDiv.querySelectorAll('.list-container');
listContainers.forEach(list => {

    // Creating new Task -> Window Functionality
    let newTaskButton = list.querySelector('.header button:first-of-type');

    newTaskButton.addEventListener('click', () => {
        let taskWindow = setNewTaskWindow('/main/store/task/:' + list.id);
        showWindow(taskWindow);
    });

    // Get all tasks from list
    let taskContainers = list.querySelectorAll('.tasks .task-container');
    taskContainers.forEach(task => {
        setListeners(task);
    });
});

// Set listeners for task
function setListeners(task) {
    let checkbox = task.querySelector('input[type=checkbox]');

    checkbox.addEventListener('click', () => {
        let status = checkbox.checked;
        let url = '/main/update/task/status/:' + task.id;

        updateTaskInDb(url, undefined, status, undefined, undefined, undefined, undefined);
    });

    let edit = task.querySelector('button');

    edit.addEventListener('click', () => {
        let url = '/main/update/task/:' + task.id;

        let updateTaskWindow = setUpdateTaskWindow(task, url);
        showWindow(updateTaskWindow);
    });

}

// Update task in Database
async function updateTaskInDb(url, pos, sta, start, end, tit, descr) {
    let data = {
        position: pos,
        status: sta,
        startTime: start,
        endTime: end,
        title: tit,
        description: descr
    };
    let init = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    await fetch(url, init);
}