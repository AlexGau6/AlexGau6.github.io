import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.127.0/examples/jsm/loaders/GLTFLoader.js";

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xff9966);
window.scene = scene;

// Camera setup
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

// Intro transition setup
const startCamPosition = new THREE.Vector3(-15, 1.3, 0); // where the camera starts
const targetCamPosition = new THREE.Vector3(0.6, 1.3, 0); // where it settles
camera.position.copy(startCamPosition);
camera.lookAt(.6,1.3,0);

let initialTransitionProgress = 0;
let initialTransitionActive = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("bg"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// Lighting
const ambient = new THREE.AmbientLight(0xffbb88, 0.4);
scene.add(ambient);

const sunLight = new THREE.DirectionalLight(0xffcc88, 1.5);
sunLight.position.set(-2, 2, 5);
sunLight.castShadow = true;
scene.add(sunLight);

// Raycaster for clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    console.log("Clicked:", clickedObject.name);

    switch (clickedObject.name) {
      case "Sphere054_1":
        doorTransitionActive = true;
        doorTransitionProgress = 0;
        break;
      case "Text003":
      case "Text003_1":
        window.open("about.html", "_blank");
        break;
      case "Text005_1":
      case "Text005_2":
        window.open("projects.html", "_blank");
        break;
      case "Text006":
      case "Text006_1":
        window.open("resume.html", "_blank");
        break;
      case "Text007_1":
        window.open("game.html", "_blank");
        break;
      default:
        console.log("No action assigned for:", clickedObject.name);
    }
  }
}

window.addEventListener("click", onClick);

// Load model
const loader = new GLTFLoader();
loader.load(
  "model.glb",
  (gltf) => {
    console.log("Model loaded");
    scene.add(gltf.scene);

    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        console.log("Mesh found:", child.name);
        if (child.material && child.material.map) {
          child.material.map.encoding = THREE.sRGBEncoding;
        }
      }
    });
  },
  undefined,
  (error) => {
    console.error("Error loading model:", error);
  }
);

// Door transition variables
let doorTransitionProgress = 0;
let doorTransitionActive = false;

const doorCamPosition = new THREE.Vector3(0.3, 1.14, -2.1);
const doorLookTarget = new THREE.Vector3(0.3, 0, -2.1);

function animate() {
  requestAnimationFrame(animate);

  if (initialTransitionActive && initialTransitionProgress < 1) {
    initialTransitionProgress += 0.005;
    camera.position.lerpVectors(startCamPosition, targetCamPosition, initialTransitionProgress);
    camera.lookAt(new THREE.Vector3(targetCamPosition.x, targetCamPosition.y, targetCamPosition.z - 1));
    if (initialTransitionProgress >= 1) {
      initialTransitionActive = false;
    }
  }

  if (doorTransitionActive && doorTransitionProgress < 1) {
    doorTransitionProgress += 0.00125;
    camera.position.lerpVectors(camera.position, doorCamPosition, doorTransitionProgress);
    camera.lookAt(doorLookTarget);
  }

  renderer.render(scene, camera);
}
animate();

// Resize handling
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
