import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.127.0/examples/jsm/loaders/GLTFLoader.js";

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xff9966); // warm sunset background
window.scene = scene; // expose for console debugging

// Camera setup
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const startPosition = new THREE.Vector3(-15, 5, 10); // dramatic starting angle
const endPosition = new THREE.Vector3(0, 1.5, 0.95); // final resting spot
camera.position.copy(startPosition);
camera.lookAt(10, 1, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("bg"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// ✅ Fix color fidelity to match Blender
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// Sunset-style lighting
const ambient = new THREE.AmbientLight(0xffbb88, 0.4); // soft peachy fill
scene.add(ambient);

const sunLight = new THREE.DirectionalLight(0xffcc88, 1.5); // golden sunlight
sunLight.position.set(-2, 2, 5); // low angle like sunset
sunLight.castShadow = true;
scene.add(sunLight);

// Raycaster for clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const posterNames = ["Wanted001", "Wanted001_1", "Wanted001_2"];
const trashcanNames = ["Cylinder027", "Cylinder027_1"];

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    console.log("Clicked:", clickedObject.name);

    if (clickedObject.name === "kitty") {
      window.location.href = "kitty.html";
    } else if (posterNames.includes(clickedObject.name)) {
      window.location.href = "poster.html";
    } else if (trashcanNames.includes(clickedObject.name)) {
      window.location.href = "trashcan.html";
    }
  }
}

window.addEventListener("click", onClick);

// Load your model
const loader = new GLTFLoader();
loader.load(
  "model.glb",
  (gltf) => {
    console.log("Model loaded");
    scene.add(gltf.scene);

    // Debug: list all mesh names
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        console.log("Mesh found:", child.name);
        // Optional: ensure materials use sRGB encoding
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

// Camera animation
let animationProgress = 0;
function animate() {
  requestAnimationFrame(animate);

  if (animationProgress < 1) {
    animationProgress += 0.01;
    camera.position.lerpVectors(startPosition, endPosition, animationProgress);
    camera.lookAt(-1.8, 1, 0);
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
