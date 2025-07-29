const inputBox = document.getElementById("input-box");
const todoItems = document.getElementById("todo-items");

function addTask() {
  if (inputBox.value.trim() === "") return;

  const li = document.createElement("li");

  // Main Task
  const mainTask = document.createElement("div");
  mainTask.classList.add("main-task");

  const check = document.createElement("div");
  check.classList.add("main-check");

  const text = document.createElement("span");
  text.classList.add("task-text");
  text.textContent = inputBox.value;

  const remove = document.createElement("span");
  remove.classList.add("remove-btn");
  remove.innerHTML = "\u00d7";

  mainTask.appendChild(check);
  mainTask.appendChild(text);
  mainTask.appendChild(remove);
  li.appendChild(mainTask);

  // Subtask Input
  const subRow = document.createElement("div");
  subRow.classList.add("sub-row");

  const subInput = document.createElement("input");
  subInput.type = "text";
  subInput.placeholder = "Add a subtask...";

  const subButton = document.createElement("button");
  subButton.textContent = "+";

  subButton.onclick = function () {
    if (subInput.value.trim() !== "") {
      const subItem = document.createElement("li");
      subItem.textContent = subInput.value;

      const subRemove = document.createElement("span");
      subRemove.innerHTML = "\u00d7";
      subItem.appendChild(subRemove);

      const subList = li.querySelector(".subtasks");
      subList.appendChild(subItem);
      subInput.value = "";
      saveData();
    }
  };

  subRow.appendChild(subInput);
  subRow.appendChild(subButton);
  li.appendChild(subRow);

  const subList = document.createElement("ul");
  subList.classList.add("subtasks");
  li.appendChild(subList);

  todoItems.appendChild(li);
  inputBox.value = "";
  saveData();
}

// Event Listener
todoItems.addEventListener("click", function (e) {
  const li = e.target.closest("li");

  // Toggle main task and subtasks together
  if (li && e.target.closest(".main-task")) {
    li.classList.toggle("checked");
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

  // Toggle subtask
  if (e.target.tagName === "LI" && e.target.closest(".subtasks")) {
    e.target.classList.toggle("checked");
    saveData();
  }

  // Remove subtask
  if (e.target.closest(".subtasks") && e.target.tagName === "SPAN") {
    e.target.parentElement.remove();
    saveData();
  }
}, false);

function saveData() {
  localStorage.setItem("todoList", todoItems.innerHTML);
}

function showTasks() {
  todoItems.innerHTML = localStorage.getItem("todoList") || "";
}
showTasks();
