package app.mountofmercy.prayer

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.View
import android.webkit.ConsoleMessage
import android.webkit.MimeTypeMap
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import java.io.ByteArrayInputStream

/**
 * Main Android Activity for The Mount of Mercy (ደብረ ምሕረት).
 *
 * Hosts the full, authentic liturgical web application from local assets with 100% precision.
 * Preserves all prayers, Ge'ez, Amharic, Tigrinya, English, and Puerto Rican Spanish scriptures,
 * audio chants, rubrics, dark/traditional themes, presentation modes, and search.
 *
 * Correctly applies window insets to avoid overlapping with status bar, clock, battery indicator,
 * camera cutout, or system navigation bars.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    companion object {
        private const val ASSET_HOST = "appassets.androidplatform.net"
        private const val START_URL = "https://$ASSET_HOST/index.html"
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val rootLayout = findViewById<View>(R.id.root_layout)
        webView = findViewById(R.id.main_webview)

        // Handle edge-to-edge window insets: pad root layout so the header buttons
        // sit cleanly below the clock, battery, camera cutout, and status bar icons
        ViewCompat.setOnApplyWindowInsetsListener(rootLayout) { view, windowInsets ->
            val insets = windowInsets.getInsets(
                WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout()
            )
            view.setPadding(insets.left, insets.top, insets.right, insets.bottom)
            windowInsets
        }

        setupWebView()

        // Modern back-press handling: navigates web history or closes open UI drawers
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })

        // Enable Chrome DevTools inspection for debug builds
        if (0 != (applicationInfo.flags and android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE)) {
            WebView.setWebContentsDebuggingEnabled(true)
        }

        // Load the complete standalone web app from bundled assets via virtual HTTPS origin
        // so Fetch API, JSON bible loading, and localStorage work identically to web.
        webView.loadUrl(START_URL)
    }

    private fun resolveMimeType(path: String): String {
        val ext = path.substringAfterLast('.', "").lowercase()
        return when (ext) {
            "html", "htm" -> "text/html"
            "js", "mjs" -> "application/javascript"
            "css" -> "text/css"
            "json" -> "application/json"
            "svg" -> "image/svg+xml"
            "png" -> "image/png"
            "jpg", "jpeg" -> "image/jpeg"
            "webp" -> "image/webp"
            "gif" -> "image/gif"
            "ico" -> "image/x-icon"
            "ttf" -> "font/ttf"
            "otf" -> "font/otf"
            "woff" -> "font/woff"
            "woff2" -> "font/woff2"
            "mp3" -> "audio/mpeg"
            "wav" -> "audio/wav"
            "ogg" -> "audio/ogg"
            else -> MimeTypeMap.getSingleton().getMimeTypeFromExtension(ext) ?: "application/octet-stream"
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        val settings: WebSettings = webView.settings

        // Enable JavaScript and modern Web storage for liturgical settings and font preferences
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true

        // Allow loading local asset files and scripts
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        @Suppress("DEPRECATION")
        settings.allowFileAccessFromFileURLs = true
        @Suppress("DEPRECATION")
        settings.allowUniversalAccessFromFileURLs = true

        // Screen and viewport scaling
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true
        settings.builtInZoomControls = false
        settings.displayZoomControls = false

        // Audio recitation autoplay permissions
        settings.mediaPlaybackRequiresUserGesture = false

        // Cache configuration for fast offline startup
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        // Hardware acceleration
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null)

        // Serve bundled assets over virtual HTTPS origin and delegate external links
        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView?,
                request: WebResourceRequest?
            ): WebResourceResponse? {
                val uri = request?.url ?: return null
                if (uri.host != ASSET_HOST) {
                    return super.shouldInterceptRequest(view, request)
                }
                val rawPath = Uri.decode(uri.encodedPath ?: "").removePrefix("/")
                val assetPath = if (rawPath.isEmpty()) "index.html" else rawPath
                return try {
                    val inputStream = assets.open(assetPath)
                    val mimeType = resolveMimeType(assetPath)
                    val encoding = if (mimeType.startsWith("text/") || mimeType == "application/javascript" || mimeType == "application/json") "UTF-8" else null
                    WebResourceResponse(
                        mimeType,
                        encoding,
                        200,
                        "OK",
                        mapOf("Access-Control-Allow-Origin" to "*"),
                        inputStream
                    )
                } catch (e: Exception) {
                    Log.w("WebViewAssets", "Asset not found: $assetPath")
                    WebResourceResponse(
                        "text/plain",
                        "UTF-8",
                        404,
                        "Not Found",
                        mapOf("Access-Control-Allow-Origin" to "*"),
                        ByteArrayInputStream(ByteArray(0))
                    )
                }
            }

            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false
                if (
                    url.startsWith("https://$ASSET_HOST/") ||
                    url.startsWith("file:///android_asset/") ||
                    url.startsWith("http://localhost")
                ) {
                    return false
                }
                return try {
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                    startActivity(intent)
                    true
                } catch (e: Exception) {
                    false
                }
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
                consoleMessage?.let { msg ->
                    val formatted = "[${msg.sourceId()}:${msg.lineNumber()}] ${msg.message()}"
                    when (msg.messageLevel()) {
                        ConsoleMessage.MessageLevel.ERROR -> Log.e("WebViewConsole", formatted)
                        ConsoleMessage.MessageLevel.WARNING -> Log.w("WebViewConsole", formatted)
                        else -> Log.d("WebViewConsole", formatted)
                    }
                }
                return super.onConsoleMessage(consoleMessage)
            }
        }
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
    }

    override fun onPause() {
        webView.onPause()
        super.onPause()
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
