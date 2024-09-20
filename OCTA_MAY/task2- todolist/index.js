let tasks = [];

function addTask() {
  let taskName = document.getElementById("taskNameInput").value;
  let dueDate = document.getElementById("dueDateInput").value;
  let groupName = document.getElementById("groupNameInput").value;

  let today = new Date();
  let selectedDate = new Date(dueDate);

  if (selectedDate < today) {
    alert("Due date cannot be in the past!");
    return;
  }

  let priority;
  let diffDays = Math.ceil((selectedDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays <= 3) {
    priority = "High";
  } else if (diffDays <= 5) {
    priority = "Medium";
  } else if (diffDays <= 10) {
    priority = "Low";
  } else {
    priority = "Low";
  }

  let task = {
    name: taskName,
    dueDate: dueDate,
    groupName: groupName,
    priority: priority,
    done: false,
  };

  tasks.push(task);

  document.getElementById("taskNameInput").value = "";
  document.getElementById("dueDateInput").value = "";
  document.getElementById("groupNameInput").value = "";

  if (document.querySelector(".groups").classList.contains("active")) {
    updateLists();
  } else {
    updateListWithoutGrouping();
  }
}

function updateLists() {
  let taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  let groupedButton = document.querySelector(".groups");

  if (groupedButton.classList.contains("active")) {
    let groups = tasks.reduce((acc, task) => {
      acc[task.groupName] = acc[task.groupName] || [];
      acc[task.groupName].push(task);
      return acc;
    }, {});

    for (let group in groups) {
      let groupTasks = groups[group];
      groupTasks.sort((a, b) => {
        if (a.priority === b.priority) {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        return a.priority === "High"
          ? -1
          : b.priority === "High"
          ? 1
          : a.priority === "Medium"
          ? -1
          : 1;
      });
      groupTasks.forEach((task, index) => {
        let taskElement = document.createElement("div");
        taskElement.innerHTML = `${task.name} - Due Date: ${task.dueDate} - Group: ${task.groupName} - Priority: ${task.priority}`;
        let doneButton = document.createElement("button");
        doneButton.innerText = "Done";
        doneButton.addEventListener("click", () => {
          task.done = !task.done;
          updateLists();
        });

        let deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.addEventListener("click", () => {
          tasks.splice(tasks.indexOf(task), 1);
          updateLists();
        });

        taskElement.appendChild(doneButton);
        taskElement.appendChild(deleteButton);

        if (task.done) {
          taskElement.style.backgroundColor = "lightgreen";
        }

        taskList.appendChild(taskElement);
      });
    }
  }
}

function updateListWithoutGrouping() {
  let taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  let sortedTasks = tasks.slice().sort((a, b) => {
    return new Date(b.dueDate) - new Date(a.dueDate);
  });

  sortedTasks.forEach((task, index) => {
    let taskElement = document.createElement("div");
    taskElement.innerHTML = `${task.name} - Due Date: ${task.dueDate} - Group: ${task.groupName} - Priority: ${task.priority}`;

    let doneButton = document.createElement("button");
    doneButton.innerText = "Done";
    doneButton.addEventListener("click", () => {
      task.done = !task.done;
      updateListWithoutGrouping();
    });

    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", () => {
      tasks.splice(tasks.indexOf(task), 1);
      updateListWithoutGrouping();
    });

    taskElement.appendChild(doneButton);
    taskElement.appendChild(deleteButton);

    if (task.done) {
      taskElement.style.backgroundColor = "lightgreen";
    }

    taskList.appendChild(taskElement);
  });
}

function showGroups() {
  let groupedButton = document.querySelector(".groups");
  groupedButton.classList.toggle("active");
  if (groupedButton.classList.contains("active")) {
    updateLists();
  } else {
    updateListWithoutGrouping();
  }
}
