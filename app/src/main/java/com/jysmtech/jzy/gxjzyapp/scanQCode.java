package com.jysmtech.jzy.gxjzyapp;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import androidx.annotation.IdRes;
import androidx.appcompat.app.AppCompatActivity;

import androidx.fragment.app.Fragment;
import com.king.zxing.CaptureFragment;

public class scanQCode extends AppCompatActivity {

    private Button btn;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_scan_qcode);
        initView();
        replaceFragment(CaptureFragment.newInstance());
    }

    private void initView() {
        btn = findViewById(R.id.btncancel);//跳过
        btn.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v){
                //处理点击的代码
                finish();
            }
        });
    }

    public void replaceFragment(Fragment fragment){
        replaceFragment( R.id.fragmentContent,fragment);
    }
    public void replaceFragment(@IdRes int id, Fragment fragment) {
        getSupportFragmentManager().beginTransaction().replace(id, fragment).commit();
    }
}
