import { _decorator, Component, Node, Prefab, instantiate, systemEvent } from 'cc';
import { virusBase } from './virusBase';
import { personBase } from '../person/personBase';
import { placeBase } from '../place/placeBase';
import { virusPropagate } from './virusPropagate';
import { virusInfect } from './virusInfect';
import { VirusManagerData } from '../Common';
import { SettingData } from '../SettingData';
const { ccclass, property } = _decorator;

@ccclass('virusManager')
export class virusManager extends Component {
    public static BrithOneVirus = 'BrithOneVirus';

    //它是挂载在世界节点上的
    @property({type:VirusManagerData})
    setting:VirusManagerData = new VirusManagerData();

    list: Node[] = [];
    start() {
        
        if (SettingData.virusManagerData) {
            SettingData.virusManagerData.virusPrefab = this.setting.virusPrefab;
            this.setting = SettingData.virusManagerData;
        }
        cc.systemEvent.on(virusManager.BrithOneVirus,this.onBrithOneVirus,this);
    }
    private onBrithOneVirus(from){
        this.brithOne(from);
    }
    private idCount = 0;
    brithOne(from: Node) {
        let person = from.getComponent(virusBase).person;

        if (!person) {
            return;
        }
        //如果不在一个场所不作处理
        const placebase = person.parent.getComponent(placeBase);
        if (!placebase) {
            return;
        }
        //在这个场景中的抑制率将决定病毒课程复制自己的概率
        if(Math.random() < placebase.inhibition){
            return;
        }
        let clone = instantiate(this.setting.virusPrefab) as Node;
        this.list.push(clone);
        let virus = clone.getComponent(virusBase);
        // virus.node.setParent(person.node.parent,true);
        virus.node.setPosition(
            person.position.clone()
        )
        virus.node.parent = person.parent;
        this.idCount += 1;
        // 将ID进行累加，作记录用
        virus.ID = from.getComponent(virusBase).ID + '_' + this.idCount;
        this.setVirusData(virus);
    }
    createOne(person: personBase) {
        let clone = instantiate(this.setting.virusPrefab) as Node;
        person.node.getChildByName('body').addChild(clone);
        this.list.push(clone);
        let virus = clone.getComponent(virusBase);
        virus.ID = this.idCount.toString();
        this.setVirusData(virus);
    }
    setVirusData(virus: virusBase) {
        if (!this.setting.showVirusBody) {
            virus.clearBody();
        }
        //对数据同步
        virus.getComponent(virusPropagate).count = this.setting.propagateCount;
        virus.getComponent(virusPropagate).timespan = this.setting.propagateTimespan;
        virus.getComponent(virusInfect).distance = this.setting.infectDistance;
        virus.getComponent(virusInfect).rate = this.setting.infectRate;
        //设置初始数值
        virus.setLifeTime(this.setting.lifetime);
        virus.incubation = this.setting.incubation;
        virus.attack = this.setting.attack;
    }
    removeOne(virus: Node) {
        let index = this.list.indexOf(virus);
        if (index >= 0) {
            this.list.splice(index, 1);
        }
    }
    update(deltaTime: number) {

    }
}
