

cc.Class({
    extends: cc.Component,

    properties: {
        // duration:{
        //     default: 0,
        //     type: cc.Integer,
        //     displayName:"持续时间",
        //     tooltip:"卡牌晃动的时间"
        // },
        distance:{
            default: 0,
            type: cc.Integer,
            displayName:"晃动距离",
            tooltip:"卡牌往一个方向晃动的距离"
        }

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {

    // },

    // update (dt) {},

    shake(){
        let seq = cc.repeat(
            cc.sequence(
                cc.moveBy(0.1, this.distance, 0), 
                cc.moveBy(0.1, -this.distance, 0)
            ),3);
        this.node.runAction(seq);
    }
});
