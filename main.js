import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.127.0/examples/jsm/loaders/GLTFLoader.js";

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-2.0635, 1.5, 1);
camera.lookAt(-1.75, 1, 0);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("bg"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Lighting
scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 1.2));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

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

    // Redirect based on object name
    if (clickedObject.name === "kitty") {
      window.location.href = "kitty.html";
    }
    if (clickedObject.name === "poster") {
      window.location.href = "poster.html";
    } 
    if (clickedObject.name === "trashcan") {
      window.location.href = "trashcan.html";
    }
  }
}

window.addEventListener("click", onClick);

// Load your model
const loader = new GLTFLoader();
loader.load(
  "model.txt", // Use "model.glb" if hosted externally with proper CORS
  (gltf) => {
    console.log("Model loaded");
    scene.add(gltf.scene);
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
