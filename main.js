import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.127.0/examples/jsm/loaders/GLTFLoader.js";

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xff9966); // warm sunset background
window.scene = scene; // expose for console debugging

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-2.0635, 1.5, 0.95);
camera.lookAt(-1.8, 1, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("bg"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Sunset-style lighting
const ambient = new THREE.AmbientLight(0xffbb88, 0.4); // soft peachy fill
scene.add(ambient);

const sunLight = new THREE.DirectionalLight(0xffcc88, 1.5); // golden sunlight
sunLight.position.set(-5, 2, 5); // low angle like sunset
sunLight.castShadow = true;
scene.add(sunLight);

// Raycaster for clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Object name groups
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
  "model.txt",
  (gltf) => {
    console.log("Model loaded");
    scene.add(gltf.scene);

    // Debug: list all mesh names
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        console.log("Mesh found:", child.name);
      }
    });
  },
  undefined,
  (error) => {
    console.error("Error loading model:", error);
  }
);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Resize handling
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
