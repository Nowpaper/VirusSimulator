import { _decorator, Component, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('worldObjects')
export class worldObjects extends Component {
    public static personPrefab:Prefab = null;
    public static familyPlace:Prefab = null;
    @property(Prefab)
    person:Prefab = null;
    @property(Prefab)
    familyPlace:Prefab = null;

    start () {
        worldObjects.familyPlace = this.familyPlace;
        worldObjects.personPrefab = this.person;
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
