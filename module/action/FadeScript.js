

cc.Class({
    extends: cc.Component,

    properties: {
        appearOrDisappear:{
            default: 0,
            type: cc.Integer,
            displayName:"渐显/渐隐",
            tooltip:"0代表渐显 1代表渐隐"
        },
        appearObjs:{
            default: [],
            type: [cc.Node],
            displayName:"物体",
            tooltip:"依次要渐变的物体"
        },
        internalTimes:{
            default: [],
            type: [cc.Float],
            displayName:"间隔时间",
            tooltip:"距离效果执行的时间 单位：秒"

        },
        appearTimes:{
            default: [],
            type: [cc.Float],
            displayName:"渐变时间",
            tooltip:"物体从初始值到目标值所需的时间 单位：秒"

        },
        alphaValues:{
            default: [],
            type: [cc.Float],
            displayName:"目标透明度",
            tooltip:"物体要到达的目标透明度(0-255)"

        },
    },

    onLoad(){
        if(this.appearOrDisappear==0){

            for(let i=0; i<this.appearObjs.length; i++){
                this.appearObjs[i].opacity = 0;
            }
           
        }else if(this.appearOrDisappear==1){
            for(let i=0; i<this.appearObjs.length; i++){
                this.appearObjs[i].opacity = 255;
            }
        }else{
            console.warn("渐显/渐隐 数值输入有误 只能为0或1");
            return;
        }

    },
    start () {

        //初始为否
        var config = require("ActionSingleton");
        config.isActionTimes ++;

        let m_Length = this.appearObjs.length;
        if(this.appearObjs.length!=m_Length||this.internalTimes.length!=m_Length||this.appearTimes.length!=m_Length||this.alphaValues.length!=m_Length){
            console.warn("请检查传入数据数量是否一致: "+this.appearObjs.length,this.internalTimes.length,this.appearTimes.length,this.alphaValues.length);
            return;
        }

        for(let i = 0; i<this.appearObjs.length; i++){

            let internalT=0;
            for(let m=0; m<=i; m++){
                internalT+=this.internalTimes[m];
            }

            let seq = cc.sequence(cc.delayTime(internalT), cc.fadeTo(this.appearTimes[i],this.alphaValues[i]));
            this.appearObjs[i].runAction(seq);
        }

        //全部执行完后可操作
        this.totalTime = 0;
        for(let i=0; i<this.internalTimes.length; i++){

            this.totalTime += this.internalTimes[i];
        }
        this.totalTime = this.totalTime + this.appearTimes[this.appearTimes.length-1];  //加上最后一个变化的时间

        let seq1 = cc.sequence(cc.delayTime(this.totalTime),cc.callFunc(function(){
            var config = require("ActionSingleton");
            config.isActionTimes --;

            // console.log("我可以被点击了吗"+ config.isActionFinished);
        },this));
        this.node.runAction(seq1);

    },

});
