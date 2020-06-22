
export module Common {
    // https://www.cnblogs.com/zztt/p/4025207.html
    export function getNumberInNormalDistribution(mean, std_dev) {
        return mean + (randomNormalDistribution() * std_dev);
    }

    export function randomNormalDistribution() {
        let u = 0.0, v = 0.0, w = 0.0, c = 0.0;
        do {
            //获得两个（-1,1）的独立随机变量
            u = Math.random() * 2 - 1.0;
            v = Math.random() * 2 - 1.0;
            w = u * u + v * v;
        } while (w == 0.0 || w >= 1.0)
        //这里就是 Box-Muller转换
        c = Math.sqrt((-2 * Math.log(w)) / w);
        //返回2个标准正态分布的随机数，封装进一个数组返回
        //当然，因为这个函数运行较快，也可以扔掉一个
        //return [u*c,v*c];
        return v * c;
    }
    export function sinInOut(t: number): number {
        return -0.5 * (Math.cos(Math.PI * t) - 1);
    }
}
import { _decorator, Prefab } from 'cc';
const { ccclass, property } = _decorator;
@ccclass("worldLogic.settingData")
export class WorldLogicSetting {
    @property({ tooltip: "启动时的时间倍数" })
    timeRate: number = 1;
    @property({ tooltip: "家庭数量，不要设置太大" })
    FamilySum: number = 100;
    @property({ tooltip: "世界范围的大小" })
    disance: number = 10;
}
@ccclass("WorldManager.setting")
export class WorldManagerSetting {
    @property({ slide: true, range: [0, 1, 0.01], tooltip: "人类外出行为比率" })
    OutRatio: number = 0.3;
    @property({ slide: true, range: [0, 1, 0.01], tooltip: "抵抗力，能有多大机会抵抗掉病毒" })
    personResistance: number = 0;
    @property({ tooltip: "最开始有多少病毒" })
    startVirus: number = 1;
    @property({ tooltip: "标准健康，单位秒，144秒等于1天" })
    personHealth = 144 * 14;
    @property({ tooltip: "正态分布权重数值，单位秒" })
    personHealthDis = 144 * 3;
}
@ccclass("VirusManager.setting")
export class VirusManagerData {
    @property({ tooltip: "是否渲染病毒，打开这个选项会很卡" })
    showVirusBody: boolean = false;
    @property(Prefab)
    virusPrefab: Prefab = null;
    //散播间隔
    @property({ tooltip: "散播间隔时间，单位秒" })
    propagateTimespan = 6;
    @property({ tooltip: "复制数量，每次复制自己的数量" })
    propagateCount = 1;
    @property({ tooltip: "感染距离" })
    infectDistance = 0.5;
    @property({ slide: true, range: [0, 1, 0.01], tooltip: "病毒感染成功率" })
    infectRate = 1;
    @property({ tooltip: "单位秒，每6秒为1小时" })
    lifetime = 6 * 24;
    @property({ tooltip: "潜伏期，单位秒，每6秒为1小时" })
    incubation = 6 * 24 * 14;
    @property({ tooltip: "攻击力，每秒（每十分钟）抵消多少生命值" })
    attack: number = 1;
}