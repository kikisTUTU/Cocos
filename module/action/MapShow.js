
cc.Class({
    extends: cc.Component,

    properties: {
        mapScrollView: {
            default: null,
            type: cc.ScrollView,
            displayName: "地图滚动栏",
            tooltip: "地图滚动栏控件ScrollView",
        },

        scrollViewContent: {
            default: null,
            type: cc.Node,
            displayName: "滚动栏的内容节点Content",
            tooltip: "滚动栏的内容节点Content（指上面滚动栏ScrollView对应的内容节点Content）",
        },

        startPosition: {
            default: cc.Vec2.ZERO,
            displayName: "起点标记坐标",
            tooltip: "地图的 起点标记的位置",
        },

        topBottom: {
            default: new cc.v2(100, 100),
            displayName: "顶部底部留空距离",
            tooltip: "地图的 顶部底部 留空距离",
        },

        spacingXY: {
            default: new cc.v2(100, 100),
            displayName: "水平|垂直间距",
            tooltip: "课程节点间的水平、垂直间距",
        },

        aLineSum: {
            default: 4,
            displayName: "一行的节点数目",
            tooltip: "节点类型不限",
        },

        // centerNodesSum: {
        //     default: 8,
        //     displayName: "课程节点数目",
        //     tooltip: "1、2、... N: N个有效课程节点数目 (不包括 起点 终点) (如果加上就一共: N+2个)",
        // },

        mapItemNode: {
            default: null,
            type: cc.Node,
            displayName: "地图节点模版",
            tooltip: "地图节点Node模版",
        },

        dottedLineSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
            displayName: "横向虚线图片",
            tooltip: "用于连接: 起点->课程->...->课程->终点  (图片为水平方向的虚线图片，使用过程中会涉及到旋转)",
        },

        actionDuration: 0.5,        // 课程节点出现动作时长

        _mapWidth: 0,               // 记录地图Content总宽度
        _mapHeight: 0,              // 记录地图Content总高度
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 强制设置方向：垂直
        this.mapScrollView.horizontal = false;
        this.mapScrollView.vertical = true;

        // 强制设置Content.Anchor：(0.5, 1)
        this.scrollViewContent.anchorX = 0.5;
        this.scrollViewContent.anchorY = 1;
    },

    initNodesLines(nodeDatas) {
        this.centerNodesSum = nodeDatas.length;
        // 课程 根节点
        this.nodeBase = new cc.Node("NodeBase");
        this.nodeBase.anchorX = 0.5;
        this.nodeBase.anchorY = 1;
        this.nodeBase.position = cc.p(this.startPosition.x, this.startPosition.y - this.topBottom.x);
        this.scrollViewContent.addChild(this.nodeBase, 2);

        // 虚线 根节点
        this.lineBase = new cc.Node("LineBase");
        this.lineBase.anchorX = 0.5;
        this.lineBase.anchorY = 1;
        this.lineBase.position = cc.p(this.startPosition.x, this.startPosition.y - this.topBottom.x);
        this.scrollViewContent.addChild(this.lineBase, 1);

        // 连线 + 节点
        this.startNode = cc.instantiate(this.mapItemNode);
        this.startNode.active =  true;
        this.startNode.opacity = 0;
        this.nodeBase.addChild(this.startNode, 10);
        this.startNode.name = "Node" + 0;
        this.startNode.getChildByName("label").getComponent(cc.Label).string = 0;
        // Data
        this.startNode.getComponent("MapItem").showWithStateIndex(0, -1);
        
        this.mapItemNodeWidth = this.startNode.width;
        this.mapItemNodeHeight = this.startNode.height;
        this.startNode.position = cc.p(this.mapItemNodeWidth/2, -this.mapItemNodeHeight/2);
        let lastPosition = this.startNode.position;

        // 计算出总宽度和高度
        this._mapWidth = this.mapItemNodeWidth + (this.aLineSum - 1) * this.spacingXY.x;
        this._mapHeight = this.mapItemNodeHeight + Math.ceil((this.centerNodesSum + 2) / this.aLineSum - 1) * this.spacingXY.y + this.topBottom.x + this.topBottom.y;

        // 重置scrollViewContent高度
        this.scrollViewContent.height = this._mapHeight;
        
        this.centerNodes = [];      // 课程节点们
        this.dottedLines = [];      // 虚线段们
        for (let i = 1; i <= this.centerNodesSum; i++) {
            let centerNode = cc.instantiate(this.mapItemNode);
            centerNode.active =  true;
            centerNode.opacity = 0;
            this.nodeBase.addChild(centerNode, 10);
            centerNode.name = "Node" + i;
            // 偶数行
            if (Math.floor(i/this.aLineSum)%2 == 0) {
                centerNode.position = new cc.p(this.mapItemNodeWidth/2 + i%this.aLineSum*this.spacingXY.x, 
                                              -this.mapItemNodeHeight/2 - Math.floor(i/this.aLineSum)*this.spacingXY.y);
            }
            // 奇数行
            else {
                centerNode.position = new cc.p(this.mapItemNodeWidth/2 + (this.aLineSum - 1 - i%this.aLineSum)*this.spacingXY.x, 
                                              -this.mapItemNodeHeight/2 - Math.floor(i/this.aLineSum)*this.spacingXY.y);
            }
            centerNode.getChildByName("label").getComponent(cc.Label).string = i;
            // Data
            centerNode.getComponent("MapItem").showWithStateIndex(i, nodeDatas[i-1], this.mapItemCallback.bind(this));
            //
            this.centerNodes.push(centerNode);

            // ++ 添加虚线
            this.drawADottedLine (i, lastPosition);

            lastPosition = centerNode.position;
        }

        this.endNode = cc.instantiate(this.mapItemNode);
        this.endNode.active =  true;
        this.endNode.opacity = 0;
        this.nodeBase.addChild(this.endNode, 10);
        this.endNode.name = "Node" + (this.centerNodesSum + 1);
        // 偶数行
        if (Math.floor((this.centerNodesSum+1)/this.aLineSum)%2 == 0) {
            this.endNode.position = new cc.p(this.mapItemNodeWidth/2 + (this.centerNodesSum+1)%this.aLineSum*this.spacingXY.x, 
                                            -this.mapItemNodeHeight/2 - Math.floor((this.centerNodesSum+1)/this.aLineSum)*this.spacingXY.y);
        }
        // 奇数行
        else {
            this.endNode.position = new cc.p(this.mapItemNodeWidth/2 + (this.aLineSum - 1 - (this.centerNodesSum+1)%this.aLineSum)*this.spacingXY.x, 
                                            -this.mapItemNodeHeight/2 - Math.floor((this.centerNodesSum+1)/this.aLineSum)*this.spacingXY.y);
        }
        this.endNode.getChildByName("label").getComponent(cc.Label).string = (this.centerNodesSum + 1);
        // Data
        this.endNode.getComponent("MapItem").showWithStateIndex(this.centerNodesSum + 1, -2);

        // ++ 添加虚线
        this.drawADottedLine (this.centerNodesSum + 1, lastPosition);
    },

    showNodesLines (mapCallback = undefined) {
        this._mapCallback = mapCallback;

        // 依次显示Nodes
        this.currentNodeIdx = 0;
        this.schedule(this.nodeSchedule = function() {
            if (this.currentNodeIdx >= 1 && this.currentNodeIdx <= this.centerNodesSum) {
                this.centerNodes[this.currentNodeIdx-1].runAction(this.getNodeAction());
            } else if (this.currentNodeIdx == 0) {
                this.startNode.runAction(this.getNodeAction());
            } else if (this.currentNodeIdx == this.centerNodesSum+1) {
                this.endNode.runAction(this.getNodeAction());
            }
            this.currentNodeIdx++;
        }, this.actionDuration, this.centerNodesSum+2, 0.01);

        // // 依次显示Lines
        this.currentLineIdx = 0;
        this.schedule(this.lineSchedule = function() {
            if (this.currentLineIdx < this.dottedLines.length) {
                this.dottedLines[this.currentLineIdx].runAction(cc.fadeIn(this.actionDuration));
            }
            this.currentLineIdx++;
        }, this.actionDuration, this.centerNodesSum+1, this.actionDuration*1.5);
    },

    // 退出node时，停掉两个schedule
    onDisable() {
        this.unschedule(this.nodeSchedule);
        this.unschedule(this.lineSchedule);
    },

    // 创建每个节点的出现动作
    getNodeAction() {
        let scale0 = cc.scaleTo(0.01, 0);
        let scale1 = cc.scaleTo(this.actionDuration, 1.0).easing(cc.easeBackOut());
        let fade1 = cc.fadeIn(this.actionDuration);
        return cc.sequence(scale0, cc.spawn(scale1, fade1));
    },

    // update (dt) {},

    // 在有规律的两个点之间 添加虚线
    drawADottedLine (curLineIndex, lastPosition) {
        let switchValue = curLineIndex % (this.aLineSum*2);

        let dottedLine = new cc.Node("Line" + curLineIndex);
        
        let dottedLineSprite = dottedLine.addComponent(cc.Sprite);
        dottedLineSprite.spriteFrame = this.dottedLineSpriteFrame;
        dottedLineSprite.type = cc.Sprite.Type.TILED;

        this.lineBase.addChild(dottedLine, 5);
        dottedLine.opacity = 0;
        dottedLine.anchorX = 0;
        dottedLine.anchorY = 0.5;
        dottedLine.position = cc.p(lastPosition.x, lastPosition.y);

        // 方向：上->下
        if (switchValue == 0 || switchValue == this.aLineSum) {
            dottedLine.rotation = 90;
            dottedLine.width = this.spacingXY.y;
        }

        // 方向：左->右
        else if (switchValue > 0 && switchValue < this.aLineSum) {
            dottedLine.rotation = 0;
            dottedLine.width = this.spacingXY.x;
        }

        // 方向：右->左
        else if (switchValue > this.aLineSum && switchValue < this.aLineSum*2) {
            dottedLine.rotation = 180;
            dottedLine.width = this.spacingXY.x;
        }

        this.dottedLines.push(dottedLine);
    },

    // 获取地图Content的总宽度
    getMapWidth () {
        return _mapWidth;
    },

    // 获取地图Content的总高度
    getMapHeight () {
        return _mapHeight;
    },

    // 1-N  序号 取 课程节点Node
    getNodeByCourseId(idx) {
        if (!js.isNumber(idx)) {
            idx = parseInt(idx);
        }
        if (idx >= 1 && idx <= this.centerNodes.length) {
            return this.centerNodes[idx-1];
        }
        return undefined;
    },

    // MapItem 点击回调
    mapItemCallback(itemIndex, stateIndex) {
        cc.log("mapItemCallback=" + itemIndex + ", " + stateIndex);
        //
        if (this._mapCallback != undefined) {
            this._mapCallback(itemIndex, stateIndex);
        }
    },
});
