//imports
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, FreeCamera, LightBlock, GetEnvironmentBRDFTexture, Color4 } from "@babylonjs/core";


export class Environnement {
    private _scene: Scene;

    constructor(scene: Scene) {
        this._scene = scene;
    }

    public async load() {
        var ground = MeshBuilder.CreateBox("ground", { size:  100}, this._scene);
        ground.scaling = new Vector3(1,.02,1);
    }
}