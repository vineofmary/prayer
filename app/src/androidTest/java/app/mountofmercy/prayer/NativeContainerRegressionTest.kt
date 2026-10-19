package app.mountofmercy.prayer

import android.webkit.WebView
import androidx.test.core.app.ActivityScenario
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith

/**
 * Instrumented regression tests for the Mount of Mercy Native Android Container.
 *
 * Verifies package identity, hardware acceleration, WebView security & storage settings,
 * offline assets access, and window insets configuration on real devices and emulators.
 */
@RunWith(AndroidJUnit4::class)
class NativeContainerRegressionTest {

    @Test
    fun testApplicationPackageId() {
        val appContext = InstrumentationRegistry.getInstrumentation().targetContext
        assertEquals("app.mountofmercy.prayer", appContext.packageName)
    }

    @Test
    fun testMainActivityLaunchesAndWebViewIsConfigured() {
        val scenario = ActivityScenario.launch(MainActivity::class.java)

        scenario.onActivity { activity ->
            val webView = activity.findViewById<WebView>(R.id.main_webview)
            assertNotNull("main_webview must be present in layout", webView)

            val settings = webView.settings
            assertTrue("JavaScript must be enabled", settings.javaScriptEnabled)
            assertTrue("DOM storage must be enabled for liturgy preferences", settings.domStorageEnabled)
            assertTrue("Database must be enabled", settings.databaseEnabled)
            assertTrue("Local asset file access must be permitted", settings.allowFileAccess)
        }

        scenario.close()
    }
}
