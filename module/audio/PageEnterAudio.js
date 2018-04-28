// [建议直接添加在页面PageNode上]

// [供游戏逻辑脚本调用的方法]
// questionAudioLoop                // 属性值，false：就会停止题目语音；true：就会恢复题目语音。
// playQuestionAudioAgain()         // 重播 题目音效

cc.Class({
    extends: cc.Component,

    properties: {
        audioType: {
            default: 1,
            displayName: "开场语音类型",
            tooltip: "1:开场语音\n2:开场语音+题目(重复)\n3:题目(重复)\n[ 2和3会计算语音时长，Edit模式下无法正常计算，强制设置为8s，确切时长请在浏览器模式下确定延迟时长和间隔时长 ]",
        },
        questionAudioLoop: {
            default: true,
            displayName: "题目语音是否重复",
            tooltip: "控制题目语音是否重复，默认true重复，当需要暂停或者停止的时候设置为false",
        },
        questionDeltaTime: {
            default: 0.0,
            displayName: "题目语音重复间隔",
            tooltip: "控制题目语音重复播放的间隔时间(上一段播放完 到 开始播放下一段)，默认true重复，当需要暂停或者停止的时候设置为false",
        },

        enterAudioDelay: {
            default: 0.0,
            displayName: "开场延迟时间",
            tooltip: "开场语音延迟播放时间",
        },
        enterAudio: {
            default: null,
            url: cc.AudioClip,
            displayName: "开场语音",
            tooltip: "开场语音类型为1和2时，必须设置",
        },

        questionAudioDelay: {
            default: 0.0,
            displayName: "题目延迟时间",
            tooltip: "题目语音延迟播放时间（如果有开场语音，这个延迟时间是指在开场语音结束之后的再延迟）",
        },
        questionAudio: {
            default: null,
            url: cc.AudioClip,
            displayName: "题目语音",
            tooltip: "开场语音类型为2和3时，必须设置",
        },

        enterAudioOver1: {
            default: null,
            type: cc.Component.EventHandler,
            displayName: "开场音效结束回调",
        },

        questionAudioOver1: {
            default: null,
            type: cc.Component.EventHandler,
            displayName: "一遍题目音效结束回调",
        },

        _enterAudioFunc: null,          // 存储进入语音引用
        _questionAudioFunc: null,       // 存储题目语音引用
        _questionAudioPlayed: false,    // 题目是否播放过（题目不重复但至少播放一次）
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () { },

    // start () { },

    // update (dt) {},

    playQuestionAudioAgain (delay = 0) {
        if (this.questionAudioLoop == false) {
            this.scheduleOnce(function () {
                if (this.questionAudioID != undefined) {
                    cc.audioEngine.stop(this.questionAudioID);
                }
                if (this.questionAudio != null) {
                    this._questionAudioPlayed = true;
                    this.questionAudioID = cc.audioEngine.play(this.questionAudio);
                }
            }, delay);
        }
    },

    onEnable() {
        if ((this.audioType == 1 || this.audioType == 2) && this.enterAudio == null)  {
            cc.warn("开场语音类型为1和2时，必须设置'开场语音'");
            return;
        }
        if ((this.audioType == 2 || this.audioType == 3) && this.questionAudio == null) {
            cc.warn("开场语音类型为2和3时，必须设置'题目语音'");
            return;
        }

        //this.questionAudioLoop = true;
        this.enterAuidoID = undefined;
        this.questionAudioID = undefined;
        
        // 1:开场语音
        if (this.audioType == 1) {

            // 开场语音
            this.scheduleOnce(this._enterAudioFunc = function () {
                this.enterAuidoID = cc.audioEngine.play(this.enterAudio);
                if (this.enterAudioOver1 != null) {
                    cc.audioEngine.setFinishCallback(this.enterAuidoID, function () {
                        // 兼容之前的用法
                        //this.node.emit("PageEnterAuido_Type1_Over");
                        
                        let eventHandler = new cc.Component.EventHandler();
                        eventHandler.target = this.enterAudioOver1.target;
                        eventHandler.component = this.enterAudioOver1.component;
                        eventHandler.handler = this.enterAudioOver1.handler
                        eventHandler.emit([this, this.enterAudioOver1.customEventData]);
                    }.bind(this));
                }
            }, this.enterAudioDelay);
        }

        // 2:开场语音+题目(重复/不重复)
        else if (this.audioType == 2) {
            
            // 开场语音
            this.scheduleOnce(this._enterAudioFunc = function () {
                
                // 播放 并获取 开场语音时长
                this.enterAuidoID = cc.audioEngine.play(this.enterAudio);
                this.enterAuidoDuration = cc.audioEngine.getDuration(this.enterAuidoID);
                if (this.enterAuidoDuration <= 0) {
                    this.enterAuidoDuration = 8;    // Edit模式下，bug跳过
                }
                if (this.enterAudioOver1 != null) {
                    cc.audioEngine.setFinishCallback(this.enterAuidoID, function () {
                        let eventHandler = new cc.Component.EventHandler();
                        eventHandler.target = this.enterAudioOver1.target;
                        eventHandler.component = this.enterAudioOver1.component;
                        eventHandler.handler = this.enterAudioOver1.handler
                        eventHandler.emit([this, this.enterAudioOver1.customEventData]);
                    }.bind(this));
                }

                // 获取 题目语音时长
                this.questionAudioID = cc.audioEngine.play(this.questionAudio);
                this.questionAudioDuration = cc.audioEngine.getDuration(this.questionAudioID);
                if (this.questionAudioDuration <= 0) {
                    this.questionAudioDuration = 8; // Edit模式下，bug跳过
                }
                cc.audioEngine.stop(this.questionAudioID);
                
                // 题目语音
                this.schedule(this._questionAudioFunc = function () {
                    
                    // 当【暂停、停止、当前Node隐藏】就不播放了
                    if (this._questionAudioPlayed == false || this.questionAudioLoop) {
                        this.questionAudioID = cc.audioEngine.play(this.questionAudio);
                        //
                        if (this._questionAudioPlayed == false && this.questionAudioOver1 != null) {
                            cc.audioEngine.setFinishCallback(this.questionAudioID, function () {
                                let eventHandler = new cc.Component.EventHandler();
                                eventHandler.target = this.questionAudioOver1.target;
                                eventHandler.component = this.questionAudioOver1.component;
                                eventHandler.handler = this.questionAudioOver1.handler
                                eventHandler.emit([this, this.questionAudioOver1.customEventData]);
                            }.bind(this));
                        }
                        //
                        this._questionAudioPlayed = true;
                    }
                }, this.questionDeltaTime + this.questionAudioDuration, cc.macro.REPEAT_FOREVER, this.enterAuidoDuration + this.questionAudioDelay);
            }, this.enterAudioDelay);
        }

        // 3:题目(重复／不重复)
        else if (this.audioType == 3) {

            // 题目语音
            // 开场就播
            this.questionAudioID = cc.audioEngine.play(this.questionAudio);
            this.questionAudioDuration = cc.audioEngine.getDuration(this.questionAudioID);
            if (this.questionAudioDuration <= 0) {
                this.questionAudioDuration = 8;     // Edit模式下，bug跳过
            }

            if (this.questionAudioOver1 != null) {
                cc.audioEngine.setFinishCallback(this.questionAudioID, function () {
                    let eventHandler = new cc.Component.EventHandler();
                    eventHandler.target = this.questionAudioOver1.target;
                    eventHandler.component = this.questionAudioOver1.component;
                    eventHandler.handler = this.questionAudioOver1.handler
                    eventHandler.emit([this, this.questionAudioOver1.customEventData]);
                }.bind(this));
            }

            // 重复播放
            this.schedule(this._questionAudioFunc = function () {
                
                // 当【暂停、停止、当前Node隐藏】就不播放了
                if (this.questionAudioLoop) {
                    this.questionAudioID = cc.audioEngine.play(this.questionAudio);
                }
            }, this.questionDeltaTime + this.questionAudioDuration, cc.macro.REPEAT_FOREVER, this.questionAudioDelay);
        }
    },

    onDisable() {
        this.questionAudioLoop = false;
        if (this.enterAuidoID != undefined) {
            cc.audioEngine.stop(this.enterAuidoID);
        }
        if (this.questionAudioID != undefined) {
            cc.audioEngine.stop(this.questionAudioID);
        }
        this.unschedule(this._enterAudioFunc);
        this.unschedule(this._questionAudioFunc);
    }
});
