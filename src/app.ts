//imports
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { AdvancedDynamicTexture, StackPanel, Button, TextBlock, Rectangle, Control, Image } from "@babylonjs/gui";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, FreeCamera, LightBlock, GetEnvironmentBRDFTexture, Color4,Matrix, Color3,Quaternion, StandardMaterial, ShadowGenerator, PointLight } from "@babylonjs/core";
import { Environnement } from "./environnement";
import { Player } from "./characterController";

//enum for states
enum State { START = 0, GAME = 1, LOSE = 2, CUTSCENE = 3 }

class App {

    // General Entire Application
    private scene: Scene;
    private canvas: HTMLCanvasElement;
    private engine: Engine;
    private gamescene: Scene;
    private cutScene: Scene;
    private state: number = 0;
    private environnement: Environnement;
    public assets;
    private player : Player;

    constructor() {
        // create the canvas html element and attach it to the webpage
        this.canvas= this.createCanvas();
        
        // initialize babylon scene and engine
        this.engine = new Engine(this.canvas, true);
        this.scene = new Scene(this.engine);
        this.scene.clearColor = new Color4(255, 255, 30, 1);


        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'i') {
                if (this.scene.debugLayer.isVisible()) {
                    this.scene.debugLayer.hide();
                } else {
                    this.scene.debugLayer.show();
                }
            }
        });

      
        this.main();
    }

    private async main(): Promise<void> {
        await this.goToStart();
    
        // Register a render loop to repeatedly render the scene
        this.engine.runRenderLoop(() => {
            switch (this.state) {
                case State.START:
                    this.scene.render();
                    break;
                case State.CUTSCENE:
                    this.scene.render();
                    break;
                case State.GAME:
                    this.scene.render();
                    break;
                case State.LOSE:
                    this.scene.render();
                    break;
                default: break;
            }
        });
    
        //resize if the screen is resized/rotated
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }

    //set up the canvas
    private createCanvas(): HTMLCanvasElement {
        //Commented out for development
        document.documentElement.style["overflow"] = "hidden";
        document.documentElement.style.overflow = "hidden";
        document.documentElement.style.width = "100%";
        document.documentElement.style.height = "100%";
        document.documentElement.style.margin = "0";
        document.documentElement.style.padding = "0";
        document.body.style.overflow = "hidden";
        document.body.style.width = "100%";
        document.body.style.height = "100%";
        document.body.style.margin = "0";
        document.body.style.padding = "0";

        //create the canvas html element and attach it to the webpage
        this.canvas = document.createElement("canvas");
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.canvas.style.color= 
        this.canvas.id = "gameCanvas";
        document.body.appendChild(this.canvas);
        return this.canvas;
    }

    private async goToStart(){
        this.engine.displayLoadingUI();
        this.scene.detachControl();
        let sceneOne = new Scene(this.engine);
        sceneOne.clearColor = new Color4(0 ,0, 0, 1);
        let cameraOne = new FreeCamera("camera1", new Vector3(0, 0, 0), sceneOne);
        cameraOne.setTarget(Vector3.Zero());


                //create a fullscreen ui for all of our GUI elements
        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        guiMenu.idealHeight = 720; //fit our fullscreen ui to this height

        //create a simple button
        const startBtn = Button.CreateSimpleButton("start", "PLAY");
        startBtn.width = 0.2;
        startBtn.height = "40px";
        startBtn.color = "red";
        startBtn.top = "-14px";
        startBtn.thickness = 0;
        startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        guiMenu.addControl(startBtn);

        //this handles interactions with the start button attached to the scene
        startBtn.onPointerDownObservable.add(() => {
            this.goToCutScene();
            sceneOne.detachControl(); //observables disabled
        });

        
        //--SCENE FINISHED LOADING--
        await sceneOne.whenReadyAsync();
        this.engine.hideLoadingUI();
        //lastly set the current state to the start state and set the scene to the start scene
        this.scene.dispose();
        this.scene = sceneOne;
        this.state = State.START;

        
    }

        private async goToLose(): Promise<void>{
        this.engine.displayLoadingUI();

        //--SCENE SETUP--
        this.scene.detachControl();
        let scene = new Scene(this.engine);
        scene.clearColor = new Color4(0, 0, 0, 1);
        let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), scene);
        camera.setTarget(Vector3.Zero());

        //--GUI--
        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const mainBtn = Button.CreateSimpleButton("mainmenu", "MAIN MENU");
        mainBtn.width = 0.2;
        mainBtn.height = "40px";
        mainBtn.color = "white";
        guiMenu.addControl(mainBtn);
        //this handles interactions with the start button attached to the scene
        mainBtn.onPointerUpObservable.add(() => {
            this.goToStart();
        });

        //--SCENE FINISHED LOADING--
        await scene.whenReadyAsync();
        this.engine.hideLoadingUI(); //when the scene is ready, hide loading
        //lastly set the current state to the lose state and set the scene to the lose scene
        this.scene.dispose();
        this.scene = scene;
        this.state = State.LOSE;
        }

        private async goToCutScene(): Promise<void>{
                this.engine.displayLoadingUI();
            //--SETUP SCENE--
            //dont detect any inputs from this ui while the game is loading
            this.scene.detachControl();
            this.cutScene = new Scene(this.engine);
            let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), this.cutScene);
            camera.setTarget(Vector3.Zero());
            this.cutScene.clearColor = new Color4(255, 255, 255, 1);

            //--GUI--
            const cutScene = AdvancedDynamicTexture.CreateFullscreenUI("cutscene");
            

                        //--PROGRESS DIALOGUE--
            const next = Button.CreateSimpleButton("next", "NEXT");
            next.color = "red";
            next.thickness = 0;
            next.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
            next.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
            next.width = "64px";
            next.height = "64px";
            next.top = "-3%";
            next.left = "-12%";
            cutScene.addControl(next);

            next.onPointerUpObservable.add(() => {
                this.goToGame();
            });

                //--WHEN SCENE IS FINISHED LOADING--
            await this.cutScene.whenReadyAsync();
            this.engine.hideLoadingUI();
            this.scene.dispose();
            this.state = State.CUTSCENE;
            this.scene = this.cutScene;

            var finishedLoading = false;
            await this.setUpGame().then((res) => {
                finishedLoading = true;
            });
        }

        private async setUpGame() { //async
            //--CREATE SCENE--
            let scene = new Scene(this.engine);
            this.gamescene = scene;

            //--CREATE ENVIRONMENT--
            const environnement = new Environnement(scene);
            this.environnement = environnement; //class variable for App
            await this.environnement.load(); //environment
            await this.loadCharacterAssets(scene);
    
        }

        private async loadCharacterAssets(scene){
            //we're setting up the character mesh system.
            async function loadCharacter(){
                //collision mesh
                const outer = MeshBuilder.CreateBox("outer", { width: 2, depth: 1, height: 3 }, scene);
                outer.isVisible = false;
                outer.isPickable = false;
                outer.checkCollisions = true;

                //move origin of box collider to the bottom of the mesh (to match imported player mesh)
                outer.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0));

                //for collisions
                outer.ellipsoid = new Vector3(1, 1.5, 1);
                outer.ellipsoidOffset = new Vector3(0, 1.5, 0);

                outer.rotationQuaternion = new Quaternion(0, 1, 0, 0); // rotate the player mesh 180 since we want to see the back of the player
                
                //Création de la moustache du perso
                var box = MeshBuilder.CreateBox("Small1", { width: 0.5, depth: 0.5, height: 0.25, faceColors: [new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1)] }, scene);
                box.position.y = 1.5;
                box.position.z = 1;
                //création du corps 
                var body = Mesh.CreateCylinder("body", 3, 2, 2, 0, 0, scene);
                var bodymtl = new StandardMaterial("red", scene);
                bodymtl.diffuseColor = new Color3(0.8, 0.5, 0.5); //couleur du body du personnage
                body.material = bodymtl;
                body.isPickable = false;
                body.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0)); // simulates the imported mesh's origin

                //parent the meshes
                box.parent = body;
                body.parent = outer;

                return {
                    mesh: outer as Mesh
                }
            }

            return loadCharacter().then((assets) => {
                this.assets = assets;
              });
        }

        private async initializeGameAsync(scene): Promise<void> {
            //temporary light to light the entire scene
            var light0 = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);
        
            const light = new PointLight("sparklight", new Vector3(0, 0, 0), scene);
            light.diffuse = new Color3(0.08627450980392157, 0.10980392156862745, 0.15294117647058825);
            light.intensity = 35;
            light.radius = 1;
        
            const shadowGenerator = new ShadowGenerator(1024, light);
            shadowGenerator.darkness = 0.4;
        
            //Create the player
            this.player = new Player(this.assets, scene, shadowGenerator); //dont have inputs yet so we dont need to pass it in
        }private async _initializeGameAsync(scene): Promise<void> {
            //temporary light to light the entire scene
            var light0 = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);
        
            const light = new PointLight("sparklight", new Vector3(0, 0, 0), scene);
            light.diffuse = new Color3(0.08627450980392157, 0.10980392156862745, 0.15294117647058825);
            light.intensity = 35;
            light.radius = 1;
        
            const shadowGenerator = new ShadowGenerator(1024, light);
            shadowGenerator.darkness = 0.4;
        
            //Create the player
            this.player = new Player(this.assets, scene, shadowGenerator); //dont have inputs yet so we dont need to pass it in
        }

        private async goToGame(){
            //--SETUP SCENE--
            this.scene.detachControl(); 
            let scene = this.gamescene;
            scene.clearColor = new Color4(0.01568627450980392, 0.01568627450980392, 0.20392156862745098); // a color that fit the overall color scheme better
            let camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
            camera.attachControl(scene, true);
            camera.setTarget(Vector3.Zero());
        
            //--GUI--
            const playerUI = AdvancedDynamicTexture.CreateFullscreenUI("UI");
            //dont detect any inputs from this ui while the game is loading
            scene.detachControl();
        
            //create a simple button
            const loseBtn = Button.CreateSimpleButton("lose", "LOSE");
            loseBtn.width = 0.2
            loseBtn.height = "40px";
            loseBtn.color = "white";
            loseBtn.top = "-14px";
            loseBtn.thickness = 0;
            loseBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
            playerUI.addControl(loseBtn);
        
            //this handles interactions with the start button attached to the scene
            loseBtn.onPointerDownObservable.add(() => {
                this.goToLose();
                scene.detachControl(); //observables disabled
            });

            //primitive character and setting
            await this._initializeGameAsync(scene);

            //--WHEN SCENE FINISHED LOADING--
            await scene.whenReadyAsync();
            scene.getMeshByName("outer").position = new Vector3(0, 3, 0);
            //temporary scene objects
           //var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 0, 0), scene);
            //var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 0.5 }, scene);
            
            //get rid of start scene, switch to gamescene and change states
            this.scene.dispose();
            this.state = State.GAME;
            this.scene = scene;
            this.engine.hideLoadingUI();
            //the game is ready, attach control back
            this.scene.attachControl();
        }
}
new App();