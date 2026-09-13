const form = document.querySelector('#add-form');
const titleInput = document.querySelector('#title-input');
const directorInput = document.querySelector('#director-input');
const ratingInput = document.querySelector('#rating-input');
const tip = document.querySelector('#tip');
const list = document.querySelector('#movie-list');
const filters = document.querySelector('.filters');

let currentFilter = 'all';
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

const save = () => localStorage.setItem('tasks', JSON.stringify(tasks));

const render = () => { 
    list.innerHTML = '';
    const shown = tasks.filter(t => 
        currentFilter === 'all' ? true :
        currentFilter === 'active' ? !t.done : t.done
    );
    if (shown.length === 0) { 
        const li = document.createElement('li'); 
        li.textContent = '没有符合条件电影'; 
        list.appendChild(li); 
        return; 
    } 
    shown.forEach(task => { 
        const li = document.createElement('li'); 
        li.textContent = `《${task.title}》${task.director} ${task.rating}分`; 
        if (task.done) li.classList.add('done'); 
        li.addEventListener('click',() => {
            task.done = !task.done;
            save();
            render();
        });
        list.appendChild(li); 
    }); 
};

filters.addEventListener('click',(e) => {
    if (e.target.tagName !== 'BUTTON')
        return;
    currentFilter = e.target.dataset.filter;
    render();
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const director = directorInput.value.trim();
    const ratingStr = ratingInput.value.trim();
    if (title === '') { 
        tip.textContent = '片名不能为空';
        return;
    }
    if (director === '') { 
        tip.textContent = '导演+不能为空';
        return;
    }
    const rating = Number(ratingStr);
  if (Number.isNaN(rating) || rating < 0 || rating > 10) {
    tip.textContent = '评分必须是 0-10 之间的数字';
    return;
    }
    tasks.push({title,director,rating,done:false});
    tip.textContent = '';
    titleInput.value = '';
    directorInput.value = '';
    ratingInput.value = '';
    save();
    render(); 
});
render();