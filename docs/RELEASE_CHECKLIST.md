# Mount of Mercy — Release Hardening & Play Store Checklist

This document provides a reproducible, step-by-step verification and release checklist for publishing **The Mount of Mercy (ደብረ ምሕረት)** to the Google Play Store.

---

## 1. Architectural Scope: Release Hardening vs. Liturgy Sync

| Domain | Changes Included | Impact |
| :--- | :--- | :--- |
| **Liturgy & Scripture Sync** | • Puerto Rican Spanish liturgical translation (`kidase.js`)<br>• LXX Psalms 114–115 mapping aligned with MT Psalm 116<br>• Daily Prayers, Anaphoras, and Hymns identical to `main` | Zero drift in sacred texts; cryptographic hashes pinned in `docs/liturgy_checksums.json`. |
| **Native Release Hardening** | • `MainActivity.kt` updated with modern `WebView` architecture<br>• `ViewCompat` dynamic WindowInsets handling for status bar & display cutout<br>• R8 / ProGuard rules configured in `proguard-rules.pro`<br>• Package namespace set to `app.mountofmercy.prayer`<br>• Target SDK 36 (Android 15+) compliance | 100% offline startup, full UI parity, zero overlap with clock/battery/cutout. |

---

## 2. Pre-Build Automated Integrity Verification

Run the automated dataset verification before building:
```bash
npm run verify:integrity
```
*Expected Output:*
```text
======================================================================
Mount of Mercy — Liturgy & Scripture Dataset Integrity Verification
======================================================================
✅ VERIFIED: app/src/main/assets/js/kidase.js (4,200,571 bytes)
...
SUCCESS: All 22 liturgical and scripture datasets verified identical to main.
```

---

## 3. Native Container Manual & Regression Checklist

Before promoting a build to open production, verify these items on a physical device (e.g. Pixel 9 Pro XL):

- [ ] **Offline Loading (Airplane Mode):** Turn on Airplane mode with Wi-Fi off. Launch the app. The app must load immediately from local assets with full prayers accessible.
- [ ] **Display Cutout & Status Bar Clearance:** Confirm that the top row buttons (`#sidebar-toggle`, search, presentation mode, layout toggle, dark mode, select prayers) sit cleanly below the system clock, battery indicator, and camera hole.
- [ ] **Back-Stack / Drawer Behavior:** Open the Settings drawer or Prayers drawer. Press the Android system back gesture. The drawer must slide closed without exiting the application.
- [ ] **Dynamic Text Sizing:** Adjust font size using the top bar `A- / A+` buttons. Text must scale smoothly across Ge'ez and Latin scripts.
- [ ] **Theme Switching:** Toggle between Dark and Light mode. Verify background, borders, and hareg ornaments remain high contrast.

---

## 4. Reproducible Release Bundle Generation (`bundleRelease`)

### Option A: Via Command Line
```bash
./gradlew bundleRelease
```
The output file will be generated at:
`app/build/outputs/bundle/release/app-release.aab`

### Option B: Via Android Studio GUI
1. Navigate to **Build** > **Generate Signed Bundle / APK...**
2. Choose **Android App Bundle (.aab)** and select **Next**.
3. Point to your release keystore (`.jks`), enter your credentials, and select the **release** variant.
4. Click **Create**.

---

## 5. Google Play Console Rollout Protocol

1. **Upload to Internal Testing Track:**
   * Do not release directly to Open Production.
   * Upload `app-release.aab` to **Testing > Internal testing**.
2. **Review the Google Pre-Launch Report:**
   * Google Play will automatically run the AAB across a test matrix of real physical devices (including Pixel devices, Samsung Galaxy, and tablets).
   * Check the **Pre-launch report** in Play Console for:
     * Stability (0 crashes)
     * Performance (startup time under 1.5s)
     * Accessibility & layout issues across varying screen aspect ratios
3. **Internal Device Validation:**
   * Install the internal build directly from the Play Store test link onto your Pixel 9 Pro XL.
4. **Promote to Production:**
   * Once internal testing and the pre-launch report pass with zero errors, click **Promote release > Production**.
