//imports
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, FreeCamera, LightBlock, GetEnvironmentBRDFTexture, Color4, ShadowGenerator, TransformNode } from "@babylonjs/core";


export class Player extends TransformNode {
    public camera;
    public scene: Scene;
    private input;

    //Player
    public mesh: Mesh; //outer collisionbox of player

    constructor(assets, scene: Scene, shadowGenerator: ShadowGenerator, input?) {
        super("player", scene);
        this.scene = scene;
        this.setupPlayerCamera();

        this.mesh = assets.mesh;
        this.mesh.parent = this;

        shadowGenerator.addShadowCaster(assets.mesh); //the player mesh will cast shadows

        this.input = input; //inputs we will get from inputController.ts
    }

    private setupPlayerCamera() {
        var camera4 = new ArcRotateCamera("arc", -Math.PI/2, Math.PI/2, 40, new Vector3(0,3,0), this.scene);
    }
}