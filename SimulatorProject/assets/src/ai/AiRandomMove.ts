import { _decorator, Component, Node, JointUniformCapacity } from 'cc';
import { worldLogic } from '../world/worldLogic';
import { AiMoveTo } from './AiMoveTo';
import { placeBase } from '../place/placeBase';
const { ccclass, property } = _decorator;

@ccclass('AiRandomMove')
export class AiRandomMove extends Component {
    time: number = 1;
    start() {
        // Your initialization goes here.
    }

    update(deltaTime: number) {
        if(!this.enabled) {this.time = 1;return;};
        this.time -= deltaTime * worldLogic.timeRate;
        if (this.time <= 0) {
            if (this.getComponent(AiMoveTo)) {
                if (this.node.parent.getComponent(placeBase)) {
                    let size = this.node.parent.getComponent(placeBase).size;
                    this.time = this.getComponent(AiMoveTo).moveTo(
                        size * (Math.random() * 2 - 1),
                        size * (Math.random() * 2 - 1),
                        size * (Math.random() * 2 - 1)
                    );
                } else {
                    this.time = 10;
                }
            } else {
                this.time = 999999;
            }
        }
    }
}
