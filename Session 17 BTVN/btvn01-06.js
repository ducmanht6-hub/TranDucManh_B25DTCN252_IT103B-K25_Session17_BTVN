const defaultTasks = [
  { id: 1, task: "Mua bánh chưng", done: false },
  { id: 2, task: "Dọn nhà đón Tết", done: false },
  { id: 3, task: "Gói bánh chưng", done: false },
  { id: 4, task: "Trang trí nhà cửa bằng hoa mai, hoa đào", done: false },
  { id: 5, task: "Mua phong bao lì xì", done: false },
  { id: 6, task: "Chuẩn bị mâm ngũ quả", done: false },
];

let taskList = [];
let editingTaskIndex = null;

function loadTasks() {
  let storedData = localStorage.getItem("myTodos");

  if (storedData) {
    taskList = JSON.parse(storedData);
  } else {
    taskList = defaultTasks;
    saveTasks();
  }
}

function renderTasks() {
  let listElement = document.getElementById("todo-list");

  if (taskList.length === 0) {
    listElement.innerHTML = `<p class="empty">Chưa có công việc nào...</p>`;
    updateTaskStats();
    return;
  }

  let html = "";

  for (let i = 0; i < taskList.length; i++) {
    let content = "";

    if (editingTaskIndex === i) {
      content = `<input value="${taskList[i].task}" id="edit-${i}" onkeydown="handleEditKey(event,${i})">`;
    } else {
      content = `<span onclick="toggleTask(${i})">${taskList[i].done ? "✓" : "○"} ${taskList[i].task}</span>`;
    }

    html += `
      <li class="${taskList[i].done ? "done" : ""}">
        <div class="todo-left">${content}</div>
        <div class="actions">
          <span onclick="startEditTask(${i})">✏️</span>
          <span onclick="removeTask(${i})">🗑️</span>
        </div>
      </li>
    `;
  }

  listElement.innerHTML = html;

  if (editingTaskIndex !== null) {
    let input = document.getElementById("edit-" + editingTaskIndex);
    input.focus();
    input.select();
  }

  updateTaskStats();
}

function updateTaskStats() {
  let totalTasks = taskList.length;
  let completedTasks = taskList.filter((t) => t.done).length;

  let percent =
    totalTasks === 0 ? 0 : ((completedTasks / totalTasks) * 100).toFixed(1);

  document.getElementById("stats").innerText =
    `Tổng công việc: ${totalTasks} | Đã hoàn thành: ${completedTasks} (${percent}%)`;
}

function addTask() {
  let input = document.getElementById("task-input");
  let taskName = input.value.trim();

  if (taskName === "") {
    alert("Vui lòng nhập công việc!");
    return;
  }

  taskList.push({
    id: Date.now(),
    task: taskName,
    done: false,
  });

  input.value = "";

  saveTasks();
  renderTasks();
}

function toggleTask(index) {
  if (editingTaskIndex !== null) return;

  taskList[index].done = !taskList[index].done;

  saveTasks();
  renderTasks();
}

function removeTask(index) {
  let confirmDelete = confirm("Bạn có chắc muốn xóa công việc này?");

  if (confirmDelete) {
    taskList.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function startEditTask(index) {
  editingTaskIndex = index;
  renderTasks();
}

function handleEditKey(e, index) {
  if (e.key === "Enter") {
    let newValue = e.target.value.trim();

    if (newValue === "") {
      alert("Tên công việc không được rỗng");
      return;
    }

    taskList[index].task = newValue;

    editingTaskIndex = null;

    saveTasks();
    renderTasks();
  }

  if (e.key === "Escape") {
    editingTaskIndex = null;
    renderTasks();
  }
}

function clearAllTasks() {
  let confirmClear = confirm("Bạn có chắc muốn xóa toàn bộ danh sách?");

  if (confirmClear) {
    taskList = [];
    saveTasks();
    renderTasks();
  }
}

function saveTasks() {
  localStorage.setItem("myTodos", JSON.stringify(taskList));
}

document
  .getElementById("task-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addTask();
    }
  });

loadTasks();
renderTasks();
