var AutoCallBack = cc.Class({
    name: "AutoCallBack",
    properties: {
        delayTime: {
            default: 0,
            type: cc.Float,
            displayName: "延迟时长",
            tooltip: '延迟执行回调的时长',
            min: 0,
        },

        callback: {
            default: null,
            type: cc.Component.EventHandler,
            displayName: "回调",
            tooltip: '回调（节点 脚本 方法 参数）',
        },
    },
});

cc.Class({
    extends: cc.Component,

    properties: {
        callbacks: {
            default: [],
            type: [AutoCallBack],
            displayName: "自动延迟回调数组",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () { },

    // start () { },

    onEnable () {
        this.unscheduleAllCallbacks();
        for (let i = 0; i < this.callbacks.length; i++) {
            let idx = i;
            if (this.callbacks[idx].callback != null) {
                this.scheduleOnce(function(dt) {
                    let eventHandler = new cc.Component.EventHandler();
                    eventHandler.target = this.callbacks[idx].callback.target;
                    eventHandler.component = this.callbacks[idx].callback.component;
                    eventHandler.handler = this.callbacks[idx].callback.handler
                    eventHandler.emit([this, this.callbacks[idx].callback.customEventData]);
                }, this.callbacks[idx].delayTime)
            }
        }
    },

    onDisable () {
        this.unscheduleAllCallbacks();
    },

    // update (dt) {},
});
