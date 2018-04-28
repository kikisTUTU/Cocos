
cc.Class({
    extends: cc.Component,
    properties: {
        items: {
            default: [],
            type: [cc.Node],
            displayName:"物体数组",
            tooltip:"一共有几个物体数组"
        },
        figureItems:{
            default: [],
            type: [cc.Node],
            displayName:"手指数组",
            tooltip:"物体旁边手指数组,需与物体对应"
        },
        countAudios: {
            default: [],
            type: [cc.AudioClip],
            displayName:"音频数组",
            tooltip:"点击物体音频数组,需与物体对应"
        },
        endMusic: {
            displayName: "结束音乐",
            default: null,
            url: cc.AudioClip,
            tooltips: "数完数量后，播放一段音乐"
        },
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        //添加点击事件锁
        this.locked = true;
        //先隐藏手指
        for (var i = 0; i < this.figureItems.length; i++) {
            this.figureItems[i].active = false;
        } 
        //播放进场语音
        this.node.on("PageEnterAuido_Type1_Over", this.pageEnterAuido_Type1_Over_Callback, this);
    },
    // 进场语音播放结束监听
    pageEnterAuido_Type1_Over_Callback (event) {
        this.currentIndex = 0;
        this.figureItems[0].active = true;
        //添加点击事件
        this.addEventToItem();
    },
    addEventToItem() {  
        for (let index = 0; index < this.items.length; ++index) {
            this.items[index].on('mousedown', function ( event ) {
                this.itemClick(index);
            }, this);
        }      
    },
    start () {
    },
    update (dt) {
    },
    onDisable() {
        cc.audioEngine.stop(this.currentAudioID);
    },
    //点击处理
    itemClick(index){
        if (this.currentIndex == index) {
            this.locked = false;
        }
        if (this.locked == true) {
            return;
        }
        //播放音频
        cc.audioEngine.play(this.countAudios[this.currentIndex], false, 1); 
        //选中当前项，手指消失
        this.figureItems[this.currentIndex].active = false;
        if (this.currentIndex < this.figureItems.length - 1) {
            this.figureItems[this.currentIndex + 1].active = true;
        } else {
            //数完了，取消手指，延迟两秒播放结束音频
            this.scheduleOnce(function() {
                this.currentAudioID = cc.audioEngine.play(this.endMusic, false, 1);
                cc.audioEngine.setFinishCallback(this.currentAudioID, function () {
                    this.scheduleOnce(function() {
                        cc.find("BasePageController").getComponent("BasePageController").setRightButtonTipActive(true);
                    }, 5);
                }.bind(this));
            }, 1);
        }
        this.currentIndex++;
    }
});



