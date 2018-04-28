

cc.Class({
    extends: cc.Component,

    properties: {
        moveObjs:{
            default: [],
            type: [cc.Node],
            displayName:"物体",
            tooltip:"依次要移动的物体"
        },
        internalTimes:{
            default: [],
            type: [cc.Float],
            displayName:"间隔时间",
            tooltip:"距离效果执行的时间 单位：秒"

        },
        movePositions:{
            default: [],
            type: [cc.Vec2],
            displayName:"位置",
            tooltip:"依次要移动到的位置 单位：像素"
        },
        moveTimes:{
            default: [],
            type: [cc.Float],
            displayName:"移动时间",
            tooltip:"物体从初始位置移到目标位置所需的时间 单位：秒"

        },
        
    },

    start () {

        //初始为否
        var config = require("ActionSingleton");
        config.isActionTimes ++;

        let m_Length = this.moveObjs.length;
        if(this.moveObjs.length!=m_Length||this.internalTimes.length!=m_Length||this.movePositions.length!=m_Length||this.moveTimes.length!=m_Length){
            console.warn("请检查传入数据数量是否一致: "+this.moveObjs.length,this.internalTimes.length,this.movePositions.length,this.moveTimes.length);
            return;
        }

        for(let i = 0; i<this.moveObjs.length; i++){

            let internalT=0;
            for(let m=0; m<=i; m++){
                internalT+=this.internalTimes[m];
            }

            let seq = cc.sequence(cc.delayTime(internalT),cc.moveTo(this.moveTimes[i], this.movePositions[i]).easing(cc.easeBounceOut()));

            this.moveObjs[i].runAction(seq);
        }

        //全部执行完后可操作
        this.totalTime = 0;
        for(let i=0; i<this.internalTimes.length; i++){

            this.totalTime += this.internalTimes[i];
        }
        this.totalTime = this.totalTime + this.moveTimes[this.moveTimes.length-1];  //加上最后一个变化的时间


        let seq1 = cc.sequence(cc.delayTime(this.totalTime),cc.callFunc(function(){
            var config = require("ActionSingleton");
            config.isActionTimes --;
                                    
            // console.log("我可以被点击了吗"+ config.isActionFinished);
        },this));
        this.node.runAction(seq1);
        
    },

});
