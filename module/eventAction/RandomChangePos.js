
cc.Class({
    extends: cc.Component,

    properties: {
    
        needChangeNodes: {
            default: [],
            type: [cc.Node],
            displayName: "需要随机改变位置的节点",
            tooltip: "需要随机改变位置的节点"
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this.numArr = this.getRandomItemIndex(this.needChangeNodes.length,this.needChangeNodes.length);

        this.posArr = [];
        for(let i=0; i<this.needChangeNodes.length; i++){

            this.posArr[i] = this.needChangeNodes[this.numArr[i]].position;

        }

        for(let i=0; i<this.needChangeNodes.length; i++){

            this.needChangeNodes[i].position = this.posArr[i];

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
