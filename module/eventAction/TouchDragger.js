cc.Class({
    extends: cc.Component,

    properties: {
        //透明度: 255,
        比例: 1.0,
        位移差x: 0,
        位移差y: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // use this for initialization
    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, function () {
            this.originalOpacity = this.node.opacity
            //this.node.opacity = this.透明度;
            this.originalScale = this.node.scale;
            this.node.scale = this.node.scale * this.比例;
            

            this.node.x += this.位移差x;
            this.node.y += this.位移差y;

            //起始点
            this.originalX = this.node.x;
            this.originalY = this.node.y;

            //cc.log("ox : " + this.originalX);
            //cc.log("oy : " + this.originalY);
            
        }.bind(this), this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            let delta = event.touch.getDelta();
            this.node.x += delta.x;
            this.node.y += delta.y;
        }.bind(this), this);
        this.node.on(cc.Node.EventType.TOUCH_END, function () {
            this.node.opacity = this.originalOpacity;
            this.node.scale = this.originalScale;
        }.bind(this), this);
    },

    //回到最初位置
    backToOrigin() {
        //cc.log("ox : " + this.originalX);
        //cc.log("oy : " + this.originalY);
        //cc.log("item name: " + this.node.name);
        this.node.position = new cc.v2(this.originalX, this.originalY);
        // this.node.x = this.originalX;
        // this.node.y = this.originalY;
    }

    
});