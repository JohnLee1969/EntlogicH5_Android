var JYSM_Alert = {};
JYSM_Alert = {
    msgBox: function (title, msg) {
        alert(msg);
    },
    showForm: function (title, bodyHtml, formid, options) {
        this.options = options;
        var self = this;
        var _formid = formid || "formBgDiv";
        var width = document.documentElement.offsetWidth;
        var height = Math.max(document.body.clientHeight, document.documentElement.clientHeight);

        var t = document.documentElement.scrollTop || document.body.scrollTop;

        var editBgDiv = document.createElement("div"); //灰背景层 Math.max(document.body.clientHeight, document.documentElement.offsetHeight)
        editBgDiv.id = _formid;
        editBgDiv.style.cssText = "background:#EEE;filter:Alpha(Opacity=40);opacity:0.4;background-color:#EEE;";
        editBgDiv.style.cssText += "width:" + (width - 0) + "px;";
        editBgDiv.style.cssText += "height:" + height + "px;";
        editBgDiv.style.cssText += "left:0px;top:0px;display:block;";
        editBgDiv.style.position = "absolute";
        editBgDiv.style.zIndex = 811212;
        document.body.appendChild(editBgDiv);

        var editDiv = document.createElement("div");
        editDiv.id = "edt_" + _formid;
        editDiv.style.cssText = "width:auto;min-width:300px;height:auto;filter:Alpha(Opacity=10);opacity:0.1;max-height:" + (height - 2) + "px;min-height:100px;text-align:left;";
        editDiv.style.position = "fixed";
        //editDiv.className = "jy_dialog-body";
        JYSM.style.addClass(editDiv, "jy_dialog-body");
        editDiv.style.zIndex = 811213;
        if (this.options && this.options.css) {
            JYSM.style.css(editDiv, this.options.css);
        }
        //editDiv.style.display = "none";
        document.body.appendChild(editDiv);
        var _titleHtml = "<div class=\"jy-dialog-header\">&nbsp;&nbsp;" + title + ":</div>";
        var header = JYSM.toEle(_titleHtml);
        header.id = "edt_" + _formid + "_head";
        var w = editDiv.clientWidth;
        var h = editDiv.clientHeight;

        var docMouseMoveEvent = document.onmousemove;
        var docMouseUpEvent = document.onmouseup;
        JYSM.bindEv(header, "selectstart", function (e) { return (false) });
        JYSM.bindEv(editDiv, "selectstart", function (e) { return (false) });
        //header.onselectstart = function () { return (false) };
        //editDiv.onselectstart = function () { return (false) };
        function getEvent() {
            return window.event || arguments.callee.caller.arguments[0];
        }
        header.onmousedown = function () {
            var evt = getEvent();
            moveable = true;
            moveX = evt.clientX;
            moveY = evt.clientY;
            moveTop = parseInt(editDiv.style.top);
            moveLeft = parseInt(editDiv.style.left);

            document.onmousemove = function () {
                if (moveable) {
                    var evt = getEvent();
                    var x = moveLeft + evt.clientX - moveX;
                    var y = moveTop + evt.clientY - moveY;
                    if (x > 0 && (x + w < width) && y > 0 && (y + h < height)) {
                        editDiv.style.left = x + "px";
                        editDiv.style.top = y + "px";
                    }
                }
            };
            document.onmouseup = function () {
                if (moveable) {
                    document.onmousemove = docMouseMoveEvent;
                    document.onmouseup = docMouseUpEvent;
                    moveable = false;
                    moveX = 0;
                    moveY = 0;
                    moveTop = 0;
                    moveLeft = 0;
                }
            };
        }

        var btnClose_tmp = "<span class=\"jy-dialog-icon-close\" style=\"\" title=\"关闭\"></span>";
        var btnClose = JYSM.toEle(btnClose_tmp);
        btnClose.onclick = function (e) {
            JYSM_Alert.closeForm(formid);
        };
        header.appendChild(btnClose);
        editDiv.appendChild(header);
        var dobyPadding = this.options.css.padding || "10px";
        var _body_tmp = "<div style=\"padding:" + dobyPadding + ";min-height:80px;min-width:250px;\">";
        _body_tmp += "" + bodyHtml;
        _body_tmp += "</div>";
        var _body = JYSM.toEle(_body_tmp);
        JYSM.style.addClass(_body, "jy_dialog-msg-body");
        _body.id = "edt_" + _formid + "_body";
        if (this.options && this.options.bodycss) {
            JYSM.style.css(_body, this.options.bodycss);
        }
        editDiv.appendChild(_body);

        if (this.options) {
            if (this.options.yesBtn || this.options.noBtn) {
                var _foot_tmp = "<div class=\"jy-dialog-footer\" ></div>";
                var foot_tmp = JYSM.toEle(_foot_tmp);
                foot_tmp.id = "edt_" + _formid + "_footer";
                editDiv.appendChild(foot_tmp);
                if (this.options.yesBtn) {
                    var caption = self.options.yesBtn.caption || "确定";
                    var _yesBtn = "<input class=\"jy-button-common btn_post\" type=\"button\" value=\"" + caption + "\" />";
                    var yesBtn = JYSM.toEle(_yesBtn);
                    JYSM.bindEv(yesBtn, "click", function (e) {
                        if (self.options.yesBtn.fn) {
                            self.options.yesBtn.fn();
                        } else {
                            JYSM_Alert.closeForm(formid);//没有事件的时候默认是关闭事件
                        }
                    });
                    
                    foot_tmp.appendChild(yesBtn);
                }
                if (this.options.noBtn) {
                    var caption = self.options.noBtn.caption || "取消";
                    var _noBtn = "<input class=\"jy-button-common btn_back\" type=\"button\" value=\"" + caption + "\" />";
                    var noBtn = JYSM.toEle(_noBtn);
                    JYSM.bindEv(noBtn, "click", function (e) {
                        if (self.options.noBtn.fn) {
                            self.options.noBtn.fn();
                        } else {
                            JYSM_Alert.closeForm(formid);//没有事件的时候默认是关闭事件
                        }
                    });
                    foot_tmp.appendChild(noBtn);
                }
            }
            if (this.options.fullScrBtn) {//有全屏

                var btnFullBtn_tmp = "<span id=\"btn_full\" class=\"jy-dialog-icon-full\" style=\"float:right;\" title=\"全屏显示\"></span>";
                var FullBtn = JYSM.toEle(btnFullBtn_tmp);
                FullBtn.onclick = function (e) {
                    if (JYSM.Attr.get(this, "w") == null || JYSM.Attr.get(this, "w") == "") {
                        JYSM.Attr.set(this, "w", editDiv.clientWidth);
                        JYSM.Attr.set(this, "h", editDiv.clientHeight);
                        JYSM.Attr.set(this, "l", editDiv.style.left);
                        JYSM.Attr.set(this, "t", editDiv.style.top);
                        JYSM.Attr.set(this, "pid", editDiv.id);
                        JYSM.Attr.set(this, "class", "jy-dialog-icon-full_1");
                        _bodyid = "edt_" + formid + "_body";
                        //resizeBody(formid);
                        JYSM_Alert.fullScreen(formid);
                        this.title = "取消全屏显示";
                    } else {
                        editDiv.style.left = JYSM.Attr.get(this, "l");
                        editDiv.style.top = JYSM.Attr.get(this, "t");
                        JYSM.Attr.set(this, "class", "jy-dialog-icon-full");
                        JYSM_Alert.opacityOutObj(editDiv, JYSM.Attr.get(this, "w"), JYSM.Attr.get(this, "h"));
                        JYSM.Attr.set(this, "w", "");
                        this.title = "全屏显示";
                    }
                };
                header.appendChild(FullBtn);
            }
            if (this.options.frame) {
                var FrameHTML = "<iframe id='_frm_" + _formid + "' src='" + this.options.frame.url + "' scrolling='" + this.options.frame.scrType + "' marginheight='0' marginwidth='0' frameborder='0' style='height: 99%; width: 100%;'  ></iframe>";

                var _Framebody = JYSM.toEle(FrameHTML);
                _Framebody.options = this.options;
                _body.style.padding = "0";
                _body.appendChild(_Framebody);
                if (this.options.frame.iFrmData) {//主要是用于传递过来的窗口配置参数
                    _Framebody.onload = function (e) {
                        var iData = this.options.frame.iFrmData.data;
                        //var iDataObj = JYSM.$(this.options.frame.iFrmData.dataObj);
                        var iDataObj = this.contentDocument.getElementById(this.options.frame.iFrmData.dataObj);
                        JYSM.Attr.set(iDataObj, "value", iData);
                        if (this.options.frame.readyFunc) { this.options.frame.readyFunc(); };
                    };
                }
            }
        }


        editDiv.style.left = ((document.documentElement.offsetWidth - editDiv.offsetWidth) / 2) + "px";
        var scTop = t + (document.documentElement.clientHeight - editDiv.offsetHeight) / 2;
        var _top = scTop + 0;
        editDiv.style.top = _top + "px";

        var w = editDiv.clientWidth;
        var h = editDiv.clientHeight;
        editDiv.style.display = "";
        
        if (this.options && this.options.frame && this.options.frame.defFullScreen && this.options.frame.defFullScreen==true) {
            JYSM_Alert.fullScreen(formid);
                //_bodyid = "edt_" + formid + "_body";
                //JYSM.style.css(JYSM.$(_bodyid), { height: "92%", width: "100%",padding:"0px" });
                var btn_full = JYSM.$("btn_full");
                btn_full.style.display = "none";
                JYSM_Alert.resizeBody(formid);
                //JYSM.Attr.set(btn_full, "class", "jy-dialog-icon-full_1");//btn_full
                //JYSM.Attr.set(btn_full, "title", "");
            return;
        }
        JYSM_Alert.opacityOutObj(editDiv, w, h);

    },
    resizeBody : function (formid) {
        var _objDiv = JYSM.$("edt_" + formid + "");
        var _h = 0;
        var _objFoot = JYSM.$("edt_" + formid + "_footer");
        if (_objFoot) {
            _h += _objFoot.clientHeight;
        }
        var _objHead = JYSM.$("edt_" + formid + "_head");
        if (_objHead) {
            _h += _objHead.clientHeight;
        }
        var _objBody = JYSM.$("edt_" + formid + "_body");
        if (_objBody && _objDiv) {
            _objBody.style.height = _objDiv.clientHeight - _h + "px";
        }
    },
    alertForm: function (msg, formid,opt) {
        formid = formid || "msgbox";
        JYSM_Alert.showForm("提示", msg, formid, opt
            //,{
            //    yesBtn: {
            //        caption: "确定", fn: function () {
            //            window.location.href = "../index.html";
            //            //JYSM_Alert.alertForm("msgbox",formid+"_001");
            //        }
            //    }
            //    , noBtn: {}
            //    , fullScrBtn: {}
            //}
            );
    },
    alertOK: function (msg) {
        formid = "msgboxOK";
        JYSM_Alert.showForm("提示", msg, formid, {//filter:Alpha(Opacity=40);opacity:0.4;
            yesBtn: { caption: "确定" }, css: { width: "280px", height: "200px", filter: "Alpha(Opacity=90)", opacity: "0.9" }
            ,bodycss:{padding: "20px",overflow:"auto"}
        });
    },
    FrameForm: function (title,url,scrType) {
        formid = "iframeForm";
        JYSM_Alert.showForm(title, "", formid, {
            frame: { url: url, scrType: scrType || "yes",defFullScreen:false }, fullScrBtn: {}
            , css: { width: "100%", height: "300px",minWidth:"500px" }
        });
    },
    FrameFormWH: function (title, url, w,h) {
        formid = "iframeForm";
        JYSM_Alert.showForm(title, "", formid, {
            frame: { url: url, scrType: "auto", defFullScreen: false }, fullScrBtn: {}
            , css: { width: w + "px", height: h + "px", minWidth: "500px" }
            , bodycss: { padding: "0px" }
        });
    },
    FrameFormFull: function (title, url,ifrmData,func) {
        formid = "iframeForm";
        JYSM_Alert.showForm(title, "", formid, {
            frame: { url: url, scrType: "yes", defFullScreen: true, iFrmData: ifrmData,readyFunc:func }, fullScrBtn: {}
            , css: { minWidth: "500px", padding: "0px" }, yesBtn: { caption: "确定" }
            , bodycss: { padding: "0px" }
        });
    },
    alertOKOrNot: function (msg,okFn) {
        formid = "msgboxOK";
        var b = false;
        JYSM_Alert.showForm("提示", msg, formid, {
            yesBtn: {
                caption: "是", fn: function (e) {
                    b = true;
                    //JYSM.Attr.set(e, "val", true);
                    if (okFn) { okFn(); }
                    JYSM_Alert.closeForm(formid);
                }
            }
            , noBtn: { caption: "否" },
            css: { width: "250px", height: "180px", filter: "Alpha(Opacity=90)", opacity: "0.9" }
            , bodycss: { padding: "20px" }
        });
        return b;
    },
    closeForm: function (formid) {
        var _formid = formid || "formBgDiv";
        //JYSM.delObj(JYSM.$(_formid));
        //JYSM.delObj(JYSM.$("edt_" + _formid));
        var _body = JYSM.$("edt_" + _formid);
        var _body_bg = JYSM.$(_formid);

        JYSM_Alert.opacityInObj(_body, function () {
            JYSM.delObj(_body_bg);
        });
    },
    fullScreen: function (formid) {
        var _formid = formid || "formBgDiv";
        //JYSM.delObj(JYSM.$(_formid));
        //JYSM.delObj(JYSM.$("edt_" + _formid));
        var _body = JYSM.$("edt_" + _formid);
        var _body_bg = JYSM.$(_formid);
        if (_body) {
            var _boderW = 2;// 暂时无法直接获取，样式中修改了要注意修改这里哦。 _body.style.borderWidth;
            //alert(_boderW);

            _body.style.left = "0px";
            _body.style.top = "0px";
            JYSM_Alert.opacityOutObj(_body, _body_bg.clientWidth - _boderW, _body_bg.clientHeight + 0);
            //_body.style.width = _body_bg.clientWidth -12 + "px";
            //_body.style.height = _body_bg.clientHeight -2 + "px";
            //_body.style.left = "0px";
            //_body.style.top = "0px";
        }

    },
    zoomInObj: function (obj, callback) {//慢慢缩小
        var _obj = JYSM.$(obj);
        if (_obj == null) return;
        //_obj.innerHTML = "";
        var w = _obj.clientWidth;
        var h = _obj.clientHeight;
        _obj.style.minHeight = "";//去掉最小宽度和高度，不然缩小不了
        _obj.style.minWidth = "";

        var _h = h;
        var _w = w;
        _obj.style.width = _w + "px";
        _obj.style.height = _h + "px";
        var stepZoom = 50;
        if (w > 1000) {
            stepZoom = 150;
        }
        if (w > 2000) {
            stepZoom = 250;
        }
        var a=setInterval(
            function () {
                _h -= stepZoom;
                if (_h <= 10) { _h = 0;}
                _obj.style.height = _h + "px";//先高度再宽度
                if (_h <= 0) {
                    _w -= stepZoom;
                    if (_w <= 2) {
                        _w = 0;
                        JYSM.delObj(obj);
                        if (callback) { callback(); }
                        clearInterval(a);
                    }
                    _obj.style.height = 0 + "px";
                    _obj.style.width = _w + "px";
                }
        }, 1);

    },
    zoomOutObj: function (obj, w, h) {//慢慢放大
        var _obj = JYSM.$(obj);
        var _objBody = JYSM.$(_obj.id + "_body");
        if (_objBody) {
            _objBody.style.display = "none";
        }
        var _objFoot = JYSM.$(_obj.id + "_footer");
        if (_objFoot) {
            _objFoot.style.display = "none";
        }
        var _objHead = JYSM.$(_obj.id + "_head");
        if (_objHead) {
            _objHead.style.display = "none";
        }
        //var innerHtml = _obj.innerHTML;
        //_obj.innerHTML = "";
        //var w = _obj.clientWidth;
        //var h = _obj.clientHeight;
        var minHeight = _obj.style.minHeight;
        var minWidth = _obj.style.minWidth;

        _obj.style.minHeight = "";//去掉最小宽度和高度，不然缩小不了
        _obj.style.minWidth = "";

        var _h = 0;
        var _w = 0;
        _obj.style.width = _w + "px";
        _obj.style.height = _h + "px";
        var stepZoom = 50;
        if (w > 1000) {
            stepZoom = 150;
        }
        if (w > 2000) {
            stepZoom = 250;
        }
        var a = setInterval(
            function () {
                _h += stepZoom;
                if (_h >= h) { _h = h; }
                _obj.style.height = _h + "px";//先高度再宽度
                if (_h >= h) {
                    _w += stepZoom;
                    if (_w >= w) {
                        _w = w;
                        //JYSM.delObj(obj);
                        //if (callback) { callback(); }
                        _obj.style.height = h + "px";
                        _obj.style.width = w + "px";
                        _obj.style.minHeight = minHeight;
                        _obj.style.minWidth = minWidth;
                        if (_objFoot) {
                            _objFoot.style.display = "";
                        }
                        if (_objHead) {
                            _objHead.style.display = "";
                        }
                        if (_objBody) {
                            _objBody.style.display = "";
                        }
                        clearInterval(a);
                        JYSM_Alert.resizeBody(_obj.id.replace("edt_",""));
                    }
                    _obj.style.height = h + "px";
                    _obj.style.width = _w + "px";
                }
            }, 1);
    },
    opacityInObj: function (obj, callback) {//淡出 filter: "Alpha(Opacity=90)", opacity: "0.9" 
        var _obj = JYSM.$(obj);
        if (_obj == null) return;
        //_obj.innerHTML = "";

        var _f = 100;
        _obj.style.filter = "Alpha(Opacity=" + _f + ")";
        _obj.style.opacity = _f / 100;
        var stepZoom = 10;
        var a = setInterval(
            function () {
                _f -= stepZoom;
                _obj.style.filter = "Alpha(Opacity=" + _f + ")";
                _obj.style.opacity = _f / 100;
                if (_f <= 0) {
                    JYSM.delObj(obj);
                    if (callback) { callback(); }
                    clearInterval(a);
                }
            }, 20);

    },
    opacityOutObj: function (obj, w, h, callback) {//淡入 filter: "Alpha(Opacity=90)", opacity: "0.9" 
        var _obj = JYSM.$(obj);
        if (_obj == null) return;
        //_obj.innerHTML = "";
        _obj.style.height = h + "px";
        _obj.style.width = w + "px";

        var _f = 10;
        _obj.style.filter = "Alpha(Opacity=" + _f + ")";
        _obj.style.opacity = _f / 100;
        var stepZoom = 10;
        var a = setInterval(
            function () {
                _f += stepZoom;
                _obj.style.filter = "Alpha(Opacity=" + _f + ")";
                _obj.style.opacity = _f / 100;
                if (_f >= 100) {
                    JYSM_Alert.resizeBody(_obj.id.replace("edt_", ""));
                    //if (_objFoot) {
                    //    _objFoot.style.display = "";
                    //}
                    //if (_objHead) {
                    //    _objHead.style.display = "";
                    //}
                    //if (_objBody) {
                    //    _objBody.style.display = "";
                    //}
                    if (callback) { callback(); }
                    clearInterval(a);
                }
            }, 20);

    },
    loading: function (msgInfo) {
        var _tmp = "<div class=\"jy-dialog-loading\" >" + msgInfo + "</div>";
        var _tmp_loading = JYSM.toEle(_tmp);
        _tmp_loading.id = "loading";
        document.body.appendChild(_tmp_loading);
        _tmp = "<span class=\"jy-dialog-loading_close\" >关闭</span>";
        var _tmp_loadingCloseBtn = JYSM.toEle(_tmp);
        _tmp_loadingCloseBtn.onclick = function () {
            JYSM_Alert.closeLoading();
        };
        _tmp_loading.appendChild(_tmp_loadingCloseBtn);
    },
    closeLoading: function () {
        var _tmp_loading = JYSM.$("loading");
        if (_tmp_loading) {
            JYSM.delObj(_tmp_loading);
        }
        //setTimeout(function () {
        //    if (_tmp_loading) {
        //        JYSM.delObj(_tmp_loading);
        //    }
        //}, 3000);
    }

};
JYSM.alert = JY.alert = JYSM_Alert;
JYSM_Util.alert = JYSM_Alert;