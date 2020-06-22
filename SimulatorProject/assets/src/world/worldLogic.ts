import { _decorator, Component, Node, Prefab, instantiate, CCObject, v3 } from 'cc';
import { worldObjects } from '../worldObjects';
import { Common, WorldLogicSetting } from '../Common';
import { placeLogic } from '../place/placeLogic';
import { SettingData } from '../SettingData';
const { ccclass, property } = _decorator;


@ccclass('worldLogic')
export class worldLogic extends Component {
    public static timeRate: number = 1;
    @property({ type: WorldLogicSetting })
    setting: WorldLogicSetting = new WorldLogicSetting();
    start() {
        if (SettingData.worldLogicSetting) {
            this.setting = SettingData.worldLogicSetting;
        }
        this.createWorld();
    }
    createWorld() {
        for (let i = 0; i < this.setting.FamilySum; i++) {
            let family: Node = instantiate(worldObjects.familyPlace);
            this.getComponent(placeLogic).addGameNode(family);
            let x = Common.getNumberInNormalDistribution(0, this.setting.disance / 2);
            let y = Common.getNumberInNormalDistribution(0, this.setting.disance / 2);
            let z = Common.getNumberInNormalDistribution(0, this.setting.disance / 2);
            family.setPosition(x, y, z);

        }
    }
    update(deltaTime: number) {
        worldLogic.timeRate = this.setting.timeRate;
    }
}
