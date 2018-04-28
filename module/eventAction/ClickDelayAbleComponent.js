cc.Class({
    extends: cc.Component,

    properties: {
        needEnableJSNode: {
            default: null,
            type: cc.Node,
            displayName: "需要启动脚本的节点",
        },

        componentName: {
            default: "",
            displayName: "脚本名称",
            tooltip: '必须是上面节点上加载的脚本的名称，正常是这个脚本没有勾选，其他脚本控制它勾选上',
        },

        delayTime: {
            default: 0,
            displayName: "延迟启动时长",
            tooltip: '延迟启动脚本的时长',
        },

        able: {
            default: true,
            displayName: "使能",
            tooltip: '勾上：让脚本有效   不勾：让脚本无效',
        },
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () { },

    start () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.clickCallback, this);
    },

    clickCallback () {
        if (this.enabled == false) {
            return;
        }
        
        this.scheduleOnce(function(dt) {
            if (this.needEnableJSNode.getComponent(this.componentName)) {
                this.needEnableJSNode.getComponent(this.componentName).enabled = this.able;
            }
        }, this.delayTime)
    },

    // update (dt) {},
});
