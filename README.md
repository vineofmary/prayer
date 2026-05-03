<div align="center">

_**TL;DR: A multi-language web app to aid Orthodox Christians in daily prayer; try it out [here](https://mount-of-mercy-974361367981.us-west1.run.app/).**_

> “Pray without ceasing” ፨ “ወጸልዩ ወትረ”
>
> (1 Thessalonians 5:17 ፨ ፩ ተሰሎንቄ ፭፡፲፯)

</div>

<hr/>

# 🙏 The Mount of Mercy | ደብረ ምሕረት

This web app is designed to aid Orthodox Christians and catachumens towards a life of unceasing prayer. It provides access to essential daily prayers and the Divine Liturgy (Kidasé) in multiple languages, including Ge'ez, Amharic, Tigrinya, English, and Spanish with phonetic transliterations to assist in learning and pronunciation.

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
* **Divine Liturgy (Kidasé) Mode:** Access the Order of the Liturgy and selected Anaphoras (e.g., Anaphora of the Apostles). We are actively working on adding more Anaphoras and full translations in all supported languages.
* **Integrated Bible Support:** Full support for the Psalms and Songs of the Prophets in multiple versions, including Ge'ez (1954 ዓ፡ም), Amharic (1954 ዓ፡ም), English (NKJV), Spanish (RGV), and Coptic (Bohairic).
* **Phonetic Transliteration & Interactive Tooltips:** 
    * Ge'ez, Amharic, and Tigrinya phonetic scripts are available to aid in pronunciation and learning.
    * **Loanword Etymology:** Discover the origins and meanings of ancient loanwords (from Greek, Hebrew, Aramaic, Syriac etc.) directly within the liturgical text via interactive tooltips.
* **Rich Metadata & Historical Context:** 
    * **Eusebius Psalm Arrangement:** A detailed, multi-lingual modal (English, Ge'ez, Greek) explaining the ancient arrangement of the Psalter.
    * **St. Ephrem the Syrian:** A tabbed narrative modal exploring the story of St. Ephrem and the composition of the *Weddase Maryam*.
    * **Iconographic Citations:** Detailed metadata for sacred icons, including original manuscript sources, historical descriptions, and biblical references.
* **Customizable Display:**
    * **Themes:** Choose from Traditional, Sepia, Oceanic, and High-Contrast color palettes with both light and dark modes.
    * **Fonts:** Adjust font sizes for both Ethiopic and English scripts independently or lock them together. Select from multiple Ethiopic and English font families.
    * **Language Selection & Order:** Toggle which languages are visible and re-order them using a drag-and-drop interface.
    * **Layouts:** Switch between a card view, a column view, or a row view for displaying the prayer text.
    * **Language Color-Coding:** Assign distinct colors (Pastel, Vibrant, or Greyscale) to each language for easier reading.
* **Scribe's Chamber:** A secure backend interface (via Firebase) allowing authorized servants to edit prayer text, icon metadata, and references directly within the app.
* **Presentation Mode:** A full-screen "slides" or "scroll" mode for services or group prayer, with options for dynamic font sizing and slide transitions.
* **Progressive Web App (PWA):** Install the app on your mobile device or desktop for an app-like experience with offline access.
* **Search Functionality:** Robust search with navigation through matches across all displayed languages.
* **Copy to Clipboard:** Easily copy and share prayers or specific verses with others.

### Advanced Display Options:

* **Prayer & Speaker Labels:** Toggle the visibility of prayer references and speaker labels (e.g., "Leader", "Reader", "Priest", "People").
* **Rubrication & Anglicization:** 
    * **Colored Holy Names (Beta):** Enable traditional red-text rubrication for Holy Names.
    * **Anglicized Names (Beta):** Display italicized, Anglicized versions of names (e.g., *Iyesus*, *Maryam*) within English translations.
* **Paragraph Mode:** Toggle between verse-by-verse and paragraph layouts for single-language views.

## 💻 Technical Overview

The app is built using HTML, CSS, and vanilla JavaScript, focusing on a responsive and performant user experience. 

* **Backend:** Leverages **Firebase (Authentication and Firestore)** for the Scribe's Chamber, enabling real-time data updates and secure content management.
* **Data Storage:** Prayer data is managed via a combination of local JavaScript objects and remote Firestore collections. Bible data is stored in optimized JSON assets.
* **Performance:** Uses the Web Animations API for smooth UI transitions and a Service Worker for reliable offline functionality as a Progressive Web App (PWA).

## 🚀 Future Plans & Possibilities

* **Expanded Content:**
    * Continue adding more prayers. 
      * The Prayers of the Hours (e.g., The Praise of Mary) for all days of the week.
      * The Divine Liturgy (e.g., expanding to all 14 Anaphoras like Anaphora of Our Lady Mary, Anaphora of St. John Chrysostom, etc., with full language coverage).
    * Add a user-friendly prescription guide for the Psalms and Songs of the Prophets according to Saint Athanasius' "Letter to Marcellinus on the Interpretation of the Psalms." 
    * Implement a dedicated side-by-side Bible viewer for full book browsing.
    * Fix bugginess of the Scribe's Chamber so that surgical / typo fixes can be made by authorized scribes within the app.
* **Audio & Media:**
    * Improve branding, particularly the welcome splash screen and app icon/logo.
    * Add more sacred images from manuscripts with their respective metadata and citations.
    * Add background instrumental Ethiopian harp (Begena/Krar) music and professional audio recordings or pronounciations of select prayers.
* **Enhanced UI/UX:**
    * Introduce a new and intuitive home screen with options to enter the different sections of the app (e.g., `Kidasé`, `Se'atat`, Bible, Learn, etc). 
      * Improve the settings panel and customization experience so it's less overwhelming and long.
        * Consider utilizing collapsable panels on both the left and right side of the screens, similar to Coptic Reader.
      * For the new "Learn" section of the app, add Quizlet-style learning games and a Biblehub-style interlinear features to aid in learning the Ge'ez language.
    * Add an announcement feature which allows the user to quickly type and display a custom, full-screen announcement (e.g., "License Plate 1234567 MOVE YOUR CAR!")
    * Introduce preset modes for "Individual" vs. "Group" prayer.
    * Implement "Deacon Mode" and "Priest Mode" views for liturgical roles.
* **App Store Release:** Prepare for release on the Google Play Store and Apple App Store.
    * Add tests for accessibility and usability.

<hr/>

<div align="center">

> “I praise you seven times a day” ፨ “ስብዐ ለዕለትየ እሴብሐከ”
>
> Psalm 118:164 ፨ መዝሙር ዘዳዊት ፻፲፰፡፻፷፬

</div>
