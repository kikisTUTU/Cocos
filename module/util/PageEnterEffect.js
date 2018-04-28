// 建议直接添加在页面PageNode上, 如Page1
// 添加游戏场景的开场效果

cc.Class({
    extends: cc.Component,

    properties: () => ({
        initScale : {
            default: new cc.Vec2(1,1),
            displayName : "场景初始尺寸",
            tooltip : "如果有场景深移动的需求，可以设置此项0"
        },
        spineNode : {
            default : [],
            type : [cc.Node],
            displayName : "spine动画的节点",
            tooltip : "放入对应的包含spine动画的节点"
        },
        spineName : {
            default : [],
            type : [cc.String],
            displayName : "spine动画的名字",
            tooltip : "需要播放的动画名"
        },
        spineDelay : {
            default : [],
            type : [cc.Float],
            displayName : "spine动画延时",
            tooltip : "spine动画的延迟时间（秒）"
        },
        duration : {
            default : 0,
            displayName : "持续时间",
            tooltip : "整个开场效果的持续时间(秒)"
        },
        spineEndDuration: {
            default: 0,
            displayName: "结尾动画的时间",
            tooltip: "结尾动画的持续时间(秒)"
        },
        spineEndPosition : {
            default : [],
            type : [cc.Vec2],
            displayName : "spine动画结束位置",
            tooltip : "spine动画结束时，需要移动的距离（px）"
        },
    }),

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.checkProperties();

        this.createFakeNode();
    },

    start () {
        this.stageInit();

        this.scheduleOnce(function () {
            console.log("animation should end");
            this.enterGame();
        },this.duration);
        
        this.scheduleOnce(function () {
            console.log("all start action is finished");
            this.newbieBaseNode.destroy();
        }, this.duration+this.spineEndDuration);
    },

    createFakeNode () {
        this.newbieBaseNode = new cc.Node("NewbieBaseNode");
        this.newbieBaseNode.parent = this.node;
        this.newbieBaseNode.setPosition(0, 0);
        this.newbieBaseNode.setLocalZOrder(999);
        let widget = this.newbieBaseNode.addComponent(cc.Widget);
        widget.isAlignTop = true; widget.top = 0;
        widget.isAlignBottom = true; widget.bottom = 0;
        widget.isAlignLeft = true; widget.left = 0;
        widget.isAlignRight = true; widget.right = 0;
        this.newbieBaseNode.on(cc.Node.EventType.TOUCH_START, function (touchEvent) {
            touchEvent.stopPropagation();
            cc.warn("还不能点击哦");
        }, this);
    },

    checkProperties () {
        if(this.initScale.x < 0  || this.initScale.y < 0 ){
            cc.warn("设置的缩放比例应大于0");
        }

    },

    stageInit () {
        // 设置初始比例
        if (this.initScale.x != 1 && this.initScale.y != 1){
            this.node.setScale(this.initScale);
        }

        //播放动画
        if(this.spineNode !== null){
            for (let i = 0; i < this.spineNode.length; i++) {
                let spineAni = this.spineNode[i].getComponent(sp.Skeleton);
                spineAni.clearTrack(0);
                spineAni.setAnimation(0, "std", false, 0);
                spineAni.addAnimation(0, this.spineName[i], false,this.spineDelay[i]);
                spineAni.addAnimation(0, "std", true, 1);
            }
        }
    },

    enterGame () {
        // 背景缩小
        let actionBgScale = cc.scaleTo(this.spineEndDuration, 1, 1);
        this.node.runAction(actionBgScale);
        
        // spine节点移动
        let spineAct = cc.moveBy(this.spineEndDuration, this.spineEndPosition[i].x, this.spineEndPosition[i].y);
        if (this.spineNode !== null) {
            for (let i = 0; i < this.spineNode.length; i++) {
                //回到静止帧
                let spineAni = this.spineNode[i].getComponent(sp.Skeleton);
                spineAni.clearTrack(0);
                spineAni.setAnimation(0, "std1", false, 0);

                this.spineNode[i].runAction(spineAct.clone());
            }
        } 
    }


    // update (dt) {},
});
