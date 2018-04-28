// onDisable的时候，Animation类别的处理方式是play defaultClip

var AutoEffects_Spine = cc.Class({
    name: "AutoEffects_Spine",
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

var AutoEffects_Animation = cc.Class({
    name: "AutoEffects_Animation",
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


var AutoEffects_Audio = cc.Class({
    name: "AutoEffects_Audio",
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

var AutoEffects_ActiveNode = cc.Class({
    name: "AutoEffects_ActiveNode",
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

var AutoEffects_AbleComponent = cc.Class({
    name: "AutoEffects_AbleComponent",
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

var AutoEffects_EventHandler = cc.Class({
    name: "AutoEffects_EventHandler",
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

var AutoEffects_LocalZOrder = cc.Class({
    name: "AutoEffects_LocalZOrder",
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
        AutoEffects_Spines: {
            default: [],
            type: AutoEffects_Spine,
            displayName: "Spine动画数组",
        },

        AutoEffects_Animations: {
            default: [],
            type: AutoEffects_Animation,
            displayName: "Animation动画数组",
        },

        AutoEffects_Audios: {
            default: [],
            type: AutoEffects_Audio,
            displayName: "Audio语音数组",
        },

        AutoEffects_ActiveNodes: {
            default: [],
            type: AutoEffects_ActiveNode,
            displayName: "是否激活节点数组",
        },

        AutoEffects_AbleComponents: {
            default: [],
            type: AutoEffects_AbleComponent,
            displayName: "是否使能组件数组",
        },

        AutoEffects_EventHandlers: {
            default: [],
            type: AutoEffects_EventHandler,
            displayName: "延迟回调数组",
        },

        AutoEffects_LocalZOrders: {
            default: [],
            type: AutoEffects_LocalZOrder,
            displayName: "局部层级调整数组",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () { },

    // update (dt) {},

    onEnable () {
        this.unscheduleAllCallbacks();
        
        // spine
        for (let i = 0; i < this.AutoEffects_Spines.length; i++) {
            let idx = i;
            // 定时执行
            if (this.AutoEffects_Spines[idx].spine != null && this.AutoEffects_Spines[idx].spine.node != null) {
                if (this.lastActive == undefined) {
                    this.AutoEffects_Spines[idx].spine.node.lastActive =     this.AutoEffects_Spines[idx].spine.node.active;
                    this.AutoEffects_Spines[idx].spine.node.lastAnimation =  this.AutoEffects_Spines[idx].spine.animation;
                    this.AutoEffects_Spines[idx].spine.node.lastLoop =       this.AutoEffects_Spines[idx].spine.loop;
                }
                //
                this.scheduleOnce(function(dt) {
                    this.AutoEffects_Spines[idx].spine.node.active = true;
                    this.AutoEffects_Spines[idx].spine.clearTrack(0);
                    this.AutoEffects_Spines[idx].spine.setAnimation(0, this.AutoEffects_Spines[idx].spineName, this.AutoEffects_Spines[idx].spineLoop);
                }, this.AutoEffects_Spines[idx].spineDelay)
            }
        }
        
        // animation
        for (let i = 0; i < this.AutoEffects_Animations.length; i++) {
            let idx = i;
            // 定时执行
            if (this.AutoEffects_Animations[idx].animation != null && this.AutoEffects_Animations[idx].animation.node != null) {
                if (this.lastActive == undefined) {
                    this.AutoEffects_Animations[idx].animation.node.lastActive =            this.AutoEffects_Animations[idx].animation.node.active;
                    this.AutoEffects_Animations[idx].animation.node.lastPosition =          this.AutoEffects_Animations[idx].animation.node.position;
                    this.AutoEffects_Animations[idx].animation.node.lastScale =             this.AutoEffects_Animations[idx].animation.node.scale;
                    this.AutoEffects_Animations[idx].animation.node.lastRotation =          this.AutoEffects_Animations[idx].animation.node.rotation;
                }
                //
                this.scheduleOnce(function(dt) {
                    this.AutoEffects_Animations[idx].animation.node.active = true;
                    let animState = this.AutoEffects_Animations[idx].animation.play(this.AutoEffects_Animations[idx].animationClipName);
                    animState.wrapMode = this.AutoEffects_Animations[idx].animationLoop;
                }, this.AutoEffects_Animations[idx].animationDelay)
            }
        }

        // audio
        for (let i = 0; i < this.AutoEffects_Audios.length; i++) {
            let idx = i;
            // 定时执行
            if (this.AutoEffects_Audios[idx].audio != null) {
                this.scheduleOnce(function () {
                    this.AutoEffects_Audios[idx]._audioID = cc.audioEngine.play(this.AutoEffects_Audios[idx].audio, this.AutoEffects_Audios[idx].audioLoop);
                }, this.AutoEffects_Audios[idx].audioDelay);
            }
        }

        // active node
        for (let i = 0; i < this.AutoEffects_ActiveNodes.length; i++) {
            let idx = i;
            // 定时执行
            if (this.AutoEffects_ActiveNodes[idx].activeNode != null) {
                if (this.lastActive == undefined) {
                    this.AutoEffects_ActiveNodes[idx].activeNode.lastActive = this.AutoEffects_ActiveNodes[idx].activeNode.active;
                }

                this.scheduleOnce(function(dt) {
                    this.AutoEffects_ActiveNodes[idx].activeNode.active = this.AutoEffects_ActiveNodes[idx].activeValue;
                    //
                    if (this.AutoEffects_ActiveNodes[idx].activeRecoveTime > 0) {
                        this.scheduleOnce(function(dt) {
                            this.AutoEffects_ActiveNodes[idx].activeNode.active = this.AutoEffects_ActiveNodes[idx].activeNode.lastActive;
                        }, this.AutoEffects_ActiveNodes[idx].activeRecoveTime);
                    }
                }, this.AutoEffects_ActiveNodes[idx].activeDelay)
            }
        }

        // able component
        for (let i = 0; i < this.AutoEffects_AbleComponents.length; i++) {
            let idx = i;
            // 定时执行
            if (this.AutoEffects_AbleComponents[idx].ableNode != null) {
                if (this.lastActive == undefined) {
                    this.AutoEffects_AbleComponents[idx].ableNode.lastAble = this.AutoEffects_AbleComponents[idx].ableNode.getComponent(this.AutoEffects_AbleComponents[idx].albeComponentName).enabled;
                }
                //
                this.scheduleOnce(function(dt) {
                    this.AutoEffects_AbleComponents[idx].ableNode.getComponent(this.AutoEffects_AbleComponents[idx].albeComponentName).enabled = this.AutoEffects_AbleComponents[idx].ableValue;
                    //
                    if (this.AutoEffects_AbleComponents[idx].ableRecoveTime > 0) {
                        this.scheduleOnce(function(dt) {
                            this.AutoEffects_AbleComponents[idx].ableNode.getComponent(this.AutoEffects_AbleComponents[idx].albeComponentName).enabled = this.AutoEffects_AbleComponents[idx].ableNode.lastAble;
                        }, this.AutoEffects_AbleComponents[idx].ableRecoveTime);
                    }
                }, this.AutoEffects_AbleComponents[idx].ableDelay)
            }
        }

        // callback
        for (let i = 0; i < this.AutoEffects_EventHandlers.length; i++) {
            let idx = i;
            // 定时执行
            if (this.AutoEffects_EventHandlers[idx].callback != null && this.AutoEffects_EventHandlers[idx].callback.target != null) {
                this.scheduleOnce(function(dt) {
                    let eventHandler = new cc.Component.EventHandler();
                    eventHandler.target = this.AutoEffects_EventHandlers[idx].callback.target;
                    eventHandler.component = this.AutoEffects_EventHandlers[idx].callback.component;
                    eventHandler.handler = this.AutoEffects_EventHandlers[idx].callback.handler
                    eventHandler.emit([this, this.AutoEffects_EventHandlers[idx].callback.customEventData]);
                }, this.AutoEffects_EventHandlers[idx].callbackDelay)
            }
        }

        // localZOrder
        for (let i = 0; i < this.AutoEffects_LocalZOrders.length; i++) {
            let idx = i;
            if (this.AutoEffects_LocalZOrders[idx].zOrderNode != null) {
                if (this.lastActive == undefined) {
                    this.AutoEffects_LocalZOrders[idx].zOrderNode.lastLocalZOrder = this.AutoEffects_LocalZOrders[idx].zOrderNode.getLocalZOrder();
                }
                this.AutoEffects_LocalZOrders[idx].zOrderNode.setLocalZOrder(this.AutoEffects_LocalZOrders[idx].localZOrderIndex);
            }
        }

        if (this.lastActive == undefined) {
            this.lastActive = this.node.active;
        }
        
        this.node.active = true;
    },


    onDisable () {
        this.unscheduleAllCallbacks();

        if (this.lastActive == undefined) {
            return;
        }

        // spine
        for (let i = this.AutoEffects_Spines.length - 1; i >= 0; i--) {
            let idx = i;
            if (this.AutoEffects_Spines[idx].spine != null && this.AutoEffects_Spines[idx].spine.node != null) {
                if (this.AutoEffects_Spines[idx].spine.node.lastActive) {
                    this.AutoEffects_Spines[idx].spine.clearTrack(0);
                    this.AutoEffects_Spines[idx].spine.setAnimation(0, this.AutoEffects_Spines[idx].spine.node.lastAnimation, this.AutoEffects_Spines[idx].spine.node.lastLoop);
                } else {
                    this.AutoEffects_Spines[idx].spine.node.active = false;
                }
            }
        }
        
        // animation
        for (let i = this.AutoEffects_Animations.length - 1; i >= 0; i--) {
            let idx = i;
            if (this.AutoEffects_Animations[idx].animation != null && this.AutoEffects_Animations[idx].animation.node != null) {
                this.AutoEffects_Animations[idx].animation.node.position = this.AutoEffects_Animations[idx].animation.node.lastPosition;
                this.AutoEffects_Animations[idx].animation.node.scale =      this.AutoEffects_Animations[idx].animation.node.lastScale;
                this.AutoEffects_Animations[idx].animation.node.rotation =   this.AutoEffects_Animations[idx].animation.node.lastRotation;

                if (this.AutoEffects_Animations[idx].animation.node.lastActive) {
                    this.AutoEffects_Animations[idx].animation.play(); // play defaultClip
                } else {
                    this.AutoEffects_Animations[idx].animation.node.active = false;
                }
            }
        }
        
        // audio
        for (let i = this.AutoEffects_Audios.length - 1; i >= 0; i--) {
            let idx = i;
            if (this.AutoEffects_Audios[idx].audio != null && this.AutoEffects_Audios[idx]._audioID >= 0) {
                cc.audioEngine.stop(this.AutoEffects_Audios[idx]._audioID);
            }
        }

        // active node
        for (let i = 0; i < this.AutoEffects_ActiveNodes.length; i++) {
            let idx = i;
            if (this.AutoEffects_ActiveNodes[idx].activeNode != null) {
                this.AutoEffects_ActiveNodes[idx].activeNode.active = this.AutoEffects_ActiveNodes[idx].activeNode.lastActive;
            }
        }

        // able component
        for (let i = 0; i < this.AutoEffects_AbleComponents.length; i++) {
            let idx = i;
            if (this.AutoEffects_AbleComponents[idx].ableNode != null) {
                this.AutoEffects_AbleComponents[idx].ableNode.getComponent(this.AutoEffects_AbleComponents[idx].albeComponentName).enabled = this.AutoEffects_AbleComponents[idx].ableNode.lastAble;
            }
        }

        // localZOrder
        for (let i = 0; i < this.AutoEffects_LocalZOrders.length; i++) {
            let idx = i;
            if (this.AutoEffects_LocalZOrders[idx].zOrderNode != null) {
                this.AutoEffects_LocalZOrders[idx].zOrderNode.setLocalZOrder(this.AutoEffects_LocalZOrders[idx].zOrderNode.lastLocalZOrder);
            }
        }
        
        this.node.active = this.lastActive;
    },
});
