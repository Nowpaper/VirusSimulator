import { _decorator, Component, Node, ToggleComponent, SliderComponent, LabelComponent, director, EditBoxComponent } from 'cc';
import { VirusManagerData, WorldManagerSetting, WorldLogicSetting } from '../Common';
import { SettingData } from '../SettingData';
const { ccclass, property } = _decorator;

@ccclass('StartScene')
export class StartScene extends Component {

    @property(ToggleComponent)
    showVirusBody: ToggleComponent = null;
    @property(SliderComponent)
    OutRatio: SliderComponent = null;
    @property(SliderComponent)
    personResistance: SliderComponent = null;
    @property(SliderComponent)
    infectRate: SliderComponent = null;

    @property(EditBoxComponent)
    FamilySum: EditBoxComponent = null;
    @property(EditBoxComponent)
    disance: EditBoxComponent = null;
    @property(EditBoxComponent)
    startVirus: EditBoxComponent = null;
    @property(EditBoxComponent)
    personHealth: EditBoxComponent = null;
    @property(EditBoxComponent)
    personHealthDis: EditBoxComponent = null;
    @property(EditBoxComponent)
    propagateTimespan: EditBoxComponent = null;
    @property(EditBoxComponent)
    attack: EditBoxComponent = null;
    @property(EditBoxComponent)
    infectDistance: EditBoxComponent = null;
    @property(EditBoxComponent)
    lifetime: EditBoxComponent = null;
    @property(EditBoxComponent)
    incubation: EditBoxComponent = null;


    start() {
        let virusManagerData = SettingData.virusManagerData = new VirusManagerData();
        let worldManagerSetting = SettingData.worldManagerSetting = new WorldManagerSetting();
        let worldLogicSetting = SettingData.worldLogicSetting = new WorldLogicSetting();

        this.showVirusBody.isChecked = virusManagerData.showVirusBody;
        this.OutRatio.progress = worldManagerSetting.OutRatio;
        this.personResistance.progress = worldManagerSetting.personResistance;
        this.infectRate.progress = virusManagerData.infectRate;

        this.FamilySum.string = worldLogicSetting.FamilySum.toString();
        this.disance.string = worldLogicSetting.disance.toString();
        this.startVirus.string = worldManagerSetting.startVirus.toString();
        this.personHealth.string = worldManagerSetting.personHealth.toString();
        this.personHealthDis.string = worldManagerSetting.personHealthDis.toString();
        this.propagateTimespan.string = virusManagerData.propagateTimespan.toString();
        this.attack.string = virusManagerData.attack.toString();
        this.infectDistance.string = virusManagerData.infectDistance.toString();
        this.lifetime.string = virusManagerData.lifetime.toString();
        this.incubation.string = virusManagerData.incubation.toString();
    }

    update(deltaTime: number) {
        // Your update function goes here.
        this.OutRatio.node.parent.getChildByName('value').getComponent(LabelComponent).string =
            (this.OutRatio.progress * 100).toFixed(0) + '%';
        this.personResistance.node.parent.getChildByName('value').getComponent(LabelComponent).string =
            (this.personResistance.progress * 100).toFixed(0) + '%';
        this.infectRate.node.parent.getChildByName('value').getComponent(LabelComponent).string =
            (this.infectRate.progress * 100).toFixed(0) + '%';
    }

    onClickStart() {
        let virusManagerData = SettingData.virusManagerData;
        let worldManagerSetting = SettingData.worldManagerSetting;
        let worldLogicSetting = SettingData.worldLogicSetting;
        virusManagerData.showVirusBody = this.showVirusBody.isChecked;

        worldManagerSetting.OutRatio = this.OutRatio.progress;
        worldManagerSetting.personResistance = this.personResistance.progress;
        virusManagerData.infectRate = this.infectRate.progress;
        if (parseFloat(this.FamilySum.string).toString() == 'NaN') {
            alert('请填写正确的数值')
            return;
        }
        worldLogicSetting.FamilySum = parseFloat(this.FamilySum.string);
        if (parseFloat(this.disance.string).toString() == 'NaN') {
            alert('请填写正确的数值')
            return;
        }
        worldLogicSetting.disance = parseFloat(this.disance.string);
        if (parseFloat(this.startVirus.string).toString() == 'NaN') {
            alert('请填写正确的数值')
            return;
        }
        worldManagerSetting.startVirus = parseFloat(this.startVirus.string);
        if (parseFloat(this.personHealth.string).toString() == 'NaN') {
            alert('请填写正确的数值')
            return;
        }
        worldManagerSetting.personHealth = parseFloat(this.personHealth.string);
        if (parseFloat(this.personHealthDis.string).toString() == 'NaN') {
            alert('请填写正确的数值')
            return;
        }
        worldManagerSetting.personHealthDis = parseFloat(this.personHealthDis.string);
        if (parseFloat(this.propagateTimespan.string).toString() == 'NaN') {
            alert('请填写正确的数值')
            return;
        }
        virusManagerData.propagateTimespan = parseFloat(this.propagateTimespan.string);
        if (parseFloat(this.attack.string).toString() == 'NaN') {
            alert('请填写正确的数值')
            return;
        }
        virusManagerData.attack = parseFloat(this.attack.string);
        if (parseFloat(this.infectDistance.string).toString() == 'NaN') {
            alert('请填写正确的数值')
            return;
        }
        virusManagerData.infectDistance = parseFloat(this.infectDistance.string);
        if (parseFloat(this.lifetime.string).toString() == 'NaN') {
            alert('请填写正确的数值')
            return;
        }
        virusManagerData.lifetime = parseFloat(this.lifetime.string);
        if (parseFloat(this.incubation.string).toString() == 'NaN') {
            alert('请填写正确的数值')
            return;
        }
        virusManagerData.incubation = parseFloat(this.incubation.string);

        director.loadScene('scene/Game Scene')
    }
}
