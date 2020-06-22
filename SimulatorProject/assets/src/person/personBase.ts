import { _decorator, Component, Node, CCObject, find, ModelComponent, color } from 'cc';
import { worldManager } from '../world/worldManager';
import { LightHint } from '../../prefabs/light-hint/light-hint';
import { virusBase } from '../virus/virusBase';
const { ccclass, property } = _decorator;


@ccclass('personBase')
export class personBase extends Component {
    ID: number = 0;
    placeNode: Node = null;
    //抵抗力，能有多大机会抵抗掉病毒
    @property({ slide: true, range: [0, 1, 0.01],tooltip:'抵抗力，能有多大机会抵抗掉病毒' })
    resistance: number = 0;
    @property({ slide: true, range: [0, 1, 0.01],tooltip:'外出意愿，0为非常渴望，1为被隔离，中间值为判定随机' })
    desireOut: number = 0;
    //健康
    @property({ tooltip: "2016相当于一个均值，14天" })
    health: number = 144;
    // 用来标记是否来自袭击了
    attacked = false;
    cutHealth(value, from: Node) {
        this._health -= value;
        if (this._health <= 0) {
            //死亡
            find('world').getComponent(worldManager).diePerson(this);
        }
        if (from) {
            if (from.getComponent(virusBase)) {
                this.attacked = true;                
            }
        }
        //一旦生病了外出的意愿就会降低，随着健康下降，将越来越降低出行欲望，达到一半的健康时候根本就不想出去
        if(this.attacked){
            this.desireOut = 0.5 + (1 - (this._health / this.health));
        }
    }
    private bodylight: LightHint = null;
    private _health = 0;
    setHealth(hp) {
        this._health = this.health = hp;
    }
    start() {
        // Your initialization goes here.
        find('world').getComponent(worldManager).addPerson(this);
        this.setHealth(this.health);
        this.bodylight = this.node.getChildByName('body').getComponent(LightHint);
    }
    onDestroy() {
        find('world').getComponent(worldManager).removePerson(this);        
        if(this.bodylight){
            this.bodylight.node.removeAllChildren();
        }
        this.node.removeAllChildren();
        this.bodylight = this.placeNode = null;
    }
    update(deltaTime: number) {
        if (this.attacked) {
            this.bodylight.setColor(color(255 * (this._health / this.health), 0, 0, 255));
        } else if (this._health != this.health) {
            this.bodylight.setColor(color(255 * (this._health / this.health), 255 * (this._health / this.health), 255 * (this._health / this.health), 255));
        }
        // 
    }
}
