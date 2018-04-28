
cc.Class({
    extends: cc.Component,

    properties: {
        items: {
            default: [],
            type: [cc.Node],
            displayName: "图标列表"
        },

        originalItems: {
            default: [],
            type: [cc.Node],
            visible: false
        },

        distanceThreshold: {
            default: 15,
            displayName: "触发阀值"
        },

        moveDuration: {
            default: 0.2,
            displayName: "移动时长"   
        },

        selectedAnim: {
            default: null,
            type: cc.AnimationClip,
            displayName: "选中动画" 
        },

        elseAnim: {
            default: null,
            type: cc.AnimationClip,
            displayName: "其他动画" 
        },

        mixed: {
            default: false,
            type: Boolean,
            displayName: "随机排序"
        },

        x_axis_only: {
            default: false,
            type: Boolean,
            displayName: "只在x轴拖动"
        }
    },

    // LIFE-CYCLE CALLBACKS:

    

    addAnim() {
        for (i = 0; i < this.items.length; ++i) {
            var anim = this.items[i].addComponent(cc.Animation);
            if (this.elseAnim) {
                anim.addClip(this.elseAnim);
            }
            if (this.selectedAnim) {
                anim.addClip(this.selectedAnim);
            }
        }
    },

    playAnim(current) {
            for (i = 0; i < this.items.length; ++i) {
                var anim = this.items[i].getComponent(cc.Animation);
                var clipName = null;
                if (this.items[i] === current) {
                    if (this.selectedAnim) {
                        clipName = this.selectedAnim.name;
                    }
                } else {
                    if (this.elseAnim) {
                        clipName = this.elseAnim.name;
                    }
                }
                
                if (clipName) {
                    anim.play(clipName);
                }
            }
    },

    stopAnim(current) {
        if (this.elseAnim) {
            for (i = 0; i < this.items.length; ++i) {

                var anim = this.items[i].getComponent(cc.Animation);

                var clipName = anim.currentClip.name;
                anim.setCurrentTime(0, clipName);
                anim.stop(clipName);
            }
        }
    },

    onLoad () {
        this.originalItems = [];
        for (i = 0; i < this.items.length; ++i) {
            this.originalItems.push(this.items[i]);
        }

        this.initItems();
        this.sortByX();
    },

    start () {
        this.zOrder = 1;
        this.addAnim();

        if (this.mixed) {
            this.mix();
        }
        
    },

    initItems() {
        for (i = 0; i < this.items.length; ++i) {
            this.items[i].originalPos = this.items[i].position;
            // 选中
            this.items[i].on(cc.Node.EventType.TOUCH_START, function(event) {  
                event.currentTarget.setLocalZOrder(this.zOrder); 
                this.zOrder++;          
                this.playAnim(event.currentTarget);
            }.bind(this), this);

            // 移动
            this.items[i].on(cc.Node.EventType.TOUCH_MOVE, function(event) {
                var delta = event.touch.getDelta();
                event.currentTarget.x += delta.x;

                if (!this.x_axis_only) {
                    event.currentTarget.y += delta.y;
                }
                

                this.checkPos(event.currentTarget);

            }.bind(this), this);

            // 移动结束
            this.items[i].on(cc.Node.EventType.TOUCH_END, function(event) {             
                event.currentTarget.position = event.currentTarget.originalPos;

                var anim = event.currentTarget.getComponent(cc.Animation);
                var clipName = this.selectedAnim.name;
                anim.stop(clipName);

                this.stopAnim(event.currentTarget);
            }.bind(this), this);

            this.items[i].on(cc.Node.EventType.TOUCH_CANCEL, function(event) {             
                event.currentTarget.position = event.currentTarget.originalPos;

                var anim = event.currentTarget.getComponent(cc.Animation);
                if (anim) {
                    var clipName = this.selectedAnim.name;
                    anim.stop(clipName);
                }
                
                this.stopAnim(event.currentTarget);
            }.bind(this), this);
        };
    },

    checkPos(current) {
        for (var j = 0; j < this.items.length; ++j) {
            if ((current !== this.items[j])){
                if (cc.pDistance(current.position, this.items[j].originalPos) < this.distanceThreshold) {
                    this.exchange(current, this.items[j]);   
                }
            }
        }
    },

    mix() {
        if (this.items.length <= 2) {
            return;
        }
        var posArr = [];
        for (i = 0; i < this.originalItems.length; ++i) {
            posArr.push(this.originalItems[i].originalPos);
        }
        function randomsort(a, b) {
            return Math.random()>.5 ? -1 : 1;
        }
        this.items.sort(randomsort);

        for (i = 0; i < this.items.length; ++i) {
            this.items[i].originalPos = posArr[i];
            this.items[i].position = posArr[i];
        }

        this.sortByX();

    },

    exchange(current, target) {
        var posA = current.originalPos;
        var posB = target.originalPos;

        if (posB.x < posA.x) { // next 向前
            var currTar = target;
            var next = currTar.nextItem;
            while ((next !== null) && (next !== undefined)) {
                var pos_next = next.originalPos;
    
                currTar.originalPos = pos_next;
                var action = cc.moveTo(this.moveDuration, pos_next);
                currTar.runAction(action);
                
                // 传下去
                if (next === current) {
                    break;
                }

                currTar = next;
                next = currTar.nextItem;
            }
        } else { // previous 向后
            var currTar = target;
            var previous = currTar.previousItem;

            while ((previous !== null) && (previous !== undefined)) {
                var pos_previous = previous.originalPos;

                currTar.originalPos = pos_previous;
                var action = cc.moveTo(this.moveDuration, pos_previous);
                currTar.runAction(action);
                if (previous === current) {
                    break;
                }
                currTar = previous;
                previous = currTar.previousItem;
            }
        }
        current.originalPos = posB;

        this.sortByX();

        // 顺序日志
        // cc.log("exchange------------");

        // // current.position = posB;  
        // cc.log("current: " + current.name);
        // cc.log("target: " + target.name);
        // for (i = 0; i < this.items.length; ++i) {
        //     cc.log("上: " + (this.items[i].previousItem ? this.items[i].previousItem.name : "emtpy") + ", 中: " + this.items[i].name + ", 下: " + (this.items[i].nextItem ? this.items[i].nextItem.name : "empty"));
        // }  
    },

    sortByX() {
        function compare(val1, val2) {
            return val1.originalPos.x - val2.originalPos.x
        }
        this.items.sort(compare);
        for (i = 0; i < this.items.length; ++i) {
            cc.log(this.items[i].name);
            if (i === 0) { 
                this.items[i].previousItem = null;
                this.items[i].nextItem = this.items[i+1];
            } else if (i === (this.items.length - 1)) {
                this.items[i].previousItem = this.items[i-1];
                this.items[i].nextItem = null;
            } else {
                this.items[i].previousItem = this.items[i-1];
                this.items[i].nextItem = this.items[i+1];
            }
        }
    },

    checkOrderByX() {        
        for (i = 0; i < this.originalItems.length; ++i) {
            if (this.originalItems[i] !== this.items[i]) {
                return false;
            }
        } 
        return true;
    }



    // update (dt) {},
});
