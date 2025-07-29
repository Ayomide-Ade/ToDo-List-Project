const inputBox = document.getElementById("input-box");
const todoItems = document.getElementById("todo-items");

function addTask() {
  if (inputBox.value.trim() === "") return;

  let li = document.createElement("li");

  // Main task row (checkbox + text + remove inline)
  let mainTask = document.createElement("div");
  mainTask.classList.add("main-task");

  let mainLeft = document.createElement("div");
  mainLeft.classList.add("main-left");

  let checkbox = document.createElement("div");
  checkbox.classList.add("main-check");

  let taskText = document.createElement("span");
  taskText.classList.add("task-text");
  taskText.textContent = inputBox.value;

  mainLeft.appendChild(checkbox);
  mainLeft.appendChild(taskText);

  let removeBtn = document.createElement("span");
  removeBtn.classList.add("remove-btn");
  removeBtn.innerHTML = "\u00d7";

  mainTask.appendChild(mainLeft);
  mainTask.appendChild(removeBtn);
  li.appendChild(mainTask);

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

// Click handling
todoItems.addEventListener("click", function (e) {
  if (e.target.classList.contains("main-check")) {
    let parentLi = e.target.closest("li");
    parentLi.classList.toggle("checked");

    let subtasks = parentLi.querySelectorAll(".subtasks li");
    if (parentLi.classList.contains("checked")) {
      subtasks.forEach((sub) => sub.classList.add("checked"));
    } else {
      subtasks.forEach((sub) => sub.classList.remove("checked"));
    }

    saveData();
  } else if (e.target.classList.contains("remove-btn")) {
    e.target.closest("li").remove();
    saveData();
  } else if (e.target.closest(".subtasks") && e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    saveData();
  } else if (e.target.closest(".subtasks") && e.target.tagName === "SPAN") {
    e.target.closest("li").remove();
    saveData();
  }
}, false);

// Save and Load
function saveData() {
  localStorage.setItem("todoList", todoItems.innerHTML);
}

function showTasks() {
  todoItems.innerHTML = localStorage.getItem("todoList") || "";
}
showTasks();
