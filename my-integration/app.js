// 清单
const form = document.querySelector('#add-form');
const nameInput = document.querySelector('#name-input');
const typeInput = document.querySelector('#type-input');
const weightInput = document.querySelector('#weight-input');
const tip = document.querySelector('#tip');
const list = document.querySelector('#weapon-list');
const filters = document.querySelector('.filters');

let currentFilter = 'all';
let weapons = JSON.parse(localStorage.getItem('weapons') || '[]');

const save = () => localStorage.setItem('weapons', JSON.stringify(weapons));

const render = () => {
    list.innerHTML = '';
    const shown = weapons.filter(w =>
        currentFilter === 'all' ? true :
        currentFilter === 'active' ? !w.done : w.done
    );
    if (shown.length === 0) {
        const li = document.createElement('li');
        li.className = 'list-group-item text-muted';
        li.textContent = '没有符合条件的冷兵器';
        list.appendChild(li);
        return;
    }
    shown.forEach(weapon => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${weapon.name}（${weapon.type}） ${weapon.weight}kg`;
        if (weapon.done) li.classList.add('done');
        li.addEventListener('click', () => {
            weapon.done = !weapon.done;
            save();
            render();
        });
        list.appendChild(li);
    });
};

filters.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return;
    currentFilter = e.target.dataset.filter;
    render();
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const type = typeInput.value.trim();
    const weightStr = weightInput.value.trim();

    if (name === '') { tip.textContent = '兵器名称不能为空'; return; }
    if (type === '') { tip.textContent = '类型不能为空'; return; }

    const weight = Number(weightStr);
    if (Number.isNaN(weight) || weight <= 0 || weight > 100) {
        tip.textContent = '重量必须是 0-100 kg 之间的数字';
        return;
    }

    weapons.push({ name, type, weight, done: false });
    tip.textContent = '';
    nameInput.value = '';
    typeInput.value = '';
    weightInput.value = '';
    save();
    render();
});

render();