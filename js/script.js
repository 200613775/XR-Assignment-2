// Get the element
const canvas = document.getElementById("renderCanvas");

// Create the engine
const engine = new BABYLON.Engine(canvas, true);

// Create
const createScene = async function () {
const scene = new BABYLON.Scene(engine);
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