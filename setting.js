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

// camera.position.y = 8;
camera.position.y = 5;
camera.position.z = 15;
camera.rotation.x += THREE.MathUtils.degToRad(30);

// Create Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 10;
controls.maxDistance = 100;
controls.maxPolarAngle = Math.PI / 1.5;

const lightGeometry = new THREE.SphereGeometry(5, 22, 22);
const lightMaterial = new THREE.MeshStandardMaterial({
  emissive: 0xffffee,
  emissiveIntensity: 5,
  color: 0xffffff, // white color
});
const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
lightMesh.position.set(-10, 20, -40);
scene.add(lightMesh);


// Create water material
const waterGeometry = new THREE.PlaneGeometry(1000, 1000);
const water = new THREE.Water(
  waterGeometry,
  {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load('https://threejs.org/examples/textures/waternormals.jpg', function (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }),
    alpha: 1.0,
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x1F1F4B,
    distortionScale: 3.7,
    fog: scene.fog !== undefined
  }
);

water.rotation.x = -Math.PI / 2;
water.position.y = -10

scene.add(water);

// Create an array to hold the bulb meshes
const bulbMeshes = [];

// Load the Blender asset .obj file
const loader = new THREE.OBJLoader();
loader.load(
  "https://migue1ange1o.s3.amazonaws.com/cross.obj",
  function (object) {
    // object.scale.set(0.8, 0.8, 0.8);

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

    // Create multiple instances of the light bulb mesh
    for (let i = 0; i < 50; i++) {
      const bulbGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      const bulbMaterial = new THREE.MeshStandardMaterial({
        emissive: 0xffffee,
        emissiveIntensity: 0.7,
        color: 0xf7d27c, // warm yellow color
      });
      const bulbMesh = new THREE.Mesh(bulbGeometry, bulbMaterial);
      bulbMesh.position.set(
        THREE.MathUtils.randFloatSpread(32),
        THREE.MathUtils.randFloatSpread(32),
        THREE.MathUtils.randFloatSpread(32)
      );
      scene.add(bulbMesh);
      bulbMeshes.push(bulbMesh);

      // Make the light bulb emit light
      const bulbLight = new THREE.PointLight(0xffffee, 2, 10, 2);
      bulbLight.position.copy(bulbMesh.position);
      scene.add(bulbLight);
    }
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened");
  }
);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  controls.update()

  // Animate the water
  water.material.uniforms['time'].value += 1.0 / 60.0;
  water.material.uniforms['time'].needsUpdate = true;

  const time = Date.now() * 0.0005; // convert time to seconds

  // Animate the bulb meshes
  for (let i = 0; i < bulbMeshes.length; i++) {
    const bulbMesh = bulbMeshes[i];

    // Update the position based on time
    const orbitRadius = 18;
    const polarAngle = time * 0.4 + i * 0.3;
    const azimuthalAngle = time * 0.2 + i * 0.2 + (i % 2 === 0 ? Math.PI / 2 : 0);
    const x = orbitRadius * Math.sin(polarAngle) * Math.cos(azimuthalAngle);
    const y = orbitRadius * Math.cos(polarAngle) + 3;
    const z = orbitRadius * Math.sin(polarAngle) * Math.sin(azimuthalAngle) + 2;
    bulbMesh.position.set(x, y, z);

    // Animate the rotation
    bulbMesh.rotation.y += 0.02;
  }
}



animate();
