function OpenVideo(videoID) {
    var video = document.getElementById(videoID);
    window.URL = window.URL || window.webkitURL || window.msURL || window.oURL;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
                           || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (!navigator.getUserMedia) {
        //alert("您的浏览器不支持摄像头，建议使用Chrome浏览器或火狐FireFox浏览器。");
          JYSM.alert.alertOK("<p style='text-align:center;font-size:16pt;color:#f00;'>您的浏览器不支持摄像头，建议使用Chrome浏览器或火狐FireFox浏览器。！</p>");
        return;
    }

    try {
        // Tries it with spec syntax
        navigator.getUserMedia({ video: true }, function (stream) {
        //mozSrcObject
            video.mozSrcObject   =stream;// video.src = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(stream) : stream;
            //video.src = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(stream) : stream;
            //video.play();
          JYSM.alert.alertOK("<p style='text-align:center;font-size:16pt;color:#f00;'>打开相机！</p>");
        }, function (error) { JYSM.alert.alertOK("<p style='text-align:center;font-size:16pt;color:#f00;'>打开相机！0000"+error+"</p>"); });
    } catch (err) {
          JYSM.alert.alertOK("<p style='text-align:center;font-size:16pt;color:#f00;'>打开相机！9999"+err+"</p>");
        console.log(err);
        // Tries it with old spec of string syntax
        navigator.getUserMedia('video', function (stream) {
            video.srcObject  =stream;// video.src = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(stream) : stream;
        }, function (error) { JYSM.alert.alertOK("<p style='text-align:center;font-size:16pt;color:#f00;'>打开相机！1111"+error+"</p>"); });
    }

}
function successCB(stream) {

}

checkBrowser = function () {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
                           || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (!navigator.getUserMedia) {
        alert("您的浏览器不支持摄像头，建议使用Chrome浏览器或火狐FireFox浏览器。");
        return;
    }
}

function scamera(videoID,canvasID,_w,_h) {
    var videoElement = document.getElementById(videoID);
    var canvasObj =  document.getElementById(canvasID);
    canvasObj.width = _w ;
    canvasObj.height = _h ;
    var context1 = canvasObj.getContext('2d');
    context1.fillStyle = "#ffffff";
    context1.fillRect(0, 0, _w, _h);
    //  ctx.drawImage(img, 30, 30, 190, 180, 10, 10, 190, 180);
    context1.drawImage(videoElement, 200, 60, _w, _h, 0, 0, _w, _h);
    //alert("PaiZhaoSuccess");
}

function GetVideoData(videoID, _w, _h) {
    var videoElement = document.getElementById(videoID);
    var canvasObj = document.createElement("canvas");// document.getElementById(canvasID);
    canvasObj.width = _w;
    canvasObj.height = _h;
    //alert(canvasObj);
    var context1 = canvasObj.getContext('2d');
    context1.fillStyle = "#ffffff";
    context1.fillRect(0, 0, _w, _h);
    context1.drawImage(videoElement, 200, 60, _w, _h, 0, 0, _w, _h);
    //context1.drawImage(videoElement, 0, 0, _w, _h);
    var imgData = canvasObj.toDataURL();
    var b64 = imgData.substr(22);
    return b64;
}

function GetVideoDataOfCanvas() {
    //var videoElement = document.getElementById(videoID);
    var canvasObj = document.getElementById("canvas_Box");// document.getElementById(canvasID);
    //canvasObj.width = _w;
    //canvasObj.height = _h;
    ////alert(canvasObj);
    //var context1 = canvasObj.getContext('2d');
    //context1.fillStyle = "#ffffff";
    //context1.fillRect(0, 0, _w, _h);
    //context1.drawImage(videoElement, 200, 60, _w, _h, 0, 0, _w, _h);
    //context1.drawImage(videoElement, 0, 0, _w, _h);
    var imgData = canvasObj.toDataURL();
    var b64 = imgData.substr(22);
    return b64;
}

function GetBase64Data(canvasID) {
    var canvasObj = canvasID;// document.getElementById(canvasID);
    var imgData = canvasObj.toDataURL();
    var b64 = imgData.substr(22);
    return b64;
}

function createRequest() {
    try {
        request = new XMLHttpRequest();//For火狐，谷歌等浏览器
    }
    catch (tryMS) {
        try {
            request = new ActiveXObject("Msxm12.XMLHTTP");//For使用微软Msxm12.XMLHTTP库的浏览器
        }
        catch (otherMS) {
            try {
                request = new ActiveXObject("Microsoft.XMLHTTP");//For使用微软Microsoft.XMLHTTP库的浏览器
            }
            catch (failed) {
                request = null;
            }
        }
    }
    return request;
}
function uploadPhoto(videoID, _w, _h)//上传拍照的图片
{
    //showImgCode();
    request = createRequest();
    if (request == null) {
        alert("系统错误：Unable to create request");
    }
    else {
        //alert("request.OK");
        var stuno = $("txt_query").value;
        if (Trim(stuno) == "") {
            alert("请输入中考报名号信息。");
            $("txt_query").focus();
            return;
        }
        var base64Data = GetVideoDataOfCanvas().replace(/\+/g, "%2B"); //对参数中的+号编码，防止丢失
        var url = "UploadPic.aspx";
        request.open("POST", url, true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("&img=" + base64Data+"&stuno="+stuno);
        request.onreadystatechange = responses;
    }
}
function responses() {
    if (request.readyState == 4)//服务器处理结束
    {
        if (request.status == 200)//一切正常
        {
            if (request.responseText == "OK") {
                alert("上传成功！");
            }
            else {
                alert("上传失败！错误信息:" + request.responseText);

            }
        }
    }
    else {
        //msgObj.value = "正在上传...";
    }
}