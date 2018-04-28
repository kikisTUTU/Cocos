
cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label,
            displayName: "区域上的字体",
            tooltip: "cc.Label类型，用于显示区域上的字体（数字），请自行添加 UI组件-Label，并按需设置"
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
