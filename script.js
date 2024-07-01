// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

function generateRandomNumber() {
    const min = Math.pow(10, 14);
    const max = Math.pow(10, 15) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    card.data('task-id', task.id);
    card.find('.delete-task').on('click', handleDeleteTask);

    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $('.lane .card-body').empty();

    taskList.forEach(task => {
        let card = createTaskCard(task);
        $(`#${task.status}-cards`).append(card);
    });

    $('.task-card').draggable({
        revert: 'invalid',
        containment: '.container',
        helper: 'clone',
        cursor: 'move'

    });
};

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();

    let taskName = $('#taskName').val();
    let taskDescription = $('#taskDescription').val();
    let taskDueDate = $('#taskDueDate').val();

    if (!taskName || !taskDueDate) {
        alert('Please enter Task Name and Due Date.');
        return;
    }

    let newTask = {
        id: generateTaskId(),
        name: taskName,
        description: taskDescription,
        dueDate: taskDueDate,
        status: 'to-do'
    };

    taskList.push(newTask);

    localStorage.setItem('tasks', JSON.stringify(taskList));
    localStorage.setItem('nextId', JSON.stringify(nextId));

    $('#taskForm').trigger('reset');

    renderTaskList();

    $('#formModal').modal('hide');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    event.preventDefault();

    let taskId = $(this).closest('.task-card').data('task-id');
    taskList = taskList.filter(task => task.id !== taskId);

    localStorage.setItem('tasks', JSON.stringify(taskList));

    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let taskId = ui.draggable.data('task-id');
    let newStatus = $(this).attr('id');

    let taskIndex = taskList.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        taskList[taskIndex].status = newStatus;

        localStorage.setItem('tasks', JSON.stringify(taskList));

        renderTaskList();
    }
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $('#taskForm').submit(handleAddTask);

    $('.lane').droppable({
        accept: '.task-card',
        drop: handleDrop
    });

    $('#taskDueDate').datepicker({
        dateFormat: 'DD MM YYY'
    });

});
