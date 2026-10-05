document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector("#threeContainer");
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
    camera.position.set(0, 1.7, 12);
    camera.lookAt(0, 1.7, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    const groundGeo = new THREE.BoxGeometry(40, 0.2, 40);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0xa8d8ff });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.1;
    scene.add(ground);

    const seatGeo = new THREE.BoxGeometry(0.7, 0.5, 0.7);
    const cols = 10;
    const rows = 10;
    const gap = 1.2;
    const startX = -(cols - 1) * gap / 2;
    const startZ = -(rows - 1) * gap / 2;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const isFree = Math.random() < 0.7;
            const color = isFree ? 0x28a745 : 0xdc3545;

            const seatMat = new THREE.MeshLambertMaterial({ color: color });
            const seat = new THREE.Mesh(seatGeo, seatMat);
            seat.position.set(
                startX + j * gap,
                0.25,
                startZ + i * gap
            );
            scene.add(seat);
        }
    }

    let yaw = 0;
    let isLocked = false;
    renderer.domElement.addEventListener("click", () => {
        renderer.domElement.requestPointerLock();
    });

    document.addEventListener("pointerlockchange", () => {
        isLocked = (document.pointerLockElement === renderer.domElement);
    });

    document.addEventListener("mousemove", (e) => {
        if (!isLocked) return;
        yaw   += e.movementX * 0.002;
    });

    const keys = { w: false, a: false, s: false, d: false };
    document.addEventListener("keydown", (e) => {
        const k = e.key.toLowerCase();
        if (k in keys) keys[k] = true;
    });
    document.addEventListener("keyup", (e) => {
        const k = e.key.toLowerCase();
        if (k in keys) keys[k] = false;
    });
    const speed = 0.1;

    function animate() {
        requestAnimationFrame(animate);
        const dir = new THREE.Vector3(Math.sin(yaw) , 0 , -Math.cos(yaw));
        camera.lookAt(camera.position.clone().add(dir));
        const forward = new THREE.Vector3(Math.sin(yaw), 0, -Math.cos(yaw));
        const right   = new THREE.Vector3(Math.cos(yaw), 0,  Math.sin(yaw));
        if (keys.w) camera.position.add(forward.clone().multiplyScalar( speed));
        if (keys.s) camera.position.add(forward.clone().multiplyScalar(-speed));
        if (keys.a) camera.position.add(right.clone().multiplyScalar(-speed));
        if (keys.d) camera.position.add(right.clone().multiplyScalar( speed));
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
});