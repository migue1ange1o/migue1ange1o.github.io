// Create the Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.y = 15;
camera.position.z = 25;
camera.rotation.x += THREE.MathUtils.degToRad(-20);

const lightGeometry = new THREE.SphereGeometry(5, 22, 22);
const lightMaterial = new THREE.MeshStandardMaterial({
  emissive: 0xffffee,
  emissiveIntensity: 5,
  color: 0xffffff, // white color
});
const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
lightMesh.position.set(-10, 20, -40);
scene.add(lightMesh);

// Load the Blender asset .obj file
const loader = new THREE.OBJLoader();
loader.load(
  // "http://localhost:3000/cross.obj",
  "https://migue1ange1o.s3.amazonaws.com/cross.obj",
  function (object) {
    // Add a reflective material to the cross object
    const crossMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.7, // controls the amount of metal reflectivity
      roughness: 0.3, // controls the sharpness of reflections
    });
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material = crossMaterial;
      }
    });
    scene.add(object);

    // Make the light bulb emit light
    const bulb1 = new THREE.PointLight(0xffffee, 2, 10, 2);
    const bulb2 = new THREE.PointLight(0xffffee, 2, 10, 2);
    const bulb3 = new THREE.PointLight(0xffffee, 2, 10, 2);
    const bulb4 = new THREE.PointLight(0xffffee, 2, 10, 2);
    const bulb5 = new THREE.PointLight(0xffffee, 2, 10, 2);
    const bulb6 = new THREE.PointLight(0xffffee, 2, 10, 2);
    bulb1.position.set(2, 8, 1);
    bulb2.position.set(-2, 8, 1);
    bulb3.position.set(-2, 2, 1);
    bulb4.position.set(2, 2, 1);
    bulb5.position.set(0, -10, 0);
    bulb6.position.set(0, 10, 0);
    scene.add(bulb1);
    scene.add(bulb2);
    scene.add(bulb3);
    scene.add(bulb4);
    scene.add(bulb5);
    scene.add(bulb6);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened");
  }
);

const clock = new THREE.Clock();
const rotationSpeed = 0.2;

function animate() {
  requestAnimationFrame(animate);

  // Calculate the elapsed time since the animation started
  const elapsedTime = clock.getElapsedTime();

  // Update the camera position and rotation
  const angle = elapsedTime * rotationSpeed;
  camera.position.x = Math.sin(angle) * 25;
  camera.position.z = Math.cos(angle) * 25;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

animate();
