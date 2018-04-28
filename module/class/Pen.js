
var pen = cc.Class({
    extends: cc.Component,

    properties: {
        color: {
            default: cc.Color.WHITE,
            displayName: "画笔色值",
            tooltip: "选中画笔后，涂抹的色值将是此画笔色值"
        },
        label: {
            default: null,
            type: cc.Label,
            displayName: "画笔上的字体",
            tooltip: "cc.Label类型，用于显示画笔上的字体，请自行添加 UI组件-Label，并按需设置"
        },
        isActive: {
            default: false,
            displayName: "是否已激活",
            tooltip: "",
            visible: false
        },

        hightLightImage: {
            default: null,
            type: cc.SpriteFrame,
            displayName: "高亮图片",
            tooltip: "",
        },

        hl_offset: {
            default: cc.Vec2.ZERO,
            displayName: "高亮位移差",
            tooltip: "",
        }
    },

    onLoad() {
        this.origin = this.node.position;
    },

    start() {
        this.initHL_Sprite();
    },

    initHL_Sprite() {
        if (this.hightLightImage != null) {
            var hlNode = new cc.Node("highLight");
            hlNode.parent = this.node;
            hlNode.x = hlNode.x + this.hl_offset.x;
            hlNode.y = hlNode.y + this.hl_offset.y;
            var hlSprite = hlNode.addComponent(cc.Sprite);
            hlSprite.spriteFrame = this.hightLightImage;

            hlNode.active = this.isActive;
            this.hlNode = hlNode;
        }
    },

    setActive(boolValue) {
        this.isActive = boolValue;

        if (this.hlNode != null) {
            this.hlNode.active = boolValue;
        }
    }
});

module.exports = pen;
