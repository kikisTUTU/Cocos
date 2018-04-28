cc.Class({
    extends: cc.Component,

    properties: {
        finalPage: {
            default: false,
            displayName: "最后一页",
            tooltip: "是否是最后一页，如果是：跳结算界面，如果否：跳下一页",
        },

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
        this.scheduleOnce(this.goToNextPage, this.delayTime);
    },

    // 跳下一页
    goToNextPage () {
        if (this.finalPage) {
            cc.find("BasePageController").getComponent("BasePageController").goToResultPage();
        } else {
            cc.find("BasePageController").getComponent("BasePageController").goToNextPageNode();
        }
    },

    onEnable() {
        this.node.on("PageEnterAuido_Type1_Over", this.pageEnterAuido_Type1_Over_Callback, this);
    },

    onDisable () {
        this.unschedule(this.setRightButtonTipActive);
        this.node.off("PageEnterAuido_Type1_Over", this.pageEnterAuido_Type1_Over_Callback, this);
    }
});
