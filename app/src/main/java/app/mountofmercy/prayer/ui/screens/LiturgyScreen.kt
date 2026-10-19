package app.mountofmercy.prayer.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.mountofmercy.prayer.data.model.*
import app.mountofmercy.prayer.ui.components.LanguageFilterDialog
import app.mountofmercy.prayer.ui.components.PrayerCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LiturgyScreen(
    onOpenDrawer: () -> Unit,
    modifier: Modifier = Modifier
) {
    var visibleLanguages by remember {
        mutableStateOf(
            setOf(
                SupportedLanguage.GEEZ,
                SupportedLanguage.ENGLISH,
                SupportedLanguage.AMHARIC,
                SupportedLanguage.SPANISH_PR
            )
        )
    }
    var fontSizeMultiplier by remember { mutableStateOf(1.0f) }
    var showLanguageDialog by remember { mutableStateOf(false) }

    // Curated initial liturgical prayers from the Liturgy of the Apostles
    val samplePrayers = remember {
        listOf(
            PrayerItem(
                id = "kidase_intro",
                role = SpeakerRole.PRIEST,
                rubric = "ሥርዓተ ቅዳሴ (The Order of the Liturgy)",
                textGeez = "አሐዱ አብ ቅዱስ፥ አሐዱ ወልድ ቅዱስ፥ አሐዱ ውእቱ መንፈስ ቅዱስ።",
                textEnglish = "One is the Holy Father, one is the Holy Son, one is the Holy Spirit.",
                textAmharic = "አንዱ አብ ቅዱስ ነው፤ አንዱ ወልድ ቅዱስ ነው፤ አንዱ መንፈስ ቅዱስም ቅዱስ ነው።",
                textTigrinya = "ሓደ ኣብ ቅዱስ እዩ፡ ሓደ ወልድ ቅዱስ እዩ፡ ሓደ መንፈስ ቅዱስ ቅዱስ እዩ።",
                textSpanishPR = "Uno es el Padre Santo, uno es el Hijo Santo, uno es el Espíritu Santo."
            ),
            PrayerItem(
                id = "kidase_people_response",
                role = SpeakerRole.PEOPLE,
                rubric = "ሕዝብ ይበሉ (People respond)",
                textGeez = "በእማን አብ ቅዱስ፥ በእማን ወልድ ቅዱስ፥ በእማን ውእቱ መንፈስ ቅዱስ።",
                textEnglish = "Truly the Father is holy, truly the Son is holy, truly the Holy Spirit is holy.",
                textAmharic = "በእውነት አብ ቅዱስ ነው፤ በእውነት ወልድ ቅዱስ ነው፤ በእውነት መንፈስ ቅዱስም ቅዱስ ነው።",
                textTigrinya = "ብሓቂ ኣብ ቅዱስ እዩ፡ ብሓቂ ወልድ ቅዱስ እዩ፡ ብሓቂ መንፈስ ቅዱስ ቅዱስ እዩ።",
                textSpanishPR = "Verdaderamente el Padre es santo, verdaderamente el Hijo es santo, verdaderamente el Espíritu Santo es santo."
            ),
            PrayerItem(
                id = "kidase_deacon_admonition",
                role = SpeakerRole.DEACON,
                rubric = "ዲያቆን ይበል (Deacon chants)",
                textGeez = "ተንሥኡ ለጸሎት።",
                textEnglish = "Stand up for prayer.",
                textAmharic = "ለጸሎት ተነሡ።",
                textTigrinya = "ንጸሎት ተንስኡ።",
                textSpanishPR = "Poneos en pie para la oración."
            ),
            PrayerItem(
                id = "kidase_people_kyrie",
                role = SpeakerRole.PEOPLE,
                rubric = "ሕዝብ (People)",
                textGeez = "እግዚኦ ተሣሃለነ።",
                textEnglish = "Lord have mercy upon us.",
                textAmharic = "አቤቱ ማረን።",
                textTigrinya = "ኦ ጐይታ መሓረና።",
                textSpanishPR = "Señor, ten piedad de nosotros."
            ),
            PrayerItem(
                id = "kidase_priest_blessing",
                role = SpeakerRole.PRIEST,
                rubric = "ካህን (Priest)",
                textGeez = "ሰላም ለኵልክሙ።",
                textEnglish = "Peace be unto you all.",
                textAmharic = "ሰላም ለሁላችሁ ይሁን።",
                textTigrinya = "ሰላም ንዅልኻትኩም ይኹን።",
                textSpanishPR = "La paz sea con todos ustedes."
            ),
            PrayerItem(
                id = "kidase_people_spirit",
                role = SpeakerRole.PEOPLE,
                rubric = "ሕዝብ (People)",
                textGeez = "ምስለ መንፈስከ።",
                textEnglish = "And with thy spirit.",
                textAmharic = "ከመንፈስህ ጋር።",
                textTigrinya = "ምስ መንፈስካ።",
                textSpanishPR = "Y con tu espíritu."
            )
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "The Mount of Mercy",
                            style = MaterialTheme.typography.titleLarge
                        )
                        Text(
                            text = "ደብረ ምሕረት • Liturgy of the Apostles",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.secondary
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onOpenDrawer) {
                        Icon(imageVector = Icons.Default.Menu, contentDescription = "Menu")
                    }
                },
                actions = {
                    // Font scaling buttons
                    IconButton(onClick = { if (fontSizeMultiplier > 0.8f) fontSizeMultiplier -= 0.1f }) {
                        Icon(imageVector = Icons.Default.TextDecrease, contentDescription = "Decrease font size")
                    }
                    IconButton(onClick = { if (fontSizeMultiplier < 1.6f) fontSizeMultiplier += 0.1f }) {
                        Icon(imageVector = Icons.Default.TextIncrease, contentDescription = "Increase font size")
                    }
                    // Language selector dialog
                    IconButton(onClick = { showLanguageDialog = true }) {
                        Icon(imageVector = Icons.Default.Translate, contentDescription = "Select languages")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary,
                    navigationIconContentColor = MaterialTheme.colorScheme.onPrimary,
                    actionIconContentColor = MaterialTheme.colorScheme.onPrimary
                )
            )
        },
        modifier = modifier
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            contentPadding = PaddingValues(top = 8.dp, bottom = 24.dp)
        ) {
            items(samplePrayers, key = { it.id }) { prayer ->
                PrayerCard(
                    item = prayer,
                    visibleLanguages = visibleLanguages,
                    fontSizeMultiplier = fontSizeMultiplier
                )
            }
        }
    }

    if (showLanguageDialog) {
        LanguageFilterDialog(
            selectedLanguages = visibleLanguages,
            onToggleLanguage = { lang ->
                visibleLanguages = if (visibleLanguages.contains(lang)) {
                    if (visibleLanguages.size > 1) visibleLanguages - lang else visibleLanguages
                } else {
                    visibleLanguages + lang
                }
            },
            onDismiss = { showLanguageDialog = false }
        )
    }
}
