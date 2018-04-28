// reset的时候，Animation类别的处理方式是play defaultClip

var ClickEffects_Spine = cc.Class({
    name: "ClickEffects_Spine",
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

var ClickEffects_Animation = cc.Class({
    name: "ClickEffects_Animation",
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


var ClickEffects_Audio = cc.Class({
    name: "ClickEffects_Audio",
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

var ClickEffects_ActiveNode = cc.Class({
    name: "ClickEffects_ActiveNode",
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

var ClickEffects_AbleComponent = cc.Class({
    name: "ClickEffects_AbleComponent",
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

var ClickEffects_EventHandler = cc.Class({
    name: "ClickEffects_EventHandler",
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


var ClickEffects_LocalZOrder = cc.Class({
    name: "ClickEffects_LocalZOrder",
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

        ClickEffects_Spines: {
            default: [],
            type: ClickEffects_Spine,
            displayName: "Spine动画数组",
        },

        ClickEffects_Animations: {
            default: [],
            type: ClickEffects_Animation,
            displayName: "Animation动画数组",
        },

        ClickEffects_Audios: {
            default: [],
            type: ClickEffects_Audio,
            displayName: "Audio语音数组",
        },

        ClickEffects_ActiveNodes: {
            default: [],
            type: ClickEffects_ActiveNode,
            displayName: "是否激活节点数组",
        },

        ClickEffects_AbleComponents: {
            default: [],
            type: ClickEffects_AbleComponent,
            displayName: "是否使能组件数组",
        },

        ClickEffects_EventHandlers: {
            default: [],
            type: ClickEffects_EventHandler,
            displayName: "延迟回调数组",
        },

        ClickEffects_LocalZOrders: {
            default: [],
            type: ClickEffects_LocalZOrder,
            displayName: "局部层级调整数组",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        if (this.canClickTimes <= 0) {
            this.canClickTimes = 9999;
        }

        this.currentTimeStamp = new Date();

        this.node.on(cc.Node.EventType.TOUCH_END, this.clickCallback, this);
    },

    // update (dt) {},

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
        
        // spine
        for (let i = 0; i < this.ClickEffects_Spines.length; i++) {
            let idx = i;
            // 定时执行
            if (this.ClickEffects_Spines[idx].spine != null && this.ClickEffects_Spines[idx].spine.node != null) {
                if (this.lastActive == undefined) {
                    this.ClickEffects_Spines[idx].spine.node.lastActive =     this.ClickEffects_Spines[idx].spine.node.active;
                    this.ClickEffects_Spines[idx].spine.node.lastAnimation =  this.ClickEffects_Spines[idx].spine.animation;
                    this.ClickEffects_Spines[idx].spine.node.lastLoop =       this.ClickEffects_Spines[idx].spine.loop;
                }
                //
                this.scheduleOnce(function(dt) {
                    this.ClickEffects_Spines[idx].spine.node.active = true;
                    this.ClickEffects_Spines[idx].spine.clearTrack(0);
                    this.ClickEffects_Spines[idx].spine.setAnimation(0, this.ClickEffects_Spines[idx].spineName, this.ClickEffects_Spines[idx].spineLoop);
                }, this.ClickEffects_Spines[idx].spineDelay)
            }
        }
        
        // animation
        for (let i = 0; i < this.ClickEffects_Animations.length; i++) {
            let idx = i;
            // 定时执行
            if (this.ClickEffects_Animations[idx].animation != null && this.ClickEffects_Animations[idx].animation.node != null) {
                if (this.lastActive == undefined) {
                    this.ClickEffects_Animations[idx].animation.node.lastActive =            this.ClickEffects_Animations[idx].animation.node.active;
                    this.ClickEffects_Animations[idx].animation.node.lastPosition =          this.ClickEffects_Animations[idx].animation.node.position;
                    this.ClickEffects_Animations[idx].animation.node.lastScale =             this.ClickEffects_Animations[idx].animation.node.scale;
                    this.ClickEffects_Animations[idx].animation.node.lastRotation =          this.ClickEffects_Animations[idx].animation.node.rotation;
                }
                //
                this.scheduleOnce(function(dt) {
                    this.ClickEffects_Animations[idx].animation.node.active = true;
                    let animState = this.ClickEffects_Animations[idx].animation.play(this.ClickEffects_Animations[idx].animationClipName);
                    animState.wrapMode = this.ClickEffects_Animations[idx].animationLoop;
                }, this.ClickEffects_Animations[idx].animationDelay)
            }
        }

        // audio
        for (let i = 0; i < this.ClickEffects_Audios.length; i++) {
            let idx = i;
            // 定时执行
            if (this.ClickEffects_Audios[idx].audio != null) {
                this.scheduleOnce(function () {
                    this.ClickEffects_Audios[idx]._audioID = cc.audioEngine.play(this.ClickEffects_Audios[idx].audio, this.ClickEffects_Audios[idx].audioLoop);
                }, this.ClickEffects_Audios[idx].audioDelay);
            }
        }

        // active node
        for (let i = 0; i < this.ClickEffects_ActiveNodes.length; i++) {
            let idx = i;
            // 定时执行
            if (this.ClickEffects_ActiveNodes[idx].activeNode != null) {
                if (this.lastActive == undefined) {
                    this.ClickEffects_ActiveNodes[idx].activeNode.lastActive = this.ClickEffects_ActiveNodes[idx].activeNode.active;
                }
                //
                this.scheduleOnce(function(dt) {
                    this.ClickEffects_ActiveNodes[idx].activeNode.active = this.ClickEffects_ActiveNodes[idx].activeValue;
                    //
                    if (this.ClickEffects_ActiveNodes[idx].activeRecoveTime > 0) {
                        this.scheduleOnce(function(dt) {
                            this.ClickEffects_ActiveNodes[idx].activeNode.active = this.ClickEffects_ActiveNodes[idx].activeNode.lastActive;
                        }, this.ClickEffects_ActiveNodes[idx].activeRecoveTime);
                    }
                }, this.ClickEffects_ActiveNodes[idx].activeDelay)
            }
        }

        // able component
        for (let i = 0; i < this.ClickEffects_AbleComponents.length; i++) {
            let idx = i;
            // 定时执行
            if (this.ClickEffects_AbleComponents[idx].ableNode != null) {
                if (this.lastActive == undefined) {
                    this.ClickEffects_AbleComponents[idx].ableNode.lastAble = this.ClickEffects_AbleComponents[idx].ableNode.getComponent(this.ClickEffects_AbleComponents[idx].albeComponentName).enabled;
                }
                //
                this.scheduleOnce(function(dt) {
                    this.ClickEffects_AbleComponents[idx].ableNode.getComponent(this.ClickEffects_AbleComponents[idx].albeComponentName).enabled = this.ClickEffects_AbleComponents[idx].ableValue;
                    //
                    if (this.ClickEffects_AbleComponents[idx].ableRecoveTime > 0) {
                        this.scheduleOnce(function(dt) {
                            this.ClickEffects_AbleComponents[idx].ableNode.getComponent(this.ClickEffects_AbleComponents[idx].albeComponentName).enabled = this.ClickEffects_AbleComponents[idx].ableNode.lastAble;
                        }, this.ClickEffects_AbleComponents[idx].ableRecoveTime);
                    }
                }, this.ClickEffects_AbleComponents[idx].ableDelay)
            }
        }

        // callback
        for (let i = 0; i < this.ClickEffects_EventHandlers.length; i++) {
            let idx = i;
            // 定时执行
            if (this.ClickEffects_EventHandlers[idx].callback != null && this.ClickEffects_EventHandlers[idx].callback.target != null) {
                this.scheduleOnce(function(dt) {
                    let eventHandler = new cc.Component.EventHandler();
                    eventHandler.target = this.ClickEffects_EventHandlers[idx].callback.target;
                    eventHandler.component = this.ClickEffects_EventHandlers[idx].callback.component;
                    eventHandler.handler = this.ClickEffects_EventHandlers[idx].callback.handler
                    eventHandler.emit([this, this.ClickEffects_EventHandlers[idx].callback.customEventData]);
                }, this.ClickEffects_EventHandlers[idx].callbackDelay)
            }
        }

        // localZOrder
        for (let i = 0; i < this.ClickEffects_LocalZOrders.length; i++) {
            let idx = i;
            if (this.ClickEffects_LocalZOrders[idx].zOrderNode != null) {
                if (this.lastActive == undefined) {
                    this.ClickEffects_LocalZOrders[idx].zOrderNode.lastLocalZOrder = this.ClickEffects_LocalZOrders[idx].zOrderNode.getLocalZOrder();
                }
                this.ClickEffects_LocalZOrders[idx].zOrderNode.setLocalZOrder(this.ClickEffects_LocalZOrders[idx].localZOrderIndex);
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
        for (let i = this.ClickEffects_Spines.length - 1; i >= 0; i--) {
            let idx = i;
            if (this.ClickEffects_Spines[idx].spine != null && this.ClickEffects_Spines[idx].spine.node != null) {
                if (this.ClickEffects_Spines[idx].spine.node.lastActive) {
                    this.ClickEffects_Spines[idx].spine.clearTrack(0);
                    this.ClickEffects_Spines[idx].spine.setAnimation(0, this.ClickEffects_Spines[idx].spine.node.lastAnimation, this.ClickEffects_Spines[idx].spine.node.lastLoop);
                } else {
                    this.ClickEffects_Spines[idx].spine.node.active = false;
                }
            }
        }
        
        // animation
        for (let i = this.ClickEffects_Animations.length - 1; i >= 0; i--) {
            let idx = i;
            if (this.ClickEffects_Animations[idx].animation != null && this.ClickEffects_Animations[idx].animation.node != null) {
                this.ClickEffects_Animations[idx].animation.node.position = this.ClickEffects_Animations[idx].animation.node.lastPosition;
                this.ClickEffects_Animations[idx].animation.node.scale =      this.ClickEffects_Animations[idx].animation.node.lastScale;
                this.ClickEffects_Animations[idx].animation.node.rotation =   this.ClickEffects_Animations[idx].animation.node.lastRotation;

                if (this.ClickEffects_Animations[idx].animation.node.lastActive) {
                    this.ClickEffects_Animations[idx].animation.play(); // play defaultClip
                } else {
                    this.ClickEffects_Animations[idx].animation.node.active = false;
                }
            }
        }
        
        // audio
        for (let i = this.ClickEffects_Audios.length - 1; i >= 0; i--) {
            let idx = i;
            if (this.ClickEffects_Audios[idx].audio != null && this.ClickEffects_Audios[idx]._audioID >= 0) {
                cc.audioEngine.stop(this.ClickEffects_Audios[idx]._audioID);
            }
        }

        // active node
        for (let i = 0; i < this.ClickEffects_ActiveNodes.length; i++) {
            let idx = i;
            if (this.ClickEffects_ActiveNodes[idx].activeNode != null) {
                this.ClickEffects_ActiveNodes[idx].activeNode.active = this.ClickEffects_ActiveNodes[idx].activeNode.lastActive;
            }
        }

        // able component
        for (let i = 0; i < this.ClickEffects_AbleComponents.length; i++) {
            let idx = i;
            if (this.ClickEffects_AbleComponents[idx].ableNode != null) {
                this.ClickEffects_AbleComponents[idx].ableNode.getComponent(this.ClickEffects_AbleComponents[idx].albeComponentName).enabled = this.ClickEffects_AbleComponents[idx].ableNode.lastAble;
            }
        }

        // localZOrder
        for (let i = 0; i < this.ClickEffects_LocalZOrders.length; i++) {
            let idx = i;
            if (this.ClickEffects_LocalZOrders[idx].zOrderNode != null) {
                this.ClickEffects_LocalZOrders[idx].zOrderNode.setLocalZOrder(this.ClickEffects_LocalZOrders[idx].zOrderNode.lastLocalZOrder);
            }
        }
        
        this.node.active = this.lastActive;
    },
});
