// //dom elements
// var todoList = [];
// var comdoList = [];
// var remList = [];
// var addButton = ducument.getElementById("add-button")
// var todoInput = document.getElementById("todo-input")
// var deleteAllButton = document.getElementById("delete-all")
// var allTodos = document.getFlesentRyTd("all-todos");
// var deleteSButton = document.getElementById("delete-selected");

// //event listners for add and delete

// function updateList() {
//     comdoList = todoList.filter((data) => {
//         if (data.complete == true) return data;
//     })

//     remList = todoList.filter((data) => {
//         if (data.complete == false) return data;
//     })

//     // console.log("the task is completed :"+comdoList);
//     // console.log("ALL task is completed :"+remLIst);
//     document.querySelector('#r-count').textContent = todoList.length;

//     document.querySelector('#r-count').textContent = todoList.length;
// }

// function appendTask(todoList) {
//     allTodos.innerHTML = "";
//     todoList.forEach((element) => {
//         var x = `<li id=${element.id} class="todo-item>
//      <p id="task> ${element.complete ? `<strike>${element.task}<strike>` : element.task}</p>
//      <div class="todo-actions">
//                 <button class="complete btn btn-success">
//                 <i class= ci bx bx-check bx-sm"></i>
//                 </button>
                 
//                 <button class="delete btn btn-error">
//                    <i class="di bx bx-trash bx-sm"></i>
//                 </button>
//              </div>
//         </li>`
//         allTodos.innerHTML += x;
//     });
// }

// //event listners for add and delete 
// function add() {
//     //take the conetent from the input box 
//     var text = todoInput.value;
//     if (text == "") {
//         alert('no content is added,please add the content');
//         return;
//     }
//     console.log(text);

//     todoList.push({
//         task: text,
//         id: Date.now().toString(),
//         complete: false
//     })

//     todoList.forEach((value) => {
//         console.log(value);
//     });
//     todoInput.value = "";

//     updateList();//enter 2 remaining array --> completetion and remaining update and reflect variables(total tsk)
//     appendTask(todoList);
// }

// addButton.addEventListener('click', add);

// todoInput.addEventListener('keypress', (event) => {
//     if (event.key === 'enter') {
//         add();
//     }
// });

// function deleteAll() {
//     todoList = [];
//     updateList();
//     appendTask(todoList);
// }

// deleteAllButton.addeventListener('click', deleteAll);

// function deleteS() {
//     todoList = todoList.filter((data) => {
//         if (data.complete === 'false') {
//             return data;
//         }
//     });
//     // console.log(todoList);
//     updateList();
//     appendTask(todoList);
// }

// deleteSButton.addEventListener('click', deleteS);

// function deleteSpecific(event) {
//     var id = event.target.parentElement.parentElement.getAttribute('id');
//     console.log(id);
//     todoList = todoList.filter((data) => {
//         return data.id != id;
//     });
//     updateList();
//     appendTask(todoList);
// }

// document.addEventListener('click', (event) => {
//     if (event.target.classList.contains('delete') || event.target.classList.contains('di')) {
//         console.log(event.target);
//         deleteSpecific(event);
//     }
// });

// document.addEventListener('click',(event)=>{
//     if(event.target.classlist.contains('delete')|| event.target.classList.contains('di')){
//         deleteTask(event);
//     }
//     if(event.target.classList.contains('complete')||event.target.classlist.contains('ci')){
//         completeTask(event);
//     }
//     if(event.target.classList.contains('all')){
//         updateList();
//         appendTask(todoList);
//     }
//     if(event.target.classList.contains('rem')){
//         updateList();
//         appendTask(remList);
//     }
//     if(event.target.classList.contains('com')){
//         updateList();
//         appendTask(comdoList);
//     }
    
// });

// function deleteTask(event){
//   var id = event.target.parentElement.parentElement.getAttribute('id');

//   todoList = todoList.filter((data)=>{
//     return data.id != id;
//   })
//   console.log(todoList);
//   updateList();
//   appendTask(todolist);
// }

// function completeTask(event){
//     var id = event.target.parentElement.parentElement.getAttribute('id');

//     todolist.forEach((data)=>{

//         if(data.id == id){
//             if(data.complete == false){
//                 data.complete = true;
//                 event.target.parentElement.parentElement.querySelector('#task').classList.add('line');
//             }
//             else{
//                 data.complete = false;
//                 event.target.parentElement.parentElement.querySelector('#task').classList.remove('line');

//             }
//         }
//     });
//     updateList();
//     appendTask(todolist);
// }


// DOM elements
var todoList = [];
var completedList = [];
var remList = [];

var addButton = document.getElementById("add-button");
var todoInput = document.getElementById("todo-input");
var deleteAllButton = document.getElementById("delete-all");
var allTodos = document.getElementById("all-todos");
var deleteSButton = document.getElementById("delete-selected");

// Update completed and remaining lists
function updateList() {
    completedList = todoList.filter((data) => data.complete === true);
    remList = todoList.filter((data) => data.complete === false);

    document.querySelector('#r-count').textContent = todoList.length;
    
    // Also update #c-count if available
    const cCountEl = document.querySelector('#c-count');
    if(cCountEl) {
        cCountEl.textContent = completedList.length;
    }
}

// Render tasks on screen
function appendTask(list) {
    allTodos.innerHTML = "";

    list.forEach((element) => {
        var x = `
        <li id="${element.id}" class="todo-item">
            <p id="task">${element.complete ? `<strike>${element.task}</strike>` : element.task}</p>

            <div class="todo-actions">
                <button class="complete btn btn-success">
                    <i class="ci bx bx-check bx-sm"></i>
                </button>

                <button class="delete btn btn-error">
                    <i class="di bx bx-trash bx-sm"></i>
                </button>
            </div>
        </li>`;
        allTodos.innerHTML += x;
    });
}

// Add new task
function add() {
    var text = todoInput.value.trim();

    if (text === "") {
        alert('No content added. Please type something.');
        return;
    }

    todoList.push({
        task: text,
        id: Date.now().toString(),
        complete: false
    });

    todoInput.value = "";
    updateList();
    appendTask(todoList);
}

addButton.addEventListener('click', add);

// Enter key add
todoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        add();
    }
});

// Delete all tasks
function deleteAll() {
    todoList = [];
    updateList();
    appendTask(todoList);
}

deleteAllButton.addEventListener('click', deleteAll);

// Delete completed tasks (delete selected)
function deleteS() {
    todoList = todoList.filter((data) => data.complete === false);
    updateList();
    appendTask(todoList);
}

deleteSButton.addEventListener('click', deleteS);

// Delete specific task
function deleteSpecific(event) {
    var id = event.target.closest("li").id;

    todoList = todoList.filter((data) => data.id != id);

    updateList();
    appendTask(todoList);
}

// Complete or delete event handler
document.addEventListener('click', (event) => {
    // Delete
    if (
        event.target.classList.contains('delete') ||
        event.target.classList.contains('di')
    ) {
        deleteSpecific(event);
    }

    // Complete
    if (
        event.target.classList.contains('complete') ||
        event.target.classList.contains('ci')
    ) {
        completeTask(event);
    }

    // Show all
    if (event.target.id === 'all' || event.target.classList.contains('all')) {
        updateList();
        appendTask(todoList);
    }

    // Show remaining
    if (event.target.id === 'rem' || event.target.classList.contains('rem')) {
        updateList();
        appendTask(remList);
    }

    // Show completed
    if (event.target.id === 'com' || event.target.classList.contains('com')) {
        updateList();
        appendTask(completedList);
    }
});

// Toggle completion of a task
function completeTask(event) {
    var id = event.target.closest("li").id;

    todoList.forEach((data) => {
        if (data.id == id) {
            data.complete = !data.complete;
        }
    });

    updateList();
    appendTask(todoList);
}
