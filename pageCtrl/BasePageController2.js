// 适用于 AQR项目
// [供游戏逻辑脚本调用的方法]

// goToBeforePageNode()                 // 进上一页
// goToCurrentPageNode()                // 进当前页（全页面重置）
// goToNextPageNode()                   // 进下一页
// setRightButtonEnable(enable)         // 控制下一页按钮是否可以点击(true/false)

let Util = require("Util");

cc.Class({
    extends: cc.Component,

    properties: {

        // 设计页面容器
        pageDesignContainer: {
            default: null,
            type: cc.Node,
            displayName: "设计页面容器",
            tooltop: "课件、连续页面父节点|页面容器（Node的Size 务必设置 成同页面一样的Size）."
        },

        // 开始页面
        startPageNode: {
            default: null,
            type: cc.Node,
            displayName: "开始页面节点",
            tooltip: "开始界面Node，以便控制流程中，开始课程的时候清除这个页面节点",
        },
        startPageButton: {
            default: null,
            type: cc.Button,
            displayName: "开始按钮",
            tooltip: "开始界面的开始按钮，点击事件会自动添加",
        },

        // 展示页面容器
        pageShowContainer: {
            default: null,
            type: cc.Node,
            displayName: "展示页面容器",
            tooltop: "运行显示页面 的父节点"
        },

        // Home界面的URL地址
        homeUrl: {
            default: "",
            displayName: "HomeURL",
            tooltip: "指向Home界面的URL",
        },

        // 课件内容界面 3个通用按钮
        homeButton: {
            default: null,
            type: cc.Button,
            displayName: "Home按钮",
            tooltip: "课件内容中显示在左上角的，返回Home界面的按钮",
        },
        leftButton: {
            default: null,
            type: cc.Button,
            displayName: "上一页按钮",
            tooltip: "课件内容中显示在左下角的，切换到上一页界面Node的按钮",
        },
        rightButton: {
            default: null,
            type: cc.Button,
            displayName: "下一页按钮",
            tooltip: "课件内容中显示在右下角的，切换到下一页界面Node的按钮",
        },

        // 课件页面Nodes
        pageNodes: {
            default: [],
            type: [cc.Node],
            displayName: "课件页面节点们",
            tooltip: "按展示先后顺序依次添加",
        },
        
        _currentPageNodeIndex: 0,       // 当前页码 0 ~ (pageNodes.length - 1)
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 初始默认设置
        this.startPageNode.active = true;
        this.pageDesignContainer.active = false;

        this.homeButton.node.active = true;
        this.leftButton.node.active = false;
        this.rightButton.node.active = false;

        this.startPageNode.position = cc.Vec2.ZERO;
        this.pageShowContainer.position = cc.Vec2.ZERO;

        for (let i = 0; i < this.pageNodes.length; i++) {
            this.pageNodes[i].active = false;
            this.pageNodes[i].position = cc.Vec2.ZERO;
        }
    },

    start () {
        if (this.homeUrl == "") {
            cc.warn("HomeUrl没有填写，无法跳转。");
            return;
        }
        if (!Util.isURL(this.homeUrl)) {
            cc.warn("HomeUrl格式不正确。");
            return;
        }
        if (this.pageShowContainer.width <= 0 || this.pageShowContainer.height <= 0) {
            cc.warn("页面容器Size没有设置成同页面一样的Size.");
            return;
        }
        if (this.pageNodes.length == 0) {
            cc.warn("没有添加任何课件页面");
            return 0;
        }
        
        // 通用按钮  点击事件注册
        this.startPageButton.node.on('click', this.goToPlay, this);
        this.homeButton.node.on('click', this.goToHome, this);
        this.leftButton.node.on('click', this.goToBeforePageNode, this);
        this.rightButton.node.on('click', this.goToNextPageNode, this);
    },

    // update (dt) {},

    // 返回首页
    goToHome() {
        window.location.href = this.homeUrl;
    },

    // 开始课件
    goToPlay() {
        this.startPageButton.interactable = false;
        this.pageShowContainer.active = true;
        
        this._currentPageNodeIndex = 0;
    
        this.showCurrentPageWithPrefab(this.pageNodes[0]);
        
        // 左右按钮active设置
        this.leftButton.node.active = false;
        if (this.pageNodes.length > 1) {
            this.rightButton.node.active = true;
        } else {
            this.rightButton.node.active = false;
        }

        // 开始页面元素  显隐设置
        this.startPageNode.active = false;
        this.homeButton.node.active = true;
    },

    // 进上一页
    goToBeforePageNode() {
        if (this._currentPageNodeIndex > 0) {
            this._currentPageNodeIndex--;
            this.showCurrentPageWithPrefab(this.pageNodes[this._currentPageNodeIndex]);
        }

        // 左右按钮active设置
        if (this._currentPageNodeIndex == 0) {
            this.leftButton.node.active = false;
            this.rightButton.node.active = true;
        } else {
            this.leftButton.node.active = true;
            this.rightButton.node.active = true;
        }
    },

    // 进当前页（全页面重置）
    goToCurrentPageNode() {
        // 先 展示当前页面
        this.currentPageNode = cc.instantiate(this.pageNodes[this._currentPageNodeIndex]);
        this.currentPageNode.parent = this.pageShowContainer;
        this.currentPageNode.active = true;
        this.currentPageNode.innerName = "Page_" + this._currentPageNodeIndex + "_2";
        this.currentPageNode.position = cc.Vec2.ZERO;

        // 再 删除其他页面
        for (let i = this.pageShowContainer.childrenCount - 1; i >= 0; i--) {
            let child = this.pageShowContainer.children[i];
            if (child.innerName == "Page_" + this._currentPageNodeIndex + "_2") {
                continue;
            }
            child.destroy();
        }

        // 最后改回innerName
        this.currentPageNode.innerName = "Page_" + this._currentPageNodeIndex;
    },

    // 进下一页
    goToNextPageNode() {
        if (this._currentPageNodeIndex < this.pageNodes.length - 1) {
            this._currentPageNodeIndex++;
            this.showCurrentPageWithPrefab(this.pageNodes[this._currentPageNodeIndex]);
        }

        // 左右按钮active设置
        if (this._currentPageNodeIndex == this.pageNodes.length - 1) {
            this.leftButton.node.active = true;
            this.rightButton.node.active = false;
        } else {
            this.leftButton.node.active = true;
            this.rightButton.node.active = true;
        }
    },

    // 展示当前Page，同时销毁其他可能的Pages
    showCurrentPageWithPrefab (prefab) {
        // 先 展示当前页面
        this.currentPageNode = cc.instantiate(prefab);
        this.currentPageNode.parent = this.pageShowContainer;
        this.currentPageNode.active = true;
        this.currentPageNode.innerName = "Page_" + this._currentPageNodeIndex;
        this.currentPageNode.position = cc.Vec2.ZERO;

        // 再 删除其他页面
        for (let i = this.pageShowContainer.childrenCount - 1; i >= 0; i--) {
            let child = this.pageShowContainer.children[i];
            if (child.innerName == "Page_" + this._currentPageNodeIndex) {
                continue;
            }
            child.destroy();
        }
    },

    // 控制下一页按钮是否可以点击
    setRightButtonEnable(enable) {
        this.rightButton.interactable = enable;
    },
});
