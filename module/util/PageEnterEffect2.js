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
        effectNode : {
            default : [],
            type : [cc.Node],
            displayName : "展示开场效果的节点",
            tooltip : "放入对应的需要展示开场效果的节点（包括spine节点）"
        },
        startDelay : {
            default : [],
            type : [cc.Float],
            displayName : "开场效果延时",
            tooltip : "开场效果的延迟时间（秒）"
        },
        startDisplacement: {
            default: [],
            type: [cc.Vec2],
            displayName: "节点开场移动的距离",
            tooltip: "拖入的节点在开场需要移动的距离（px），右下为正，左上为负"
        },
        startEffectDuration : {
            default : 0,
            displayName : "开始动作持续时间",
            tooltip : "整个开场效果的持续时间(秒)"
        },
        endDelay : {
            default : 0,
            type : cc.Float,
            displayName: "开场效果后的延时",
            tooltip: "开场效果展示完后到结束动作的间隔时间（秒）"
        },
        endDisplacement : {
            default : [],
            type : [cc.Vec2],
            displayName : "效果结束后，节点需要移动的距离",
            tooltip: "拖入的节点在效果（动画）表现完后需要移动的距离（px），右下为正，左上为负"
        },
        endEffectDuration: {
            default: 0,
            displayName: "结束动作的持续时间",
            tooltip: "结尾效果的持续时间(秒)"
        }
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
        }, this.startEffectDuration + this.endDelay);
        
        this.scheduleOnce(function () {
            console.log("all start action is finished");
            if(this.newbieBaseNode){
                this.newbieBaseNode.destroy();
            }
        }, this.startEffectDuration + this.endDelay + this.endEffectDuration);
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

        let isArgEquals = this.isEquals(this.effectNode.length, this.startDelay.length, this.startDisplacement.length, this.endDisplacement.length, this.endEffectDuration);
        if (!isArgEquals) {
            cc.warn("参数长度不完全相等，请检查");
        }

    },

    stageInit () {
        // 设置初始比例
        if (this.initScale.x != 1 && this.initScale.y != 1){
            this.node.setScale(this.initScale);
        }

        //播放动画
        let startAct =  cc.sequence(
                            cc.delayTime(this.startDelay[i]),
                            cc.moveBy(this.startEffectDuration, this.startDisplacement[i].x, this.startDisplacement[i].y)
                        );
        if(this.effectNode !== null){
            for (let index = 0; index < this.effectNode.length; index++) {
                this.effectNode[i].runAction(startAct.clone());
            }
        }
    },

    enterGame () {
        // 背景缩小
        let actionBgScale = cc.scaleTo(this.endEffectDuration, 1, 1);
        this.node.runAction(actionBgScale);
        
        // spine节点移动
        let endAct = cc.moveBy(this.endEffectDuration, this.endDisplacement[i].x, this.endDisplacement[i].y);
        if (this.effectNode !== null) {
            for (let i = 0; i < this.effectNode.length; i++) {
                //回到静止帧
                console.log(this.effectNode[i].getComponent(sp.Skeleton));
                if (this.effectNode[i].getComponent(sp.Skeleton)){
                    let spineAni = this.effectNode[i].getComponent(sp.Skeleton);
                    spineAni.clearTrack(0);
                    spineAni.setAnimation(0, "std1", false, 0);
                }

                this.effectNode[i].runAction(endAct.clone());
            }
        } 
    },

    isEquals () {
        let i,j;
        if(arguments.length < 2){
            console.log("至少需要2个类别");
        }

        for (let i = 0; i < arguments.length; i++) {
            for (let j = i+1; j < arguments.length; j++) {
                if(arguments[i] != arguments[j]){
                    return false;
                }
            }
        }

        return true;
    }


    // update (dt) {},
});
