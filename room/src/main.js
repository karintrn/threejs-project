import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
   canvas: document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 5, 50);

// Create an object
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
//const material1 = new THREE.MeshBasicMaterial({ color: 0xFF6347, wireframe: true }); // Requires no light
const material2 = new THREE.MeshStandardMaterial({ color: 0xff6347 }); // ein helles Orange
const torus = new THREE.Mesh(geometry, material2); // create a mesh by combining geometry and material

// scene.add(torus); // add the torus to the scene

// lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);

directionalLight.position.set(80, 80, 80);
scene.add(directionalLight);

// ceiling light
const ceilingLight = new THREE.PointLight(0xffffff, 30, 500); // Intensität, Reichweite
ceilingLight.position.set(1, 8, 0);// mitten in der Decke
scene.add(ceilingLight);


////////////////////////////////////////////////////////////////

// SpotLight (gerichtetes Licht)
const spotLight = new THREE.SpotLight(0xffffff, 1.5); // Farbe, Intensität
spotLight.position.set(0, 8, 5); // Position oben an der Decke
spotLight.angle = Math.PI / 8;   // Öffnungswinkel (kleiner = enger Strahl)
spotLight.penumbra = 0.3;        // weicher Rand
spotLight.decay = 2;             // Lichtabfall mit Distanz
spotLight.distance = 20;         // Reichweite

// Das Licht soll auf ein Ziel zeigen
spotLight.target.position.set(0, -4, 0);
scene.add(spotLight);
scene.add(spotLight.target);

// Optional: Sichtbarer Helfer
const spotHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotHelper);


////////////////////////////////////////////////////////////////
// helpers
const lightHelper = new THREE.PointLightHelper(ceilingLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper); // for spotlight
scene.add(gridHelper);

// orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// 3D Model Loader
const loader = new GLTFLoader();

loader.load('/models/isometric-room1.glb', (gltf) => {
  const gallery = gltf.scene;

  // Hier die Größe des Modells anpassen
  //gallery.scale.set(2, 2, 2);

  gallery.position.set(0, 0, 0);

  camera.position.set(0, 10, 40);

  scene.add(gallery);
});




// Render the scene
function animate() {
  requestAnimationFrame(animate);

  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.01;
  // torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();