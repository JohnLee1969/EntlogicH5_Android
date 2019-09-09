//JSCode begin Auto By jlbios   FileName: SYS_NAV_STYLE_B_js.js      
function $(obj) {
    return "string" == typeof obj ? document.getElementById(obj) : obj;
}

//提交和获取数据地址
var postURL_SYS_NAV_STYLE_B = "post_SYS_NAV_STYLE_B.aspx?flag=0";
var getURL_SYS_NAV_STYLE_B = "https://jzy.jysmtech.com:7443/AjaxData/Get_DB_View.aspx";


function GetSYS_NAV_STYLE_B_CSSTEXT() {
    JYSM.ajax.ajaxGet(//url,obj,paramStr, callback
        getURL_SYS_NAV_STYLE_B + "?flag=stylecss&rnd=" + Math.random()
        , null, "null",
        function (str) {
            JYSM.addStyleTxt(str);
        });
}

function GetSYS_CSSTEXTByCode(code) {
    JYSM.ajax.ajaxGet(//url,obj,paramStr, callback
        getURL_SYS_NAV_STYLE_B + "?flag=csstxt&code=" + code + "&rnd=" + Math.random()
        , null, "null",
        function (str) {
            JYSM.addStyleTxt(str);
        });
}
CancelEdit_SYS_NAV_STYLE_B = function() {
  if ($("editBgDiv") != null) document.body.removeChild($("editBgDiv"));
  if ($("editDiv") != null) document.body.removeChild($("editDiv"));
}


//解析JSOM数据
function GetJSON_Data_SYS_NAV_STYLE_B(jsonStr) {//读取JSON数据到数组对象var datas = [];
    var data = eval(jsonStr);
    for (var o in data) {
      //datas.push(data[o].字段);//具体情况自行修改~~
    }
}


function getUserID() {
    JYSM.ajax.ajaxGet(//url,obj,paramStr, callback
        getURL_SYS_NAV_STYLE_B + "?flag=userid&rnd=" + Math.random()
        , null, "null",
        function (str) {
            if (str == "0") {
                self.location.href = "../login.html";
            }
        });
}

//JSCode END..*********************************
