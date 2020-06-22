import { _decorator, Component, Node, math } from 'cc';
import { placeBase } from '../place/placeBase';
import { personBase } from '../person/personBase';
import { virusBase } from './virusBase';
import { worldLogic } from '../world/worldLogic';
import { LightHint } from '../../prefabs/light-hint/light-hint';
const { ccclass, property } = _decorator;

@ccclass('virusInfect')
export class virusInfect extends Component {

    // 病毒的传染能力

    //检查的距离
    @property
    distance = 0.5;
    // 感染率
    @property({ slide: true, range: [0, 1, 0.01],tooltip:'感染率，它在感染到目标的之前所判定的概率' })
    rate = 1;

    start() {
        // Your initialization goes here.
    }
    //为了减轻压力，让它0.1秒才检查一下周围的数据
    private time = 0;
    update(deltaTime: number) {
        this.time += deltaTime * worldLogic.timeRate;
        if (this.time >= 0.1 && this.node.parent) {
            this.time = 0;
            // 取得空间的抑制率
            let placecontagion = 1;
            if(this.node.parent.getComponent(placeBase)){
                placecontagion = this.node.parent.getComponent(placeBase).contagion;
            }
            if (Math.random() < this.rate * placecontagion) {
                let currentPlace = this.node.parent.getComponent(placeBase);
                if (currentPlace) {
                    let persons = currentPlace.node.getComponentsInChildren(personBase);
                    for (let person of persons) {
                        //如果已经被感染则不会被感染了
                        if (person.getComponentInChildren(virusBase)) {
                            continue;
                        }
                        let d = person.node.position.clone().subtract(this.node.position).length();
                        if (d < this.distance) {
                            //检查抵抗率
                            if (Math.random() > person.resistance) {
                                //该病毒进入到载体内
                                this.node.parent = person.node.getChildByName('body');
                                this.node.setPosition(0, 0, 0);
                                if(this.node.getChildByName('light-hint')){
                                    this.node.getChildByName('light-hint').getComponent(LightHint).faceToCamera = false;
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}
