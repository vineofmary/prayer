/**
 * @file st_athanasius_psalms.js
 * @description Dataset of St. Athanasius of Alexandria's prescriptions and classifications 
 * of the Psalms from his "Letter to Marcellinus on the Interpretation of the Psalms" 
 * (c. 360 AD, translated by Robert C. Gregg).
 * 
 * ALL PSALM NUMBERS ARE IN THE SEPTUAGINT (LXX / ETHIOPIC ORTHODOX TEWAHEDO) SYSTEM.
 */

const ST_ATHANASIUS_CATEGORIES = [
    { id: "all", name: "All Prescriptions", icon: "📜" },
    { id: "soul_motions", name: "Motions of the Soul & Circumstances", icon: "🕊️" },
    { id: "christological_prophecies", name: "Christological Mysteries & Prophecies", icon: "✝️" },
    { id: "scripture_parallels", name: "Scripture Connections (OT)", icon: "📖" },
    { id: "genres_and_forms", name: "Forms & Literary Genres", icon: "✍️" },
    { id: "weekly_liturgical", name: "Liturgical Days & Cycles", icon: "📅" }
];

const ST_ATHANASIUS_PSALMS_GUIDE = [
    // ==========================================
    // 1. MOTIONS OF THE SOUL & LIFE CIRCUMSTANCES (PRESCRIPTIONS)
    // ==========================================
    {
        id: "ath-1",
        category: "soul_motions",
        title: "Persecuted by your own people or family",
        prescription: "If you are being persecuted by your own people, and have many who rise up against you, say Psalm 3.",
        section: "Section 14",
        psalms: [3],
        tags: ["persecution", "family", "relatives", "absalom", "enemies", "trials"]
    },
    {
        id: "ath-2",
        category: "soul_motions",
        title: "Thanking God after being heeded in your affliction",
        prescription: "If, being afflicted/persecuted, you begged the Lord for help, and having been heeded, you desire to give thanks, sing Psalms 4, 74, 114, and 115.",
        section: "Section 14",
        psalms: [4, 74, 114, 115],
        tags: ["thanksgiving", "affliction", "answered prayer", "gratitude", "deliverance"]
    },
    {
        id: "ath-3",
        category: "soul_motions",
        title: "When evildoers set a trap or snare for you",
        prescription: "Whenever, spying the evildoers who want to set a trap for you, you want the Lord to hearken to your prayer, wake up early and sing Psalm 5.",
        section: "Section 14",
        psalms: [5],
        tags: ["trap", "snare", "evildoers", "enemies", "morning prayer"]
    },
    {
        id: "ath-4",
        category: "soul_motions",
        title: "Feeling beneath the cloud of God's displeasure",
        prescription: "When you perceive a threatening from the Lord, should you see that you are disturbed for this reason, say Psalms 6 and 37.",
        section: "Section 14",
        psalms: [6, 37],
        tags: ["displeasure", "chastisement", "fear", "repentance", "mercy"]
    },
    {
        id: "ath-5",
        category: "soul_motions",
        title: "When people plot against you (as Ahithophel against David)",
        prescription: "If some people take counsel against you, as Ahithophel did against David, and someone reports this to you, sing Psalm 7, and put your trust in God.",
        section: "Section 14",
        psalms: [7],
        tags: ["plots", "treachery", "ahithophel", "conspiracy", "trust"]
    },
    {
        id: "ath-6",
        category: "soul_motions",
        title: "Contemplating the Savior's universal grace & redemption",
        prescription: "When you behold the Savior's grace, which has been extended everywhere, and the human race, which has been rescued, if you wish to address the Lord, sing Psalm 8.",
        section: "Section 14",
        psalms: [8],
        tags: ["grace", "redemption", "creation", "humanity", "salvation"]
    },
    {
        id: "ath-7",
        category: "soul_motions",
        title: "Giving thanks for the vintage harvest",
        prescription: "If you wish to sing of the vintage, giving thanks to the Lord, use Psalms 8 and 83.",
        section: "Section 14",
        psalms: [8, 83],
        tags: ["vintage", "harvest", "thanksgiving", "blessings"]
    },
    {
        id: "ath-8",
        category: "soul_motions",
        title: "Victory over enemies and preservation of creation",
        prescription: "In honor of conquest of the enemy and the preservation of creation, not boasting in yourself but knowing the Son of God who accomplished this, say Psalm 9.",
        section: "Section 14",
        psalms: [9],
        tags: ["victory", "preservation", "creation", "humility", "conquest"]
    },
    {
        id: "ath-9",
        category: "soul_motions",
        title: "When someone seeks to alarm or provoke you excessively",
        prescription: "Whenever someone seeks to provoke or alarm you excessively, express your faith and prayer by trusting in the Lord with Psalm 10.",
        section: "Section 14",
        psalms: [10],
        tags: ["alarm", "provocation", "fear", "courage", "trust"]
    },
    {
        id: "ath-10",
        category: "soul_motions",
        title: "Seeing the boundless pride of the wicked and abounding evil",
        prescription: "When you see the arrogance of the multitude and the evil that abounds, so that nothing is holy as far as men are concerned, take refuge with the Lord and say Psalm 11.",
        section: "Section 14",
        psalms: [11],
        tags: ["arrogance", "wickedness", "society", "refuge", "faithlessness"]
    },
    {
        id: "ath-11",
        category: "soul_motions",
        title: "When the treachery of enemies becomes chronic & long drawn out",
        prescription: "But if the treachery that comes from your enemies becomes chronic, be not faint-hearted as though God forgot you, but call upon Him with Psalm 12.",
        section: "Section 14",
        psalms: [12],
        tags: ["chronic", "perseverance", "patience", "long-suffering", "enemies"]
    },
    {
        id: "ath-12",
        category: "soul_motions",
        title: "When people blaspheme against God's providence",
        prescription: "Should you hear people blaspheming against God's providence, do not join in their profanity but intercede with God using Psalms 13 and 52.",
        section: "Section 14",
        psalms: [13, 52],
        tags: ["blasphemy", "providence", "intercession", "godlessness"]
    },
    {
        id: "ath-13",
        category: "soul_motions",
        title: "Learning who is a true citizen of the Kingdom of Heaven",
        prescription: "If you wish to learn what sort of person the citizen of the kingdom of heaven is, sing Psalm 14.",
        section: "Section 14",
        psalms: [14],
        tags: ["righteousness", "citizen", "kingdom of heaven", "holiness", "virtue"]
    },
    {
        id: "ath-14",
        category: "soul_motions",
        title: "Standing in need of prayer against enemies who encompass your soul",
        prescription: "If you stand in need of prayer because of those who have opposed you and encompass your soul, Psalms 16, 85, 87, and 139 will meet your need.",
        section: "Section 14",
        psalms: [16, 85, 87, 139],
        tags: ["enemies", "oppressors", "protection", "deliverance", "prayer"]
    },
    {
        id: "ath-15",
        category: "soul_motions",
        title: "When preserved and delivered from your persecutors",
        prescription: "If you were preserved from your enemies, and you were delivered from your persecutors, sing Psalm 17.",
        section: "Section 14",
        psalms: [17],
        tags: ["deliverance", "thanksgiving", "protection", "victory"]
    },
    {
        id: "ath-16",
        category: "soul_motions",
        title: "Marveling at the order of creation & the precepts of the Law",
        prescription: "If you marvel at the order of creation, and the grace of providence in it, and the holy precepts of the Law, Psalms 18 and 23 will voice your prayer.",
        section: "Section 14",
        psalms: [18, 23],
        tags: ["creation", "law", "providence", "nature", "heavens"]
    },
    {
        id: "ath-17",
        category: "soul_motions",
        title: "Comforting and praying with others in tribulation",
        prescription: "When you see those who suffer tribulation, Psalm 19 will give you words to comfort and to pray with them in their distress.",
        section: "Section 14",
        psalms: [19],
        tags: ["comfort", "tribulation", "compassion", "intercession", "distress"]
    },
    {
        id: "ath-18",
        category: "soul_motions",
        title: "Aware of being shepherded and led in the right path by the Lord",
        prescription: "Should you become aware that you are being shepherded and led in the right path by the Lord, seeing it and rejoicing, Psalm 22 awaits you.",
        section: "Section 14",
        psalms: [22],
        tags: ["shepherd", "guidance", "joy", "peace", "providence"]
    },
    {
        id: "ath-19",
        category: "soul_motions",
        title: "When enemies surround you on every side",
        prescription: "Let us suppose the enemies are all around you: lift up your heart to God and say Psalm 24, and you will surely see the sinners put to rout.",
        section: "Section 14",
        psalms: [24],
        tags: ["surrounded", "enemies", "protection", "deliverance"]
    },
    {
        id: "ath-20",
        category: "soul_motions",
        title: "Asking God alone to judge righteously in trials",
        prescription: "When counting God worthy to be Judge—for only He is just—pray that He alone will judge according unto right, using Psalms 25, 34, and 42.",
        section: "Section 14",
        psalms: [25, 34, 42],
        tags: ["judgment", "justice", "righteous judge", "innocence", "vindication"]
    },
    {
        id: "ath-21",
        category: "soul_motions",
        title: "When rank upon rank of enemies savagely attack and scorn you",
        prescription: "If they savagely attack you, and the enemies become multitudinous, rank upon rank, eyeing you with contempt as if unvisited by grace, be not afraid, but sing Psalm 26.",
        section: "Section 14",
        psalms: [26],
        tags: ["multitude", "host", "contempt", "courage", "light"]
    },
    {
        id: "ath-22",
        category: "soul_motions",
        title: "When snares are laid shamelessly by attackers",
        prescription: "Should those who lay snares act shamelessly, pay no attention to human weakness or their brazenness, but cry unceasingly on God with Psalm 27.",
        section: "Section 14",
        psalms: [27],
        tags: ["snares", "shameless", "prayer", "strength", "rock"]
    },
    {
        id: "ath-23",
        category: "soul_motions",
        title: "Learning the right way of approach to God in thankfulness",
        prescription: "If, in giving thanks, you wish to learn what is necessary to offer to the Lord with spiritual understanding, sing Psalm 28.",
        section: "Section 14",
        psalms: [28],
        tags: ["thanksgiving", "offering", "worship", "understanding"]
    },
    {
        id: "ath-24",
        category: "soul_motions",
        title: "Consecrating your home: your soul and body",
        prescription: "When consecrating your house—that is, the soul that is being received by the Lord and the somatic house in which you dwell bodily—say Psalms 29 and 126.",
        section: "Section 14",
        psalms: [29, 126],
        tags: ["consecration", "dedication", "house", "soul", "body"]
    },
    {
        id: "ath-25",
        category: "soul_motions",
        title: "Persecuted by friends and relatives for truth's sake",
        prescription: "When you see yourself despised and persecuted for truth's sake by all your friends and relatives, do not despair nor fear, but go apart and sing Psalm 30.",
        section: "Section 14",
        psalms: [30],
        tags: ["despised", "relatives", "friends", "truth", "persecution"]
    },
    {
        id: "ath-26",
        category: "soul_motions",
        title: "Wonder over God's love when seeing people baptized and redeemed",
        prescription: "When you see those who are baptized and redeemed from their corrupt birth, and you are filled with wonder over God's love for mankind, sing in thanksgiving Psalm 31.",
        section: "Section 14",
        psalms: [31],
        tags: ["baptism", "redemption", "blessedness", "thanksgiving", "mercy"]
    },
    {
        id: "ath-27",
        category: "soul_motions",
        title: "Singing in the company of righteous and upright people",
        prescription: "If you wish to sing in the company of many, gathering men who are righteous and erect in their living, use Psalm 32.",
        section: "Section 14",
        psalms: [32],
        tags: ["community", "assembly", "righteous", "upright", "praise"]
    },
    {
        id: "ath-28",
        category: "soul_motions",
        title: "Expressing gratitude after escaping foes by wise counsel",
        prescription: "When you encounter your foes, and wisely escape them and avoid their treachery, if you want to express gratitude, summoning gentle men, sing Psalm 33.",
        section: "Section 14",
        psalms: [33],
        tags: ["escape", "wisdom", "gratitude", "deliverance", "foes"]
    },
    {
        id: "ath-29",
        category: "soul_motions",
        title: "Seeing the zeal for evil among lawbreakers",
        prescription: "Should you spy the zeal for evil among those who transgress the Law, read Psalm 35 and you will see they are themselves the authors of their sin.",
        section: "Section 14",
        psalms: [35],
        tags: ["lawbreakers", "evil", "sin", "reflection"]
    },
    {
        id: "ath-30",
        category: "soul_motions",
        title: "Exhorting someone not to emulate or envy lawless people",
        prescription: "If you witness worthless people committing numerous lawless acts and exalting themselves, and wish to exhort someone not to emulate them—for they soon vanish—say Psalm 36.",
        section: "Section 14",
        psalms: [36],
        tags: ["envy", "lawless", "exhortation", "vanity", "transient"]
    },
    {
        id: "ath-31",
        category: "soul_motions",
        title: "Fortifying yourself for contest when the foe attacks",
        prescription: "When you propose to attend to yourself, if you should see the foe attacking, and should you wish to fortify yourself for the contest against him, say Psalm 38.",
        section: "Section 14",
        psalms: [38],
        tags: ["fortify", "contest", "enemy", "warfare", "vigilance"]
    },
    {
        id: "ath-32",
        category: "soul_motions",
        title: "Learning the value of endurance in times of trial",
        prescription: "And if, when the enemies set upon you, you persevere in the face of the trials, and you want to learn the advantage of endurance, sing Psalm 39.",
        section: "Section 14",
        psalms: [39],
        tags: ["endurance", "perseverance", "patience", "trials"]
    },
    {
        id: "ath-33",
        category: "soul_motions",
        title: "Showing mercy to the poor & approving those who act with compassion",
        prescription: "When you see numerous people in need and poverty, and wish to treat them mercifully... to approve those who act with compassion and urge others, use Psalm 40.",
        section: "Section 14",
        psalms: [40],
        tags: ["poor", "mercy", "almsgiving", "compassion", "charity"]
    },
    {
        id: "ath-34",
        category: "soul_motions",
        title: "Aflame with longing for God despite adversaries' chiding",
        prescription: "Possessing a great desire for God, if you hear adversaries chiding you, be not disturbed, but cheer on your soul by the hope placed in God with Psalm 41.",
        section: "Section 14",
        psalms: [41],
        tags: ["longing", "desire for God", "hope", "panteth", "soul"]
    },
    {
        id: "ath-35",
        category: "soul_motions",
        title: "Recounting God's past miracles and Israel's ingratitude",
        prescription: "Wishing unceasingly to remember the kind acts of God accomplished for the fathers... and how God is good but men are ungrateful, use Psalms 43, 77, 88, 104, 105, 106, and 113.",
        section: "Section 14",
        psalms: [43, 77, 88, 104, 105, 106, 113],
        tags: ["exodus", "history", "miracles", "wilderness", "gratitude", "remembrance"]
    },
    {
        id: "ath-36",
        category: "soul_motions",
        title: "Fleeing to God after deliverance from afflictions",
        prescription: "If you want to thank God and to recount the philanthropy and loving mercy that has come to you after deliverance, sing Psalm 45.",
        section: "Section 14",
        psalms: [45],
        tags: ["refuge", "deliverance", "philanthropy", "mercy", "thanksgiving"]
    },
    {
        id: "ath-37",
        category: "soul_motions",
        title: "Repentance and begging for forgiveness after sinning",
        prescription: "But you sinned, and being ashamed, you repent and ask to be shown mercy: you have the words of confession and penitence in Psalm 50.",
        section: "Section 14",
        psalms: [50],
        tags: ["repentance", "penitence", "forgiveness", "confession", "mercy", "clean heart"]
    },
    {
        id: "ath-38",
        category: "soul_motions",
        title: "Slandered by an evil ruler who boasts in malice",
        prescription: "If you suffered calumny from a wicked ruler, and you see the slanderer boasting, go away and say Psalm 51.",
        section: "Section 14",
        psalms: [51],
        tags: ["calumny", "slander", "wicked ruler", "doeg", "boasting"]
    },
    {
        id: "ath-39",
        category: "soul_motions",
        title: "Pursued by slandering enemies seeking to deliver you to justice",
        prescription: "When you are being pursued and certain ones are perpetrating slander (as the Ziphites and alien tribes did to David), sing with full confidence Psalms 53 and 55.",
        section: "Section 14",
        psalms: [53, 55],
        tags: ["ziphites", "slander", "pursued", "confidence", "protection"]
    },
    {
        id: "ath-40",
        category: "soul_motions",
        title: "Hiding in a cave when pursuers enter unknowingly",
        prescription: "If your pursuer overtakes you, and without knowing it enters the cave in which you are hiding, fear not: you have encouragement in Psalms 56 and 141.",
        section: "Section 14",
        psalms: [56, 141],
        tags: ["cave", "hiding", "david", "saul", "encouragement", "refuge"]
    },
    {
        id: "ath-41",
        category: "soul_motions",
        title: "Reproaching hypocrites and those who glory in appearances",
        prescription: "Against those who posture and are outwardly boastful—say for their humiliation and reproach Psalm 57.",
        section: "Section 14",
        psalms: [57],
        tags: ["hypocrites", "appearances", "reproach", "boasting"]
    },
    {
        id: "ath-42",
        category: "soul_motions",
        title: "Escaping when plotters surround and watch your house",
        prescription: "Should he who is plotting give the order for your house to be kept under surveillance, and you escape, let Psalm 58 be written on your heart as a memorial.",
        section: "Section 14",
        psalms: [58],
        tags: ["surveillance", "escape", "memorial", "thanksgiving", "protection"]
    },
    {
        id: "ath-43",
        category: "soul_motions",
        title: "Grieved when seeming friends turn and level accusations at you",
        prescription: "If foes hurl insults and seeming friends, rising up, level accusations at you, call upon God for help and praise Him using Psalm 54.",
        section: "Section 14",
        psalms: [54],
        tags: ["false friends", "accusations", "insults", "grief", "consolation"]
    },
    {
        id: "ath-44",
        category: "soul_motions",
        title: "Against savage enemies who desire to take your life",
        prescription: "Against those rushing savagely toward you, desiring to seize your soul, render your obedience to God and take courage. Your form of words is Psalm 61.",
        section: "Section 14",
        psalms: [61],
        tags: ["savage foes", "life threatening", "obedience", "courage", "rock"]
    },
    {
        id: "ath-45",
        category: "soul_motions",
        title: "Driven by persecution into the desert",
        prescription: "If, when persecuted, you go out into the desert, do not be afraid as though alone, for God is there; rise before dawn and sing Psalm 62.",
        section: "Section 14",
        psalms: [62],
        tags: ["desert", "wilderness", "solitude", "early morning", "thirst for God"]
    },
    {
        id: "ath-46",
        category: "soul_motions",
        title: "Pursued by vast numbers of ambushing foes",
        prescription: "When enemies frighten you away, never ceasing from lying in ambush, even if they are vast in number, yield not: sing Psalms 63, 64, 69, and 70.",
        section: "Section 14",
        psalms: [63, 64, 69, 70],
        tags: ["ambush", "vast host", "persecution", "courage", "refuge"]
    },
    {
        id: "ath-47",
        category: "soul_motions",
        title: "When you desire to celebrate God in song",
        prescription: "The 64th Psalm will meet your need whenever you desire to sing praise and celebrate God in song.",
        section: "Section 14",
        psalms: [64],
        tags: ["praise", "singing", "celebration", "worship"]
    },
    {
        id: "ath-48",
        category: "soul_motions",
        title: "Instructing people about the Resurrection",
        prescription: "If you wish to instruct some people about the resurrection of the Lord, sing Psalm 65.",
        section: "Section 14",
        psalms: [65],
        tags: ["resurrection", "teaching", "instruction", "joy"]
    },
    {
        id: "ath-49",
        category: "soul_motions",
        title: "Beseeching God for mercy while praising Him",
        prescription: "Praise God while you beseech Him to treat you mercifully, using Psalm 66.",
        section: "Section 14",
        psalms: [66],
        tags: ["mercy", "praise", "supplication", "blessing"]
    },
    {
        id: "ath-50",
        category: "soul_motions",
        title: "Seeing the godless flourish in peace while the righteous suffer",
        prescription: "When you perceive the godless flourishing in peace and yet the righteous who suffer living in dejection, be not offended but say Psalm 72.",
        section: "Section 14",
        psalms: [72],
        tags: ["prosperity of wicked", "suffering of righteous", "asaph", "sanctuary"]
    },
    {
        id: "ath-51",
        category: "soul_motions",
        title: "When God's wrath is stirred against the people",
        prescription: "Whenever God's wrath is stirred against the people, you have for consolation in this circumstance Psalm 73.",
        section: "Section 14",
        psalms: [73],
        tags: ["wrath", "consolation", "people", "church", "chastisement"]
    },
    {
        id: "ath-52",
        category: "soul_motions",
        title: "Refuting the opinions of pagans, Greeks, and heretics",
        prescription: "For the purpose of putting to shame the opinions of the Greeks and heretics, showing that true knowledge of God resides in the universal Church alone, use Psalm 75.",
        section: "Section 14",
        psalms: [75],
        tags: ["heretics", "greeks", "church", "truth", "apologetics"]
    },
    {
        id: "ath-53",
        category: "soul_motions",
        title: "When paths of escape are cut off and you are cast into confusion",
        prescription: "When foes cut off your paths of escape, even if cast into confusion, despair not, but pray. When heard, thank God with Psalm 76.",
        section: "Section 14",
        psalms: [76],
        tags: ["confusion", "trapped", "prayer", "thanksgiving", "trouble"]
    },
    {
        id: "ath-54",
        category: "soul_motions",
        title: "When adversaries pollute God's house and slay the Saints",
        prescription: "Should adversaries pollute the house of God and slay the Saints... lie not cowed, but sympathize with those who suffer and appeal to God with Psalm 78.",
        section: "Section 14",
        psalms: [78],
        tags: ["martyrs", "defilement", "sanctuary", "sympathy", "intercession"]
    },
    {
        id: "ath-55",
        category: "soul_motions",
        title: "Praising the Lord in a festival with fellow servants",
        prescription: "Wishing to praise the Lord in a festival, when you summon together the servants of God, sing Psalms 80 and 94.",
        section: "Section 14",
        psalms: [80, 94],
        tags: ["feast", "festival", "assembly", "worship", "joy"]
    },
    {
        id: "ath-56",
        category: "soul_motions",
        title: "When enemies form a confederacy against true religion",
        prescription: "When enemies gather from all points, forming a confederacy against true religion, lest you become despondent, anchor your hope in Psalm 82.",
        section: "Section 14",
        psalms: [82],
        tags: ["confederacy", "threats", "anchor of hope", "church"]
    },
    {
        id: "ath-57",
        category: "soul_motions",
        title: "Zeal and longing for the house of God and His tabernacles",
        prescription: "Seeing the house of God and His eternal tabernacles, should you have zeal and longing for these (as the Apostle did), say Psalm 83.",
        section: "Section 14",
        psalms: [83],
        tags: ["tabernacles", "house of God", "zeal", "longing", "courts of the Lord"]
    },
    {
        id: "ath-58",
        category: "soul_motions",
        title: "Giving thanks after captivity or wrath has ended",
        prescription: "After wrath has abated and captivity is ended, if you wish to give thanks, say Psalms 84, 114, 115, and 125.",
        section: "Section 14",
        psalms: [84, 114, 115, 125],
        tags: ["restoration", "thanksgiving", "end of captivity", "peace"]
    },
    {
        id: "ath-59",
        category: "soul_motions",
        title: "Excellence of the Church universal vs. schismatics",
        prescription: "If you want to know the excellence of the Church universal in comparison with schismatics, and to reprove the latter, say Psalm 86.",
        section: "Section 14",
        psalms: [86],
        tags: ["church universal", "schism", "mother sion", "unity"]
    },
    {
        id: "ath-60",
        category: "soul_motions",
        title: "Making yourself and others bold in right worship",
        prescription: "If you intend to make yourself bold and others confident in right worship, since hope placed in God brings no shame, say Psalm 90.",
        section: "Section 14",
        psalms: [90],
        tags: ["protection", "fearless", "he that dwelleth", "confidence", "angels"]
    },
    {
        id: "ath-61",
        category: "soul_motions",
        title: "When God's house is rebuilt after destruction",
        prescription: "When captivity befalls you, should the house be destroyed and built once again, sing Psalm 95.",
        section: "Section 14",
        psalms: [95],
        tags: ["rebuilding", "restoration", "sanctuary", "new song"]
    },
    {
        id: "ath-62",
        category: "soul_motions",
        title: "When the land is secured and peace returns under the Lord's reign",
        prescription: "When the land is secured and thereafter remains tranquil, and the Lord reigns, sing Psalm 96.",
        section: "Section 14",
        psalms: [96],
        tags: ["peace", "tranquility", "reign of the Lord", "rest"]
    },
    {
        id: "ath-63",
        category: "soul_motions",
        title: "Instructing others in faith & obedience to God's providence",
        prescription: "Seeing the Lord's providence and rulership in all things, and wishing to educate people for trust and obedience, prevail upon them with Psalm 99.",
        section: "Section 14",
        psalms: [99],
        tags: ["providence", "obedience", "instruction", "faith", "trust"]
    },
    {
        id: "ath-64",
        category: "soul_motions",
        title: "Approaching God knowing His judgment is tempered with mercy",
        prescription: "After coming to know His power for judging, and that the Lord makes a decision tempering judgment with mercy, approach Him with Psalm 100.",
        section: "Section 14",
        psalms: [100],
        tags: ["mercy", "judgment", "integrity", "pure heart"]
    },
    {
        id: "ath-65",
        category: "soul_motions",
        title: "Exhausted, downcast, and like a beggar in life's distresses",
        prescription: "Since our nature is feeble, when you come to be like a beggar because of life's distresses, if exhausted and wishing to be encouraged, sing Psalm 101.",
        section: "Section 14",
        psalms: [101],
        tags: ["beggar", "exhausted", "distress", "consolation", "afflicted"]
    },
    {
        id: "ath-66",
        category: "soul_motions",
        title: "Urging your soul to commend and thank God in all circumstances",
        prescription: "Since it is appropriate for us to give thanks to God in all circumstances, when you wish to commend Him, urge your soul forward with Psalms 102 and 103.",
        section: "Section 14",
        psalms: [102, 103],
        tags: ["bless the Lord", "soul", "benefits", "creation", "thanksgiving"]
    },
    {
        id: "ath-67",
        category: "soul_motions",
        title: "Praying with full faith and belief in your heart",
        prescription: "Have you faith, as the Lord said, and when praying, do you believe those things you are speaking? Then say Psalm 115.",
        section: "Section 14",
        psalms: [115],
        tags: ["faith", "belief", "prayer", "cup of salvation"]
    },
    {
        id: "ath-68",
        category: "soul_motions",
        title: "Led astray by others' arguments and returning in repentance",
        prescription: "If enthralled by foreign thoughts and seduced, and in repentance determining to desist, sit still and utter your lament as Israel by Babylon's waters with Psalm 136.",
        section: "Section 14",
        psalms: [136],
        tags: ["babylon", "repentance", "foreign thoughts", "lament"]
    },
    {
        id: "ath-69",
        category: "soul_motions",
        title: "Giving thanks after trials and testing have safely passed",
        prescription: "When you think of temptations as a testing for you, if you want to give thanks after the trials, sing Psalm 138.",
        section: "Section 14",
        psalms: [138],
        tags: ["testing", "trials", "thanksgiving", "searched me", "know me"]
    },
    {
        id: "ath-70",
        category: "soul_motions",
        title: "Beleaguered once more by enemies and seeking freedom",
        prescription: "If you find yourself beleaguered once more by the enemies and desire to be free, say Psalm 139.",
        section: "Section 14",
        psalms: [139],
        tags: ["freedom", "enemies", "deliverance", "prayer"]
    },
    {
        id: "ath-71",
        category: "soul_motions",
        title: "Facing a tyrannical foe like Goliath without fear",
        prescription: "Should a tyrannical foe rise up against the people and you, as Goliath against David, tremble not in fear: have faith like David and sing Psalm 143.",
        section: "Section 14",
        psalms: [143],
        tags: ["goliath", "tyrant", "faith", "courage", "blessed be the Lord"]
    },
    {
        id: "ath-72",
        category: "soul_motions",
        title: "Marveling at God's kindness to yourself and all creation",
        prescription: "After marveling at the kindness of God in all things and recalling His benevolence affecting you and all, commend God with Psalm 144.",
        section: "Section 14",
        psalms: [144],
        tags: ["kindness", "benevolence", "praise", "greatness of God"]
    },
    {
        id: "ath-73",
        category: "soul_motions",
        title: "When chosen for a position of leadership over brethren",
        prescription: "If, though insignificant, you are selected for some sovereignty over your brothers, be not exalted against them, but attribute glory to God with Psalm 150 (and 151).",
        section: "Section 14",
        psalms: [150, 151],
        tags: ["leadership", "humility", "sovereignty", "david", "glory to God"]
    },

    // ==========================================
    // 2. CHRISTOLOGICAL MYSTERIES & PROPHECIES
    // ==========================================
    {
        id: "ath-74",
        category: "christological_prophecies",
        title: "Mystery of the Incarnation & Virgin Birth",
        prescription: "Prophesying the divine Begetting of the Son from the Father and His incarnate birth of the Virgin: Psalms 32, 44, 49, 86, 106, 109, and 117.",
        section: "Sections 5-8",
        psalms: [32, 44, 49, 86, 106, 109, 117],
        tags: ["incarnation", "virgin birth", "begotten", "word made flesh", "gabriel", "mary"]
    },
    {
        id: "ath-75",
        category: "christological_prophecies",
        title: "Suffering, Crucifixion, and Our Redemption",
        prescription: "Describing the Saviour's Passion, the piercing of hands and feet upon the Cross, the casting of lots, and bearing our sins: Psalms 2, 21, 68, 71, 87, and 137.",
        section: "Sections 5-8",
        psalms: [2, 21, 68, 71, 87, 137],
        tags: ["cross", "crucifixion", "passion", "pierced", "lots", "redemption", "suffering"]
    },
    {
        id: "ath-76",
        category: "christological_prophecies",
        title: "Resurrection from the Dead",
        prescription: "Demonstrating the Savior's bodily Resurrection from the dead: Psalms 15 and 65.",
        section: "Sections 5-8",
        psalms: [15, 65],
        tags: ["resurrection", "holy one", "incorruption", "victory over death"]
    },
    {
        id: "ath-77",
        category: "christological_prophecies",
        title: "Bodily Ascension into Heaven",
        prescription: "Foretelling the King of Glory ascending into heaven: 'Lift up your gates, ye princes...': Psalms 23 and 46.",
        section: "Sections 5-8",
        psalms: [23, 46],
        tags: ["ascension", "everlasting doors", "king of glory", "shout"]
    },
    {
        id: "ath-78",
        category: "christological_prophecies",
        title: "Kingship, Authority, and Judgement of Christ",
        prescription: "Proclaiming Christ seated at the Father's right hand, judging all nations in righteousness, and calling the Gentiles: Psalms 9, 20, 49, 71, 81, and 109.",
        section: "Sections 5-8",
        psalms: [9, 20, 49, 71, 81, 109],
        tags: ["kingship", "judgment", "session", "right hand", "calling of gentiles"]
    },
    {
        id: "ath-79",
        category: "christological_prophecies",
        title: "Benefits of the Saviour's Passion",
        prescription: "Contemplating all the benefits won for us by the Saviour through His sufferings and victory: Psalms 92, 95, 97, and 98.",
        section: "Sections 5-8",
        psalms: [92, 95, 97, 98],
        tags: ["benefits", "passion", "victory", "salvation", "new song"]
    },
    {
        id: "ath-80",
        category: "christological_prophecies",
        title: "Betrayal by Judas & Treachery of the Jews",
        prescription: "Displaying the snares and malice of the Jewish leaders and the betrayal by Judas Iscariot: Psalms 2, 3, and 108.",
        section: "Sections 5-8",
        psalms: [2, 3, 108],
        tags: ["judas", "betrayal", "treachery", "conspiracy"]
    },

    // ==========================================
    // 3. SCRIPTURE PARALLEL CONNECTIONS (OT LINKS)
    // ==========================================
    {
        id: "ath-81",
        category: "scripture_parallels",
        title: "Genesis: Creation & Dominion of Earth",
        prescription: "Creation of the heavens, firmament, and earth as recorded in Genesis: Psalms 18 and 23.",
        section: "Sections 3-4",
        psalms: [18, 23],
        tags: ["genesis", "creation", "firmament", "earth"]
    },
    {
        id: "ath-82",
        category: "scripture_parallels",
        title: "Exodus, Leviticus, Numbers & Deuteronomy",
        prescription: "The Exodus from Egypt, signs in the land of Ham, tabernacle, and priesthood: Psalms 28, 77, 104, 105, and 113.",
        section: "Sections 3-4",
        psalms: [28, 77, 104, 105, 113],
        tags: ["exodus", "tabernacle", "priesthood", "moses", "aaron", "plagues"]
    },
    {
        id: "ath-83",
        category: "scripture_parallels",
        title: "Joshua, Judges, and Ruth",
        prescription: "Entering the promised land, building cities, and crying to God during the era of the Judges: Psalms 104 and 106.",
        section: "Sections 3-4",
        psalms: [104, 106],
        tags: ["joshua", "judges", "promised land", "crying in distress"]
    },
    {
        id: "ath-84",
        category: "scripture_parallels",
        title: "Kingdoms (1-4 Kings) and Chronicles",
        prescription: "The doings of the kings: 'Some trust in chariots and some in horses...': Psalm 19.",
        section: "Sections 3-4",
        psalms: [19],
        tags: ["kings", "chronicles", "chariots", "horses", "david"]
    },
    {
        id: "ath-85",
        category: "scripture_parallels",
        title: "Ezra & Nehemiah: Deliverance from Exile",
        prescription: "Return of the captives to Zion, rebuilding of Jerusalem and the Temple: Psalms 121 and 125.",
        section: "Sections 3-4",
        psalms: [121, 125],
        tags: ["ezra", "exile", "zion", "jerusalem", "return"]
    },

    // ==========================================
    // 4. FORMS & LITERARY GENRES OF THE PSALMS
    // ==========================================
    {
        id: "ath-86",
        category: "genres_and_forms",
        title: "Announcing a Promise of Blessedness",
        prescription: "Psalms declaring who is truly blessed in the sight of God: Psalms 1, 31, 40, 111, 118, and 127.",
        section: "Sections 12, 14",
        psalms: [1, 31, 40, 111, 118, 127],
        tags: ["blessed", "beatitude", "blessings", "righteous"]
    },
    {
        id: "ath-87",
        category: "genres_and_forms",
        title: "Psalms of Repentance & Confession",
        prescription: "Expressing penitence, confession of sins, and seeking God's mercy: Psalms 9, 50, 74, 91, 104, 105, 106, 107, 110, 117, 135, and 137.",
        section: "Sections 12, 14",
        psalms: [9, 50, 74, 91, 104, 105, 106, 107, 110, 117, 135, 137],
        tags: ["confession", "repentance", "penitence", "mercy"]
    },
    {
        id: "ath-88",
        category: "genres_and_forms",
        title: "Songs of Thanksgiving & Gratitude",
        prescription: "Voicing thanksgiving for deliverance, blessings, and God's loving-kindness: Psalms 8, 9, 17, 33, 45, 62, 76, 84, 114, 115, 120, 121, 123, 125, 128, and 143.",
        section: "Sections 12, 14",
        psalms: [8, 9, 17, 33, 45, 62, 76, 84, 114, 115, 120, 121, 123, 125, 128, 143],
        tags: ["thanksgiving", "gratitude", "deliverance", "praise"]
    },
    {
        id: "ath-89",
        category: "genres_and_forms",
        title: "Expressing Praise and Exultation",
        prescription: "Extolling the majesty, power, and glory of God: Psalms 90, 112, 116, 134, 144, 145, 146, 148, and 150.",
        section: "Sections 12, 14",
        psalms: [90, 112, 116, 134, 144, 145, 146, 148, 150],
        tags: ["praise", "exultation", "glory", "majesty"]
    },
    {
        id: "ath-90",
        category: "genres_and_forms",
        title: "Gradual Psalms / Songs of Ascent",
        prescription: "The 15 Odes of Ascent for every step of spiritual progress: Psalms 119 to 133.",
        section: "Section 14",
        psalms: [119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133],
        tags: ["ascent", "gradual", "odes", "pilgrimage", "progress"]
    },
    {
        id: "ath-91",
        category: "genres_and_forms",
        title: "Hallelujah Psalms of Praise & Answered Prayer",
        prescription: "Songs containing Hallelujah to show how God has answered prayer: Psalms 104, 105, 106, 110, 111, 112, 113, 114, 115, 116, 117, 134, 135, 145, 146, 147, 148, 149, and 150.",
        section: "Section 14",
        psalms: [104, 105, 106, 110, 111, 112, 113, 114, 115, 116, 117, 134, 135, 145, 146, 147, 148, 149, 150],
        tags: ["hallelujah", "alleluia", "praise", "answered prayer"]
    },

    // ==========================================
    // 5. WEEKLY LITURGICAL DAY CYCLES
    // ==========================================
    {
        id: "ath-92",
        category: "weekly_liturgical",
        title: "Lord's Day / Sunday (ዘእሁድ)",
        prescription: "To give thanks on the Lord's Day (Sunday): 'The earth is the Lord's and the fullness thereof...': Psalm 23.",
        section: "Section 14",
        psalms: [23],
        tags: ["sunday", "lord's day", "resurrection", "weekly cycle"]
    },
    {
        id: "ath-93",
        category: "weekly_liturgical",
        title: "Second Day of the Week / Monday (ዘሰኑይ)",
        prescription: "To give thanks on Monday: Psalms 94 and 47.",
        section: "Section 14",
        psalms: [47, 94],
        tags: ["monday", "second day", "weekly cycle"]
    },
    {
        id: "ath-94",
        category: "weekly_liturgical",
        title: "Fourth Day of the Week / Wednesday (ዘረቡዕ)",
        prescription: "On Wednesday, the day the Jews took counsel to betray the Lord: Psalm 93.",
        section: "Section 14",
        psalms: [93],
        tags: ["wednesday", "fourth day", "betrayal", "passion", "weekly cycle"]
    },
    {
        id: "ath-95",
        category: "weekly_liturgical",
        title: "Preparation Day / Friday (ዘዓርብ)",
        prescription: "On Friday, the day of the Crucifixion when the house of God was established through victory: Psalm 92.",
        section: "Section 14",
        psalms: [92],
        tags: ["friday", "preparation day", "crucifixion", "passion", "weekly cycle"]
    },
    {
        id: "ath-96",
        category: "weekly_liturgical",
        title: "Sabbath / Saturday (ዘቀዳሚ)",
        prescription: "To produce melody and give praise on the Sabbath day: Psalm 91.",
        section: "Section 14",
        psalms: [91],
        tags: ["sabbath", "saturday", "rest", "weekly cycle"]
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ST_ATHANASIUS_CATEGORIES, ST_ATHANASIUS_PSALMS_GUIDE };
}
