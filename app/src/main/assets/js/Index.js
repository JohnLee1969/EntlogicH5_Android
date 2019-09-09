
var loginImgs = "";
function getloginImgs() {

    JYSM.ajax.ajaxGet(//url,obj,paramStr, callback
        getURL_JG_USERS_R + "?flag=getloginImgs&rnd=" + Math.random()
        , null, "null",
        function (strhtml) {
            loginImgs = eval("[" + strhtml + "]");;
            //alert(loginImgs);
            var timeInterval = 6000;
            setInterval(R_imgs, timeInterval);
            R_imgs();
        });

}
var curIndex = 0;
function R_imgs() {
    var _loginLogo = $("rdImgs");
    if (_loginLogo) {
        if (curIndex == loginImgs.length - 1) {
            curIndex = 0;
        } else {
            curIndex += 1;
        }
        _loginLogo.style.cssText = "background:url(" + loginImgs[curIndex] + ") center center no-repeat;width:96%;margin:2%;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;";
        _loginLogo.style.backgroundImage = "url(" + loginImgs[curIndex] + ")";
        _loginLogo.style.backgroundSize = "100% 100%";
        _loginLogo.style.backgroundRepeat = "no-repeat";
        _loginLogo.style.backgroundPosition = "center center";
        _loginLogo.style.height = "200px";

        var _optfocusIndex = 0.1;
        var _optStepfocusIndex = 0.1;
        var _speedfocusIndex = 200;
        var fl_infocusIndex = window.setInterval(function () {
            if (_optfocusIndex < 1.0) {
                _optfocusIndex = _optfocusIndex + _optStepfocusIndex;
                _loginLogo.style.filter = "alpha(opacity=" + (_optfocusIndex * 100) + ")";
                _loginLogo.style.opacity = "" + _optfocusIndex + "";
            } else {
                clearInterval(fl_infocusIndex);
                _loginLogo.style.filter = "alpha(opacity=100)";
                _loginLogo.style.opacity = "1";
            }
        }, _speedfocusIndex);
    }
}

function getWapNav(obj,actIndex) {

    JYSM.ajax.ajaxGet(//url,obj,paramStr, callback
        getURL_JG_USERS_R + "?flag=getwapnav&rnd=" + Math.random()
        , null, "null",
        function (strhtml) {
            var _obj = obj || "footnav";
            var footobj = JYSM.$(_obj);
            if (footobj) {
                footobj.innerHTML = strhtml;
                if (footobj.childNodes.length > 0) {
                    var lis = footobj.getElementsByTagName("li");
                    if (lis.length >= actIndex) {
                        JYSM.style.addClass(lis[actIndex], "active");
                    }
                    //for(var i =0 , icount = lis.length;i<icount;i++){

                    //}
                }
            }
        });

}
function pageLoadResize() {
    window.onload = function () {
        var DocH = document.documentElement.clientHeight;
        JYSM.$("b_bg").style.height = DocH - 40 + "px";
        //getloginImgs();
    }
    window.onresize = function (e) {
        var DocH = document.documentElement.clientHeight;
        JYSM.$("b_bg").style.height = DocH - 40 + "px";
    }
}

function doExitSys() {
    JY.alert.alertOKOrNot("是否真的要退出系统？",
        function () {
           // JYSM.alert.loading("正在退出系统……");
            JYSM.ajax.ajaxGet(//url,obj,paramStr, callback
                getURL_JG_USERS_R + "?flag=Logout&rnd=" + Math.random()
                , null, "null", function (strhtml) {
                    if (strhtml.indexOf("OK") != -1) {
                        JYSM.cookie.set("jlbiosSys", "", -10);
                        parent.location.href = "login.html";
                    } else {
                        JYSM.alert.alertOK("<p style='text-align:center;font-size:14pt;color:#f00;'>" + strhtml + "退出登录出错。</p>");
                    }
                });
        });
}

function getloginUserName() {

    JYSM.ajax.ajaxGet(//url,obj,paramStr, callback
        getURL_JG_USERS_R + "?flag=getuser&rnd=" + Math.random()
        , null, "null",
        function (strhtml) {
            var _userinfo = JYSM.$("wap_userinfo");
            _userinfo.innerHTML = "<p style='text-align:left;margin:10px;'>" + strhtml + "</p>";
           // JYSM.alert.alertOK("<p style='text-align:center;font-size:14pt;color:#f00;'>" + strhtml + "</p>");
        });

}