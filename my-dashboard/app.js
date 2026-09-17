const state = { data: null };

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
        // renderCards(data);
        // renderBarChart(data);
        // renderLineChart(data);
        // renderPieChart(data);
    } catch(error) {
        console.error('进入 catch：', error);
        showStatus('加载失败：' + error.message);
    }
};

const renderCards = (data) => {
    const $cards = $('#cards').empty();
    data.series.forEach(s => {
        const total = s.count.reduce((sum,n) => sum + n, 0);
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

loadData();