(function () {
  "use strict";

  const STORAGE_KEY = "todos";

  // --- State ---
  let todos = loadTodos();
  let currentFilter = "all";

  // --- DOM ---
  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");
  const countEl = document.getElementById("todo-count");
  const clearBtn = document.getElementById("clear-completed");
  const filterBtns = document.querySelectorAll(".filter-btn");

  // --- Persistence ---
  function loadTodos() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  // --- Rendering ---
  function render() {
    const filtered = todos.filter(function (todo) {
      if (currentFilter === "active") return !todo.completed;
      if (currentFilter === "completed") return todo.completed;
      return true;
    });

    list.innerHTML = "";

    filtered.forEach(function (todo) {
      const li = document.createElement("li");
      li.className = "todo-item" + (todo.completed ? " completed" : "");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "todo-checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", function () {
        toggleTodo(todo.id);
      });

      const text = document.createElement("span");
      text.className = "todo-text";
      text.textContent = todo.text;

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "\u00d7";
      deleteBtn.title = "削除";
      deleteBtn.addEventListener("click", function () {
        deleteTodo(todo.id);
      });

      li.appendChild(checkbox);
      li.appendChild(text);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    });

    updateFooter();
  }

  function updateFooter() {
    const activeCount = todos.filter(function (t) {
      return !t.completed;
    }).length;
    const completedCount = todos.length - activeCount;

    countEl.textContent = activeCount + " piece" + (activeCount === 1 ? "" : "s") + " remaining";
    clearBtn.hidden = completedCount === 0;
  }

  // --- Actions ---
  function addTodo(text) {
    todos.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      text: text,
      completed: false,
    });
    saveTodos();
    render();
  }

  function toggleTodo(id) {
    const todo = todos.find(function (t) {
      return t.id === id;
    });
    if (todo) {
      todo.completed = !todo.completed;
      saveTodos();
      render();
    }
  }

  function deleteTodo(id) {
    todos = todos.filter(function (t) {
      return t.id !== id;
    });
    saveTodos();
    render();
  }

  function clearCompleted() {
    todos = todos.filter(function (t) {
      return !t.completed;
    });
    saveTodos();
    render();
  }

  function setFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.filter === filter);
    });
    render();
  }

  // --- Events ---
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (text) {
      addTodo(text);
      input.value = "";
      input.focus();
    }
  });

  clearBtn.addEventListener("click", clearCompleted);

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setFilter(btn.dataset.filter);
    });
  });

  // --- Init ---
  render();
})();
