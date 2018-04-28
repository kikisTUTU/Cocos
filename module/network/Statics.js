let Token = require("Token");
let UrlServer = require("UrlServer");
let Ajax = require("Ajax");

module.exports = {
    dayScore: "0",
    courseScore : "0" ,
/*
*功能描述：计算每日得分
*参数描述：currentGameScore@number,星级 ； correctRate@number,正确率
*作者：txd
*创建日期：2018-01-26
*/

calDayScore : function(currentGameScore,correctRate){
var cur_courseware_score = currentGameScore;
var correctscore = correctRate * 100;
var courseScore = 0;
var totalscore1 = cc.sys.localStorage.getItem("totalscore");

var  coursewareid =  cc.sys.localStorage.getItem("coursewareid"); 
//todo 如果当前课件已经得过3分，不可以再得分

 //课件得分
this.getGameRecord(coursewareid);
var coursewarerecord = cc.sys.localStorage.getItem("gamerecordlist");

//课件固定得分
console.log('correctscore='+correctscore);
//if (correctscore ==100 ) cur_courseware_score = totalscore1 + 1;
//if (correctscore>=80 && correctscore < 100) cur_courseware_score = totalscore1 + 1;
//if (correctscore>=60 && correctscore < 80) cur_courseware_score = totalscore1 + 1;
//每日得分
var yesrecord = this.yesterDayRecord();
if (yesrecord>0 ){
    totalscore1 = totalscore1+1;
}

//课程得分是第六关的得分。因为第六关是练习
var coursessublist = lscache.get("coursessublist");


//判断是否第六关
var totallen = coursessublist.length;
//最后一个的id
var courseScore = 0;
var current_course_name = lscache.get("exercisefile");
var resultType = 1;
//课程得分是第六关的得分。因为第六关是练习 
if (current_course_name == coursewareid){
    courseScore =  cur_courseware_score;
    resultType = 2;
}
gameovertime = Date.parse(new Date());

  //总分
  courseScore = courseScore+totalscore1;
  saveRecord(cur_courseware_score,courseScore);
  console.log("begin record");
  RecordData("finish-course",cur_courseware_score,resultType,totalscore1,gameovertime);
  console.log("finish record");
},
/*
*统计课件得分
*参数描述：
*作者：txd
*版本：v1.0
*创建日期：2018-1-26
*/
saveCoursewareScore : function(coursewareid){  
    var refresh_token = cc.sys.localStorage.getItem("refresh_token");
    var auth = Token.getTokenStr();
    var datenow = new Date();
    var yeasterday = datenow.getFullYear() +''+ datenow.getMonth() +''+  datenow.getDate() ;
    var dataurl = UrlServer.STATICSAPISERVER + '/s/module=ts-capricornus-client;type=courseware-score;time=d'+yeasterday;
    Ajax.requestJSONNoAuth(dataurl, "get","false","",auth,function succesfn(datas){
        console.log(datas);
        return datas;
    },function errorfn(xhr){  
                var res = xhr.responseJSON;
  
                if (xhr.status == 401 && res.error == 'invalid_token'){
                    console.log('get refreshToken');
                    Token.dorefreshToken(refresh_token);
                    setTimeout(this.saveCoursewareScore(),200);
                }
    });
  },
  /*
  *统计前一日得分
  *参数描述：
  *作者：txd
  *版本：v1.0
  *创建日期：2018-1-26
  */
  saveYesterDayRecord : function(){
    var refresh_token = cc.sys.localStorage.getItem("refresh_token");
    var auth = Token.getTokenStr();
    var datenow = new Date();
    var yeasterday = datenow.getFullYear() +''+ datenow.getMonth() +''+  datenow.getDate() ;
    var dataurl = UrlServer.STATICSAPISERVER+'/s/module=ts-capricornus-client;type=total-course-count;time=d'+yeasterday;
    Ajax.requestJSONNoAuth(dataurl, "get","false","",auth,function succesfn(datas){
      console.log(datas);
       return datas;
    },function errorfn(xhr){
                var res = xhr.responseJSON;
  
                if (xhr.status == 401 && res.error == 'invalid_token'){
                // clearCache();
                    console.log('get refreshToken');
                    Token.dorefreshToken(refresh_token);
                    setTimeout(this.saveYesterDayRecord(),200);
                }
      });
  },

/*
*功能描述：获取课件的游戏数据列表
*参数描述：ids@string, 当前课程中包含的所有的课件id
*作者：txd
*创建日期：2018-1-26
*/
getGameRecord : function(ids){
    var refresh_token = cc.sys.localStorage.getItem("refresh_token");
    var auth = Token.getTokenStr();
    Ajax.requestJSONNoAuth(UrlServer.RECORDAPISERVER+"/record/courseId="+ids,"get","false","",auth,function succesfn(datas){
 
       var gamerecordlist = datas;

       cc.sys.localStorage.setItem("gamerecordlist", gamerecordlist);

    },function errorfn(xhr){

              var res = xhr.responseJSON;

                if (xhr.status == 401 && res.error == 'invalid_token'){
                
                     console.log('get refreshToken');
                     if (Token.dorefreshToken(refresh_token)=="11"){
                        setTimeout(this.getGameRecord(ids),200);
                     }

                 }
});
},

}