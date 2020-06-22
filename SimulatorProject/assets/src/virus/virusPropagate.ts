import { _decorator, Component, Node, find, systemEvent } from 'cc';
import { virusManager } from './virusManager';
import { worldLogic } from '../world/worldLogic';
const { ccclass, property } = _decorator;

@ccclass('virusPropagate')
export class virusPropagate extends Component {

    // 散播的能力
    // 每次的个数
    @property
    count = 1;
    // 复制投射的时间差
    @property
    timespan = 1;

    time = 0;

    start() {
        // Your initialization goes here.
    }

    update(deltaTime: number) {

        this.time += deltaTime * worldLogic.timeRate;
        if (this.time >= this.timespan * (1 + Math.random() * 0.2)) {
            this.time = 0;
            systemEvent.emit(virusManager.BrithOneVirus, this.node);
            // let world = find('world');
            // if(world){
            //     for (let i = 0; i < this.count; i++) {
            //         world.getComponent(virusManager).brithOne(this.node);
            //     }
            // }
        }
    }
}
