var scrollTopPos = 600;//滚动多少显示返回顶部
var godiv;
var _doc = $("grd_p") || document;
window.onscroll = function () {
    //_onscroll();
}

_onscroll = function () {
    var t = _doc.scrollTop  || _doc.documentElement.scrollTop || _doc.body.scrollTop;

    alert(t);
    if (t >= scrollTopPos) {
        //$("nav").style.height = "120px";
        //alert(_doc.pageYOffset);
        if (godiv != null) {
            godiv.style.display = "block";
            return;
        }
        var _page = document;
        godiv = _page.createElement("div"); //
        godiv.id = "godiv";
        godiv.style.cssText = "cursor:pointer;color:#fff;filter:alpha(opacity=80);opacity:0.8;line-height:35px;width:43px;height:43px;text-align:center;border:0px solid #ccc;background:#000;position:fixed;bottom:10px;right:10px;z-index:1;";
        godiv.innerHTML = "<img src=\"images/gotop.png\" style=\"border:0px;width:43px;height:43px;\" alt=\"\">";
        godiv.title = "";
        godiv.onclick = function() {
            gotop();
        };
        godiv.onmouseover = function() {
        

        };
        _page.body.appendChild(godiv);
    }
    else {
        //$("nav").style.height = "220px";

        if (godiv != null) {
            godiv.style.display = "none";
            try { _page.body.removeChild(godiv); } catch (e) { }
        }

    }
}

gotop = function () {
    var t =  _doc  || _doc.documentElement || _doc.body;
    t.scrollTop = 0;
    scroll(0, 0);

}