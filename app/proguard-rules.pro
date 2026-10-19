# ProGuard & R8 Release-Hardening Configuration for The Mount of Mercy
# Ensures zero obfuscation regressions for WebView, JavaScript bridge, and native Android container.

# 1. Preserve JavaScript Interface methods (for Web-to-Native bridging)
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# 2. Preserve WebViewClient and WebChromeClient callback methods
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String);
    public void *(android.webkit.WebView, android.webkit.WebResourceRequest, android.webkit.WebResourceError);
    public boolean *(android.webkit.WebView, android.webkit.WebResourceRequest);
}

-keepclassmembers class * extends android.webkit.WebChromeClient {
    public void *(android.webkit.WebView, int);
    public void *(android.webkit.WebView, java.lang.String);
}

# 3. Preserve AndroidX WindowInsets & InsetListeners (critical for status bar & display cutout padding)
-keep class androidx.core.view.ViewCompat { *; }
-keep class androidx.core.view.WindowInsetsCompat { *; }
-keep class androidx.core.view.WindowInsetsCompat$* { *; }

# 4. Preserve line numbers and source files for Google Play Console stack traces and Pre-Launch Reports
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# 5. Suppress harmless warnings for optional dependencies
-dontwarn android.webkit.**
-dontwarn androidx.webkit.**