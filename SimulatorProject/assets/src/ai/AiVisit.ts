import { _decorator, Component, Node, v3, find } from 'cc';
import { AiRandomMove } from './AiRandomMove';
import { AiMoveTo } from './AiMoveTo';
import { placeBase } from '../place/placeBase';
import { personBase } from '../person/personBase';
import { placeLogic } from '../place/placeLogic';
import { worldLogic } from '../world/worldLogic';
import { worldManager } from '../world/worldManager';
const { ccclass, property } = _decorator;

@ccclass('AiVisit')
export class AiVisit extends Component {
    time = 0;
    timespan = 0;
    private targetPlace: placeBase = null;
    beginOut() {
        let randommove = this.getComponent(AiRandomMove);
        if (randommove) {
            randommove.enabled = false;
        }
        try
        {
            this.targetPlace = this.node.parent.parent.getComponent(placeLogic).getRandomPlaceNode(this.node.parent);
            
        }catch(ex){
            debugger
        }
        if(!this.targetPlace){            
            this.node.removeComponent(AiVisit);
            if (randommove) {
                randommove.enabled = true;
            }
            return;
        }
        this.state = 1;
        let aimoveto = this.getComponent(AiMoveTo);   
        this.node.setParent(this.node.parent.parent,true);
        this.timespan = aimoveto.moveTo(
            this.targetPlace.node.position.x,
            this.targetPlace.node.position.y,
            this.targetPlace.node.position.z,
            this.state
        );
    }
    beginBack() {
        let randommove = this.getComponent(AiRandomMove);
        if (randommove) {
            randommove.enabled = false;
        }
        this.state = 3;
        let aimoveto = this.getComponent(AiMoveTo);
        let backPlace = this.getComponent(personBase).placeNode;
        this.node.setParent(this.node.parent.parent,true);
        this.timespan = aimoveto.moveTo(
            backPlace.position.x,
            backPlace.position.y,
            backPlace.position.z,
            this.state
        );
    }
    enterPlace(place: Node) {
        this.node.setParent(place,true);
        let randommove = this.getComponent(AiRandomMove);
        if (randommove) {
            randommove.enabled = true;
        }
    }
    // 0 无状态，1出去的路上，2 到达目标等待 3反回
    state = 0;
    start() {
        //暂为随机固定
        this.timespan = Math.random() * 5 + 1;
        this.node.on(AiMoveTo.MoveToComplated,this.onMoveToComplated,this);
    }
    onDestroy(){
        
        this.node.off(AiMoveTo.MoveToComplated,this.onMoveToComplated,this);
    }
    private onMoveToComplated(tag){
        if(tag == 1){
            this.timespan = Math.random() * 3 + 1;
            this.enterPlace(this.targetPlace.node);
            this.state = 2;
        }else if(tag == 3){
            this.enterPlace(this.getComponent(personBase).placeNode);
            find('world').getComponent(worldManager).removeAiVisit(this.node);
        }
    }
    update(deltaTime: number) {
        if(!this.node.parent.parent){
            return;
        }
        this.time += deltaTime * worldLogic.timeRate;
        if (this.time >= this.timespan) {
            this.time = 0;
            switch (this.state) {
                case 0:
                    this.beginOut();
                    break;
                case 1:
                    break;
                case 2:
                    this.beginBack();
                    break;
                case 3:
                    break;
            }
        }
    }
}
