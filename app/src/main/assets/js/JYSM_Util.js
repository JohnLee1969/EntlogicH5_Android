var JYSM_Util = {};
var JYSM = {};
var JY = {};
var J = {};
function sleep(d) {
    for (var t = Date.now() ; Date.now() - t <= d;);
}
var extend = JYSM.extend = function (a, b) {
    var n;
    if (!a) { a = {};}
    for (n in b) { a[n] = b[n]; }
    return a;
};
function findPObj(objid) {
    var _obj = document.getElementById(objid);
    if (_obj) return _obj;
    var _parent = this;
   // while (!_parent) {
    for (var i = 0; i < 10; i++) {
        _obj = _parent.document.getElementById(objid);
        _parent = _parent.parent;
        if (_obj) return _obj;
        if (!_parent) return null;
    }
    return null;
}
JYSM_Util = {
    uFormStartIndex:7400,//除导航外打开新窗口的起始ID号，可使用的ID序号
    Trim: function (str) {//去掉首尾空格
        return str.replace(/(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, '');
    },
    getID: function (obj) {//获取一个对象
        return "string" == typeof obj ? findPObj(obj) : obj;
    },
    getObj: function (obj) {//获取一个对象
        return "string" == typeof obj ? document.getElementById(obj) : obj;
    },
    getByDoc: function (obj,doc) {//获取一个对象
        return "string" == typeof obj ? doc.getElementById(obj) : obj;
    },
    $: function (obj) {//获取一个对象
        return JYSM_Util.getID(obj);
    },
    delObj: function (obj) {//删除一个对象
        var _o = JYSM.$(obj);
        if (_o) {
            _o.parentNode.removeChild(_o);
        }
    },
    toEle: function (html) {///html转对象
        var temp = document.createElement("div");
        temp.innerHTML = html;
        //(temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
        var output = temp.childNodes[0];
        temp = null;
        return output;
    },
    HTMLEncode: function (html) {
        var temp = document.createElement("div");
        (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
        var output = temp.innerHTML;
        temp = null;
        return output;
    },
    HTMLDecode: function (text) {
        var temp = document.createElement("div");
        temp.innerHTML = text;
        var output = temp.innerText || temp.textContent;
        temp = null;
        return output;
    },
    bindEv: function (el, type, fn) {
        var _useCapture = false;
        if (el.addEventListener) {
            el.addEventListener(type, fn, _useCapture);
        } else if (el.attachEvent) {
            el.attachEvent('on' + type, fn);
        }
    },
    unbindEv: function (el, type, fn) {
        var _useCapture = false;
        if (el.removeEventListener) {
            el.removeEventListener(type, fn, _useCapture);
        } else if (el.detachEvent) {
            el.detachEvent('on' + type, fn);
        }
    },
    getObjPos: function (el) {
        var p = JYSM.$(el);
        var _W = p.offsetWidth;
        var _H = p.offsetHeight;
        var _L = p.offsetLeft;
        var _T = p.offsetTop;
        while (p.offsetParent) {
            p = p.offsetParent;
            _L += p.offsetLeft;
            _T += p.offsetTop;
        }
        return { left: _L, top: _T, width: _W, height: _H };
    },
    getQ: function (name) {//获取URL参数
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return "0";
    },
    ajax:{//AJAX处理
        xmlhttp: function () {
            var xhr;
            if (typeof XMLHttpRequest !== 'undefined') {
                xhr = new XMLHttpRequest();
            } else {
                var v = [
                    "Microsoft.XmlHttp",
                    "MSXML2.XmlHttp.5.0",
                    "MSXML2.XmlHttp.4.0",
                    "MSXML2.XmlHttp.3.0",
                    "MSXML2.XmlHttp.2.0"
                ];
                for (var i = 0; i < v.length; i++) {
                    try {
                        xhr = new ActiveXObject(v[i]);
                        break;
                    } catch (e) { }
                }
            }

            return xhr;
        },
        ajaxPost: function (url, jsondata, callback) {
            JYSM.alert.loading("正在处理数据……");
            var xhr = JYSM_Util.ajax.xmlhttp();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        info = xhr.responseText;
                        //JYSM.alert.alertOK("<p style='text-align:center;font-size:16pt;color:#000;'>" + info + "</p>");
                        if (callback) {
                            callback(info);//回调
                        }
                        JYSM.alert.closeLoading();
                    } else {
                        JYSM.alert.alertOK("<p style='text-align:center;font-size:16pt;color:#000;'>加载失败...请联系管理员</p>");
                        //alert("ajax调用失败！" + xhr.status);
                        JYSM.alert.closeLoading();
                    }
                }
            }
            xhr.open("POST", url, false);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;"); //关键,否则出错
            xhr.send(jsondata);
        },
        ajaxGet: function (url,obj,paramStr, callback) {
            var xhr = JYSM_Util.ajax.xmlhttp();
            if (xhr) {
                if (obj) { $(obj).innerHTML = "Loading..."; }
                if(paramStr != "null") paramStr = JYSM.convert.strToBase64(paramStr);//进行base64传输
                xhr.open('GET', url + "&paramStr=" + paramStr + "&rnd=" + Math.random(), true);
                xhr.send(null);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            var strhtml = xhr.responseText;
                            if (callback) { callback(strhtml); }
                            //$(obj).innerHTML = strhtml;
                        } else {
                            JYSM.alert.alertOK("<p style='text-align:center;font-size:16pt;color:#000;'>加载失败...请联系管理员</p>");
                        }
                    } else {
                        //$(obj).innerHTML = "Loading...";
                    }
                }
            }
        },
    },
    addScriptInHead: function (url, fn) {
        var head = document.getElementsByTagName('head')[0] || (_QUIRKS ? document.body : document.documentElement),
            script = document.createElement('script');
        head.appendChild(script);
        //head.insertBefore(script, head.childNodes[2]);
        script.src = url;
        script.charset = 'utf-8';
        script.onload = script.onreadystatechange = function () {
            if (!this.readyState || this.readyState === 'loaded') {
                if (fn) {
                    fn();
                }
                script.onload = script.onreadystatechange = null;
                //head.removeChild(script);
            }
        };
    },
    addStyleCssTxtInHead: function (cssTxt) {
        var head = document.getElementsByTagName('head')[0] || (_QUIRKS ? document.body : document.documentElement),
            style = document.createElement('style');
        style.type = "text/css";
        style.innerHTML = cssTxt;
        head.appendChild(style);
        //head.insertBefore(style, head.childNodes[2]);
    },
    addScript: function (url,fn) {
        JYSM_Util.addScriptInHead(url,fn);
    },
    addStyleTxt: function (cssTxt) {
        JYSM_Util.addStyleCssTxtInHead(cssTxt);
    },
    style: {//对象样式处理
        hasClass: function (ele, cls) { return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)')); },
        addClass: function (el, cls) { if (!JYSM.style.hasClass(el, cls)) el.className += " " + cls; },
        removeClass: function (ele, cls) { var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)'); ele.className = ele.className.replace(reg, ' '); },
        changeClass: function (ele, oldCls, newCls) { JYSM.style.removeClass(ele, oldCls); JYSM.style.addClass(ele, newCls); },
        css: function (el, cssObj) {
            var self = el;
            extend(el.style, cssObj);
            //for (var c in cssObj) {
            //    el.style[c] = "" + cssObj[c];
            //}
            return el;
        }
    },
    Attr: {//设置或获取对象的属性值
        set: function (el, t, v) { el.setAttribute(t, v); },
        get: function (el, t) { return el.getAttribute(t); }
    },
    cookie: {//Cookie处理
        set: function (cName,cValue,h) {
            var str = cName + "=" + escape(cValue);
            if (h > 0) {//为0时不设定过期时间，浏览器关闭时cookie自动消失
                var date = new Date();
                var ms = h * 3600 * 1000;
                date.setTime(date.getTime() + ms);
                str += "; expires=" + date.toGMTString();
            }
            document.cookie = str;
        },
        get: function (cName) {
            var arrStr = document.cookie.split(";");
            for (var i = 0; i < arrStr.length; i++) {
                var temp = arrStr[i].split("=");
                //alert("获取cookie:"+unescape(temp));
                if (temp[0].trim() == cName) {
                    //alert("获取cookie成功:"+unescape(temp[1]));
                    return unescape(temp[1]);
                }
            }
        },
        del: function (cName) {
            var date = new Date();
            date.setTime(date.getTime() - 10000);
            document.cookie = cName + "=a; expires=" + date.toGMTString();
        }
    },
    convert: {
        strToBool: function (str) {
            switch (str.toUpperCase()) {
                case "TRUE":
                case "1":
                case "YES":
                    return true;
                case "FALSE":
                case "0":
                case "NO":
                case null:
                    return false;
                default:
                    return Boolean(str);
            }
        },
        strToInt: function (str) {
            try{
                return parseInt(str);
            }catch(e){
                return 0;
            }
        },
        strToBase64: function (str) { return base64_encode(str).replace(/\+/g, "%jlbios"); },

    },
    sltCheck: function (chkLstBox, bool) {
        var ctl = JYSM.$(chkLstBox); //根据控件的在客户端所呈现的ID获取控件 
        if (!ctl) return;
        var checkbox = ctl.getElementsByTagName('input'); //获取该控件内标签为input的控件
        for (var i = 0; i < checkbox.length; i++) {
            if (checkbox[i].type == 'checkbox') {
                if (!checkbox[i].disabled) {
                    checkbox[i].checked = bool;
                }
            }
        }
    },
    getChkLstValue: function (chkLstBox) {
        var ctl = JYSM.$(chkLstBox); //根据控件的在客户端所呈现的ID获取控件 
        if (!ctl) return;
        var result = "#0";
        var checkbox = ctl.getElementsByTagName('input'); //获取该控件内标签为input的控件
        for (var i = 0; i < checkbox.length; i++) {
            if (checkbox[i].type == 'checkbox') {
                if (!checkbox[i].disabled && checkbox[i].checked ==true) {
                    result += "," + checkbox[i].title;
                }
            }
        }
        result = result.replace(/#0,/g, "").replace(/#0/g, "");
        return result;
    },
    
    //上传
    UploadBind : function (uBtn,uStatus,uResult,imgView) {
        var oBtn = JYSM.$(uBtn);
        var oShow = JYSM.$(uResult);
        oShow.disabled = "";
        oShow.style.cursor = "pointer";
        oShow.title = "双击可清除。";
        oShow.onfocus = function () { this.blur();};
        oShow.ondblclick = function () {
            this.value = "";
        };
        var O_uStatus = JYSM.$(uStatus);
        new AjaxUpload(oBtn, {
            action: "../Upload/up.aspx",
            name: "upload",
            onSubmit: function (file, ext) {
                if (ext && /^(rar|zip|doc|docx|xls|xlsx|ppt|pptx|jpg|png|gif)$/.test(ext)) {
                    //ext是后缀名rar/zip/doc/xls/jpg
                    O_uStatus.innerHTML = "正在上传…";///Upload/Upload.aspx
                    oBtn.disabled = "disabled";
                } else {
                    O_uStatus.style.color = "#ff3300";
                    O_uStatus.innerHTML = "不支持格式！";
                    return false;
                }
            },
            onComplete: function (file, response) {
                oBtn.disabled = "";
                //oBtn.value = "";
                O_uStatus.innerHTML = "";
                oShow.value = response;

                if (imgView) {
                    //alert(imgView);
                    var oimgView = JYSM.$(imgView);
                    //alert(oimgView);
                }
                if (oimgView) {
                    oimgView.src = response;
                }
                // oUrl.value = response;
            }
        });
    }
};
JYSM = JY = JYSM_Util;
J = JYSM_Util.$;