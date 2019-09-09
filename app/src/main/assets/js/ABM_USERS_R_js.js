//JSCode begin Auto By jlbios   FileName: JG_USERS_R_js.js      
function $(obj) {
    return "string" == typeof obj ? document.getElementById(obj) : obj;
}

//提交和获取数据地址
var postURL_JG_USERS_R = "../AjaxData/Post_Portal_R.aspx?flag=0";
var getURL_JG_USERS_R = "../AjaxData/Get_Portal_R.aspx";


function createXMLHttpRequest_JG_USERS_R() {
    if (window.ActiveXObject) {
        try {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e1) {
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        }
    }
    else if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
    return xmlHttp;
}

//JSON数据
function CreateJSON_JG_USERS_R() {
    var jsonStr = "{t1:[{";
    var tmpfields = fields_JG_USERS_R.split(',');
    var tmpoBjects = oBjects_JG_USERS_R.split(',');
    if(tmpfields.length != tmpoBjects.length) return "";//判断一下表字段和对象个数
    for (var i = 0; i < tmpoBjects.length; i++) {
        if (!$(tmpoBjects[i])) continue;
        var e = $(tmpoBjects[i]);
        var tmpvalue = "";
        if (e.type == "text") {//输入框
            tmpvalue = e.value;
        }
        else if (e.type == "textarea") {//多行输入框
            tmpvalue = e.innerHTML;
        }
        else if (e.type == "checkbox") {//勾选框
            tmpvalue = e.checked ? "1" : "0";
        }
        else if (e.type == "select-one") {//下拉选择框
            var selectindex = e.selectedIndex;
            tmpvalue = e.options[selectindex].value;
        }
        //更多类型的自行添加。。。
        
        if(i != tmpoBjects.length-1){
          jsonStr += tmpfields[i] + ":\"" + tmpvalue + "\",";
        }
        else{
          jsonStr += tmpfields[i] + ":\"" + tmpvalue + "\"";
        }
    }
    jsonStr += "}]}";
    return jsonStr;
}
//所有的都当作是TEXTBOX 自行修改---
function Get_JSON_JG_USERS_R(id) {
    var jsonStr = "{t1:[{";
    jsonStr += "ID:\"" + id + "\",";//ID
    jsonStr += "F_DLM:\"" + $("txt_F_DLM").value + "\",";//登录名
    jsonStr += "F_ZSXM:\"" + $("txt_F_ZSXM").value + "\",";//真实姓名
    jsonStr += "F_SZDW:\"" + $("txt_F_SZDW").value + "\",";//所在单位
    jsonStr += "F_SJHM:\"" + $("txt_F_SJHM").value + "\",";//手机号码
    jsonStr += "F_YXDZ:\"" + $("txt_F_YXDZ").value + "\",";//邮箱地址
    jsonStr += "F_MM:\"" + $("txt_F_MM").value + "\"";//密码
    jsonStr += "}]}";
    jsonStr = base64_encode(jsonStr).replace(/\+/g, "%jlbios");//进行base64加密传输 ，注意要引用base64.js哦！
    return jsonStr;
}




function PostFormDataJSON_JG_USERS_R(callb) {
    var json = CreateJSON_JG_USERS_R();
    var xmlhttp = createXMLHttpRequest_JG_USERS_R();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                info = xmlhttp.responseText;
                alert(info);
                if (callb) {
                  callb();//回调
                }
            }  else {
                alert("ajax调用失败！" + xmlhttp.status);
            }
        }
    }
    xmlhttp.open("POST", postURL_JG_USERS_R + "&id=" + GetQueryString("id"), false);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;"); //关键,否则出错
    xmlhttp.send(json); 
}

function PostDataJSON_JG_USERS_R_ByID(id) {

    var u = $("txt_F_DLM").value;
    var txt_F_ZSXM = $("txt_F_ZSXM").value;
    //var txt_F_ZSXM = $("txt_F_ZSXM").value;
    var p = $("txt_F_MM").value;
    var p2 = $("txt_F_MM2").value;
    if (u.length == 0 || p.length == 0 || txt_F_ZSXM.length == 0 || p2.length == 0) {
        alert("带*号为必填项。");
        return;
    }
    if (p != p2) {
        alert("密码和确认密码不相同，请重新输入。");
        return;
    }
    var regUser = $("regUser").innerHTML;
    if (regUser.indexOf("不")!=-1) {
        alert("此登录名已被注册，请重新输入。");
        return;
    }



    var json = Get_JSON_JG_USERS_R(id); //var _Id = GetQueryString("id");
    var xmlhttp = createXMLHttpRequest_JG_USERS_R();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                info = xmlhttp.responseText;
                alert(info);
                if (info.indexOf("成功") != -1) {
                  //GetJG_USERS_R_List(obj, pageIndex);//更新显示
                  CancelEdit_JG_USERS_R();//关闭编辑
                }
            }  else {
                alert("ajax调用失败！" + xmlhttp.status);
            }
        }
    }
    xmlhttp.open("POST", postURL_JG_USERS_R + "&id=" + id, false);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;"); //关键,否则出错
    xmlhttp.send(json); 
}

function PostEdit_JG_USERS_R_ByID(id) {

    var jsonStr = "{t1:[{";
    jsonStr += "ID:\"" + id + "\",";//ID
    jsonStr += "F_DLM:\"\",";//登录名
    jsonStr += "F_ZSXM:\"\",";//真实姓名
    jsonStr += "F_MM:\"\",";//密码
    jsonStr += "F_SZDW:\"" + $("txt_F_SZDW").value + "\",";//所在单位
    jsonStr += "F_SJHM:\"" + $("txt_F_SJHM").value + "\",";//手机号码
    jsonStr += "F_YXDZ:\"" + $("txt_F_YXDZ").value + "\"";//邮箱地址
    jsonStr += "}]}";
    jsonStr = base64_encode(jsonStr).replace(/\+/g, "%jlbios");//进行base64加密传输 ，注意要引用base64.js哦！

    var json = jsonStr; //var _Id = GetQueryString("id");
    var xmlhttp = createXMLHttpRequest_JG_USERS_R();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                info = xmlhttp.responseText;
                alert(info);
                if (info.indexOf("成功") != -1) {
                    //GetJG_USERS_R_List(obj, pageIndex);//更新显示
                    CancelEdit_JG_USERS_R();//关闭编辑
                    myUserInfo();
                } else {
                    alert(strhtml);
                }
            } else {
                alert("ajax调用失败！" + xmlhttp.status);
            }
        }
    }
    xmlhttp.open("POST", postURL_JG_USERS_R + "&id=" + id, false);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;"); //关键,否则出错
    xmlhttp.send(json);
}
//提交数据结束
//列表
function checkLogin() {
    var u = $("wap_user").value;
    var p = $("wap_pass").value;
    if (u.length == 0 || p.length == 0) {
        //alert("请输入用户名或密码。");        
        JYSM.alert.alertOK("<p style='text-align:center;font-size:16pt;color:#f00;'>请输入用户名或密码！</p>");
        
        return;
    }

    JYSM.ajax.ajaxGet(//url,obj,paramStr, callback
        getURL_JG_USERS_R + "?flag=checkLogin&u=" + u + "&p=" + p + "&rnd=" + Math.random()
        , null, "null", function (strhtml) {
            if (strhtml.indexOf("欢迎您") != -1) {
                window.location.href = "../index.html";
                JYSM.cookie.set("jlbiosSys", "" + u, 1);
            } else {
                JYSM.alert.alertOK("<p style='text-align:center;font-size:16pt;color:#f00;'>" + strhtml + "</p>");
            }
        });

}

//删除Logout
function Logout() {
    if (!window.confirm("是否真的退出登录?")) return;

    JYSM.ajax.ajaxGet(//url,obj,paramStr, callback
        getURL_JG_USERS_R + "?flag=Logout&rnd=" + Math.random()
        , null, "null", function (strhtml) {
            if (strhtml.indexOf("1") != -1) {
                window.location.href = "../login.html";
            } else {
                alert("退出登录出错。");
            }
        });
}

function getuserInfo() {
    var xmlhttp = createXMLHttpRequest_JG_USERS_R();
    if (xmlhttp) {
        xmlhttp.open('GET', getURL_JG_USERS_R + "?flag=getuser&rnd=" + Math.random(), true);
        xmlhttp.send(null);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var strhtml = xmlhttp.responseText;
                    var userInfo = $("userInfo");
                    userInfo.innerHTML = strhtml;
                } else {
                    alert("加载失败...请重新刷新本页面");
                }
            } else {
                //$(obj).innerHTML = "Loading...";
            }
        }
    }
}
function myUserInfo() {
    var xmlhttp = createXMLHttpRequest_JG_USERS_R();
    if (xmlhttp) {
        xmlhttp.open('GET', getURL_JG_USERS_R + "?flag=myUserInfo&rnd=" + Math.random(), true);
        xmlhttp.send(null);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var strhtml = xmlhttp.responseText;
                    var index_main = $("index_main");
                    index_main.innerHTML = strhtml;
                    UploadTX();
                } else {
                    alert("加载失败...请重新刷新本页面");
                }
            } else {
                //$(obj).innerHTML = "Loading...";
            }
        }
    }
}
//编辑
function Login() {
    var xmlhttp = createXMLHttpRequest_JG_USERS_R();
    if (xmlhttp) {
      CancelEdit_JG_USERS_R();

        xmlhttp.open('GET', getURL_JG_USERS_R+"?flag=login&rnd=" + Math.random(), true); 
        xmlhttp.send(null);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {  
                if (xmlhttp.status == 200) { 
                    var strhtml = xmlhttp.responseText;
                    if (strhtml != "") {
                        var editBgDiv = document.createElement("div"); //灰背景层 Math.max(document.body.clientHeight, document.documentElement.offsetHeight)
                        editBgDiv.id = "editBgDiv";
                        editBgDiv.style.cssText = "background:#fff;filter:Alpha(Opacity=40);opacity:0.4;background-color:#000000;";
                        editBgDiv.style.cssText += "width:" + (document.documentElement.offsetWidth - 0) + "px;";
                        editBgDiv.style.cssText += "height:" + Math.max(document.body.clientHeight, document.documentElement.clientHeight) + "px;";
                        editBgDiv.style.cssText += "left:0px;top:0px;display:block;";
                        editBgDiv.style.position = "absolute";
                        editBgDiv.style.zIndex = 99;
                        document.body.appendChild(editBgDiv);

                        var editDiv = document.createElement("div");
                        editDiv.id = "editDiv";
                        editDiv.style.cssText = "width:auto;min-width:400px;height:auto;text-align:left;border:5px solid #ccc;padding:10px;background:#fff;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;";
                        editDiv.style.position = "absolute";
                        editDiv.style.zIndex = 100;
                        var _titleHtml = "<div style=\"width:99%;height:25px;line-height:25px;color:#333333;font-size:12pt;text-align:left;padding-left:5px;\">&gt;&gt;登录:</div>";
                        editDiv.innerHTML = _titleHtml + strhtml;
                        document.body.appendChild(editDiv);
                        editDiv.style.left = ((document.documentElement.offsetWidth - $("editDiv").offsetWidth) / 2) + "px";
                        var t = document.documentElement.scrollTop || document.body.scrollTop;
                        var scTop = t + (document.documentElement.clientHeight - $("editDiv").offsetHeight) / 2;
                        var _top = scTop + 0;
                        editDiv.style.top = _top + "px";
                    } else {
                      alert("未能读取到数据,请重试!");
                    }


                } else {
                    alert("加载失败...请重新刷新本页面");
                }
            } else {
                //$(obj).innerHTML = "Loading...";
            }
        }
    }
}


function reg() {
    var xmlhttp = createXMLHttpRequest_JG_USERS_R();
    if (xmlhttp) {
        CancelEdit_JG_USERS_R();

        xmlhttp.open('GET', getURL_JG_USERS_R + "?flag=reg&rnd=" + Math.random(), true);
        xmlhttp.send(null);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var strhtml = xmlhttp.responseText;
                    if (strhtml != "") {
                        var editBgDiv = document.createElement("div"); //灰背景层
                        editBgDiv.id = "editBgDiv";
                        editBgDiv.style.cssText = "background:#fff;filter:Alpha(Opacity=40);opacity:0.4;background-color:#000000;";
                        editBgDiv.style.cssText += "width:" + (document.documentElement.offsetWidth - 0) + "px;";
                        editBgDiv.style.cssText += "height:" + (document.documentElement.offsetHeight - 0) + "px;";
                        editBgDiv.style.cssText += "left:0px;top:0px;display:block;";
                        editBgDiv.style.position = "absolute";
                        editBgDiv.style.zIndex = 99;
                        document.body.appendChild(editBgDiv);

                        var editDiv = document.createElement("div");
                        editDiv.id = "editDiv";
                        editDiv.style.cssText = "width:auto;min-width:600px;height:auto;text-align:left;border:5px solid #ccc;padding:10px;background:#fff;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;";
                        editDiv.style.position = "absolute";
                        editDiv.style.zIndex = 100;
                        var _titleHtml = "<div style=\"width:99%;height:25px;line-height:25px;color:#333333;font-size:12pt;text-align:left;padding-left:5px;\">&gt;&gt;免费注册:</div>";
                        editDiv.innerHTML = _titleHtml + strhtml;
                        document.body.appendChild(editDiv);
                        editDiv.style.left = ((document.documentElement.offsetWidth - $("editDiv").offsetWidth) / 2) + "px";
                        var t = document.documentElement.scrollTop || document.body.scrollTop;
                        var scTop = t + (document.documentElement.clientHeight - $("editDiv").offsetHeight) / 2;
                        var _top = scTop + 0;
                        editDiv.style.top = _top + "px";
                    } else {
                        alert("未能读取到数据,请重试!");
                    }


                } else {
                    alert("加载失败...请重新刷新本页面");
                }
            } else {
                //$(obj).innerHTML = "Loading...";
            }
        }
    }
}

function editMyUserInfo() {

    var xmlhttp = createXMLHttpRequest_JG_USERS_R();
    if (xmlhttp) {
        CancelEdit_JG_USERS_R();

        xmlhttp.open('GET', getURL_JG_USERS_R + "?flag=editMyUserInfo&rnd=" + Math.random(), true);
        xmlhttp.send(null);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var strhtml = xmlhttp.responseText;
                    if (strhtml != "") {
                        var editBgDiv = document.createElement("div"); //灰背景层
                        editBgDiv.id = "editBgDiv";
                        editBgDiv.style.cssText = "background:#fff;filter:Alpha(Opacity=40);opacity:0.4;background-color:#000000;";
                        editBgDiv.style.cssText += "width:" + (document.documentElement.offsetWidth - 0) + "px;";
                        editBgDiv.style.cssText += "height:" + Math.max(document.body.clientHeight, document.documentElement.clientHeight) + "px;";
                        editBgDiv.style.cssText += "left:0px;top:0px;display:block;";
                        editBgDiv.style.position = "absolute";
                        editBgDiv.style.zIndex = 99;
                        document.body.appendChild(editBgDiv);

                        var editDiv = document.createElement("div");
                        editDiv.id = "editDiv";
                        editDiv.style.cssText = "width:auto;min-width:600px;height:auto;text-align:left;border:5px solid #ccc;padding:10px;background:#fff;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;";
                        editDiv.style.position = "absolute";
                        editDiv.style.zIndex = 100;
                        var _titleHtml = "<div style=\"width:99%;height:25px;line-height:25px;color:#333333;font-size:12pt;text-align:left;padding-left:5px;\">&gt;&gt;修改我的信息:</div>";
                        editDiv.innerHTML = _titleHtml + strhtml;
                        document.body.appendChild(editDiv);
                        editDiv.style.left = ((document.documentElement.offsetWidth - $("editDiv").offsetWidth) / 2) + "px";
                        var t = document.documentElement.scrollTop || document.body.scrollTop;
                        var scTop = t + (document.documentElement.clientHeight - $("editDiv").offsetHeight) / 2;
                        var _top = scTop + 0;
                        editDiv.style.top = _top + "px";
                    } else {
                        alert("未能读取到数据,请重试!");
                    }


                } else {
                    alert("加载失败...请重新刷新本页面");
                }
            } else {
                //$(obj).innerHTML = "Loading...";
            }
        }
    }
}

function editPass() {
    var xmlhttp = createXMLHttpRequest_JG_USERS_R();
    if (xmlhttp) {
        CancelEdit_JG_USERS_R();

        xmlhttp.open('GET', getURL_JG_USERS_R + "?flag=editPass&rnd=" + Math.random(), true);
        xmlhttp.send(null);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var strhtml = xmlhttp.responseText;
                    if (strhtml != "") {
                        var editBgDiv = document.createElement("div"); //灰背景层
                        editBgDiv.id = "editBgDiv";
                        editBgDiv.style.cssText = "background:#fff;filter:Alpha(Opacity=40);opacity:0.4;background-color:#000000;";
                        editBgDiv.style.cssText += "width:" + (document.documentElement.offsetWidth - 0) + "px;";
                        editBgDiv.style.cssText += "height:" + Math.max(document.body.clientHeight, document.documentElement.clientHeight) + "px;";
                        editBgDiv.style.cssText += "left:0px;top:0px;display:block;";
                        editBgDiv.style.position = "absolute";
                        editBgDiv.style.zIndex = 99;
                        document.body.appendChild(editBgDiv);

                        var editDiv = document.createElement("div");
                        editDiv.id = "editDiv";
                        editDiv.style.cssText = "width:auto;min-width:400px;height:auto;text-align:left;border:5px solid #ccc;padding:10px;background:#fff;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;";
                        editDiv.style.position = "absolute";
                        editDiv.style.zIndex = 100;
                        var _titleHtml = "<div style=\"width:99%;height:25px;line-height:25px;color:#333333;font-size:12pt;text-align:left;padding-left:5px;\">&gt;&gt;修改密码:</div>";
                        editDiv.innerHTML = _titleHtml + strhtml;
                        document.body.appendChild(editDiv);
                        editDiv.style.left = ((document.documentElement.offsetWidth - $("editDiv").offsetWidth) / 2) + "px";
                        var t = document.documentElement.scrollTop || document.body.scrollTop;
                        var scTop = t + (document.documentElement.clientHeight - $("editDiv").offsetHeight) / 2;
                        var _top = scTop + 0;
                        editDiv.style.top = _top + "px";
                    } else {
                        alert("未能读取到数据,请重试!");
                    }


                } else {
                    alert("加载失败...请重新刷新本页面");
                }
            } else {
                //$(obj).innerHTML = "Loading...";
            }
        }
    }
}

function checkEditPass() {
    var xmlhttp = createXMLHttpRequest_JG_USERS_R();
    if (xmlhttp) {
        var old_p = $("txt_F_MM0").value;
        var p1 = $("txt_F_MM1").value;
        var p2 = $("txt_F_MM2").value;
        if (old_p.length == 0 || p1.length == 0 || p2.length == 0 || p2.length < 6) {
            alert("请输入密码,新密码不少于6位。");
            return;
        }
        if (p1 != p2) {
            alert("新密码和确认密码不相同，请重新输入。");
            return;
        }
        xmlhttp.open('GET', getURL_JG_USERS_R + "?flag=checkEditPass&old_p=" + old_p + "&p=" + p2 + "&rnd=" + Math.random(), true);
        xmlhttp.send(null);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var strhtml = xmlhttp.responseText;
                    if (strhtml.indexOf("成功") != -1) {
                        CancelEdit_JG_USERS_R();
                        // getuserInfo();

                        //window.location.href = window.location.href;
                    }
                    alert(strhtml);


                } else {
                    alert("加载失败...请重新刷新本页面");
                }
            } else {
                //$(obj).innerHTML = "Loading...";
            }
        }
    }
}
function checkUserName() {
    var _u = $("txt_F_DLM").value;
    if (_u.length == 0) return;

    var xmlhttp = createXMLHttpRequest_JG_USERS_R();
    if (xmlhttp) {
        var regUser = $("regUser");
        regUser.innerHTML = "......";
        xmlhttp.open('GET', getURL_JG_USERS_R + "?flag=checkUserName&u=" + _u + "&rnd=" + Math.random(), true);
        xmlhttp.send(null);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var strhtml = xmlhttp.responseText;
                    var regUser = $("regUser");
                    regUser.innerHTML = strhtml;
                } else {
                    alert("加载失败...请重新刷新本页面");
                }
            } else {
                //$(obj).innerHTML = "Loading...";
            }
        }
    }
}
//取数据结束
//取列表已选择的IDS 主要用于选择删除和复制等
GetChkSelected_JG_USERS_R_IDS = function(pObj) {
    var _pobj = $(pObj);
    if(!_pobj) return;
    var ids = "";
    var _chkSlts = _pobj.getElementsByTagName("input");
    for (var i = _chkSlts.length - 1; i >= 0; i--) {
        if (_chkSlts[i].type == "checkbox") {
            if (_chkSlts[i].checked && _chkSlts[i].title ) {
                if (ids == "") {
                    ids = "" + _chkSlts[i].title;
                }
                else {
                    ids += "," + _chkSlts[i].title;
                }
            }
        }
    }
    return ids;
}

CancelEdit_JG_USERS_R = function() {
  if ($("editBgDiv") != null) document.body.removeChild($("editBgDiv"));
  if ($("editDiv") != null) document.body.removeChild($("editDiv"));
}


//解析JSON数据
function GetJSON_Data_JG_USERS_R(jsonStr) {//读取JSON数据到数组对象var datas = [];
    var data = eval("("+jsonStr+")");
    for (var o in data) {
      //datas.push(data[o].字段);//具体情况自行修改~~
    }
}


//上传头像
UploadTX = function () {
    var oBtn = $("upload_tx");
    var oUrl = $("user_tx");
    var oShow = $("user_tx");
    var oRemind = $("up_status");
    new AjaxUpload(oBtn, {
        action: "../Upload/up.aspx",
        name: "upload",
        onSubmit: function (file, ext) {
            if (ext && /^(jpg|png|gif)$/.test(ext)) {
                //ext是后缀名rar/zip/doc/xls/jpg
                oRemind.innerHTML = "正在上传…";///Upload/Upload.aspx
                oBtn.disabled = "disabled";
            } else {
                oRemind.style.color = "#ff3300";
                oRemind.innerHTML = "不支持非图片格式！";
                return false;
            }
        },
        onComplete: function (file, response) {
            oBtn.disabled = "";
            //oBtn.value = "";
            oRemind.innerHTML = "";
            oShow.src = response;
           // oUrl.value = response;
        }
    });
};
window.document.onload = function () {
   // UploadTX();
}

function closeMyUserInfo() {
    window.location.href = window.location.href;
}

//JSCode END..*********************************
