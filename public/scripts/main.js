// Downloads data from server
async function downloadData(url) {
    let res = await fetch(url, {
        method: 'get'
    });

    let jsonObj = await res.json();

    return jsonObj;
}

// Invokes Download data first time
downloadData('/main/data/0')
    .then(data => dataHandler(data));


// Handle data
function dataHandler(data) {
    console.log(data);
    let sortedData = getSortedData(data);

}


function getSortedData(data) {
    let sortedData;

    return sortedData;
}


function renderData(sortedData) {

}



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
let listOfDraggedTask;
let draggedTask;

// Setting Window for creating/updating Task
function setTaskWindow(taskTime, taskTitle, taskDescr, title, actionForm) {
    let windowContainer = listsDiv.querySelector('.window-container');
    let windowTitle = windowContainer.querySelector('.window-create-new>p');
    let form = windowContainer.querySelector('.window-create-new form');
    let timeInputs = form.querySelectorAll('input[type=time]');
    let titleInput = form.querySelector('input[name=title]');
    let descrInput = form.querySelector('input[name=description]');

    windowTitle.textContent = title;

    form.setAttribute('action', actionForm);

    timeInputs[0].value = taskTime[0];
    timeInputs[1].value = taskTime[1];
    titleInput.value = taskTitle;
    descrInput.value = taskDescr;

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
    let newTaskButton = list.querySelector('.header button.new');

    newTaskButton.addEventListener('click', () => {
        let url = '/main/store/task/:' + list.id;

        let taskWindow = setTaskWindow(['00:00', '00:00'], '', '', 'New Task:', url);
        showWindow(taskWindow);
    });

    // Dragover functionality container
    let tasksContainer = list.querySelector('.tasks');
    tasksContainer.addEventListener('dragover', (e) => {
        e.preventDefault();

        if (list === listOfDraggedTask) {
            updatePosition(tasksContainer, e.target, draggedTask);
        }
    });

    // Get all tasks from list
    let tasks = tasksContainer.querySelectorAll('.task-container');
    tasks.forEach(task => {
        task.setAttribute('draggable', true);

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
        let taskTime = task.querySelector('.content .hours p').textContent.split(' - ');
        let taskTitle = task.querySelector('.content .title p').textContent;
        let taskDescr = task.querySelector('.content .description p').textContent;

        let updateTaskWindow = setTaskWindow(taskTime, taskTitle, taskDescr, 'Edit Task:', url);
        showWindow(updateTaskWindow);
    });

    task.addEventListener('dragstart', e => {
        draggedTask = e.target;
        listOfDraggedTask = e.path[2];

        draggedTask.style.opacity = '0.01';
    });

    task.addEventListener('dragend', e => {
        draggedTask.style.opacity = '';
    });

}

// Update task in Database
async function updateTaskInDb(url, pos, sta, start, end, tit, descr) {
    let data = {
        position: pos,
        status: sta,
        starttime: start,
        endtime: end,
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

// Update tasks positions
function updatePosition(container, targetItem, draggedItem) {
    let name = targetItem.className;
    let state = name === 'task-container'
        || name === 'content'
        || name === 'row-1'
        || name === 'hours'
        || name === 'title'
        || name === 'description'
        || name === '';
    if (state) {
        try {
            container.insertBefore(draggedItem, targetItem);
        } catch (e) { }
    } else {
        container.appendChild(draggedItem);
    }
}

