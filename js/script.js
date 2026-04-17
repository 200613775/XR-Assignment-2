// Get the element 
const canvas = document.getElementById("renderCanvas");

// Create the engine
const engine = new BABYLON.Engine(canvas, true);

// Create
const createScene = async function () {

    const scene = new BABYLON.Scene(engine);

    // Background color
    scene.clearColor = new BABYLON.Color4(0.8, 0.9, 1, 1);

    // UI reference
    const info = document.getElementById("info");

    // Game variables
    let startTime = Date.now();
    let gameEnded = false;
    let emergency = false;

    // Camera 
    const camera = new BABYLON.UniversalCamera(
        "camera",
        new BABYLON.Vector3(0, 2, 8),
        scene
    );

    camera.attachControl(canvas, true);
    camera.speed = 0.5;
    camera.setTarget(new BABYLON.Vector3(0, 2, 0));

    // Light
    const light = new BABYLON.HemisphericLight(
        "light1",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    // Ground
    const ground = BABYLON.MeshBuilder.CreateGround(
        "ground",
        { width: 20, height: 20 },
        scene
    );

    const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6);
    ground.material = groundMat;

    // Wall material
    const wallMat = new BABYLON.StandardMaterial("wallMat", scene);
    wallMat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);

    // Walls
    const wall1 = BABYLON.MeshBuilder.CreateBox("wall1",
        { width: 20, height: 5, depth: 0.5 }, scene);
    wall1.position.set(0, 2.5, -10);
    wall1.material = wallMat;

    const wall2 = BABYLON.MeshBuilder.CreateBox("wall2",
        { width: 0.5, height: 5, depth: 20 }, scene);
    wall2.position.set(-10, 2.5, 0);
    wall2.material = wallMat;

    const wall3 = BABYLON.MeshBuilder.CreateBox("wall3",
        { width: 0.5, height: 5, depth: 20 }, scene);
    wall3.position.set(10, 2.5, 0);
    wall3.material = wallMat;

    // Exit door
    const exitDoor = BABYLON.MeshBuilder.CreateBox("exitDoor",
        { width: 3, height: 4, depth: 0.5 }, scene);
    exitDoor.position.set(0, 2, -9.5);

    const doorMat = new BABYLON.StandardMaterial("doorMat", scene);
    doorMat.emissiveColor = new BABYLON.Color3(1, 0, 0);
    exitDoor.material = doorMat;

    // EXIT SIGN
    const exitTexture = new BABYLON.DynamicTexture(
        "exitTexture",
        { width: 512, height: 256 },
        scene,
        false
    );

    exitTexture.hasAlpha = true;

    exitTexture.drawText(
        "EXIT",
        null,
        180,
        "bold 120px Arial",
        "white",
        "red",
        true
    );

    const exitMat = new BABYLON.StandardMaterial("exitMat", scene);
    exitMat.diffuseTexture = exitTexture;
    exitMat.emissiveTexture = exitTexture;
    exitMat.backFaceCulling = false;

    const exitSign = BABYLON.MeshBuilder.CreatePlane(
        "exitSign",
        { width: 4, height: 2 },
        scene
    );

    exitSign.position = new BABYLON.Vector3(0, 3, -9.0);
    exitSign.rotation.y = Math.PI;
    exitSign.material = exitMat;

    // ARROWS
    const arrow1 = BABYLON.MeshBuilder.CreateCylinder(
        "arrow1",
        { diameterTop: 0, diameterBottom: 0.6, height: 2 },
        scene
    );

    arrow1.position = new BABYLON.Vector3(-9.5, 3, 3);
    arrow1.rotation.z = Math.PI / 2;
    arrow1.rotation.y = Math.PI / 2;

    const arrowMat = new BABYLON.StandardMaterial("arrowMat", scene);
    arrowMat.emissiveColor = new BABYLON.Color3(0, 1, 0);
    arrow1.material = arrowMat;

    const arrow2 = arrow1.clone("arrow2");
    arrow2.position = new BABYLON.Vector3(-9.5, 3, -4);
    arrow2.rotation.y = -Math.PI / 2;

    // Fire hazard
    const fire = BABYLON.MeshBuilder.CreateSphere("fire",
        { diameter: 1 }, scene);

    fire.position = new BABYLON.Vector3(2, 1, -2);

    const fireMat = new BABYLON.StandardMaterial("fireMat", scene);
    fireMat.emissiveColor = new BABYLON.Color3(1, 0.3, 0);
    fire.material = fireMat;

    // Alarm sound
    const alarm = new BABYLON.Sound(
        "alarm",
        "sounds/alarm.mp3",
        scene,
        null,
        { loop: true, autoplay: false, volume: 0.5 }
    );

    window.addEventListener("click", function () {
        if (emergency && !gameEnded) {
            alarm.play();
        }
    });

    // Emergency trigger
    setTimeout(() => {
        emergency = true;

        if (info) {
            info.innerText = "🚨 EMERGENCY! FIND THE EXIT!";
        }

    }, 3000);

    //  FIXED GAME LOOP
    scene.registerBeforeRender(() => {

        // STOP everything if game ended
        if (gameEnded) {
            scene.clearColor = new BABYLON.Color4(0.8, 0.9, 1, 1);
            return;
        }

        // Red flashing
        if (emergency) {
            let t = Math.sin(Date.now() * 0.01);
            scene.clearColor = new BABYLON.Color4(0.5 + t * 0.5, 0, 0, 1);
        }

        // WIN
        if (camera.position.z < -9) {
            gameEnded = true;

            let time = ((Date.now() - startTime) / 1000).toFixed(2);

            if (info) {
                info.innerText = "Evacuated! Time: " + time + "s";
            }

            alarm.stop();
            camera.detachControl(canvas);
            return;
        }

        // LOSE (fire)
        if (camera.position.subtract(fire.position).length() < 1.5) {
            gameEnded = true;

            if (info) {
                info.innerText = "Caught by fire!";
            }

            alarm.stop();
            camera.detachControl(canvas);
            return;
        }

    });

    // XR 
    try {
        await scene.createDefaultXRExperienceAsync({
            floorMeshes: [ground]
        });
    } catch (e) {
        console.log("XR not supported:", e);
    }

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