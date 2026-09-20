// 自习室

const floorFilter = document.querySelector('#floor-filter');
const statusFilter = document.querySelector('#status-filter');
const roomCount = document.querySelector('#room-count');
const roomList = document.querySelector('#room-list');

let rooms = [
  {name: '一楼自习室', floor: 1, status: 'open'},
  {name: '二楼自习室', floor: 2, status: 'open'},
  {name: '三楼自习室', floor: 3, status: 'closed'},
  {name: '四楼自习室', floor: 4, status: 'open'},
  {name: '五楼自习室', floor: 5, status: 'closed'},
  {name: '六楼自习室', floor: 6, status: 'open'}
];

let currentFloor = 'all';
let currentStatus = 'all';

const render = () => {
    roomList.innerHTML = '';

    const shown = rooms.filter(r => {
    const floorMatch = currentFloor === 'all' ? true : r.floor === Number(currentFloor);
    const statusMatch = currentStatus === 'all' ? true : r.status === currentStatus;
    return floorMatch && statusMatch;
  });

  roomCount.textContent = `共 ${shown.length} 间`;

  if (shown.length === 0) {
    const li = document.createElement('li');
    li.textContent = '没有符合条件的自习室';
    roomList.appendChild(li);
    return;
  }

  shown.forEach(room => {
    const li = document.createElement('li');
    const statusText = room.status === 'open' ? '开放' : '关闭';
    const statusClass = room.status === 'open' ? 'open' : 'closed';
    li.innerHTML = `
      <span><strong>${room.name}</strong> (${room.floor}楼)</span>
      <span class="${statusClass}">${statusText}</span>
    `;
    roomList.appendChild(li);
  });
};

floorFilter.addEventListener('change', (e) => {
  currentFloor = e.target.value;
  render();
});

statusFilter.addEventListener('change', (e) => {
  currentStatus = e.target.value;
  render();
});

render();


// 统计图表

const state = { data: null };
let barChart = null;

    const renderBarChart = (data) => {
    if (barChart === null) {
        barChart = echarts.init(document.querySelector('#bar-chart'));
    }
    barChart.setOption({
        title: { text: '各自习室使用量', left: 'center' },
        tooltip: { trigger: 'axis' },
        legend: { bottom: 0 },
        xAxis: { data: data.months },
        yAxis: { name: '人次' },
        series: data.series.map(s => ({
            name: s.category,
            type: 'bar',
            data: s.counts
        }))
    });
};

const renderCards = (data) => {
    const months = data.months;
    data.series.forEach(s => {
        const total = s.counts.reduce((sum, n) => sum + n, 0);
        $('#cards').append(`
            <div>
                <div>
                    <div>
                        <h3 class="card-title h6">${s.category}</h3>
                        <p class="card-text fs-4">${total}</p>
                        <p class="card-text small text-muted">共${months.length}个月累计使用</p>
                    </div>
                </div>
            </div>
        `);
    });
};

const loadData = async () => {
    $('#status').text('加载中...').show();
    try {
        const response = await fetch('data/data.json');
        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }
        const data = await response.json();
        if (data.series.length === 0) {
            $('#status').text('暂无数据').show();
            return;
        }
        state.data = data;
        $('#sub-title').text(data.title + ' · 数据来源：自编测试数据集');
        $('#status').hide();
        renderCards(data);
        renderBarChart(data);
    } catch (error) {
        $('#status').text('加载失败：' + error.message).show();
    }
};

window.addEventListener('resize', () => {
    if (barChart) barChart.resize();
});

loadData();