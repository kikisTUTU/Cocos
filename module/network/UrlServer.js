var ServerUrl = cc.Enum({
        GOWEBLOGINURL: "https://ttauthts.toonsmart.cn/oauth/authorize?response_type:code&client_id:ts-capricornus-client",
        GOWEBTOKENURL : "https://ttauthts.toonsmart.cn/oauth/token",
        GOWEBWELCOMEURL: "https://tttt.toonsmart.cn/wx/pages/user_welcome.html",
        USERAPISERVER : "https://ttuserts.toonsmart.cn/api/v1.0",//http://10.1.1.103:8044",
        STATICSAPISERVER : "https://ttstats.toonsmart.cn/api/v1.0",//http://10.1.1.129:8083"
        RECORDAPISERVER : "https://ttrects.toonsmart.cn/api/v1.0",//"http://10.1.1.129:8079",
        BAPISERVER : "https://ttcoursets.toonsmart.cn/api/v1.0/",//http://10.1.1.209:8555",
        BUSINESSAPISERVER : "https://ttshopts.toonsmart.cn/api/v1.0",//http://10.1.1.209:8666",
        RECORDSAPISERVER :"https://ttdats.toonsmart.cn/api/v1.0",//http://10.1.1.129:8081",
    })

module.exports = ServerUrl;