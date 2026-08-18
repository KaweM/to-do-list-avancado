const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseButton = document.querySelector("#erase-button");
const filterSelect = document.querySelector("#filter-select");

let oldInputValue;

const saveTodo = (text) => {

    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(deleteBtn);

    todoList.appendChild(todo);

    todoInput.value = "";
    todoInput.focus();

    syncStorage();
}

const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
}

const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo) => {

        let todoTitle = todo.querySelector("h3")

        if(todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text
        }
    });

    syncStorage();
}

todoForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const inputValue = todoInput.value;

    if (inputValue) {
        saveTodo(inputValue);
    }
})

document.addEventListener("click", (e) => {

    const targetEl = e.target
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");
        syncStorage();
    }

    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
        syncStorage();
    }

    if (targetEl.classList.contains("edit-todo")) {
    toggleForms();

    editInput.value = todoTitle
    oldInputValue = todoTitle
    }
})

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();

    toggleForms();
})

editForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const editInputValue = editInput.value

    if (editInputValue) {
        updateTodo(editInputValue)
    }

    toggleForms()
})

const syncStorage = () => {
    const todos = document.querySelectorAll(".todo");
    const todosToSave = [];

    todos.forEach((todo) => {
        todosToSave.push({
            text: todo.querySelector("h3").innerText,
            done: todo.classList.contains("done"),
        });
    });

    localStorage.setItem("todos", JSON.stringify(todosToSave));
}

const loadTodos = () => {
    const todos = JSON.parse(localStorage.getItem("todos"));

    if (!todos) {
        syncStorage();
        return;
    }

    todoList.innerHTML = "";

    todos.forEach((todo) => {
        saveTodo(todo.text);

        if (todo.done) {
            todoList.lastChild.classList.add("done");
        }
    });
}

searchInput.addEventListener("keyup", () => {
    const searchValue = searchInput.value.toLowerCase();

    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        const todoTitle = todo.querySelector("h3").innerText.toLowerCase();

        if (todoTitle.includes(searchValue)) {
            todo.style.display = "flex";
        } else {
            todo.style.display = "none";
        }
    });
})

eraseButton.addEventListener("click", (e) => {
    e.preventDefault();

    searchInput.value = "";
    searchInput.dispatchEvent(new Event("keyup"));
})

filterSelect.addEventListener("change", () => {
    const filterValue = filterSelect.value;

    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        switch (filterValue) {
            case "done":
                todo.style.display = todo.classList.contains("done") ? "flex" : "none";
                break;
            case "todo":
                todo.style.display = !todo.classList.contains("done") ? "flex" : "none";
                break;
            default:
                todo.style.display = "flex";
        }
    });
})

loadTodos();