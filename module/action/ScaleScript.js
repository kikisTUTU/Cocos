

cc.Class({
    extends: cc.Component,

    properties: {
        scaleObjs:{
            default: [],
            type: [cc.Node],
            displayName:"物体",
            tooltip:"依次要放大/缩小的物体"
        },
        internalTimes:{
            default: [],
            type: [cc.Float],
            displayName:"间隔时间",
            tooltip:"距离效果执行的时间 单位：秒"

        },
        scaleTimes:{
            default: [],
            type: [cc.Float],
            displayName:"变化时间",
            tooltip:"物体从初始值到目标值所需的时间 单位：秒"

        },
        scaleMultiples:{
            default: [],
            type: [cc.Vec2],
            displayName:"倍数",
            tooltip:"变化到自身倍数的值 X为水平 Y为垂直"

        },
    },


    start () {

        //初始为否
        var config = require("ActionSingleton");
        config.isActionTimes ++;

        let m_Length = this.scaleObjs.length;
        if(this.scaleObjs.length!=m_Length||this.internalTimes.length!=m_Length||this.scaleTimes.length!=m_Length||this.scaleMultiples.length!=m_Length){
            console.warn("请检查传入数据数量是否一致: "+this.scaleObjs.length,this.internalTimes.length,this.scaleTimes.length,this.scaleMultiples.length);
            return;
        }

        for(let i = 0; i<this.scaleObjs.length; i++){

            let internalT=0;
            for(let m=0; m<=i; m++){
                internalT+=this.internalTimes[m];
            }

            let seq = cc.sequence(cc.delayTime(internalT), cc.scaleTo(this.scaleTimes[i],this.scaleMultiples[i].x,this.scaleMultiples[i].y));
            this.scaleObjs[i].runAction(seq);

        }

        //全部执行完后可操作
        this.totalTime = 0;
        for(let i=0; i<this.internalTimes.length; i++){

            this.totalTime += this.internalTimes[i];
        }
        this.totalTime = this.totalTime + this.scaleTimes[this.scaleTimes.length-1];  //加上最后一个变化的时间

        let seq1 = cc.sequence(cc.delayTime(this.totalTime),cc.callFunc(function(){
            var config = require("ActionSingleton");
            config.isActionTimes --;

            // console.log("我可以被点击了吗"+ config.isActionFinished);
        },this));
        this.node.runAction(seq1);
        
    },

});
