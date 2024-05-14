import { ArcRotateCamera, Camera, Color4, HemisphericLight, Light, PhotoDome, Scene, Tools, Vector3 } from "@babylonjs/core";
import { createBabylonSetup } from "./babylonSetup";
import { AdvancedDynamicTexture } from "@babylonjs/gui";
import App from "./app";


export const createMenu = function () {

    const scene : Scene = new Scene(App.engine);
    const photoDome : PhotoDome = new PhotoDome ("paris","img/panoramic.jpg", { resolution: 128, size: 1000 }, scene);
    scene.clearColor = new Color4(0, 0, 0, 1);


    // This creates and positions a free camera (non-mesh)
    const camera : ArcRotateCamera = new ArcRotateCamera("camera", Tools.ToRadians(90), Tools.ToRadians(65), 10, Vector3.Zero(), scene);

    
    // This attaches the camera to the canvas
    camera.attachControl(App.canvas, true);
    camera.useAutoRotationBehavior = true;
    camera.autoRotationBehavior.idleRotationWaitTime = 0;

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light : HemisphericLight = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    
    light.intensity = 0.7;
		
    // permet d'afficher la page menu avec les boutons 
    async function loadGUI() {

        var advancedTexture : AdvancedDynamicTexture = AdvancedDynamicTexture.CreateFullscreenUI("firstMenu", true, scene);
        await advancedTexture.parseFromSnippetAsync("TNAKE1#48");
        

        const menuScreen = advancedTexture.getControlByName("menuScreen");
        const playScreen = advancedTexture.getControlByName("HTPscreen");

        let children1 = menuScreen.getDescendants();
        let children2 = playScreen.getDescendants();

        menuScreen.isVisible = true;
        playScreen.isVisible = false;

        let children = advancedTexture.getChildren()[0].children;
        console.log(children1);
        var playButton = children1.filter(control => control.name === "play")[0];
        var HTPbutton = children1.filter(control => control.name === "HowTo")[0];
        var back = children2.filter(control => control.name === "Back")[0];
        console.log(HTPbutton, back);

        playButton.onPointerClickObservable.add(() => {
            var points = document.getElementById("score");
            points.style.display = "block";

            // open the game scene
            App.state = 1;
            
        });

        playButton.onPointerClickObservable.add(() => menuScreen.isVisible = false);
    
        back.onPointerClickObservable.add(() => playScreen.isVisible = false);
        back.onPointerClickObservable.add(() => menuScreen.isVisible = true);
    
        HTPbutton.onPointerClickObservable.add(() => menuScreen.isVisible = false);
        HTPbutton.onPointerClickObservable.add(() => playScreen.isVisible = true);

    }
    loadGUI();

    

    return scene;

};
