// Takes main DOM
let leftSidelayout = document.querySelector('#leftside-layout');
let rightSidelayout = document.querySelector('#rightside-layout');


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

// Handles data
function dataHandler(data) {
    let renderedGroupId = data.renderedId;
    let user = data.user;
    let groups = data.groups;
    let sortedData = getSortedItems(groups);

    renderUser(user);

    renderLeftSide(sortedData, renderedGroupId);
    renderRightSide(sortedData, renderedGroupId);
}

// Renders welcome user
function renderUser(user) {
    let h1 = document.querySelector('#header-layout h1');
    h1.textContent = `Your Tasks : Welcome ${user}`;
}

// Sorts all groups/lists/tasks
function getSortedItems(items) {
    let groups = sort(items);

    for (let i = 0; i < groups.length; i++) {
        let sortedLists = sort(groups[i].lists);

        groups[i].lists = sortedLists;

        for (let j = 0; j < sortedLists.length; j++) {
            sortedTasks = sort(sortedLists[j].tasks);

            groups[i].lists[j].tasks = sortedTasks;
        }
    }

    return groups;
}

// Sorts single objects array
function sort(objectsArray) {
    let sortedObjectsArray = [];

    for (let i = 0; i < objectsArray.length; i++) {

        for (let j = 0; j < objectsArray.length; j++) {

            if (i === objectsArray[j].position) {
                sortedObjectsArray.push(objectsArray[j]);
            }
        }
    }

    return sortedObjectsArray;
}


//---------------------------------------- Left side view

// Renders left side
function renderLeftSide(sortedData, renderedGroupId) {
    leftSidelayout.innerHTML = `
    <div id="groups">
        <ul class="groups-ul">

            ${generateGroupsLi(sortedData)}

        </ul>

        <button class="new-group-button">New...</button>

        <div class="window-container"></div>

    </div>
    `;

    setNewGroupBtnListener(document.querySelector('.new-group-button'));
    setGroupsListeners(document.querySelectorAll('#groups .groups-ul>li'), renderedGroupId);
}

// Returns groups <li> HTML String
function generateGroupsLi(groups) {
    let htmlpart = ``;

    groups.forEach(group => {
        htmlpart += `
        <li id="${group.id}">
            <a>
                <i class="fa fa-angle-right"></i>${group.name}
            </a>
            <ul class="lists-ul">

                ${generateListsLi(group.lists)}

            </ul>

            <button class="new-list-button">New...</button>
        </li>
        `;
    });

    return htmlpart;
}

// Returns lists <li> HTML String
function generateListsLi(lists) {
    let htmlpart = ``;

    lists.forEach(list => {
        htmlpart += `
        <li><a href="#${list.id}">${list.name}</a></li>
        `;
    });

    return htmlpart;
}

// Sets window 'Create new Group/List'
function setWindow(actionForm, title, inputHint) {
    let windowContainer = document.querySelector('#groups .window-container');

    windowContainer.innerHTML = `
    <div class="window-create-new">
        <form method="POST" action="${actionForm}">
            <label>${title}</label>
            <input type="text" name="name" placeholder="${inputHint}">
            <div class="row">
                <input type="button" value="X">
                <input type="submit" value="✔">
            </div>
        </form>
    </div>
    `;

    let cancelButton = windowContainer.querySelector('.window-create-new form .row input[type=button]');

    cancelButton.addEventListener('click', () => {
        windowContainer.style.display = 'none';
    });

    if (windowContainer.getAttribute('click-listener') !== 'true') {
        windowContainer.setAttribute('click-listener', 'true');

        windowContainer.addEventListener('click', e => {
            if (e.target === windowContainer) {
                windowContainer.style.display = 'none';
            }
        });
    }

    return windowContainer;
}

// Sets New Group Button listener
function setNewGroupBtnListener(button) {
    button.addEventListener('click', () => {
        let groupWindow = setWindow('/main/store/group', 'New Group:', 'Group Name');

        showWindow(groupWindow);
    });
}

// Sets New List Button listener
function setGroupsListeners(groupsLi, renderedGroupId) {
    for (let i = 0; i < groupsLi.length; i++) {
        let a = groupsLi[i].querySelector('a');

        a.addEventListener('click', () => {
            downloadData(`/main/data/${i}`)
                .then(data => dataHandler(data));
        });

        if (groupsLi[i].id === renderedGroupId) {
            a.style = 'background-color: rgb(223,227,238); border-radius: 10px;';
        }

        let newListButton = groupsLi[i].querySelector('.new-list-button');

        newListButton.addEventListener('click', () => {
            let listWindow = setWindow('/main/store/list/:' + groupsLi[i].id, 'New List:', 'List Name');
            showWindow(listWindow);
        });
    }
}


//---------------------------------------- Right side view

let listOfDraggedTask;
let draggedTask;


// Renders right side
function renderRightSide(sortedData, renderedGroupId) {
    rightSidelayout.innerHTML = `
    <div id="lists">

        ${generateListsDiv(sortedData, renderedGroupId)}

        <div id="create-update-task" class="window-container"></div>

        <div id="save-positions" class="window-container"></div>

        <div id="delete-tasks" class="window-container"></div>

    </div>
    `;

    setListsListeners(document.querySelectorAll('#lists .list-container'));
}

// Returns lists <div> HTML String
function generateListsDiv(groups, renderedGroupId) {
    let htmlpart = ``;
    let lists;

    groups.forEach(group => {
        if (renderedGroupId === group.id) {
            lists = group.lists;
        }
    });

    lists.forEach(list => {
        htmlpart += `
        <div id="${list.id}" class="list-container">

            <div class="header">
                <h2>${list.name}</h2>
                <button class="save"><i class="fa fa-save fa-2x"></i></button>
                <button class="new"><i class="fa fa-plus fa-2x"></i></button>
                <button class="delete"><i class="fa fa-trash fa-2x"></i></button>
            </div>

            <div class="tasks">

                ${generateTasksDiv(list.tasks)}

            </div>

        </div>
        `;
    });

    return htmlpart;
}

// Returns tasks <div> HTML String
function generateTasksDiv(tasks) {
    let htmlpart = ``;

    tasks.forEach(task => {
        htmlpart += `
        <div class="task-container" id="${task.id}">

            <input type="checkbox" ${task.status ? 'checked' : ''}>

            <div class="content">

                <div class="row-1">
                    <div class="hours">
                        <p>${task.startTime} - ${task.endTime}</p>
                    </div>

                    <div class="title">
                        <p>${task.title}</p>
                    </div>
                </div>

                <div class="description">
                    <p>${task.description}</p>
                </div>

            </div>

            <button><i class="fa fa-edit fa-2x"></i></button>
        </div>
        `;
    });

    return htmlpart;
}


// Showing set window
function showWindow(window) {
    window.style.display = 'block';

    let firstInput = window.querySelectorAll('input')[0];
    firstInput.focus();
}


// Sets for each lists listeners
function setListsListeners(listsContainers) {
    listsContainers.forEach(list => {

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

            setTaskListeners(task);
        });

        // Deleting finished Tasks -> Window Functionality
        let deleteTasksButton = list.querySelector('.header button.delete');

        deleteTasksButton.addEventListener('click', () => {
            let deleteTaskskWindow = setDeleteTaskskWindow(list, tasksContainer);

            showWindow(deleteTaskskWindow);
        })
    });
}

// Sets listeners for task
function setTaskListeners(task) {
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

        displaySaveButton();
    });
}


// Sets Window for creating/updating Task
function setTaskWindow(taskTime, taskTitle, taskDescr, title, actionForm) {
    let windowContainer = document.querySelector('#lists #create-update-task');

    windowContainer.innerHTML = `
    <div class="window">
        <p>${title}</p>
        <form method="POST" action="${actionForm}">
            <label>Start Time:</label>
            <input type="time" name="starttime" value="${taskTime[0]}">

            <label>End Time:</label>
            <input type="time" name="endtime" value="${taskTime[1]}">

            <label>Title:</label>
            <input type="text" name="title" placeholder="Title..." value="${taskTitle}">

            <label>Description:</label>
            <input type="text" name="description" placeholder="Description..." value="${taskDescr}">

            <div class="row">
                <input type="button" value="X">
                <input type="submit" value="✔">
            </div>
        </form>
    </div>
    `;

    let cancelButton = windowContainer.querySelector('.window form .row input[type=button]');

    cancelButton.addEventListener('click', () => {
        windowContainer.style.display = 'none';
    });

    if (windowContainer.getAttribute('click-listener') !== 'true') {
        windowContainer.setAttribute('click-listener', 'true');

        windowContainer.addEventListener('click', e => {
            if (e.target === windowContainer) {
                windowContainer.style.display = 'none';
            }
        });
    }

    return windowContainer;
}

// Sets Window for deleting finished Tasks
function setDeleteTaskskWindow(list, tasksContainer) {
    let windowContainer = document.querySelector('#lists #delete-tasks');
    let listTitle = list.querySelector('.header h2').textContent;

    windowContainer.innerHTML = `
    <div class="window">
        <p>Delete finished tasks in ${listTitle} ?</p>
        <div class="row">
            <input class="no" type="button" value="X">
            <input class="yes" type="button" value="✔">
        </div>
    </div>
    `;

    let noButton = windowContainer.querySelector('.row .no');
    let yesButton = windowContainer.querySelector('.row .yes');

    noButton.addEventListener('click', () => {
        windowContainer.style.display = 'none';
    });

    yesButton.addEventListener('click', () => {
        deleteTaskInDb(tasksContainer, list);

        windowContainer.style.display = 'none';
    });

    if (windowContainer.getAttribute('click-listener') !== 'true') {
        windowContainer.setAttribute('click-listener', 'true');

        windowContainer.addEventListener('click', e => {
            if (e.target === windowContainer) {
                windowContainer.style.display = 'none';
            }
        });
    }

    return windowContainer;
}

// Deletes tasks in Db
async function deleteTaskInDb(tasksContainer, list) {
    let tasks = tasksContainer.querySelectorAll('.task-container');
    let checkedTasksIds = [];
    let isSomeTaskChecked = false;

    tasks.forEach(task => {
        let id = task.id;
        let taskCheckbox = task.querySelector('input[type=checkbox]');

        if (taskCheckbox.checked) {
            isSomeTaskChecked = true;

            checkedTasksIds.push(id);

            tasksContainer.removeChild(task);
        }
    });

    if (isSomeTaskChecked === false) {
        return;
    }

    let listId = list.id;
    let url = `/main/delete/tasks/:${listId}`;

    let init = {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkedTasksIds),
    };

    await fetch(url, init)
        .then(updateTasksPositionsInDb(list));
}

// Updates task in Database
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

// Updates tasks positions
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

// Displays Save button
function displaySaveButton() {
    let saveButton = listOfDraggedTask.querySelector('.header .save');

    saveButton.style.display = 'block';

    let list = listOfDraggedTask;

    if (saveButton.getAttribute('click-listener') !== 'true') {
        saveButton.setAttribute('click-listener', 'true');

        saveButton.addEventListener('click', () => {
            let windowContainer = setSaveTasksPositionsWindow(list, saveButton);

            showWindow(windowContainer);
        });
    }
}

// Sets window
function setSaveTasksPositionsWindow(list, saveButton) {
    let windowContainer = document.querySelector('#lists #save-positions');
    let listTitle = listOfDraggedTask.querySelector('.header h2').textContent;

    windowContainer.innerHTML = `
    <div class="window">
        <p>Save tasks positions in ${listTitle} ?</p>
        <div class="row">
            <input class="no" type="button" value="X">
            <input class="yes" type="button" value="✔">
        </div>
    </div>
    `;

    let noButton = windowContainer.querySelector('.row .no');
    let yesButton = windowContainer.querySelector('.row .yes');

    noButton.addEventListener('click', () => {
        windowContainer.style.display = 'none';
    });

    yesButton.addEventListener('click', () => {
        updateTasksPositionsInDb(list);

        windowContainer.style.display = 'none';

        saveButton.style.display = 'none';
    });

    if (windowContainer.getAttribute('click-listener') !== 'true') {
        windowContainer.setAttribute('click-listener', 'true');

        windowContainer.addEventListener('click', e => {
            if (e.target === windowContainer) {
                windowContainer.style.display = 'none';
            }
        });
    }

    return windowContainer;
}

// Updates tasks positions in Db
async function updateTasksPositionsInDb(list) {
    let url = `/main/update/tasks/position`;
    let data = [];

    let tasks = list.querySelectorAll('.tasks .task-container');

    for (let i = 0; i < tasks.length; i++) {
        data.push({
            id: tasks[i].id,
            position: i
        });
    }

    let init = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    await fetch(url, init);
}