
// 此功能模块用于点击节点时触发的音效

// 使用说明：将脚本挂载到节点上，并将音效资源拖拽到audioSource位置
//          所以需要手动在spine节点下创建空子节点，并调节节点位置和大小
//         设置动画名称，并将spine节点拖入spineObj中




cc.Class({
    extends: cc.Component,
    properties: {
        音频资源: {
            url: cc.AudioClip,
            default: null
        },
        循环: false,
        音量: 1
    },


    onLoad () {
        
        this.node.on(cc.Node.EventType.TOUCH_START, function() {
            this.playWithoutLoop();
        }, this);
    },

 
    playWithoutLoop() {
        if (this.音频资源 != null) {
            cc.audioEngine.play(this.音频资源, this.循环, this.音量);
        } else {
            cc.warn("Audio source null, please check");
        }
    }

    
});

