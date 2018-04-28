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
            default: 0,
            type: cc.Integer,
            displayName: "容许点击次数",
            tooltip: '<= 0:不限次数  > 0:容许点击该值次数',
            min: 0,
        },

        nodes: {
            default: [],
            type: [cc.Node],
            displayName: "节点数组",
            tooltip: '[4个数组长度要一致]',
        },

        delayTimes: {
            default: [],
            type: [cc.Float],
            displayName: "延迟时长数组",
            tooltip: '[4个数组长度要一致] (每个节点的延迟时长都从点击开始计算)',
            min: 0,
        },

        opacitys: {
            default: [],
            type: [cc.Integer],
            displayName: "opacity数值数组",
            tooltip: '[4个数组长度要一致]',
            min: 0,
            max: 255,
        },

        recoveTimes: {
            default: [],
            type: [cc.Float],
            displayName: "保持时长数组",
            tooltip: '[4个数组长度要一致] (<= 0:不恢复原状态  > 0:该值秒数之后恢复原状态)',
            min: 0,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () { },

    start () {
        if (this.nodes.length != this.delayTimes.length ||
            this.delayTimes.length != this.opacitys.length || 
            this.opacitys.length != this.recoveTimes.length) {
            cc.warn("4个数组长度要一致");
            return;
        }

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


        if (this.node.lastOpacityArr != undefined) {
            for (let i = 0; i < this.nodes.length; i++) {
                this.nodes[i].opacity = this.node.lastOpacityArr[i];
            }
        } else {
            this.node.lastOpacityArr = [];
            for (let i = 0; i < this.nodes.length; i++) {
                this.node.lastOpacityArr[i] = this.nodes[i].opacity;
            }
        }

        this.unscheduleAllCallbacks();
        for (let i = 0; i < this.nodes.length; i++) {
            let idx = i;
            this.scheduleOnce(function(dt) {
                this.nodes[idx].opacity = this.opacitys[idx];
                //
                if (this.recoveTimes[idx] > 0) {
                    this.scheduleOnce(function(dt) {
                        this.nodes[idx].opacity = this.node.lastOpacityArr[idx];
                    }, this.recoveTimes[idx]);
                }
            }, this.delayTimes[idx])
        }
    },

    // update (dt) {},
});
