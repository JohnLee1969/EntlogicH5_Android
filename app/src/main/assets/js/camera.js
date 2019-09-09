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
            video.srcObject = stream;// video.src = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(stream) : stream;
            //video.src = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(stream) : stream;
            //video.play();
            JYSM.alert.alertOK("<p style='text-align:center;font-size:16pt;color:#f00;'>打开相机！</p>");
        }, function (error) { JYSM.alert.alertOK("<p style='text-align:center;font-size:16pt;color:#f00;'>打开相机！0000---" + error + "</p>"); });
    } catch (err) {
        JYSM.alert.alertOK("<p style='text-align:center;font-size:16pt;color:#f00;'>打开相机！9999" + err + "</p>");
        console.log(err);
        // Tries it with old spec of string syntax
        navigator.getUserMedia('video', function (stream) {
            video.srcObject = stream;// video.src = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(stream) : stream;
        }, function (error) { JYSM.alert.alertOK("<p style='text-align:center;font-size:16pt;color:#f00;'>打开相机！1111" + error + "</p>"); });
    }

}