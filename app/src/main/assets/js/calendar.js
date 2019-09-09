//日历


var Class = {
    create: function () {
        return function () {
            this.initialize.apply(this, arguments);
        }
    }
}

var Extend = function (destination, source) {
    for (var property in source) {
        destination[property] = source[property];
    }
    return destination;
}


var Calendar = Class.create();
Calendar.prototype = {
    initialize: function(container, options) {
        this.Container = $(container); //容器(table结构)
        this.Days = []; //日期对象列表

        this.SetOptions(options);

        this.Year = this.options.Year || new Date().getFullYear();
        this.Month = this.options.Month || new Date().getMonth() + 1;
        this.Date = this.options.Date || new Date().getDate();
        this.Hours = this.options.Hours || new Date().getHours();
        this.Minutes = this.options.Minutes || new Date().getMinutes();
        this.Seconds = this.options.Seconds || new Date().getSeconds();
        this.SelectDay = this.options.SelectDay ? new Date(this.options.SelectDay) : null;
        this.onSelectDay = this.options.onSelectDay;
        this.onToday = this.options.onToday;
        this.onDayClick = this.options.onDayClick;
        this.onFinish = this.options.onFinish;
        this.FirstDay = this.options.FirstDay;

        this.Draw();
    },
    //设置默认属性
    SetOptions: function(options) {
        this.options = {//默认值
            Year: 0, //显示年
            Month: 0, //显示月
            Date: 0, //显示日
            Hours: 8, //显示时
            Minutes: 0, //显示分
            Seconds: 0, //显示秒
            SelectDay: null, //选择日期
            onSelectDay: function() { }, //在选择日期触发
            onDayClick: function() { }, //在选择日期触发
            onToday: function() { }, //在当天日期触发
            onFinish: function() { }, //日历画完后触发
            FirstDay: null //第一天
        };
        Extend(this.options, options || {});
    },
    //当前月
    NowMonth: function() {
        this.PreDraw(new Date());
    },
    //上一月
    PreMonth: function() {
        this.PreDraw(new Date(this.Year, this.Month - 2, 1));

    },
    //下一月
    NextMonth: function() {
        this.PreDraw(new Date(this.Year, this.Month, 1));
    },
    //上一年
    PreYear: function() {
        this.PreDraw(new Date(this.Year - 1, this.Month - 1, 1));
    },
    //下一年
    NextYear: function() {
        this.PreDraw(new Date(this.Year + 1, this.Month - 1, 1));
    },
    //根据日期画日历
    PreDraw: function(date) {
        //再设置属性
        this.Year = date.getFullYear(); this.Month = date.getMonth() + 1;
        this.SelectDay = new Date(this.Year, this.Month - 1, this.Date);
        //
        // GetVS_F_FILM_PQ_days_ByMonth(this.Year + "-" + this.Month + "-" + "1");
        //        $("DayFilm_DT").innerHTML = "";
        //        $("DayFilmList").innerHTML = "请选择日期...";
        //重新画日历
        this.Draw();
    },
    //画日历
    Draw: function() {
        //存放当月第一天
        FirstDay = new Date(this.Year, this.Month - 1, 1);
        //用来保存日期列表
        var arr = [];
        //用当月第一天在一周中的日期值作为当月离第一天的天数
        for (var i = 1, firstDay = new Date(this.Year, this.Month - 1, 1).getDay(); i <= firstDay; i++) { arr.push(0); }
        //用当月最后一天在一个月中的日期值作为当月的天数
        for (var i = 1, monthDay = new Date(this.Year, this.Month, 0).getDate(); i <= monthDay; i++) { arr.push(i); }
        //清空原来的日期对象列表
        this.Days = [];
        //插入日期
        var frag = document.createDocumentFragment();
        while (arr.length) {
            //每个星期插入一个tr
            var row = document.createElement("tr");
            //每个星期有7天
            for (var i = 1; i <= 7; i++) {
                var cell = document.createElement("td"); cell.innerHTML = "&nbsp;";
                if (arr.length) {
                    var d = arr.shift();
                    if (d) {
                        cell.innerHTML = d;
                        //                        cell.onmouseover = function () {
                        //                            this.className = "m";
                        //                        }
                        //                        cell.onmouseout = function () {
                        //                            this.className = "mo";
                        //                        }
                        cell.title = this.Year + "-" + format(this.Month) + "-" + format(d);
                        this.Days[d] = cell;
                        var on = new Date(this.Year, this.Month - 1, d);
                        //判断是否今日
                        this.IsSame(on, new Date()) && this.onToday(cell);
                        //判断是否选择日期this.IsSame(on, this.SelectDay) &&
                        this.SelectDay && this.IsSame(on, this.SelectDay) && this.onSelectDay(cell);

                        //                        cell.onclick = this.onDayClick;

                        cell.onclick = function() {
                            //alert(this.title);
                            dayClick(this); //onDayClick(this);
                        };
                    }
                }
                row.appendChild(cell);
            }
            frag.appendChild(row);
        }
        //先清空内容再插入(ie的table不能用innerHTML)
        while (this.Container.hasChildNodes()) { this.Container.removeChild(this.Container.firstChild); }
        this.Container.appendChild(frag);
        //附加程序
        this.onFinish();
    },
    //判断是否同一日
    IsSame: function(d1, d2) {
        return (d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate());
    }
}
///
format = function(v) {
    return v < 10 ? "0" + v : v;//统一输出的为两位月日等
}

closeSltDTLayer = function() {
    if ($("tmpSltMonthDIV") != null) document.body.removeChild($("tmpSltMonthDIV"));
    if ($("tmpSltYear") != null) document.body.removeChild($("tmpSltYear"));
    if ($("tmDiv") != null) document.body.removeChild($("tmDiv"));
    if ($("tmpSltHourDIV") != null) document.body.removeChild($("tmpSltHourDIV"));
    if ($("tmpSltMiDIV") != null) document.body.removeChild($("tmpSltMiDIV"));
    if ($("tmpSltSeDIV") != null) document.body.removeChild($("tmpSltSeDIV"));
    if ($("tmBgDiv") != null) document.body.removeChild($("tmBgDiv"));
}

function setDayTimeFormat(obj, tmFormat) {

    var _page = document;
    closeSltDTLayer();
//    if ($("tmpSltMonthDIV") != null) _page.body.removeChild($("tmpSltMonthDIV"));
//    if ($("tmpSltYear") != null) _page.body.removeChild($("tmpSltYear"));
//    if ($("tmDiv") != null) _page.body.removeChild($("tmDiv"));
//    if ($("tmBgDiv") != null) _page.body.removeChild($("tmBgDiv"));

    var _Obj = $(obj);
    if (!_Obj) {alert("系统参数有误,请与管理人员联系!");return;};
    var tmpTmStr = Trim(_Obj.value).length == 0 ? new Date().toLocaleDateString() : _Obj.value;
    if (!tmFormat) {tmFormat = "yyyy-MM-dd";};
    var fmt_M = tmFormat.match("MM") || tmFormat.match("M");
    if (!fmt_M) tmpTmStr += tmpTmStr.length < 5 ? "-01" : "";
    var fmt_d = tmFormat.match("dd") || tmFormat.match("d");
    if (!fmt_d) tmpTmStr += tmpTmStr.length < 10 ? "-01" : "";
    //alert(tmpTmStr.replace(/-|年|月|日/g, "/"));
    var _tm = new Date(Date.parse(tmpTmStr.replace(/-|年|月|日/g, "/")));
    

    var calCSS = "";
//    calCSS += "<style type=\"text/css\">";
//    calCSS += ".Calendar{font-family:Verdana;font-size:10pt;background-color:#e0ecf9;text-align:center;width:200px;height:auto;padding:10px;line-height:1.5em}";
//    calCSS += ".Calendar a{color:#1e5494}";
//    calCSS += ".Calendar table{width:100%;border:0}";
//    calCSS += ".Calendar table thead{color:#acacac;}";
//    calCSS += ".Calendar table td{font-size:10pt;padding:1px;background:#fff;cursor:pointer;height:20px;}";
//    calCSS += ".m{font-size:11px;padding:1px;background:#ccc;}";
//    calCSS += ".mo{font-size:11px;padding:1px;background:#fff;}";
//    calCSS += "#idCalendarPre{cursor:pointer;background-color:#e0ecf9;}";
//    calCSS += "#idCalendarNext{cursor:pointer;background-color:#e0ecf9;}";
//    calCSS += "#idCalendar td.onToday{font-weight:bold;color:#C60;background:#0ff;}"; //今天的颜色
//    calCSS += "#idCalendar td.onSelect{font-weight:bold;background:#ccc;}";
//    calCSS += "#idCalendarPreYear{cursor:pointer;background-color:#e0ecf9;}#idCalendarNextYear{cursor:pointer;background-color:#e0ecf9;}";
//    calCSS += "#idCalendarEmpty{cursor:pointer;background-color:#e0ecf9;border:1px solid #ccc;}";
//    calCSS += "#idCalendarNow{cursor:pointer;background-color:#e0ecf9;border:1px solid #ccc;}";
//    calCSS += "#idCalendarOK{cursor:pointer;background-color:#33CCFF;border:1px solid #ccc;float:right;}";
//    calCSS += "#sCalendarYear{cursor:pointer;background-color:#e0ecf9;}#sCalendarMonth{cursor:pointer;background-color:#e0ecf9;}";
//    calCSS += "";
//    calCSS += "</style>";
   

    var calBody = "";
    calBody += "<div class=\"Calendar\" onselectstart=\"return false\">";
    calBody += "  <table cellspacing=\"1\" cellpadding=\"2\" >";
    calBody += "      <tr><td id=\"idCalendarPreYear\" title=\"上一年\">&lt;&lt;</td><td id=\"idCalendarPre\" title=\"上一月\">&lt;</td>";
    calBody += "      <td id=\"sCalendarYear\" ><span id=\"idCalendarYear\" title=\"选择年份\"></span>年 </td><td id=\"sCalendarMonth\" ><span id=\"idCalendarMonth\" title=\"选择月份\"></span>月</td>";
    calBody += "      <td id=\"idCalendarNext\" title=\"下一月\">&gt;</td><td id=\"idCalendarNextYear\" title=\"下一年\">&gt;&gt;</td></tr>";
    calBody += "  </table>";
    calBody += "  <table cellspacing=\"1\" cellpadding=\"2\" id=\"caleDayBody\" >";
    calBody += "    <thead>";
    calBody += "      <tr><td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td></tr>";
    calBody += "    </thead>";
    calBody += "    <tbody id=\"idCalendar\"></tbody>";
    calBody += "  </table>";

    var fmtHas_H = tmFormat.match("HH") || tmFormat.match("H");
    if (fmtHas_H) {
        calBody += "  <table cellspacing=\"1\" cellpadding=\"2\" ><tr>";
        calBody += "      <td id=\"idTimeHour\">&nbsp;</td>";
        calBody += "      <td>时</td>";
        calBody += "      <td id=\"idTimeMinutes\">&nbsp;</td>";
        calBody += "      <td>分</td>";
        calBody += "      <td id=\"idTimeSeconds\">&nbsp;</td>";
        calBody += "      <td>秒</td>";
        calBody += "  </tr></table>";
    }

    calBody += "  <table cellspacing=\"1\" cellpadding=\"2\" ><tr>";
    calBody += "      <td><input id=\"idCalendarEmpty\" type=\"button\" value=\"置空\" /></td>";
    calBody += "      <td><input id=\"idCalendarNow\" type=\"button\" value=\"当前\" /></td>";
    calBody += "      <td><input id=\"idCalendarOK\" type=\"button\" value=\"确定\" /></td>";
    calBody += "  </tr></table>";
    calBody += "</div>";


    var tmBgDiv = _page.createElement("div");
    tmBgDiv.id = "tmBgDiv";
    tmBgDiv.title = "点击空白处取消日期时间选择...";
    tmBgDiv.style.cssText = "background:#fff;filter:Alpha(Opacity=20);opacity:0.2;background-color:#000000;width:" + (_page.documentElement.offsetWidth-0) + "px;height:" + (_page.documentElement.offsetHeight-0) + "px;left:0px;top:0px;display:block;";
    tmBgDiv.style.position = "absolute";
    tmBgDiv.style.zIndex = 999;
    _page.body.appendChild(tmBgDiv);

    var tmDiv = _page.createElement("div");
    tmDiv.id = "tmDiv";
    tmDiv.style.cssText = "width:auto;height:auto;text-align:left;border:2px solid #ccc;background:#fff;display:none;";
    tmDiv.style.position = "absolute";
    tmDiv.style.zIndex = 1000;
    tmDiv.className = "rad";

    tmDiv.innerHTML = calCSS + calBody;
    
    _page.body.appendChild(tmDiv);
    //是否显示日期
    $("caleDayBody").style.display = fmt_d != null ? "" : "none";
    $("idCalendarPre").style.display = fmt_M != null ? "" : "none";
    $("idCalendarNext").style.display = fmt_M != null ? "" : "none";
    $("sCalendarMonth").style.display = fmt_M != null ? "" : "none";
    //时分秒选择
        if (fmtHas_H) {

            if ($("idTimeHour")) $("idTimeHour").innerHTML = format(_tm.getHours());
            if ($("idTimeMinutes")) $("idTimeMinutes").innerHTML = format(_tm.getMinutes());
            if ($("idTimeSeconds")) $("idTimeSeconds").innerHTML = format(0);
        }




        document.onclick = function(event) //任意点击时关闭该控件	//ie6的情况可以由下面的切换焦点处理代替
        {
            if (!$("tmDiv")) return;

            var t = document.documentElement.scrollTop || document.body.scrollTop;
            with (window.event || event) {
                var _pos = getObjectPos($("tmDiv"));


                if ((clientX > (_pos.left + $("tmDiv").offsetWidth + 120) || clientX < (_pos.left - 50) || (clientY + t) > (_pos.top + $("tmDiv").offsetHeight + 240)) && _pos.left != 0)

                //if ((clientX > _pos.left + $("bgdiv").offsetWidth || clientX < _pos.left - $("bgdiv").offsetWidth || clientY > _pos.top + $("bgdiv").offsetHeight || clientY < _pos.top - 150) && _pos.left != 0) {
                // if (srcElement != _Obj )//&& srcElement != outButton
                    closeSltDTLayer();
                // }
                var _target = null; // target; //srcElement ||
                if (!document.all) {
                    _target = target;
                }
                else {
                    _target = srcElement;
                }
                //alert(_target);
                if (_target == $("tmBgDiv")) { closeSltDTLayer(); }

            }

        }



        var cale = new Calendar("idCalendar", {
            //SelectDay: new Date().setDate(10),
            onSelectDay: function(o) { o.className = "onSelect"; SelectDay = new Date(Date.parse(o.title.replace(/-/g, "/"))); },
            onToday: function(o) {
                o.className = "onToday";
                //LoadDayFilmList(o.title);//加载今天的电影
            },
            onDayClick: function(o) {
                alert(o.title);
                //        dayClick(o);
            },
            SelectDay: _tm,
            Year: _tm.getFullYear(),
            Month: _tm.getMonth() + 1,
            Hours: _tm.getHours(),
            Minutes: _tm.getMinutes(),
            Seconds: _tm.getSeconds(),

            onFinish: function() {
                $("idCalendarYear").innerHTML = this.Year;
                $("idCalendarMonth").innerHTML = this.Month;


                var _pos = getObjectPos(obj);
                tmDiv.style.left = _pos.left + "px";
                tmDiv.style.display = "block";
                var _clientH = document.documentElement.clientHeight - 6;
                if (_clientH - _pos.top > 250) {
                    tmDiv.style.top = _pos.top + _Obj.offsetHeight + 2 + "px";
                }
                else {
                    var t = $("grd_p").scrollTop || 0; //注意这里哦~~~
                    
                    tmDiv.style.top = _pos.top - tmDiv.offsetHeight - t + "px";
                    //alert(tmDiv.style.top);
                }

                //            if ($("idTimeHour")) $("idTimeHour").innerHTML = format(this.Hours);
                //            if ($("idTimeMinutes")) $("idTimeMinutes").innerHTML = format(this.Minutes);
                //            if ($("idTimeSeconds")) $("idTimeSeconds").innerHTML = format(0);

                $("idCalendarMonth").onclick = function() {//选择月份
                    if ($("tmpSltMonthDIV") != null) {
                        _page.body.removeChild($("tmpSltMonthDIV"));
                        return; //再点一次的时候关闭
                    }
                    if ($("tmpSltYear") != null) _page.body.removeChild($("tmpSltYear"));
                    if ($("tmpSltHourDIV") != null) _page.body.removeChild($("tmpSltHourDIV"));
                    if ($("tmpSltMiDIV") != null) _page.body.removeChild($("tmpSltMiDIV"));
                    if ($("tmpSltSeDIV") != null) _page.body.removeChild($("tmpSltSeDIV"));

                    var tmpSltMonth = _page.createElement("div");
                    tmpSltMonth.id = "tmpSltMonthDIV";
                    tmpSltMonth.style.cssText = "width:110px;height:auto;min-height:50px;background:#e0ecf9;border:1px solid #ccc;";
                    tmpSltMonth.style.position = "absolute";
                    tmpSltMonth.style.zIndex = 1001;
                    var _monPos = getObjectPos($("idCalendarMonth"));
                    tmpSltMonth.style.left = _monPos.left + "px";
                    tmpSltMonth.style.top = _monPos.top + $("idCalendarMonth").offsetHeight + 8 + "px";
                    _page.body.appendChild(tmpSltMonth);

                    for (var i = 1; i <= 12; i++) {
                        var tmpMonth = _page.createElement("div");
                        tmpMonth.id = "tmpMonth_" + i.toString();
                        tmpMonth.style.cssText = "width:45px;height:auto;background:#e0ecf9;margin:2px;padding:2px;cursor:pointer;text-align:center;float:left;";
                        tmpMonth.title = format(i);
                        tmpMonth.innerHTML = format(i) + "月";
                        tmpMonth.onclick = function() {
                            $("idCalendarMonth").innerHTML = this.title;
                            cale.Month = parseInt(this.title);
                            cale.SelectDay = new Date(cale.Year, cale.Month - 1, cale.Date);
                            if ($("tmpSltMonthDIV") != null) _page.body.removeChild($("tmpSltMonthDIV"));
                            cale.Draw(); TMSelectChanged();
                        };
                        tmpMonth.onmouseover = function() { this.style.background = "#fff"; };
                        tmpMonth.onmouseout = function() { this.style.background = "#e0ecf9"; };
                        tmpSltMonth.appendChild(tmpMonth);
                    }

                };

                $("idCalendarYear").onclick = function() {//选择年份
                    if ($("tmpSltYear") != null) {
                        _page.body.removeChild($("tmpSltYear"));
                        return; //再点一次的时候关闭
                    }
                    if ($("tmpSltMonthDIV") != null) _page.body.removeChild($("tmpSltMonthDIV"));
                    // if ($("tmpSltYear") != null) _page.body.removeChild($("tmpSltYear"));
                    if ($("tmpSltHourDIV") != null) _page.body.removeChild($("tmpSltHourDIV"));
                    if ($("tmpSltMiDIV") != null) _page.body.removeChild($("tmpSltMiDIV"));
                    if ($("tmpSltSeDIV") != null) _page.body.removeChild($("tmpSltSeDIV"));

                    var tmpSltMonth = _page.createElement("div");
                    tmpSltMonth.id = "tmpSltYear";
                    tmpSltMonth.style.cssText = "width:195px;height:200px;min-height:50px;background:#e0ecf9;border:1px solid #ccc;overflow:hidden; overflow-y:auto;";
                    tmpSltMonth.style.position = "absolute";
                    tmpSltMonth.style.zIndex = 1001;
                    var _monPos = getObjectPos($("idCalendarYear"));
                    tmpSltMonth.style.left = _monPos.left + "px";
                    tmpSltMonth.style.top = _monPos.top + $("idCalendarYear").offsetHeight + 8 + "px";
                    _page.body.appendChild(tmpSltMonth);
                    var nYear = $("idCalendarYear").innerHTML;

                    for (var i = parseInt(nYear) - 10; i <= parseInt(nYear) + 10; i++) {
                        if (i > new Date().getFullYear() + 2) break;
                        var tmpMonth = _page.createElement("div");
                        tmpMonth.id = "tmpSltYear_" + i.toString();
                        tmpMonth.style.cssText = "width:80px;height:auto;background:#e0ecf9;margin:2px;padding:2px;cursor:pointer;text-align:center;float:left;";
                        tmpMonth.title = format(i);
                        tmpMonth.innerHTML = format(i) + "年";
                        tmpMonth.onclick = function() {
                            $("idCalendarYear").innerHTML = this.title;
                            cale.Year = parseInt(this.title);
                            if ($("tmpSltYear") != null) _page.body.removeChild($("tmpSltYear"));
                            cale.SelectDay = new Date(cale.Year, cale.Month - 1, cale.Date);
                            cale.Draw(); TMSelectChanged();
                        };
                        tmpMonth.onmouseover = function() { this.style.background = "#fff"; };
                        tmpMonth.onmouseout = function() { this.style.background = "#e0ecf9"; };
                        tmpSltMonth.appendChild(tmpMonth);
                    }

                };
                if (fmtHas_H) {
                    $("idTimeHour").onclick = function() {//选择时
                        if ($("tmpSltHourDIV") != null) {
                            _page.body.removeChild($("tmpSltHourDIV"));
                            return; //再点一次的时候关闭
                        }
                        if ($("tmpSltMonthDIV") != null) _page.body.removeChild($("tmpSltMonthDIV"));
                        if ($("tmpSltYear") != null) _page.body.removeChild($("tmpSltYear"));
                        //if ($("tmpSltHourDIV") != null) _page.body.removeChild($("tmpSltHourDIV"));
                        if ($("tmpSltMiDIV") != null) _page.body.removeChild($("tmpSltMiDIV"));
                        if ($("tmpSltSeDIV") != null) _page.body.removeChild($("tmpSltSeDIV"));

                        var tmpSltMonth = _page.createElement("div");
                        tmpSltMonth.id = "tmpSltHourDIV";
                        tmpSltMonth.style.cssText = "width:160px;height:auto;min-height:50px;background:#e0ecf9;border:1px solid #ccc;";
                        tmpSltMonth.style.position = "absolute";
                        tmpSltMonth.style.zIndex = 1001;
                        _page.body.appendChild(tmpSltMonth);

                        for (var i = 0; i <= 23; i++) {
                            var tmpMonth = _page.createElement("div");
                            tmpMonth.id = "tmpMonth_" + i.toString();
                            tmpMonth.style.cssText = "width:45px;height:auto;background:#e0ecf9;margin:2px;padding:2px;cursor:pointer;text-align:center;float:left;";
                            tmpMonth.title = format(i);
                            tmpMonth.innerHTML = format(i) + "时";
                            tmpMonth.onclick = function() {
                                $("idTimeHour").innerHTML = this.title;
                                cale.Hours = parseInt(this.title);
                                cale.SelectDay = new Date(cale.Year, cale.Month - 1, cale.Date);
                                if ($("tmpSltHourDIV") != null) _page.body.removeChild($("tmpSltHourDIV"));
                                // cale.Draw();
                                TMSelectChanged();
                            };
                            tmpMonth.onmouseover = function() { this.style.background = "#fff"; };
                            tmpMonth.onmouseout = function() { this.style.background = "#e0ecf9"; };
                            tmpSltMonth.appendChild(tmpMonth);
                        }
                        var _monPos = getObjectPos($("idTimeHour"));
                        tmpSltMonth.style.left = _monPos.left + "px";
                        tmpSltMonth.style.top = _monPos.top - $("tmpSltHourDIV").offsetHeight - 1 + "px";

                    };

                    $("idTimeMinutes").onclick = function() {//选择分
                        if ($("tmpSltMiDIV") != null) {
                            _page.body.removeChild($("tmpSltMiDIV"));
                            return; //再点一次的时候关闭
                        }
                        if ($("tmpSltMonthDIV") != null) _page.body.removeChild($("tmpSltMonthDIV"));
                        if ($("tmpSltYear") != null) _page.body.removeChild($("tmpSltYear"));
                        if ($("tmpSltHourDIV") != null) _page.body.removeChild($("tmpSltHourDIV"));
                        //if ($("tmpSltMiDIV") != null) _page.body.removeChild($("tmpSltMiDIV"));
                        if ($("tmpSltSeDIV") != null) _page.body.removeChild($("tmpSltSeDIV"));

                        var tmpSltMonth = _page.createElement("div");
                        tmpSltMonth.id = "tmpSltMiDIV";
                        tmpSltMonth.style.cssText = "width:200px;height:200px;min-height:50px;background:#e0ecf9;border:1px solid #ccc;overflow:hidden; overflow-y:auto;";
                        tmpSltMonth.style.position = "absolute";
                        tmpSltMonth.style.zIndex = 1001;
                        _page.body.appendChild(tmpSltMonth);

                        for (var i = 0; i <= 59; i++) {
                            var tmpMonth = _page.createElement("div");
                            tmpMonth.id = "tmpMonth_" + i.toString();
                            tmpMonth.style.cssText = "width:40px;height:auto;background:#e0ecf9;margin:2px;padding:2px;cursor:pointer;text-align:center;float:left;";
                            tmpMonth.title = format(i);
                            tmpMonth.innerHTML = format(i) + "分";
                            tmpMonth.onclick = function() {
                                $("idTimeMinutes").innerHTML = this.title;
                                cale.Minutes = parseInt(this.title);
                                cale.SelectDay = new Date(cale.Year, cale.Month - 1, cale.Date);
                                if ($("tmpSltMiDIV") != null) _page.body.removeChild($("tmpSltMiDIV"));
                                // cale.Draw();
                                TMSelectChanged();
                            };
                            tmpMonth.onmouseover = function() { this.style.background = "#fff"; };
                            tmpMonth.onmouseout = function() { this.style.background = "#e0ecf9"; };
                            tmpSltMonth.appendChild(tmpMonth);
                        }
                        var _monPos = getObjectPos($("idTimeMinutes"));
                        tmpSltMonth.style.left = _monPos.left + "px";
                        tmpSltMonth.style.top = _monPos.top - $("tmpSltMiDIV").offsetHeight - 1 + "px";

                    };

                    $("idTimeSeconds").onclick = function() {//选择秒
                        if ($("tmpSltSeDIV") != null) {
                            _page.body.removeChild($("tmpSltSeDIV"));
                            return; //再点一次的时候关闭
                        }
                        if ($("tmpSltMonthDIV") != null) _page.body.removeChild($("tmpSltMonthDIV"));
                        if ($("tmpSltYear") != null) _page.body.removeChild($("tmpSltYear"));
                        if ($("tmpSltHourDIV") != null) _page.body.removeChild($("tmpSltHourDIV"));
                        if ($("tmpSltMiDIV") != null) _page.body.removeChild($("tmpSltMiDIV"));
                        //if ($("tmpSltSeDIV") != null) _page.body.removeChild($("tmpSltSeDIV"));

                        var tmpSltMonth = _page.createElement("div");
                        tmpSltMonth.id = "tmpSltSeDIV";
                        tmpSltMonth.style.cssText = "width:200px;height:200px;min-height:50px;background:#e0ecf9;border:1px solid #ccc;overflow:hidden; overflow-y:auto;";
                        tmpSltMonth.style.position = "absolute";
                        tmpSltMonth.style.zIndex = 1001;
                        _page.body.appendChild(tmpSltMonth);

                        for (var i = 0; i <= 59; i++) {
                            var tmpMonth = _page.createElement("div");
                            tmpMonth.id = "tmpMonth_" + i.toString();
                            tmpMonth.style.cssText = "width:40px;height:auto;background:#e0ecf9;margin:2px;padding:2px;cursor:pointer;text-align:center;float:left;";
                            tmpMonth.title = format(i);
                            tmpMonth.innerHTML = format(i) + "秒";
                            tmpMonth.onclick = function() {
                                $("idTimeSeconds").innerHTML = this.title;
                                cale.Seconds = parseInt(this.title);
                                cale.SelectDay = new Date(cale.Year, cale.Month - 1, cale.Date);
                                if ($("tmpSltSeDIV") != null) _page.body.removeChild($("tmpSltSeDIV"));
                                // cale.Draw();
                                TMSelectChanged();
                            };
                            tmpMonth.onmouseover = function() { this.style.background = "#fff"; };
                            tmpMonth.onmouseout = function() { this.style.background = "#e0ecf9"; };
                            tmpSltMonth.appendChild(tmpMonth);
                        }
                        var _monPos = getObjectPos($("idTimeSeconds"));
                        tmpSltMonth.style.left = _monPos.left + "px";
                        tmpSltMonth.style.top = _monPos.top - $("tmpSltSeDIV").offsetHeight - 1 + "px";

                    };
                }
            }
        });

    dayClick = function(o) {
        SetObjValueByDT(o.title);
        cale.SelectDay = new Date(Date.parse(o.title.replace(/-/g, "/")));
        
        closeSltDTLayer();

    }

    var TMSelectChanged = function() {
        SetObjValueByDT(cale.SelectDay.toLocaleDateString());
    }

    SetObjValueByDT = function(dt) {
        var fmt_y = tmFormat.match("yyyy");
        var fmt_M = tmFormat.match("MM") || tmFormat.match("M");
        var fmt_d = tmFormat.match("dd") || tmFormat.match("d");
        var fmt_H = tmFormat.match("HH") || tmFormat.match("H");
        var fmt_m = tmFormat.match("mm") || tmFormat.match("m");
        var fmt_s = tmFormat.match("ss") || tmFormat.match("s");
        var tmpResultTM = tmFormat;
        var sltTime = "";
        if (fmt_H) {
            if ($("idTimeHour")) sltTime += $("idTimeHour").innerHTML + ":";
            if ($("idTimeMinutes")) sltTime += $("idTimeMinutes").innerHTML + ":";
            if ($("idTimeSeconds")) sltTime += $("idTimeSeconds").innerHTML + "";
        }

        var tmpTM = new Date(Date.parse((Trim(dt) + " " + Trim(sltTime)).replace(/-|年|月|日/g, "/")));
        //alert((dt + " " + sltTime).replace(/-|年|月|日/g, "/"));
        if (fmt_y) tmpResultTM = tmpResultTM.replace(fmt_y, tmpTM.getFullYear());
        if (fmt_M) tmpResultTM = tmpResultTM.replace(fmt_M, format(tmpTM.getMonth() + 1));
        if (fmt_d) tmpResultTM = tmpResultTM.replace(fmt_d, format(tmpTM.getDate()));
        if (fmt_H) tmpResultTM = tmpResultTM.replace(fmt_H, format(tmpTM.getHours()) || new Date().getHours());
        if (fmt_m) tmpResultTM = tmpResultTM.replace(fmt_m, format(tmpTM.getMinutes()) || new Date().getMinutes());
        if (fmt_s) tmpResultTM = tmpResultTM.replace(fmt_s, format(tmpTM.getSeconds()) || new Date().getSeconds());

        $(obj).value = tmpResultTM;

    }

//    var closeSltDTLayer = function() {
//        if ($("tmpSltMonthDIV") != null) document.body.removeChild($("tmpSltMonthDIV"));
//        if ($("tmpSltYear") != null) document.body.removeChild($("tmpSltYear"));
//        if ($("tmDiv") != null) document.body.removeChild($("tmDiv"));
//        if ($("tmpSltHourDIV") != null) document.body.removeChild($("tmpSltHourDIV"));
//        if ($("tmpSltMiDIV") != null) document.body.removeChild($("tmpSltMiDIV"));
//        if ($("tmpSltSeDIV") != null) document.body.removeChild($("tmpSltSeDIV"));
//        if ($("tmBgDiv") != null) document.body.removeChild($("tmBgDiv"));
//    }

    $("idCalendarPre").onclick = function() { cale.PreMonth(); }
    $("idCalendarNext").onclick = function() { cale.NextMonth(); }

    $("idCalendarPreYear").onclick = function() { cale.PreYear(); }
    $("idCalendarNextYear").onclick = function() { cale.NextYear(); }
    $("idCalendarOK").onclick = function() { TMSelectChanged(); closeSltDTLayer(); }

    $("idCalendarNow").onclick = function() {
        //        cale.NowMonth();

        var fmt_y = tmFormat.match("yyyy");
        var fmt_M = tmFormat.match("MM") || tmFormat.match("M");
        var fmt_d = tmFormat.match("dd") || tmFormat.match("d");
        var fmt_H = tmFormat.match("HH") || tmFormat.match("H");
        var fmt_m = tmFormat.match("mm") || tmFormat.match("m");
        var fmt_s = tmFormat.match("ss") || tmFormat.match("s");
        var tmpResultTM = tmFormat;

        if (fmt_y) tmpResultTM = tmpResultTM.replace(fmt_y, new Date().getFullYear());
        if (fmt_M) tmpResultTM = tmpResultTM.replace(fmt_M, format(new Date().getMonth() + 1));
        if (fmt_d) tmpResultTM = tmpResultTM.replace(fmt_d, format(new Date().getDate()));
        if (fmt_H) tmpResultTM = tmpResultTM.replace(fmt_H, format(new Date().getHours()));
        if (fmt_m) tmpResultTM = tmpResultTM.replace(fmt_m, format(new Date().getMinutes()));
        if (fmt_s) tmpResultTM = tmpResultTM.replace(fmt_s, format(new Date().getSeconds()));

        $(obj).value = tmpResultTM;
        closeSltDTLayer();
    }

    $("idCalendarEmpty").onclick = function() {
        $(obj).value = "";
        closeSltDTLayer();
    }

}

//
var calCSS = "";
calCSS += "<style type=\"text/css\">";
calCSS += ".Calendar{font-family:Verdana;font-size:10pt;background-color:#e0ecf9;text-align:center;width:200px;height:auto;padding:10px;line-height:1.5em}";
calCSS += ".Calendar a{color:#1e5494}";
calCSS += ".Calendar table{width:100%;border:0}";
calCSS += ".Calendar table thead{color:#acacac;}";
calCSS += ".Calendar table td{font-size:10pt;padding:1px;background:#fff;cursor:pointer;height:20px;}";
calCSS += ".m{font-size:11px;padding:1px;background:#ccc;}";
calCSS += ".mo{font-size:11px;padding:1px;background:#fff;}";
calCSS += "#idCalendarPre{cursor:pointer;background-color:#e0ecf9;}";
calCSS += "#idCalendarNext{cursor:pointer;background-color:#e0ecf9;}";
calCSS += "#idCalendar td.onToday{font-weight:bold;color:#C60;background:#0ff;}"; //今天的颜色
calCSS += "#idCalendar td.onSelect{font-weight:bold;background:#ccc;}";
calCSS += "#idCalendarPreYear{cursor:pointer;background-color:#e0ecf9;}#idCalendarNextYear{cursor:pointer;background-color:#e0ecf9;}";
calCSS += "#idCalendarEmpty{cursor:pointer;background-color:#e0ecf9;border:1px solid #ccc;}";
calCSS += "#idCalendarNow{cursor:pointer;background-color:#e0ecf9;border:1px solid #ccc;}";
calCSS += "#idCalendarOK{cursor:pointer;background-color:#33CCFF;border:1px solid #ccc;float:right;}";
calCSS += "#sCalendarYear{cursor:pointer;background-color:#e0ecf9;}#sCalendarMonth{cursor:pointer;background-color:#e0ecf9;}";
calCSS += "";
calCSS += "</style>";
document.write(calCSS);
   