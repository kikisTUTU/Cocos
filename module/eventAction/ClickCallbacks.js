var ClickCallBack = cc.Class({
    name: "ClickCallBack",
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
        clickDeltaTime: {
            default: 0,
            type: cc.Float,
            displayName: "响应点击间隔",
            tooltip: '响应两次点击之间的间隔时长，避免鬼畜抖动效果',
            min: 0,
        },

        canClickTimes: {
            default: 1,
            type: cc.Integer,
            displayName: "容许点击次数",
            tooltip: '<= 0:不限次数  > 0:容许点击该值次数',
            min: 0,
        },

        callbacks: {
            default: [],
            type: [ClickCallBack],
            displayName: "点击延迟回调数组",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () { },

    start () {
        if (this.canClickTimes <= 0) {
            this.canClickTimes = 9999;
        }

        this.currentTimeStamp = new Date();

        this.node.on(cc.Node.EventType.TOUCH_END, this.clickCallback, this);
    },

    clickCallback (touchEvent) {
        if (this.enabled == false) {
            return;
        }

        if (this.canClickTimes <= 0) {
            return;
        }

        let tempTimeStamp = new Date();
        if (tempTimeStamp - this.currentTimeStamp < this.clickDeltaTime*1000) {
            return;
        }

        this.canClickTimes -= 1;
        this.currentTimeStamp = tempTimeStamp;




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

    // update (dt) {},
});
