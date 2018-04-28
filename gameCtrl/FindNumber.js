// 玩法逻辑：找数字
// 使用方法：将该脚本挂载在页节点上，如Page1

cc.Class({
    extends: cc.Component,

    properties: () => ({
        stableItem : {
            default : [],
            type : [cc.Node],
            displayName : "必定出现的物体",
            tooltip : "必须显示的物体"
        },
        randomItem : {
            default : [],
            type : [cc.Node],
            displayName : "随机出现的物体",
            tooltip : "随机显示的物体"
        },
        itemNum : {
            default : 0,
            displayName : "显示的物体总数",
            tooltip : "场景中总共需要显示的物体数目"
        },
        correctSound : {
            default :null,
            url: cc.AudioClip,
            displayName : "单题正确语音",
            tooltip : "单个物体被找到时发出的声效"
        },
        successSound : {
            default : null,
            url: cc.AudioClip,
            displayName : "成功语音",
            tooltip : "全部物体找到后播放的语音"
        },
        restartBtn : {
            default : null,
            type : cc.Node,
            displayName : "刷新按钮",
            tooltip : "将刷新按钮的节点拖至此处"
        },
        successRingFadeTime : {
            default : 1,
            displayName : "圆环消失时间",
            tooltip : "圆环消失效果的时间（秒）"
        },
        successItemBreathTime : {
            default : 1,
            displayName : "物体呼吸的时间",
            tooltip : "物体呼吸效果的时间（秒）"
        },
        successNode : {
            default : null,
            type : cc.Node,
            displayName : "成功节点", 
            tooltip : "单题正确（成功）后需要执行的效果的节点"
        }
    }),

    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},

    start () {
        if(this.itemNum < this.stableItem.length){
            cc.warn("请检查要显示的物体个数");
        }
        this.showRandomItemNum = this.itemNum - this.stableItem.length;
        this.item = [];
        this.gameInit();
        this.restartBtn.on(cc.Node.EventType.TOUCH_START,this.restart,this);
        this.gameOverEffect = this.successNode.getComponent("GameOverEffect2");
    },

    gameInit () {
        console.log("game init");
        this.count = 0;
        this.showStableItem();
        this.showRandomItem(); 
    },

    restart () {
        // if(this.count >= 5){
        //     this.gameOverEffect.reset();
        // }
        // this.count = 0;
        // this.item = [];
        // this.node.stopAllActions();
        // this.showStableItem();
        // this.showRandomItem();
        // this.registerEvents();
    },

    showStableItem () {
        if(this.stableItem.length !== 0){
            for (let i = 0; i < this.stableItem.length; i++) {
                let correctRing = this.stableItem[i].getChildByName("correctRing");
                correctRing.active = false;
                correctRing.opacity = 255;
                this.stableItem[i].active = true;
                this.stableItem[i].getComponent(cc.Button).interactable = true;
                this.item.push(this.stableItem[i]);
            }
        }else{
            cc.warn("请将必定出现的物体拖入相应的脚本节点");
        }
    },

    showRandomItem () {
        if(this.randomItem.length !== 0){
            this.showRandomItemArr = this.getRandomItemIndex(this.randomItem.length, this.showRandomItemNum);
            for (let i = 0; i < this.randomItem.length; i++) {
                let correctRing = this.randomItem[i].getChildByName("correctRing");
                correctRing.active = false;
                correctRing.opacity = 255;
                if(this.randomItemShouldShow(i)){
                    this.randomItem[i].active = true;
                    this.randomItem[i].getComponent(cc.Button).interactable = true;
                    // this.randomItem[i].getChildByName("item").getComponent(cc.Button).interactable = true;
                    this.item.push(this.randomItem[i]);
                }else{
                    this.randomItem[i].active = false;
                }
            }
        }
    },


    registerEvents () {
        for (let i = 0; i < this.item.length; i++) {
            this.item[i].on(cc.Node.EventType.TOUCH_START, this.itemClick, this);
        }
    },

    getRandomItemIndex (sum,need) {
        //原数组 
        var originalArray = [];
        //给原数组originalArray赋值 
        for(var i = 0; i < sum;i++){
            originalArray[i] = i;
        }
        originalArray.sort(function () { return 0.5 - Math.random(); });
        console.log(originalArray);
        originalArray.splice(need);
        console.log(originalArray);
        return originalArray;
    },

    randomItemShouldShow (index) {
        for (let i = 0; i < this.showRandomItemArr.length; i++) {
            if (index == this.showRandomItemArr[i]){
                return true;
            }
        }
        return false;
    },

    itemClick (event) {
        event.stopPropagation();
        let item = event.target.getComponent(cc.Button);
        let itemRing = event.target.getChildByName("correctRing");
        let correctAni = itemRing.getComponent(cc.Animation);

        // 勾选圈显现
        if(item.interactable){
            itemRing.active = true;
            correctAni.play();
            cc.audioEngine.play(this.correctSound, false, 1);
            this.count++;
            item.interactable = false;
            console.log("count"+this.count);
            if(this.count == this.itemNum){
                this.scheduleOnce(function () {
                    this.success();
                },1);
            }
        }
    },

    success () {
        console.log("success");

        let fadeDuration = this.successRingFadeTime;
        let breathDuration = this.successItemBreathTime;
        
        // 固定物件的圆圈消失与呼吸效果
        let fadeOutAct = cc.fadeOut(fadeDuration);
        let breathAct = cc.sequence(
            cc.delayTime(fadeDuration),
            cc.repeat(
                cc.sequence(
                    cc.scaleBy(0.5, 1.215),
                    cc.scaleBy(0.5, 0.8)
                ), breathDuration)
        );
        for(let i = 0; i < this.item.length; i++){
            console.log(this.item[i].getChildByName("correctRing"));
            this.item[i].getChildByName("correctRing").runAction(fadeOutAct.clone());
            this.item[i].getChildByName("item").runAction(breathAct.clone());
        }

        this.scheduleOnce(function () {
            if (this.successSound) {
                cc.audioEngine.play(this.successSound, false, 1);
            }

            // 成功后动画播放
            this.gameOverEffect.begin();
        }, fadeDuration + breathDuration);


    }

    // update (dt) {},
});
