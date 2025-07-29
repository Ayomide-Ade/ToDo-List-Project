const inputBox = document.getElementById("input-box");
const todoItems = document.getElementById("todo-items");

function addTask() {
  if (inputBox.value.trim() === "") return;

  let li = document.createElement("li");

  // Main task container
  let mainTask = document.createElement("div");
  mainTask.classList.add("main-task");

  // Checkbox
  let check = document.createElement("div");
  check.classList.add("main-check");

  // Task text
  let taskText = document.createElement("span");
  taskText.classList.add("task-text");
  taskText.textContent = inputBox.value;

  // Remove button
  let removeBtn = document.createElement("span");
  removeBtn.innerHTML = "\u00d7";
  removeBtn.classList.add("remove-btn");

  mainTask.appendChild(check);
  mainTask.appendChild(taskText);
  li.appendChild(mainTask);
  li.appendChild(removeBtn);

  // Subtask input
  let subRow = document.createElement("div");
  subRow.classList.add("sub-row");

  let subInput = document.createElement("input");
  subInput.type = "text";
  subInput.placeholder = "Add a subtask...";

  let subButton = document.createElement("button");
  subButton.textContent = "+";

  subButton.onclick = function () {
    if (subInput.value.trim() !== "") {
      let subList = li.querySelector(".subtasks");
      let subItem = document.createElement("li");
      subItem.textContent = subInput.value;

      let subRemove = document.createElement("span");
      subRemove.innerHTML = "\u00d7";
      subItem.appendChild(subRemove);

      subList.appendChild(subItem);
      subInput.value = "";
      saveData();
    }
  };

  subRow.appendChild(subInput);
  subRow.appendChild(subButton);
  li.appendChild(subRow);

  let subList = document.createElement("ul");
  subList.classList.add("subtasks");
  li.appendChild(subList);

  todoItems.appendChild(li);
  inputBox.value = "";
  saveData();
}

todoItems.addEventListener("click", function (e) {
  // Toggle main checkbox
  if (e.target.classList.contains("main-check")) {
    let li = e.target.closest("li");
    li.classList.toggle("checked");

    // Check/uncheck all subtasks with main task
    let subtasks = li.querySelectorAll(".subtasks li");
    if (li.classList.contains("checked")) {
      subtasks.forEach(sub => sub.classList.add("checked"));
    } else {
      subtasks.forEach(sub => sub.classList.remove("checked"));
    }
    saveData();
  }

  // Remove main task
  if (e.target.classList.contains("remove-btn")) {
    e.target.closest("li").remove();
    saveData();
  }

  // Toggle subtask checked
  if (e.target.tagName === "LI" && e.target.closest(".subtasks")) {
    e.target.classList.toggle("checked");
    saveData();
  }

  // Remove subtask
  if (e.target.closest(".subtasks") && e.target.tagName === "SPAN") {
    e.target.parentElement.remove();
    saveData();
  }
});

function saveData() {
  localStorage.setItem("todoList", todoItems.innerHTML);
}

function showTasks() {
  todoItems.innerHTML = localStorage.getItem("todoList") || "";
}
showTasks();
localStorage.clear();