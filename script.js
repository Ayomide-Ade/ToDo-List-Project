const inputBox = document.getElementById("input-box");
const todoItems = document.getElementById("todo-items");

/* === Add Main Task === */
function addTask() {
  if (inputBox.value.trim() === "") return; // ignore empty input

  const li = document.createElement("li");

  // Main task text
  const taskText = document.createElement("div");
  taskText.className = "task-text";
  taskText.textContent = inputBox.value;
  li.appendChild(taskText);

  // Delete button for main task
  const del = document.createElement("span");
  del.innerHTML = "\u00d7";
  li.appendChild(del);

  // Subtask input area
  const subRow = document.createElement("div");
  subRow.className = "sub-row";
  const subInput = document.createElement("input");
  subInput.placeholder = "Add a subtask...";
  const subBtn = document.createElement("button");
  subBtn.textContent = "+";
  subRow.appendChild(subInput);
  subRow.appendChild(subBtn);
  li.appendChild(subRow);

  // Subtasks container
  const subList = document.createElement("ul");
  subList.className = "subtasks";
  li.appendChild(subList);

  /* === Add Subtask Event === */
  subBtn.addEventListener("click", () => {
    if (subInput.value.trim() === "") return;
    const subLi = document.createElement("li");
    subLi.textContent = subInput.value;

    // Delete subtask button
    const subDel = document.createElement("span");
    subDel.innerHTML = "\u00d7";
    subLi.appendChild(subDel);

    // Toggle subtask completion
    subLi.addEventListener("click", (e) => {
      if (e.target.tagName === "LI") {
        subLi.classList.toggle("checked");
      }
    });

    // Remove subtask
    subDel.addEventListener("click", () => {
      subLi.remove();
      saveData();
    });

    subList.appendChild(subLi);
    subInput.value = "";
    saveData();
  });

  todoItems.appendChild(li);
  inputBox.value = "";
  saveData();
}

/* === Handle Main Task Completion & Deletion === */
todoItems.addEventListener("click", function (e) {
  if (e.target.tagName === "LI" && !e.target.closest(".subtasks")) {
    const mainLi = e.target;
    mainLi.classList.toggle("checked");

    // Auto-complete all subtasks when main task is checked
    if (mainLi.classList.contains("checked")) {
      const allSubs = mainLi.querySelectorAll(".subtasks li");
      allSubs.forEach(sub => sub.classList.add("checked"));
    }

    saveData();
  } else if (e.target.tagName === "SPAN" && !e.target.closest(".subtasks")) {
    e.target.parentElement.remove();
    saveData();
  }
});

/* === Save and Load from LocalStorage === */
function saveData() {
  localStorage.setItem("todoList", todoItems.innerHTML);
}

function showTasks() {
  todoItems.innerHTML = localStorage.getItem("todoList") || "";
}
showTasks();
