import { _decorator, Component, Node, LabelComponent, find, SpriteComponent, SliderComponent } from 'cc';
import { worldManager } from '../world/worldManager';
import { virusManager } from '../virus/virusManager';
import { virusBase } from '../virus/virusBase';
import { personBase } from '../person/personBase';
import { worldLogic } from '../world/worldLogic';
const { ccclass, property } = _decorator;

@ccclass('worldUI')
export class worldUI extends Component {
    @property(LabelComponent)
    lbVirus: LabelComponent = null;
    @property(LabelComponent)
    lbPerson: LabelComponent = null;
    @property(LabelComponent)
    lbInfected: LabelComponent = null;
    @property(LabelComponent)
    lbInfectedPercent: LabelComponent = null;
    @property(SpriteComponent)
    spInfectedPercent: SpriteComponent = null;
    @property(LabelComponent)
    lbDead: LabelComponent = null;

    @property(LabelComponent)
    OutRatio: LabelComponent = null;
    @property(LabelComponent)
    timeDay: LabelComponent = null;
    @property(LabelComponent)
    timeRate: LabelComponent = null;
    @property(SliderComponent)
    sliderTimeRate: SliderComponent = null;
    @property
    maxTimeRate = 10;
    private timeSum = 0;
    start() {
        // Your initialization goes here.
        this.worldNode = find('world');
        let tr = this.worldNode.getComponent(worldLogic).setting.timeRate;
        this.sliderTimeRate.progress = tr / this.maxTimeRate;
        this.timeRate.string = tr.toFixed(2).toString();
    }
    private worldNode: Node = null;

    update(deltaTime: number) {
        // Your update function goes here.
        let persons = this.worldNode.getComponent(worldManager).persons;
        this.lbPerson.string = persons.length.toString();
        let infected = this.getInfected(persons);
        this.lbInfected.string = infected.toString();
        this.lbVirus.string = this.worldNode.getComponent(virusManager).list.length.toString();
        let p = (infected / persons.length);
        if (persons.length > 0) {
            this.lbInfectedPercent.string = (p * 100).toFixed(1) + '%';
            this.spInfectedPercent.fillRange = p;
        }
        this.lbDead.string = this.worldNode.getComponent(worldManager).deadList.length.toFixed(0);
        //对时间进行计算
        this.timeSum += deltaTime * worldLogic.timeRate;
        let hours = this.timeSum / 6;
        let day = Math.floor(hours / 24);
        hours -= day * 24;
        let str = Math.floor(hours).toString();

        this.timeDay.string = day + '天' + (str.length == 2 ? str : 0 + str) + '小时'; // + " | "+this.timeSum.toFixed(2);
        this.OutRatio.string = (100 * this.worldNode.getComponent(worldManager).setting.OutRatio).toFixed(0) + '%'
    }
    private getInfected(persons: personBase[]): number {
        let sum = 0;
        for (let person of persons) {
            if (person.node.getChildByName('body').getComponentInChildren(virusBase)) {
                sum += 1;
            }
        }
        return sum;
    }
    sliderProgress(e) {
        let tr = this.worldNode.getComponent(worldLogic).setting.timeRate = this.sliderTimeRate.progress * this.maxTimeRate;
        this.timeRate.string = tr.toFixed(2).toString();

    }
}
