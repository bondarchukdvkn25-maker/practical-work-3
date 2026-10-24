document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('task-form');
  const titleInput = document.getElementById('task-title');
  const categoryInput = document.getElementById('task-category');
  const deadlineInput = document.getElementById('task-deadline');
  const tasksList = document.getElementById('tasks-list');
  const totalCount = document.getElementById('total-count');
  const pendingCount = document.getElementById('pending-count');
  const completedCount = document.getElementById('completed-count');

  let tasks = JSON.parse(localStorage.getItem('taskpulse_tasks')) || [
    { id: 1, title: 'Практична робота 1: Створення бази знань у Notion', category: 'Бази знань', deadline: '2026-10-20', completed: true },
    { id: 2, title: 'Практична робота 2: Локальний репозиторій Git', category: 'Git & GitHub', deadline: '2026-10-24', completed: true },
    { id: 3, title: 'Практична робота 3: Оформлення README та документації', category: 'Git & GitHub', deadline: '2026-10-26', completed: false }
  ];

  function saveAndRender() {
    localStorage.setItem('taskpulse_tasks', JSON.stringify(tasks));
    render();
  }

  function render() {
    tasksList.innerHTML = '';
    let completed = 0;

    tasks.forEach(task => {
      if (task.completed) completed++;

      const div = document.createElement('div');
      div.className = `task-card ${task.completed ? 'completed' : ''}`;
      div.innerHTML = `
        <div class="task-left">
          <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
          <div>
            <div class="task-title"><strong>${escapeHtml(task.title)}</strong></div>
            <div class="task-meta">
              <span>🏷️ ${task.category}</span>
              <span>📅 ${task.deadline}</span>
            </div>
          </div>
        </div>
        <button class="btn btn-delete" data-delete-id="${task.id}" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:16px;">🗑️</button>
      `;
      tasksList.appendChild(div);
    });

    totalCount.textContent = tasks.length;
    completedCount.textContent = completed;
    pendingCount.textContent = tasks.length - completed;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = {
      id: Date.now(),
      title: titleInput.value.trim(),
      category: categoryInput.value,
      deadline: deadlineInput.value,
      completed: false
    };
    tasks.push(newTask);
    titleInput.value = '';
    deadlineInput.value = '';
    saveAndRender();
  });

  tasksList.addEventListener('change', (e) => {
    if (e.target.matches('input[type="checkbox"]')) {
      const id = Number(e.target.dataset.id);
      const task = tasks.find(t => t.id === id);
      if (task) {
        task.completed = e.target.checked;
        saveAndRender();
      }
    }
  });

  tasksList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-delete-id]');
    if (btn) {
      const id = Number(btn.dataset.deleteId);
      tasks = tasks.filter(t => t.id !== id);
      saveAndRender();
    }
  });

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  render();
});
