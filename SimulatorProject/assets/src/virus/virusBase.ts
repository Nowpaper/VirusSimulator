import { _decorator, Component, Node, find } from 'cc';
import { virusManager } from './virusManager';
import { personBase } from '../person/personBase';
import { virusPropagate } from './virusPropagate';
import { worldLogic } from '../world/worldLogic';
const { ccclass, property } = _decorator;

@ccclass('virusBase')
export class virusBase extends Component {

    ID: string = '0';
    // 存在时间，单位秒，每6秒为1小时
    @property({ tooltip: "单位秒，每6秒为1小时" })
    lifetime = 6 * 24;
    private _lifetime = 0;
    @property({ tooltip: "潜伏期，单位秒，每6秒为1小时" })
    incubation = 6 * 24 * 14;
    @property({ tooltip: "攻击力，每秒（每十分钟）抵消多少生命值" })
    attack: number = 1;
    start() {
        // Your initialization goes here.
        this._lifetime = this.lifetime;
    }
    setLifeTime(time) {
        this._lifetime = this.lifetime = time;
    }
    clearBody() {
        this.node.removeAllChildren();
    }
    onDestroy() {
        find('world').getComponent(virusManager).removeOne(this.node);
    }
    person: Node;
    update(deltaTime: number) {
        if (this.person) {
            //如果有宿主，则开始对抗它的健康数值
            if (this.incubation > 0) {
                this.incubation -= deltaTime * worldLogic.timeRate;
            } else {
                // 开始攻击
                this.person.getComponent(personBase).cutHealth(this.attack * deltaTime * worldLogic.timeRate, this.node);
            }
        } else {
            // 对宿主进行判断，如果没有宿主则不能繁殖
            let propagate = this.getComponent(virusPropagate);
            if (this.node.parent.parent.getComponent(personBase)) {
                this.person = this.node.parent.parent;
                if (propagate) {
                    propagate.enabled = true;
                }
                this.node.setScale(1, 1, 1);
            } else {
                this._lifetime -= deltaTime * worldLogic.timeRate;
                if (this._lifetime <= 0) {
                    this.node.destroy();
                } else {
                    if (propagate) {
                        propagate.enabled = false;
                    }
                    let scale = this._lifetime / this.lifetime;
                    this.node.setScale(scale, scale, scale);
                }
            }
        }
    }
}
