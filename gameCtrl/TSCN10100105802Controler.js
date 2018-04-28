
cc.Class({
    extends: cc.Component,

    properties: {

        woodVec:{
            default: [],
            type: [cc.Node],
            displayName:"物体",
            tooltip:"物体"
        },
        npc:{
            default: null,
            type: cc.Node,
            displayName:"NPC",
            tooltip:"NPC"
        },
        npcWoodPos:{
            default: cc.Vec2,
            // type: cc.Vec2,
            displayName:"NPC相对落体的位置",
            tooltip:"NPC相对落体的位置"
        },
        npcEndPos:{
            default: cc.Vec2,
            // type: cc.Vec2,
            displayName:"NPC最后结束的位置",
            tooltip:"NPC最后结束的位置"
        },
        boardNum:{
            default: null,
            type: cc.Label,
            displayName:"板子上的数字",
            tooltip:"板子上的数字"
        },
        npcJumpSpineStr:{
            default: [],
            type: [cc.String],
            displayName:"1、NPC跳动的动画名字,2、NPC错误的动画名字,3、NPC静止动画的名字",
            tooltip:"1、NPC跳动的动画名字,2、NPC错误的动画名字,3、NPC静止动画的名字"
        },
        woodErrorSpineStr:{
            default: [],
            type: [cc.String],
            displayName:"1、NPC脚下物体错误的动画名字 2、NPC脚下物体静止的动画名字",
            tooltip:"1、NPC脚下物体错误的动画名字 2、NPC脚下物体静止的动画名字"
        },
        restarBtn:{
            default: null,
            type: cc.Node,
            displayName:"重玩",
            tooltip:"重玩"
        },

    },

    start () {

        this.self = this;
        // this.npc.active = false;
        this.npc.setLocalZOrder(10);
        this.jumpTimes = 0;
        this.npcBeginPos = this.npc.position;

        this.restarBtn.on(cc.Node.EventType.TOUCH_START, function (event){

            cc.log("我被注册了");
            this.self.restartFun();
        },this);

        for(let i=0;i<this.woodVec.length;i++){
            cc.find("Btn",this.woodVec[i]).on(cc.Node.EventType.TOUCH_START, function (event) {
                cc.log("我被点了");


                if(this.woodVec[i].tag == "555"){

                    return;
                }

                if(this.numArr[i].correct==true){

                    cc.log("正确");

                    this.npc.getComponent(sp.Skeleton).setAnimation(0, this.npcJumpSpineStr[0], false);
                    this.npc.getComponent(sp.Skeleton).addAnimation(0, this.npcJumpSpineStr[2], true)

                    let seqJump = cc.sequence(cc.delayTime(0.1),cc.jumpTo(1,cc.p(this.woodVec[i].position.x+this.npcWoodPos.x,this.woodVec[i].position.y+this.npcWoodPos.y),0,1));
                    this.npc.runAction(seqJump);

                    //错误的消失
                    if(i<this.woodVec.length/2){
                        this.woodVec[i+this.woodVec.length/2].active = false;

                        this.woodVec[i].tag = "555";
                        this.woodVec[i+this.woodVec.length/2].tag = "555";

                    }else{
                        this.woodVec[i-this.woodVec.length/2].active = false;

                        this.woodVec[i].tag = "555";
                        this.woodVec[i-this.woodVec.length/2].tag = "555";
                    }
                    cc.log("设置完的tag值"+this.woodVec[i].tag);

                    //下一组出现
                    if(this.jumpTimes+this.woodVec.length/2 < this.woodVec.length){

                        this.jumpTimes++;

                        if(this.jumpTimes < this.woodVec.length/2){
                            this.woodVec[this.jumpTimes].active = true;
                            this.woodVec[this.jumpTimes+this.woodVec.length/2].active = true;

                            this.woodVec[this.jumpTimes].getComponent(sp.Skeleton).setAnimation(0, this.woodErrorSpineStr[1], true);
                            this.woodVec[this.jumpTimes+this.woodVec.length/2].getComponent(sp.Skeleton).setAnimation(0, this.woodErrorSpineStr[1], true);
                            cc.log("走进了"+this.jumpTimes);
                        }
                        
                    }


                    if(this.jumpTimes == this.woodVec.length/2){

                        cc.log("胜利了");
                        let seq = cc.sequence(cc.delayTime(2),cc.callFunc(function() {
                            this.npc.runAction(cc.jumpTo(1,this.npcEndPos,0,1));
                            this.npc.getComponent(sp.Skeleton).setAnimation(0, this.npcJumpSpineStr[0], false);
                            this.npc.getComponent(sp.Skeleton).addAnimation(0, this.npcJumpSpineStr[2], true);
                            }, this));
                        this.node.runAction(seq);
                        
                    }

                }else{
                    cc.log("错误");

                    this.npc.getComponent(sp.Skeleton).setAnimation(0, this.npcJumpSpineStr[1], false);
                    this.npc.getComponent(sp.Skeleton).addAnimation(0, this.npcJumpSpineStr[2], true);

                    for(let i = 0;i<this.woodVec.length; i++){
                        this.woodVec[i].getComponent(sp.Skeleton).setAnimation(0, this.woodErrorSpineStr[0], false);
                        this.woodVec[i].getComponent(sp.Skeleton).addAnimation(0, this.woodErrorSpineStr[1], true);
                    }
                    
                }
              }, this);

        }



        this.gameInit();
    },
    restartFun(){

        //重置
        this.node.stopAllActions();
        for(let i=0;i<this.woodVec.length; i++){

            this.woodVec[i].tag = "666";
            this.woodVec[i].active = false;
        }
        this.npc.position = this.npcBeginPos;

        this.npc.active = false;
        this.npc.active = true;

       this.gameInit();

    },
    gameInit(){
        //获取随机数组
        this.numArr = this.getComponent("OperationCtrl").createFormule();

        //板子赋值
        this.boardNum.string = this.numArr[0].result.toString();
        // cc.log("斤斤计较"+this.numArr[0].result.toString());

        //随机交换位置并赋值
        for(let i=0; i<this.numArr.length/2;i++){
           
            this.randomPosNum = Math.floor(Math.random()*10);
            cc.log("随机的一个数"+this.randomPosNum);
            if(this.randomPosNum >= 5){
                [this.numArr[i],this.numArr[i+this.numArr.length/2]] = [this.numArr[i+this.numArr.length/2],this.numArr[i]];
            }
            cc.log("交换后的位置"+this.numArr[i]);
        }

        for(let i=0; i<this.numArr.length;i++){

                let strq = this.numArr[i].toString();
                let str = strq.replace('+', ';');

                cc.find("NumBoard/nums",this.woodVec[i]).getComponent(cc.Label).string = str;
                cc.log("哈哈哈"+this.numArr[i]+this.numArr[i].correct);
       }
       
       //隐藏所有木头
       for(let i = 0;i<this.woodVec.length; i++){

         this.woodVec[i].active = false;
       }

       //出现两个
        let seq = cc.sequence(cc.delayTime(1),cc.callFunc(function() {
        this.woodVec[0].active = true;
        this.woodVec[this.woodVec.length/2].active = true;

        this.woodVec[0].getComponent(sp.Skeleton).setAnimation(0, this.woodErrorSpineStr[1], true);
        this.woodVec[this.woodVec.length/2].getComponent(sp.Skeleton).setAnimation(0, this.woodErrorSpineStr[1], true);
        }, this));
        this.node.runAction(seq);
    },
    getRandomItemIndex (sum,need) {
        //原数组 
        var originalArray = [];
        //给原数组originalArray赋值 
        for(var i = 0; i < sum;i++){
            originalArray[i] = i;
        }
        originalArray.sort(function () { return 0.5 - Math.random(); });
        // console.log(originalArray);
        originalArray.splice(need);
        console.log(originalArray);
        return originalArray;
    },

});
