import { _decorator, Component, CameraComponent, Material, ModelComponent, SpotLightComponent, SphereLightComponent, Vec2, Color } from "cc";

const { ccclass, property } = _decorator;

@ccclass("LightHint")
export class LightHint extends Component {
    
    @property(Color)
    color:Color = null;
    @property
    faceToCamera:boolean = false;
    private _material: Material = null;
    private _camera: CameraComponent = null;
    onDestroy(){
        this._camera = null;
        this._material = null;
    }
    start(){
        this._camera = this.node.scene.getComponentInChildren(CameraComponent);
        this._material = this.node.getComponent(ModelComponent).material;
        this.setColor(this.color);
        this._material.setProperty('intensitySize', new Vec2(0.4, 0.4));
    }
    setColor(color){
        this._material.setProperty('color', color);
    }
    update () {
        if(this.faceToCamera){
            this.node.setWorldRotation(this._camera.node.worldRotation);
        }
    }
}

