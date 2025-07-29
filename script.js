const inputBox = document.getElementById("input-box");
const todoItems = document.getElementById("todo-items");

function addTask() {
  if (inputBox.value.trim() === "") return;

  let li = document.createElement("li");

  // Main task row container
  let mainTask = document.createElement("div");
  mainTask.classList.add("main-task");

  // Checkbox icon
  let check = document.createElement("div");
  check.classList.add("main-check");
  mainTask.appendChild(check);

  // Task text
  let taskText = document.createElement("span");
  taskText.classList.add("task-text");
  taskText.textContent = inputBox.value;
  mainTask.appendChild(taskText);

  // Remove button
  let removeBtn = document.createElement("span");
  removeBtn.innerHTML = "\u00d7";
  removeBtn.classList.add("remove-btn");
  mainTask.appendChild(removeBtn);

  li.appendChild(mainTask);

  // Subtask input row
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

  // Subtasks list
  let subList = document.createElement("ul");
  subList.classList.add("subtasks");
  li.appendChild(subList);

  todoItems.appendChild(li);
  inputBox.value = "";
  saveData();
}

// Click handling for main tasks and subtasks
todoItems.addEventListener("click", function (e) {
  const li = e.target.closest("li");

  // Toggle main task when clicking anywhere inside it (except buttons)
  if (li && !e.target.classList.contains("remove-btn") && !e.target.closest(".sub-row")) {
    li.classList.toggle("checked");

    // Toggle subtasks when main task is checked/unchecked
    const subtasks = li.querySelectorAll(".subtasks li");
    subtasks.forEach(sub => {
      if (li.classList.contains("checked")) {
        sub.classList.add("checked");
      } else {
        sub.classList.remove("checked");
      }
    });

    saveData();
  }

  // Remove main task
  if (e.target.classList.contains("remove-btn")) {
    li.remove();
    saveData();
  }

  // Toggle subtasks individually
  if (e.target.closest(".subtasks") && e.target.tagName === "LI") {
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
