const form = document.querySelector('#add-form');
const titleInput = document.querySelector('#title-input');
const directorInput = document.querySelector('#director-input');
const ratingInput = document.querySelector('#rating-input');
const tip = document.querySelector('#tip');
const list = document.querySelector('#movie-list');

let tasks = [];

const render = () => { 
    list.innerHTML = ''; 
    if (tasks.length === 0) { 
        const li = document.createElement('li'); 
        li.textContent = '没有电影'; 
        list.appendChild(li); 
        return; 
    } 
    tasks.forEach(task => { 
        const li = document.createElement('li'); 
        li.textContent = `《${task.title}》${task.director}  ${task.rating}分`; 
        if (task.done) li.classList.add('done'); 
        list.appendChild(li); 
    }); 
}; 

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
    render(); 
});
render();