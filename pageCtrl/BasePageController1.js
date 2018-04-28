// 适用于 GoWeb项目
// [供游戏逻辑脚本调用的方法]
// goToNextPageNode()                   // 进下一页
// setRightButtonEnable(enable)         // 控制下一页按钮是否可以点击(true/false)
// setRightButtonTipActive(active)      // 控制下一页按钮提示光圈是否显示(true/false)
// saveExercisePageResult(success)      // 保存当前练习页面结果（成功:success = true,失败:success = false）
// goToResultPage()                     // 进结算页

let Util = require("Util");

cc.Class({
    extends: cc.Component,

    properties: {

        // 开始页面
        startPageNode: {
            default: null,
            type: cc.Node,
            displayName: "开始页面节点Node",
            tooltip: "开始界面Node，以便控制流程中，开始课程的时候清除这个页面节点",
        },
        startPageButton: {
            default: null,
            type: cc.Button,
            displayName: "开始按钮",
            tooltip: "开始界面的开始按钮，点击事件会自动添加",
        },
        startPageSpineNode: {
            default: null,
            type: cc.Node,
            displayName: "开始NPC Spine节点",
            tooltip: "开始界面的spine动画所在的Node节点，需要spine动画包含一个开始按钮点击反馈动画片段clip为‘Spine动画片段名字’",
        },
        startPageSpineName: {
            default: "",
            displayName: "Spine动画片段名字",
            tooltip: "人物Spine播放的名字，会被用于 ’开始‘按钮点击时调用",
        },

        // 页面容器
        pageContainer: {
            default: null,
            type: cc.Node,
            displayName: "页面容器",
            tooltop: "教学、连续页面父节点|页面容器（Node的Size 务必设置 成同页面一样的Size）."
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
        rightButtonTipSpineNode: {
            default: null,
            type: cc.Node,
            displayName: "下一页按钮Spine节点",
            tooltip: "设置好默认Animation，且Loop设置为true，在被显示的时候，不再设置Animation（建议做为‘下一页按钮‘的子节点）",
        },

        // 教学页面Nodes
        teachNodes: {
            default: [],
            type: [cc.Node],
            displayName: "教学页面Nodes",
            tooltip: "按展示先后顺序依次添加",
        },
        // 练习页面Nodes
        exerciseNodes: {
            default: [],
            type: [cc.Node],
            displayName: "练习页面Nodes",
            tooltip: "按展示先后顺序依次添加",
        },

        // 结果页面Node
        resultPageNode: {
            default: null,
            type: cc.Node,
            displayName: "结算页面节点Node",
            tooltip: "结算界面Node，以便控制流程中，结束课程的时候显示这个页面节点",
        },
        resultEnterAudio: {
            default: null,
            url: cc.AudioClip,
            displayName: "进结算界面语音",
            tooltip: "进入结算界面就播放的一段语音",
        },
        resultPageNpcSpineNode: {
            default: null,
            type: cc.Node,
            displayName: "结算NPC Spine节点",
            tooltip: "结算界面的NPC Spine动画所在的Node节点",
        },
        resultPageNpcSpineNames: {
            default: [],
            type: [cc.String],
            displayName: "NPC Spine Names",
            tooltip: "NPC动画片段clips的名字，程序会对最后一个片段Loop循环播放（建议最后一个为呼吸动画片段）",
        },
        resultPageStarSpineNode: {
            default: null,
            type: cc.Node,
            displayName: "结算123Star Spine节点",
            tooltip: "结算界面的1星2星3星Spine动画所在的Node节点，需要Spine动画包含1星2星3星对应的动画片段clip",
        },
        result123StarSpineNames: {
            default: [],
            type: [cc.String],
            displayName: "123Star Spine Names",
            tooltip: "依次填入1星2星3星Spine的动画片段clip名字",
        },
        result123StarAudios: {
            default: [],
            url: [cc.AudioClip],
            displayName: "123Star Audios",
            tooltip: "依次填入1星2星3星音效",
        },



        _currentPageNodeIndex: 0,       // 当前页码 0 ~ (teachNodes.length + exerciseNodes.length - 1)
        _doExercising: false,           // 是否进入练习界面（教学界面false，练习界面true）

        _rightSum: 0,                   // 练习页面结果正确数
        _totalSum: 0,                   // 练习页面结果总数
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 通用按钮 |开始结束界面 默认设置
        this.startPageNode.active = true;
        this.pageContainer.active = false;
        this.resultPageNode.active = false;

        this.homeButton.node.active = false;
        this.leftButton.node.active = false;
        this.rightButton.node.active = false;

        this.startPageNode.position = cc.Vec2.ZERO;
        this.pageContainer.position = cc.Vec2.ZERO;
        this.resultPageNode.position = cc.Vec2.ZERO;

        // 教学|练习 页面 原始节点 默认设置
        for (let i = 0; i < this.teachNodes.length; i++) {
            this.teachNodes[i].active = false;
            this.teachNodes[i].position = cc.Vec2.ZERO;
        }
        for (let i = 0; i < this.exerciseNodes.length; i++) {
            this.exerciseNodes[i].active = false;
            this.exerciseNodes[i].position = cc.Vec2.ZERO;
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
        if (this.pageContainer.width <= 0 || this.pageContainer.height <= 0) {
            cc.warn("页面容器Size没有设置成同页面一样的Size.");
            return;
        }
        if (this.teachNodes.length == 0) {
            cc.warn("没有添加任何教学页面");
        }
        if (this.exerciseNodes.length == 0) {
            cc.warn("没有添加任何练习页面");
        }
        if (this.teachNodes.length + this.exerciseNodes.length == 0) {
            cc.warn("没有添加任何练习页面和练习页面");
            return;
        }
        if (this.result123StarSpineNames.length != 3) {
            cc.warn("设置结算界面 Spine Names个数不对");
            return;
        }
        if (this.result123StarAudios.length != 3) {
            cc.warn("设置结算界面 Audio Names个数不对");
            return;
        }

        // 通用按钮  点击事件注册
        this.startPageButton.node.on('click', this.goToPlay, this);
        this.homeButton.node.on('click', this.goToHome, this);
        this.leftButton.node.on('click', this.goToBeforePageNode, this);
        this.rightButton.node.on('click', this.goToNextPageNode, this);
    },

    // update (dt) {},

    // 开始课件
    goToPlay() {
        this.startPageButton.interactable = false;
        this.startPageSpineNode.getComponent(sp.Skeleton).clearTrack(0);
        this.startPageSpineNode.getComponent(sp.Skeleton).setAnimation(0, this.startPageSpineName, false);
        this.startPageSpineNode.getComponent(sp.Skeleton).setCompleteListener(function() {
            this._currentPageNodeIndex = 0;
    
            // 没有教学，直接进入练习界面
            if (this.teachNodes.length == 0) {
                this.showCurrentPageWithPrefab(this.exerciseNodes[0]);
                //this.exerciseNodes[0].active = true;    // 显示第一个练习界面Node
                this._doExercising = true;              // 不是在练习界面
                //
                this.leftButton.node.active = false;
                this.rightButton.node.active = false;
            }

            // 正常情况都有教学，先进入教学界面
            else {
                this.showCurrentPageWithPrefab(this.teachNodes[0]);
                //this.teachNodes[0].active = true;       // 显示第一个教学界面Node
                this._doExercising = false;             // 不是在练习界面
                this.rightButtonTipSpineNode.active = false;            // 默认指引点击邮件Spine节点隐藏
                //
                this.leftButton.node.active = false;
                this.rightButton.node.active = true;
            }

            // 开始页面元素  显隐设置
            this.startPageNode.active = false;
            this.homeButton.node.active = true;
        }.bind(this));
    },

    // 返回首页
    goToHome() {
        window.location.href = this.homeUrl;
    },

    // 进上一页
    goToBeforePageNode() {
        if (this._doExercising) {
            cc.warn("已经进入练习界面，不能往前翻页。");
            return;
        }
        // 教学界面->教学界面
        if (this._currentPageNodeIndex > 0) {
            this._currentPageNodeIndex--;                               // 自增
            this.showCurrentPageWithPrefab(this.teachNodes[this._currentPageNodeIndex]);
            //this.teachNodes[this._currentPageNodeIndex].active = true;  // 显示上一个教学界面Node
            this._doExercising = false;                                 // 不是在练习界面
            this.rightButtonTipSpineNode.active = false;                // 默认指引点击邮件Spine节点隐藏
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

    // 进下一页
    goToNextPageNode() {
        // 教学界面->教学界面
        if (this._currentPageNodeIndex < this.teachNodes.length - 1) {
            this._currentPageNodeIndex++;                               // 自增
            this.showCurrentPageWithPrefab(this.teachNodes[this._currentPageNodeIndex]);
            //this.teachNodes[this._currentPageNodeIndex].active = true;  // 显示下一个教学界面Node
            this._doExercising = false;                                 // 不是在练习界面
            this.rightButtonTipSpineNode.active = false;                // 默认指引点击邮件Spine节点隐藏
        }

        // 教学界面->练习界面
        else if (this._currentPageNodeIndex == this.teachNodes.length - 1) {
            this._currentPageNodeIndex++;                               // 自增
            this.showCurrentPageWithPrefab(this.exerciseNodes[0]);
            //this.exerciseNodes[0].active = true;                        // 显示下一个界面Node（第一个练习界面Node）
            this._doExercising = true;                                  // 不是在练习界面
        }

        // 练习界面->练习界面
        else if (this._currentPageNodeIndex > this.teachNodes.length - 1 && this._currentPageNodeIndex < this.teachNodes.length + this.exerciseNodes.length - 1) {
            this._currentPageNodeIndex++;                                                               // 自增
            this.showCurrentPageWithPrefab(this.exerciseNodes[this._currentPageNodeIndex - this.teachNodes.length]);
            //this.exerciseNodes[this._currentPageNodeIndex - this.teachNodes.length].active = true;      // 显示下一个练习界面Node
            this._doExercising = true;                                                                  // 不是在练习界面
        }

        // 左右按钮active设置
        if (this._doExercising) {
            this.leftButton.node.active = false;
            this.rightButton.node.active = false;
        } else {
            this.leftButton.node.active = true;
            this.rightButton.node.active = true;
        }
    },

    // 展示当前Page，同时销毁其他可能的Pages
    showCurrentPageWithPrefab (prefab) {
        this.pageContainer.active = true;

        // 先 展示当前页面
        this.currentPageNode = cc.instantiate(prefab);
        this.currentPageNode.position = cc.Vec2.ZERO;
        this.currentPageNode.active = true;
        this.currentPageNode.innerName = "Page_" + this._currentPageNodeIndex;
        this.currentPageNode.parent = this.pageContainer;

        // 再 删除其他页面
        for (let i = this.pageContainer.childrenCount - 1; i >= 0; i--) {
            let child = this.pageContainer.children[i];
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

    // 控制下一页按钮提示光圈是否显示
    setRightButtonTipActive(active) {
        this.rightButtonTipSpineNode.active = active;
    },

    // 保存结果
    saveExercisePageResult(success) {
        if (success) {
            this._rightSum++;
        }
        this._totalSum++;
    },

    // 进结算页
    goToResultPage() {
        this.pageContainer.active = false;
        this.homeButton.node.active = false;
        this.resultPageNode.active = true;

        // 星数百分比计算
        let starPecent = this._rightSum*1.0/this._totalSum;

        // 进入语音
        cc.audioEngine.play(this.resultEnterAudio, false, 1.0);

        // NPC Spine 动画组
        this.resultPageNpcSpineNode.getComponent(sp.Skeleton).clearTrack(0);
        this.resultPageNpcSpineNode.getComponent(sp.Skeleton).setAnimation(0, this.resultPageNpcSpineNames[0], false);
        for (let i = 1; i < this.resultPageNpcSpineNames.length - 1; i++) {
            this.resultPageNpcSpineNode.getComponent(sp.Skeleton).addAnimation(0, this.resultPageNpcSpineNames[i], false);
        }
        this.resultPageNpcSpineNode.getComponent(sp.Skeleton).addAnimation(0, this.resultPageNpcSpineNames[this.resultPageNpcSpineNames.length - 1], true);
        
        // 1星／2星／3星  动画音效
        this.resultPageStarSpineNode.getComponent(sp.Skeleton).clearTrack(0);
        if (starPecent < 0.4) {
            cc.audioEngine.play(this.result123StarAudios[0], false, 1.0);
            this.resultPageStarSpineNode.getComponent(sp.Skeleton).setAnimation(0, this.result123StarSpineNames[0], false);
        } else if (starPecent < 0.6) {
            cc.audioEngine.play(this.result123StarAudios[1], false, 1.0);
            this.resultPageStarSpineNode.getComponent(sp.Skeleton).setAnimation(0, this.result123StarSpineNames[1], false);
        } else {
            cc.audioEngine.play(this.result123StarAudios[2], false, 1.0);
            this.resultPageStarSpineNode.getComponent(sp.Skeleton).setAnimation(0, this.result123StarSpineNames[2], false);
        }

        // 注册click监听，返回主页
        this.resultPageStarSpineNode.getComponent(sp.Skeleton).setCompleteListener(function() {
            this.resultPageNode.on(cc.Node.EventType.TOUCH_START, function() {
                this.goToHome();
            }, this);
        }.bind(this));
    },
});
