

cc.Class({
    extends: cc.Component,

    properties: {
        movePositions:{
            default: [],
            type: [cc.Vec2],
            displayName:"位置",
            tooltip:"贝塞尔曲线位置 单位：像素 说明：每三组位置为一组贝塞尔曲线，每组点的第一个为起始点，第二个为中点，第三个为终点。具体可参考 http://cubic-bezier.com/#.04,.92,.22,1.29"
        },
        internalTimes:{
            default: [],
            type: [cc.Float],
            displayName:"运行时间",
            tooltip:"每组贝塞尔曲线运行时间 单位：秒"

        },

    },


    start () {


        //效果网址  http://cubic-bezier.com/#.04,.92,.22,1.29

        //初始为否
        var config = require("ActionSingleton");
        config.isActionTimes ++;

        if(this.movePositions.length%3!=0){
            console.warn("输入错误，位置点数应是3的倍数！");
            return;
        }
        
        if(this.movePositions.length/3!=this.internalTimes.length){
            console.warn("位置组数与运行时间不相等！");
            return;
        }

        if(this.movePositions.length%3==0){
            for(let i = 0; i<this.movePositions.length/3; i++){
                let bezier = [this.movePositions[i], this.movePositions[i+1],this.movePositions[i+2]];
                let bezierToAction = cc.bezierTo(this.internalTimes[i], bezier);

                let internalT=0;
                if(i==0){
                    internalT=0;
                }else{
                    for(let m=0; m<i; m++){
                        internalT+=this.internalTimes[m];
                    }
                }

                let seq = cc.sequence(cc.delayTime(internalT),bezierToAction);
                this.node.runAction(seq);
            }

        }

        //全部执行完后可操作
        this.totalTime = 0;
        for(let i=0; i<this.internalTimes.length; i++){

            this.totalTime += this.internalTimes[i];
        }
        // this.totalTime = this.totalTime + this.scaleTimes[this.scaleTimes.length-1];  //加上最后一个变化的时间

        let seq1 = cc.sequence(cc.delayTime(this.totalTime),cc.callFunc(function(){
            var config = require("ActionSingleton");
            config.isActionTimes --;
                                    
            // console.log("我可以被点击了吗"+ config.isActionFinished);
        },this));
        this.node.runAction(seq1);

    },

});