// [建议直接添加在页面PageNode上]

// [供游戏逻辑脚本调用的方法]
// begin()          // 启动指引流程

cc.Class({
    extends: cc.Component,

    properties: {
        autoRun: {
            default: true,
            displayName: "自动指引",
            tooltip: 'true:无需点击触发，false:必须点击触发',
        },

        autoLeadTime: {
            default: 3,
            displayName: "自动指引时长",
            tooltip: '只有在 自动指引 勾选上时有效，指引节点存在时长，然后就 执行回调 并删除该指引节点',
        },

        delayTimes: {
            default: [],
            type: cc.Float,
            displayName: "延迟时长",
            tooltip: '[数组长度为教学引导点击个数, 没有保持0]（非自动指引模式下，延迟时长=点击之后到下一个指引开始的时间）',
        },

        clickRects: {
            default: [],
            type: cc.Rect,
            displayName: "点击位置宽高",
            tooltip: '[数组长度为教学引导点击个数, XY:位置, WH:宽高, 锚点:(0.5, 0.5), 建议在场景中临时计量]',
        },

        autoAudios: {
            default: [],
            url: cc.AudioClip,
            displayName: "自动语音",
            tooltip: '[数组长度为教学引导点击个数, 没有可以留空]（和spine，开始就播放）',
        },

        clickAudios: {
            default: [],
            url: cc.AudioClip,
            displayName: "点击语音",
            tooltip: '[数组长度为教学引导点击个数, 没有可以留空]（点击了才播放）',
        },

        clickSpines: {
            default: [],
            type: sp.SkeletonData,
            displayName: "点击Spine资源",
            tooltip: '[数组长度为教学引导点击个数, 没有可以留空](点击用于指引的Spine的Json文件，例如：手指效果)',
        },

        clickSpinesName: {
            default: [],
            type: cc.String,
            displayName: "点击Spine动画名称",
            tooltip: '[数组长度为教学引导点击个数, 没有可以留空,即显示Spine的第一帧图像]',
        },

        clickSpinesOffset: {
            default: [],
            type: cc.Vec2,
            displayName: "点击Spine位置偏移",
            tooltip: '[数组长度为教学引导点击个数, 没有可以留空](上面对于spine显示的便宜量)',
        },

        clickEvents: {
            default: [],
            type: cc.Component.EventHandler,
            displayName: "点击回调",
            tooltip: '[数组长度为教学引导点击个数, 没有可以留空]',
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    begin () {
        if (this.delayTimes.length <= 0 || 
            this.clickRects.length <= 0 ||
            this.autoAudios.length <= 0 ||
            this.clickAudios.length <= 0 ||
            this.clickSpines.length <= 0 ||
            this.clickSpinesName.length <= 0 ||
            this.clickSpinesOffset.length <= 0 ||
            this.clickEvents.length <= 0) {
            cc.warn("各数组长度必须大于0");
            return;
        }

        if (this.delayTimes.length != this.clickRects.length ||
            this.clickRects.length != this.autoAudios.length ||
            this.autoAudios.length != this.clickAudios.length ||
            this.clickAudios.length != this.clickSpines.length ||
            this.clickSpines.length != this.clickSpinesName.length ||
            this.clickSpinesName.length != this.clickSpinesOffset.length ||
            this.clickSpinesOffset.length != this.clickEvents.length) {
            cc.warn("各数组长度必须一致，其中可以留空");
            return;
        }

        this.newbiePointNode = null;

        this.newbieBaseNode = new cc.Node("NewbieBaseNode");
        this.newbieBaseNode.parent = this.node;
        this.newbieBaseNode.setPosition(0, 0);
        this.newbieBaseNode.setLocalZOrder(999);
        let widget = this.newbieBaseNode.addComponent(cc.Widget);
        widget.isAlignTop = true;       widget.top = 0;
        widget.isAlignBottom = true;    widget.bottom = 0;
        widget.isAlignLeft = true;      widget.left = 0;
        widget.isAlignRight = true;     widget.right = 0;
        this.newbieBaseNode.on(cc.Node.EventType.TOUCH_START, function(touchEvent) {
            touchEvent.stopPropagation();
            cc.log("无效区域");
        }, this);

        if (this.autoRun == true) {
            // 总时长累加
            let totalDelayTime = 0;
            for (let i = 0; i < this.delayTimes.length; i++) {
                // 保存 i
                let idx = i;
                // 累加上 当前指引点 延迟时长
                let tempDelayTime = totalDelayTime = totalDelayTime + this.delayTimes[idx];
                // 非头一次 再累加上 指引效果展示时长
                if (idx > 0) {
                    tempDelayTime = totalDelayTime += this.autoLeadTime;
                }
                // 定时执行
                this.scheduleOnce(function(dt) {
                    //cc.log("delaytime ====== " + tempDelayTime);
                    this.showPointByIndex (idx);
                }, tempDelayTime)
            }
        } else {
            // 定时执行
            this.scheduleOnce(function(dt) {
                this.showPointByIndex (0);
            }, this.delayTimes[0])
        }
    },

    showPointByIndex (idx) {
        if (this.newbiePointNode != null) {
            this.newbiePointNode.destroy();
            this.newbiePointNode = null;
        }

        this.newbiePointNode = new cc.Node("NewbiePointNode");
        this.newbiePointNode.parent = this.newbieBaseNode;
        this.newbiePointNode.idx = idx;
        this.newbiePointNode.setPosition(this.clickRects[idx].x, this.clickRects[idx].y);
        this.newbiePointNode.width = this.clickRects[idx].width;
        this.newbiePointNode.height = this.clickRects[idx].height;

        // 非自动指引 事件
        if (this.autoRun == false) {
            this.newbiePointNode.on(cc.Node.EventType.TOUCH_START, function(touchEvent) {
                // 语音
                if (this.clickAudios[idx] != null) {
                    cc.audioEngine.play(this.clickAudios[idx]);
                }
                // 事件
                if (this.clickEvents[idx].target != null) {
                    // 【 EventHandler 调用方式 1 】
                    let tempTarget = this.clickEvents[idx].target;
                    let tempComponent = tempTarget.getComponent(this.clickEvents[idx].component);
                    let tempHandler = tempComponent[this.clickEvents[idx].handler];
                    let tempCustomEventData = this.clickEvents[idx].customEventData;
                    let tempPositionData = this.clickRects[idx].origin;
                    tempHandler.apply(tempComponent, [this, tempPositionData, tempCustomEventData]);
                }
                
                if (idx >= this.delayTimes.length - 1) {
                    // 最最后 删除 指引根节点
                    if (this.newbieBaseNode != null) {
                        this.newbieBaseNode.destroy();
                        this.newbieBaseNode = null;
                    }
                } else {
                    // 开始延迟指引下一个点
                    this.scheduleOnce(function(dt) {
                        this.showPointByIndex(idx + 1)
                    }, this.delayTimes[idx + 1])
                    // 最后 删除 指引节点
                    if (this.newbiePointNode != null) {
                        this.newbiePointNode.destroy();
                        this.newbiePointNode = null;
                    }
                }
            }, this);
        }

        // Spine
        if (this.clickSpines[idx] != null) {
            let spineNode = new cc.Node();
            spineNode.parent = this.newbiePointNode;
            spineNode.setPosition(this.clickSpinesOffset[idx]);
            let spine = spineNode.addComponent(sp.Skeleton);
            spine.skeletonData = this.clickSpines[idx];
            spine.loop = true;
            spine.clearTrack(0);
            spine.setAnimation(0, this.clickSpinesName[idx], true);
        }

        // 自动指引 事件
        if (this.autoRun == true) {
            // 语音
            if (this.autoAudios[idx] != null) {
                cc.audioEngine.play(this.autoAudios[idx]);
            }

            // 延迟指引下一个点
            this.scheduleOnce(function(dt) {
                // 事件
                if (this.clickEvents[idx].target != null) {
                    // 【 EventHandler 调用方式 2 】
                    let eventHandler = new cc.Component.EventHandler();
                    eventHandler.target = this.clickEvents[idx].target;
                    eventHandler.component = this.clickEvents[idx].component;
                    eventHandler.handler = this.clickEvents[idx].handler
                    eventHandler.emit([this, this.clickRects[idx].origin, this.clickEvents[idx].customEventData]);
                }
                if (idx >= this.delayTimes.length - 1) {
                    // 最最后 删除 指引根节点
                    if (this.newbieBaseNode != null) {
                        this.newbieBaseNode.destroy();
                        this.newbieBaseNode = null;
                    }
                } else {
                    // 最后 删除 指引节点
                    if (this.newbiePointNode != null) {
                        this.newbiePointNode.destroy();
                        this.newbiePointNode = null;
                    }
                }
            }, this.autoLeadTime)
        }
    },

    // update (dt) {},
});
