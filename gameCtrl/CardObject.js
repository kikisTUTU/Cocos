

cc.Class({
    extends: cc.Component,

    properties: {
        num:0,
        fcard: {
            default:null,
            type:cc.Node
        },
        bcard:{
            default:null,
            type:cc.Node
        },
        gou:{
            default:null,
            type:cc.Node,
            displayName:"勾"
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
