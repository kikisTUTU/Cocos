/*
    使用说明：
        1. 此脚本为上色控制器
        2. 配合着挂载了Pen.js脚本的节点使用
        3. 控制器主要完成以下工作
            3.1 呈现多个画笔，多个绘画区域
            3.2 点中画笔时，程序将记录画笔色值
            3.3 但绘画区域被点击时，如已有色值被系统记录，那么将区域染色
        4. 通过将挂载有Pen.js脚本的画笔节点s, 拖入到画笔列表内
        5. 将区域节点拖入到上色版列表
        6. 点击铅笔偏移量，指铅笔被点击时的激活位置，例：
            6.1 若铅笔在右侧自上而下排列，偏移量可为（-100， 0）笔被点击时将会左移
            6.2 若铅笔在下侧自做而右排列，偏移量可为（0， 100）笔被点击时将会上移
        7. 绘制区域是否为碰撞体
            7.1 如果是碰撞体，需要给绘制区域添加（多边形）碰撞体，目前还不支持方形和椭圆形碰撞体（无必要，后续也不会支持）
            7.2 如果不是碰撞体，那么点击区域与节点区域相同
        8. 如果需要生成公式运算，则需要添加OperationCtrl.js 运算控制器，（未完成待编辑）
            
*/

var tsFormuleGenerator = require("TSFormuleGenerator");

var Pen = require("Pen");
cc.Class({
    extends: cc.Component,

    properties: {
        pens: {
            default: [],
            type: [cc.Node],
            displayName: "画笔列表",
            tooltip: ""
        },

        tintAreas: {
            default: [],
            type: [cc.Node],
            displayName: "上色版列表",
            tooltip: ""
        },

        penOffset: {
            default: cc.Vec2.ZERO,
            displayName: "点击铅笔偏移量",
            tooltip: ""
        },

        isCollider: {
            default: false,
            displayName: "绘制区域是否为碰撞体",
            tooltip: "如果需要精细描边而不是方形点击区域，请选择此选项并添加多边形碰撞体到铅笔上"
        },

        operationCtrl: {
            default: null,
            type: cc.Node,
            displayName: "运算控制器",
        },

        wrongSound: {
            url: cc.AudioClip,
            default: null,
            displayName: "点错声音",
        },

        successNode: {
            default: null,
            type: cc.Node,
            displayName: "成功节点",
        }
    },

    onLoad() {
        this.setBlankArea();
        if (this.successNode) {
            this.successNode.active = false;
        }  
    },

    start () {
        this.initOperation();
        this.initPens();

        this.initTintAreas();       
    },

    reset() {
        for (i = 0; i < this.tintAreas.length; ++i) {
            var area = this.tintAreas[i];
            area.color = cc.Color.WHITE;
        }
        this.resetPensOrigin();
        this.initOperation();
        this.setPensLabel();
        this.setTintAreaLabel();
        this.setBlankArea();
    },

    setBlankArea() {
        for(i = 0; i < this.tintAreas.length; ++i) {
            var area = this.tintAreas[i];
            area.color = cc.Color.WHITE;
        }
    },

    initOperation() {
        if (this.operationCtrl) {
            this.opsCtrl = this.operationCtrl.getComponent("OperationCtrl");
            this.formules = this.opsCtrl.createFormule();
            this.opsCtrl.formules = this.formules;
        }
    },

    initPens() {
        for(i = 0; i < this.pens.length; ++i) {
            var pen = this.pens[i];
            pen.on(cc.Node.EventType.TOUCH_START, function(event) {
                this.penClicked(event.currentTarget);
            }, this);
        }
        
        this.setPensLabel();
    },

    setPensLabel() {
        if ((!this.operationCtrl) || (this.formules.length === 0)) {
            return;
        }

        for(i = 0; i < this.pens.length; ++i) {
            if (i <= this.formules.length) {
                var formule = this.formules[i];
                var penComp = this.pens[i].getComponent("Pen");
                penComp.formule = formule;
                penComp.label.string = formule.toString(false);
            }
        }
    },

    resetPensOrigin() {
        for(i = 0; i < this.pens.length; ++i) {
            var pen = this.pens[i];
            var penComp = pen.getComponent(Pen);
            penComp.setActive(false);
            pen.position = penComp.origin
            if (pen.position !== penComp.origin) {
                var action = cc.moveTo(0.2, penComp.origin);
                pen.runAction(action);
            }
        }
    },

    penClicked(pen) {
        this.currentPen = pen;
        var penComp = pen.getComponent(Pen);

        var color = penComp.color;
        if (!penComp.isActive) {
            this.currentColor = color;
            this.resetPensOrigin();
            var action = cc.moveBy(0.2, this.penOffset);
            pen.runAction(action);
        }
        penComp.setActive(true);
    },

    initTintAreas() {
        cc.director.getCollisionManager().enabled = this.isCollider;

        if (this.isCollider) {
            this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
                event.stopPropagation();
                var touchLoc = event.getLocation();
                this.touchNode(touchLoc);
            }, this);
        } else {
            for(i = 0; i < this.tintAreas.length; ++i) {
                var area = this.tintAreas[i];
                area.on(cc.Node.EventType.TOUCH_START, function(event) {
                    this.areaClicked(event.currentTarget);
                }, this);
            }
        }

        this.setTintAreaLabel();
    },

    touchNode(touchLoc) {
        for(i = 0; i < this.tintAreas.length; ++i) {
            var worldPoints = this.tintAreas[i].getComponent(cc.PolygonCollider).world.points;
            if (cc.Intersection.pointInPolygon(touchLoc, worldPoints)) {
                this.areaClicked(this.tintAreas[i]);
            }
        }

        if (this.checkSuccess()) {
            this.success();
        }
    },

    setTintAreaLabel() {
        if ((!this.operationCtrl) || (this.formules.length === 0)) {
            return;
        }
        for(i = 0; i < this.tintAreas.length; ++i) {
            var area = this.tintAreas[i];
            var areaComp = area.getComponent("TintArea");
            areaComp.formule = this.opsCtrl.lessUsedFormule();
            areaComp.label.string = areaComp.formule.result;
        }
    },

    areaClicked(area) {
        if (this.currentColor !== undefined) {
            var areaComp = area.getComponent("TintArea");
            if (this.operationCtrl) {
                var penComp = this.currentPen.getComponent("Pen");
                if (penComp.formule.result !== areaComp.formule.result) {
                    this.answerWrong();
                    return;
                }
                
            } 

            area.color = this.currentColor;
            areaComp.correct = true;
        }
    },

    answerWrong() {
        cc.audioEngine.play(this.wrongSound, false, 1);
    },

    checkSuccess() {
        var success = true;
        for (i = 0; i < this.tintAreas.length; ++i) {
            var areaComp = this.tintAreas[i].getComponent("TintArea");
            
            if (areaComp.correct === undefined) {
                success = false;
                break;
            }
        }
        return success;
    }, 

    success() {
        if (this.successNode) {
            this.successNode.active = true;
        }
    }



    
});
