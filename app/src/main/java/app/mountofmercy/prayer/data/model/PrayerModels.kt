package app.mountofmercy.prayer.data.model

import kotlinx.serialization.Serializable

/**
 * Liturgy speaker roles in Ethiopian Orthodox Tewahedo services.
 */
enum class SpeakerRole(val titleEnglish: String, val titleGeez: String, val colorHex: Long) {
    PRIEST("Priest", "ካህን", 0xFF8B0000),
    DEACON("Deacon", "ዲያቆን", 0xFF1E3A8A),
    PEOPLE("People", "ሕዝብ", 0xFF14532D),
    READER("Reader", "አንባቢ", 0xFF6D28D9),
    GENERAL("Rubric", "ሥርዓት", 0xFF78350F)
}

/**
 * Multilingual prayer and liturgy entry supporting Ge'ez, English, Amharic, Tigrinya, and Spanish (PR).
 */
@Serializable
data class PrayerItem(
    val id: String,
    val role: SpeakerRole = SpeakerRole.GENERAL,
    val rubric: String? = null,
    val textGeez: String? = null,
    val textAmharic: String? = null,
    val textTigrinya: String? = null,
    val textEnglish: String? = null,
    val textSpanishPR: String? = null,
    val notes: String? = null
)

/**
 * Liturgy section (e.g. Preparation, Liturgy of the Word, Anaphora of the Apostles).
 */
data class LiturgySection(
    val id: String,
    val titleEnglish: String,
    val titleGeez: String,
    val items: List<PrayerItem>
)

/**
 * Language options configured in Mount of Mercy.
 */
enum class SupportedLanguage(val code: String, val displayName: String, val nativeName: String) {
    GEEZ("gez", "Ge'ez", "ግዕዝ"),
    ENGLISH("en", "English", "English"),
    AMHARIC("am", "Amharic", "አማርኛ"),
    TIGRINYA("ti", "Tigrinya", "ትግርኛ"),
    SPANISH_PR("es_pr", "Spanish (Puerto Rico)", "Español (PR)")
}
