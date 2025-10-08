package com.example.prayer // Or whatever your package name is

import android.os.Bundle
import android.webkit.WebView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val webView: WebView = findViewById(R.id.main_webview)

        // Enable JavaScript
        webView.settings.javaScriptEnabled = true

        // Allow file access
        webView.settings.allowFileAccess = true

        // Load your local index.html from the assets folder
        webView.loadUrl("file:///android_asset/index.html")
    }
}