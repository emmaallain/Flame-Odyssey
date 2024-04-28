//imports
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene } from "@babylonjs/core";
import { createMenu } from "./menu"
import { createGame } from "./game";

//enum for states
enum State { MENU = 0, GAME = 1, BOSS = 2, CUTSCENE = 3 }

function createCanvas(): HTMLCanvasElement {
    // Set up document styles
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

    // Create the canvas HTML element and attach it to the webpage
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.id = "gameCanvas";
    document.body.appendChild(canvas);

    return canvas;
}

export default class App {

    // General Entire Application
    private scene: Scene;
    public static engine: Engine;
    public static canvas: HTMLCanvasElement;
    public static state: number = 0;
    public assets;
    private sceneMenu : Scene;
    private sceneGame : Scene;

    constructor() {
        
        const canvas = createCanvas();
        App.engine = new Engine(canvas, true);
        //this.engine = engine;
        this.scene = new Scene(App.engine);

        this.sceneMenu = createMenu();
        //this.sceneGame = createGame();



        // hide/show the Inspector
        /*window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'i') {
                if (this.scene.debugLayer.isVisible()) {
                    this.scene.debugLayer.hide();
                } else {
                    this.scene.debugLayer.show();
                }
            }
        });*/


        this.main();
    }

    

    private async main(): Promise<void> {    
        createGame().then((sceneGame) => {
        App.engine.runRenderLoop(() => {
            switch (App.state) {
                case State.MENU:
                    sceneGame.detachControl();
                    this.sceneMenu.attachControl();
                    this.sceneMenu.render();
                    break;
                case State.GAME:
                    this.sceneMenu.detachControl();
                    sceneGame.attachControl();
                    sceneGame.render();
                    break;
                case State.BOSS:
                    this.scene.render();
                    break;
                default: break;
            }
        });
    
        //resize if the screen is resized/rotated
        window.addEventListener('resize', () => {
            App.engine.resize();
        });
    }
        )};

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
        App.canvas = document.createElement("canvas");
        App.canvas.style.width = "100%";
        App.canvas.style.height = "100%";
        App.canvas.style.color= 
        App.canvas.id = "gameCanvas";
        document.body.appendChild(App.canvas);
        return App.canvas;
    }

}
new App();