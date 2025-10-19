<div align="center">

_**TL;DR: A multi-language web app to aid Orthodox Christians in daily prayer; try it out [here](https://mount-of-mercy-974361367981.us-west1.run.app/).**_

> “Pray without ceasing” ፨ “ወጸልዩ ወትረ”
>
> (1 Thessalonians 5:17 ፨ ፩ ተሰሎንቄ ፭፡፲፯)

</div>

<hr/>

# 🙏 The Mount of Mercy | ደብረ ምሕረት

This web app is designed to aid Orthodox Christians and catachumens towards a life of unceasing prayer. It provides access to essential daily prayers in multiple languages, including Ge'ez, Amharic, Tigrinya, English, and Spanish with phonetic transliterations to assist in learning and pronunciation.

This spiritual service is made with love for the glory of God and is managed by servants of the Oakland Debre Meheret Saint Michael Ethiopian Orthodox Tewahedo Church (EOTC) under the auspices of His Grace Archbishop Theophilus in the EOTC Diocese of Northern California, Nevada, and Arizona.

## ⚠️ This is a Beta Version / Work-in-Progress!

This web app is currently in a **beta** stage and is very much a work-in-progress. We are continuously working to improve this spiritual service and appreciate your patience with any technical issues that may occur. Your feedback is invaluable to us! Please use the "Share Feedback" button within the app to let us know your thoughts, suggestions, or any bugs you encounter.

## 👉 How to Use this App?

### Trying it Out

You can try out the app directly in your web browser on your desktop or mobile device by visiting this temporary staging site: https://mount-of-mercy-974361367981.us-west1.run.app/

### Adding to Your Home Screen

For easy access and offline use, you can add this web page to your mobile home screen:

* **iOS (Safari):** Tap the "Share" icon and then select "Add to Home Screen".
* **Android (Chrome):** Tap the three-dots menu and select "Install App" or "Add to Home screen".

## 📖 A Note on Translations

The English translations provided are a work in progress, intended to be a more accurate improvement upon the few existing English resources. We have consulted several sources, including:

*   *ውዳሴ ማርያም Widasie Maryam | The Praises of St. Mary: In Ge’ez & English, 3rd Edition* translated by Living Tewahdo Ministry in March 2024
*   *Daily Prayers of the Ethiopian Orthodox Täwahedo Church, Revised Pocket Edition* translated by Archdeacon Täsfa Mika’el Williams in May 2020
*   *Book of Prayer - መጽሐፈ ጸሎት: Theotokia (Weddase Mariam) / Selected Psalms, Litanies and Prayers from the Ethiopic Book of the Hours, Missal, and other Liturgical Sources* translated by Father Mebratu Kiros (PhD) in 2022
*   *የዘወትር ጸሎት (The Daily Prayer)* published by ethiopianorthodox.org
*   *መሠረተ ግእዝ የግእዝ ንባብ መማሪያ መጽሐፍ ክፍል ፩ በሦስት ቋንቋዎች (The Foundation of Ge'ez: Ge'ez Reading Textbook, 1st Edition - In 3 languages)* translated by ሊቀ ጠበብት ተክሌ ሲራክ (Liqe Tebebt Tekle Sirak)


## ✨ Features

This app is built with modern web technologies to provide a rich and customizable user experience.

### Core Features:

* **Multi-Lingual Support:** Display prayers in Ge'ez, Amharic, Tigrinya, English, and Spanish.
* **Phonetic Transliteration:** Ge'ez, Amharic and Tigrinya phonetic scripts are available to aid in pronunciation and learning.
* **Customizable Display:**
    * **Themes:** Choose from Traditional, Sepia, Oceanic, and High-Contrast color palettes with both light and dark modes.
    * **Fonts:** Adjust font sizes for both Ethiopic and English scripts independently or lock them together. Select from multiple Ethiopic and English font families.
    * **Language Selection & Order:** Toggle which languages are visible and re-order them using a drag-and-drop interface.
    * **Layouts:** Switch between a card view, a column view, or a row view for displaying the prayer text.
* **Presentation Mode:** A full-screen "slides" mode for services or group prayer, with options for dynamic font sizing and slide transitions.
* **Progressive Web App (PWA):** Install the app on your mobile device or desktop for an app-like experience with offline access.
* **Search Functionality:** Search for specific words or phrases within the prayers.
* **Copy to Clipboard:** Easily copy and share prayers with others.

### Advanced Display Options:

* **Prayer & Speaker Labels:** Toggle the visibility of prayer references and speaker labels (e.g., "Priest", "People").
* **Rubrication:** Enable colored text for Holy Names (Beta feature).
* **Language Color-Coding:** Assign distinct colors to each language for easier reading.

## 💻 Technical Overview

The app is built using HTML, CSS, and vanilla JavaScript, with a focus on creating a responsive and performant user experience. It leverages modern browser features like the Web Animations API for smooth transitions and is configured as a Progressive Web App (PWA) with a service worker for offline functionality.

The prayer data is currently stored in a `prayers.js` file as a JavaScript array of objects, which allows for easy iteration and rendering. User settings are saved to the browser's `localStorage` to persist customizations across sessions.

## ✉️ Contact

For feedback, questions, or to contribute, please contact [vineofmary@gmail.com](mailto:vineofmary@gmail.com).

## 🚀 Future Plans & Possibilities

* **Backend & Data Management:** Transition from a local JavaScript file for prayers to a more robust backend solution, potentially using a database to allow for easier updates and additions.
* **Expanded Content:**
    * Add more prayers, including the Liturgy of the Hours (`Se'atat`), a selection of Psalms, and other services.
    * Introduce a side-by-side Bible viewer with English (NKJV), Amharic (አም54), and Spanish (RGV) versions.
* **Audio & App Store Version:**
    * Add exclusive features, like background instrumental Ethiopian harp music, to provide additional value and prepare for a potential App Store release.
* **Enhanced Customization & UI:**
    * Introduce preset modes for "Individual" vs. "Group" prayer.
    * Add a "Bold All Text" toggle for enhanced visibility, especially for presentations on large screens.
    * Implement an option to display *italicized*, Anglicized versions of names (e.g., *Iyesus*, *Maryam*, *Abba Giyorgis*) in the English text.
    * Provide customizable, accessibility-focused color palettes for color-coding languages.
    * Introduce different views for liturgical roles (e.g., "Deacon Mode," "Priest Mode").
* **Improved Navigation & Presentation:**
    * Enhance search functionality and provide more intuitive ways to navigate between prayers.
    * Allow users to jump directly into Slides Mode from any prayer in the main view and ensure the app returns to their previous position upon exiting.
* **PWA & Analytics:**
    * Implement a prompt to encourage users to install the web app and "Add to Home Screen."
    * Integrate analytics to track PWA installation events and usage across platforms.
* **Bug Fixes:**
    * Ensure Slides Mode and its dynamic font scaling are fully compatible with the Row Layout
    * Correct the `line-height` rendering for Ethiopic script in Slides Mode to allow for custom vertical spacing between lines.
    * Verify Slides Mode functionality on mobile devices when dynamic font sizing is disabled.

<hr/>

<div align="center">

> “I praise you seven times a day” ፨ “ስብዐ ለዕለትየ እሴብሐከ”
>
> Psalm 118:164 ፨ መዝሙር ዘዳዊት ፻፲፰፡፻፷፬

</div>
