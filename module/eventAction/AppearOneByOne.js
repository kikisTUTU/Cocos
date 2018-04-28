// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        appearNodes: {
            default: [],
            type: [cc.Node],
            displayName: "依次要播放的画面",
            tooltip: "依次要播放的画面",
        },
        appearTimes: {
            default: [],
            type: [cc.Float],
            displayName: "依次要间隔的时间",
            tooltip: "依次要间隔的时间",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {


        //所有点关闭
        for(let i=0; i<this.appearNodes.length; i++){

            this.appearNodes[i].active = false;
        }


        //依次显示
        for(let i=0; i<this.appearNodes.length; i++){

            let seq = cc.sequence(cc.delayTime(this.appearTimes[i]),cc.callFunc(function(){

                //所有点关闭
                for(let i=0; i<this.appearNodes.length; i++){

                    this.appearNodes[i].active = false;

                }

                //该显示的显示
                this.appearNodes[i].active = true;

                // let seq1 = cc.sequence(cc.delayTime(1),cc.callFunc(function(){
                    
                //     this.appearNodes[i].setPosition(0,0);
                // },this));
                // this.node.runAction(seq1);
                
                cc.log("开启");
            },this));
            this.node.runAction(seq);

        }

    },

    // update (dt) {},
});
