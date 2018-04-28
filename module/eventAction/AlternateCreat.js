

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
        this.newPage;


        //初始化第一个
        this.newPage = cc.instantiate(this.needActiveNodes[1]);
        this.newPage.parent = this.node.parent;
        this.newPage.active = true;
        this.newPage.position = cc.v2(0,0);
        this.newPage.setLocalZOrder(1);
        this.node.setLocalZOrder(2);

        cc.log("走了");

        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log('Mouse down');
            for(let i = 0; i<this.needActiveNodes.length; i++){

                this.needActiveNodes[i].active = false;
                
            }


            if(this.newPage){
                cc.log("摧毁");
                this.newPage.destroy();
                
            }
            
            this.newPage = cc.instantiate(this.needActiveNodes[this.num]);
            this.newPage.parent = this.node.parent;
            this.newPage.active = true;
            this.newPage.position = cc.v2(0,0);
            this.newPage.setLocalZOrder(1);
            this.node.setLocalZOrder(2);


            cc.log("名字"+this.node.parent.name);

            this.num++; 
            if(this.num == this.needActiveNodes.length ){

                this.num = 0;
            }








          }, this);


    },

    // update (dt) {},
});
