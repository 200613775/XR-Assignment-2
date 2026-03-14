// Get the element
const canvas = document.getElementById("renderCanvas");

// Create the engine
const engine = new BABYLON.Engine(canvas, true);

// Create
const createScene = async function () {
const scene = new BABYLON.Scene(engine);

// Create a camera
const camera = new BABYLON.ArcRotateCamera(
"camera",
-Math.PI / 2,
Math.PI / 2.5,
15,
new BABYLON.Vector3(0,0,0)
);
camera.attachControl(canvas,true);

// lighting
const light = new BABYLON.HemisphericLight(
"light1",
new BABYLON.Vector3(0,1,0),
scene
);

light.intensity = 0.7;

return scene;
};

// Run 
createScene().then((scene) => {
engine.runRenderLoop(function () {
scene.render();
});
window.addEventListener("resize", function () {
engine.resize();
});

});