import * as THREE from 'three';

export function getFirstIntersectedObject(event, window, camera, scene, objectName) {
    const raycaster = new THREE.Raycaster();
    const getFirstValue = true;

    const mousePointer = getMouseVector2(event, window);
    const intersections = checkRayIntersections(mousePointer, camera, raycaster, scene, getFirstValue);
    const monitorList = getObjectsByName(intersections, objectName);

    if (typeof monitorList[0]!== 'undefined') {
        return monitorList[0];
    }

    return null;
}

export function getMouseVector2(event, window) {
    const pointer = new THREE.Vector2();

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 + 1;

    return pointer;
}

// draw ray from camera to pointer
export function checkRayIntersections(pointer, camera, raycaster, scene) {
    raycaster.setFromCamera(pointer, camera);

    const intersections = raycaster.intersectObjects(scene.children, true);

    return intersections;
}

// return objects with specific names from the intersection list (from above)
export function getObjectsByName(objectList, name) {
    const monitorObjects = [];

    objectList.forEach((object) => {
        const objectName = object.object.name || 'Unnamed Object';
        if (objectName.includes(name)) {
            monitorObjects.push(object.object);
        }
    });

    return monitorObjects;
}