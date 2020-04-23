// !!! TODO !!! 1. when task will be dragover set box-shadow: 0 5px 6px var(--general-blue-color); to better look later turn off this
// !!! TODO !!! 2. Add real time that measure state fnishing tasks. (FUTURE)P.s. It will be more powerfull if you add progress bar in task in FRONTEND
// !!! TODO !!! 3. In menu task add one more option Copy (FUTURE)


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







// !!! TODO !!! In lists-layout
// LIST
// -setting buttons listener in lists-layout in header of each list:
// 'Create New' - opening window(inputs and submit) and creating new task in this list
// 'Delete' - creating on each button checkbox and deleting one/more tasks
// TASK
// -adding listeners for checkboxs for each task
// -adding listeners for button>fa-ellipsis-v< for each task -> showing menu with Option 'Edit...'


// !!! TODO !!! Draging and droping tasks LOOK: if you have too long list then you need scroll. So when you drag task you must consider auto scrolling too
