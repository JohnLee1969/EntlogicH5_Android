package com.jysmtech.jzy.gxjzyapp;

import android.Manifest;
import android.annotation.TargetApi;
import android.net.Uri;
import android.os.Build;
import android.util.Log;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;

import static android.content.ContentValues.TAG;

public class camera {


    public class JysmChromeWebClient extends WebChromeClient {
        // For Android 3.0-
        public void openFileChooser(ValueCallback<Uri> uploadMsg) {
            //Log.d(TAG, "openFileChoose(ValueCallback<Uri> uploadMsg)");
            ValueCallback<Uri> mUploadMessage = uploadMsg;


        }

        // For Android 3.0+
        public void openFileChooser(ValueCallback uploadMsg, String acceptType) {
            Log.d(TAG, "openFileChoose( ValueCallback uploadMsg, String acceptType )");
            ValueCallback mUploadMessage = uploadMsg;

        }

        //For Android 4.1
        public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture) {
            Log.d(TAG, "openFileChoose(ValueCallback<Uri> uploadMsg, String acceptType, String capture)");
            ValueCallback<Uri> mUploadMessage = uploadMsg;

        }

        // For Android 5.0+
        public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
            Log.d(TAG, "onShowFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture)");
            ValueCallback<Uri[]> mUploadCallbackAboveL = filePathCallback;

            return true;
        }
        // 通知应用网页内容申请访问指定资源的权限(该权限未被授权或拒绝)
        @TargetApi(Build.VERSION_CODES.LOLLIPOP)
        public void onPermissionRequest(PermissionRequest request) {
            request.deny();
        }
    }


    public class Jysm_ChromeWebClient extends WebChromeClient {


        // 通知应用网页内容申请访问指定资源的权限(该权限未被授权或拒绝)
        @TargetApi(Build.VERSION_CODES.LOLLIPOP)
        public void onPermissionRequest(PermissionRequest request) {
            request.deny();
        }
    }
}
