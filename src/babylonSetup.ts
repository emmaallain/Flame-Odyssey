import { Engine, Scene, Color4 } from "@babylonjs/core";

export interface BabylonSetup {
    engine: Engine;
    scene: Scene;
    canvas: HTMLCanvasElement;
}

export const createBabylonSetup = (): BabylonSetup => {
    const canvas = createCanvas();
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);
    scene.clearColor = new Color4(255, 255, 30, 1);

    // Additional setup code if needed

    return { engine, scene, canvas };
};

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
