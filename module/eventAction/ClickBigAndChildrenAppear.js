

cc.Class({
    extends: cc.Component,

    properties: {
        scaleTime: {
            default: 0,
            displayName: "放大的时间",
            tooltip: "放大的时间"
        },
        scaleNum: {
            default: 0,
            displayName: "放大的倍数",
            tooltip: "放大的倍数"
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log('Mouse down');
            for(let i=0; i<this.node.children.length; i++){
                this.node.children[i].active = true;
            }
            this.node.runAction(cc.scaleTo(this.scaleTime,this.scaleNum));
            
          }, this);


        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            for(let i=0; i<this.node.children.length; i++){
                this.node.children[i].active = false;
            }
            this.node.runAction(cc.scaleTo(this.scaleTime,1));
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            for(let i=0; i<this.node.children.length; i++){
                this.node.children[i].active = false;
            }
            this.node.runAction(cc.scaleTo(0,1));
        }, this);

    },

    // update (dt) {},
});
