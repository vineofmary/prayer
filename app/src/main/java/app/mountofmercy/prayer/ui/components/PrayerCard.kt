package app.mountofmercy.prayer.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.mountofmercy.prayer.data.model.PrayerItem
import app.mountofmercy.prayer.data.model.SpeakerRole
import app.mountofmercy.prayer.data.model.SupportedLanguage
import app.mountofmercy.prayer.ui.theme.*

@Composable
fun PrayerCard(
    item: PrayerItem,
    visibleLanguages: Set<SupportedLanguage>,
    fontSizeMultiplier: Float = 1.0f,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 12.dp, vertical = 6.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            // Speaker Badge & Rubric Indicator
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (item.role != SpeakerRole.GENERAL) {
                    SpeakerBadge(role = item.role)
                }

                if (!item.rubric.isNullOrBlank()) {
                    Text(
                        text = item.rubric,
                        color = RubricRed,
                        fontSize = (13 * fontSizeMultiplier).sp,
                        fontWeight = FontWeight.SemiBold,
                        fontFamily = FontFamily.Serif
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Multilingual Parallel Rows
            // 1. Ge'ez Text
            if (visibleLanguages.contains(SupportedLanguage.GEEZ) && !item.textGeez.isNullOrBlank()) {
                LanguageSection(
                    label = "ግዕዝ (Ge'ez)",
                    text = item.textGeez,
                    fontSizeMultiplier = fontSizeMultiplier,
                    isGeez = true,
                    textColor = MaterialTheme.colorScheme.onSurface
                )
            }

            // 2. English Text
            if (visibleLanguages.contains(SupportedLanguage.ENGLISH) && !item.textEnglish.isNullOrBlank()) {
                LanguageSection(
                    label = "English",
                    text = item.textEnglish,
                    fontSizeMultiplier = fontSizeMultiplier,
                    isGeez = false,
                    textColor = MaterialTheme.colorScheme.onSurface
                )
            }

            // 3. Amharic Text
            if (visibleLanguages.contains(SupportedLanguage.AMHARIC) && !item.textAmharic.isNullOrBlank()) {
                LanguageSection(
                    label = "አማርኛ (Amharic)",
                    text = item.textAmharic,
                    fontSizeMultiplier = fontSizeMultiplier,
                    isGeez = true,
                    textColor = MaterialTheme.colorScheme.onSurface
                )
            }

            // 4. Tigrinya Text
            if (visibleLanguages.contains(SupportedLanguage.TIGRINYA) && !item.textTigrinya.isNullOrBlank()) {
                LanguageSection(
                    label = "ትግርኛ (Tigrinya)",
                    text = item.textTigrinya,
                    fontSizeMultiplier = fontSizeMultiplier,
                    isGeez = true,
                    textColor = MaterialTheme.colorScheme.onSurface
                )
            }

            // 5. Puerto Rican Spanish Text
            if (visibleLanguages.contains(SupportedLanguage.SPANISH_PR) && !item.textSpanishPR.isNullOrBlank()) {
                LanguageSection(
                    label = "Español (PR)",
                    text = item.textSpanishPR,
                    fontSizeMultiplier = fontSizeMultiplier,
                    isGeez = false,
                    textColor = MaterialTheme.colorScheme.onSurface
                )
            }
        }
    }
}

@Composable
private fun SpeakerBadge(role: SpeakerRole) {
    val (color, title) = when (role) {
        SpeakerRole.PRIEST -> PriestColor to "Priest / ካህን"
        SpeakerRole.DEACON -> DeaconColor to "Deacon / ዲያቆን"
        SpeakerRole.PEOPLE -> PeopleColor to "People / ሕዝብ"
        SpeakerRole.READER -> ReaderColor to "Reader / አንባቢ"
        SpeakerRole.GENERAL -> Color(0xFF78350F) to "Rubric"
    }

    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(6.dp))
            .background(color.copy(alpha = 0.15f))
            .border(1.dp, color.copy(alpha = 0.4f), RoundedCornerShape(6.dp))
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Text(
            text = title,
            color = color,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold
        )
    }
}

@Composable
private fun LanguageSection(
    label: String,
    text: String,
    fontSizeMultiplier: Float,
    isGeez: Boolean,
    textColor: Color
) {
    Column(modifier = Modifier.padding(vertical = 4.dp)) {
        Text(
            text = label,
            fontSize = 11.sp,
            color = MaterialTheme.colorScheme.secondary,
            fontWeight = FontWeight.Medium
        )
        Text(
            text = text,
            fontSize = if (isGeez) (17 * fontSizeMultiplier).sp else (15 * fontSizeMultiplier).sp,
            lineHeight = if (isGeez) (26 * fontSizeMultiplier).sp else (22 * fontSizeMultiplier).sp,
            color = textColor,
            fontFamily = if (isGeez) FontFamily.Default else FontFamily.Serif
        )
    }
}
