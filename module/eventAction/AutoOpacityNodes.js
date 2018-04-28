cc.Class({
    extends: cc.Component,

    properties: {
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
            tooltip: '[4个数组长度要一致] (每个节点的延迟时长都从本脚本激活开始计算)',
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
        
    },

    onEnable () {
        if (this.nodes.length != this.delayTimes.length ||
            this.delayTimes.length != this.opacitys.length || 
            this.opacitys.length != this.recoveTimes.length) {
            cc.warn("4个数组长度要一致");
            return;
        }


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

    onDisable () {
        this.unscheduleAllCallbacks();
    },

    // update (dt) {},
});
