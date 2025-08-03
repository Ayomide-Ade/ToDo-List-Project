const inputBox = document.getElementById("input-box");
const todoItems = document.getElementById("todo-items");

function addTask() {
  if (inputBox.value.trim() === "") return;

  let li = document.createElement("li");

  // Main Task
  let mainTask = document.createElement("div");
  mainTask.classList.add("main-task");

  let check = document.createElement("div");
  check.classList.add("main-check");
  mainTask.appendChild(check);

  let taskText = document.createElement("span");
  taskText.classList.add("task-text");
  taskText.textContent = inputBox.value;
  mainTask.appendChild(taskText);

  let removeBtn = document.createElement("span");
  removeBtn.classList.add("remove-btn");
  removeBtn.innerHTML = "&times;";
  mainTask.appendChild(removeBtn);

  li.appendChild(mainTask);

  // Subtask input row
  let subRow = document.createElement("div");
  subRow.classList.add("sub-row");

  let subInput = document.createElement("input");
  subInput.type = "text";
  subInput.placeholder = "Add subtask";

  let subButton = document.createElement("button");
  subButton.textContent = "+";

  subButton.onclick = function (e) {
    e.stopPropagation();
    if (subInput.value.trim() !== "") {
      let subList = li.querySelector(".subtasks");
      let subItem = document.createElement("li");

      let subCheck = document.createElement("div");
      subCheck.classList.add("sub-check");
      subItem.appendChild(subCheck);

      let subText = document.createElement("span");
      subText.classList.add("sub-text");
      subText.textContent = subInput.value;
      subItem.appendChild(subText);

      let subRemove = document.createElement("span");
      subRemove.classList.add("remove-btn");
      subRemove.innerHTML = "&times;";
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
  if (e.target.classList.contains("remove-btn")) {
    e.target.closest("li").remove();
    saveData();
    return;
  }

  if (e.target.closest(".main-task")) {
    let parentLi = e.target.closest("li");
    parentLi.classList.toggle("checked");

    // Toggle all subtasks
    parentLi.querySelectorAll(".subtasks li").forEach(sub => {
      sub.classList.toggle("checked", parentLi.classList.contains("checked"));
    });

    saveData();
    return;
  }

  if (e.target.closest(".subtasks li")) {
    e.target.closest("li").classList.toggle("checked");
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
inputBox.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
}); 