import * as THREE from 'three';

let isNight = false;

export function toggleNightMode({
  scene,
  sunLight,
  hemiLight,
  moonLight,
  screenMaterial,
  renderer,
  mode
}) {
    isNight = !isNight;
    document.body.classList.toggle('night', isNight);

    if (isNight) {
        scene.background = new THREE.Color(0x06080f);

        sunLight.intensity = 0;
        hemiLight.intensity = 0.4;
        moonLight.intensity = 1.4;

        renderer.toneMappingExposure = 0.8;

        if (mode != "screen") {
            screenMaterial.color.set(0xdde3ff);
        }

    } else {
        scene.background = new THREE.Color(0xC8D9C4);

        sunLight.intensity = 4;
        hemiLight.intensity = 2.5;
        moonLight.intensity = 0;

        renderer.toneMappingExposure = 1;

        //turn off screen again
        if (mode != "screen") {
            screenMaterial.color.set(0x000000);
        }
    }

    screenMaterial.needsUpdate = true;

    return isNight;
}