// Create a new Three.js scene
var scene = new THREE.Scene();

// Create a new directional light and add it to the scene
var light = new THREE.DirectionalLight(0xffffff, 0.3);
light.position.set(0, 1, 1);
scene.add(light);

// Create a plane to act as a ground
var planeGeometry = new THREE.PlaneGeometry(10, 10, 32, 32);
var planeMaterial = new THREE.MeshStandardMaterial({
color: 0xffffff,
roughness: 0.8 // higher roughness makes the material less reflective
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true; // enable shadow casting on the plane
plane.rotation.x = -Math.PI / 2; // rotate the plane to face upwards
plane.position.y = -10
scene.add(plane);

// Create the cross object
var cross;

// Load the cross OBJ file
var loader = new THREE.OBJLoader();
loader.load(
// URL of the OBJ file
'http://localhost:3000/cross.obj',
// Callback function when the file is loaded
function ( object ) {
    // Store the loaded object in the `cross` variable
    cross = object;

    // Position the cross above the plane and enable shadow casting
    cross.position.set(0, 1, 0);
    cross.castShadow = true;

    // Add the cross to the scene
    scene.add(cross);
}
);

// Set up the camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.2, 1000);
camera.position.set(0, 2, 25); // move the camera back and up
camera.lookAt(0, 1, 0); // look at the center of the scene

// Create a new directional light and add it to the scene
var light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(0, 1, -1);
scene.add(light);

// Add a ground plane
var groundGeometry = new THREE.PlaneGeometry(10, 10);
var groundMaterial = new THREE.ShadowMaterial({opacity: 0.3});
var ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // rotate the ground to face upwards
ground.receiveShadow = true; // enable shadow casting on the ground
scene.add(ground);

// Create a new WebGLRenderer
var renderer = new THREE.WebGLRenderer();

// Set the size of the renderer
renderer.setSize( window.innerWidth, window.innerHeight );

// Add the renderer to the HTML document
document.getElementById( 'container' ).appendChild( renderer.domElement );

// Render the scene in an animation loop
function animate() {
requestAnimationFrame( animate );
renderer.render( scene, camera );
}
animate();
