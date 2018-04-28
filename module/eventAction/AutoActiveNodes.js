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
        },

        actives: {
            default: [],
            type: [cc.Boolean],
            displayName: "active状态数组",
            tooltip: '[4个数组长度要一致]',
        },

        recoveTimes: {
            default: [],
            type: [cc.Float],
            displayName: "保持时长数组",
            tooltip: '[4个数组长度要一致] (<= 0:不恢复原状态  > 0:该值秒数之后恢复原状态)',
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () { },

    start () {
        
    },

    onEnable () {
        if (this.nodes.length != this.delayTimes.length ||
            this.delayTimes.length != this.actives.length || 
            this.actives.length != this.recoveTimes.length) {
            cc.warn("4个数组长度要一致");
            return;
        }


        if (this.node.lastActiveArr != undefined) {
            for (let i = 0; i < this.nodes.length; i++) {
                this.nodes[i].active = this.node.lastActiveArr[i];
            }
        } else {
            this.node.lastActiveArr = [];
            for (let i = 0; i < this.nodes.length; i++) {
                this.node.lastActiveArr[i] = this.nodes[i].active;
            }
        }

        this.unscheduleAllCallbacks();
        for (let i = 0; i < this.nodes.length; i++) {
            let idx = i;
            this.scheduleOnce(function(dt) {
                this.nodes[idx].active = this.actives[idx];
                //
                if (this.recoveTimes[idx] > 0) {
                    this.scheduleOnce(function(dt) {
                        this.nodes[idx].active = this.node.lastActiveArr[idx];
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
