
function _getHasTab() {
    var tabs = document.getElementsByTagName("*");
    var _tabObj = [];
    for (var i = 0; i < tabs.length; i++) {
        var hasG = JYSM.Attr.get(tabs[i], "tabgroud");
        if (hasG) {
            tabs[i].ground = hasG;//+"_"+i;
            tabs[i].b = JYSM.Attr.get(tabs[i], "tab_body");//+"_"+i;
            _tabObj.push(tabs[i]);
        }
    }
    return _tabObj;
}

function _getHasTabChild(obj) {
    var tabs = document.getElementsByTagName("*");
    //var _tabObj = [];
    for (var i = 0; i < tabs.length; i++) {
        var hasG = JYSM.Attr.get(tabs[i], "fortab");
        if (hasG) {
            //_tabObj.push(tabs[i]);
            if (hasG == obj.b) {
                tabs[i].style.display = "";
            } else {
                tabs[i].style.display = "none";
            }
        }
    }
  //  return _tabObj;
}

function _setTabAct(tObjs) {
    for (var i = 0; i < tObjs.length; i++) {
        JYSM.style.changeClass(tObjs[i], "formTab_a", "formTab");
    }
}

var JYSM_Tab = {};
JYSM_Tab = {
    crTab:function (tab){
        var tObjs = _getHasTab();
        if (tObjs.length > 0) {
            _getHasTabChild(tObjs[0]);//第一个显示
            for(var t in tObjs){
                if (tObjs[t].ground === tab) {
                    tObjs[t].onclick = function (e) {
                        var b = this.b;
                        _getHasTabChild(this);
                        _setTabAct(tObjs);
                        JYSM.style.changeClass(this, "formTab", "formTab_a");
                        //alert(tObjs.length);
                    }
                }
            }
        }
    }

}

JYSM.Tab = JYSM_Tab;