# The Mount of Mercy (ደብረ ምሕረት) — Lightbuild Architecture & Play Store Guide

This guide provides a comprehensive overview of how **Lightbuild** (Google's declarative build system for Android, announced at [developer.android.com/tools/agents/lightbuild](https://developer.android.com/tools/agents/lightbuild)) is integrated into **The Mount of Mercy (ደብረ ምሕረት)**, how it powers agentic development directly from your smartphone, and the steps to publish to the Google Play Store.

---

## 1. What is Lightbuild and Why Use It?

Traditional Android projects rely on imperative Gradle scripts (`build.gradle.kts` / Groovy) which can be brittle for AI agents to edit and slow to sync.

**Lightbuild** is the official declarative build experience engineered specifically for:
1. **Agentic Workflows**: Configuration is defined in schema-validated YAML (`lightbuild.yaml` and `app/build.light.yaml`). AI agents in AI Studio and Android Studio can parse, add dependencies, adjust SDK targets, and update modules deterministically without breaking Groovy or Kotlin DSL scripts.
2. **Dual-Layer Transpilation**: Lightbuild serves as an abstraction layer that seamlessly transpiles into Gradle instructions. This means you get the clean, human-and-agent readable YAML while remaining 100% compatible with Android Studio, Gradle CLI, and GitHub Actions CI/CD.
3. **Optimized for Android CLI & Remote IDEs**: Lightbuild allows fast module inspection and configuration updates directly from lightweight environments, including web browsers on mobile phones.

---

## 2. Project Build Configuration Files

The project includes both Lightbuild declarative definitions and synchronized Gradle configuration:

- **`lightbuild.yaml` (Workspace Root)**:
  - Declares compileSdk 36, minSdk 24, targetSdk 36, JDK 17.
  - Specifies module path `app` and agent workflow capabilities (multilingual parallel script, phone screen touch optimization).
- **`app/build.light.yaml` (Application Module)**:
  - Application ID: `app.mountofmercy.prayer`
  - Jetpack Compose Material 3 build features enabled.
  - Declares all Jetpack Compose, Material Icons, Lifecycle, Navigation, and Serialization dependencies.
  - Configures release signing and ProGuard shrinking.
- **`build.gradle.kts` & `app/build.gradle.kts`**:
  - The transpiled Kotlin DSL files that Android Studio and CI runners use to execute compilation tasks.

---

## 3. Developing and Shipping Updates from Your Phone (AI Studio Workflow)

You can run your entire engineering cycle directly from your smartphone browser (Safari on iOS or Chrome on Android) without needing a PC or Android emulator:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        1. Prompt on Mobile                             │
│  "Add Saturday Kiddase readings" or "Adjust font size in dark mode"    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        2. Automated Engineering                        │
│  AI Studio updates Kotlin Compose code, Lightbuild YAML, and assets    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        3. Live Mobile Preview                          │
│  Tap 'Preview' in AI Studio — tests real mobile touch & font scaling   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       4. Push Directly to GitHub                       │
│  Prompt: "Push changes to feature/android-compose-playstore"           │
└────────────────────────────────────────────────────────────────────────┘
```

### Tips for Phone-Based Development:
- **Instant Touch Verification**: The AI Studio preview renders in your phone's browser, giving you real touch ergonomics (thumb reachability, tap targets >= 48dp, Ge'ez character legibility).
- **One-Tap Cache Busting**: The sidebar includes a `Check for Updates` button that purges the service worker cache on your device to ensure you are testing the freshest build.
- **Agentic Dependency Updates**: To add a new Android dependency from your phone, simply prompt: *"Add CameraX dependency to Lightbuild"*. The agent will update `app/build.light.yaml` and `libs.versions.toml` cleanly.

---

## 4. Google Play Store Release Steps

When you are ready to ship to the Google Play Store:

### Step 1: Review and Merge the Feature Branch
1. Navigate to your GitHub repository: `https://github.com/vineofmary/prayer`
2. Open Pull Request for branch `feature/android-compose-playstore`.
3. Review the native Jetpack Compose architecture, Lightbuild configuration, and multilingual prayer components.
4. Merge into `main` (or keep as release branch).

### Step 2: Generate Signed Android App Bundle (AAB)
In Android Studio or via CLI:
```bash
./gradlew bundleRelease
```
This produces:
`app/build/outputs/bundle/release/app-release.aab`

### Step 3: Google Play Console Submission
1. Log in to [Google Play Console](https://play.google.com/console).
2. Create app: **The Mount of Mercy (ደብረ ምሕረት)**.
3. Category: **Books & Reference** / **Lifestyle**.
4. Content rating: Complete questionnaire (select None for violence, etc. — All Ages).
5. Target Audience: Everyone (all ages).
6. Upload `app-release.aab`.
7. Fill in Store Listing:
   - **Short description**: Orthodox Tewahedo Prayer Book in Ge'ez, English, Amharic, Tigrinya, and Spanish.
   - **Full description**: Complete liturgical prayer book featuring the Divine Liturgy of the Apostles, Miracles of Mary, and Psalms of David with parallel multilingual display.
8. Submit to **Internal Testing** or **Production Track**.
