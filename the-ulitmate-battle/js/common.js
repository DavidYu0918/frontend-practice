function showAlert(message, type) {
    type = type || "danger";
    const alert = document.querySelector("#globalAlert");
    if (!alert) return;

    alert.classList.remove("alert-danger", "alert-info", "alert-warning");
    alert.classList.add("alert-" + type);

    alert.textContent = message;
    alert.classList.remove("d-none");
}

function hideAlert() {
    const alert = document.querySelector("#globalAlert");
    if (!alert) return;
    alert.classList.add("d-none");
    alert.textContent = "";
}