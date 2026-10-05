let allRooms = [];

document.addEventListener("DOMContentLoaded", async () => {
    showAlert("数据加载中...", "info");

    try {
        const response = await fetch("data/studyrooms.json");
        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }
        const data = await response.json();
        hideAlert();

        if (!data.rooms || data.rooms.length === 0) {
            showAlert("暂无自习室数据","warning");
            document.querySelector("#roomTableBody").innerHTML = 
            '<tr><td colspan="4" class="text-center text-muted">暂无数据</td></tr>';
            return;
        }

        allRooms = data.rooms;

        const floorFilter = document.querySelector("#filterFloor");
        for (let f = 1; f <= 6; f++) {
            const option = document.createElement("option");
            option.value = f;
            option.textContent = f + " 楼";
            floorFilter.appendChild(option);
        }

        renderTable(allRooms);

        document.querySelector("#filterFloor").addEventListener("change", applyFilter);
        document.querySelector("#filterStatus").addEventListener("change", applyFilter);
        document.querySelector("#searchName").addEventListener("input", applyFilter);

    } catch (error) {
        showAlert("数据加载失败：" + error.message);
    }
});

function applyFilter() {
    const floorVal = document.querySelector("#filterFloor").value;
    const statusVal = document.querySelector("#filterStatus").value;
    const keyword = document.querySelector("#searchName").value.trim();

    const result = allRooms.filter(room => {
        if (floorVal !== "" && String(room.floor) !== floorVal) return false;
        if (statusVal !== "" && room.status !== statusVal) return false;
        if (keyword !== "" && room.name.indexOf(keyword) === -1) return false;
        return true;
    });

    renderTable(result);
}

function renderTable(rooms) {
    const tbody = document.querySelector("#roomTableBody");
    const empty = document.querySelector("#emptyState");

    tbody.innerHTML = "";

    if (rooms.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">无数据</td></tr>';
        empty.classList.remove("d-none");
        return;
    }

    empty.classList.add("d-none");

    rooms.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${r.name}</td>
        <td>${r.floor} 楼</td>
        <td>${r.status}</td>
        <td>${r.openTime}</td>
        `;
        tbody.appendChild(tr);
    });
}