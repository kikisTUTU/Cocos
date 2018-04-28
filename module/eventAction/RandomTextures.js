
cc.Class({
    extends: cc.Component,

    properties: {
    
        needChangeNodes: {
            default: [],
            type: [cc.Node],
            displayName: "需要改变纹理的节点",
            tooltip: "需要改变纹理的节点"
        },
        spriteFrameTypes: {
            default: [],
            type: [cc.SpriteFrame],
            displayName: "纹理的类型",
            tooltip: "纹理的类型"
        },
        numberRange: {
            default: 0,
            type: cc.Integer,
            displayName: "要改变纹理数量的范围",
            tooltip: "要改变纹理数量的范围"
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        var rang = Math.floor(Math.random()*this.numberRange);
        this.numArr = this.getRandomItemIndex(this.needChangeNodes.length,this.needChangeNodes.length);

    
        for(let i=0; i<this.numArr.length; i++){

            cc.log("随机到的"+this.numArr[i]);
        }

        for(let i=0; i<this.needChangeNodes.length; i++){

            if(i <= rang){
                cc.log("图片替换1");
                this.needChangeNodes[this.numArr[i]].getComponent(cc.Sprite).spriteFrame = this.spriteFrameTypes[0];
            }else{
                cc.log("图片替换2");
                this.needChangeNodes[this.numArr[i]].getComponent(cc.Sprite).spriteFrame = this.spriteFrameTypes[1];
                
            }
            
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
        // console.log(originalArray);
        originalArray.splice(need);
        console.log(originalArray);
        return originalArray;
    },
});
