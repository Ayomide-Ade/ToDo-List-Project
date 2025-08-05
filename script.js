const inputBox = document.getElementById("input-box");
const todoItems = document.getElementById("todo-items");

function addTask() {
  if (inputBox.value.trim() === "") return;

  // Create main task container
  let taskItem = document.createElement("div");
  taskItem.classList.add("task-item");
  taskItem.setAttribute("data-task-id", Date.now()); // Unique ID for each task

  // === Main task row
  let mainRow = document.createElement("div");
  mainRow.classList.add("main-task");

  let check = document.createElement("div");
  check.classList.add("main-check");

  let taskText = document.createElement("span");
  taskText.classList.add("task-text");
  taskText.textContent = inputBox.value;

  let removeBtn = document.createElement("span");
  removeBtn.classList.add("remove-btn");
  removeBtn.innerHTML = "×";

  mainRow.appendChild(check);
  mainRow.appendChild(taskText);
  mainRow.appendChild(removeBtn);
  taskItem.appendChild(mainRow);

  // === Subtask input row
  let subRow = document.createElement("div");
  subRow.classList.add("sub-row");

  let subInput = document.createElement("input");
  subInput.type = "text";
  subInput.placeholder = "Add a subtask...";

  let subButton = document.createElement("button");
  subButton.textContent = "+";
  
  // Add subtask function
  subButton.onclick = function (e) {
    e.stopPropagation(); // Prevent task container click
    if (subInput.value.trim() !== "") {
      addSubtask(taskItem, subInput.value.trim());
      subInput.value = "";
      saveData();
    }
  };

  // Allow Enter key to add subtasks
  subInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      e.stopPropagation();
      subButton.click();
    }
  });

  // Prevent input click from toggling task
  subInput.addEventListener("click", function(e) {
    e.stopPropagation();
  });

  subRow.appendChild(subInput);
  subRow.appendChild(subButton);
  taskItem.appendChild(subRow);

  // === Subtask list container
  let subList = document.createElement("div");
  subList.classList.add("subtasks");
  taskItem.appendChild(subList);

  todoItems.appendChild(taskItem);
  inputBox.value = "";
  updateEmptyState();
  saveData();
}

// Function to add a subtask to a specific task
function addSubtask(taskItem, subtaskText) {
  let subList = taskItem.querySelector(".subtasks");
  
  let subItem = document.createElement("div");
  subItem.classList.add("subtask-item");
  subItem.setAttribute("data-subtask-id", Date.now() + Math.random()); // Unique ID
  
  let subText = document.createElement("span");
  subText.classList.add("subtask-text");
  subText.textContent = subtaskText;
  
  let subRemove = document.createElement("span");
  subRemove.classList.add("subtask-remove");
  subRemove.innerHTML = "×";
  
  subItem.appendChild(subText);
  subItem.appendChild(subRemove);
  subList.appendChild(subItem);
}

// Allow Enter key to add main tasks
inputBox.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    addTask();
  }
});

// === Event delegation with improved logic
todoItems.addEventListener("click", function (e) {
  // Handle main task checkbox click
  if (e.target.classList.contains("main-check")) {
    e.stopPropagation();
    let taskItem = e.target.closest(".task-item");
    toggleMainTask(taskItem);
    saveData();
    return;
  }
  
  // Handle main task remove button
  if (e.target.classList.contains("remove-btn")) {
    e.stopPropagation();
    e.target.closest(".task-item").remove();
    updateEmptyState();
    saveData();
    return;
  }
  
  // Handle subtask remove button
  if (e.target.classList.contains("subtask-remove")) {
    e.stopPropagation();
    e.target.closest(".subtask-item").remove();
    saveData();
    return;
  }
  
  // Handle subtask click (toggle individual subtask)
  if (e.target.closest(".subtask-item")) {
    e.stopPropagation();
    let subtaskItem = e.target.closest(".subtask-item");
    subtaskItem.classList.toggle("checked");
    checkMainTaskCompletion(subtaskItem.closest(".task-item"));
    saveData();
    return;
  }
  
  // Handle main task container click (toggle entire task)
  if (e.target.closest(".task-item")) {
    let taskItem = e.target.closest(".task-item");
    toggleMainTask(taskItem);
    saveData();
    return;
  }
}, false);

// Function to toggle main task and all its subtasks
function toggleMainTask(taskItem) {
  let isCurrentlyChecked = taskItem.classList.contains("checked");
  
  if (isCurrentlyChecked) {
    // Uncheck main task and all subtasks
    taskItem.classList.remove("checked");
    let subtasks = taskItem.querySelectorAll(".subtask-item");
    subtasks.forEach(subtask => {
      subtask.classList.remove("checked");
    });
  } else {
    // Check main task and all subtasks
    taskItem.classList.add("checked");
    let subtasks = taskItem.querySelectorAll(".subtask-item");
    subtasks.forEach(subtask => {
      subtask.classList.add("checked");
    });
  }
}

// Function to check if main task should be completed based on subtasks
function checkMainTaskCompletion(taskItem) {
  let subtasks = taskItem.querySelectorAll(".subtask-item");
  let checkedSubtasks = taskItem.querySelectorAll(".subtask-item.checked");
  
  // If all subtasks are checked, check the main task
  if (subtasks.length > 0 && subtasks.length === checkedSubtasks.length) {
    taskItem.classList.add("checked");
  } else {
    // If not all subtasks are checked, uncheck the main task
    taskItem.classList.remove("checked");
  }
}

// Function to update empty state
function updateEmptyState() {
  let tasks = todoItems.querySelectorAll(".task-item");
  if (tasks.length === 0) {
    if (!todoItems.querySelector(".empty-state")) {
      let emptyDiv = document.createElement("div");
      emptyDiv.classList.add("empty-state");
      emptyDiv.innerHTML = "No tasks yet. Add your first task above! 📝";
      todoItems.appendChild(emptyDiv);
    }
  } else {
    let emptyState = todoItems.querySelector(".empty-state");
    if (emptyState) {
      emptyState.remove();
    }
  }
}

// Enhanced save function - Save structured data instead of HTML
function saveData() {
  try {
    let tasks = [];
    let taskItems = todoItems.querySelectorAll(".task-item");
    
    taskItems.forEach(taskItem => {
      let taskData = {
        id: taskItem.getAttribute("data-task-id"),
        text: taskItem.querySelector(".task-text").textContent,
        checked: taskItem.classList.contains("checked"),
        subtasks: []
      };
      
      let subtasks = taskItem.querySelectorAll(".subtask-item");
      subtasks.forEach(subtask => {
        taskData.subtasks.push({
          id: subtask.getAttribute("data-subtask-id"),
          text: subtask.querySelector(".subtask-text").textContent,
          checked: subtask.classList.contains("checked")
        });
      });
      
      tasks.push(taskData);
    });
    
    localStorage.setItem("todoList", JSON.stringify(tasks));
  } catch (error) {
    console.log("Could not save to localStorage:", error);
  }
}

// Enhanced load function - Rebuild from structured data
function showTasks() {
  try {
    let savedData = localStorage.getItem("todoList");
    if (savedData) {
      let tasks = JSON.parse(savedData);
      todoItems.innerHTML = ""; // Clear first
      
      tasks.forEach(taskData => {
        // Recreate task using existing function logic
        let originalValue = inputBox.value;
        inputBox.value = taskData.text;
        addTask();
        
        let newTask = todoItems.lastElementChild;
        if (newTask) {
          newTask.setAttribute("data-task-id", taskData.id);
          
          // Set checked state
          if (taskData.checked) {
            newTask.classList.add("checked");
          }
          
          // Add subtasks
          taskData.subtasks.forEach(subtaskData => {
            addSubtask(newTask, subtaskData.text);
            let newSubtask = newTask.querySelector(".subtasks").lastElementChild;
            if (newSubtask) {
              newSubtask.setAttribute("data-subtask-id", subtaskData.id);
              if (subtaskData.checked) {
                newSubtask.classList.add("checked");
              }
            }
          });
        }
        
        inputBox.value = originalValue;
      });
    }
    updateEmptyState();
  } catch (error) {
    console.log("Could not load from localStorage:", error);
    // If JSON parsing fails, try to clear corrupted data
    localStorage.removeItem("todoList");
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  showTasks();
});