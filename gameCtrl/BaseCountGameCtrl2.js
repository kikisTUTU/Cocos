

cc.Class({
    extends: cc.Component,

    properties: {
        items: {
            default: [],
            type: [cc.Node]
        },
        choiceItems: {
            default: [],
            type: [cc.Node]
        },
        successAudio: {
            default: null,
            url: cc.AudioClip
        },
        failedAudio: {
            default: null,
            url: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //初始化变量
        this.correctItemSize = this.items.length;
        this.count = 0;
        this.choiceCount = 0;
        this.isEnterAudioOver = false;
        this.config = require("ActionSingleton");
        this.parent = cc.find("BasePageController");
            
        //1、加载物体
        //this.itemLoad();
    },

    start () {
        //卡牌注册点击事件
        for (let i = 0; i < this.choiceItems.length; i++) {
            this.choiceItems[i].on('mousedown', this.itemClick, this);
        }
        //播放进场语音
        this.node.on("PageEnterAuido_Type1_Over", this.pageEnterAuido_Type1_Over_Callback, this);
    },

    // 进场语音播放结束监听
    pageEnterAuido_Type1_Over_Callback (event) {
        this.isEnterAudioOver = true;
    },

    // update (dt) {},
    
    //物体、卡牌出现
    //itemLoad(){
    //    //物体出现
    //     this.schedule(function() {
    //         if(this.count!=this.correctItemSize){
    //             let action = cc.fadeIn(1.0);//再渐显
    //             this.items[this.count].runAction(action);
    //             this.count++;
    //         }
    //     }.bind(this), 1,2,0);//隔一秒执行2次
        //卡牌出现
        // this.schedule(function() {
        //     if(this.choiceCount != 3){
        //         let action = cc.fadeIn(1.0);//再渐显
        //         this.choiceItems[this.choiceCount].runAction(action);
        //         this.choiceCount++;
        //     }
        // }.bind(this), 1,3,0);
    //},

    //点击处理
    itemClick: function(event){
        cc.log('Mouse down:'+event.target.getComponent("CardObject").num);
        if(this.isEnterAudioOver && this.config.isActionFinished() && !this.isSuccess){//音频播放完毕,动画加载完毕才能触发点击事件
            if(event.target.getComponent("CardObject").num == this.correctItemSize){
                this.success();
                //保存结果
                parent.getComponent("BasePageController").saveExercisePageResult(true);
            }else{
                this.failed(event.target);
                //保存结果
                parent.getComponent("BasePageController").saveExercisePageResult(false);
            }
        }
    },

    success(){
        //播放音频
        cc.audioEngine.play(this.successAudio, false, 1);
        //翻牌
        for(let i=0; i<this.choiceItems.length; i++){
            let cardItem = this.choiceItems[i];
            //cc.log(""+this.correctItemSize+","+cardItem.getComponent("CardObject").num);
            if(cardItem.getComponent("CardObject").num == this.correctItemSize){
                //正确项
                cc.log("correct");
                //改变透明度
                cardItem.getComponent("CardTickScript").tick();
            }else{
                //错误项
                cc.log("wrong");
                //翻牌
                cardItem.getComponent("CardRotatedScript").rotate();
            }
        }
        this.isSuccess = true;
    },

    failed: function(item){
        cc.log("failed");
        //播放音频
        cc.audioEngine.play(this.failedAudio, false, 1);
        //左右抖动    
        item.getComponent("CardShakedScript").shake();
    }
});
