import { _decorator, Component, Node, CCObject, Vec3, v3, find } from 'cc';
import { worldLogic } from '../world/worldLogic';
import { Common } from '../Common';
const { ccclass, property } = _decorator;

@ccclass('AiMoveTo')
export class AiMoveTo extends Component {
    public static MoveToComplated = 'MoveToComplated';
    private costTime = 0;
    private sumTime = 0;
    private beginPostition: Vec3 = null;
    private moveVector: Vec3 = null;
    // 相当于 1秒=现实中10分钟 5公里/小时 10分钟走 5/6
    speed: number = 1;
    start() {
        // Your initialization goes here.
        this.speed = 5 / 6;//
    }
    private currentTag;
    moveTo(x: number, y: number, z: number,tag = null): number {
        this.speed = (5/6) / Math.pow(10,AiMoveTo.getSpeedRate(this.node));
        this.beginPostition = this.node.position.clone();
        let sub = v3(x, y, z).subtract(this.node.position);
        let len = v3(x, y, z).subtract(this.node.position).length();
        this.moveVector = sub;
        this.costTime = 0;
        this.sumTime = len / this.speed;
        this.currentTag = tag;
        return this.sumTime;
    }
    update(deltaTime: number) {
        if (this.moveVector) {
            if (this.costTime >= this.sumTime) {
                this.moveVector = null;
                this.node.emit(AiMoveTo.MoveToComplated,this.currentTag);
            } else {
                this.costTime += deltaTime * worldLogic.timeRate;
                let p = this.costTime / this.sumTime;
                p = Common.sinInOut(p);
                let position = this.moveVector.clone().multiplyScalar(p).add(this.beginPostition);
                this.node.setPosition(position);
            }
        }
    }
    static getSpeedRate(node:Node):number{
        if(node.parent && node.parent.name != 'world'){
            return AiMoveTo.getSpeedRate(node.parent) + 1;
        }else{
            return 0;
        }
        
    }
}
