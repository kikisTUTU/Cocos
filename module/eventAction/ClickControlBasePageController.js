var PageControl = cc.Enum({
    进上一页: 0,
    重置当页: 1,
    进下一页: 2,
    下页按钮容许点击: 3,
    下页按钮屏蔽点击: 4,
});

cc.Class({
    extends: cc.Component,

    properties: {
        basePageController: {
            default: null,
            type: cc.Node,
            displayName: "页面控制器节点",
            tooltip: "改节点下挂有同节点名 页面控制脚本"
        },

        pageControl: {
            default: PageControl.进下一页,
            type: PageControl,
            displayName: "操作类型"
        }
    },

    start () {
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (this.pageControl == PageControl.进上一页) {
                this.basePageController.getComponent(this.basePageController.name).goToBeforePageNode();
            } else if (this.pageControl == PageControl.重置当页) {
                this.basePageController.getComponent(this.basePageController.name).goToCurrentPageNode();
            } else if (this.pageControl == PageControl.进下一页) {
                this.basePageController.getComponent(this.basePageController.name).goToNextPageNode();
            } else if (this.pageControl == PageControl.下页按钮容许点击) {
                this.basePageController.getComponent(this.basePageController.name).setRightButtonEnable(true);
            } else if (this.pageControl == PageControl.下页按钮屏蔽点击) {
                this.basePageController.getComponent(this.basePageController.name).setRightButtonEnable(false);
            }
        }, this);
    },

});
