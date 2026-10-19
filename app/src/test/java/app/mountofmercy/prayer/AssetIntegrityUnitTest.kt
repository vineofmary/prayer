package app.mountofmercy.prayer

import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File

/**
 * Unit regression tests to verify that all offline liturgical and scripture assets
 * are packaged and accessible before building the release APK or AAB.
 */
class AssetIntegrityUnitTest {

    private val assetsDir = File("src/main/assets")

    @Test
    fun testCoreHtmlAndManifestExist() {
        val indexHtml = File(assetsDir, "index.html")
        val manifest = File(assetsDir, "manifest.json")

        assertTrue("index.html must exist in assets", indexHtml.exists() && indexHtml.length() > 0)
        assertTrue("manifest.json must exist in assets", manifest.exists() && manifest.length() > 0)
    }

    @Test
    fun testLiturgicalScriptsExistAndNonEmpty() {
        val requiredScripts = listOf(
            "js/kidase.js",
            "js/prayers.js",
            "js/miracles_of_mary.js",
            "js/songs.js",
            "js/typical_psalms.js",
            "js/st_athanasius_psalms.js",
            "js/teklil.js",
            "js/script.js"
        )

        for (scriptPath in requiredScripts) {
            val scriptFile = File(assetsDir, scriptPath)
            assertTrue(
                "Required liturgy script $scriptPath must exist and be non-empty",
                scriptFile.exists() && scriptFile.length() > 100
            )
        }
    }

    @Test
    fun testSacredImagesExist() {
        val splashImage = File(assetsDir, "img/With-her-beloved-Son.png")
        assertTrue("Splash icon must exist", splashImage.exists() && splashImage.length() > 0)
    }
}
