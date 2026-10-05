document.addEventListener("DOMContentLoaded", async () => {

    showAlert("数据加载中...", "info");

    try {
        const response = await fetch("data/studyrooms.json");

        if (!response.ok) {
        throw new Error("HTTP " + response.status);
        }

        const data = await response.json();

        hideAlert();

        const rooms = data.rooms;
        if (!rooms || rooms.length === 0) {
            showAlert("暂无自习室数据","warning");
            return;
        }
        const total = rooms.length;
        let openCount = 0;
        let todayTotal = 0;

        rooms.forEach(room => {
        if (room.status === "开放") {
            openCount++;
        }
        todayTotal += room.todayVisitors;
        });

        document.querySelector("#statTotalRooms").textContent = total;
        document.querySelector("#statOpenRooms").textContent = openCount;
        document.querySelector("#statTodayVisitors").textContent = todayTotal;

    } catch (error) {
        showAlert("数据加载失败：" + error.message);
    }
});