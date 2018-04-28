
var canClick = true;

cc.Class({
    extends: cc.Component,

    properties: {
        rightObjs: {
            default: [],
            type: [cc.Node],
            displayName: "正确物体",
            tooltip: "正确物体",
        },
        falseObjs: {
            default: [],
            type: [cc.Node],
            displayName: "错误物体",
            tooltip: "错误物体",
        },
        successNode: {
            default: null,
            type: cc.Node,
            displayName: "成功节点",
            tooltip: "成功节点",
        },
        failNode: {
            default: null,
            type: cc.Node,
            displayName: "失败节点",
            tooltip: "失败节点",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {


        for(let i=0; i<this.rightObjs.length; i++){

            this.rightObjs[i].symbolNum = "666";
        
        }

        for(let i=0; i<this.falseObjs.length; i++){

            this.falseObjs[i].symbolNum = "555";
        
        }

        for(let i=0; i<this.rightObjs.length; i++){
        
            //添加点击事件
            this.rightObjs[i].on(cc.Node.EventType.TOUCH_END, function (event) {


                cc.log("胜利");
                this.successNode.active = true;
                
            },this);
        }

        for(let i=0; i<this.falseObjs.length; i++){
        
            //添加点击事件
            this.falseObjs[i].on(cc.Node.EventType.TOUCH_END, function (event) {


                cc.log("失败");
                this.failNode.active = true;
                
            },this);
        }

    },



    // update (dt) {},
});
