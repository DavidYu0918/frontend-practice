const form = document.querySelector('#add-form');
const input = document.querySelector('#task-input');
const tip = document.querySelector('#tip');
const list = document.querySelector('#task-list');
const filters = document.querySelector('.filters');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let currentFilter = 'all';

//save()本地储存
const save = () => localStorage.setItem('tasks',JSON.stringify(tasks));

//render()函数作用，重新渲染
const render = () => {
    list.innerHTML = '';
    const shown = tasks.filter(t => 
        currentFilter === 'all' ? true : 
        currentFilter === 'active' ? !t.done : t.done
    );
    if (shown.length === 0) {
        const li = document.createElement('li');
        li.textContent = '没有符合条件任务';
        list.appendChild(li);
        return;
    }
    shown.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;
        if (task.done) li.classList.add ('done');
        li.addEventListener('click',() => {
            task.done = !task.done;
            save();
            render();
        });
        list.appendChild(li);
    });
};

form.addEventListener('submit',(e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text === '') {
        tip.textContent = '任务名不能为空';
        return;
    }
    tasks.push({text:text,done:false});
    tip.textContent = '';
    input.value = '';
    save();
    render();
});

filters.addEventListener('click',(e) => {
    if (e.target.tagName !== 'BUTTON') return;
    currentFilter = e.target.dataset.filter;
    render();
});

render();