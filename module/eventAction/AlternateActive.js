

cc.Class({
    extends: cc.Component,

    properties: {
        needActiveNodes: {
            default: [],
            type: [cc.Node],
            displayName: "需要控制显隐的节点",
            tooltip: "需要控制显隐的节点"
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {


        this.num = 0;

        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log('Mouse down');
            for(let i = 0; i<this.needActiveNodes.length; i++){

                this.needActiveNodes[i].active = false;

                if(this.num == i){
                    this.needActiveNodes[i].active = true;

                }
                
            }


            this.num++; 
            if(this.num == this.needActiveNodes.length ){

                this.num = 0;
            }

          }, this);


    },

    // update (dt) {},
});
