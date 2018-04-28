let Ajax = require("Ajax");
let UrlServer = require("UrlServer");

// var TokenStr = cc.Enum({
//     access_token: "",
//     refresh_token : "",
//     expires_in: "",
// });

module.exports = {
    /*
    *功能描述：获取token字符串
    *参数描述：
    *作者：txd
    *版本 V1.0
    *创建日期：2018-01-23
    */
    getTokenStr : function() {
            var access_token = cc.sys.localStorage.getItem("access_token");
            var refresh_token = cc.sys.localStorage.getItem("refresh_token");
            var auth = 'Bearer ' + access_token;

            if (access_token){
                return auth;                 
            }else if (refresh_token){
                if(this.dorefreshToken(refresh_token) == "success"){
                   this.Token.getTokenStr();
                }
            }else{
                //重新登录；
                setTimeout("",200);
                window.location = UrlServer.GOWEBLOGINURL;
            }
    },
    /*
    *功能描述：登录后用code换取token
    *参数描述：code@string
    *作者：txd
    *版本 V1.0
    *创建日期：2018-01-23
    */
    getAcessToken : function(code){
        if (code){
            //获取token
            var tokenurl = UrlServer.GOWEBTOKENURL;
            var datastr = "grant_type=authorization_code&code='+code+'&client_id=ts-capricornus-client";
            ajax.requestJSON(tokenurl,"post","true",datastr,"","",function succesfn(data){

                this.accesstoken =  data.access_token;
                this.refreshtoken = data.refresh_token;
                this.expires_in = data.expires_in;
            
                cc.sys.localStorage.setItem("access_token",data.access_token);
                cc.sys.localStorage.setItem("refresh_token",data.refresh_token);
                cc.sys.localStorage.setItem("expires_time",data.expires_in);
                
                console.log(data.access_token+"==access_token");
            },function errorfn(xhr){
                clearCache();
                setTimeout("",200);
                window.location =  UrlServer.GOWEBLOGINURL;
             });
       }else{
            this.clearCache();
            setTimeout("",200);
            //top.location = 'https://ttauthts.toonsmart.cn/oauth/authorize?response_type=code&client_id=ts-capricornus-client';
            window.location = UrlServer.GOWEBWELCOMEURL;
       }
    },
    /*
    *功能描述：当token超时时候，用refreshtoken去换取token,如果返回状态401,需要重新登录
    *参数描述：refreshtoken@string
    *作者：txd
    *版本 V1.0
    *创建日期：2018-01-23
    */
    refreshToken : function (refreshtoken) {
        var url = UrlServer.GOWEBTOKENURL;
        var datastr = "grant_type=refresh_token&client_id=ts-capricornus-client&refresh_token="+refreshtoken;
        
        ajax.requestJSONNoAuth(url,"post","false",datastr,"","",function successfn(data){
            console.log("get refresh success");
            this.accesstoken =  data.access_token;
            this.refreshtoken = data.refresh_token;
            this.expires_in = data.expires_in;
            
            cc.sys.localStorage.setItem("access_token", data.access_token);
            cc.sys.localStorage.setItem("refresh_token", data.refresh_token);
            cc.sys.localStorage.setItem("expires_time", data.expires_in);
            
            return "success";
        }, function errorfn(xhr){
            console.log("get refresh error");
            var res = xhr.responseJSON;

            if (xhr.status == 401){
                console.log("get refresh 401");
                this.Token.clearCache();
                setTimeout("",200);
                console.log("get refresh end");
                window.location =  UrlServer.GOWEBLOGINURL;
                return "error";
            }
        }
        );
    },
    /*
    *功能描述：超时时候，清空缓存的token数据
    *参数描述：
    *作者：txd
    *版本 V1.0
    *创建日期：2018-01-23
    */
    clearCache : function (){
        this.accesstoken = "";
        this.refreshtoken = "";
        this.expires_in = "";
        cc.sys.localStorage.setItem("access_token","");
        cc.sys.localStorage.setItem("refresh_token","");
        cc.sys.localStorage.setItem("expires_time","");
        cc.sys.localStorage.setItem("code","");
    },
}

