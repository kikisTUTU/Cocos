
cc.Class({
    extends: cc.Component,

    properties: {
        resultPageNpcSpineNames: {
            default: [],
            type: [cc.String],
            displayName: "NPC Spine Names",
            tooltip: "NPC动画片段clips的名字，程序会对最后一个片段Loop循环播放（建议最后一个为呼吸动画片段）",
        },
    },
    start () {

        
    },

    onEnable(){

        this.node.getComponent(sp.Skeleton).clearTrack(0);
        this.node.getComponent(sp.Skeleton).setAnimation(0, this.resultPageNpcSpineNames[0], false);
        for (let i = 1; i < this.resultPageNpcSpineNames.length - 1; i++) {
            this.node.getComponent(sp.Skeleton).addAnimation(0, this.resultPageNpcSpineNames[i], false);
        }
        this.node.getComponent(sp.Skeleton).addAnimation(0, this.resultPageNpcSpineNames[this.resultPageNpcSpineNames.length - 1], true);
    }
});
