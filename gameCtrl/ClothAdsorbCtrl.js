
cc.Class({
    extends: cc.Component,

    properties: {
        targetImages: {
            default: [],
            type: [cc.Node],
            displayName:"目标图片",
            tooltip:"目标图片"
        },
        shadeImages: {
            default: [],
            type: [cc.Node],
            displayName:"遮罩图片",
            tooltip:"需要与目标图片一一对应，不必须存在"
        },
        dragImages: {
            default: [],
            type: [cc.Node],
            displayName:"拖拽图片",
            tooltip:"可以拖拽的图片"
        },
        bgImages: {
            default: [],
            type: [cc.Node],
            displayName:"底部图片",
            tooltip:"底部的图片"
        },
        wrongImages: {
            default: [],
            type: [cc.Node],
            displayName:"错误的图片",
            tooltip:"错误的可拖拽的图片"
        },
        unconcernedImages: {
            default: [],
            type: [cc.Node],
            displayName:"无关的图片",
            tooltip:"不需要操作的的图片"
        },
        finishImages: {
            default: [],
            type: [cc.Node],
            displayName:"最终的图片",
            tooltip:"最终要显示的人物图片"
        },
        distance: {
            default: 200,
            displayName:"吸附距离",
        },
        completeAdsorbAudio: {
            default: null,
            url: cc.AudioClip,
            displayName:"吸附完成音频"
        },
        successCallback: {
            default: null,
            type: cc.Component.EventHandler,
            displayName: "成功回调",
        }
    },

    // resetPicture() {
    //     for (let i = 0; i < this.dragImages.length; i++) {
    //         let target = this.targetImages[i];
    //         let drag = this.dragImages[i];
    //         drag.stopActionByTag(111);
    //         drag.position = this.posArray[i];
    //         if (this.adsorbWay) {
    //             target.active = false;
    //             drag.active = true;
    //         } else {
    //             let shade = this.shadeImages[i];
    //             shade.active = true;
    //             target.active = true;
    //             drag.active = true;
    //         }
    //     }
    // },
    // LIFE-CYCLE CALLBACKS:

    // onEnable() {
    //    // this.resetPicture();
    // },

    onLoad () {
        if (!this.checkAssets()) {
            return;
        }
        
        this.hiddenAndEvents();
    },

    checkAssets() {
        if (this.completeAdsorbAudio == null) {
            cc.warn("audio source is null");
        }
        if (this.targetImages.length == 0){
            cc.warn("目标图片为0");
            return false;
        }
        if (this.targetImages.length != this.dragImages.length) {
            cc.warn("目标图片和拖拽图片数量不一致");
            return false;
        }
        if (this.dragImages.length == 0){
            cc.warn("可拖拽图片为0");
            return false;
        }
        return true;
    },
    //隐藏目标控件 //给拖动图片添加事件
    hiddenAndEvents() {
        for (let i = 0; i < this.wrongImages.length; i++) {
            let wrong = this.wrongImages[i];
            cc.log("======== ============= ");
            wrong.on(cc.Node.EventType.TOUCH_START, function (event) {
                 // 让节点左右来回移动，并重复5次
                var seq = cc.repeat(
                    cc.sequence(
                        cc.moveBy(0.1, 50, 0),
                        cc.moveBy(0.1, -50, 0)
                    ), 2);
                wrong.runAction(seq);
            }.bind(this), this);
        }

        this.posArray = [];
        for (let i = 0; i < this.targetImages.length; i++){
            let target = this.targetImages[i];
            let drag = this.dragImages[i];
            let shade = this.shadeImages[i];
            target.active = false;
            this.posArray[i] = drag.position;//记录drag物体初始的位置
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
                if (!this.isDistance(i)) {
                    this.back(drag);
                } else {
                    this.adsorb(i,target,drag, shade);
                }
            },this);

            drag.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
                if (!this.isDistance(i)) {
                    this.back(drag);
                } else {
                    this.adsorb(i, target, drag, shade);
                }
            }, this);
        }
    },
    //判断是否符合吸附距离
    isDistance(index) {
        let target = this.targetImages[index];
        let drag = this.dragImages[index];
        let WorldTargetPos = target.parent.convertToWorldSpaceAR(target.position);
        let WorldDragPos = drag.parent.convertToWorldSpaceAR(drag.position);
        var dis = cc.pDistance(WorldTargetPos, WorldDragPos);
        cc.log("========" + dis);
        if (dis < this.distance) {
            return true;
        } else {
            return false;
        }
    },
    //吸附
    adsorb(i, target, drag, shade) {
        
        let WorldTargetPos = target.parent.convertToWorldSpaceAR(target.position);
        let NodeDragPos = drag.parent.convertToNodeSpaceAR(WorldTargetPos);
        var seq = cc.sequence(cc.moveTo(0.3,NodeDragPos),cc.callFunc(function(){
            this.current = cc.audioEngine.play(this.completeAdsorbAudio, false, 1);
            drag.active = false;
            target.active = true;
            shade.active = false;
            let bg = this.bgImages[i];
            bg.color = cc.Color.GRAY;
            this.successDrag();
        },this));
        seq.setTag(111);
        drag.runAction(seq);
    },
    back(drag) {
        drag.runAction(cc.moveTo(0.2,drag.originalPosition.x, drag.originalPosition.y));
    },
    successDrag() {
        //如果完成拖拽执行完成后的动画效果
        if (this.completeAdsorb()) {
            for (let i = 0; i < this.unconcernedImages.length; i++) {
                let unconcerned = this.unconcernedImages[i];
                unconcerned.active = false;
            }
            for (let i = 0; i < this.finishImages.length; i++) {
                let finish = this.finishImages[i];
                finish.active = true;
            }
            cc.log("success     ==========  ");
            if (this.successCallback != null && this.successCallback.target != null) {
                this.successCallback.emit([this, this.successCallback.customEventData]);
            }
        }
    },
    completeAdsorb() {
        for (let i = 0; i < this.shadeImages.length; i++) {
            if (this.shadeImages[i].active) {
                return false;
            }
        }
        return true;
    },
    start () {

    },

    // update (dt) {},

});
