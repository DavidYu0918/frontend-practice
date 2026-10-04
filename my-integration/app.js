// 数据看板
const state = { data: null };
let barChart = null;
let lineChart = null;
let pieChart = null;

const renderPieChart = (data) => {
    if (pieChart === null) {
        pieChart = echarts.init(document.querySelector('#pie-chart'));
    }
    const pieData = data.series.map(s => ({
        name: s.category,
        value: s.counts.reduce((sum, n) => sum + n, 0)
    }));
    pieChart.setOption({
        title: { text: '各类型累计占比', left: 'center' },
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        legend: { bottom: 0 },
        series: [{
            name: '累计占比',
            type: 'pie',
            radius: '55%',
            data: pieData,
            label: { show: true, formatter: '{b}: {d}%' }
        }]
    });
};

const renderLineChart = (data) => {
    const ctx = document.querySelector('#line-chart');
    if (lineChart !== null) {
        lineChart.destroy();
        lineChart = null;
    }
    lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.months,
            datasets: data.series.map(s => ({
                label: s.category,
                data: s.counts,
                borderWidth: 2,
                tension: 0.3
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: '各类型的产量变化（单位：件）' }
            }
        }
    });
};

const renderBarChart = (data) => {
    if (barChart === null) {
        barChart = echarts.init(document.querySelector('#bar-chart'));
    }
    barChart.setOption({
        title: { text: '各类型的重量对比', left: 'center' },
        tooltip: { trigger: 'axis' },
        legend: { bottom: 0 },
        grid: { bottom: 60 },
        xAxis: { data: data.months },
        yAxis: { name: 'kg' },
        series: data.series.map(s => ({
            name: s.category,
            type: 'bar',
            data: s.counts
        }))
    });
};

const showStatus = (text) => { $('#status').text(text).show(); };
const hideStatus = () => { $('#status').hide(); };

const loadData = async () => {
    showStatus('加载中...');
    try {
        const response = await fetch('data/weapons.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const data = await response.json();

        if (!data.series || data.series.length === 0) {
            showStatus('暂无数据');
            return;
        }
        state.data = data;
        $('#sub-title').text(data.title + ' · 数据来源：' + data.source);
        hideStatus();
        renderCards(data);
        renderBarChart(data);
        renderLineChart(data);
        renderPieChart(data);
    } catch (error) {
        console.error('进入 catch:', error);
        showStatus('加载失败：' + error.message);
    }
};

const renderCards = (data) => {
    const $cards = $('#cards').empty();
    data.series.forEach(s => {
        const total = s.counts.reduce((sum, n) => sum + n, 0);
        $cards.append(`
            <div class="col-md-4 col-lg-2">
                <div class="card h-100" data-category="${s.category}">
                    <div class="card-body">
                        <h3 class="card-title h6">${s.category}</h3>
                        <p class="card-text fs-4">${total}</p>
                        <p class="card-text small text-muted">累计生产数量</p>
                    </div>
                </div>
            </div>
        `);
    });
};

$('#cards').on('click', '.card', function () {
    $(this).toggleClass('card-active');
});

window.addEventListener('resize', () => {
    if (barChart) barChart.resize();
    if (pieChart) pieChart.resize();
    if (lineChart) lineChart.resize();
});

loadData();

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