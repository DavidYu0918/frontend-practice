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
        title: { text: '各学院总参与量占比', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { bottom: 0 },
        series:[{
            name: '参与占比',
            type: 'pie',
            radius: '55%',
            data: pieData,
            label: { show: true, formatter: '{b}: {d}%' }
        }]
    });
};

const renderLineChart = (data) => {
    if (lineChart !== null) {
        lineChart.destory();
    }
    const ctx = document.querySelector('#line-chart');
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
                title: {display:true,text:'活动参与趋势（单位：人次）'}
            }
        }
    });
};

const renderBarChart = (data) => {
    if (barChart === null) {
        barChart = echarts.init(document.querySelector('#bar-chart'));
    }
    barChart.setOption({
        title:{text:'各学院各月活动参与量',left:'center'},
        tooltip: { trigger: 'axis' },
        legend: { bottom: 0 },
        grid: {bottom:60},
        xAxis:{data:data.months},
        yAxis:{name:'人次'},
        series:data.series.map(s => ({
            name:s.category,
            type:'bar',
            data:s.counts
        }))
    });
};

const showStatus = (text) => {
    $('#status').text(text).show(); 
};
const hideStatus = () => {
    $('#status').hide();
};

const loadData = async () => {
    showStatus('加载中...');
    // await new Promise(r => setTimeout(r, 5000))
    try {
        const response = await fetch('data/campus.json', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }
        const data = await response.json();

        if (data.series.length === 0) {
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
    } catch(error) {
        console.error('进入 catch:', error);
        showStatus('加载失败：' + error.message);
    }
};

const renderCards = (data) => {
    const $cards = $('#cards').empty();
    data.series.forEach(s => {
        const total = s.counts.reduce((sum,n) => sum + n, 0);
        $cards.append(`
            <div class="col-md-4 col-lg-2">
                <div class="card h-100" data-category="${s.category}">
                    <div class="card-body">
                        <h3 class="card-title h6">${s.category}</h3>
                        <p class="card-text fs-4">${total}</p>
                        <p class="card-text small text-muted">累计参与人次</p>
                    </div>
                </div>
            </div>
        `);
    });
};

$('#cards').on('click', '.card', function () {
    $(this).toggleClass('card-active');
});

window.addEventListener('resize',() => {
    if (barChart) barChart.resize();
    if (pieChart) pieChart.resize();
});

loadData();