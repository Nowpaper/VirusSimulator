import { _decorator, Component, Node, math } from 'cc';
import { placeBase } from './placeBase';
const { ccclass, property } = _decorator;

@ccclass('placeLogic')
export class placeLogic extends Component {

    start() {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
    private placeNodes: placeBase[] = null;
    private sumWeight = 0;
    /** 特定的增加方法 */
    addGameNode(node: Node) {
        if (this.placeNodes == null) {
            this.placeNodes = [];
            let arr = this.node.getComponentsInChildren(placeBase);
            for (let a of arr) {
                this.placeNodes.push(a);
            }
        }
        let place = node.getComponent(placeBase);
        if (place) {
            this.placeNodes.push(place);
            this.sumWeight += place.visitWeight;
        }
        node.parent = this.node;
    }
    getRandomPlaceNode(skip: Node) {
        let random = this.sumWeight * Math.random();
        let count = 0;
        let ret: placeBase;
        let skipsc = skip.getComponent(placeBase);
        let temp = this.placeNodes.filter((value, index, arr) => {
            return value.node.children.length > 0;
        })
        if(temp.length <= 0){
            temp = this.placeNodes;
        }
        for (let place of temp) {
            if (place == skipsc) continue;
            count += place.visitWeight;
            if (random < count) {
                ret = place;
                break;
            }
        }
        return ret;
    }
}
