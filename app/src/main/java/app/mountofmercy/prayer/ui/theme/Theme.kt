package app.mountofmercy.prayer.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = CrimsonPrimaryDark,
    onPrimary = TextLightPrimary,
    secondary = GoldAccent,
    onSecondary = NightBackground,
    background = NightBackground,
    onBackground = TextLightPrimary,
    surface = NightSurface,
    onSurface = TextLightPrimary,
    surfaceVariant = NightCard,
    onSurfaceVariant = TextLightSecondary
)

private val LightColorScheme = lightColorScheme(
    primary = CrimsonPrimary,
    onPrimary = ParchmentSurface,
    secondary = GoldSecondary,
    onSecondary = TextDarkPrimary,
    background = ParchmentBackground,
    onBackground = TextDarkPrimary,
    surface = ParchmentSurface,
    onSurface = TextDarkPrimary,
    surfaceVariant = ParchmentCard,
    onSurfaceVariant = TextDarkSecondary
)

@Composable
fun MountOfMercyTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window
            if (window != null) {
                window.statusBarColor = colorScheme.primary.toArgb()
                WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
            }
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
