var cfg = {
    isActionTimes: 0,

    //判断要调用的方法
    isActionFinished: function () {
        if(cfg.isActionTimes==0){
            // cc.log("可以");
            return true;
        }else{
            // cc.log("不可以");
            return false;
        }
    }
};

module.exports = cfg;
