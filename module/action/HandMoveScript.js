
cc.Class({
    extends: cc.Component,

    properties: {
        beginPos:{
            default: cc.Vec2.ZERO,
            displayName:"开始的位置",
            tooltip:"手指开始移动的位置"
        },
        endPos:{
            default: cc.Vec2.ZERO,
            displayName:"结束的位置",
            tooltip:"手指结束移动的位置"
        },
        moveTime:{
            default: 0,
            type: cc.Float,
            displayName:"移动时间",
            tooltip:"手指从起点到终点的时间"
        },
        nums:{
            default: 0,
            type: cc.Float,
            displayName:"循环的次数",
            tooltip:"手指从起点到终点来回的次数"
        },

    },


    start () {


        let seq = cc.repeat(
            cc.sequence(
                cc.callFunc(function () {
                    this.node.active = true;
                }, this),
                cc.moveTo(0,this.beginPos.x,this.beginPos.y),
                cc.moveTo(this.moveTime,this.endPos.x,this.endPos.y),
                cc.callFunc(function () {
                    this.node.active = false;
                }, this),
            ), this.nums);
        this.node.runAction(seq);

        // let seq = cc.repeat(
        //     cc.sequence(
        //         cc.moveTo(0,this.beginPos.x,this.beginPos.y),
        //         cc.moveTo(this.moveTime,this.endPos.x,this.endPos.y)
        //     )
        // ),nums);
        // this.node.runAction(seq);
    },


});
