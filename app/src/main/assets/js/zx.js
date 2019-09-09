
var postURL_JG_USERS_R = "../AjaxData/Post_Portal_R.aspx?flag=0";
var getURL_R = "../AjaxData/Get_Portal_R.aspx";

function getZXListByID() {
    var id = JYSM.getQ("id");
    JYSM.ajax.ajaxGet(//url,obj,paramStr, callback
        getURL_R + "?flag=zxlist&id=" + id + "&rnd=" + Math.random()
        , null, "null",
        function (strhtml) {
            var zx_List = JYSM.$("zx_List");
           // var _dataStr = base64_decode(strhtml);
            var jsondata = eval("(" + strhtml + ")");
            if (jsondata && jsondata.T1&& jsondata.T1.length > 0) {
                
                var _tmpul = "<ul class=\"list1\"> </ul>";
                if (jsondata.T1[0].F_SHOW_T == "icon") {
                    _tmpul = "<ul class=\"tga3 wap_icon\"> </ul>";
                }
                var _objUl = JYSM.toEle(_tmpul);
                zx_List.appendChild(_objUl);


                for (var i in jsondata.T1) {
                    var _tmp = "<li><a href=\"zxInfo.html?pid="+id+"&id=" + jsondata.T1[i]["ID"] + "\">" + jsondata.T1[i]["F_FLMC"] + "</a></li>";
                    var _obj = JYSM.toEle(_tmp);
                    _objUl.appendChild(_obj);
                }
            } else {
                var _tmpul = "<p style=\"width:80%;color:#fff;margin:10%;\">暂无信息……(no data)</p>";
                var _objUl = JYSM.toEle(_tmpul);
                zx_List.appendChild(_objUl);

            }
            //zx_List.innerHTML = strhtml;
        });

}


function getZXInfoListByID() {
    var id = JYSM.getQ("id");
    var pid = JYSM.getQ("pid");
    JYSM.ajax.ajaxGet(//url,obj,paramStr, callback
        getURL_R + "?flag=zxInfoList&id=" + id + "&rnd=" + Math.random()
        , null, "null",
        function (strhtml) {
            var zx_List = JYSM.$("zx_List");
            // var _dataStr = base64_decode(strhtml);
            var jsondata = eval("(" + strhtml + ")");
            if (jsondata && jsondata.T1 && jsondata.T1.length > 0) {

                var _tmpul = "<ul class=\"list1\"> </ul>";
                var _objUl = JYSM.toEle(_tmpul);
                zx_List.appendChild(_objUl);


                for (var i in jsondata.T1) {
                    var _tmp = "<li><a href=\"zxInfoView.html?pid=" + id + "&ppid=" + pid + "&id=" + jsondata.T1[i]["ID"] + "\">" + jsondata.T1[i]["F_BT"] + "</a></li>";
                    var _obj = JYSM.toEle(_tmp);
                    _objUl.appendChild(_obj);
                }
            } else {
                var _tmpul = "<p style=\"width:80%;color:#fff;margin:10%;\">暂无信息……(no data)</p>";
                var _objUl = JYSM.toEle(_tmpul);
                zx_List.appendChild(_objUl);

            }
            //zx_List.innerHTML = strhtml;
        });

}

function getZXInfoViewByID() {
    var id = JYSM.getQ("id");
    var pid = JYSM.getQ("pid");
    JYSM.ajax.ajaxGet(//url,obj,paramStr, callback
        getURL_R + "?flag=zxInfoView&id=" + id + "&rnd=" + Math.random()
        , null, "null",
        function (strhtml) {
            var zx_View = JYSM.$("zx_View");
            // var _dataStr = base64_decode(strhtml);
            var jsondata = eval("(" + strhtml + ")");
            if (jsondata && jsondata.T1 && jsondata.T1.length > 0) {

                for (var i in jsondata.T1) {
                    var _tmp = "<h1>" + jsondata.T1[i]["F_BT"] + "</h1>";
                    var _obj = JYSM.toEle(_tmp);
                    zx_View.appendChild(_obj);
                    var _tmp = "<p>" + base64_decode(jsondata.T1[i]["F_NR"]) + "</p>";
                    var _obj = JYSM.toEle(_tmp);
                    zx_View.appendChild(_obj);
                }
            }
            //zx_List.innerHTML = strhtml;
        });

}