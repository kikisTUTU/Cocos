// [强制横屏]
// cc.view.setOrientation()                   // 设置屏幕方向
// cc.view.resizeWithBrowserSize(true)         // 触发浏览器resize

cc.Class({
    extends: cc.Component,

    properties: {

    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
        cc.view.resizeWithBrowserSize(true);
    },
    start () {
        
    },
    // update (dt) {},
});
