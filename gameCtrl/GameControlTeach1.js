
cc.Class({
    extends: cc.Component,

    properties: {
        beginBtns:{
            default: [],
            type: [cc.Node],
            displayName:"初始按钮",
            tooltip:"最开始显示在页面上面的物体"
        },
        endBtns:{
            default: [],
            type: [cc.Node],
            displayName:"点击后显示的物体",
            tooltip:"点击初始按钮后显示的物体"
        },
        spines:{
            default: [],
            type: [cc.Node],
            displayName:"点击后显示的动画",
            tooltip:"点击后显示的动画"
        },
        lastBtns:{
            default: [],
            type: [cc.Node],
            displayName:"最终出现的物体",
            tooltip:"最终出现的物体"
        },


    },

    onLoad(){

        this.haveClicked = false;
        this.isEnterAudioOver = false;
        this.config = require("ActionSingleton");
        this.parent = cc.find("BasePageController");
    },

    start () {

        //播放进场语音
        this.node.on("PageEnterAuido_Type1_Over", this.pageEnterAuido_Type1_Over_Callback, this);

        for(let i=0; i<this.endBtns.length; i++){

            this.endBtns[i].active = false;
            this.endBtns[i].opacity = 0;

        }

        for(let i=0; i<this.spines.length; i++){

            this.spines[i].active = false;

        }

        for(let i=0; i<this.lastBtns.length; i++){

            this.lastBtns[i].active = false;
            this.lastBtns[i].opacity = 0;

        }

        if(this.isEnterAudioOver && this.config.isActionFinished()){


            for(let i=0; i<this.beginBtns.length; i++){

                this.beginBtns[i].tag=i;
                this.beginBtns[i].on(cc.Node.EventType.TOUCH_START, function (event){


                    if(this.haveClicked==false){
                        // this.haveClicked = true;

                        this.beginBtns[event.target.tag].active = false;
                        this.endBtns[event.target.tag].active = true;
                        this.spines[event.target.tag].active = true;
                        
                        this.lastBtns[event.target.tag].active = true;
                        let seq = cc.sequence(cc.delayTime(5),cc.callFunc(function(){
                            cc.find("BasePageController").getComponent("BasePageController").setRightButtonTipActive(true);
                        },this));
                        this.node.runAction(seq);
    
    
                        //取消所有事件
                        for(let i=0;i<this.beginBtns.length; i++){
    
                            this.beginBtns[i].interactable = false;
                        }
                    }
                    
                }, this);

            }
        }

    },
    pageEnterAuido_Type1_Over_Callback (event) {
        this.isEnterAudioOver = true;
    },

    onDestroy(){
        this.node.stopAllActions();
    }
});
