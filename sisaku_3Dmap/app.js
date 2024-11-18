// チェックポイントに移動する関数
function goToNextCheckpoint(nextCheckpoint) {
    const currentCheckpoint = document.querySelector('.checkpoint:not([style*="display: none"])');
    currentCheckpoint.style.display = 'none';

    const nextCheckpointElement = document.getElementById(`checkpoint-${nextCheckpoint}`);
    if (nextCheckpointElement) {
        nextCheckpointElement.style.display = 'block';
        moveCameraToCheckpoint(nextCheckpoint); // カメラを次のチェックポイントのフロアに移動
    } else {
        alert('目的地に到着しました！');
    }
}

// Three.jsで3Dマップを作成
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(300, 300);
document.getElementById('map').appendChild(renderer.domElement);

// 建物の各フロア（7階建て）を表現
const floors = [];
const floorHeight = 1.5; // 各フロアの高さ
for (let i = 0; i < 7; i++) {
    const geometry = new THREE.BoxGeometry(10, 0.1, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x007bff, opacity: 0.6, transparent: true });
    const floor = new THREE.Mesh(geometry, material);
    floor.position.y = i * floorHeight;
    floors.push(floor);
    scene.add(floor);
}

// ユーザーの位置を示す赤い立方体
const userCube = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(userCube);

// カメラの初期位置
camera.position.z = 15;
camera.position.y = floorHeight * 3; // 初期は3階に表示

// アニメーションループ
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// フロアに応じてカメラを移動し、色を変更
function moveCameraToCheckpoint(checkpoint) {
    let targetY;

    switch (checkpoint) {
        case checkpoint-1:
            targetY = floorHeight * 3; // 3階
            break;
        case checkpoint-2:
        case checkpoint-3:
            targetY = floorHeight * 2; // 2階
            break;
        case checkpoint-4:
            targetY = floorHeight * 1; // 1階
            break;
        default:
            targetY = 0;
            break;
    }

    // カメラのy座標を滑らかに移動
    new TWEEN.Tween(camera.position)
        .to({ y: targetY }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    // ユーザーの位置も移動
    new TWEEN.Tween(userCube.position)
        .to({ y: targetY }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    // 現在のフロアを黄色に変更
    floors.forEach((floor, index) => {
        if (index === Math.round(targetY / floorHeight)) {
            floor.material.color.set(0xffff00); // 黄色
        } else {
            floor.material.color.set(0x007bff); // 通常色
        }
    });
}

// TWEEN.jsの更新ループ
function update() {
    requestAnimationFrame(update);
    TWEEN.update();
}
update();
