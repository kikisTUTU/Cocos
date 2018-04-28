

cc.Class({
    extends: cc.Component,

    properties: {
        images: {
            default: [],
            type: [cc.SpriteFrame],
            displayName:"所有图片",
            tooltip:"所有图片"
        },
        left:{
            default: null,
            type: cc.Button,
            displayName:"左边按钮"
        },
        right: {
            default: null,
            type: cc.Button,
            displayName:"右边按钮"
        },
        img:{
            default: [],
            type: [cc.Node],
            displayName:"最初显示的图片"
        },
        pos: {
            default: [],
            type: [cc.Node],
            displayName:"图片摆放的位置"
        },
        borders: {
            default: [],
            type: [cc.SpriteFrame],
            displayName:"边框图片"
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(this.img.length != this.pos.length){
            cc.warn("显示图片的数量要与显示位置的数量一致");
        }
        if(this.img.length>this.images.length){
            cc.warn("显示图片的数量不能超过所有图片的数量");
        }
        if(this.pos.length>this.images.length){
            cc.warn("显示图片位置的数量不能超过所有图片的数量");
        }

        this.currentStartIndex = 0;
        // this.first.getComponent(cc.Sprite).spriteFrame = this.images[this.currentMiddleIndex-1];
        // this.middle.getComponent(cc.Sprite).spriteFrame = this.images[this.currentMiddleIndex];
        // this.end.getComponent(cc.Sprite).spriteFrame = this.images[this.currentMiddleIndex+1];
        //初始化显示的图片
        for(let i = 0; i < this.img.length; i++){
            this.img[i].children[0].getComponent(cc.Sprite).spriteFrame = this.images[i];
            this.pos[i].item = this.img[i];
            if(this.img[i].children[0].width >= this.img[i].children[0].height){//横图
                this.img[i].children[1].getComponent(cc.Sprite).spriteFrame = this.borders[0];
            }else{//竖图
                this.img[i].children[1].getComponent(cc.Sprite).spriteFrame = this.borders[1];
            }
        }
        
        //中间图放大
        //this.img[1].scale = this.pos[1].scale;

        //滑动事件
        this.canScroll = true;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touches, event) { 
                console.log('TOUCH_START');
                this.startPosX = touches.getLocation().x;
                return true;
                }.bind(this), 
            onTouchMoved: function (touches, event) { 
                return true; 
            }.bind(this),
            onTouchEnded: function (touches, event) { 
                console.log('TOUCH_END');
                if(this.canScroll){
                    this.canScroll = false;
                    this.endPosX = touches.getLocation().x;
                    this.deltaX = this.endPosX - this.startPosX;
                    cc.log(this.deltaX);
                    if(this.deltaX>100){
                        this.previousItem();
                    }else if(this.deltaX<-100){
                        this.nextItem();
                    }
                }
            }.bind(this),
            //onTouchCanceled: this.onTouchCanceled.bind(this)
        }, this.node);
    },

    start () {
        
    },

    // update (dt) {},

    nextItem() {
        //this.currentMiddleIndex++;
        this.currentStartIndex++;
        if(this.currentStartIndex > this.images.length-this.img.length){//超过最后一项
            //this.currentMiddleIndex=3;
            this.currentStartIndex = this.images.length-this.img.length;
            this.images.push(this.images[0]);//尾部添加第一个元素
            this.images.splice(0,1);//删除第一个
        }

        var Startitem = this.pos[0].item;
        for(let i = 0; i < this.pos.length; i++){
            var Curitem = this.pos[i].item;
            if(i==0){
                Curitem.opacity = 0;
                Curitem.children[0].getComponent(cc.Sprite).spriteFrame = this.images[this.currentStartIndex+(this.img.length-1)];
                if(Curitem.children[0].width >= Curitem.children[0].height){//横图
                    Curitem.children[1].getComponent(cc.Sprite).spriteFrame = this.borders[0];
                }else{//竖图
                    Curitem.children[1].getComponent(cc.Sprite).spriteFrame = this.borders[1];
                }
                Curitem.position = this.pos[this.pos.length-1].position;
                var actionFadeIn = cc.fadeTo(0.5,255);
                Curitem.runAction(actionFadeIn);
                this.pos[i].item = this.pos[i+1].item;
                cc.log(this.pos[i].item.name);
            }else{
                var actionMoveTo = cc.moveTo(0.5, this.pos[i-1]);
                var actionScaleTo = cc.scaleTo(0.5, this.pos[i-1].scale);
                var spawn = cc.spawn(actionMoveTo, actionScaleTo);
                var finished = cc.callFunc(function () {
                    this.canScroll = true;
                    if(i==this.pos.length-1){
                        this.pos[i].item = Startitem;
                    }else{
                        this.pos[i].item = this.pos[i+1].item;
                    }
                    cc.log(this.pos[i].item.name);
                }.bind(this));
                var myAction = cc.sequence(spawn, finished);//动作执行完 才能执行后续的滑动
                Curitem.runAction(myAction);
            }
        }

        // for (let i = 0; i < this.img.length; i++) {
        //     //最后一张处理
        //     if(this.img[i].position.x == this.pos[0].position.x){
        //         this.img[i].opacity = 0;
        //         this.img[i].children[0].getComponent(cc.Sprite).spriteFrame = this.images[this.currentStartIndex+(this.img.length-1)];
        //         this.img[i].position = this.pos[this.pos.length-1].position;
        //         var actionFadeIn = cc.fadeTo(0.5,255);
        //         this.img[i].runAction(actionFadeIn);
        //         continue;
        //     }
        //     for(let j = 1;j < this.pos.length;j++){
        //         cc.log(i+":"+this.img[i].position.x);
        //         if(this.img[i].position.x == this.pos[j].position.x){
        //             //往左移
        //             var actionMoveTo = cc.moveTo(0.5, posVec);
        //             var actionScaleTo = cc.scaleTo(0.5, this.pos[j-1].scale);
        //             var spawn = cc.spawn(actionMoveTo, actionScaleTo);
        //             var finished = cc.callFunc(function () {
        //                 this.canScroll = true;
        //                 cc.log("p"+this.pos[j-1].position);
        //                 cc.log(i+"after:"+this.img[i].position.x);
        //             }.bind(this));
        //             var myAction = cc.sequence(spawn, finished);//动作执行完 才能执行后续的滑动
        //             this.img[i].runAction(myAction);
    },

    previousItem() {
        this.currentStartIndex--;
        if(this.currentStartIndex<0){
            this.currentStartIndex = 0;
            this.images.unshift(this.images[this.images.length-1]);//头部添加
            this.images.pop(this.images[this.images.length-1]);//删除最后一项
        }
        var Lastitem = this.pos[this.pos.length-1].item;
        for(let i = this.pos.length-1; i >= 0; i--){
            var Curitem = this.pos[i].item;
            if(i == this.pos.length-1){
                Curitem.opacity = 0;
                Curitem.children[0].getComponent(cc.Sprite).spriteFrame = this.images[this.currentStartIndex];
                if(Curitem.children[0].width >= Curitem.children[0].height){//横图
                    Curitem.children[1].getComponent(cc.Sprite).spriteFrame = this.borders[0];
                }else{//竖图
                    Curitem.children[1].getComponent(cc.Sprite).spriteFrame = this.borders[1];
                }
                Curitem.position = this.pos[0].position;
                var actionFadeIn = cc.fadeTo(0.5,255);
                Curitem.runAction(actionFadeIn);
                this.pos[i].item = this.pos[i-1].item;
                cc.log(this.pos[i].item.name);
            }else{
                //往右移
                var actionMoveTo = cc.moveTo(0.5, this.pos[i+1].position);
                var actionScaleTo = cc.scaleTo(0.5, this.pos[i+1].scale);
                var spawn = cc.spawn(actionMoveTo, actionScaleTo);
                var finished = cc.callFunc(function () {
                    this.canScroll = true;
                    if(i==0){
                        this.pos[i].item = Lastitem;
                    }else{
                        this.pos[i].item = this.pos[i-1].item;
                    }
                    cc.log(this.pos[i].item.name);
                }.bind(this));
                var myAction = cc.sequence(spawn, finished);//动作执行完 才能执行后续的滑动
                Curitem.runAction(myAction);
            }
        }
    },
});
