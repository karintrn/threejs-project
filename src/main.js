import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { defaultTransition } from './cameraPosition.js';
import { resetTransition } from './cameraPosition.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { toggleNightMode } from './nightMode.js';
//                 //
// loading manager //
//                 //
const loadingManager = new THREE.LoadingManager();

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  const percent = Math.floor((itemsLoaded / itemsTotal) * 100);
  const progressElement = document.getElementById('progress');
  if (progressElement) progressElement.innerText = "Loading... \n" + percent + '%';
};

loadingManager.onLoad = () => { 
  document.getElementById('progress').style.display = 'none';
  document.getElementById('startButton').style.display = 'block';
  console.log('Loading complete!');
  
  onclick = () => {
    const startButton = document.getElementById('startButton');
    if (startButton) {
      document.getElementById('loadingScreen').style.display = 'none';
    }}
};


//                         //
// scene, camera, renderer //
//                         //
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xC8D9C4);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
   canvas: document.querySelector('#bg')
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// sphere //
const glowMaterial = new THREE.MeshStandardMaterial({
  color: 0xffd2a1,
  emissive: 0xffa95c,
  emissiveIntensity: 1.5,
  roughness: 0.3,
  metalness: 0.0
});

const sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry(2, 50, 50),
    new THREE.MeshPhysicalMaterial({ 
      roughness: 0,
      metalness: 0,
      transmission: 1,
      ior: 2.33
    })
);
sphere1.position.set(-8, 12, -2);
scene.add(sphere1);

const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(2, 50, 50),
    glowMaterial
);
sphere2.position.set(0, 15, -8);
scene.add(sphere2);

const sphere3 = new THREE.Mesh(
    new THREE.SphereGeometry(2, 50, 50),
    new THREE.MeshPhysicalMaterial({ 
      roughness: 0,
      metalness: 0,
      transmission: 1,
      ior: 2.33
    })
);
sphere3.position.set(6, 6, -8);
scene.add(sphere3);

const sphere4 = new THREE.Mesh(
  new THREE.SphereGeometry(2, 50, 50),
  glowMaterial
);

sphere4.position.set(-8, 7, 4);
scene.add(sphere4);



//        //
// lights //
//        //

const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xaaaaaa, 2.5  );
hemiLight.position.set( 0, 500, 0 );
scene.add( hemiLight );


const sunLight = new THREE.DirectionalLight(0xffffff, 4); // weiße Sonne
sunLight.position.set(-100, 100, 40); // Richtung Sonne
sunLight.castShadow = true;
// soft shadows
sunLight.shadow.mapSize.width = 4096;
sunLight.shadow.mapSize.height = 4096;
sunLight.shadow.camera.left = -50;
sunLight.shadow.camera.right = 50;
sunLight.shadow.camera.top = 50;
sunLight.shadow.camera.bottom = -50;
sunLight.shadow.camera.near = 1;
sunLight.shadow.camera.far = 280;

scene.add(sunLight);

const moonLight = new THREE.DirectionalLight(0x8aa0ff, 0);
moonLight.position.set(100, 100, -40);
moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 4096;
moonLight.shadow.mapSize.height = 4096;
moonLight.shadow.camera.left = -50;
moonLight.shadow.camera.right = 50;
moonLight.shadow.camera.top = 50;
moonLight.shadow.camera.bottom = -50;
moonLight.shadow.camera.near = 1;
moonLight.shadow.camera.far = 280;
scene.add(moonLight);

//const moonHelper = new THREE.DirectionalLightHelper( moonLight, 10 );
//scene.add( moonHelper );


//         //
// helpers //
//         //
//const dirHelper = new THREE.DirectionalLightHelper( sunLight, 10 );
//scene.add( dirHelper );

//const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(gridHelper);

// orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.maxDistance = 35; // nicht weiter weg


// 3D Model Loader
//const loader = new GLTFLoader();
const loader = new GLTFLoader(loadingManager);

const startButton = document.getElementById('startButton');

startButton.addEventListener('click', () => {
  startButton.style.display = 'none';

  resetTransition(2, camera, controls);

  controls.enabled = true;
});


loader.load('/models/isometric-room-plane.glb', (gltf) => {
  const room = gltf.scene;

  room.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  room.position.set(0, 0, 0);
  camera.position.set(-10, 5, 35);

  scene.add(room);
});


// CSS3DRenderer erstellen
const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.top = '0';
document.body.appendChild(cssRenderer.domElement);

//        //
// SCREEN //
//        //
// Screen Material
const screenMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000 // Screen off (black)
});

// Monitor Screen
const monitorScreen = new THREE.Mesh(
    new THREE.BoxGeometry(2.01, 1.135, 0.005), // width, height, depth
    screenMaterial
);

// Monitor Screen position
monitorScreen.position.set(-1.49, 4.26, -3.42); // mesh position
monitorScreen.rotation.x = THREE.MathUtils.degToRad(-8);

scene.add(monitorScreen);

//        //
// HITBOX //
//        //
let mode = "room";
let isAnimating = false;

// Monitor Hitbox
const monitorHitbox = new THREE.Mesh(
    new THREE.BoxGeometry(2.05, 1.16, 0.01), // width, height, depth
    new THREE.MeshBasicMaterial({ visible: false })
);

// Monitor Hitbox position
monitorHitbox.position.set(-1.48, 4.28, -3.43); // mesh position
monitorHitbox.rotation.x = THREE.MathUtils.degToRad(-8);
scene.add(monitorHitbox);

////////////////////////

// About Hitbox
const aboutHitbox = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.08, 0.01), // width, height, depth
    new THREE.MeshBasicMaterial({ visible: false })
    //new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 })
);

// About Hitbox position
aboutHitbox.position.set(-2.18, 4.693, -3.47); // mesh position
aboutHitbox.rotation.x = THREE.MathUtils.degToRad(-8);
scene.add(aboutHitbox);

// Projects Hitbox
const projectsHitbox = new THREE.Mesh(
    new THREE.BoxGeometry(0.20, 0.08, 0.01), // width, height, depth
    new THREE.MeshBasicMaterial({ visible: false })
    //new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 })
);

// Projects Hitbox position
projectsHitbox.position.set(-1.79, 4.693, -3.47); // mesh position
projectsHitbox.rotation.x = THREE.MathUtils.degToRad(-8);
scene.add(projectsHitbox);

// Back Hitbox
const backHitbox = new THREE.Mesh(
    new THREE.BoxGeometry(0.10, 0.12, 0.01), // width, height, depth
    new THREE.MeshBasicMaterial({ visible: false })
    //new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.5 })
);

// Back Hitbox position
backHitbox.position.set(-2.38, 4.7, -3.48); // mesh position
backHitbox.rotation.x = THREE.MathUtils.degToRad(-8);
scene.add(backHitbox);

// Back to room Hitbox
const backRoomHitbox = new THREE.Mesh(
    new THREE.BoxGeometry(0.23, 0.11, 0.01), // width, height, depth
    new THREE.MeshBasicMaterial({ visible: false })
    //new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 })
);

// Back to room Hitbox position
backRoomHitbox.position.set(-2.22, 3.9, -3.36); // mesh position
backRoomHitbox.rotation.x = THREE.MathUtils.degToRad(-8);
scene.add(backRoomHitbox);

///////////////////////

//                                   //
// Texture Loader for Monitor Screen //
//                                   //
const textureLoader = new THREE.TextureLoader();
const screenTextures = {
  home: textureLoader.load('/textures/home.png'),
  about: textureLoader.load('/textures/about.png'),
  projects: textureLoader.load('/textures/projects.png')
};

//                    //
// Click-Event HITBOX //
//                    //
document.addEventListener('click', (event) => {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  if (mode === "room") {
    const intersectsMonitor = raycaster.intersectObject(monitorHitbox, true);

    if (intersectsMonitor.length > 0) {
        console.log("Hitbox clicked!");

        isAnimating = true;
        controls.enabled = false;

        defaultTransition(2, camera, controls);

        // Turn on screen
        screenMaterial.map = screenTextures.home;
        screenMaterial.color = new THREE.Color(0xFFFFFF);
        screenMaterial.needsUpdate = true;
        mode = "screen";
        isAnimating = false;
    }
    
  } else if (mode === "screen") {
    const intersectsAbout = raycaster.intersectObject(aboutHitbox, true);
    const intersectsProjects = raycaster.intersectObject(projectsHitbox, true);
    const intersectsBackToRoom = raycaster.intersectObject(backRoomHitbox, true);

    if (intersectsAbout.length > 0) {
        console.log("About Page Hitbox clicked!");
        // Change screen texture to page 2
        screenMaterial.map = screenTextures.about;
        screenMaterial.needsUpdate = true;
        mode = "about";
    }

    if (intersectsProjects.length > 0) {
        console.log("Projects Page Hitbox clicked!");
        // Change screen texture to page 3
        screenMaterial.map = screenTextures.projects;
        screenMaterial.needsUpdate = true;
        mode = "projects";
    }

    if (intersectsBackToRoom.length > 0) {
      console.log("Back to Room Hitbox clicked!");
      isAnimating = true;

      resetTransition(2, camera, controls);

      // Turn off screen
      screenMaterial.map = null;
      screenMaterial.color = new THREE.Color(0x000000);
      screenMaterial.needsUpdate = true;
      mode = "room";
      isAnimating = false;
      controls.enabled = true;

    }

  } else if (mode === "about" || mode === "projects") {
    const intersectsBack = raycaster.intersectObject(backHitbox, true);
    const intersectsAbout = raycaster.intersectObject(aboutHitbox, true);
    const intersectsProjects = raycaster.intersectObject(projectsHitbox, true);

    if (intersectsBack.length > 0) {
        console.log("Back Button Hitbox clicked!");
        // Change screen texture back to home
        screenMaterial.map = screenTextures.home;
        screenMaterial.needsUpdate = true;
        mode = "screen";
    }

    if (intersectsAbout.length > 0) {
        console.log("About Page Hitbox clicked!");
        // Change screen texture to page 2
        screenMaterial.map = screenTextures.about;
        screenMaterial.needsUpdate = true;
        mode = "about";
    }

    if (intersectsProjects.length > 0) {
        console.log("Projects Page Hitbox clicked!");
        // Change screen texture to page 3
        screenMaterial.map = screenTextures.projects;
        screenMaterial.needsUpdate = true;
        mode = "projects";
    }
  } else {
    console.log("Unknown mode:", mode);
  }
});

// Render the scene
function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);

  cssRenderer.render(scene, camera);
}

animate();

window.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');

  themeToggle.addEventListener('click', () => {
    const isNight = toggleNightMode({
      scene,
      sunLight,
      hemiLight,
      moonLight,
      screenMaterial,
      renderer,
      mode
    });

    themeToggle.textContent = isNight ? '🌙' : '☀️';
  });
});