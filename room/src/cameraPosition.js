import { gsap } from "gsap";

export async function defaultTransition(duration, instance, controls) {
    controls.enableRotate = false;
    controls.enableZoom = false;

    // Camera-Position
    gsap.to(instance.position, {
        duration: duration,
        ease: "power1.inOut",
        x: -1.48,
        y: 4.45,
        z: -2.5
    });

    // Target (look at) position
    gsap.to(controls.target, {
        duration: duration,
        ease: "power1.inOut",
        x: -1.48,
        y: 4.18,
        z: -4.5
    });

    await sleep(1500);

    controls.enableRotate = true;
    controls.enableZoom = true;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function resetTransition(duration, instance, controls) {
    controls.enableRotate = false;
    controls.enableZoom = false;

    // Camera-Position
    gsap.to(instance.position, {
        duration: duration,
        ease: "power1.inOut",
        x: 6,
        y: 6,
        z: 6
    });

    // Target (look at) position
    gsap.to(controls.target, {
        duration: duration,
        ease: "power1.inOut",
        x: 0,
        y: 4,
        z: 0
    });

    await sleep(1500);

    controls.enableRotate = true;
    controls.enableZoom = true;
}
