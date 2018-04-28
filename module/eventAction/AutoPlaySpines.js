cc.Class({
    extends: cc.Component,

    properties: {
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
        }
    },

    editor: {
        requireComponent: sp.Skeleton,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onEnable () {
        if (this.delayTimes.length != this.spineNames.length || 
            this.spineNames.length != this.loops.length) {
            cc.warn("3个数组长度要一致");
            return;
        }

        this.node.active = true;

        let totalDelayTime = 0;
        for (let i = 0; i < this.delayTimes.length; i++) {
            let idx = i;
            let tempTotalDelayTime = totalDelayTime += this.delayTimes[idx];
            this.scheduleOnce(function(dt) {
                this.node.getComponent(sp.Skeleton).clearTrack(0);
                this.node.getComponent(sp.Skeleton).setAnimation(0, this.spineNames[idx], this.loops[idx]);
                if (idx == this.delayTimes.length - 1 && this.loops[idx] == false && this.hideWhenOver) {
                    this.node.getComponent(sp.Skeleton).setCompleteListener(function() {
                        this.node.active = false;
                    }.bind(this));
                }
            }, tempTotalDelayTime)
        }
    },

    onDisable () {
        this.unscheduleAllCallbacks();
    },

    // update (dt) {},
});
