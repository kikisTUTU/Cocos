
cc.Class({
    extends: cc.Component,

    properties: {
        targetImages: {
            default: [],
            type: [cc.Node],
            displayName:"目标图片",
            tooltip:"目标图片，需要和可拖拽图片一一对应"
        },
        shadeImages: {
            default: [],
            type: [cc.Node],
            displayName:"遮罩图片",
            tooltip:"遮罩图片，需要和目标图片完全重合"
        },
        dragImages: {
            default: [],
            type: [cc.Node],
            displayName:"拖拽图片",
            tooltip:"可以拖拽的图片，需要与目标图片一一对应，不必须存在"
        },
        distance: {
            default: 200,
            displayName:"吸附距离",
        },
        adsorbWay: {
            default: true,
            type: cc.Boolean,
            displayName:"吸附方式",
            tooltip:"吸附方式默认为true:表示类似于拼五官的效果，并且一定只传入两组对应的图片;如果为false:表示类似于拼身体的效果,并且需要传入三组一一对应的图片"
        },
        successCallback: {
            default: null,
            type: cc.Component.EventHandler,
            displayName: "成功回调",
        }

    },

    resetPicture() {
        for (let i = 0; i < this.dragImages.length; i++) {
            let target = this.targetImages[i];
            let drag = this.dragImages[i];
            drag.position = this.posArray[i];
            if (this.adsorbWay) {
                target.active = false;
                drag.active = true;
            } else {
                let shade = this.shadeImages[i];
                shade.active = true;
                target.active = true;
                drag.active = true;
            }
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onEnable() {
        this.resetPicture();
    },

    onLoad () {
        if (!this.checkAssets()) {
            return;
        }
        this.hiddenAndEvents();
    },

    checkAssets() {
        if (this.targetImages.length == 0){
            cc.warn("目标图片为0");
            return false;
        }
        if (this.dragImages.length == 0){
            cc.warn("可拖拽图片为0");
            return false;
        }
        if(this.targetImages.length != this.dragImages.length) {
            cc.warn("目标图片和下方图片数量不等");
            return false;
        }
        if (!this.adsorbWay) {
            if(this.targetImages.length != this.shadeImages.length) {
                cc.warn("遮罩图片数量不对应");
            }
        }
        return true;
    },
    //隐藏目标控件 //给拖动图片添加事件
    hiddenAndEvents() {
        this.posArray = [];
        for (let i = 0; i < this.dragImages.length; i++){
            let target = this.targetImages[i];
            if (this.adsorbWay) {
                target.active = false;
            }
            let drag = this.dragImages[i];
            this.posArray[i] = drag.position;//记录所有物体初始的位置
            drag.on(cc.Node.EventType.TOUCH_START, function (event) {
                //记录起始点位置
                drag.originalPosition = drag.position;
            }.bind(this), this);
            drag.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
                let delta = event.touch.getDelta();
                drag.x += delta.x;
                drag.y += delta.y;
            }.bind(this),this);

            drag.on(cc.Node.EventType.TOUCH_END, function (event) {
                this.successDrag();
                if (!this.isDistance(i)) {
                    this.back(drag);
                } else {
                    this.adsorb(i,target,drag);
                }
            },this);

            drag.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
                this.successDrag();
                if (!this.isDistance(i)) {
                    this.back(drag);
                } else {
                    this.adsorb(i, target, drag);
                }
            }, this);
        }
    },
    handleAdsorb(isHandel,target,drag) {
        if (isHandel) {
            this.adsorb(target,drag);
        }
    },
    //判断是否符合吸附距离
    isDistance(index) {
        let target = this.targetImages[index];
        let drag = this.dragImages[index];
        var dis = cc.pDistance(target.position, drag.position);
        if (dis < this.distance) {
            return true;
        } else {
            return false;
        }
    },
    //吸附
    adsorb(i, target, drag) {
        var seq = cc.sequence(cc.moveTo(0.5,target.position.x,target.position.y),cc.callFunc(function(){
            if (this.adsorbWay) {
                drag.active = false;
                target.active = true;
            } else {
                let shade = this.shadeImages[i];
                drag.active = false;
                shade.active = false;
            } 
        },this));
        drag.runAction(seq);
    },
    back(drag) {
        drag.runAction(cc.moveTo(0.2,drag.originalPosition.x, drag.originalPosition.y));
    },
    successDrag() {
        //如果完成拖拽执行完成后的动画效果
        if (this.completeAdsorb) {
            if (this.successCallback != null && this.successCallback.target != null) {
                this.successCallback.emit([this, this.successCallback.customEventData]);
            }
        }
    },
    completeAdsorb() {
        for (let i = 0; i < this.dragImages.length; i++) {
            if (this.dragImages[i].active) {
                return false;
            }
        }
        return true;
    },
    start () {

    },

    // update (dt) {},

});
