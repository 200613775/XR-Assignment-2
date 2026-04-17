// Get the element
const canvas = document.getElementById("renderCanvas");

    // Create the engine
    const engine = new BABYLON.Engine(canvas, true);

        // Create
        const createScene = async function () {
        const scene = new BABYLON.Scene(engine);

        // Create a camera
        const camera = new BABYLON.UniversalCamera(
        "camera",
        new BABYLON.Vector3(0,2,5),
        scene
        );
        camera.attachControl(canvas,true);
        camera.speed = 0.5;

        // lighting
        const light = new BABYLON.HemisphericLight(
        "light1",
        new BABYLON.Vector3(0,1,0),
        scene
        );

        light.intensity = 0.7;

        // MeshBuilder to create ground
        const ground = BABYLON.MeshBuilder.CreateGround(
        "ground",
        {width:20,
        height:20},
        scene
        );

        const groundMat = new BABYLON.StandardMaterial("groundMat",scene);
        groundMat.diffuseColor = new BABYLON.Color3(0.6,0.6,0.6);
        ground.material = groundMat;

        // MeshBuilder to create walls
        const wall1 = BABYLON.MeshBuilder.CreateBox(
        "wall1",
        {width:20,
        height:5,
        depth:0.5},
        scene
        );

        wall1.position.z = -10;
        wall1.position.y = 2.5;

        const wall2 = BABYLON.MeshBuilder.CreateBox(
        "wall2",
        {width:0.5,
        height:5,
        depth:20},
        scene
        );

        wall2.position.x = -10;
        wall2.position.y = 2.5;

        const wall3 = BABYLON.MeshBuilder.CreateBox(
        "wall3",
        {width:0.5,
        height:5,
        depth:20},
        scene
        );

        wall3.position.x = 10;
        wall3.position.y = 2.5;

        // MeshBuilder to add a Exit door
        const exitDoor = BABYLON.MeshBuilder.CreateBox(
        "exitDoor",
        {width:3,
        height:4,
        depth:0.5},
        scene
        );

        exitDoor.position.z = -9.5;
        exitDoor.position.y = 2;

        const doorMat = new BABYLON.StandardMaterial("doorMat",scene);
        doorMat.diffuseColor = new BABYLON.Color3(0.8,0.2,0.2);
        doorMat.emissiveColor = new BABYLON.Color3(1,0,0);
        exitDoor.material = doorMat;

        // alert msg
        let emergency = false;

        setTimeout(()=>{
            emergency = true;
            document.getElementById("info").innerText = "🚨 EMERGENCY! FIND THE EXIT!";
        },3000);

        // XR Helper
        const xr = await scene.createDefaultXRExperienceAsync({ 
         floorMeshes: [ground],
         optionalFeatures: true
        });

        scene.registerBeforeRender(()=>{
            if(emergency){
                let t = Math.sin(Date.now()*0.01);
                scene.clearColor = new BABYLON.Color4(0.5+t*0.5,0,0,1);
            }

});

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