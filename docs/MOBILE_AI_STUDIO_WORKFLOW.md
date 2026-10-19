# Building and Shipping Updates from Your Phone via AI Studio

This guide explains how to use **Google AI Studio Build** from your smartphone browser (Safari on iOS or Chrome on Android) to request features, fix bugs, inspect live previews, and push updates to GitHub on the go.

---

## 1. Accessing AI Studio on Mobile

1. Open your mobile browser (Safari, Chrome, or Firefox) and navigate to:
   `https://aistudio.google.com/build`
2. Sign in with your authorized Google Account (`ammanasfaw34@gmail.com`).
3. Open your project **The Mount of Mercy | ደብረ ምሕረት**.

---

## 2. The Phone-Based Development Loop

```
┌────────────────────────────────────────────────────────────────────────┐
│                          1. Prompt on Mobile                           │
│  "Add Saturday Kiddase readings" or "Adjust font size in dark mode"    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        2. Automated Engineering                        │
│  AI Studio edits code, validates syntax, and compiles the web preview  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        3. Live Mobile Preview                          │
│  Tap the 'Preview' tab in AI Studio to test live on your phone screen  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       4. Push Directly to GitHub                       │
│  Review the changes and prompt: "Push changes to feature branch"       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Best Practices for Mobile Phone Iteration

- **Use the Web Applet Preview**: Because the preview runs in an embedded browser view in AI Studio, you see exact mobile touch ergonomics, font scaling, and color schemes without needing an Android emulator or tethered USB cable.
- **Incremental Commits on Feature Branches**: Keep your edits on a dedicated feature branch (`feature/...`). Only merge to `main` when verified.
- **Check for Updates Button**: The new `Check for Updates` button in the left sidebar forces service worker invalidation and purges cache storage so you always test against the freshest build.
- **GitHub PAT Authentication**:
  - Store your GitHub Personal Access Token in your phone's password manager.
  - When creating or pushing branches, supply a fine-grained token with `Contents: Read and write` permission.
