
cc.Class({
    extends: cc.Component,

    properties: {
        beginBtns:{
            default: [],
            type: [cc.Button],
            displayName:"初始按钮",
            tooltip:"最开始显示在页面上面的按钮"
        },
        endBtns:{
            default: [],
            type: [cc.Button],
            displayName:"点击后显示的按钮",
            tooltip:"点击初始按钮后显示的按钮"
        },

    },


    start () {


        if(this.beginBtns.length!=this.endBtns.length){
            cc.log("开始按钮和结束按钮数量不等");
            return;
        }

        for(let i=0; i<this.beginBtns.length; i++){

            this.beginBtns[i].node.tag=i;
            this.beginBtns[i].node.on('click', function(event){
                cc.log("78888"+event.target.tag);
                this.beginBtns[event.target.tag].node.active = false;
                this.endBtns[event.target.tag].node.active = true;
            }, this);

        }

    },

});
