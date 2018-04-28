
//卡牌打钩

cc.Class({
    extends: cc.Component,

    properties: {
        opacity:{
            default: 0,
            type: cc.Integer,
            displayName:"目标透明度",
            tooltip:"使物体最终变成的透明度"
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {

    // },

    // update (dt) {},

    tick(){
        let fadeto = cc.fadeTo(1.0,this.opacity);
        this.node.getComponent("CardObject").fcard.runAction(fadeto);
        this.node.getComponent("CardObject").gou.active = true;
    }
});
