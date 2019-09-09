package com.jysmtech.jzy.gxjzyapp;

import android.Manifest;
import android.annotation.TargetApi;
import android.app.Activity;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.MediaRecorder;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.telephony.TelephonyManager;
import android.text.TextUtils;
import android.util.Log;
import android.webkit.CookieManager;
import android.webkit.CookieSyncManager;
import android.webkit.GeolocationPermissions;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.app.ActivityOptionsCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;


import com.king.zxing.Intents;
import com.king.zxing.util.CodeUtils;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import static com.jysmtech.jzy.gxjzyapp.photoUtils.cropImageUri;
import static com.jysmtech.jzy.gxjzyapp.photoUtils.getBitmapFormUri;
//import android.support.v4.content.FileProvider;


public class MainActivity extends AppCompatActivity {
    private WebView wb;
    private String imeiNo;

    private final static String TAG = "JYSM";
    private ValueCallback<Uri> mUploadMessage;
    private ValueCallback<Uri[]> mUploadCallbackAboveL;
    private final static int PHOTO_REQUEST = 100;
    private final static int VIDEO_REQUEST = 120;
    //private final static String url = "your_url";
    private boolean videoFlag = false;

    public static final int REQUEST_CODE_SCAN = 0X01;//扫码
    public static final int REQUEST_CODE_PHOTO = 0X02;//备用
    public static final int REQUEST_SLT_PHOTO = 0X03;//选择相片
    public static final int REQUEST_CAP_PHOTO = 0X04;//调用相机
    public static final int REQUEST_TEL_PHOTO = 0X05;//打电话
    public static final int REQUEST_CROP_PHOTO = 0X06;//裁剪图片
    public static final int REQUEST_CROP_SLT_PHOTO = 0X07;//选择相片裁剪图片
    public static final int REQUEST_DEV_CODE = 0X08;//设备ID
    public static final int REQUEST_TAKEVIDEO = 11;//打开录像

    public static final String KEY_IS_CONTINUOUS = "key_continuous_scan";
    private boolean isContinuousScan;
    public static final int RC_CAMERA = 0X01;

    private Uri imageUri;
    private Uri videoUri;
    public static File tempFile;
    //private MediaRecorder mediaRecorder;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        checkPermission();
        //testGetImei();//测试获取手机IMEI号码
        imeiNo = getIMEI_ID();
        wb = (WebView) findViewById(R.id.webview);
        WebSettings wbSet = wb.getSettings();
        wbSet.setJavaScriptEnabled(true); //允许JS
        wbSet.setAllowUniversalAccessFromFileURLs(true); //允许跨域
        wbSet.setAllowContentAccess(true);
        wbSet.setAllowFileAccess(true);
        wbSet.setDatabaseEnabled(true);
        wbSet.setUseWideViewPort(true);
        wbSet.setDomStorageEnabled(true);
        wbSet.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

//设置定位的数据库路径
        String dir = this.getApplicationContext().getDir("database", Context.MODE_PRIVATE).getPath();
        wbSet.setGeolocationDatabasePath(dir);
//启用地理定位
        wbSet.setGeolocationEnabled(true);

        //wbSet.setMediaPlaybackRequiresUserGesture(true);
        //wbSet.setJavaScriptCanOpenWindowsAutomatically(true);


        String url = getString(R.string.baseRemoveUrl);
        String localUrl = getString(R.string.baseLocalUrl) +"home.html";
        String Debugurl = getString(R.string.localDebugUrl);
        String releaseUrl = getString(R.string.releaseUrl);
        wb.loadUrl(releaseUrl);

        //wb.setWebChromeClient(new WebChromeClient());
        wb.setWebChromeClient(new Jysm_ChromeWebClient());
        wb.setWebViewClient(new MyWebViewClient());
        wb.addJavascriptInterface(new JysmJs(),"jysmApp_and");

    }

    public class Jysm_ChromeWebClient extends WebChromeClient {


        // 通知应用网页内容申请访问指定资源的权限(该权限未被授权或拒绝)
        @TargetApi(Build.VERSION_CODES.LOLLIPOP)
        public void onPermissionRequest(PermissionRequest request) {
            //request.deny();
            MainActivity.this.runOnUiThread(new Runnable(){
                    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
                    @Override
                    public void run() {
                        request.grant(request.getResources());
                    }// run
                });// MainActivity
           // request.grant(request.getResources());
        }

        public void onGeolocationPermissionsShowPrompt(String origin,
                                                       GeolocationPermissions.Callback callback) {
            callback.invoke(origin, true, false);
            super.onGeolocationPermissionsShowPrompt(origin, callback);
        }
    }
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        //Log.d("requestCode", String.valueOf(requestCode));
        if(resultCode == RESULT_OK){ // && data!=null
            switch (requestCode){
                case REQUEST_CODE_SCAN:
                    if(data!=null) {
                        String result = data.getStringExtra(Intents.Scan.RESULT);
                        //Toast.makeText(this,result,Toast.LENGTH_SHORT).show();
                        photoUtils.setPlatformType(wb, result, REQUEST_CODE_SCAN);
                    }
                    break;
                case REQUEST_CODE_PHOTO:
                    parsePhoto(data);
                    break;
                case REQUEST_SLT_PHOTO:
                    try {
                        if(data!=null) {
                            resultSltImg(data);
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    break;
                case REQUEST_CAP_PHOTO:
                    CROPPic(data);
                    break;
                case REQUEST_CROP_PHOTO:
                   // Log.d("imageUriPathgetData", imageUri.getPath());
                    resultCropImg(data,REQUEST_CAP_PHOTO);
                    break;//REQUEST_CROP_SLT_PHOTO
                case REQUEST_CROP_SLT_PHOTO:
                    // Log.d("imageUriPathgetData", imageUri.getPath());
                    resultCropImg(data,REQUEST_SLT_PHOTO);
                    break;
                case REQUEST_TEL_PHOTO:
                //    resultCam(data);
                    break;
                case REQUEST_TAKEVIDEO:
                    Log.d("video_path", videoUri.getPath());
                    Log.d("video_path==", mPhotoPath);
                    photoUtils.setPlatformType(wb, mPhotoPath, REQUEST_TAKEVIDEO);
                    //    resultCam(data);
                    break;
            }

        }
    }

    class JysmJs {
        @JavascriptInterface
        public void goAppCamera() {
            openCamera();
        }

        @JavascriptInterface
        public void goSltPhoto() {
            sltPhoto();
        }

        @JavascriptInterface
        public void goScanCode() {
            isContinuousScan = false;
            startScan();
        }
        @JavascriptInterface
        public void goTel(String phoneCode) {
            callPhone(phoneCode);
        }

        @JavascriptInterface
        public void goAppTakeVideo() {
            openVideoCamera();
        }

        @JavascriptInterface
        public void goDevID() {
            getDevCode();
        }
    }

    public void getDevCode(){
        String devID = getIMEI_ID();
        //showMessage("本机的 IMEI号码是："+devID);
       // photoUtils.setPlatformType(wb, devID, REQUEST_DEV_CODE);
       // photoUtils.setPlatformType(wb, devID,8);
        sendDevCode(devID);
    }
    public void sendDevCode(String devID){
        wb.post(new Runnable() {
            @Override
            public void run() {
                wb.loadUrl("javascript: jysmAppResult('" + devID +"',"+REQUEST_DEV_CODE+")");
            }
        });
    }

    String mPhotoPath;


    public void openCamera() {
        //獲取系統版本
        int currentapiVersion = android.os.Build.VERSION.SDK_INT;
        // 激活相机
        Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        // 判断存储卡是否可以用，可用进行存储
        if (hasSdcard()) {
            SimpleDateFormat timeStampFormat = new SimpleDateFormat("yyyy_MM_dd_HH_mm_ss");
            String filename = timeStampFormat.format(new Date());
            //filename = "jysm_user_take";
            tempFile = new File(Environment.getExternalStorageDirectory(),
                    filename + ".jpg");

            mPhotoPath = tempFile.getPath();
           // Log.d("sdcard", mPhotoPath);
            if (currentapiVersion < 24) {
                // 从文件中创建uri
                imageUri = Uri.fromFile(tempFile);
                intent.putExtra(MediaStore.EXTRA_OUTPUT, imageUri);
            } else {
                //兼容android7.0 使用共享文件的形式
                ContentValues contentValues = new ContentValues(1);
                contentValues.put(MediaStore.Images.Media.DATA, tempFile.getAbsolutePath());
                //检查是否有存储权限，以免崩溃
                if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                        != PackageManager.PERMISSION_GRANTED) {
                    //申请WRITE_EXTERNAL_STORAGE权限
                    Toast.makeText(this,"请开启存储权限",Toast.LENGTH_SHORT).show();
                    return;
                }
                imageUri = this.getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, contentValues);
                intent.putExtra(MediaStore.EXTRA_OUTPUT, imageUri);
            }
        }

        startActivityForResult(intent, REQUEST_CAP_PHOTO);
    }

    public void openVideoCamera() {
        //獲取系統版本
        int currentapiVersion = android.os.Build.VERSION.SDK_INT;
        // 激活相机
        Intent intent = new Intent(MediaStore.ACTION_VIDEO_CAPTURE);
        intent.putExtra(MediaStore.EXTRA_VIDEO_QUALITY, 1);
        intent.addCategory("android.intent.category.DEFAULT");
        //添加权限
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.putExtra(MediaStore.EXTRA_DURATION_LIMIT, 30);//限制录制时间(30秒=30)
        intent.putExtra(MediaStore.Video.Media.MIME_TYPE, "video/mp4");
        // 判断存储卡是否可以用，可用进行存储
        if (hasSdcard()) {
            SimpleDateFormat timeStampFormat = new SimpleDateFormat("yyyy_MM_dd_HH_mm_ss");
            String filename = "video_"+ timeStampFormat.format(new Date());
            //filename = "jysm_user_take";
            tempFile = new File(Environment.getExternalStorageDirectory(),
                    filename + ".mp4");

            mPhotoPath = tempFile.getPath();
            // Log.d("sdcard", mPhotoPath);
            if (currentapiVersion < 24) {
                // 从文件中创建uri
                videoUri = Uri.fromFile(tempFile);
                intent.putExtra(MediaStore.EXTRA_OUTPUT, videoUri);
            } else {
                //兼容android7.0 使用共享文件的形式
                ContentValues contentValues = new ContentValues(1);
                contentValues.put(MediaStore.Video.Media.DATA, tempFile.getAbsolutePath());
                //检查是否有存储权限，以免崩溃
                if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                        != PackageManager.PERMISSION_GRANTED) {
                    //申请WRITE_EXTERNAL_STORAGE权限
                    Toast.makeText(this,"请开启存储权限",Toast.LENGTH_SHORT).show();
                    return;
                }
                videoUri = this.getContentResolver().insert(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, contentValues);
                intent.putExtra(MediaStore.EXTRA_OUTPUT, videoUri);
            }
        }

        startActivityForResult(intent, REQUEST_TAKEVIDEO);
    }

    /*
     * 判断sdcard是否被挂载
     */
    public static boolean hasSdcard() {
        return Environment.getExternalStorageState().equals( Environment.MEDIA_MOUNTED);
    }



    private void sltPhoto() {
        Intent intent = new Intent(Intent.ACTION_PICK,
                MediaStore.Images.Media.INTERNAL_CONTENT_URI);
        startActivityForResult(intent, REQUEST_SLT_PHOTO);//REQUEST_SLT_PHOTO
    }
    private void callPhone(String phoneNo){
        if (ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED) {
            showMessage("没有打开电话权限哦");
            return;
        }
        if(jysmUtils.isPhoneNumber(phoneNo)==false){
            showMessage("电话号码有误！"+phoneNo);
            return;
        }
        Intent intent = new Intent();
        intent.setAction(Intent.ACTION_CALL);
        intent.setData(Uri.parse("tel:" + phoneNo));
        startActivity(intent);
    }
    private void resultCam(Intent intent) {

        //部分手机获取uri为空，则需要从bundle中获取Bitmap
        Uri uri = intent.getData();
        if(uri == null){
            Bundle bundle = intent.getExtras();
            if (bundle != null) {
                //Bitmap  bitmap = (Bitmap) bundle.get("data"); //get bitmap
                Bitmap bitmap1 = null;
                try {
                    bitmap1 = BitmapFactory.decodeStream(getContentResolver()
                            .openInputStream(imageUri));
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                }
                // Bitmap bitmap =Bitmap.createScaledBitmap(BitmapFactory.decodeFile(mPhotoPath), 600, 800, true);
                Bitmap compressBitmap = photoUtils.compressImage(bitmap1);//压缩图片最大不超过200kb
                //Log.d("it520", "bitmapToBase64被调了...");
                String str = photoUtils.bitmapToBase64(compressBitmap);//转base64
                photoUtils.setPlatformType(wb,str,REQUEST_CAP_PHOTO);
            }
        }else {
            //Bitmap bitmap = BitmapFactory.decodeFile(uri.getPath());
            Bitmap bitmap1 = null;
            try {
                bitmap1 = BitmapFactory.decodeStream(getContentResolver()
                        .openInputStream(imageUri));
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }
            //Bitmap bitmap = BitmapFactory.decodeStream(getContentResolver().openInputStream(imageUri));
            //Bitmap bitmap =Bitmap.createScaledBitmap(BitmapFactory.decodeFile(mPhotoPath), 600, 800, true);
            Bitmap compressBitmap = photoUtils.compressImage0(bitmap1);
            //Log.d("it520", "else中的bitmapToBase64被调了...");
            String str = photoUtils.bitmapToBase64(compressBitmap);
            photoUtils.setPlatformType(wb,str,REQUEST_CAP_PHOTO);

        }
    }

    private void resultCropImg(Intent intent,int requestCode){

        try {
            Bitmap bitmap = BitmapFactory.decodeStream(getContentResolver()
                    .openInputStream(imageUri));
            Bitmap bmp = getBitmapFormUri(this.getContext(),imageUri);
           // Log.d("jysm", "w="+bmp.getWidth() +" h=" + bmp.getHeight());
           // picture.setImageBitmap(bitmap);
           // Bitmap compressBitmap = photoUtils.compressImage0(bmp);
            //compressBitmap.getByteCount();
            //photoUtils.setPlatformType(wb, String.valueOf(bmp.getByteCount()),44);
            String str = photoUtils.bitmapToBase64(bmp);
            photoUtils.setPlatformType(wb,str,requestCode);//requestCode  REQUEST_CAP_PHOTO
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void resultCropSltImg(Uri imgUri){

        // Log.d("it520imageUriPath", imageUri.getPath());
        // Log.d("it520", "resultCropImg开始");
        // Log.d("imageUriPath_CROPPic", mPhotoPath);
        try {
            Bitmap bitmap = BitmapFactory.decodeStream(getContentResolver()
                    .openInputStream(imgUri));
            Bitmap bmp = getBitmapFormUri(this.getContext(),imgUri);
            Log.d("jysm", "w="+bmp.getWidth() +" h=" + bmp.getHeight());
            // picture.setImageBitmap(bitmap);
            // Bitmap compressBitmap = photoUtils.compressImage0(bmp);
            //compressBitmap.getByteCount();
            photoUtils.setPlatformType(wb, String.valueOf(bmp.getByteCount()),44);
            //Log.d("it520", "resultCropImg中的bitmapToBase64被调了...");
            String str = photoUtils.bitmapToBase64(bmp);
            //  Log.d("bitmapToBase64", str);
            photoUtils.setPlatformType(wb,str,REQUEST_SLT_PHOTO);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    private void resultSltImg(Intent intent) throws IOException {
        imageUri = intent.getData();

        cropImageUri(this,imageUri,imageUri,REQUEST_CROP_SLT_PHOTO);


    }


    private void CROPPic(Intent intenta){

        cropImageUri(this,imageUri,imageUri,REQUEST_CROP_PHOTO);
    }

    private void parsePhoto(Intent data){
        final String path = UriUtils.INSTANCE.getImagePath(this,data);
        //Log.d("Jenly","path:" + path);
        if(TextUtils.isEmpty(path)){
            return;
        }
        //异步解析
        asyncThread(new Runnable() {
            @Override
            public void run() {
                final String result = CodeUtils.parseCode(path);
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        //Log.d("Jenly","result:" + result);
                        Toast.makeText(getContext(),result,Toast.LENGTH_SHORT).show();
                    }
                });

            }
        });

    }

    private Context getContext(){
        return this;
    }

    private void asyncThread(Runnable runnable){
        new Thread(runnable).start();
    }

    class MyWebViewClient extends WebViewClient{
        @Override  //WebView代表是当前的WebView
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            String url = request.getUrl().toString();
            Uri uri = Uri.parse(url);
            String host = getResources().getString(R.string.hostname);
            String scheme = getResources().getString(R.string.schemeName);
            String m = uri.getQueryParameter("m"); //取参数

            //showMessage(uri.getHost().toString());
            //showMessage(uri.getScheme().toString());

            if(uri.getScheme().equals(scheme) &&uri.getHost().equals(host)){
                //在这里进行需要的跳转等
                //showMessage(m);
                //openCarcme();
                if(m.contains("scanqr")) {
                    showMessage("扫一扫");

                    isContinuousScan = false;
                    startScan();
                }else if(m.contains("photo")){
                    showMessage("拍照");
                    openCamera();
                }else if(m.contains("tel")){
                    String telcode = uri.getQueryParameter("telcode"); //取参数
                    showMessage("打电话给："+telcode);
                    callPhone(telcode);
                }else if(m.contains("devid")){
                    String devID = getIMEI_ID();
                    showMessage("机器码"+devID);
                    sendDevCode(devID);
                    //photoUtils.setPlatformType(wb,devID,8);
                }

                //com.king.zxing.camera.open.OpenCameraInterface.open(1);
                //showMessage("打开本地的activity");

                return true;
            }else {

                //表示在当前的WebView继续打开网页
                view.loadUrl(url);
                return true;
            }
        }

        @Override
        public void onPageStarted(WebView view, String url, Bitmap favicon) {
            super.onPageStarted(view, url, favicon);
            //Log.d("WebView","开始访问网页");
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            //Log.d("WebView","访问网页结束");
        }
    }

   // private Uri imageUri;
    public class MyChromeWebClient extends WebChromeClient {
        // For Android 3.0-
        public void openFileChooser(ValueCallback<Uri> uploadMsg) {
            Log.d(TAG, "openFileChoose(ValueCallback<Uri> uploadMsg)");
            mUploadMessage = uploadMsg;
            if (videoFlag) {
               // recordVideo();
            } else {
               // takePhoto();
            }

        }

        // For Android 3.0+
        public void openFileChooser(ValueCallback uploadMsg, String acceptType) {
            Log.d(TAG, "openFileChoose( ValueCallback uploadMsg, String acceptType )");
            mUploadMessage = uploadMsg;
            if (videoFlag) {
              //  recordVideo();
            } else {
              //  takePhoto();
            }
        }

        //For Android 4.1
        public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture) {
            Log.d(TAG, "openFileChoose(ValueCallback<Uri> uploadMsg, String acceptType, String capture)");
            mUploadMessage = uploadMsg;
            if (videoFlag) {
              //  recordVideo();
            } else {
              //  takePhoto();
            }
        }

        // For Android 5.0+
        public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
            Log.d(TAG, "onShowFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture)");
            mUploadCallbackAboveL = filePathCallback;
            if (videoFlag) {
               // recordVideo();
            } else {
               // takePhoto();
            }
            return true;
        }
    }


    private void showMessage(String msgInfo){
        Toast.makeText(getApplicationContext(), msgInfo, Toast.LENGTH_SHORT).show();
    }


    //第一次点击事件发生的时间
    private long mExitTime;


    @Override
    public void onBackPressed() {
        String currentURL = wb.getUrl().toString();
        int isLoginOrIndex = -1;

        isLoginOrIndex = currentURL.indexOf("login.html");
        if(isLoginOrIndex==-1) isLoginOrIndex = currentURL.indexOf("home.html");
        //MainForm
        if(isLoginOrIndex==-1) isLoginOrIndex = currentURL.indexOf("MainForm.html");
        if(isLoginOrIndex==-1) isLoginOrIndex = currentURL.indexOf("App.html");
        if(isLoginOrIndex==-1) isLoginOrIndex = currentURL.indexOf("app.html");

        if (wb.canGoBack() && isLoginOrIndex ==-1) {
            Toast.makeText(getApplicationContext(), currentURL, Toast.LENGTH_SHORT).show();
            wb.goBack();//返回上一页面
            return;
        } else {


            if (System.currentTimeMillis() - mExitTime > 2000) {
                Toast.makeText(getApplicationContext(), "再按一次退出程序", Toast.LENGTH_SHORT).show();
                mExitTime = System.currentTimeMillis();
            } else {
                finish();
                System.exit(0);
                android.os.Process.killProcess(android.os.Process.myPid());
            }
        }
    }

    private void checkPermission() {
        if (Build.VERSION.SDK_INT >= 23) {
            int checkCallPhonePermission = ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.CAMERA);
            if(checkCallPhonePermission != PackageManager.PERMISSION_GRANTED){
                ActivityCompat.requestPermissions(MainActivity.this,new String[]{Manifest.permission.CAMERA,Manifest.permission.VIBRATE},333);
                return;
            }else{

            }
        } else {

        }
    }

    private void startScan(){

        ActivityOptionsCompat optionsCompat = ActivityOptionsCompat.makeCustomAnimation(this,R.anim.in,R.anim.out);
        Intent intent = new Intent(this, scanQCode.class);
        //intent.putExtra(KEY_TITLE,title);
        intent.putExtra(KEY_IS_CONTINUOUS,isContinuousScan);
        ActivityCompat.startActivityForResult(this,
                intent,REQUEST_CODE_SCAN,
                optionsCompat.toBundle());
    }



    private void testGetImei(){

        Context mcontext = getApplicationContext();
        String imei = getIMEI_1(mcontext);
        showMessage("本机的 IMEI号码是："+imei);

    }
    private String getIMEI_ID(){
        Context mcontext = getApplicationContext();
        String imei = getIMEI_1(mcontext);
        return imei;
    }


    /**
     * 获取手机IMEI号
     */
    public static String getIMEI_1(Context context) {
        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {

            return "9999";
        }
        TelephonyManager telephonyManager = (TelephonyManager) context.getSystemService(context.TELEPHONY_SERVICE);
        String imei = telephonyManager.getDeviceId();

        return imei;
    }

    public void clearCache(){
        //清空所有Cookie
        CookieSyncManager.createInstance(getApplicationContext());  //Create a singleton CookieSyncManager within a context
        CookieManager cookieManager = CookieManager.getInstance(); // the singleton CookieManager instance
        cookieManager.removeAllCookie();// Removes all cookies.
        CookieSyncManager.getInstance().sync(); // forces sync manager to sync now
        MainActivity.this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                // TODO: 2018/3/8 清除webview缓存似乎没有用
                wb.setWebChromeClient(null);
                wb.setWebViewClient(null);
                wb.getSettings().setJavaScriptEnabled(false);
                wb.clearCache(true);//清除缓存

            }
        });
    }
/*
    @Override
    protected void onDestroy() {
        super.onDestroy();
        clearCache();
    }
    */

    @Override
    protected void onDestroy() {
        super.onDestroy();
        //清空所有Cookie
       // CookieSyncManager.createInstance(this.getContext());  //Create a singleton CookieSyncManager within a context
       // CookieManager cookieManager = CookieManager.getInstance(); // the singleton CookieManager instance
       // cookieManager.removeAllCookie();// Removes all cookies.
       // CookieSyncManager.getInstance().sync(); // forces sync manager to sync now

        wb.setWebChromeClient(null);
        wb.setWebViewClient(null);
        wb.getSettings().setJavaScriptEnabled(false);
        wb.clearCache(true);
    }

}
