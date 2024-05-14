import { AbstractMesh, ActionManager, ArcRotateCamera, CreateSphere, DirectionalLight, ExecuteCodeAction, HemisphericLight, Mesh, MeshBuilder, PhotoDome, PhysicsImpostor, Scene, SceneLoader, StandardMaterial, TextureBlock, Vector3, VertexBuffer, VertexData } from "@babylonjs/core";
import { createBabylonSetup } from "./babylonSetup";
import * as GUI from "@babylonjs/gui";
import { FireMaterial } from '@babylonjs/materials';
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import { SkyMaterial } from '@babylonjs/materials';
import { AdvancedDynamicTexture,TextBlock , Button} from "@babylonjs/gui";

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

        let camera : ArcRotateCamera = new ArcRotateCamera("camera1",0 , 0, 20 , new Vector3(9, 10, -400));
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



        let fireMaterial = new StandardMaterial("fontainSculptur2", scene);
        /*let obstacles = [];
        
        for (let j=0; j<15; j++){
            let r = randomNumber(-300,250);
            let r2 = randomNumber(-200, 100);
            const f =  MeshBuilder.CreateBox("plane", {height:2, width: 2, depth: 1});
            f.scaling.x = 12;
            f.scaling.y = 14;
            f.billboardMode = Mesh.BILLBOARDMODE_Y;
            f.material = fireMaterial;
            f.position = new Vector3(r2,5,r+100);

            obstacles.push(f);
        }*/


        /****************************************************************************************************************************************************/

        /******************************MATERIAL*************************************/
/******************************MATERIAL*************************************/
        const woodMaterial = new StandardMaterial("wood", scene);
        /*const woodTexture = new woodMaterial("woodtexture", scene);
        woodTexture.ampScale = 50;
        woodMaterial.diffuseTexture = woodTexture;*/
/*
        let grassMaterial = new BABYLON.StandardMaterial("grassMat", scene);
        let grassTexture = new BABYLON.GrassProceduralTexture("grassTex", 256, scene);
        grassMaterial.ambientTexture = grassTexture;
*/
        // TODO : try to fix
        /*let fireTexture = new FireMaterial("fire", scene);
        fireMaterial.diffuseTexture = fireTexture;
        fireMaterial.opacityTexture = fireTexture;*/

        const leafMaterial = new StandardMaterial("leafMaterial", scene);
        leafMaterial.diffuseColor = new Color3(0.5, 0.65, 0.5);



        let fire = new FireMaterial("fire", scene);
        fire.diffuseTexture = new Texture("textures/fire.png", scene);
        fire.distortionTexture = new Texture("textures/distortion.png", scene);
        fire.opacityTexture = new Texture("textures/candleopacity.png", scene);
        fire.speed = 5.0;
/**********************************************************************************/


/***********************************SKYBOX*********************************/


    new PhotoDome("sky", "img/blueSky.jpg", { resolution: 32, size: 10000 }, scene);

	    
        // Fog
        // TODO : activate fog and make it more intense when i get further in the race
    //scene.fogMode = Scene.FOGMODE_EXP;

    //scene.fogColor = new BABYLON.Color3(0.9, 0.88, 0.85);
    //scene.fogDensity = 0.001;

    /*const grassText = new BABYLON.StandardMaterial("grassText");
    grassText.diffuseTexture = fireTexture;*/

    /**********************************************ARBRES***********************************************/
  
 
    /*for (let i=0; i<60; i++){
        let r = randomNumber(-450,450);
        const t = QuickTreeGenerator(80, 60, 15, woodMaterial, leafMaterial, scene);
        t.position = new Vector3(-r, 15, 20*i-5*r);
        const t1 = QuickTreeGenerator(80, 60, 15, woodMaterial, fire, scene);
        t1.position = new Vector3(r, 15, 20*i-5*r);

        t1.checkCollisions = true;
        t.checkCollisions = true;
    }*/

    /******************************************************************************************************************************************************/



    
    /*********************************BRANCHES*****************************************/

  

    let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

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
        end.position = new Vector3(0,3,10000);

   
    /*************************COMPTEUR*************/

    let seeds = [];
    for (let i=0; i<150; i++){
        let rn1 = randomNumber(-200,200);
        let rn2 = randomNumber(-3000,3000);
        let seed1 = Mesh.CreateSphere("seed", 3, 10, scene);
        seed1.scaling.setAll(1);
        seed1.position = new Vector3(rn1, 5, rn2);

        seeds.push(seed1);
   
    }


//à gauche
for (let i=0; i<40;i+=4){
    for (let j=0; j<2;j++){
        const t = QuickTreeGenerator(50, 35, 15, woodMaterial, leafMaterial, scene);
        //t.position = new BABYLON.Vector3(-200+20*j, 15, -400+20*i);
        t.position = new Vector3(-200+20*j, 15, -400+20*i);
        const t1 = QuickTreeGenerator(50, 35, 15, woodMaterial, leafMaterial, scene);
        //t1.position = new BABYLON.Vector3(-200, 15, -400+20*j*i);
        t1.position = new Vector3(-200, 15, -400+20*j*i);
    }
}

//à droite
for (let i=0; i<40;i+=4){
    for (let j=0; j<2;j++){
        const t = QuickTreeGenerator(50, 35, 15, woodMaterial, leafMaterial, scene);
        //t.position = new BABYLON.Vector3(200-20*j, 15, -400+20*i);
        t.position = new Vector3(200-20*j, 15, -400+20*i);
    
    const t1 = QuickTreeGenerator(50, 35, 15, woodMaterial, leafMaterial, scene);
    //t1.position = new BABYLON.Vector3(200, 15, -400+20*j*i);
    t1.position = new Vector3(200, 15, -400+20*j*i);
    }
}

///// QUIZ BOXES ////////////////////////

const createQuizBoxes = function(scene) {
    const numberOfBoxes = 10; // Adjust as needed
    const spacing = 300; // Adjust as needed
    const minZ = 220; // Minimum Z-coordinate
    const maxZ = 600; // Maximum Z-coordinate

    const quizBoxes = [];

    // Create little boxes with randomized positions along a line
    for (let i = 0; i < numberOfBoxes; i++) {
        // Generate a random Z-coordinate for each box
        const randomZ = Math.random() * (maxZ - minZ) + minZ;

        // Calculate the position based on the randomized Z-coordinate
        const position = new Vector3(-100, 0, randomZ + i * spacing);

        // Create and position the box
        const box = MeshBuilder.CreateBox(`quizBox${i}`, { size: 10 }, scene);
        box.position = position;
        quizBoxes.push(box);
    }

    return quizBoxes;
};

// Call the function to create quiz boxes
const quizBoxes = createQuizBoxes(scene);



////////////////////////////////////////


////////////////////////////////////////////

/*const createRunningTrack = function(scene) {
    // Define the positions of the trees along the Z-axis
    const treePositions = [
        -400, -200, -100, -50, 0, 50, 100, 200, 400 // Adjust these values based on your scene
    ];

    // Create lines between the trees
    for (let i = 0; i < treePositions.length - 1; i++) {
        //const startPos = new Vector3(0, 0, treePositions[i] - 200); // Start position of the line, extended along the Z-axis
        const startPos = new Vector3(0,0,-300);
        const endPos = new Vector3(0, 0, treePositions[i + 1] + 100); // End position of the line, extended along the Z-axis

        // Calculate the X position for the line to be in the middle between the trees
        const xPos = (startPos.z + endPos.z) / 2;

        // Create the line between two trees
        const line = MeshBuilder.CreateLines("line" + i, { points: [startPos, endPos] }, scene);

        // Set the position of the line
        line.position = new Vector3(xPos+40, 0.1, 0); // Adjust the Y position as needed

        // Customize the appearance of the line here, such as color or material
        // For example:
        // line.color = new Color3(1, 1, 1); // White color
    }
};*/

const createRunningTrack = function(scene) {
    // Define the positions of the trees along the Z-axis
    const treePositions = [
        -400, -200, -100, -50, 0, 50, 100, 200, 400 // Adjust these values based on your scene
    ];

    // Create lines between the trees
    for (let i = 0; i < treePositions.length - 1; i++) {
        const startPos = new Vector3(treePositions[i], 0, -300); // Start position of the line, extended along the Z-axis
        const endPos = new Vector3(treePositions[i + 1], 0, 300); // End position of the line, extended along the Z-axis

        // Calculate the X position for the line to be in the middle between the trees
        const xPos = (startPos.x + endPos.x) / 2;

        // Create the line between two trees
        const line = MeshBuilder.CreateLines("line" + i, { points: [startPos, endPos] }, scene);

        // Set the position of the line
        line.position = new Vector3(xPos + 200, 0.1, 0); // Adjust the Y position as needed

        // Customize the appearance of the line here, such as color or material
        // For example:
        // line.color = new Color3(1, 1, 1); // White color
    }
};

// Call the function to create the running track
createRunningTrack(scene); // Assuming `scene` is already defined in your code





    //////////////////////////////////////////

const addCharacterWithMouvement = function(scene, meshes, seeds, barriers,quizBoxes, end){ //async


    /********************************************************************************************************/
    SceneLoader.ImportMesh("", "models/", "player.glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {
        const character: AbstractMesh = newMeshes[0];
        character.position = new Vector3(9, 0, -300);
        character.scaling.scaleInPlace(2);
        camera.target = character.position;
        character.checkCollisions = true;
        



    
        const ground = MeshBuilder.CreateGround("ground", { width: 6000, height: 10000 }, scene);

        const grassTexture = new Texture("img/grass.jpg", scene);
        const groundMaterial = new StandardMaterial("groundMaterial", scene);
        //groundMaterial.diffuseTexture = grassTexture;
        groundMaterial.diffuseColor  = new Color3(0.7, 0.2, 0.1);
        ground.material = groundMaterial; // Assign the grass material to the ground
        ground.checkCollisions = true;

   
        let inputMap = {}  
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
    
            let keydown = false;
            if (inputMap["rightArrow"]) {
                character.position.x+=0.35;
                keydown = true;
            }
            if (inputMap["leftArrow"]) {
                character.position.x-=0.35;
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
                    for (let i=0; i<meshes.length; i++){
                            if (meshes[i].intersectsMesh(character, false)) {
                                //character.position = new Vector3(9, 0, -300);
                               // TODO : add a point
                                
                                for (let j=0; j<meshes.length; j++){
                                    meshes[j].dispose(); // make the object disappear
                                    
                                }
                            }
                    }

                    // TODO : if you hit a seed, add points but adapt selon l'objet
                        for (let i=0; i<seeds.length; i++){
                            if (seeds[i].intersectsMesh(character, false)) {
                                seeds[i].dispose();
                                App.addPoints(1);
                                seeds.splice(i,1);
                                
                            }
                        }

                        // BARRIERS //
                        for (let j=0; j<barriers.length; j++){
                            if (barriers[j].getChildMeshes()[0].intersectsMesh(character, false)) {
                                App.addPoints(-1);
                                barriers[j].getChildMeshes()[0].isVisible = false;
                                barriers.splice(j,1);
                            }
                        }  

                        for(let j=0; j<quizBoxes.length ; j++){
                            if (quizBoxes[j].intersectsMesh(character, false)) {
                                                               
                                camera.detachControl();
                                scene.animationGroups.forEach((animationGroup) => {
                                    animationGroup.pause();
                                });
                                scene.meshes.forEach((mesh) => {
                                    mesh.freezeWorldMatrix();
                                });
                                                   //
                                displayQuiz();
                                quizBoxes[j].isVisible = false;
                                quizBoxes.splice(j,1);
                                
                            }
                        }
                });
            });

    });
}

let clonedMeshes = [];

// Eiffel tower
// Load and position the model "toureff.glb"
SceneLoader.ImportMesh("", "models/toureff.glb", "", scene, function (newMeshes) {
    const tower = newMeshes[0]; // Assuming there's only one mesh in the imported model
    // Adjust the position of the tower
    tower.position = new Vector3(150, 0, 800); // Adjust the Z position to place it further than the trees
    // Make the tower large
    tower.scaling = new Vector3(40, 40, 40); // Adjust the scaling factor as needed
});


// Load and position barriers
SceneLoader.ImportMesh("", "models/RoadBlockade.glb", "", scene, function(meshes) {
    let originalMesh = meshes[0];
    //let clonedMeshes = [];

    for (let i = 0; i < 100; i++) {
        let clonedMesh = originalMesh.clone("bad_" + i,null);
        clonedMesh.scaling = new Vector3(10, 10, 10);
        clonedMesh.checkCollisions = true;

        let rn1 = randomNumber(-200,200);
        let rn2 = randomNumber(-3000,3000);
        clonedMesh.position = new Vector3(rn1,0, rn2);

        clonedMeshes.push(clonedMesh);
    }

    originalMesh.dispose();

    let minX = -200;
    let maxX = 200;
    let minZ = -3000;
    let maxZ = 3000;



    function posRandom(meshes, minX, maxX, minZ, maxZ) {
        meshes.forEach(function(mesh) {
            let randomX = minX + Math.random() * (maxX - minX);
            let randomZ = minZ + Math.random() * (maxZ - minZ);
            mesh.position = new Vector3(randomZ, 0, randomX);
        });
    }

    //posRandom(clonedMeshes, minX, maxX, minZ, maxZ);

    return clonedMeshes;
});

async function displayQuiz() {
    let advancedTexture : AdvancedDynamicTexture = AdvancedDynamicTexture.CreateFullscreenUI("popup", true, scene);
    await advancedTexture.parseFromSnippetAsync("2T136X#8");
    let textBlock=advancedTexture.getControlByName("question");
    textBlock.isVisible=true;
    let reponse1=advancedTexture.getControlByName("reponse1");
    reponse1.isVisible=true;
    let reponse2=advancedTexture.getControlByName("reponse2");
    reponse2.isVisible=true;
    let reponse3=advancedTexture.getControlByName("reponse3");
    reponse3.isVisible=true;
    let message=advancedTexture.getControlByName("message");
    message.isVisible=false;
    let reponseCorrect;

    fetch('/models/questionnaire.json')
  .then(response => response.json())
  .then(data => {
    // Analyser le JSON
    const jsonData = data;
    console.log(jsonData);
    const randomQuestion=Math.floor(Math.random() * 17) + 1;
    const quizzObject=jsonData[""+randomQuestion];
    const question=quizzObject.question;
    reponseCorrect=quizzObject.correct;
    const reponseA=quizzObject.a;
    const reponseB=quizzObject.b;

    if (textBlock instanceof TextBlock) textBlock.text = question;
    if(reponse1 instanceof Button) reponse1.textBlock.text= reponseCorrect;
    if(reponse2 instanceof Button) reponse2.textBlock.text= reponseA;
    if(reponse3 instanceof Button) reponse3.textBlock.text= reponseB;
  })
  .catch(error => {
    console.error('Une erreur s\'est produite lors du chargement du fichier JSON :', error);
  });

  reponse1.onPointerDownObservable.add(() => {
    enableButtons(reponse1,reponse2,reponse3);
    if ((reponse1 instanceof Button) && (reponse1.textBlock.text==reponseCorrect)){
        sentMessage(true,reponseCorrect,message,advancedTexture);
    }else {
        sentMessage(false,reponseCorrect,message,advancedTexture);
    }

   
  });

  reponse2.onPointerDownObservable.add(() => {
    enableButtons(reponse1,reponse2,reponse3);
    if ((reponse2 instanceof Button) && (reponse2.textBlock.text==reponseCorrect)){
        sentMessage(true,reponseCorrect,message,advancedTexture);
    }else {
        sentMessage(false,reponseCorrect,message,advancedTexture);
    }

    
  });

  reponse3.onPointerDownObservable.add(() => {
   enableButtons(reponse1,reponse2,reponse3);

    if ( (reponse3 instanceof Button) && (reponse3.textBlock.text==reponseCorrect)){
        sentMessage(true,reponseCorrect,message,advancedTexture);
    }else {
        sentMessage(false,reponseCorrect,message,advancedTexture);
    }

    
  });


}

function sentMessage(boolean,reponseCorrecte,message,advancedTexture){
    if(message instanceof TextBlock){
        message.isVisible=true;
        if(boolean==true){
            message.text="Bravo vous avez trouvé la bonne réponse. Vous gagnez 5 points supplémentaires!"
            message.color="green";
            App.addPoints(5);
            setTimeout(() => {
                message.isVisible = false;
                advancedTexture.dispose();
            }, 7000);
        }else{
            message.text="Raté! La bonne réponse était "+ reponseCorrecte + ". Vous perdez 3 points.";
            message.color="red";
            App.addPoints(-3);
            setTimeout(() => {
                message.isVisible = false;
                advancedTexture.dispose();
            }, 7000);
        }
    }
    

}

function enableButtons(button1,button2,button3){
    if((button1 instanceof Button) && (button2 instanceof Button) && (button3 instanceof Button)){
    button1.isEnabled=false;
    button2.isEnabled=false;
    button3.isEnabled=false;
    }
}





// Call createBarriers function only once during scene initialization



     /********************************************************************************************************************/
     addCharacterWithMouvement(scene, meshes, seeds, clonedMeshes,quizBoxes, end);


return scene;
       
}


