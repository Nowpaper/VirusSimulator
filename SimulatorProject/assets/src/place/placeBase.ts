import { _decorator, Component, Node, Prefab, instantiate, math } from 'cc';
import { worldObjects } from '../worldObjects';
import { Common } from '../Common';
import { personBase } from '../person/personBase';
import { placeLogic } from './placeLogic';
const { ccclass, property } = _decorator;

@ccclass('placeBase')
export class placeBase extends Component {
    static idCount: number = 0;
    ID: number = 0;
    @property
    visitWeight = 1;
    @property
    maxPerson = 5;
    @property({ slide: true, range: [0, 1, 0.01],tooltip:'抑制率，病毒在这个环境下被抑制的概率' })
    inhibition = 0;
    @property({ slide: true, range: [0, 1, 0.01],tooltip:'传染率，病毒在这个环境下的传染影响程度'  })
    contagion = 1;
    @property
    size: number = 0.5;
    start() {
        this.createPersons(worldObjects.personPrefab);
        this.ID = placeBase.idCount += 1;
    }
    onDestroy() {
        this.node.removeAllChildren();
    }
    createPersons(person: Prefab) {
        if(this.maxPerson <= 0){
            return;
        }
        let sum = math.random() * this.maxPerson + 1;
        for (let i = 0; i < sum; i++) {
            let add = instantiate(person) as Node;
            if(this.getComponent(placeLogic)){
                this.getComponent(placeLogic).addGameNode(add);
            }else{
                add.parent = this.node;
            }
            let x = Common.getNumberInNormalDistribution(0, this.size);
            let y = Common.getNumberInNormalDistribution(0, this.size);
            let z = Common.getNumberInNormalDistribution(0, this.size);
            add.setPosition(x, y, z);
            if (add.getComponent(personBase)) {
                add.getComponent(personBase).placeNode = this.node;
            }
        }
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}

