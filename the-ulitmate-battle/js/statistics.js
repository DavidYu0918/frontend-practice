let barChart = null;
let lineChart = null;

document.addEventListener("DOMContentLoaded", async () => {
    showAlert("数据加载中...", "info");

    try {
        const response = await fetch("data/studyrooms.json");
        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }
        const data = await response.json();
        hideAlert();

        const hasRooms = data.rooms && data.rooms.length > 0;
        const hasWeekly = data.weeklyVisitors && data.weeklyVisitors.length > 0;

        if (!hasRooms && !hasWeekly) {
            showAlert("暂无统计数据", "warning");
        return;
        }

        // 两个图表 + 三维（各自再判断一次）
        if (hasRooms) {
            drawBarChart(data.rooms);
        }
        if (hasWeekly) {
            drawLineChart(data.weeklyVisitors);
        }

        // drawBarChart(data.rooms);
        // drawLineChart(data.weeklyVisitors);
        initThree();

    } catch (error) {
        showAlert("数据加载失败：" + error.message);
    }
});

function drawBarChart(rooms) {
    const dom = document.querySelector("#barChart");
    barChart = echarts.init(dom);

    const floors = [];
    const visitors = [];

    rooms.forEach(r => {
        floors.push(r.floor + " 楼");
        visitors.push(r.todayVisitors);
    });

    barChart.setOption({
        title: {
        text: "各楼层今日人次",
        left: "center",
        textStyle: { fontSize: 14 }
        },
        tooltip: { trigger: "axis" },
        xAxis: {
        type: "category",
        data: floors
        },
        yAxis: {
        type: "value",
        name: "人次"
        },
        series: [
        {
            name: "今日人次",
            type: "bar",
            data: visitors,
            itemStyle: { color: "#0d6efd" }
        }
        ]
    });
}

function drawLineChart(weekly) {
    const dom = document.querySelector("#lineChart");
    lineChart = echarts.init(dom);

    const days = [];
    const counts = [];

    weekly.forEach(w => {
        days.push(w.day);
        counts.push(w.count);
    });

    lineChart.setOption({
        title: {
        text: "一周使用人数趋势",
        left: "center",
        textStyle: { fontSize: 14 }
        },
        tooltip: { trigger: "axis" },
        xAxis: {
        type: "category",
        data: days
        },
        yAxis: {
        type: "value",
        name: "人次"
        },
        series: [
        {
            name: "使用人数",
            type: "line",
            data: counts,
            smooth: true,
            itemStyle: { color: "#198754" }
        }
        ]
    });
}