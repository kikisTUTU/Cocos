// [建议直接添加在胜利／失败Node上]

// [供游戏逻辑脚本调用的方法]
// begin  当game controller判定胜利后，调用begin()方法，例： this.successNode.getComponent("GameOverEffect").begin();
// reset  当game controller调用自己本身的restart之类的方法的时候，需要调用reset()方法，例this.successNode.getComponent("GameOverEffect").reset();
// 注： begin方法里的头两句代码是为了记录编辑本身设置的success node的状态，然后再强制设置成这个节点激活 
cc.Class({
    extends: cc.Component,

    properties: {
        // spine
        gameOverSpines: {
            default: [],
            type: sp.Skeleton,
            displayName: "Spine节点",
            tooltip: '[数组长度为Spine节点个数]',
        },

        gameOverSpinesName: {
            default: [],
            type: cc.String,
            displayName: "Spine动画名称",
            tooltip: '[数组长度为Spine节点个数, 没有可以留空,即显示Spine的第一帧图像]',
        },

        gameOverSpinesDelay: {
            default: [],
            type: cc.Float,
            displayName: "延迟播放Spine时长",
            tooltip: '[数组长度为Spine节点个数]',
        },

        gameOverSpinesLoop: {
            default: [],
            type: cc.Boolean,
            displayName: "是否循环播放",
            tooltip: '[数组长度为Spine节点个数, 默认false]',
        },



        // animation
        gameOverAnimations: {
            default: [],
            type: cc.Animation,
            displayName: "Animation节点",
            tooltip: '[数组长度为AnimationClip节点个数]',
        },

        gameOverAnimationsClipName: {
            default: [],
            type: cc.String,
            displayName: "AnimationClip动画名称",
            tooltip: '[数组长度为AnimationClip节点个数, 没有可以留空,即显示AnimationClip的第一帧图像]',
        },

        gameOverAnimationsDelay: {
            default: [],
            type: cc.Float,
            displayName: "延迟播放AnimationClip时长",
            tooltip: '[数组长度为AnimationClip节点个数]',
        },

        gameOverAnimationsLoop: {
            default: [],
            type: cc.Boolean,
            displayName: "是否循环播放",
            tooltip: '[数组长度为AnimationClip节点个数, 默认false]',
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        if (this.gameOverSpines.length != this.gameOverSpinesName.length || 
            this.gameOverSpinesName.length != this.gameOverSpinesDelay.length ||
            this.gameOverSpinesDelay.length != this.gameOverSpinesLoop.length) {
            cc.warn("Spine各数组长度必须一致，其中可以留空");
            return;
        }

        if (this.gameOverAnimations.length != this.gameOverAnimationsClipName.length || 
            this.gameOverAnimationsClipName.length != this.gameOverAnimationsDelay.length ||
            this.gameOverAnimationsDelay.length != this.gameOverAnimationsLoop.length) {
            cc.warn("Animation各数组长度必须一致，其中可以留空");
            return;
        }
    },

    // update (dt) {},

    begin () {
        this.lastActive = this.node.active;

        this.unscheduleAllCallbacks();
        this.node.active = true;

        for (let i = 0; i < this.gameOverSpines.length; i++) {
            let idx = i;
            // 定时执行
            if (this.gameOverSpines[idx]) {
                this.scheduleOnce(function(dt) {
                    this.gameOverSpines[idx].gameOverEffect_active = this.gameOverSpines[idx].node.active;
                    this.gameOverSpines[idx].gameOverEffect_spineName = this.gameOverSpines[idx].animation;
                    this.gameOverSpines[idx].gameOverEffect_spineLoop = this.gameOverSpines[idx].loop;
                    //
                    this.gameOverSpines[idx].node.active = true;
                    this.gameOverSpines[idx].clearTrack(0);
                    this.gameOverSpines[idx].setAnimation(0, this.gameOverSpinesName[idx], this.gameOverSpinesLoop[idx]);
                }, this.gameOverSpinesDelay[idx])
            }
        }


        for (let i = 0; i < this.gameOverAnimations.length; i++) {
            let idx = i;
            // 定时执行
            if (this.gameOverAnimations[idx]) {
                this.scheduleOnce(function(dt) {
                    this.gameOverAnimations[idx].gameOverEffect_active = this.gameOverAnimations[idx].node.active;
                    this.gameOverAnimations[idx].gameOverEffect_animationState = this.gameOverAnimations[idx].getAnimationState();
                    this.gameOverAnimations[idx].gameOverEffect_position = this.gameOverAnimations[idx].node.position;
                    this.gameOverAnimations[idx].gameOverEffect_scale = this.gameOverAnimations[idx].node.scale;
                    this.gameOverAnimations[idx].gameOverEffect_rotation = this.gameOverAnimations[idx].node.rotation;
                    //

                    this.gameOverAnimations[idx].node.active = true;
                    let animState = this.gameOverAnimations[idx].play(this.gameOverAnimationsClipName[idx]);
                    animState.wrapMode = this.gameOverAnimationsLoop[idx];
                }, this.gameOverAnimationsDelay[idx])
            }
        }
    },


    reset () {
        this.unscheduleAllCallbacks();

        if (this.lastActive == undefined) {
            return;
        }

        for (let i = 0; i < this.gameOverSpines.length; i++) {
            let idx = i;
            if (this.gameOverSpines[idx]) {
                if (this.gameOverSpines[idx].gameOverEffect_active) {
                    this.gameOverSpines[idx].clearTrack(0);
                    this.gameOverSpines[idx].setAnimation(0, this.gameOverSpines[idx].gameOverEffect_spineName, this.gameOverSpines[idx].gameOverEffect_spineLoop);
                } else {
                    this.gameOverSpines[idx].node.active = false;
                }
            }
        }


        for (let i = 0; i < this.gameOverAnimations.length; i++) {
            let idx = i;
            // 定时执行
            if (this.gameOverAnimations[idx]) {
                this.gameOverAnimations[idx].node.position = this.gameOverAnimations[idx].gameOverEffect_position;
                this.gameOverAnimations[idx].node.scale = this.gameOverAnimations[idx].gameOverEffect_scale;
                this.gameOverAnimations[idx].node.rotation = this.gameOverAnimations[idx].gameOverEffect_rotation;

                if (this.gameOverAnimations[idx].gameOverEffect_active) {
                    if (this.gameOverAnimations[idx].gameOverEffect_animationState) {
                        let animState = this.gameOverAnimations[idx].play(this.gameOverAnimations[idx].gameOverEffect_animationState.name);
                        animState = this.gameOverAnimations[idx].gameOverEffect_animationState;
                    }
                } else {
                    this.gameOverAnimations[idx].node.active = false;
                }
            }
        }

        this.node.active = this.lastActive;
    },
});
