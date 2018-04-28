
cc.Class({
    extends: cc.Component,

    properties: {
        toggleSprite: {
            default: null,
            type: cc.SpriteFrame,
            
        },
        toggle: {
            default: false,
            displayName: "是否可以返点",
            tooltip: "如是，那么切换图片后再点击，可以切换回原图片；如不是，那么只支持点击切换一次",
        },

        spriteIndex: {
            default: 0,
            displayName: "初始序号",
            tooltip: "用于做当前图片序号的判断，多为支持控制器获取精灵状态",
        },

        resized: {
            default: false,
            displayName: "大小是否一致",
            tooltip: "如是，无论替换图片大小如何，都会与原图片大小一致"
        }
    },

    // LIFE-CYCLE CALLBACKS:


    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
            this.click()
        }, this);

    },

    click() {
        var previousWidth = this.node.width;
        var previousHeigth = this.node.height;
        if (this.toggle === false) { // 不可反选
            this.getComponent(cc.Sprite).spriteFrame = this.toggleSprite;
            this.spriteIndex = 1;
        } else {
            var currentSprite = this.getComponent(cc.Sprite).spriteFrame;
            if (this.previousSprite != null) {
                this.getComponent(cc.Sprite).spriteFrame = this.previousSprite;
            } else {
                this.getComponent(cc.Sprite).spriteFrame = this.toggleSprite;
            }
            this.previousSprite = currentSprite;
            this.spriteIndex = this.spriteIndex == 0 ? this.spriteIndex = 1 : this.spriteIndex = 0;
        }
        if (this.resized) {
            this.node.width = previousWidth;
            this.node.height = previousHeigth;
        }
    }
});
