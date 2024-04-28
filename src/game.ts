import { AbstractMesh, ActionManager, ArcRotateCamera, CreateSphere, DirectionalLight, ExecuteCodeAction, HemisphericLight, Mesh, MeshBuilder, PhotoDome, Scene, SceneLoader, StandardMaterial, Vector3, VertexBuffer, VertexData } from "@babylonjs/core";
import { createBabylonSetup } from "./babylonSetup";
import * as GUI from "@babylonjs/gui";
import { FireMaterial } from '@babylonjs/materials';
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import { SkyMaterial } from '@babylonjs/materials';
import App from "./app";

export const QuickTreeGenerator = function(sizeBranch, sizeTrunk, radius, trunkMaterial, leafMaterial, scene) {

    const tree : Mesh = new Mesh("tree", scene);

    const leaves = CreateSphere("sphere", {segments: 2, diameter: sizeBranch})

    const positions = leaves.getVerticesData(VertexBuffer.PositionKind);
    const indices = leaves.getIndices();
    const numberOfPoints = positions.length / 3;

    const map = [];

    const max = [];

    for (let i = 0; i < numberOfPoints; i++) {
        const p = new Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);

        if (p.y >= sizeBranch/2) {
            max.push(p);
        }

        let found = false;
        for (let index = 0; index <map.length && !found; index++) {
            const array = map[index];
            const p0 = array[0];
            if (p0.equals (p) || (p0.subtract(p)).lengthSquared() < 0.01){
                array.push(i * 3);
                found = true;
            }
        }
        if (!found) {
            let array = [];
            array.push(p, i*3);
            map.push(array);
        }

    }


    map.forEach(function(array) {
        const min = -sizeBranch/10; 
        const max = sizeBranch/10;
        const rx = randomNumber(min,max);
        const ry = randomNumber(min,max);
        const rz = randomNumber(min,max);

        for (let index = 1; index < array.length; index++) {
            const i = array[index];
            positions[i] += rx;
            positions[i+1] += ry;
            positions[i+2] += rz;
        }
    });

    leaves.setVerticesData(VertexBuffer.PositionKind, positions);
    const normals = [];
    VertexData.ComputeNormals(positions, indices, normals);
    leaves.setVerticesData(VertexBuffer.NormalKind, normals);
    leaves.convertToFlatShadedMesh();

    leaves.material = leafMaterial;

    const trunk = MeshBuilder.CreateCylinder("trunk", {height: sizeTrunk, diameterTop: radius-2<1?1:radius-2, diameterBottom: radius, tessellation: 10, subdivisions: 2});
    trunk.checkCollisions = true;

    trunk.material = trunkMaterial;

    trunk.convertToFlatShadedMesh();

    leaves.parent = tree;
    trunk.parent = tree;

    leaves.position.y = (sizeTrunk + sizeBranch) / 2-2;
    return tree
}


const randomNumber = function (min, max) {
    if (min == max) {
        return (min);
    }
    const random = Math.random();
    return ((random * (max - min)) + min);
};







/************************************************************* MINIJEU ****************************************************************************/

export const createGame = async function(){ //async
    
    const meshes = []; 
    const options = {
        width: 4,
        height: 4,
        depth: 4,
    };
      
        // TODO : am i sure that the engines from menu and app are the same as in game ?
        const scene : Scene = new Scene(App.engine);

        scene.gravity = new Vector3(0, -9.81, 0);

        var camera : ArcRotateCamera = new ArcRotateCamera("camera1",0 , 0, 20 , new Vector3(9, 10, -400));
        scene.activeCamera = camera;
        scene.gravity = new Vector3(0, -9.81 / 60, 0);
        scene.collisionsEnabled = true;


        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        light.intensity = 0.1;
      
        const light2 = new DirectionalLight("DirectionalLight", new Vector3(0, -1, 0), scene);
        light2.intensity = 0.4;
        
        //light.position = new Vector3(20, 40, 20); // Set the position of the light

        /*light.intensity = 0.7; // Set the intensity of the light
        light.diffuse = new Color3(1, 1, 1); // Set the diffuse color of the light
        light.specular = new Color3(0.5, 0.5, 0.5); // Set the specular color of the light
        light.shadowEnabled = true; // Enable shadows for the light*/



        var fireMaterial = new StandardMaterial("fontainSculptur2", scene);
        let obstacles = [];
        
        for (var j=0; j<15; j++){
            var r = randomNumber(-300,250);
            var r2 = randomNumber(-200, 100);
            const f =  MeshBuilder.CreateBox("plane", {height:2, width: 2, depth: 1});
            f.scaling.x = 12;
            f.scaling.y = 14;
            f.billboardMode = Mesh.BILLBOARDMODE_Y;
            f.material = fireMaterial;
            f.position = new Vector3(r2,5,r+100);

            obstacles.push(f);
        }


        /****************************************************************************************************************************************************/

        /******************************MATERIAL*************************************/
/******************************MATERIAL*************************************/
        const woodMaterial = new StandardMaterial("wood", scene);
        /*const woodTexture = new woodMaterial("woodtexture", scene);
        woodTexture.ampScale = 50;
        woodMaterial.diffuseTexture = woodTexture;*/
/*
        var grassMaterial = new BABYLON.StandardMaterial("grassMat", scene);
        var grassTexture = new BABYLON.GrassProceduralTexture("grassTex", 256, scene);
        grassMaterial.ambientTexture = grassTexture;
*/
        // TODO : try to fix
        /*var fireTexture = new FireMaterial("fire", scene);
        fireMaterial.diffuseTexture = fireTexture;
        fireMaterial.opacityTexture = fireTexture;*/

        const leafMaterial = new StandardMaterial("leafMaterial", scene);
        leafMaterial.diffuseColor = new Color3(0.5, 0.65, 0.5);



        var fire = new FireMaterial("fire", scene);
        fire.diffuseTexture = new Texture("textures/fire.png", scene);
        fire.distortionTexture = new Texture("textures/distortion.png", scene);
        fire.opacityTexture = new Texture("textures/candleopacity.png", scene);
        fire.speed = 5.0;
/**********************************************************************************/


/***********************************SKYBOX*********************************/


    new PhotoDome("sky", "img/blueSky.jpg", { resolution: 32, size: 700 }, scene);

	    
        // Fog
        // TODO : activate fog and make it more intense when i get further in the race
    //scene.fogMode = Scene.FOGMODE_EXP;

    //scene.fogColor = new BABYLON.Color3(0.9, 0.88, 0.85);
    //scene.fogDensity = 0.001;

    /*const grassText = new BABYLON.StandardMaterial("grassText");
    grassText.diffuseTexture = fireTexture;*/

    /**********************************************ARBRES***********************************************/
  
 
    /*for (var i=0; i<60; i++){
        var r = randomNumber(-450,450);
        const t = QuickTreeGenerator(80, 60, 15, woodMaterial, leafMaterial, scene);
        t.position = new Vector3(-r, 15, 20*i-5*r);
        const t1 = QuickTreeGenerator(80, 60, 15, woodMaterial, fire, scene);
        t1.position = new Vector3(r, 15, 20*i-5*r);

        t1.checkCollisions = true;
        t.checkCollisions = true;
    }*/

    /******************************************************************************************************************************************************/



    
    /*********************************BRANCHES*****************************************/

  

    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

            /*****timer*****/

       
            setInterval(() => {
                    
                        let random = randomNumber(-200,150);
                        let random2 = randomNumber(-200,300);
                        const trunk = MeshBuilder.CreateCylinder("trunk", {height: 30, diameterTop: 5-2<1?1:5-2, diameterBottom: 5, tessellation: 10, subdivisions: 2});
                        trunk.material = fire;
                        trunk.rotation = new Vector3(0,0,3.14/2);
                        trunk.position = new Vector3(random, 150, random2);
                        
                        meshes.push(trunk);
                    
            },1000);


            setInterval(() => {
                
                    
                //for (let j=0; j<5; j++){
                    let random3 = randomNumber(0,300);
                    let random4 = randomNumber(-200,300);
                    const trunk2 = MeshBuilder.CreateCylinder("trunk", {height: 30, diameterTop: 5-2<1?1:5-2, diameterBottom: 5, tessellation: 10, subdivisions: 2});
                    trunk2.material = fireMaterial;
                    trunk2.rotation = new Vector3(0,0,3.14/2);
                    trunk2.position = new Vector3(random3, 150, random4);
                    
                    meshes.push(trunk2);
                    //advancedTexture.addControl(trunk);
                //}
                
        },5000);
     
        /**************************************LIGNE D'ARRIVEE******************************************/
        
        const end = MeshBuilder.CreateBox("box", {width: 400,height: 10 ,depth: 15,}, scene);
        end.position = new Vector3(0,3,300);

   
    /*************************COMPTEUR*************/

    let seeds = [];
    for (let i=0; i<20; i++){
        var rn1 = randomNumber(-200,200);
        var rn2 = randomNumber(-200,200);
        var seed1 = Mesh.CreateSphere("seed", 3, 10, scene);
        seed1.position = new Vector3(rn1, 5, rn2);

        seeds.push(seed1);
   
    
    }


//à gauche
for (let i=0; i<40;i++){
    for (let j=0; j<7;j++){
        const t = QuickTreeGenerator(50, 35, 15, woodMaterial, leafMaterial, scene);
        //t.position = new BABYLON.Vector3(-200+20*j, 15, -400+20*i);
        t.position = new Vector3(-200+20*j, 15, -400+20*i);
        const t1 = QuickTreeGenerator(50, 35, 15, woodMaterial, fireMaterial, scene);
        //t1.position = new BABYLON.Vector3(-200, 15, -400+20*j*i);
        t1.position = new Vector3(-200, 15, -400+20*j*i);
    }
}

//à droite
for (let i=0; i<40;i++){
    for (let j=0; j<2;j++){
        const t = QuickTreeGenerator(50, 35, 15, woodMaterial, leafMaterial, scene);
        //t.position = new BABYLON.Vector3(200-20*j, 15, -400+20*i);
        t.position = new Vector3(200-20*j, 15, -400+20*i);
    
    const t1 = QuickTreeGenerator(50, 35, 15, woodMaterial, leafMaterial, scene);
    //t1.position = new BABYLON.Vector3(200, 15, -400+20*j*i);
    t1.position = new Vector3(200, 15, -400+20*j*i);
    }
}

const addCharacterWithMouvement = function(scene, meshes, obstacles, seeds, end){ //async


    
    /********************************************************************************************************/
    SceneLoader.ImportMesh("", "models/", "player.glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {
        //var character = newMeshes[0];
        const character: AbstractMesh = newMeshes[0];

        
        character.position = new Vector3(9, 0, -300);
        
        character.scaling.scaleInPlace(2);
        
        camera.target = character.position;
        //TODO : FIX THIS
        //character.applyGravity = true;
        character.checkCollisions = true;
        // TODO : FIX THIS
        //character.minZ = 0.45; 


    
        const ground = MeshBuilder.CreateGround("ground", { width: 6000, height: 10000 }, scene);
        ground.rotation = new Vector3(5, 0, 0);
        ground.position = new Vector3(0, 3, 400);

        const grassTexture = new Texture("img/grass.jpg", scene);
        const groundMaterial = new StandardMaterial("groundMaterial", scene);
        //groundMaterial.diffuseTexture = grassTexture;
        groundMaterial.diffuseColor = new Color3(0, 1, 0);
        ground.material = groundMaterial; // Assign the grass material to the ground
        ground.checkCollisions = true;

        
        var inputMap = {}  
            scene.actionManager = new ActionManager(scene);

            // Register keydown and keyup events for left and right arrow keys
            scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
                // Update the inputMap with arrow key bindings
                if (evt.sourceEvent.key === "ArrowLeft") {
                    inputMap["leftArrow"] = true;
                } else if (evt.sourceEvent.key === "ArrowRight") {
                    inputMap["rightArrow"] = true;
                }
            }));

            scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
                // Update the inputMap with arrow key bindings
                if (evt.sourceEvent.key === "ArrowLeft") {
                    inputMap["leftArrow"] = false;
                } else if (evt.sourceEvent.key === "ArrowRight") {
                    inputMap["rightArrow"] = false;
                }
            }));
    
            
        
       
        const run = scene.getAnimationGroupByName("RunInPlace");
        const movement = scene.onBeforeRenderObservable.add(() => {
    
            character.moveWithCollisions(character.forward.scaleInPlace(1.05));
            run.start(true, 1.6, run.from, run.to, false);
    
            var keydown = false;
            if (inputMap["rightArrow"]) {
                character.position.x+=0.25;
                keydown = true;
            }
            if (inputMap["leftArrow"]) {
                character.position.x-=0.25;
                keydown = true;
            }
        });

            scene.onBeforeRenderObservable.add(() => {
                scene.registerBeforeRender(function () {
                    if (end.intersectsMesh(character, false)) { 
                        
                        
                        character.position = new Vector3(9, 0, -300);     
                    }
                    // if instersects with mesh
                    // TODO : deduct points en fonction de l'objet
                    for (var i=0; i<meshes.length; i++){
                            if (meshes[i].intersectsMesh(character, false)) {
                                character.position = new Vector3(9, 0, -300);
                               // TODO : add a point
                                
                                for (var j=0; j<meshes.length; j++){
                                    meshes[j].dispose(); // make the object disappear
                                    
                                }
                            }
                    }

                    // TODO : if you hit an obstacle, deduct points
                    for (var i=0; i<obstacles.length; i++){
                        if (obstacles[i].intersectsMesh(character, false)) {
                            character.position = new Vector3(9, 0, -300);
                        }
                }

                        for (var i=0; i<seeds.length; i++){
                            if (seeds[i].intersectsMesh(character, false)) {
                                seeds[i].dispose();
                                //ajtPoints(1);
                                //button.textContent = cpt;
                                seeds.splice(i,1);
                                
                            }
                        }
                        
                });
            });

    });
}


     /********************************************************************************************************************/
     addCharacterWithMouvement(scene, meshes, obstacles, seeds, end);

return scene;
       
}


