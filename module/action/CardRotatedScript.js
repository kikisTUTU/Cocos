

cc.Class({
    extends: cc.Component,

    properties: {
        duration:{
            default: 0.0,
            type: cc.Float,
            displayName:"持续时间",
            tooltip:"卡牌翻转一半的时间"
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {

    // },
    //翻转效果
    rotate(){
        cc.log("rotate");
        /* x方向拉伸至0的动作 */
        let scaleToHide = cc.scaleTo(this.duration,0.0,1.0);
        /* 创建卡牌放大的回调函数 */
        let funcScaleToShow = cc.callFunc(function () {
            let scaleToShow = cc.scaleTo(this.duration,1.0,1.0);
            this.node.getComponent("CardObject").bcard.runAction(scaleToShow);
        }.bind(this));
        /* 依次执行动作 */
        let myAction = cc.sequence(scaleToHide, funcScaleToShow);
        this.node.getComponent("CardObject").fcard.runAction(myAction);
    },
    // update (dt) {},
});
