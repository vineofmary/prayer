# Google Play Store Conversion Guide: Native Jetpack Compose Architecture

This guide details the step-by-step roadmap to convert **The Mount of Mercy (ደብረ ምሕረት)** from an asset WebView into a native Android app built with **Jetpack Compose (Kotlin)**, packaged as an Android App Bundle (`.aab`), and published on Google Play.

---

## 1. Architecture Overview

```
                      ┌────────────────────────────────────────┐
                      │             MainActivity               │
                      └──────────────────┬─────────────────────┘
                                         │
                                         ▼
                      ┌────────────────────────────────────────┐
                      │            NavigationHost              │
                      │  (Jetpack Navigation Compose Route)    │
                      └────┬───────────┬───────────┬───────────┘
                           │           │           │
            ┌──────────────┘           │           └──────────────┐
            ▼                          ▼                          ▼
┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐
│     LiturgyScreen     │  │     PrayersScreen     │  │    MiraclesScreen     │
│ (Ge'ez / Amharic /    │  │ (Daily Prayers,       │  │ (Search, Read,        │
│  Tigrinya / Spanish)  │  │  Melka Mariam, etc.)  │  │  Illuminated Cards)   │
└───────────┬───────────┘  └───────────┬───────────┘  └───────────┬───────────┘
            │                          │                          │
            └──────────────────────────┼──────────────────────────┘
                                       │
                                       ▼
                      ┌────────────────────────────────────────┐
                      │              ViewModels                │
                      │   (LiturgyViewModel, PrayerViewModel)  │
                      └──────────────────┬─────────────────────┘
                                         │
                                         ▼
                      ┌────────────────────────────────────────┐
                      │            Repository Layer            │
                      │  • AssetJsonDataSource (Offline JSON)  │
                      │  • RoomDatabase (User Preferences)     │
                      └────────────────────────────────────────┘
```

---

## 2. Dependencies Setup in `app/build.gradle.kts`

To enable native Jetpack Compose, update `app/build.gradle.kts`:

```kotlin
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.example.prayer"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.example.prayer"
        minSdk = 24
        targetSdk = 36
        versionCode = 85
        versionName = "0.8.5"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildFeatures {
        compose = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_21
        targetCompatibility = JavaVersion.VERSION_21
    }
    kotlinOptions {
        jvmTarget = "21"
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.10.01")
    implementation(composeBom)
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.navigation:navigation-compose:2.8.3")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.6")
    implementation("androidx.activity:activity-compose:1.9.3")

    // JSON parsing for offline assets
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")

    // Room Database for local state
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
}
```

---

## 3. Native Screen Implementations

### A. Manuscript Theme & Colors (`ui/theme/Theme.kt`)
```kotlin
val CrimsonDark = Color(0xFF8B1E1E)
val OchreGold = Color(0xFFC59B27)
val NightParchment = Color(0xFF121214)
val DayParchment = Color(0xFFFDFBF7)

val DarkColorScheme = darkColorScheme(
    primary = OchreGold,
    secondary = CrimsonDark,
    background = NightParchment,
    surface = Color(0xFF1A1A1E)
)
```

### B. Prayer Card with Rubrication (`ui/components/PrayerCard.kt`)
Use `AnnotatedString` in Compose to apply red rubrication highlighting to sacred names (እግዚአብሔር, ማርያም, ኢየሱስ ክርስቶስ) and priest/deacon speaker headers.

---

## 4. Google Play Console Publication Steps

1. **Generate Release Keystore**:
   ```bash
   keytool -genkey -v -keystore release.jks -alias mountofmercy -keyalg RSA -keysize 2048 -validity 10000
   ```
2. **Build Android App Bundle (`.aab`)**:
   ```bash
   ./gradlew bundleRelease
   ```
   The production bundle is generated at:
   `app/build/outputs/bundle/release/app-release.aab`

3. **Play Console Setup**:
   - Create new app in **Google Play Console** -> "The Mount of Mercy | ደብረ ምሕረት".
   - Set Default Language: English (US) / Amharic.
   - Complete App Content declarations (Content Rating: Everyone, Privacy Policy URL pointing to `https://mountofmercy.app`).
   - Create an Internal or Production track release and upload `app-release.aab`.
