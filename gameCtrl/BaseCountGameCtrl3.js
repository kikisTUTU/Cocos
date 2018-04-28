
var InAreaType = cc.Enum({
    矩形: 0,
    碰撞体: 1,
});

cc.Class({
    extends: cc.Component,

    properties: {
        items: {
            default: [],
            type: [cc.Node],
            displayName:"物体",
            tooltip:"依次出现的物体"
        },
        target: {
            default: null,
            type: cc.Node,
            displayName:"目标区域"
        },
        shade: {
            default: null,
            type: cc.Node,
            displayName:"目标区域高亮",
            tooltip:"物体拖入目标区域后显示的边界图案"
        },
        
        pickUpAudio: {
            default: null,
            url: cc.AudioClip,
            displayName:"拾起物体音频"
        },
        wrongAudio: {
            default: null,
            url: cc.AudioClip,
            displayName:"物体未落入指定区域音频"
        },
        numAudio: {
            default: [],
            type: [cc.AudioClip],
            displayName:"数字音频"
        },
        inAreaType: {
            default: InAreaType.矩形,
            type: cc.Enum(InAreaType),
            displayName:"检测区域类型"
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {    
        // 判定检测类型   
        if (this.inAreaType == InAreaType.碰撞体) {
            // 激活碰撞体管理器
            cc.director.getCollisionManager().enabled = true;
        } 
        //检查资源
        if(!this.checkAsset()){
            cc.log("123");
            return;
        }
        this.count = 0;
        this.num = 0;//拖入的num

        if (this.shade != null) {
            this.shade.active = false;
        }
        
        //1、物体加载
        this.itemLoad();
    },

    checkAsset(){
        if(this.items.length == 0){
            cc.warn("物体图片不能为空");
            return false;
        }
        if(this.target==null){
            cc.warn("目标区域图片不能为空");
            return false;
        }
        if(this.shade==null){
            cc.warn("阴影图片不能为空");
        }
        return true;
    },

    //物体init
    itemLoad(){
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];

            item.on(cc.Node.EventType.TOUCH_START, function () {
                //拾起音频
                if (this.pickUpAudio != null) {
                    cc.audioEngine.play(this.numAudio[this.num], false, 1);
                }else{
                    cc.warn("Audio source is 0, please check");
                }
                //选中图案
                // item.getChildByName("arrow").opacity = 255;
            },this);

            item.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
                this.moveInArea(item);
            },this);

            item.on(cc.Node.EventType.TOUCH_END, function () {
                if (!this.inArea(item)) {
                    item.getComponent("TouchDragger").backToOrigin();
                    if (this.wrongAudio != null) {
                        cc.audioEngine.play(this.wrongAudio, false, 1);
                    }else{
                        cc.warn("Audio source null, please check");
                    }
                } else {
                    //数字声音
                    if ((this.numAudio.length != 0) && (this.num < this.numAudio.length)) {
                        cc.audioEngine.play(this.numAudio[this.num], false, 1);
                    }else{
                        cc.warn("Audio source is 0, please check");
                    }
                    this.num ++
                }

                if (this.allInArea()) {
                    this.success();
                }
            }, this);
        }
    },

    //判断是否落入区域
    inArea(item) {
        let target = this.target;

        if (this.shade != null) {
            this.shade.active = false;
        }

        var isInArea = false;

        if (this.inAreaType == InAreaType.矩形) {
            isInArea = this.detectRectangle(item);
        } else if (this.inAreaType == InAreaType.碰撞体) {
            isInArea = this.detectCollision(item);
        }

        item.active = !isInArea;

        return isInArea;
    },

    detectRectangle(item) {
        let target = this.target;
        if((item.x < (target.x+target.width/2)) 
            && (item.x > (target.x-target.width/2))
            && (item.y < (target.y+target.height/2))
            && (item.y > (target.y-target.height/2))
            ) {//落入区域中
                return true;
            } else{
                return false;
        }
    },

    detectCollision(item) {
        // this.colliders = cc.director.getCollisionManager()._colliders;
        this.contacts = cc.director.getCollisionManager()._contacts;

        for (i = 0, l = this.contacts.length; i < l; i++) {
            var collisionType = this.contacts[i].updateState();
            if (collisionType == 2) {
                if (this.onItemStayTarget(this.contacts[i], item)) {
                    return true;   
                }
            }
        }
        return false;
    },

    onItemStayTarget(contact, item) {
        var collider1 = contact.collider1;
        var collider2 = contact.collider2;

        if ((collider1.node != item) && (collider2.node != item)) {
            return false;
        }

        if ((collider1.node === this.target) && 
        (this.items.indexOf(collider2.node) != -1)
        ) {
            return true;
        } else if ((collider2.node === this.target) && 
        (this.items.indexOf(collider1.node) != -1)
        ) {
            return true;
        } else {
            return false;
        }
    },

    

    success() {
        if (this.allInArea()) {
            // tell game ctrl next
            let parent = cc.find("BasePageController");
            if (parent != undefined) {
                parent.getComponent("BasePageController").goToNextPageNode();
            } else {
                cc.warn("");
            }
        }
    },

    
    allInArea() {
        for (let i = 0; i < this.items.length; ++i) {
            // if (!this.inArea(this.items[i])) {
            //     return false;
            // }
            if (this.items[i].active) {
                return false;
            }
        }
        cc.log("allInArea");
        //暂定重复的音频
        this.getComponent("PageEnterAudio").enable = false;
        return true;
    },

    

    moveInArea(item){
        if (this.shade == null) {
            return;
        }
        let target = this.target;
        if((item.x < (target.x+target.width/2)) 
            && (item.x > (target.x-target.width/2))
            && (item.y < (target.y+target.height/2))
            && (item.y > (target.y-target.height/2))
            ) {
                this.shade.active = true;
            } else{
                this.shade.active = false;
            }
    },





    

});
