var AClickShake = cc.Class({
    name: "AClickShake",
    properties: {
        duration: {
            default: 0,
            type: cc.Float,
            displayName: "偏移的时长",
            min: 0,
        },

        moveBy: {
            default: new cc.Vec2(),
            displayName: "偏移量",
            tooltip: 'MoveBy的参数',
        },
    },
});

cc.Class({
    extends: cc.Component,

    properties: {
        target: {
            default: null,
            type: cc.Node,
            displayName: "要做摇晃动作的节点",
        },

        shakes: {
            default: [],
            type: AClickShake,
            displayName: "所有的偏移数值",
            tooltip: '依次按执行拖偏移动作的顺序拖入',
        },

        callback: {
            default: null,
            type: cc.Component.EventHandler,
            displayName: "全部偏移完回调",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () { },

    start () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.clickCallback, this);
    },

    clickCallback (touchEvent) {
        if (this.enabled == false) {
            return;
        }

        if (this.target == null) {
            return;
        }

        this.target.stopAllActions();
        this.unscheduleAllCallbacks();
        this.totalTime = 0;

        this.target.runAction(cc.moveBy(this.shakes[0].duration, this.shakes[0].moveBy));

        for (let i = 1; i < this.shakes.length; i++) {
            let idx = i;
            let tempTotalTime = this.totalTime += this.shakes[idx-1].duration;
            this.scheduleOnce(function(dt) {
                if (idx >= this.shakes.length - 1) {
                    this.target.runAction(cc.sequence(cc.moveBy(this.shakes[idx].duration, this.shakes[idx].moveBy), cc.callFunc(function() {
                        if (this.callback != null && this.callback.target != null) {
                            this.callback.emit([this, this.callback.customEventData]);
                        }
                    }.bind(this))));
                } else {
                    this.target.runAction(cc.moveBy(this.shakes[idx].duration, this.shakes[idx].moveBy));
                }
            }, tempTotalTime)
        }
    },

    disableClick () {
        this.node.off(cc.Node.EventType.TOUCH_END, this.clickCallback, this);
    }

    // update (dt) {},
});
