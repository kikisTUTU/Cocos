cc.Class({
    extends: cc.Component,

    properties: {
        spineNode: {
            default: null,
            type:sp.Skeleton,
            displayName: "Spine节点",
            tooltip: '挂载了组件sp.Skeleton的节点',
        },

        clickDeltaTime: {
            default: 0,
            type: cc.Float,
            displayName: "响应点击间隔",
            tooltip: '响应两次点击之间的间隔时长，避免鬼畜抖动效果',
        },

        canClickTimes: {
            default: 0,
            type: cc.Integer,
            displayName: "容许点击次数",
            tooltip: '<= 0:不限次数  > 0:容许点击该值次数',
        },

        delayTimes: {
            default: [],
            type: [cc.Float],
            displayName: "延迟播放时长",
            tooltip: '[3个数组长度要一致]',
        },

        spineNames: {
            default: [],
            type: [cc.String],
            displayName: "Spine动画名",
            tooltip: '[3个数组长度要一致]',
        },

        loops: {
            default: [],
            type: [cc.Boolean],
            displayName: "循环",
            tooltip: '[3个数组长度要一致]',
        },

        hideWhenOver: {
            default: false,
            displayName: "最后隐藏",
            tooltip: '是否播放完最后一个隐藏，那必须最后一个spine动画是不循环的',
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () { },

    start () {
        if (this.delayTimes.length != this.spineNames.length || 
            this.spineNames.length != this.loops.length) {
            cc.warn("3个数组长度要一致");
            return;
        }

        if (this.canClickTimes <= 0) {
            this.canClickTimes = 9999;
        }

        this.currentTimeStamp = new Date();

        this.node.on(cc.Node.EventType.TOUCH_END, this.clickCallback, this);
    },

    clickCallback () {
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

        this.spineNode.node.active = true;
        this.unscheduleAllCallbacks();
        let totalDelayTime = 0;
        for (let i = 0; i < this.delayTimes.length; i++) {
            let idx = i;
            let tempTotalDelayTime = totalDelayTime += this.delayTimes[idx];
            this.scheduleOnce(function(dt) {
                this.spineNode.clearTrack(0);
                this.spineNode.setAnimation(0, this.spineNames[idx], this.loops[idx]);
                if (idx == this.delayTimes.length - 1 && this.loops[idx] == false && this.hideWhenOver) {
                    this.spineNode.setCompleteListener(function() {
                        this.spineNode.node.active = false;
                    }.bind(this));
                }
            }, tempTotalDelayTime)
        }
    },

    // update (dt) {},
});
