// [建议直接添加在胜利／失败Node上]

// [供游戏逻辑脚本调用的方法]
// begin  当game controller判定胜利后，调用begin()方法，例： this.successNode.getComponent("GameOverEffect2").begin();
// reset  当game controller调用自己本身的restart之类的方法的时候，需要调用reset()方法，例this.successNode.getComponent("GameOverEffect2").reset();

// 注： reset的时候，Animation类别的处理方式是play defaultClip

var GameOverEffect_Spine = cc.Class({
    name: "GameOverEffect_Spine",
    properties: {
        spine: {
            default: null,
            type: sp.Skeleton,
            displayName: "Spine节点",
        },

        spineName: {
            default: "",
            displayName: "Spine动画名称",
        },

        spineDelay: {
            default: 0,
            type: cc.Float,
            displayName: "延迟播放Spine时长",
            min: 0
        },

        spineLoop: {
            default: false,
            displayName: "是否循环播放",
        },
    }
});

var GameOverEffect_Animation = cc.Class({
    name: "GameOverEffect_Animation",
    properties: {
        animation: {
            default: null,
            type: cc.Animation,
            displayName: "Animation节点",
        },

        animationClipName: {
            default: "",
            displayName: "AnimationClip动画名称",
        },

        animationDelay: {
            default: 0,
            type: cc.Float,
            displayName: "延迟播放AnimationClip时长",
            min: 0
        },

        animationLoop: {
            default: cc.WrapMode.Default,
            type:  cc.WrapMode,
            displayName: "循环模式",
        },
    }
});


var GameOverEffect_Audio = cc.Class({
    name: "GameOverEffect_Audio",
    properties: {
        audio: {
            default: null,
            url: cc.AudioClip,
            displayName: "AudioClip资源",
        },

        audioDelay: {
            default: 0,
            type: cc.Float,
            displayName: "延迟播放AudioClip时长",
            min: 0
        },

        audioLoop: {
            default: false,
            displayName: "是否循环播放",
        },

        audioVolume: {
            default: 1,
            type: cc.Float,
            displayName: "音量",
            min: 0
        },

        _audioID: cc.Integer,
    }
});

var GameOverEffect_ActiveNode = cc.Class({
    name: "GameOverEffect_ActiveNode",
    properties: {
        activeDelay: {
            default: 0,
            type: cc.Float,
            displayName: "延迟激活",
            min: 0
        },

        activeNode: {
            default: null,
            type: cc.Node,
            displayName: "节点",
        },

        activeValue: {
            default: true,
            displayName: "active状态",
        },

        activeRecoveTime: {
            default: 0,
            type: cc.Float,
            displayName: "保持时长",
            tooltip: '0:不恢复原状态 \n > 0:该值秒数之后恢复原状态',
            min: 0,
        },
    }
});

var GameOverEffect_AbleComponent = cc.Class({
    name: "GameOverEffect_AbleComponent",
    properties: {
        ableDelay: {
            default: 0,
            type: cc.Float,
            displayName: "延迟激活",
            min: 0
        },

        ableNode: {
            default: null,
            type: cc.Node,
            displayName: "节点",
        },

        albeComponentName: {
            default: "",
            displayName: "脚本名称",
            tooltip: '必须是上面节点上加载的脚本的名称',
        },

        ableValue: {
            default: true,
            displayName: "组件able状态",
        },

        ableRecoveTime: {
            default: 0,
            type: cc.Float,
            displayName: "保持时长",
            tooltip: '0:不恢复原状态 \n > 0:该值秒数之后恢复原状态',
            min: 0,
        },
    }
});

var GameOverEffect_EventHandler = cc.Class({
    name: "GameOverEffect_EventHandler",
    properties: {
        callbackDelay: {
            default: 0,
            type: cc.Float,
            displayName: "回调延迟执行",
            min: 0
        },

        callback: {
            default: null,
            type: cc.Component.EventHandler,
            displayName: "回调",
        },
    }
});

var GameOverEffect_LocalZOrder = cc.Class({
    name: "GameOverEffect_LocalZOrder",
    properties: {
        zOrderNode: {
            default: null,
            type: cc.Node,
            displayName: "要处理的节点",
        },

        localZOrderIndex: {
            default: 0,
            type: cc.Integer,
            displayName: "层级数值",
            tooltip: "相对父节点的局部层级数值"
        },
    }
});



cc.Class({
    extends: cc.Component,

    properties: {
        GameOverEffect_Spines: {
            default: [],
            type: GameOverEffect_Spine,
            displayName: "Spine动画数组",
        },

        GameOverEffect_Animations: {
            default: [],
            type: GameOverEffect_Animation,
            displayName: "Animation动画数组",
        },

        GameOverEffect_Audios: {
            default: [],
            type: GameOverEffect_Audio,
            displayName: "Audio语音数组",
        },

        GameOverEffect_ActiveNodes: {
            default: [],
            type: GameOverEffect_ActiveNode,
            displayName: "是否激活节点数组",
        },

        GameOverEffect_AbleComponents: {
            default: [],
            type: GameOverEffect_AbleComponent,
            displayName: "是否使能组件数组",
        },

        GameOverEffect_EventHandlers: {
            default: [],
            type: GameOverEffect_EventHandler,
            displayName: "延迟回调数组",
        },

        GameOverEffect_LocalZOrders: {
            default: [],
            type: GameOverEffect_LocalZOrder,
            displayName: "局部层级调整数组",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () { },

    // update (dt) {},

    begin () {
        this.unscheduleAllCallbacks();
 
        // spine
        for (let i = 0; i < this.GameOverEffect_Spines.length; i++) {
            let idx = i;
            // 定时执行
            if (this.GameOverEffect_Spines[idx].spine != null && this.GameOverEffect_Spines[idx].spine.node != null) {
                if (this.lastActive == undefined) {
                    this.GameOverEffect_Spines[idx].spine.node.lastActive =     this.GameOverEffect_Spines[idx].spine.node.active;
                    this.GameOverEffect_Spines[idx].spine.node.lastAnimation =  this.GameOverEffect_Spines[idx].spine.animation;
                    this.GameOverEffect_Spines[idx].spine.node.lastLoop =       this.GameOverEffect_Spines[idx].spine.loop;
                }
                //
                this.scheduleOnce(function(dt) {
                    this.GameOverEffect_Spines[idx].spine.node.active = true;
                    this.GameOverEffect_Spines[idx].spine.clearTrack(0);
                    this.GameOverEffect_Spines[idx].spine.setAnimation(0, this.GameOverEffect_Spines[idx].spineName, this.GameOverEffect_Spines[idx].spineLoop);
                }, this.GameOverEffect_Spines[idx].spineDelay)
            }
        }
        
        // animation
        for (let i = 0; i < this.GameOverEffect_Animations.length; i++) {
            let idx = i;
            // 定时执行
            if (this.GameOverEffect_Animations[idx].animation != null && this.GameOverEffect_Animations[idx].animation.node != null) {
                if (this.lastActive == undefined) {
                    this.GameOverEffect_Animations[idx].animation.node.lastActive =            this.GameOverEffect_Animations[idx].animation.node.active;
                    this.GameOverEffect_Animations[idx].animation.node.lastPosition =          this.GameOverEffect_Animations[idx].animation.node.position;
                    this.GameOverEffect_Animations[idx].animation.node.lastScale =             this.GameOverEffect_Animations[idx].animation.node.scale;
                    this.GameOverEffect_Animations[idx].animation.node.lastRotation =          this.GameOverEffect_Animations[idx].animation.node.rotation;
                }
                //
                this.scheduleOnce(function(dt) {
                    this.GameOverEffect_Animations[idx].animation.node.active = true;
                    let animState = this.GameOverEffect_Animations[idx].animation.play(this.GameOverEffect_Animations[idx].animationClipName);
                    animState.wrapMode = this.GameOverEffect_Animations[idx].animationLoop;
                }, this.GameOverEffect_Animations[idx].animationDelay)
            }
        }

        // audio
        for (let i = 0; i < this.GameOverEffect_Audios.length; i++) {
            let idx = i;
            // 定时执行
            if (this.GameOverEffect_Audios[idx].audio != null) {
                this.scheduleOnce(function () {
                    this.GameOverEffect_Audios[idx]._audioID = cc.audioEngine.play(this.GameOverEffect_Audios[idx].audio, this.GameOverEffect_Audios[idx].audioLoop);
                }, this.GameOverEffect_Audios[idx].audioDelay);
            }
        }

        // active node
        for (let i = 0; i < this.GameOverEffect_ActiveNodes.length; i++) {
            let idx = i;
            // 定时执行
            if (this.GameOverEffect_ActiveNodes[idx].activeNode != null) {
                if (this.lastActive == undefined) {
                    this.GameOverEffect_ActiveNodes[idx].activeNode.lastActive = this.GameOverEffect_ActiveNodes[idx].activeNode.active;
                }
                this.scheduleOnce(function(dt) {
                    this.GameOverEffect_ActiveNodes[idx].activeNode.active = this.GameOverEffect_ActiveNodes[idx].activeValue;
                    //
                    if (this.GameOverEffect_ActiveNodes[idx].activeRecoveTime > 0) {
                        this.scheduleOnce(function(dt) {
                            this.GameOverEffect_ActiveNodes[idx].activeNode.active = this.GameOverEffect_ActiveNodes[idx].activeNode.lastActive;
                        }, this.GameOverEffect_ActiveNodes[idx].activeRecoveTime);
                    }
                }, this.GameOverEffect_ActiveNodes[idx].activeDelay)
            }
        }

        // able component
        for (let i = 0; i < this.GameOverEffect_AbleComponents.length; i++) {
            let idx = i;
            // 定时执行
            if (this.GameOverEffect_AbleComponents[idx].ableNode != null) {
                if (this.lastActive == undefined) {
                    this.GameOverEffect_AbleComponents[idx].ableNode.lastAble = this.GameOverEffect_AbleComponents[idx].ableNode.getComponent(this.GameOverEffect_AbleComponents[idx].albeComponentName).enabled;
                }
                this.scheduleOnce(function(dt) {
                    this.GameOverEffect_AbleComponents[idx].ableNode.getComponent(this.GameOverEffect_AbleComponents[idx].albeComponentName).enabled = this.GameOverEffect_AbleComponents[idx].ableValue;
                    //
                    if (this.GameOverEffect_AbleComponents[idx].ableRecoveTime > 0) {
                        this.scheduleOnce(function(dt) {
                            this.GameOverEffect_AbleComponents[idx].ableNode.getComponent(this.GameOverEffect_AbleComponents[idx].albeComponentName).enabled = this.GameOverEffect_AbleComponents[idx].ableNode.lastAble;
                        }, this.GameOverEffect_AbleComponents[idx].ableRecoveTime);
                    }
                }, this.GameOverEffect_AbleComponents[idx].ableDelay)
            }
        }

        // callback
        for (let i = 0; i < this.GameOverEffect_EventHandlers.length; i++) {
            let idx = i;
            // 定时执行
            if (this.GameOverEffect_EventHandlers[idx].callback != null && this.GameOverEffect_EventHandlers[idx].callback.target != null) {
                this.scheduleOnce(function(dt) {
                    let eventHandler = new cc.Component.EventHandler();
                    eventHandler.target = this.GameOverEffect_EventHandlers[idx].callback.target;
                    eventHandler.component = this.GameOverEffect_EventHandlers[idx].callback.component;
                    eventHandler.handler = this.GameOverEffect_EventHandlers[idx].callback.handler
                    eventHandler.emit([this, this.GameOverEffect_EventHandlers[idx].callback.customEventData]);
                }, this.GameOverEffect_EventHandlers[idx].callbackDelay)
            }
        }

        // localZOrder
        for (let i = 0; i < this.GameOverEffect_LocalZOrders.length; i++) {
            let idx = i;
            if (this.GameOverEffect_LocalZOrders[idx].zOrderNode != null) {
                if (this.lastActive == undefined) {
                    this.GameOverEffect_LocalZOrders[idx].zOrderNode.lastLocalZOrder = this.GameOverEffect_LocalZOrders[idx].zOrderNode.getLocalZOrder();
                }
                this.GameOverEffect_LocalZOrders[idx].zOrderNode.setLocalZOrder(this.GameOverEffect_LocalZOrders[idx].localZOrderIndex);
            }
        }

        if (this.lastActive == undefined) {
            this.lastActive = this.node.active;
        }
        
        this.node.active = true;
    },


    reset () {
        this.unscheduleAllCallbacks();

        if (this.lastActive == undefined) {
            return;
        }

        // spine
        for (let i = this.GameOverEffect_Spines.length - 1; i >= 0; i--) {
            let idx = i;
            if (this.GameOverEffect_Spines[idx].spine != null && this.GameOverEffect_Spines[idx].spine.node != null) {
                if (this.GameOverEffect_Spines[idx].spine.node.lastActive) {
                    this.GameOverEffect_Spines[idx].spine.clearTrack(0);
                    this.GameOverEffect_Spines[idx].spine.setAnimation(0, this.GameOverEffect_Spines[idx].spine.node.lastAnimation, this.GameOverEffect_Spines[idx].spine.node.lastLoop);
                } else {
                    this.GameOverEffect_Spines[idx].spine.node.active = false;
                }
            }
        }
        
        // animation
        for (let i = this.GameOverEffect_Animations.length - 1; i >= 0; i--) {
            let idx = i;
            if (this.GameOverEffect_Animations[idx].animation != null && this.GameOverEffect_Animations[idx].animation.node != null) {
                this.GameOverEffect_Animations[idx].animation.node.position = this.GameOverEffect_Animations[idx].animation.node.lastPosition;
                this.GameOverEffect_Animations[idx].animation.node.scale =      this.GameOverEffect_Animations[idx].animation.node.lastScale;
                this.GameOverEffect_Animations[idx].animation.node.rotation =   this.GameOverEffect_Animations[idx].animation.node.lastRotation;

                if (this.GameOverEffect_Animations[idx].animation.node.lastActive) {
                    this.GameOverEffect_Animations[idx].animation.play(); // play defaultClip
                } else {
                    this.GameOverEffect_Animations[idx].animation.node.active = false;
                }
            }
        }
        
        // audio
        for (let i = this.GameOverEffect_Audios.length - 1; i >= 0; i--) {
            let idx = i;
            if (this.GameOverEffect_Audios[idx].audio != null && this.GameOverEffect_Audios[idx]._audioID >= 0) {
                cc.audioEngine.stop(this.GameOverEffect_Audios[idx]._audioID);
            }
        }

        // active node
        for (let i = 0; i < this.GameOverEffect_ActiveNodes.length; i++) {
            let idx = i;
            if (this.GameOverEffect_ActiveNodes[idx].activeNode != null) {
                this.GameOverEffect_ActiveNodes[idx].activeNode.active = this.GameOverEffect_ActiveNodes[idx].activeNode.lastActive;
            }
        }

        // able component
        for (let i = 0; i < this.GameOverEffect_AbleComponents.length; i++) {
            let idx = i;
            if (this.GameOverEffect_AbleComponents[idx].ableNode != null) {
                this.GameOverEffect_AbleComponents[idx].ableNode.getComponent(this.GameOverEffect_AbleComponents[idx].albeComponentName).enabled = this.GameOverEffect_AbleComponents[idx].ableNode.lastAble;
            }
        }

        // localZOrder
        for (let i = 0; i < this.GameOverEffect_LocalZOrders.length; i++) {
            let idx = i;
            if (this.GameOverEffect_LocalZOrders[idx].zOrderNode != null) {
                this.GameOverEffect_LocalZOrders[idx].zOrderNode.setLocalZOrder(this.GameOverEffect_LocalZOrders[idx].zOrderNode.lastLocalZOrder);
            }
        }
        
        this.node.active = this.lastActive;
    },
});
