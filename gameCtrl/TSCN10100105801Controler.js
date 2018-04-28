
cc.Class({
    extends: cc.Component,

    properties: {
        
        allFruits:{
            default: [],
            type: [cc.Node],
            displayName: "水果的数组",
            tooltip: "水果的数组",
        },
        fruitsVec:{
            default: [],
            type: [cc.SpriteFrame],
            displayName: "水果的种类",
            tooltip: "水果的种类",
        },
        basketsVec:{
            default: [],
            type: [cc.SpriteFrame],
            displayName: "篮筐的数组",
            tooltip: "篮筐的数组",
        },
        tree:{
            default: null,
            type: cc.Node,
            displayName: "树",
            tooltip: "树",
        },
        basket:{
            default: null,
            type: cc.Node,
            displayName: "篮筐",
            tooltip: "篮筐",
        },
        restart:{
            default: null,
            type: cc.Node,
            displayName: "重玩",
            tooltip: "重玩",
        },

    },


    start () {



 
        //初始值
        this.rightNums = 0;
        this.clickNums = 0;
        this.fruitType = 0;




        // //拼接数组
        // this.allFruits = this.rightFruitsVec.concat(this.falseFruitsVec);

        //读取所有位置
        this.allPos = [cc.Vec2];
        for(let i=0;i<this.allFruits.length;i++){

            this.allPos[i] = this.allFruits[i].getPosition();
        }

        //水果事件
        for(let i=0;i<this.allFruits.length;i++){
            this.allFruits[i].on(cc.Node.EventType.TOUCH_START, function (event) {
                if(this.allFruits[i].tag == "666"){
                    console.log("正确苹果点击");


                    //设置被点击水果的层级
                    this.allFruits[i].setLocalZOrder(2);

                    this.clickNums++;
                    this.allFruits[i].runAction(cc.moveTo(0.5,cc.p(575,-274)));

                    if(this.rightNums==this.clickNums){
                       console.log("胜利");
                    }
                }else{
                    console.log("错误苹果点击");
                    this.tree.getComponent(sp.Skeleton).clearTrack(0);   　　　　　　　　//队列中的指定的动画将被清除，这里清除0号位置的动画。
                    this.tree.getComponent(sp.Skeleton).setAnimation(0,"shake",false);

                    
                    for(let i = 0;i<this.allFruits.length;i++){
                        let seq1 = cc.sequence(cc.moveBy(0.1,cc.p(-20,0)),cc.moveBy(0.2,cc.p(40,0)),cc.moveBy(0.1,cc.p(-20,0)),cc.callFunc(function(){
                                        
                        },this));
                        this.allFruits[i].runAction(seq1);
                    }
                    

                }
                
                
              }, this);
        }

        this.restart.on(cc.Node.EventType.TOUCH_START, function (event) {
            this.restartFun();
            
          }, this);

        this.restartFun();

    },

    restartFun(){
    

        this.rightNums = 0;
        this.clickNums = 0;

        if(this.fruitType<=2){

            this.fruitType++;
        }else{
            this.fruitType=1;
        }

        cc.log("数字"+this.fruitType);

        //获取随机的数值
        this.numArray=this.getComponent("OperationCtrl").createFormule();
        for(let i=0; i<this.numArray.length; i++){

            cc.log("fff"+this.numArray[i]+this.numArray[i].correct);

            let strq = this.numArray[i].toString();
            let str = strq.replace('-', '=');
            

            cc.find("NumBoard/nums",this.allFruits[i]).getComponent(cc.Label).string = str;

            if(this.numArray[i].correct==true){
                this.allFruits[i].tag = 666;
            }else{
                this.allFruits[i].tag = 555;
            }

            // cc.log(this.numArray[i]+"打印一下"+this.numArray[i].result+this.numArray[i].correct);
        }

        cc.find("Num",this.basket).getComponent(cc.Label).string = this.numArray[i].result.toString();

        //水果换图片
        for(let i=0;i<this.allFruits.length;i++){
            this.allFruits[i].getComponent(cc.Sprite).spriteFrame = this.fruitsVec[this.fruitType-1];
        }
        //篮筐换图片
        this.basket.getComponent(cc.Sprite).spriteFrame = this.basketsVec[this.fruitType-1];


        //打乱水果们的位置
        // this.originalPosArray = [];
        // for(let i=0;i<this.allFruits.length;i++){

        //     this.originalPosArray.push(i);
        // }
        // this.originalPosArray.sort(function () { return 0.5 - Math.random(); });


        this.allPos.sort(function () { return 0.5 - Math.random(); });
        
        for(let i=0;i<this.allPos.length;i++){

            cc.log("刺激战场"+this.allPos[i]);
        }
        
        //层级复原
        for(let i=0;i<this.allFruits.length;i++){

            this.allFruits[i].setLocalZOrder(1);
        }


        //全部恢复
        for(let i=0;i<this.allFruits.length;i++){
            this.allFruits[i].active = true;
            this.allFruits[i].position = this.allPos[i];
        }

        //随机隐藏两个水果
        this.disArr = this.getRandomItemIndex(6,2);
        for(let i=0;i<this.disArr.length;i++){
            this.allFruits[this.disArr[i]].active = false;
        }

        //判断正确的个数
        for(let i=0;i<this.allFruits.length;i++){
            if(this.allFruits[i].active == true){
                console.log("进来几次");
                if(this.allFruits[i].tag == "666"){

                    this.rightNums++;
                }
            }

        }

    },

    getRandomItemIndex (sum,need) {
        //原数组 
        var originalArray = [];
        //给原数组originalArray赋值 
        for(var i = 0; i < sum;i++){
            originalArray[i] = i;
        }
        originalArray.sort(function () { return 0.5 - Math.random(); });
        // console.log(originalArray);
        originalArray.splice(need);
        console.log(originalArray);
        return originalArray;
    },
    

});
