/*
    使用说明：
        1. 在Canvas下新建一个空节点
        2. 将空节点放置树形最下方，以便现实在屏幕最顶层
        3. 添加Widget组件到节点上，根据实际情况调整，推荐设置边距为0
        4. 将此脚本挂载到节点上
        5. 在节点下创建精灵Sprite子节点，设置spriteFrame为手指图片
        6. 将手指节点拖入脚本内的pointor属性中
        7. 按需求设置位置列表和音频列表
            7.1 位置列表为每次移动到的位置
            7.2 音频列表可为全空，也可个别为空，空即没有音频播放
        8. 如果需要遮罩体
            8.1 在此节点下创建空子节点，并拖入TeachingMask的遮罩属性中
            8.2 在空子节点上添加Mask组件，（添加渲染组件，Mask）
            8.3 可设置遮罩类型为圆形，方形，图片型
            8.4 按需调整遮罩体Node组件上Size的数值
            8.5 勾选Inverted选项，将得到聚光灯效果，
            8.6 调整Segments，越大锯齿越少，但要越大也会影响计算效率
            8.7 在Mask节点下再创建一个精灵节点，置遮罩类型为圆形时可创建单色节点
            8.8 将此单色节点的size调大，如5000 5000
            8.9 根据需要，调整挂载了此TeachingMask脚本的父节点，将Opacity调弱可呈现半透明
*/
var tsFormuleGenerator = require("TSFormuleGenerator");

cc.Class({
    extends: cc.Component,

    properties: {
        pointor: {
            default: null,        
            type: cc.Node,
            displayName: "手指节点",
            tooltip: "拖入场景中的手指"
        },

        positions: {
            default: [],
            type: [cc.Vec2],
            displayName: "位置列表",
            tooltip: "手指将按位置顺序显示"
        },

        audios: {
            default: [],
            type: [cc.AudioClip],
            displayName: "音频列表",
            tooltip: "音频将对应顺序播放"
        },

        isBgClickable: {
            default: false,
            displayName: "背景是否可点",
            tooltip: "如是，点击背景时，也会切换下一页"
        },

        isAnim: {
            default: false,
            displayName: "手指是否带移动",
            tooltip: "如是，点击背景时，也会切换下一页"
        },

        moveSpeed: {
            default: 1,
            displayName: "移动速度",
            tooltip: "只有在手指可移动状态下才会生效, 初始1为1秒内完成，60为1/60秒内完成"
        },

        mask: {
            default: null,
            type: cc.Node,
            displayName: "遮罩",
            tooltip: "Inverted为真的遮罩体"
        },       
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
        this.pointor.on(cc.Node.EventType.TOUCH_START, function(event) {
            this.click();
            // 防止背景穿透，防止手指和背景同时响应
            event.stopPropagation();
        }, this);
        
        this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
            if (this.isBgClickable) {
                this.click();
            }
            // 防止背景穿透
            event.stopPropagation();
        }, this);
        
        this.setPosition();
    },

    click() {
        this.setPosition();
    },

    setPosition() {
        if (this.positions.length > 0) {
            if (this.isAnim) {
                var action = cc.moveTo(1/this.moveSpeed, this.positions[0]);
                action.easing(cc.easeIn(3.0));
                this.pointor.runAction(action);
                
                if (this.mask != null) {
                    var action2 = cc.moveTo(1/this.moveSpeed, this.positions[0]);
                    action2.easing(cc.easeIn(3.0));
                    this.mask.runAction(action2);
                }
            } else {
                this.pointor.position = this.positions[0];

                if (this.mask != null) {
                    this.mask.position = this.positions[0];
                }
            }

            if (this.audios.length > 0) {
                if (this.currentSpeech != null) {
                    cc.audioEngine.stop(this.currentSpeech);
                }
                if (this.audios[0] != null) {
                    this.currentSpeech = cc.audioEngine.play(this.audios[0], false, 1);
                }
                
                this.audios.splice(0, 1);
            }
            
            this.positions.splice(0, 1);
        } else {
            this.end();
        }
    },

    end() {
        this.pointor.destroy();
        this.node.destroy();
    },

    onDestroy: function () {
        cc.audioEngine.stop(this.currentSpeech);
    }

    // update (dt) {},
});
