import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
//import { getFirstIntersectedObject } from './raycaster.js';

// scene, camera, renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xC8D9C4);
let monitor;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
   canvas: document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.set(0, 5, 50);

// lights

// ceiling light !DONT DELETE!
const sunlight = new THREE.PointLight(0xffffff, 400, 1000); // Intensity, Range
sunlight.position.set(-8, 6, 3); //(0,5,0) in the center of the room
scene.add(sunlight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);

directionalLight.position.set(80, 80, 80);
scene.add(ambientLight, directionalLight);

// helpers
const lightHelper = new THREE.PointLightHelper(sunlight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper); // for spotlight
scene.add(gridHelper);

// orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// 3D Model Loader
const loader = new GLTFLoader();

loader.load('/models/isometric-room-model.glb', (gltf) => {
  const room = gltf.scene;

  room.position.set(0, 0, 0);

  camera.position.set(0, 10, 40);

  scene.add(room);
});

// TODO; Add clickable mesh for monitor --> opens a website
//        //
// HITBOX //
//        //
const monitorHitbox = new THREE.Mesh(
    new THREE.BoxGeometry(2.05, 1.16, 0.01), // width, height, depth
    new THREE.MeshBasicMaterial({ visible: true, color: 0x00ff00 })
);

// Hitbox position
monitorHitbox.position.set(-1.48, 4.28, -3.42); // mesh position
monitorHitbox.rotation.x = THREE.MathUtils.degToRad(-8);
scene.add(monitorHitbox);

// Click-Event on Hitbox
document.addEventListener('click', (event) => {
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(monitorHitbox, true);

    if (intersects.length > 0) {
        console.log("Hitbox clicked!");
        //moveCameraToHitbox(monitorHitbox);
    }
});

// Render the scene
function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}

animate();