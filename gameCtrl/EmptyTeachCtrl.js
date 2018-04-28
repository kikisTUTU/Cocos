cc.Class({
    extends: cc.Component,

    properties: { 
        delayTime: {
            default: 5,
            displayName: "延迟时长",
            tooltip: "语音结束之后 多久后 展示Spine",
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () { },

    // start () { },

    // update (dt) {},

    // 进场语音播放结束监听
    pageEnterAuido_Type1_Over_Callback (event) {
        cc.find("BasePageController").getComponent("BasePageController").setRightButtonEnable(true);
        this.scheduleOnce(this.setRightButtonTipActive, this.delayTime);
    },

    // 设置下一页按钮Spine展示
    setRightButtonTipActive () {
        cc.find("BasePageController").getComponent("BasePageController").setRightButtonTipActive(true);
    },

    onEnable() {
        this.node.on("PageEnterAuido_Type1_Over", this.pageEnterAuido_Type1_Over_Callback, this);
    },

    onDisable () {
        this.unschedule(this.setRightButtonTipActive);
        this.node.off("PageEnterAuido_Type1_Over", this.pageEnterAuido_Type1_Over_Callback, this);
    }
});
