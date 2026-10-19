package app.mountofmercy.prayer

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import app.mountofmercy.prayer.ui.MountOfMercyApp
import app.mountofmercy.prayer.ui.theme.MountOfMercyTheme

/**
 * Main Android Activity for The Mount of Mercy (ደብረ ምሕረት).
 * Native Jetpack Compose implementation built with the Lightbuild declarative build system.
 */
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MountOfMercyTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    MountOfMercyApp()
                }
            }
        }
    }
}
