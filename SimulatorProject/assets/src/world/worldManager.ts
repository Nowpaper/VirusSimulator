import { _decorator, Component, Node, instantiate } from 'cc';
import { personBase } from '../person/personBase';
import { placeBase } from '../place/placeBase';
import { AiVisit } from '../ai/AiVisit';
import { worldLogic } from './worldLogic';
import { virusManager } from '../virus/virusManager';
import { Common, WorldManagerSetting } from '../Common';
import { virusBase } from '../virus/virusBase';
import { SettingData } from '../SettingData';
const { ccclass, property } = _decorator;

@ccclass('worldManager')
export class worldManager extends Component {
    
    @property({type:WorldManagerSetting})
    setting:WorldManagerSetting = new WorldManagerSetting();

    personIdCount: number = 0;
    persons: personBase[] = [];
    places: placeBase[] = [];
    deadList: personBase[] = [];
    start() {
        if (SettingData.worldManagerSetting) {
            this.setting = SettingData.worldManagerSetting;
        }
    }
    diePerson(person: personBase) {
        // 死亡体应该取消掉
        let virus = person.node.getChildByName('body').getComponentInChildren(virusBase);
        virus.node.destroy();

        this.removePerson(person);
        for (let c of person.node.components) {
            c.enabled = false;
        }
        // 是不是将他们放在一个特殊的地方呢？
        person.node.parent = null;

    }
    addPerson(person: personBase) {
        person.ID = this.personIdCount += 1;
        this.persons.push(person);
        if (this.setting.personHealthDis > 0) {
            person.health = Common.getNumberInNormalDistribution(this.setting.personHealth, this.setting.personHealthDis);
        } else {
            person.health = this.setting.personHealth;
        }
        person.resistance = this.setting.personResistance;
        if (Math.random() < this.setting.OutRatio / 2) {
            this.addAiVisit(person);
        }
        if (this.setting.startVirus > 0) {
            this.setting.startVirus -= 1;
            let vManager = this.getComponent(virusManager);
            if (vManager) {
                vManager.createOne(person);
            }
        }
    }
    removePerson(person: personBase) {
        let index = this.persons.indexOf(person);
        if (index >= 0) {
            this.persons.splice(index, 1);
        }
        this.deadList.push(person);
    }
    private timer = 0;
    update(deltaTime: number) {
        this.timer += deltaTime * worldLogic.timeRate;
        if (this.timer >= 1) {
            this.timer = Math.random() * 0.2 + 1.8;
            let standPersons = this.checkStandPersons();
            let p = (this.persons.length - standPersons.length) / this.persons.length;
            if (p < this.setting.OutRatio) {
                //如果小于出行比率则添加一个出行人
                let person: personBase;
                do {
                    person = standPersons[Math.floor(Math.random() * standPersons.length)];
                } while (person.getComponent(AiVisit) || person.node.parent.name == 'world');
                this.addAiVisit(person);
            }
        }
    }
    private checkStandPersons(): personBase[] {
        let ret: personBase[] = [];
        for (let person of this.persons) {
            if (!person.getComponent(AiVisit)) {
                ret.push(person);
            }
        }
        return ret;
    }
    addAiVisit(person: personBase) {
        if (Math.random() > person.desireOut) {
            person.addComponent(AiVisit);
        }
    }
    removeAiVisit(person: Node) {
        person.removeComponent(AiVisit);
    }
}
