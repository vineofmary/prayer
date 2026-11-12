/**
 * @file eotc_lectionary.js
 * @description Canonical Ethiopian Orthodox Tewahedo Church (EOTC) Annual Lectionary
 * ("የቤተ ክርስቲያን ጸሎት" / Yä-Betä Krəstiyan Ṣälot, 2nd Ed., Berhanena Selam, 1938 AD, pp. 139–164;
 *  1st Ed. London, 1931 AD; cross-referenced with Metsehafe Gitsawie, 1990 E.C. / 1997 AD).
 *
 * Complete 13-month (366-day) cycle keyed by Ethiopian calendar month/day ("M/D"):
 *   1 = Meskerem (1–30), 2 = Tikimt (1–30), 3 = Hidar (1–30), 4 = Tahsas (1–30),
 *   5 = Tir (1–30), 6 = Yekatit (1–30), 7 = Megabit (1–30), 8 = Miyazya (1–30),
 *   9 = Ginbot (1–30), 10 = Sene (1–30), 11 = Hamle (1–30), 12 = Nehase (1–30),
 *   13 = Pagumen (1–6).
 *
 * Notes on conventions:
 *   - All Psalm references in `psalmLxx` follow the Septuagint / Ge'ez numbering
 *     (per EOTC tradition) and are converted to Masoretic / KJV numbering via
 *     `convertLxxPsalmRefToMt()` when populating `kidaseLectionaryRefs`.
 *   - Anaphora numbers 1..14 follow the canonical Metsehafe Qidase / Gitsawie key (`EOTC_ANAPHORAS`).
 *     Currently the app includes full text for Anaphora 1 (Apostles -> 'apostles')
 *     and Anaphora 4 (St. Mary -> 'mary'); other appointed Anaphoras temporarily
 *     default to 'apostles' until their texts are added.
 */

const EOTC_ANAPHORAS = {
    1:  { id: 1,  appKey: 'apostles', english: 'Anaphora of the Apostles', geez: 'ቅዳሴ ሐዋርያት' },
    2:  { id: 2,  appKey: 'apostles', english: 'Anaphora of Our Lord', geez: 'ቅዳሴ እግዚእ' },
    3:  { id: 3,  appKey: 'apostles', english: 'Anaphora of St. John, Son of Thunder', geez: 'ቅዳሴ ዮሐንስ ወልደ ነጐድጓድ' },
    4:  { id: 4,  appKey: 'mary',     english: 'Anaphora of St. Mary (Our Lady)', geez: 'ቅዳሴ ማርያም' },
    5:  { id: 5,  appKey: 'apostles', english: 'Anaphora of the 318 Nicene Fathers', geez: 'ቅዳሴ ሠለስቱ ምእት' },
    6:  { id: 6,  appKey: 'apostles', english: 'Anaphora of St. Athanasius', geez: 'ቅዳሴ አትናቴዎስ' },
    7:  { id: 7,  appKey: 'apostles', english: 'Anaphora of St. Basil', geez: 'ቅዳሴ ባስልዮስ' },
    8:  { id: 8,  appKey: 'apostles', english: 'Anaphora of St. Gregory of Nyssa', geez: 'ቅዳሴ ጎርጎርዮስ ዘኑሲስ' },
    9:  { id: 9,  appKey: 'apostles', english: 'Anaphora of St. Epiphanius', geez: 'ቅዳሴ ኤጲፋንዮስ' },
    10: { id: 10, appKey: 'apostles', english: 'Anaphora of St. John Chrysostom', geez: 'ቅዳሴ ዮሐንስ አፈ ወርቅ' },
    11: { id: 11, appKey: 'apostles', english: 'Anaphora of St. Cyril', geez: 'ቅዳሴ ቄርሎስ' },
    12: { id: 12, appKey: 'apostles', english: 'Anaphora of St. Jacob of Serough', geez: 'ቅዳሴ ያዕቆብ ዘሥሩግ' },
    13: { id: 13, appKey: 'apostles', english: 'Anaphora of St. Dioscorus', geez: 'ቅዳሴ ዲዮስቆሮስ' },
    14: { id: 14, appKey: 'apostles', english: 'Anaphora of St. Gregory II (Wonderworker)', geez: 'ቅዳሴ ጎርጎርዮስ ካልዕ' }
};

function resolveAppAnaphoraKey(anaphoraId) {
    if (anaphoraId && EOTC_ANAPHORAS[anaphoraId]) {
        return EOTC_ANAPHORAS[anaphoraId].appKey;
    }
    return 'apostles';
}

const EOTC_LECTIONARY = {

    // =========================================================================
    // MESKEREM 1 – 30 (September 11/12 – October 10/11)
    // =========================================================================
    '1/1': {
        morning: [],
        matins: { psalmLxx: '64:11', gospel: 'Luke 4:16-23' },
        qidase: {
            pauline: '2 Corinthians 6:1-11',
            universal: 'James 5:8-13',
            acts: 'Acts 5:12-17',
            anaphora: 1,
            sets: [{ psalmLxx: '141:6-7', gospel: 'Matthew 11:1-20' }]
        },
        evening: ['Genesis 1', 'Acts 1', 'Matthew 1']
    },
    '1/2': {
        morning: [],
        matins: { psalmLxx: '138:9-10', gospel: 'Matthew 14:1-13' },
        qidase: {
            pauline: '1 Corinthians 6:1-11',
            universal: '1 John 3:10-16',
            acts: 'Acts 13:24-28',
            anaphora: 3,
            sets: [{ psalmLxx: '78:10-11', gospel: 'Mark 6:14-30' }]
        },
        evening: ['Genesis 2', 'Acts 2:1-21', 'Matthew 2']
    },
    '1/3': {
        morning: ['Genesis 3', 'Acts 2:22-47', 'Matthew 3'],
        matins: null,
        qidase: {
            pauline: '2 Thessalonians 3:13-End',
            universal: '2 John 1:8-End',
            acts: 'Acts 20:28-31',
            anaphora: 12,
            sets: [{ psalmLxx: '55:13', gospel: 'Matthew 18:18-23' }]
        },
        evening: ['Genesis 4', 'Acts 3', 'Matthew 4']
    },
    '1/4': {
        morning: ['Genesis 5', 'Acts 4', 'Matthew 5'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 3:1-8',
            universal: '1 Peter 5:9-End',
            acts: 'Acts 7:44-51',
            anaphora: 5,
            sets: [{ psalmLxx: '59:3-5', gospel: 'John 10:1-22' }]
        },
        evening: ['Genesis 6', 'Acts 5:1-16', 'Matthew 6']
    },
    '1/5': {
        morning: ['Genesis 7', 'Acts 5:17-42', 'Matthew 7'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 5:1-7',
            universal: '1 Peter 3:5-10',
            acts: 'Acts 16:8-16',
            anaphora: 5,
            sets: [{ psalmLxx: '44:9-10', gospel: 'Matthew 13:31-44' }]
        },
        evening: ['Genesis 8', 'Acts 6', 'Matthew 8']
    },
    '1/6': {
        morning: ['Genesis 9-10', 'Acts 7:1-34', 'Matthew 9'],
        matins: null,
        qidase: {
            pauline: 'Romans 9:25-End',
            universal: '2 Peter 1:19-End',
            acts: 'Acts 28:25-End',
            anaphora: 3,
            sets: [{ psalmLxx: '104:14-15', gospel: 'John 12:36-End' }]
        },
        evening: ['Genesis 11-12', 'Acts 7:35-60', 'Matthew 10']
    },
    '1/7': {
        morning: ['Genesis 13', 'Acts 8:1-25', 'Matthew 11'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 13:13-22',
            universal: '1 Peter 3:14-18',
            acts: 'Acts 16:16-22',
            anaphora: 4,
            sets: [{ psalmLxx: '83:6-7', gospel: 'Mark 1:23-29' }]
        },
        evening: ['Genesis 14', 'Acts 8:26-40', 'Matthew 12']
    },
    '1/8': {
        morning: [],
        festalHiatus: true,
        matins: null,
        qidase: {
            pauline: 'Hebrews 11:23-29',
            universal: 'Jude 1:9-12',
            acts: 'Acts 7:30-39',
            anaphora: 9,
            sets: [
                { psalmLxx: '131:9', gospel: 'Matthew 23:29-End' },
                { psalmLxx: '57:10-11', gospel: 'Matthew 23:29-End' }
            ]
        },
        evening: ['Genesis 15', 'Acts 9', 'Matthew 12:28-40']
    },
    '1/9': {
        morning: ['Genesis 16', 'Acts 10:1-29', 'Matthew 13:1-30'],
        matins: null,
        qidase: {
            pauline: 'Romans 8:35-End',
            universal: 'James 1:2-13',
            acts: 'Acts 20:16-22',
            anaphora: 13,
            sets: [{ psalmLxx: '45:3-4', gospel: 'Matthew 7:24-End' }]
        },
        evening: ['Genesis 17', 'Acts 10:30-38', 'Matthew 13:31-58']
    },
    '1/10': {
        morning: ['Genesis 18', 'Acts 11', 'Matthew 14'],
        matins: null,
        qidase: {
            pauline: 'Romans 3:1-End',
            universal: 'James 3:13-End',
            acts: 'Acts 1:12-15',
            anaphora: 4,
            sets: [
                { psalmLxx: '44:9-10', gospel: 'Luke 1:46-57' },
                { psalmLxx: '44:9-10', gospel: 'Matthew 25:1-14' }
            ]
        },
        evening: ['Genesis 19', 'Acts 12', 'Matthew 15:1-20']
    },
    '1/11': {
        morning: ['Genesis 20', 'Acts 13:1-15', 'Matthew 15:21-39'],
        matins: { psalmLxx: '34:11-12', gospel: 'Matthew 16:24-End' },
        qidase: {
            pauline: 'Hebrews 12:1-12',
            universal: 'James 3:1-13',
            acts: 'Acts 10:1-9',
            anaphora: 7,
            sets: [{ psalmLxx: '78:10-11', gospel: 'Luke 21:12-21' }]
        },
        evening: ['Genesis 21', 'Acts 13:16-52', 'Matthew 16']
    },
    '1/12': {
        morning: ['Genesis 22', 'Acts 14', 'Matthew 17'],
        matins: { psalmLxx: '72:8-9', gospel: 'Matthew 13:24-44' },
        qidase: {
            pauline: '1 Corinthians 5:3-11',
            universal: 'Jude 1:9-20',
            acts: 'Acts 20:28-31',
            anaphora: 11,
            sets: [{ psalmLxx: '33:7-8', gospel: 'Matthew 18:15-19' }]
        },
        evening: ['Genesis 23', 'Acts 15:1-12', 'Matthew 18']
    },
    '1/13': {
        morning: ['Genesis 24', 'Acts 15:13-41', 'Matthew 19:1-15'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 7:12-18',
            universal: 'James 5:14-17',
            acts: 'Acts 19:17-21',
            anaphora: 7,
            sets: [{ psalmLxx: '31:1-2', gospel: 'Luke 11:5-14' }]
        },
        evening: ['Genesis 25', 'Acts 16:1-15', 'Matthew 19:16-30']
    },
    '1/14': {
        morning: ['Genesis 26', 'Acts 17', 'Matthew 20:1-19'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 14:34-End',
            universal: '1 John 2:18-21',
            acts: 'Acts 5:11-17',
            anaphora: 3,
            sets: [{ psalmLxx: '59:3-5', gospel: 'Matthew 14:22-End' }]
        },
        evening: ['Genesis 27', 'Acts 18', 'Matthew 20:20-30']
    },
    '1/15': {
        morning: ['Genesis 28', 'Acts 19:1-20', 'Matthew 21:1-32'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 3:12-End',
            universal: '2 Peter 2:15-End',
            acts: 'Acts 7:55-End',
            anaphora: 3,
            sets: [{ psalmLxx: '64:3-4', gospel: 'Luke 10:30-38' }]
        },
        evening: ['Genesis 29', 'Acts 19:21-40', 'Matthew 21:33-46']
    },
    '1/16': {
        morning: ['Genesis 30', 'Acts 20:1-16', 'Matthew 22'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 3:10-18',
            universal: 'James 1:19-End',
            acts: 'Acts 15:13-21',
            anaphora: 4,
            sets: [
                { psalmLxx: '38:1-2', gospel: 'John 9:1-12' },
                { psalmLxx: '50:18-19', gospel: 'John 10:22-End' }
            ]
        },
        evening: ['Genesis 31', 'Acts 20:17-38', 'Matthew 23']
    },
    '1/17': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '83:6-7', gospel: 'Matthew 5:1-17' },
        qidase: {
            pauline: '1 Timothy 5:9-16',
            universal: 'James 3:11-End',
            acts: 'Acts 5:26-33',
            anaphora: 10,
            sets: [
                { psalmLxx: '59:3-5', gospel: 'Matthew 8:16-28' },
                { psalmLxx: '31:6-7', gospel: 'John 19:25-28' }
            ]
        },
        evening: ['Genesis 32', 'Acts 21:1-16', 'Matthew 24:1-35']
    },
    '1/18': {
        morning: ['Genesis 33', 'Acts 21:17-40', 'Matthew 24:36-51'],
        matins: null,
        qidase: {
            pauline: 'Romans 10:11-End',
            universal: '2 Peter 3:14-End',
            acts: 'Acts 14:26-End',
            anaphora: 5,
            sets: [{ psalmLxx: '88:8-10', gospel: 'Luke 15:8-10' }]
        },
        evening: ['Genesis 34', 'Acts 22-23', 'Matthew 25:1-30']
    },
    '1/19': {
        morning: ['Genesis 35', 'Acts 24', 'Matthew 25:31-46'],
        matins: null,
        qidase: {
            pauline: 'Ephesians 2:13-End',
            universal: '1 Peter 5:1-5',
            acts: 'Acts 10:9-24',
            anaphora: 3,
            sets: [
                { psalmLxx: '70:20-21', gospel: 'Matthew 12:9-22' },
                { psalmLxx: '83:6-7', gospel: 'John 10:1-22' }
            ]
        },
        evening: ['Genesis 36', 'Acts 25', 'Matthew 26:1-47']
    },
    '1/20': {
        morning: ['Genesis 37-38', 'Acts 26', 'Matthew 26:47-75'],
        matins: null,
        qidase: {
            pauline: 'Titus 1:5-12',
            universal: 'James 1:2-13',
            acts: 'Acts 8:28-31',
            anaphora: 3,
            sets: [{ psalmLxx: '83:6-7', gospel: 'John 10:1-22' }]
        },
        evening: ['Genesis 39', 'Acts 27', 'Matthew 28']
    },
    '1/21': {
        morning: ['Genesis 40', 'Acts 28', 'Mark 1'],
        matins: { psalmLxx: '25:11-12', gospel: 'Luke 10:15-25' },
        qidase: {
            pauline: '1 Corinthians 5:3-End',
            universal: '2 John 1:4-End',
            acts: 'Acts 19:17-21',
            anaphora: 5,
            sets: [{ psalmLxx: '34:9-10', gospel: 'Luke 1:39-57' }]
        },
        evening: ['Genesis 41', 'Romans 1', 'Mark 2']
    },
    '1/22': {
        morning: ['Genesis 42', 'Romans 2', 'Mark 3'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 4:7-End',
            universal: '1 Peter 4:12-End',
            acts: 'Acts 19:8-11',
            anaphora: 3,
            sets: [
                { psalmLxx: '26:10-11', gospel: 'Mark 13:9-14' },
                { psalmLxx: '33:19-20', gospel: 'Mark 13:9-14' }
            ]
        },
        evening: ['Genesis 43', 'Romans 3', 'Mark 4']
    },
    '1/23': {
        morning: ['Genesis 44', 'Romans 4', 'Mark 5'],
        matins: { psalmLxx: '78:10-11', gospel: 'Matthew 10:16-End' },
        qidase: {
            pauline: '2 Timothy 2:1-11',
            universal: '1 Peter 1:6-10',
            acts: 'Acts 24:11-22',
            anaphora: 7,
            sets: [{ psalmLxx: '59:3-5', gospel: 'Mark 13:11-32' }]
        },
        evening: ['Genesis 45', 'Romans 5', 'Mark 6']
    },
    '1/24': {
        morning: ['Genesis 46', 'Romans 6', 'Mark 7'],
        matins: { psalmLxx: '83:6-7', gospel: 'John 10:1-22' },
        qidase: {
            pauline: '1 Corinthians 2:12-End',
            universal: '1 John 2:20-End',
            acts: 'Acts 10:39-End',
            anaphora: 3,
            sets: [{ psalmLxx: '18:4-5', gospel: 'Luke 10:1-12' }]
        },
        evening: ['Genesis 47', 'Romans 7', 'Mark 8']
    },
    '1/25': {
        morning: ['Genesis 48', 'Romans 8:1-17', 'Mark 9:1-32'],
        matins: null,
        qidase: {
            pauline: 'Romans 2:1-12',
            universal: '2 Peter 3:1-8',
            acts: 'Acts 20:9-28',
            anaphora: 10,
            sets: [{ psalmLxx: '138:7-8', gospel: 'Matthew 12:38-43' }]
        },
        evening: ['Genesis 49', 'Romans 8:18-39', 'Mark 9:33-50']
    },
    '1/26': {
        morning: ['Genesis 50', 'Romans 9', 'Mark 10'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 12:1-11',
            universal: '1 Peter 2:20-End',
            acts: 'Acts 10:5-9',
            anaphora: 9,
            sets: [{ psalmLxx: '137:1-2', gospel: 'Luke 1:1-23' }]
        },
        evening: ['Exodus 1', 'Romans 10', 'Mark 11']
    },
    '1/27': {
        morning: ['Exodus 2', 'Romans 11', 'Mark 12'],
        matins: { psalmLxx: '65:12-13', gospel: 'Matthew 27:1-26' },
        qidase: {
            pauline: 'Romans 5:8-12',
            universal: 'James 2:5-14',
            acts: 'Acts 17:1-10',
            anaphora: 10,
            sets: [{ psalmLxx: '131:6-7', gospel: 'Matthew 19:16-27' }]
        },
        evening: ['Exodus 3', 'Romans 12', 'Mark 13']
    },
    '1/28': {
        morning: ['Exodus 4', 'Romans 13', 'Mark 14'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 11:8-22',
            universal: 'James 4:11-End',
            acts: 'Acts 12:12-End',
            anaphora: 5,
            sets: [{ psalmLxx: '114:8-9', gospel: 'John 8:3-12' }]
        },
        evening: ['Exodus 5', 'Romans 14', 'Mark 15']
    },
    '1/29': {
        morning: ['Exodus 6', 'Romans 15', 'Mark 16'],
        matins: { psalmLxx: '47:11-12', gospel: 'Matthew 25:1-14' },
        qidase: {
            pauline: 'Galatians 4:1-12',
            universal: '1 John 1:1-End',
            acts: 'Acts 3:1-12',
            anaphora: 5,
            sets: [{ psalmLxx: '2:7-8', gospel: 'Luke 21:21-End' }]
        },
        evening: ['Exodus 7', 'Romans 16', 'Luke 1:1-38']
    },
    '1/30': {
        morning: ['Exodus 8', '1 Corinthians 1', 'Luke 1:39-80'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 9:20-End',
            universal: '2 John 1:8-End',
            acts: 'Acts 20:28-31',
            anaphora: 2,
            sets: [{ psalmLxx: '132:1-2', gospel: 'Mark 1:16-23' }]
        },
        evening: ['Exodus 9', '1 Corinthians 2', 'Luke 2']
    },

    // =========================================================================
    // TIKIMT 1 – 30 (October 11/12 – November 9/10)
    // =========================================================================
    '2/1': {
        morning: ['Exodus 10', '1 Corinthians 3', 'Luke 3'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 7:32-End',
            universal: '1 Peter 3:1-5',
            acts: 'Acts 17:10-13',
            anaphora: 2,
            sets: [{ psalmLxx: '102:14-15', gospel: 'Matthew 6:25-End' }]
        },
        evening: ['Exodus 11', '1 Corinthians 4', 'Luke 4']
    },
    '2/2': {
        morning: ['Exodus 12', '1 Corinthians 5', 'Luke 5'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 4:7-End',
            universal: '1 Peter 5:5-12',
            acts: 'Acts 20:1-7',
            anaphora: 3,
            sets: [{ psalmLxx: '10:1-2', gospel: 'Matthew 5:10-17' }]
        },
        evening: ['Exodus 13', '1 Corinthians 6', 'Luke 6']
    },
    '2/3': {
        morning: ['Exodus 14', '1 Corinthians 7', 'Luke 7'],
        matins: null,
        qidase: {
            pauline: 'Titus 2:1-9',
            universal: '1 Peter 5:2-5',
            acts: 'Acts 20:28-31',
            anaphora: 2,
            sets: [{ psalmLxx: '44:9-10', gospel: 'Luke 10:38-End' }]
        },
        evening: ['Exodus 15', '1 Corinthians 8', 'Luke 8']
    },
    '2/4': {
        morning: ['Exodus 16', '1 Corinthians 9', 'Luke 9:1-27'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 7:29-End',
            universal: '1 Peter 1:16-End',
            acts: 'Acts 9:10-20',
            anaphora: 5,
            sets: [{ psalmLxx: '67:21-22', gospel: 'Luke 10:17-25' }]
        },
        evening: ['Exodus 17', '1 Corinthians 10:1-13', 'Luke 9:29-62']
    },
    '2/5': {
        morning: [],
        festalHiatus: true,
        matins: null,
        qidase: {
            pauline: '1 Thessalonians 2:13-End',
            universal: '1 Peter 4:12-End',
            acts: 'Acts 16:22-28',
            anaphora: 3,
            sets: [{ psalmLxx: '93:6-7', gospel: 'Matthew 18:23-End' }]
        },
        evening: ['Exodus 18', '1 Corinthians 10:14-23', 'Luke 10']
    },
    '2/6': {
        morning: ['Exodus 19', '1 Corinthians 11:1-16', 'Luke 11:1-26'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 5:5-10',
            universal: '1 Peter 5:9-End',
            acts: 'Acts 17:30-End',
            anaphora: 2,
            sets: [
                { psalmLxx: '65:13-14', gospel: 'Matthew 10:32-End' },
                { psalmLxx: '112:9', gospel: 'Luke 2:36-39' },
                { psalmLxx: '101:3-5', gospel: 'Luke 2:36-39' }
            ]
        },
        evening: ['Exodus 20', '1 Corinthians 11:17-34', 'Luke 11:27-54']
    },
    '2/7': {
        morning: ['Exodus 21', '1 Corinthians 12', 'Luke 12'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 11:23-End',
            universal: 'James 1:12-17',
            acts: 'Acts 21:12-17',
            anaphora: 5,
            sets: [{ psalmLxx: '33:17-18', gospel: 'Matthew 19:25-End' }]
        },
        evening: ['Exodus 22', '1 Corinthians 13', 'Luke 13']
    },
    '2/8': {
        morning: ['Exodus 23', '1 Corinthians 14:1-25', 'Luke 14'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 11:8-22',
            universal: 'James 4:11-End',
            acts: 'Acts 12:12-End',
            anaphora: 7,
            sets: [{ psalmLxx: '114:8-9', gospel: 'John 8:3-12' }]
        },
        evening: ['Exodus 24', '1 Corinthians 14:26-End', 'Luke 15']
    },
    '2/9': {
        morning: ['Exodus 32', '1 Corinthians 15:1-32', 'Luke 16'],
        matins: { psalmLxx: '47:11-12', gospel: 'Matthew 25:1-14' },
        qidase: {
            pauline: 'Galatians 4:1-12',
            universal: '1 John 1:1-End',
            acts: 'Acts 3:1-12',
            anaphora: 7,
            sets: [{ psalmLxx: '2:7-8', gospel: 'Luke 21:21-End' }]
        },
        evening: ['Exodus 33', '1 Corinthians 15:33-End', 'Luke 17']
    },
    '2/10': {
        morning: ['Exodus 34', '1 Corinthians 16', 'Luke 18'],
        matins: null,
        qidase: {
            pauline: 'Titus 1:7-12',
            universal: '1 Peter 5:9-End',
            acts: 'Acts 20:28-31',
            anaphora: 5,
            sets: [{ psalmLxx: '131:9-10', gospel: 'Mark 13:9-End' }]
        },
        evening: ['Leviticus 18', '2 Corinthians 1', 'Luke 19']
    },
    '2/11': {
        morning: ['Leviticus 19', '2 Corinthians 2', 'Luke 20'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 4:9-End',
            universal: 'James 3:1-5',
            acts: 'Acts 20:28-31',
            anaphora: 2,
            sets: [{ psalmLxx: '83:6', gospel: 'Matthew 5:11-17' }]
        },
        evening: ['Leviticus 20', '2 Corinthians 3', 'Luke 21']
    },
    '2/12': {
        morning: [],
        matins: { psalmLxx: '88:9-10', gospel: 'Matthew 19:1-16' },
        qidase: {
            pauline: '1 Timothy 5:19-End',
            universal: 'Jude 1:9-14',
            acts: 'Acts 13:22-29',
            anaphora: 8,
            sets: [{ psalmLxx: '83:6-7', gospel: 'Matthew 9:9-32' }]
        },
        evening: ['Leviticus 26', '2 Corinthians 4', 'Luke 22:1-30']
    },
    '2/13': {
        morning: ['Numbers 11', '2 Corinthians 5', 'Luke 22:31-71'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 9:1-10',
            universal: 'James 1:9-17',
            acts: 'Acts 20:16-28',
            anaphora: 10,
            sets: [{ psalmLxx: '91:12-13', gospel: 'Luke 12:26-32' }]
        },
        evening: ['Numbers 12', '2 Corinthians 6', 'Luke 23']
    },
    '2/14': {
        morning: [],
        matins: { psalmLxx: '144:10-11', gospel: 'John 14:8-15' },
        qidase: {
            pauline: '1 Corinthians 7:36-End',
            universal: '1 Peter 2:18-21',
            acts: 'Acts 8:27-End',
            anaphora: 10,
            sets: [{ psalmLxx: '18:3-4', gospel: 'Matthew 19:26-End' }]
        },
        evening: ['Numbers 13', '2 Corinthians 7', 'Luke 24']
    },
    '2/15': {
        morning: ['Numbers 14', '2 Corinthians 8', 'John 1'],
        matins: null,
        qidase: {
            pauline: 'Romans 8:31-35',
            universal: 'Jude 1:17-22',
            acts: 'Acts 15:22-30',
            anaphora: 3,
            sets: [{ psalmLxx: '21:22-23', gospel: 'Matthew 18:12-21' }]
        },
        evening: ['Numbers 15-16', '2 Corinthians 9', 'John 2']
    },
    '2/16': {
        morning: ['Numbers 17', '2 Corinthians 10', 'John 3'],
        matins: null,
        qidase: {
            pauline: 'Ephesians 6:13-19',
            universal: '1 Peter 3:10-18',
            acts: 'Acts 20:28-31',
            anaphora: 2,
            sets: [{ psalmLxx: '21:4-5', gospel: 'Matthew 5:1-17' }]
        },
        evening: ['Numbers 19-20', '2 Corinthians 11:1-15', 'John 4']
    },
    '2/17': {
        morning: ['Numbers 21', '2 Corinthians 11:16-33', 'John 5'],
        matins: null,
        qidase: {
            pauline: '2 Timothy 1:3-15',
            universal: '1 Peter 5:2-5',
            acts: 'Acts 7:54-End',
            anaphora: 3,
            sets: [
                { psalmLxx: '50:16-17', gospel: 'Luke 21:1-7' },
                { psalmLxx: '50:10-11', gospel: 'Luke 21:1-7' }
            ]
        },
        evening: ['Numbers 22', '2 Corinthians 12', 'John 6']
    },
    '2/18': {
        morning: ['Numbers 23', '2 Corinthians 13', 'John 7'],
        matins: null,
        qidase: {
            pauline: 'Titus 1:7-12',
            universal: '1 Peter 1:6-10',
            acts: 'Acts 20:31-End',
            anaphora: 7,
            sets: [{ psalmLxx: '35:8-9', gospel: 'Mark 12:13-17' }]
        },
        evening: ['Numbers 24', 'Galatians 1', 'John 8']
    },
    '2/19': {
        morning: ['Numbers 25', 'Galatians 2', 'John 9'],
        matins: null,
        qidase: {
            pauline: 'Titus 3:8-12',
            universal: '1 John 2:22-End',
            acts: 'Acts 20:28-31',
            anaphora: 2,
            sets: [{ psalmLxx: '108:7-8', gospel: 'Matthew 18:15-21' }]
        },
        evening: ['Numbers 26-27', 'Galatians 3:1-14', 'John 10']
    },
    '2/20': {
        morning: ['Numbers 30', 'Galatians 3:15-29', 'John 11'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 12:11-25',
            universal: '1 Peter 4:6-12',
            acts: 'Acts 20:31-End',
            anaphora: 3,
            sets: [{ psalmLxx: '24:10', gospel: 'Luke 4:27-33' }]
        },
        evening: ['Numbers 31', 'Galatians 4:1-11', 'John 12']
    },
    '2/21': {
        morning: ['Numbers 32', 'Galatians 4:12-End', 'John 13'],
        matins: { psalmLxx: '44:9-10', gospel: 'Luke 1:39-57' },
        qidase: {
            pauline: 'Romans 10:9-16',
            universal: '2 John 1:5-8',
            acts: 'Acts 2:14-22',
            anaphora: 3,
            sets: [{ psalmLxx: '104:14-15', gospel: 'John 11:38-46' }]
        },
        evening: ['Numbers 34-35', 'Galatians 5', 'John 14']
    },
    '2/22': {
        morning: [],
        festalHiatus: true,
        matins: null,
        qidase: {
            pauline: 'Colossians 4:12-End',
            universal: '1 John 1:4-End',
            acts: 'Acts 1:1-6',
            anaphora: 1,
            sets: [{ psalmLxx: '18:3-4', gospel: 'Luke 1:1-5' }]
        },
        evening: ['Numbers 36', 'Galatians 6', 'John 15']
    },
    '2/23': {
        morning: ['Deuteronomy 1', 'Ephesians 1', 'John 16'],
        matins: { psalmLxx: '78:10-11', gospel: 'Matthew 10:16-34' },
        qidase: {
            pauline: '1 Timothy 6:17-End',
            universal: 'James 1:12-19',
            acts: 'Acts 15:1-9',
            anaphora: 5,
            sets: [{ psalmLxx: '83:6-7', gospel: 'Luke 6:36-End' }]
        },
        evening: ['Deuteronomy 2', 'Ephesians 2', 'John 17']
    },
    '2/24': {
        morning: ['Deuteronomy 3', 'Ephesians 3', 'John 18'],
        matins: { psalmLxx: '111:9', gospel: 'Matthew 19:16-22' },
        qidase: {
            pauline: '1 Corinthians 14:26-34',
            universal: '1 Peter 3:5-10',
            acts: 'Acts 16:13-16',
            anaphora: 3,
            sets: [{ psalmLxx: '78:2-3', gospel: 'Mark 13:11-24' }]
        },
        evening: ['Deuteronomy 4', 'Ephesians 4', 'John 19']
    },
    '2/25': {
        morning: ['Deuteronomy 5', 'Ephesians 5', 'John 20'],
        matins: { psalmLxx: '115:6-7', gospel: 'Matthew 10:32-End' },
        qidase: {
            pauline: 'Ephesians 6:14-End',
            universal: '1 Peter 3:10-18',
            acts: 'Acts 11:23-27',
            anaphora: 5,
            sets: [{ psalmLxx: '91:12-13', gospel: 'Matthew 5:1-17' }]
        },
        evening: ['Deuteronomy 6', 'Ephesians 6', 'John 21']
    },
    '2/26': {
        morning: [],
        festalHiatus: true,
        matins: null,
        qidase: {
            pauline: 'Galatians 1:15-End',
            universal: '1 John 2:28-3:10',
            acts: 'Acts 6:1-8',
            anaphora: 4,
            sets: [{ psalmLxx: '113:22-23', gospel: 'Luke 10:1-12' }]
        },
        evening: ['Deuteronomy 7', 'Philippians 1', 'Matthew 1']
    },
    '2/27': {
        morning: ['Deuteronomy 8', 'Philippians 2', 'Matthew 2'],
        matins: { psalmLxx: '73:12-13', gospel: 'Matthew 27:27-57' },
        qidase: {
            pauline: '1 Corinthians 12:22-28',
            universal: '1 Peter 2:21-End',
            acts: 'Acts 5:12-16',
            anaphora: 10,
            sets: [{ psalmLxx: '55:1', gospel: 'John 3:11-25' }]
        },
        evening: ['Deuteronomy 9', 'Philippians 3', 'Matthew 3']
    },
    '2/28': {
        morning: ['Deuteronomy 10', 'Philippians 4', 'Matthew 4'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 6:9-15',
            universal: '1 Peter 4:12-End',
            acts: 'Acts 3:12-17',
            anaphora: 5,
            sets: [{ psalmLxx: '111:2-3', gospel: 'Luke 20:37-End' }]
        },
        evening: ['Deuteronomy 11', 'Colossians 1', 'Matthew 5']
    },
    '2/29': {
        morning: ['Deuteronomy 12', 'Colossians 2', 'Matthew 6'],
        matins: { psalmLxx: '109:3', gospel: 'Luke 2:1-8' },
        qidase: {
            pauline: '2 Corinthians 6:1-12',
            universal: '1 John 3:7-12',
            acts: 'Acts 9:20-23',
            anaphora: 4,
            sets: [{ psalmLxx: '17:39-40', gospel: 'Mark 8:34-9:2' }]
        },
        evening: ['Deuteronomy 13', 'Colossians 3', 'Matthew 7']
    },
    '2/30': {
        morning: ['Deuteronomy 14', 'Colossians 4', 'Matthew 8'],
        matins: null,
        qidase: {
            pauline: '2 Timothy 4:11-End',
            universal: 'James 1:2-6',
            acts: 'Acts 10:37-43',
            anaphora: 5,
            sets: [{ psalmLxx: '39:6', gospel: 'Matthew 16:24-End' }]
        },
        evening: ['Deuteronomy 15', '1 Thessalonians 1', 'Matthew 9']
    },

    // =========================================================================
    // HIDAR 1 – 30 (November 10/11 – December 9/10)
    // =========================================================================
    '3/1': {
        morning: ['Deuteronomy 16', '1 Thessalonians 2', 'Matthew 10'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 10:32-End',
            universal: '1 Peter 4:4-12',
            acts: 'Acts 4:10-19',
            anaphora: 11,
            sets: [{ psalmLxx: '118:47-48', gospel: 'Matthew 16:24-End' }]
        },
        evening: ['Deuteronomy 17', '1 Thessalonians 3', 'Matthew 11']
    },
    '3/2': {
        morning: ['Deuteronomy 18:1-12', '1 Thessalonians 4:1-12', 'Matthew 12:1-8'],
        matins: null,
        qidase: {
            pauline: 'Colossians 4:16-End',
            universal: '1 Peter 1:1-7',
            acts: 'Acts 20:28-31',
            anaphora: 5,
            sets: [{ psalmLxx: '111:6-7', gospel: 'John 10:1-22' }]
        },
        evening: ['Deuteronomy 18:13-22', '1 Thessalonians 4:13-18', 'Matthew 12:9-21']
    },
    '3/3': {
        morning: ['Deuteronomy 19:1-9', '1 Thessalonians 5:1-10', 'Matthew 12:22-37'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 4:7-End',
            universal: '1 John 2:15-22',
            acts: 'Acts 19:8-11',
            anaphora: 4,
            sets: [{ psalmLxx: '1:2-3', gospel: 'Matthew 12:9-14' }]
        },
        evening: ['Deuteronomy 19:10-21', '1 Thessalonians 5:11-28', 'Matthew 12:38-50']
    },
    '3/4': {
        morning: ['Deuteronomy 20', '2 Thessalonians 1', 'Matthew 13:1-30'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 11:29-End',
            universal: '1 Peter 5:9-End',
            acts: 'Acts 9:22-End',
            anaphora: 3,
            sets: [{ psalmLxx: '43:22-23', gospel: 'Matthew 10:32-End' }]
        },
        evening: ['Deuteronomy 21', '2 Thessalonians 2', 'Matthew 13:31-58']
    },
    '3/5': {
        morning: ['Deuteronomy 22', '2 Thessalonians 3', 'Matthew 14'],
        matins: null,
        qidase: {
            pauline: 'Romans 5:8-End',
            universal: '1 Peter 2:9-13',
            acts: 'Acts 26:12-19',
            anaphora: 4,
            sets: [{ psalmLxx: '24:7', gospel: 'John 19:31-End' }]
        },
        evening: ['Deuteronomy 24', '1 Timothy 1', 'Matthew 15:1-20']
    },
    '3/6': {
        morning: [],
        matins: { psalmLxx: '88:3', gospel: 'Luke 22:14-24' },
        qidase: {
            pauline: '2 Corinthians 8:1-16',
            universal: '2 John 1:9-End',
            acts: 'Acts 1:12-15',
            anaphora: 2,
            sets: [{ psalmLxx: '36:35-36', gospel: 'Matthew 2:19-End' }]
        },
        evening: ['Deuteronomy 25', '1 Timothy 2', 'Matthew 15:21-39']
    },
    '3/7': {
        morning: [],
        matins: { psalmLxx: '67:35', gospel: 'John 14:1-15' },
        qidase: {
            pauline: 'Ephesians 5:23-28',
            universal: '1 Peter 4:12-End',
            acts: 'Acts 27:21-27',
            anaphora: 7,
            sets: [{ psalmLxx: '78:10-11', gospel: 'Matthew 10:16-End' }]
        },
        evening: ['Deuteronomy 27', '1 Timothy 4', 'Matthew 17']
    },
    '3/8': {
        morning: ['Deuteronomy 28', '1 Timothy 5', 'Matthew 18'],
        matins: { psalmLxx: '98:1', gospel: 'Mark 16:14-End' },
        qidase: {
            pauline: '1 Corinthians 15:24-36',
            universal: 'Revelation 4:6-End',
            acts: 'Acts 5:29-End',
            anaphora: 5,
            sets: [
                { psalmLxx: '17:10-11', gospel: 'Matthew 18:10-15' },
                { psalmLxx: '17:10-11', gospel: 'Matthew 18:10-15' }
            ]
        },
        evening: ['Deuteronomy 29', '1 Timothy 6', 'Matthew 19:1-15']
    },
    '3/9': {
        morning: ['Deuteronomy 30', '2 Timothy 1', 'Matthew 19:16-30'],
        matins: { psalmLxx: '62:11', gospel: 'Matthew 18:12-23' },
        qidase: {
            pauline: 'Colossians 2:5-13',
            universal: '2 John 1:6-12',
            acts: 'Acts 15:22-30',
            anaphora: 5,
            sets: [{ psalmLxx: '72:9', gospel: 'John 10:25-End' }]
        },
        evening: ['Deuteronomy 31', '2 Timothy 2', 'Matthew 20:1-19']
    },
    '3/10': {
        morning: ['Deuteronomy 32', '2 Timothy 3', 'Matthew 20:20-34'],
        matins: null,
        qidase: {
            pauline: 'Romans 2:1-12',
            universal: '1 Peter 3:1-7',
            acts: 'Acts 17:24-30',
            anaphora: 3,
            sets: [
                { psalmLxx: '68:10-11', gospel: 'Matthew 25:1-19' },
                { psalmLxx: '68:10-11', gospel: 'Matthew 25:1-19' }
            ]
        },
        evening: ['Deuteronomy 33', '2 Timothy 4', 'Matthew 21:1-32']
    },
    '3/11': {
        morning: ['Deuteronomy 34', 'Titus 1', 'Matthew 21:33-46'],
        matins: { psalmLxx: '86:1-2', gospel: 'Luke 3:23-End' },
        qidase: {
            pauline: '1 Timothy 5:5-11',
            universal: '1 Peter 3:5',
            acts: 'Acts 16:14-19',
            anaphora: 4,
            sets: [{ psalmLxx: '44:9-10', gospel: 'Luke 18:1-9' }]
        },
        evening: ['Joshua 1', 'Titus 2', 'Matthew 22']
    },
    '3/12': {
        morning: [],
        matins: { psalmLxx: '20:1-2', gospel: 'Luke 19:11-28' },
        qidase: {
            pauline: 'Romans 9:17-24',
            universal: 'Jude 1:9-14',
            acts: 'Acts 20:28-31',
            anaphora: 7,
            sets: [{ psalmLxx: '33:7-8', gospel: 'Matthew 18:15-21' }]
        },
        evening: ['Joshua 2', 'Titus 3', 'Matthew 23']
    },
    '3/13': {
        morning: ['Joshua 3', 'Philemon 1', 'Matthew 24:1-35'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 12:22-25',
            universal: 'Jude 1:14-17',
            acts: 'Acts 12:6-12',
            anaphora: 5,
            sets: [{ psalmLxx: '102:19-20', gospel: 'Matthew 25:31-End' }]
        },
        evening: ['Joshua 4', 'Hebrews 1', 'Matthew 24:36-51']
    },
    '3/14': {
        morning: ['Joshua 5', 'Hebrews 2', 'Matthew 25:1-30'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 15:10-24',
            universal: '1 Peter 5:6-End',
            acts: 'Acts 23:7-10',
            anaphora: 7,
            sets: [{ psalmLxx: '26:10-11', gospel: 'John 4:47-End' }]
        },
        evening: ['Joshua 6:1-14', 'Hebrews 3:1-11', 'Matthew 25:31-46']
    },
    '3/15': {
        morning: ['Joshua 6:15-27', 'Hebrews 3:12-19', 'Matthew 26:1-29'],
        matins: null,
        qidase: {
            pauline: 'Romans 14:12-End',
            universal: '1 Peter 2:21-End',
            acts: 'Acts 13:1-13',
            anaphora: 3,
            sets: [{ psalmLxx: '78:10-11', gospel: 'John 5:1-5' }]
        },
        evening: ['Joshua 7', 'Hebrews 4', 'Matthew 26:30-46']
    },
    '3/16': {
        morning: ['Joshua 8', 'Hebrews 5', 'Matthew 26:47-75'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 9:5-End',
            universal: '1 Peter 5:2-12',
            acts: 'Acts 14:23-End',
            anaphora: 11,
            sets: [{ psalmLxx: '20:1-2', gospel: 'Luke 14:7-16' }]
        },
        evening: ['Joshua 9', 'Hebrews 6', 'Matthew 27']
    },
    '3/17': {
        morning: ['Joshua 10', 'Hebrews 7', 'Matthew 28'],
        matins: { psalmLxx: '83:6-7', gospel: 'John 10:1-22' },
        qidase: {
            pauline: 'Philippians 1:12-19',
            universal: '1 Peter 3:10-18',
            acts: 'Acts 16:14-25',
            anaphora: 10,
            sets: [{ psalmLxx: '145:9', gospel: 'Matthew 10:16-End' }]
        },
        evening: ['Joshua 23-24', 'Hebrews 8', 'Mark 1']
    },
    '3/18': {
        morning: ['Judges 1', 'Hebrews 9', 'Mark 2'],
        matins: { psalmLxx: '18:3-4', gospel: 'Matthew 10:1-16' },
        qidase: {
            pauline: 'Titus 2:1-End',
            universal: 'Jude 1:17-End',
            acts: 'Acts 8:5-14',
            anaphora: 1,
            sets: [{ psalmLxx: '145:9', gospel: 'John 6:4-15' }]
        },
        evening: ['Judges 2-3', 'Hebrews 10:1-18', 'Mark 3']
    },
    '3/19': {
        morning: ['Judges 4', 'Hebrews 10:19-29', 'Mark 4'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 12:28-End',
            universal: 'Jude 1:20-End',
            acts: 'Acts 4:29-37',
            anaphora: 3,
            sets: [{ psalmLxx: '18:7-8', gospel: 'Matthew 10:1-17' }]
        },
        evening: ['Judges 5', 'Hebrews 11:1-16', 'Mark 5']
    },
    '3/20': {
        morning: ['Judges 6', 'Hebrews 11:17-40', 'Mark 6'],
        matins: null,
        qidase: {
            pauline: 'Titus 1:5-12',
            universal: '1 Peter 5:1-End',
            acts: 'Acts 20:28-31',
            anaphora: 2,
            sets: [{ psalmLxx: '83:6-7', gospel: 'John 10:1-22' }]
        },
        evening: ['Judges 7', 'Hebrews 12', 'Mark 7']
    },
    '3/21': {
        morning: ['Judges 8', 'Hebrews 13', 'Mark 8'],
        matins: { psalmLxx: '47:12-13', gospel: 'Matthew 23:1-End' },
        qidase: {
            pauline: '2 Corinthians 6:12-End',
            universal: '1 Peter 2:5-11',
            acts: 'Acts 17:2-13',
            anaphora: 4,
            sets: [{ psalmLxx: '131:13-14', gospel: 'Matthew 21:42-End' }],
            alternates: { acts: ['Acts 7:44-54'] }
        },
        evening: ['Judges 9', 'James 1', 'Mark 9:1-32']
    },
    '3/22': {
        morning: ['Judges 10-11', 'James 2', 'Mark 9:33-50'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 7:1-5',
            universal: 'James 1:2-16',
            acts: 'Acts 17:2-13',
            anaphora: 3,
            sets: [{ psalmLxx: '78:10-11', gospel: 'Matthew 9:10-18' }],
            alternates: { acts: ['Acts 9:36-End'] }
        },
        evening: ['Judges 12-13', 'James 3', 'Mark 10']
    },
    '3/23': {
        morning: ['Judges 14-15', 'James 4', 'Mark 11'],
        matins: { psalmLxx: '83:11', gospel: 'Mark 1:14-23' },
        qidase: {
            pauline: 'Hebrews 11:32-End',
            universal: '2 Peter 1:19-End',
            acts: 'Acts 10:23-32',
            anaphora: 3,
            sets: [{ psalmLxx: '138:17-18', gospel: 'Matthew 10:32-End' }]
        },
        evening: ['Judges 16', 'James 5', 'Mark 12']
    },
    '3/24': {
        morning: ['Judges 17-18', '1 Peter 1:1-12', 'Mark 13'],
        matins: { psalmLxx: '77:15-16', gospel: 'John 4:10-27' },
        qidase: {
            pauline: '1 Timothy 5:17-End',
            universal: 'James 5:17-End',
            acts: 'Acts 22:18-22',
            anaphora: 5,
            sets: [{ psalmLxx: '102:19-20', gospel: 'Matthew 13:36-43' }],
            alternates: { acts: ['Revelation 12:6-12', 'Acts 10:23-32'] }
        },
        evening: ['Judges 19', '1 Peter 1:13-25', 'Mark 14']
    },
    '3/25': {
        morning: ['Judges 20', '1 Peter 2', 'Mark 15'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 7:1-12',
            universal: '1 Peter 4:12-End',
            acts: 'Acts 5:12-17',
            anaphora: 3,
            sets: [{ psalmLxx: '67:23', gospel: 'Matthew 10:17-32' }]
        },
        evening: ['Judges 21', '1 Peter 3', 'Mark 16']
    },
    '3/26': {
        morning: ['Ruth 1', '1 Peter 4:1-11', 'Luke 1:1-38'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 7:1-End',
            universal: '1 Peter 1:1-9',
            acts: 'Acts 20:28-36',
            anaphora: 3,
            sets: [{ psalmLxx: '9:12-13', gospel: 'Luke 21:12-21' }]
        },
        evening: ['Ruth 2-3', '1 Peter 4:12-19', 'Luke 1:39-80']
    },
    '3/27': {
        morning: ['Ruth 4', '1 Peter 5', 'Luke 2'],
        matins: { psalmLxx: '2:1-2', gospel: 'Matthew 26:57-End' },
        qidase: {
            pauline: 'Philemon 1:1-End',
            universal: '1 Peter 5:9-End',
            acts: 'Acts 11:25-End',
            anaphora: 10,
            sets: [{ psalmLxx: '39:1', gospel: 'Luke 10:1-12' }]
        },
        evening: ['Isaiah 1', '2 Peter 1', 'Luke 3']
    },
    '3/28': {
        morning: ['Isaiah 2', '2 Peter 2', 'Luke 4'],
        matins: null,
        qidase: {
            pauline: 'Galatians 3:5-15',
            universal: 'James 2:21-End',
            acts: 'Acts 3:12-17',
            anaphora: 5,
            sets: [{ psalmLxx: '96:11-12', gospel: 'Mark 12:25-28' }],
            alternates: { pauline: ['2 Corinthians 4:1-7'] }
        },
        evening: ['Isaiah 3', '2 Peter 3', 'Luke 5']
    },
    '3/29': {
        morning: ['Isaiah 4', '1 John 1', 'Luke 6'],
        matins: { psalmLxx: '109:3', gospel: 'Luke 2:1-8' },
        qidase: {
            pauline: 'Philippians 3:1-15',
            universal: '1 Peter 5:1-13',
            acts: 'Acts 27:39-End',
            anaphora: 7,
            sets: [{ psalmLxx: '118:95-96', gospel: 'John 10:1-22' }]
        },
        evening: ['Isaiah 5', '1 John 2', 'Luke 7']
    },
    '3/30': {
        morning: ['Isaiah 6', '1 John 3', 'Luke 8'],
        matins: { psalmLxx: '18:4-5', gospel: 'John 1:38-46' },
        qidase: {
            pauline: '1 Timothy 1:5-15',
            universal: '1 Peter 2:13-21',
            acts: 'Acts 23:10-32',
            anaphora: 4,
            sets: [
                { psalmLxx: '98:4', gospel: 'John 16:1-8' },
                { psalmLxx: '25:5-6', gospel: 'Luke 19:11-28' }
            ]
        },
        evening: ['Isaiah 7', '1 John 4', 'Luke 9']
    },

    // =========================================================================
    // TAHSAS 1 – 30 (December 10/11 – January 8/9)
    // =========================================================================
    '4/1': {
        morning: ['Isaiah 8', '1 John 5', 'Luke 10'],
        matins: { psalmLxx: '68:9-10', gospel: 'Luke 9:46-56' },
        qidase: {
            pauline: 'Romans 11:1-13',
            universal: 'James 5:16-End',
            acts: 'Acts 3:19-End',
            anaphora: 4,
            sets: [{ psalmLxx: '104:14-15', gospel: 'Luke 4:25-33' }]
        },
        evening: ['Isaiah 9', '2 John 1', 'Luke 11:1-26']
    },
    '4/2': {
        morning: ['Isaiah 10', '3 John 1', 'Luke 11:27-54'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 11:32-End',
            universal: '1 Peter 4:12-End',
            acts: 'Acts 20:9-13',
            anaphora: 4,
            sets: [{ psalmLxx: '65:12-13', gospel: 'Matthew 19:10-15' }]
        },
        evening: ['Isaiah 11', 'Jude 1', 'Luke 12']
    },
    '4/3': {
        morning: ['Isaiah 12', 'Acts 1', 'Luke 13'],
        matins: { psalmLxx: '65:13-14', gospel: 'Matthew 1:1-17' },
        qidase: {
            pauline: 'Hebrews 9:1-17',
            universal: '2 John 1:5-8',
            acts: 'Acts 1:12-15',
            anaphora: 4,
            sets: [{ psalmLxx: '44:10-11', gospel: 'Luke 1:39-57' }]
        },
        evening: ['Isaiah 13', 'Acts 2:1-21', 'Luke 14']
    },
    '4/4': {
        morning: [],
        festalHiatus: true,
        matins: null,
        qidase: {
            pauline: '2 Corinthians 11:21-End',
            universal: 'Jude 1:16-23',
            acts: 'Acts 4:29-End',
            anaphora: 1,
            sets: [{ psalmLxx: '105:18-19', gospel: 'Luke 9:46-56' }]
        },
        evening: ['Isaiah 14', 'Acts 2:22-47', 'Luke 15']
    },
    '4/5': {
        morning: ['Isaiah 15', 'Acts 3', 'Luke 16'],
        matins: null,
        qidase: {
            pauline: 'Romans 10:11-End',
            universal: '1 Peter 5:9-End',
            acts: 'Acts 16:14-16',
            anaphora: 5,
            sets: [{ psalmLxx: '34:11-12', gospel: 'Matthew 10:35-End' }],
            alternates: { pauline: ['Galatians 3:21-End'] }
        },
        evening: ['Isaiah 16', 'Acts 4', 'Luke 17']
    },
    '4/6': {
        morning: ['Isaiah 17', 'Acts 5:1-16', 'Luke 18'],
        matins: null,
        qidase: {
            pauline: 'Galatians 4:12-21',
            universal: '1 Peter 5:2-9',
            acts: 'Acts 5:1-11',
            anaphora: 7,
            sets: [{ psalmLxx: '45:1-2', gospel: 'Matthew 17:14-24' }]
        },
        evening: ['Isaiah 18', 'Acts 5:17-42', 'Luke 19']
    },
    '4/7': {
        morning: ['Isaiah 19', 'Acts 6', 'Luke 20'],
        matins: null,
        qidase: {
            pauline: 'Ephesians 6:10-End',
            universal: '1 Peter 3:10-15',
            acts: 'Acts 16:16-25',
            anaphora: 11,
            sets: [{ psalmLxx: '76:6-7', gospel: 'Matthew 15:21-29' }],
            alternates: { gospel: ['Mark 16:15-End'] }
        },
        evening: ['Isaiah 20-21', 'Acts 7:1-34', 'Luke 21']
    },
    '4/8': {
        morning: ['Isaiah 22', 'Acts 7:35-60', 'Luke 22:1-30'],
        matins: { psalmLxx: '83:6-7', gospel: 'Matthew 5:1-17' },
        qidase: {
            pauline: '2 Corinthians 12:1-8',
            universal: '1 Peter 3:8-15',
            acts: 'Acts 21:1-8',
            anaphora: 10,
            sets: [{ psalmLxx: '26:5', gospel: 'Matthew 11:16-20' }]
        },
        evening: ['Isaiah 23', 'Acts 8:1-25', 'Luke 22:31-71']
    },
    '4/9': {
        morning: ['Isaiah 24', 'Acts 8:26-40', 'Luke 23'],
        matins: null,
        qidase: {
            pauline: '1 Thessalonians 2:13-End',
            universal: 'James 5:8-12',
            acts: 'Acts 3:22-End',
            anaphora: 3,
            sets: [{ psalmLxx: '106:29-30', gospel: 'Mark 5:25-35' }],
            alternates: { psalmLxx: ['93:6-7'] }
        },
        evening: ['Isaiah 25', 'Acts 9', 'Luke 24']
    },
    '4/10': {
        morning: ['Isaiah 26', 'Acts 10:1-29', 'John 1'],
        matins: null,
        qidase: {
            pauline: 'Titus 1:5-12',
            universal: '1 John 2:20-End',
            acts: 'Acts 20:16-22',
            anaphora: 5,
            sets: [{ psalmLxx: '111:9', gospel: 'Matthew 6:1-5' }],
            alternates: { pauline: ['1 Corinthians 9:1-15'] }
        },
        evening: ['Isaiah 27', 'Acts 10:30-48', 'John 2']
    },
    '4/11': {
        morning: ['Isaiah 28', 'Acts 11', 'John 3'],
        matins: null,
        qidase: {
            pauline: 'Romans 12:9-End',
            universal: '1 Peter 4:6-12',
            acts: 'Acts 17:28-End',
            anaphora: 5,
            sets: [{ psalmLxx: '87:11-12', gospel: 'Matthew 6:7-17' }]
        },
        evening: ['Isaiah 29', 'Acts 12', 'John 4']
    },
    '4/12': {
        morning: ['Isaiah 30', 'Acts 13:1-15', 'John 5'],
        matins: { psalmLxx: '93:12-13', gospel: 'Matthew 6:19-End' },
        qidase: {
            pauline: 'Hebrews 6:1-13',
            universal: 'Jude 1:9-14',
            acts: 'Acts 10:2-9',
            anaphora: 10,
            sets: [{ psalmLxx: '43:7-8', gospel: 'Matthew 18:12-23' }],
            alternates: { universal: ['James 5:14-End'], acts: ['Acts 5:29-39'] }
        },
        evening: ['Isaiah 31-32', 'Acts 13:16-52', 'John 6']
    },
    '4/13': {
        morning: ['Isaiah 33', 'Acts 14', 'John 7'],
        matins: null,
        qidase: {
            pauline: '1 Thessalonians 4:15-End',
            universal: '1 Peter 1:10-13',
            acts: 'Acts 10:9-17',
            anaphora: 4,
            sets: [{ psalmLxx: '26:12-13', gospel: 'Matthew 10:26-34' }],
            alternates: { universal: ['James 1:21-End'], psalmLxx: ['86:1-2'] }
        },
        evening: ['Isaiah 34-35', 'Acts 15:1-12', 'John 8']
    },
    '4/14': {
        morning: ['Isaiah 36', 'Acts 15:13-31', 'John 9'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 1:1-17',
            universal: '1 Peter 1:13-End',
            acts: 'Acts 8:18-26',
            anaphora: 5,
            sets: [{ psalmLxx: '138:12-13', gospel: 'Matthew 10:16-23' }]
        },
        evening: ['Isaiah 37', 'Acts 16:1-15', 'John 10']
    },
    '4/15': {
        morning: ['Isaiah 38-39', 'Acts 16:16-40', 'John 11'],
        matins: { psalmLxx: '88:9-10', gospel: 'Luke 8:22-27' },
        qidase: {
            pauline: 'Philippians 2:5-12',
            universal: 'James 1:19-End',
            acts: 'Acts 20:28-31',
            anaphora: 5,
            sets: [{ psalmLxx: '30:12-13', gospel: 'Luke 15:11-25' }],
            alternates: { acts: ['Acts 20:18-26'] }
        },
        evening: ['Isaiah 40', 'Acts 17-18', 'John 12']
    },
    '4/16': {
        morning: ['Isaiah 41', 'Acts 19:1-20', 'John 13'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 11:32-End',
            universal: '1 Peter 3:5-7',
            acts: 'Acts 13:20-24',
            anaphora: 4,
            sets: [{ psalmLxx: '44:9', gospel: 'John 1:1-29' }],
            alternates: { psalmLxx: ['17:39-40'] }
        },
        evening: ['Isaiah 42', 'Acts 19:21-40', 'John 14']
    },
    '4/17': {
        morning: ['Isaiah 43', 'Acts 20', 'John 15'],
        matins: null,
        qidase: {
            pauline: 'Romans 8:18-31',
            universal: 'James 1:17-22',
            acts: 'Acts 15:10-13',
            anaphora: 5,
            sets: [{ psalmLxx: '2:11-12', gospel: 'Luke 11:1-14' }]
        },
        evening: ['Isaiah 44', 'Acts 21:1-16', 'John 16']
    },
    '4/18': {
        morning: ['Isaiah 45', 'Acts 21:17-40', 'John 17'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 7:13-End',
            universal: 'Jude 1:17-End',
            acts: 'Acts 5:12-17',
            anaphora: 1,
            sets: [{ psalmLxx: '18:3-4', gospel: 'John 11:9-17' }]
        },
        evening: ['Isaiah 46', 'Acts 22', 'John 18']
    },
    '4/19': {
        morning: ['Isaiah 47', 'Acts 23', 'John 19'],
        matins: null,
        qidase: {
            pauline: '2 Thessalonians 1:6-End',
            universal: 'Jude 1:20-End',
            acts: 'Acts 7:30-35',
            anaphora: 4,
            sets: [{ psalmLxx: '137:1-2', gospel: 'Luke 1:11-21' }]
        },
        evening: ['Isaiah 48', 'Acts 24', 'John 20']
    },
    '4/20': {
        morning: ['Isaiah 49', 'Acts 25', 'John 21'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 4:3-13',
            universal: '2 Peter 1:19-End',
            acts: 'Acts 7:44-51',
            anaphora: 3,
            sets: [{ psalmLxx: '104:14-15', gospel: 'Matthew 7:12-End' }],
            alternates: { gospel: ['John 1:6-15'] }
        },
        evening: ['Isaiah 50', 'Acts 26', 'Matthew 1']
    },
    '4/21': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '18:4-5', gospel: 'Luke 10:1-12' },
        qidase: {
            pauline: 'Galatians 2:1-14',
            universal: 'Jude 1:17-End',
            acts: 'Acts 11:23-End',
            anaphora: 4,
            sets: [{ psalmLxx: '44:9-10', gospel: 'Luke 1:17-39' }],
            alternates: { pauline: ['Colossians 4:1-End'] }
        },
        evening: ['Isaiah 51', 'Acts 27', 'Matthew 2']
    },
    '4/22': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '136:1-2', gospel: 'Luke 1:26-39' },
        qidase: {
            pauline: '2 Timothy 1:8-End',
            universal: '1 John 4:9-18',
            acts: 'Acts 12:7-12',
            anaphora: 4,
            sets: [{ psalmLxx: '44:16-17', gospel: 'Luke 1:39-57' }]
        },
        evening: ['Isaiah 52', 'Acts 28', 'Matthew 3']
    },
    '4/23': {
        morning: ['Isaiah 53', 'Romans 1', 'Matthew 4'],
        matins: { psalmLxx: '88:19-20', gospel: 'Matthew 22:41-End' },
        qidase: {
            pauline: '2 Timothy 2:8-19',
            universal: '1 Peter 5:2-8',
            acts: 'Acts 12:7-12',
            anaphora: 5,
            sets: [{ psalmLxx: '18:12-13', gospel: 'Luke 1:39-57' }]
        },
        evening: ['Isaiah 54', 'Romans 2', 'Matthew 5']
    },
    '4/24': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '50:14-15', gospel: 'Matthew 11:25-End' },
        qidase: {
            pauline: 'Ephesians 4:11-17',
            universal: '1 Peter 1:13-End',
            acts: 'Acts 19:11-21',
            anaphora: 1,
            sets: [{ psalmLxx: '8:2', gospel: 'Matthew 18:1-12' }]
        },
        evening: ['Isaiah 55', 'Romans 3', 'Matthew 6']
    },
    '4/25': {
        morning: ['Isaiah 56', 'Romans 4', 'Matthew 7'],
        matins: null,
        qidase: {
            pauline: 'Titus 2:13-End',
            universal: '1 John 2:12-18',
            acts: 'Acts 4:31-End',
            anaphora: 5,
            sets: [{ psalmLxx: '78:2-3', gospel: 'Matthew 13:36-44' }]
        },
        evening: ['Isaiah 57', 'Romans 5', 'Matthew 8']
    },
    '4/26': {
        morning: ['Isaiah 58', 'Romans 6', 'Matthew 9'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 7:34-End',
            universal: '1 John 5:14-End',
            acts: 'Acts 16:14-16',
            anaphora: 3,
            sets: [{ psalmLxx: '44:9', gospel: 'Matthew 25:1-16' }]
        },
        evening: ['Isaiah 59', 'Romans 7', 'Matthew 10']
    },
    '4/27': {
        morning: ['Isaiah 60', 'Romans 8:1-17', 'Matthew 11'],
        matins: { psalmLxx: '2:2-3', gospel: 'Matthew 16:21-End' },
        qidase: {
            pauline: 'Romans 16:17-End',
            universal: '1 Peter 2:21-End',
            acts: 'Acts 20:28-31',
            anaphora: 10,
            sets: [{ psalmLxx: '79:2-3', gospel: 'John 10:17-22' }]
        },
        evening: ['Isaiah 61', 'Romans 8:18-39', 'Matthew 12']
    },
    '4/28': {
        morning: ['Isaiah 62', 'Romans 9', 'Matthew 13'],
        matins: { psalmLxx: '109:3', gospel: 'Luke 1:26-57' },
        qidase: {
            pauline: 'Romans 8:3-18',
            universal: '1 John 4:1-9',
            acts: 'Acts 3:22-End',
            anaphora: 4,
            sets: [{ psalmLxx: '71:15', gospel: 'Matthew 1:1-18' }]
        },
        evening: [],
        eveningFestalHiatus: true
    },
    '4/29': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '71:10-11', gospel: 'Matthew 1:18-End' },
        qidase: {
            pauline: 'Galatians 4:1-12',
            universal: '1 John 4:9-End',
            acts: 'Acts 13:16-22',
            anaphora: 14,
            sets: [{ psalmLxx: '71:15', gospel: 'Luke 2:1-21' }]
        },
        evening: ['Isaiah 63-64', 'Romans 10', 'Matthew 14']
    },
    '4/30': {
        morning: ['Isaiah 65', 'Romans 11', 'Matthew 15'],
        matins: null,
        qidase: {
            pauline: 'Philippians 3:15-End',
            universal: '1 Peter 2:12-21',
            acts: 'Acts 19:8-21',
            anaphora: 4,
            sets: [{ psalmLxx: '78:10-11', gospel: 'Matthew 2:1-13' }]
        },
        evening: ['Isaiah 66', 'Romans 12', 'Matthew 16']
    },

    // =========================================================================
    // TIR 1 – 30 (January 9/10 – February 7/8)
    // =========================================================================
    '5/1': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '78:10-11', gospel: 'Mark 13:9-23' },
        qidase: {
            pauline: 'Hebrews 11:32-End',
            universal: '1 Peter 4:12-End',
            acts: 'Acts 7:51-8:3',
            anaphora: 3,
            sets: [{ psalmLxx: '20:3-4', gospel: 'Matthew 21:33-End' }]
        },
        evening: ['1 Samuel 1', 'Romans 13', 'Matthew 17']
    },
    '5/2': {
        morning: ['1 Samuel 2', 'Romans 14', 'Matthew 18'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 11:1-8',
            universal: '1 John 3:6-13',
            acts: 'Acts 12:18-End',
            anaphora: 5,
            sets: [{ psalmLxx: '93:21-22', gospel: 'Matthew 23:13-23' }]
        },
        evening: ['1 Samuel 3', 'Romans 15', 'Matthew 19']
    },
    '5/3': {
        morning: [],
        festalHiatus: true,
        matins: null,
        qidase: {
            pauline: 'Romans 11:25-End',
            universal: '1 Peter 2:1-11',
            acts: 'Acts 28:17-End',
            anaphora: 4,
            sets: [{ psalmLxx: '43:22-23', gospel: 'Matthew 2:13-End' }]
        },
        evening: ['1 Samuel 4', 'Romans 16', 'Matthew 20']
    },
    '5/4': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '18:3-4', gospel: 'Matthew 4:17-End' },
        qidase: {
            pauline: '1 Timothy 6:1-11',
            universal: '1 John 1:1-End',
            acts: 'Acts 4:8-24',
            anaphora: 3,
            sets: [{ psalmLxx: '138:17-18', gospel: 'John 21:20-End' }]
        },
        evening: ['1 Samuel 5', '1 Corinthians 1', 'Matthew 21']
    },
    '5/5': {
        morning: ['1 Samuel 6', '1 Corinthians 2', 'Matthew 22'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 2:11-End',
            universal: 'James 3:5-13',
            acts: 'Acts 7:44-50',
            anaphora: 8,
            sets: [{ psalmLxx: '84:6-7', gospel: 'John 18:33-38' }]
        },
        evening: ['1 Samuel 7', '1 Corinthians 3', 'Matthew 23']
    },
    '5/6': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '71:17', gospel: 'Luke 2:8-22' },
        qidase: {
            pauline: 'Romans 15:8-14',
            universal: '2 Peter 2:1-9',
            acts: 'Acts 7:2-9',
            anaphora: 12,
            sets: [{ psalmLxx: '104:14-15', gospel: 'Luke 4:24-33' }]
        },
        evening: ['1 Samuel 8', '1 Corinthians 4', 'Matthew 24']
    },
    '5/7': {
        morning: ['1 Samuel 9', '1 Corinthians 5', 'Matthew 25'],
        matins: null,
        qidase: {
            pauline: 'Colossians 2:10-16',
            universal: '1 John 2:25-End',
            acts: 'Acts 22:7-22',
            anaphora: 7,
            sets: [{ psalmLxx: '71:15', gospel: 'Matthew 2:21-End' }]
        },
        evening: ['1 Samuel 10', '1 Corinthians 6', 'Matthew 26']
    },
    '5/8': {
        morning: ['1 Samuel 11', '1 Corinthians 7', 'Matthew 27'],
        matins: null,
        qidase: {
            pauline: '2 Timothy 4:5-14',
            universal: '1 Peter 5:12-End',
            acts: 'Acts 15:36-End',
            anaphora: 9,
            sets: [{ psalmLxx: '117:15-16', gospel: 'Luke 2:39-End' }]
        },
        evening: ['1 Samuel 12', '1 Corinthians 8', 'Matthew 28']
    },
    '5/9': {
        morning: ['1 Samuel 13', '1 Corinthians 9', 'Mark 1'],
        matins: null,
        qidase: {
            pauline: 'Romans 5:1-10',
            universal: '1 John 2:8-18',
            acts: 'Acts 11:27-End',
            anaphora: 2,
            sets: [{ psalmLxx: '71:10-11', gospel: 'Matthew 5:39-End' }]
        },
        evening: ['1 Samuel 14', '1 Corinthians 10:1-13', 'Mark 2']
    },
    '5/10': {
        morning: ['1 Samuel 15', '1 Corinthians 10:14-33', 'Mark 3'],
        matins: { psalmLxx: '84:10-11', gospel: 'Matthew 3:1-13' },
        qidase: {
            pauline: 'Galatians 3:20-End',
            universal: '1 John 4:14-18',
            acts: 'Acts 13:24-30',
            anaphora: 12,
            sets: [{ psalmLxx: '76:16', gospel: 'Luke 3:21-End' }]
        },
        evening: [],
        eveningFestalHiatus: true
    },
    '5/11': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '113:3-4', gospel: 'Matthew 3:13-End' },
        qidase: {
            pauline: 'Titus 3:4-8',
            universal: '1 John 5:5-13',
            acts: 'Acts 10:34-39',
            anaphora: 9,
            sets: [{ psalmLxx: '45:7-8', gospel: 'John 1:44-End' }]
        },
        evening: ['1 Samuel 16', '1 Corinthians 11', 'Mark 4-5']
    },
    '5/12': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '83:6-7', gospel: 'Matthew 1:1-12' },
        qidase: {
            pauline: 'Romans 9:1-17',
            universal: 'Jude 1:9-14',
            acts: 'Acts 10:34-39',
            anaphora: 5,
            sets: [{ psalmLxx: '12:3', gospel: 'John 2:1-12' }],
            alternates: { psalmLxx: ['76:13'] }
        },
        evening: ['1 Samuel 17-18', '1 Corinthians 12', 'Mark 6']
    },
    '5/13': {
        morning: [],
        festalHiatus: true,
        matins: null,
        qidase: {
            pauline: '1 Corinthians 10:1-14',
            universal: '1 Peter 1:10-22',
            acts: 'Acts 2:22-33',
            anaphora: 9,
            sets: [{ psalmLxx: '78:10-11', gospel: 'Mark 10:29-31' }],
            alternates: { gospel: ['John 3:22-End'] }
        },
        evening: ['1 Samuel 19', '1 Corinthians 13', 'Mark 7']
    },
    '5/14': {
        morning: ['1 Samuel 20', '1 Corinthians 14:1-25', 'Mark 8'],
        matins: null,
        qidase: {
            pauline: 'Galatians 1:15-End',
            universal: '1 John 5:18-End',
            acts: 'Acts 22:14-22',
            anaphora: 12,
            sets: [{ psalmLxx: '39:4-5', gospel: 'Matthew 5:25-33' }],
            alternates: { psalmLxx: ['105:39-40'] }
        },
        evening: ['1 Samuel 21', '1 Corinthians 14:26-40', 'Mark 9']
    },
    '5/15': {
        morning: ['1 Samuel 22', '1 Corinthians 15:1-32', 'Mark 10'],
        matins: { psalmLxx: '78:2-3', gospel: 'John 16:1-5' },
        qidase: {
            pauline: 'Hebrews 12:1-11',
            universal: '1 Peter 4:11-15',
            acts: 'Acts 16:14-19',
            anaphora: 12,
            sets: [{ psalmLxx: '65:12-13', gospel: 'Matthew 18:1-12' }]
        },
        evening: ['1 Samuel 23', '1 Corinthians 15:33-58', 'Mark 11']
    },
    '5/16': {
        morning: ['1 Samuel 24', '1 Corinthians 16', 'Mark 12'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 13:12-End',
            universal: '1 John 3:1-7',
            acts: 'Acts 20:9-13',
            anaphora: 5,
            sets: [{ psalmLxx: '90:10-11', gospel: 'John 5:25-33' }]
        },
        evening: ['1 Samuel 25', '2 Corinthians 1', 'Mark 13']
    },
    '5/17': {
        morning: ['1 Samuel 26', '2 Corinthians 2', 'Mark 14'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 8:16-End',
            universal: '1 Peter 3:8-15',
            acts: 'Acts 19:8-11',
            anaphora: 9,
            sets: [{ psalmLxx: '35:7-8', gospel: 'Luke 10:12-21' }]
        },
        evening: ['1 Samuel 27', '2 Corinthians 3', 'Mark 15']
    },
    '5/18': {
        morning: ['1 Samuel 28', '2 Corinthians 4', 'Mark 16'],
        matins: { psalmLxx: '101:3', gospel: 'John 11:19-33' },
        qidase: {
            pauline: 'Romans 8:35-End',
            universal: '1 Peter 3:1-7',
            acts: 'Acts 17:30-End',
            anaphora: 3,
            sets: [{ psalmLxx: '33:19-20', gospel: 'Matthew 5:1-17' }],
            alternates: { gospel: ['Mark 16:19-End'] }
        },
        evening: ['1 Samuel 29', '2 Corinthians 5', 'Luke 1']
    },
    '5/19': {
        morning: ['1 Samuel 30', '2 Corinthians 6', 'Luke 2'],
        matins: null,
        qidase: {
            pauline: 'Colossians 1:27-End',
            universal: '1 John 5:14-End',
            acts: 'Acts 4:32-36',
            anaphora: 5,
            sets: [{ psalmLxx: '33:20-21', gospel: 'Matthew 5:42-End' }],
            alternates: { acts: ['Acts 17:5-10'], psalmLxx: ['78:10-11'] }
        },
        evening: ['1 Samuel 31', '2 Corinthians 7', 'Luke 3']
    },
    '5/20': {
        morning: ['2 Samuel 1', '2 Corinthians 8', 'Luke 4'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 12:28-End',
            universal: 'Jude 1:17-End',
            acts: 'Acts 2:1-9',
            anaphora: 9,
            sets: [{ psalmLxx: '47:8', gospel: 'Luke 1:47-57' }]
        },
        evening: ['2 Samuel 2', '2 Corinthians 9', 'Luke 5']
    },
    '5/21': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '147:1-2', gospel: 'Luke 1:39-57' },
        qidase: {
            pauline: 'Galatians 4:1-12',
            universal: '2 John 1:1-7',
            acts: 'Acts 7:30-35',
            anaphora: 4,
            sets: [{ psalmLxx: '47:8', gospel: 'Luke 1:47-57' }]
        },
        evening: ['2 Samuel 3', '2 Corinthians 10:1-9', 'Luke 6']
    },
    '5/22': {
        morning: ['2 Samuel 4', '2 Corinthians 10:10-18', 'Luke 7'],
        matins: null,
        qidase: {
            pauline: 'Ephesians 6:10-End',
            universal: '1 Peter 4:4-12',
            acts: 'Acts 15:1-4',
            anaphora: 5,
            sets: [{ psalmLxx: '91:12-13', gospel: 'Matthew 6:6-19' }],
            alternates: { acts: ['Acts 28:1-11'] }
        },
        evening: ['2 Samuel 5', '2 Corinthians 11:1-15', 'Luke 8']
    },
    '5/23': {
        morning: ['2 Samuel 6', '2 Corinthians 11:16-33', 'Luke 9'],
        matins: { psalmLxx: '20:10', gospel: 'Luke 10:17-25' },
        qidase: {
            pauline: '2 Timothy 1:1-10',
            universal: '1 Peter 3:13-18',
            acts: 'Acts 16:1-13',
            anaphora: 1,
            sets: [{ psalmLxx: '50:12-13', gospel: 'Luke 12:17-35' }]
        },
        evening: ['2 Samuel 7', '2 Corinthians 12', 'Luke 10']
    },
    '5/24': {
        morning: ['2 Samuel 8', '2 Corinthians 13', 'Luke 11'],
        matins: { psalmLxx: '83:6-7', gospel: 'Matthew 5:13-17' },
        qidase: {
            pauline: 'Titus 2:1-9',
            universal: '1 Peter 3:2-5',
            acts: 'Acts 20:28-31',
            anaphora: 7,
            sets: [{ psalmLxx: '131:9-10', gospel: 'Luke 18:1-9' }]
        },
        evening: ['2 Samuel 9', 'Galatians 1', 'Luke 12']
    },
    '5/25': {
        morning: ['2 Samuel 10', 'Galatians 2', 'Luke 13'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 9:5-End',
            universal: '1 John 3:16-End',
            acts: 'Acts 4:29-End',
            anaphora: 3,
            sets: [{ psalmLxx: '111:9', gospel: 'Mark 10:17-28' }]
        },
        evening: ['2 Samuel 11', 'Galatians 3', 'Luke 14']
    },
    '5/26': {
        morning: ['2 Samuel 12', 'Galatians 4', 'Luke 15'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 2:1-8',
            universal: '1 Peter 5:9-End',
            acts: 'Acts 4:29-End',
            anaphora: 13,
            sets: [{ psalmLxx: '65:13-14', gospel: 'Luke 11:1-19' }],
            alternates: { anaphora: [2] }
        },
        evening: ['2 Samuel 13', 'Galatians 5', 'Luke 16']
    },
    '5/27': {
        morning: ['2 Samuel 14', 'Galatians 6', 'Luke 17'],
        matins: { psalmLxx: '26:13-14', gospel: 'Luke 22:31-End' },
        qidase: {
            pauline: 'Hebrews 11:5-8',
            universal: 'Jude 1:11-17',
            acts: 'Acts 17:14-22',
            anaphora: 12,
            sets: [{ psalmLxx: '43:22-23', gospel: 'Matthew 11:8-17' }]
        },
        evening: ['2 Samuel 15', 'Ephesians 1', 'Luke 18']
    },
    '5/28': {
        morning: ['2 Samuel 16', 'Ephesians 2', 'Luke 19'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 11:8-17',
            universal: '1 Peter 4:12-End',
            acts: 'Acts 2:32-40',
            anaphora: 5,
            sets: [{ psalmLxx: '67:24-25', gospel: 'Matthew 15:32-End' }]
        },
        evening: ['2 Samuel 17', 'Ephesians 3', 'Luke 20']
    },
    '5/29': {
        morning: ['2 Samuel 18', 'Ephesians 4', 'Luke 21'],
        matins: { psalmLxx: '109:3', gospel: 'Luke 12:16-40' },
        qidase: {
            pauline: '1 Timothy 3:14-End',
            universal: '1 John 1:9-End',
            acts: 'Acts 3:12-17',
            anaphora: 4,
            sets: [{ psalmLxx: '38:12', gospel: 'John 1:7-15' }]
        },
        evening: ['2 Samuel 19', 'Ephesians 5', 'Luke 22']
    },
    '5/30': {
        morning: ['2 Samuel 20', 'Ephesians 6', 'Luke 23'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 5:1-7',
            universal: '1 Peter 5:2-5',
            acts: 'Acts 9:36-End',
            anaphora: 4,
            sets: [{ psalmLxx: '44:14-15', gospel: 'Luke 23:26-32' }]
        },
        evening: ['2 Samuel 21', 'Philippians 1', 'Luke 24']
    },

    // =========================================================================
    // YEKATIT 1 – 30 (February 8/9 – March 9)
    // =========================================================================
    '6/1': {
        morning: ['2 Samuel 22', 'Philippians 2', 'John 1'],
        matins: null,
        qidase: {
            pauline: 'Ephesians 4:17-End',
            universal: 'Jude 1:17-23',
            acts: 'Acts 20:28-31',
            anaphora: 5,
            sets: [{ psalmLxx: '32:5-6', gospel: 'John 15:26-27' }]
        },
        evening: ['2 Samuel 23', 'Philippians 3', 'John 2']
    },
    '6/2': {
        morning: ['2 Samuel 24', 'Philippians 4', 'John 3'],
        matins: null,
        qidase: {
            pauline: 'Ephesians 6:10-19',
            universal: 'Jude 1:17-End',
            acts: 'Acts 28:1-7',
            anaphora: 3,
            sets: [{ psalmLxx: '73:13-14', gospel: 'Mark 16:14-End' }]
        },
        evening: ['1 Kings 1', 'Colossians 1', 'John 4']
    },
    '6/3': {
        morning: ['1 Kings 2', 'Colossians 2', 'John 5'],
        matins: null,
        qidase: {
            pauline: 'Romans 2:1-17',
            universal: 'James 4:7-End',
            acts: 'Acts 20:9-16',
            anaphora: 11,
            sets: [{ psalmLxx: '114:8', gospel: 'Luke 7:12-18' }]
        },
        evening: ['1 Kings 3', 'Colossians 3', 'John 6']
    },
    '6/4': {
        morning: [],
        festalHiatus: true,
        matins: null,
        qidase: {
            pauline: '1 Corinthians 12:28-End',
            universal: 'James 1:17-End',
            acts: 'Acts 21:10-15',
            anaphora: 1,
            sets: [{ psalmLxx: '83:6-7', gospel: 'Luke 10:1-12' }]
        },
        evening: ['1 Kings 4', 'Colossians 4', 'John 7']
    },
    '6/5': {
        morning: ['1 Kings 5', '1 Thessalonians 1', 'John 8'],
        matins: null,
        qidase: {
            pauline: 'Romans 5:15-End',
            universal: 'Jude 1:20-End',
            acts: 'Acts 21:15-27',
            anaphora: 7,
            sets: [{ psalmLxx: '31:1-2', gospel: 'Matthew 9:10-19' }]
        },
        evening: ['1 Kings 6', '1 Thessalonians 2', 'John 9']
    },
    '6/6': {
        morning: ['1 Kings 7', '1 Thessalonians 3', 'John 10'],
        matins: null,
        qidase: {
            pauline: 'Romans 1:15-18',
            universal: 'James 4:1-10',
            acts: 'Acts 27:39-End',
            anaphora: 5,
            sets: [{ psalmLxx: '44:8-9', gospel: 'Matthew 26:6-17' }]
        },
        evening: ['1 Kings 8', '1 Thessalonians 4', 'John 11']
    },
    '6/7': {
        morning: ['1 Kings 9', '1 Thessalonians 5', 'John 12'],
        matins: null,
        qidase: {
            pauline: 'Ephesians 6:10-19',
            universal: 'Revelation 13:11-End',
            acts: 'Acts 20:28-31',
            anaphora: 7,
            sets: [{ psalmLxx: '43:5-6', gospel: 'Luke 19:11-28' }]
        },
        evening: ['1 Kings 10', '2 Thessalonians 1', 'John 13']
    },
    '6/8': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '102:5-6', gospel: 'Luke 2:36-40' },
        qidase: {
            pauline: '1 Timothy 5:5-11',
            universal: 'James 5:13-End',
            acts: 'Acts 3:17-End',
            anaphora: 5,
            sets: [{ psalmLxx: '44:1-2', gospel: 'Luke 2:22-35' }]
        },
        evening: ['1 Kings 11', '2 Thessalonians 2', 'John 14']
    },
    '6/9': {
        morning: ['1 Kings 12', '2 Thessalonians 3', 'John 15'],
        matins: null,
        qidase: {
            pauline: 'Titus 3:8-End',
            universal: '2 John 1:8-End',
            acts: 'Acts 10:36-48',
            anaphora: 1,
            sets: [{ psalmLxx: '111:6', gospel: 'John 8:51-End' }]
        },
        evening: ['1 Kings 13', '1 Timothy 1', 'John 16']
    },
    '6/10': {
        morning: ['1 Kings 14', '1 Timothy 2', 'John 17'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 12:4-28',
            universal: 'Jude 1:17-End',
            acts: 'Acts 1:12-15',
            anaphora: 1,
            sets: [{ psalmLxx: '18:3-4', gospel: 'Matthew 10:1-9' }]
        },
        evening: ['1 Kings 15', '1 Timothy 3', 'John 18']
    },
    '6/11': {
        morning: ['1 Kings 16', '1 Timothy 4', 'John 19'],
        matins: null,
        qidase: {
            pauline: '2 Timothy 4:14-19',
            universal: 'James 3:5-11',
            acts: 'Acts 14:19-End',
            anaphora: 7,
            sets: [{ psalmLxx: '49:10-11', gospel: 'Mark 1:12-17' }]
        },
        evening: ['1 Kings 17', '1 Timothy 5-6', 'John 20-21']
    },
    '6/12': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '33:7-8', gospel: 'Matthew 25:31-End' },
        qidase: {
            pauline: '1 Corinthians 5:6-End',
            universal: 'Jude 1:9-19',
            acts: 'Acts 28:30-End',
            anaphora: 12,
            sets: [{ psalmLxx: '138:17-18', gospel: 'Matthew 20:24-29' }]
        },
        evening: ['1 Kings 18-19', '2 Timothy 1', 'Matthew 1']
    },
    '6/13': {
        morning: ['1 Kings 20', '2 Timothy 2', 'Matthew 2'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 12:1-11',
            universal: '1 Peter 1:6-11',
            acts: 'Acts 15:22-36',
            anaphora: 5,
            sets: [{ psalmLxx: '138:7-8', gospel: 'Matthew 5:27-33' }]
        },
        evening: ['1 Kings 21', '2 Timothy 3', 'Matthew 3']
    },
    '6/14': {
        morning: ['1 Kings 22', '2 Timothy 4', 'Matthew 4'],
        matins: null,
        qidase: {
            pauline: 'Titus 1:7-12',
            universal: '1 John 2:20-End',
            acts: 'Acts 20:28-End',
            anaphora: 11,
            sets: [{ psalmLxx: '44:5', gospel: 'Matthew 18:15-23' }]
        },
        evening: ['2 Kings 1', 'Titus 1', 'Matthew 5']
    },
    '6/15': {
        morning: ['2 Kings 2', 'Titus 2', 'Matthew 6'],
        matins: null,
        qidase: {
            pauline: '1 Thessalonians 5:4-End',
            universal: '2 Peter 1:19-End',
            acts: 'Acts 3:17-End',
            anaphora: 5,
            sets: [{ psalmLxx: '147:1-2', gospel: 'Matthew 21:1-7' }]
        },
        evening: ['2 Kings 3', 'Titus 3', 'Matthew 7']
    },
    '6/16': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '112:9', gospel: 'Luke 1:5-18' },
        qidase: {
            pauline: 'Galatians 4:1-12',
            universal: '2 John 1:4-8',
            acts: 'Acts 1:13-15',
            anaphora: 5,
            sets: [{ psalmLxx: '88:2-3', gospel: 'Luke 1:39-57' }]
        },
        evening: ['2 Kings 4', 'Philemon 1', 'Matthew 8']
    },
    '6/17': {
        morning: ['2 Kings 5', 'Hebrews 1', 'Matthew 9'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 11:23-29',
            universal: 'Jude 1:6-11',
            acts: 'Acts 7:20-44',
            anaphora: 4,
            sets: [{ psalmLxx: '102:7-8', gospel: 'Luke 20:37-41' }]
        },
        evening: ['2 Kings 6', 'Hebrews 2', 'Matthew 10']
    },
    '6/18': {
        morning: ['2 Kings 7', 'Hebrews 3', 'Matthew 11'],
        matins: null,
        qidase: {
            pauline: 'Galatians 1:15-End',
            universal: 'James 1:1-12',
            acts: 'Acts 21:17-26',
            anaphora: 2,
            sets: [{ psalmLxx: '18:3-4', gospel: 'Matthew 13:43-End' }]
        },
        evening: ['2 Kings 8', 'Hebrews 4', 'Matthew 12']
    },
    '6/19': {
        morning: ['2 Kings 9', 'Hebrews 5', 'Matthew 13'],
        matins: null,
        qidase: {
            pauline: 'Romans 7:22-End',
            universal: 'James 4:1-11',
            acts: 'Acts 16:16-22',
            anaphora: 5,
            sets: [{ psalmLxx: '17:29-30', gospel: 'Luke 13:1-18' }]
        },
        evening: ['2 Kings 10', 'Hebrews 6', 'Matthew 14']
    },
    '6/20': {
        morning: ['2 Kings 11', 'Hebrews 7', 'Matthew 15'],
        matins: null,
        qidase: {
            pauline: '2 Timothy 3:1-13',
            universal: '1 Peter 5:1-11',
            acts: 'Acts 9:23-32',
            anaphora: 5,
            sets: [{ psalmLxx: '33:14-15', gospel: 'Matthew 5:1-17' }]
        },
        evening: ['2 Kings 12', 'Hebrews 8', 'Matthew 16']
    },
    '6/21': {
        morning: ['2 Kings 13', 'Hebrews 9:1-10', 'Matthew 17'],
        matins: { psalmLxx: '44:9-10', gospel: 'Luke 1:46-47' },
        qidase: {
            pauline: 'Philemon 1:10-End',
            universal: '1 Peter 5:5-End',
            acts: 'Acts 13:1-7',
            anaphora: 4,
            sets: [{ psalmLxx: '21:5-6', gospel: 'Luke 22:24-31' }]
        },
        evening: ['2 Kings 14', 'Hebrews 9:11-28', 'Matthew 18']
    },
    '6/22': {
        morning: ['2 Kings 15', 'Hebrews 10:1-18', 'Matthew 19'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 12:1-12',
            universal: '1 Peter 1:6-10',
            acts: 'Acts 16:16-19',
            anaphora: 5,
            sets: [{ psalmLxx: '142:7-8', gospel: 'Luke 13:10-18' }]
        },
        evening: ['2 Kings 16', 'Hebrews 10:19-39', 'Matthew 20']
    },
    '6/23': {
        morning: ['2 Kings 17', 'Hebrews 11:1-16', 'Matthew 21'],
        matins: { psalmLxx: '78:10-11', gospel: 'Matthew 26:47-55' },
        qidase: {
            pauline: '2 Corinthians 4:7-End',
            universal: '1 Peter 4:12-End',
            acts: 'Acts 9:23-32',
            anaphora: 3,
            sets: [{ psalmLxx: '79:6-7', gospel: 'John 16:1-7' }]
        },
        evening: ['2 Kings 18', 'Hebrews 11:17-40', 'Matthew 22']
    },
    '6/24': {
        morning: ['2 Kings 19', 'Hebrews 12:1-17', 'Matthew 23'],
        matins: null,
        qidase: {
            pauline: 'Romans 13:1-11',
            universal: '1 Peter 2:16-End',
            acts: 'Acts 19:11-21',
            anaphora: 5,
            sets: [{ psalmLxx: '118:50-52', gospel: 'Mark 1:23-29' }]
        },
        evening: ['2 Kings 20', 'Hebrews 12:18-29', 'Matthew 24']
    },
    '6/25': {
        morning: ['2 Kings 21', 'Hebrews 13', 'Matthew 25'],
        matins: null,
        qidase: {
            pauline: 'Philemon 1:1-13',
            universal: '2 Peter 1:10-15',
            acts: 'Acts 9:1-10',
            anaphora: 5,
            sets: [{ psalmLxx: '64:4-5', gospel: 'Luke 9:12-17' }]
        },
        evening: ['2 Kings 22', 'James 1', 'Matthew 26']
    },
    '6/26': {
        morning: ['2 Kings 23', 'James 2', 'Matthew 27'],
        matins: null,
        qidase: {
            pauline: 'Romans 9:24-30',
            universal: '2 Peter 1:19-End',
            acts: 'Acts 3:17-End',
            anaphora: 3,
            sets: [{ psalmLxx: '78:10-11', gospel: 'Matthew 10:36-End' }]
        },
        evening: ['2 Kings 24', 'James 3', 'Matthew 28']
    },
    '6/27': {
        morning: ['2 Kings 25', 'James 4', 'Mark 1'],
        matins: null,
        qidase: {
            pauline: 'Romans 6:5-12',
            universal: '1 Peter 2:21-End',
            acts: 'Acts 10:36-44',
            anaphora: 10,
            sets: [{ psalmLxx: '73:12-13', gospel: 'John 19:16-25' }]
        },
        evening: ['Ezra 1', 'James 5', 'Mark 2']
    },
    '6/28': {
        morning: ['Ezra 2-3', '1 Peter 1:1-12', 'Mark 3'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 11:8-22',
            universal: 'James 3:1-End',
            acts: 'Acts 7:1-16',
            anaphora: 4,
            sets: [{ psalmLxx: '104:9', gospel: 'Luke 20:37-End' }]
        },
        evening: ['Ezra 4', '1 Peter 1:13-25', 'Mark 4']
    },
    '6/29': {
        morning: ['Ezra 5', '1 Peter 2', 'Mark 5'],
        matins: null,
        qidase: {
            pauline: 'Romans 8:3-12',
            universal: '1 John 4:7-18',
            acts: 'Acts 9:20-32',
            anaphora: 2,
            sets: [{ psalmLxx: '2:7-8', gospel: 'Luke 2:1-21' }]
        },
        evening: ['Ezra 6', '1 Peter 3', 'Mark 6']
    },
    '6/30': {
        morning: ['Ezra 7-8', '1 Peter 4:1-11', 'Mark 7'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 4:7-End',
            universal: '2 Peter 1:19-End',
            acts: 'Acts 13:24-32',
            anaphora: 3,
            sets: [{ psalmLxx: '117:18-19', gospel: 'Mark 6:21-34' }]
        },
        evening: ['Ezra 9-10', '1 Peter 4:12-19', 'Mark 8']
    },

    // =========================================================================
    // MEGABIT 1 – 30 (March 10 – April 8)
    // =========================================================================
    '7/1': {
        morning: ['Nehemiah 1', '1 Peter 5', 'Mark 9'],
        matins: null,
        qidase: {
            pauline: '2 Timothy 2:1-17',
            universal: 'James 1:5-15',
            acts: 'Acts 15:1-13',
            anaphora: 5,
            sets: [{ psalmLxx: '15:5-6', gospel: 'Matthew 10:17-26' }]
        },
        evening: ['Nehemiah 2', '2 Peter 1', 'Mark 10']
    },
    '7/2': {
        morning: ['Nehemiah 3-4', '2 Peter 2', 'Mark 11'],
        matins: null,
        qidase: {
            pauline: 'Romans 1:8-18',
            universal: '1 John 1:1-End',
            acts: 'Acts 8:14-26',
            anaphora: 7,
            sets: [{ psalmLxx: '36:30-31', gospel: 'Matthew 5:20-31' }]
        },
        evening: ['Nehemiah 5', '2 Peter 3', 'Mark 12']
    },
    '7/3': {
        morning: ['Nehemiah 6', '1 John 1', 'Mark 13'],
        matins: null,
        qidase: {
            pauline: '2 Thessalonians 1:3-End',
            universal: '2 Peter 3:14-End',
            acts: 'Acts 4:13-27',
            anaphora: 5,
            sets: [{ psalmLxx: '61:4', gospel: 'Matthew 12:25-38' }]
        },
        evening: ['Nehemiah 7-8', '1 John 2', 'Mark 14']
    },
    '7/4': {
        morning: ['Nehemiah 9-10', '1 John 3', 'Mark 15'],
        matins: null,
        qidase: {
            pauline: 'Philippians 3:1-End',
            universal: '2 John 1:1-End',
            acts: 'Acts 20:1-7',
            anaphora: 13,
            sets: [{ psalmLxx: '25:5-6', gospel: 'Luke 22:1-24' }]
        },
        evening: ['Nehemiah 11-12', '1 John 4', 'Mark 16']
    },
    '7/5': {
        morning: ['Nehemiah 13', '1 John 5', 'Luke 1'],
        matins: null,
        qidase: {
            pauline: 'Romans 14:1-End',
            universal: '1 Peter 4:1-12',
            acts: 'Acts 17:19-End',
            anaphora: 5,
            sets: [{ psalmLxx: '115:6-7', gospel: 'Matthew 6:19-End' }]
        },
        evening: ['Esther 1', '2 John 1', 'Luke 2']
    },
    '7/6': {
        morning: ['Esther 2', '3 John 1', 'Luke 3'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 3:9-End',
            universal: '1 Peter 5:5-12',
            acts: 'Acts 2:38-End',
            anaphora: 5,
            sets: [{ psalmLxx: '1:1', gospel: 'Luke 15:11-End' }]
        },
        evening: ['Esther 3', 'Jude 1', 'Luke 4']
    },
    '7/7': {
        morning: ['Esther 4', 'Acts 1', 'Luke 5'],
        matins: null,
        qidase: {
            pauline: 'Romans 8:31-End',
            universal: '1 John 2:14-20',
            acts: 'Acts 5:17-34',
            anaphora: 3,
            sets: [{ psalmLxx: '110:10', gospel: 'Matthew 10:28-End' }]
        },
        evening: ['Esther 5', 'Acts 2:1-21', 'Luke 6']
    },
    '7/8': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '26:1-2', gospel: 'Luke 18:35-End' },
        qidase: {
            pauline: 'Romans 2:1-17',
            universal: 'Jude 1:17-End',
            acts: 'Acts 1:15-End',
            anaphora: 1,
            sets: [{ psalmLxx: '18:3-4', gospel: 'Matthew 10:1-16' }]
        },
        evening: ['Esther 6', 'Acts 2:22-47', 'Luke 7']
    },
    '7/9': {
        morning: ['Esther 7', 'Acts 3', 'Luke 8'],
        matins: null,
        qidase: {
            pauline: 'Galatians 1:1-11',
            universal: 'James 2:1-14',
            acts: 'Acts 4:13-19',
            anaphora: 11,
            sets: [{ psalmLxx: '33:11-12', gospel: 'Mark 1:23-29' }]
        },
        evening: ['Esther 8', 'Acts 4', 'Luke 9']
    },
    '7/10': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '83:6', gospel: 'Matthew 5:1-16' },
        qidase: {
            pauline: 'Galatians 6:1-End',
            universal: 'James 4:1-11',
            acts: 'Acts 4:1-13',
            anaphora: 10,
            sets: [{ psalmLxx: '59:3-5', gospel: 'Matthew 16:24-End' }]
        },
        evening: ['Esther 9-10', 'Acts 5:1-16', 'Luke 10']
    },
    '7/11': {
        morning: ['Job 1', 'Acts 5:17-42', 'Luke 11'],
        matins: null,
        qidase: {
            pauline: 'Titus 1:1-6',
            universal: 'James 2:14-End',
            acts: 'Acts 27:22-27',
            anaphora: 7,
            sets: [{ psalmLxx: '25:1', gospel: 'Matthew 18:1-12' }]
        },
        evening: ['Job 2', 'Acts 6', 'Luke 12']
    },
    '7/12': {
        morning: ['Job 3', 'Acts 7:1-34', 'Luke 13'],
        matins: { psalmLxx: '100:6', gospel: 'Matthew 5:1-17' },
        qidase: {
            pauline: '1 Corinthians 7:1-8',
            universal: '2 Peter 2:9-End',
            acts: 'Acts 27:1-11',
            anaphora: 12,
            sets: [{ psalmLxx: '33:7-8', gospel: 'Matthew 18:10-21' }]
        },
        evening: ['Job 4', 'Acts 7:35-60', 'Luke 14']
    },
    '7/13': {
        morning: ['Job 5', 'Acts 8:1-25', 'Luke 15'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 3:1-11',
            universal: '2 Peter 1:1-12',
            acts: 'Acts 17:5-13',
            anaphora: 7,
            sets: [{ psalmLxx: '33:19', gospel: 'Matthew 5:1-17' }]
        },
        evening: ['Job 6', 'Acts 8:26-40', 'Luke 16']
    },
    '7/14': {
        morning: ['Job 7', 'Acts 9', 'Luke 17'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 6:9-End',
            universal: 'James 4:6-End',
            acts: 'Acts 6:1-8',
            anaphora: 7,
            sets: [{ psalmLxx: '83:6-7', gospel: 'Matthew 7:1-15' }]
        },
        evening: ['Job 8', 'Acts 10:1-29', 'Luke 18']
    },
    '7/15': {
        morning: ['Job 9', 'Acts 10:30-48', 'Luke 19'],
        matins: null,
        qidase: {
            pauline: 'Ephesians 5:21-End',
            universal: '1 John 5:14-End',
            acts: 'Acts 26:1-End',
            anaphora: 7,
            sets: [{ psalmLxx: '36:29-30', gospel: 'Luke 10:19-25' }]
        },
        evening: ['Job 10', 'Acts 11', 'Luke 20']
    },
    '7/16': {
        morning: ['Job 11', 'Acts 12', 'Luke 21'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 4:1-End',
            universal: '2 Peter 1:11-19',
            acts: 'Acts 11:23-26',
            anaphora: 5,
            sets: [{ psalmLxx: '67:30-31', gospel: 'Luke 14:23-End' }]
        },
        evening: ['Job 12', 'Acts 13:1-15', 'Luke 22']
    },
    '7/17': {
        morning: ['Job 13', 'Acts 13:16-52', 'Luke 23'],
        matins: null,
        qidase: {
            pauline: 'Romans 15:19-End',
            universal: 'James 5:14-End',
            acts: 'Acts 2:22-25',
            anaphora: 2,
            sets: [{ psalmLxx: '3:4-5', gospel: 'John 11:1-16' }]
        },
        evening: ['Job 14', 'Acts 14', 'Luke 24']
    },
    '7/18': {
        morning: ['Job 15', 'Acts 15:1-12', 'John 1'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 16:1-12',
            universal: '1 Peter 2:1-11',
            acts: 'Acts 22:24-End',
            anaphora: 3,
            sets: [{ psalmLxx: '118:1-2', gospel: 'Luke 18:18-23' }]
        },
        evening: ['Job 16', 'Acts 15:13-41', 'John 2']
    },
    '7/19': {
        morning: ['Job 17', 'Acts 16:1-15', 'John 3'],
        matins: null,
        qidase: {
            pauline: 'Romans 16:3-16',
            universal: '1 Peter 3:7-15',
            acts: 'Acts 22:22-End',
            anaphora: 1,
            sets: [{ psalmLxx: '78:10-11', gospel: 'Luke 10:1-21' }]
        },
        evening: ['Job 18', 'Acts 16:16-40', 'John 4']
    },
    '7/20': {
        morning: ['Job 19', 'Acts 17', 'John 5'],
        matins: null,
        qidase: {
            pauline: 'Philippians 1:12-18',
            universal: 'James 5:1-8',
            acts: 'Acts 24:10-22',
            anaphora: 3,
            sets: [{ psalmLxx: '43:22-23', gospel: 'John 11:17-47' }]
        },
        evening: ['Job 20', 'Acts 18', 'John 6']
    },
    '7/21': {
        morning: ['Job 21', 'Acts 19:1-20', 'John 7'],
        matins: { psalmLxx: '50:9-10', gospel: 'John 12:1-12' },
        qidase: {
            pauline: 'Ephesians 2:1-End',
            universal: '2 John 1:1-8',
            acts: 'Acts 7:44-51',
            anaphora: 2,
            sets: [{ psalmLxx: '49:9-10', gospel: 'Luke 1:27-39' }]
        },
        evening: ['Job 22', 'Acts 19:21-40', 'John 8']
    },
    '7/22': {
        morning: ['Job 23', 'Acts 20', 'John 9'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 4:1-7',
            universal: '2 John 1:8-End',
            acts: 'Acts 5:1-17',
            anaphora: 11,
            sets: [{ psalmLxx: '8:2', gospel: 'Matthew 21:1-18' }]
        },
        evening: ['Job 24', 'Acts 21:1-16', 'John 10']
    },
    '7/23': {
        morning: ['Job 25', 'Acts 21:17-40', 'John 11'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 11:32-End',
            universal: '2 Peter 1:19-End',
            acts: 'Acts 7:51-55',
            anaphora: 4,
            sets: [{ psalmLxx: '104:14-15', gospel: 'Matthew 21:18-23' }]
        },
        evening: ['Job 26', 'Acts 22', 'John 12']
    },
    '7/24': {
        morning: ['Job 27', 'Acts 23', 'John 13'],
        matins: null,
        qidase: {
            pauline: 'Galatians 4:12-21',
            universal: '1 Peter 1:21-End',
            acts: 'Acts 28:28-End',
            anaphora: 5,
            sets: [{ psalmLxx: '81:1-2', gospel: 'Matthew 26:1-6' }]
        },
        evening: ['Job 28', 'Acts 24', 'John 14']
    },
    '7/25': {
        morning: ['Job 29', 'Acts 25', 'John 15'],
        matins: null,
        qidase: {
            pauline: '2 Timothy 1:10-End',
            universal: '2 Peter 2:1-6',
            acts: 'Acts 20:22-28',
            anaphora: 1,
            sets: [{ psalmLxx: '18:3-4', gospel: 'Luke 7:11-18' }]
        },
        evening: ['Job 30', 'Acts 26', 'John 16']
    },
    '7/26': {
        morning: ['Job 31', 'Acts 27', 'John 17'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 11:20-30',
            universal: '1 John 3:18-End',
            acts: 'Acts 4:24-31',
            anaphora: 9,
            sets: [{ psalmLxx: '50:7-8', gospel: 'Matthew 26:14-31' }]
        },
        evening: ['Job 32', 'Acts 28', 'John 18']
    },
    '7/27': {
        morning: [],
        festalHiatus: true,
        matins: null,
        qidase: {
            pauline: 'Hebrews 12:2-18',
            universal: '1 Peter 3:15-20',
            acts: 'Acts 10:30-40',
            anaphora: 10,
            sets: [{ psalmLxx: '73:12-13', gospel: 'Matthew 27:1-55' }]
        },
        evening: ['Job 33', 'Romans 1', 'John 19']
    },
    '7/28': {
        morning: ['Job 34', 'Romans 2', 'John 20'],
        matins: null,
        qidase: {
            pauline: 'Philippians 2:5-12',
            universal: '1 Peter 1:1-10',
            acts: 'Acts 3:12-17',
            anaphora: 10,
            sets: [{ psalmLxx: '104:9', gospel: 'Matthew 27:62-End' }]
        },
        evening: ['Job 35', 'Romans 3', 'John 21']
    },
    '7/29': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '2:6-7', gospel: 'Luke 1:26-39' },
        qidase: {
            pauline: 'Hebrews 1:1-End',
            universal: '1 Peter 1:13-22',
            acts: 'Acts 17:13-30',
            anaphora: 4,
            sets: [{ psalmLxx: '101:25-26', gospel: 'John 1:1-15' }]
        },
        evening: ['Job 36', 'Romans 4', 'Matthew 1']
    },
    '7/30': {
        morning: ['Job 37', 'Romans 5', 'Matthew 2'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 11:32-35',
            universal: '2 Peter 3:3-6',
            acts: 'Acts 12:6-18',
            anaphora: 4,
            sets: [{ psalmLxx: '137:1-2', gospel: 'Luke 1:26-39' }]
        },
        evening: ['Job 38', 'Romans 6', 'Matthew 3']
    },

    // =========================================================================
    // MIYAZYA 1 – 30 (April 9 – May 8)
    // =========================================================================
    '8/1': {
        morning: ['Job 39', 'Romans 7', 'Matthew 4'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 5:1-10',
            universal: '1 Peter 3:8-18',
            acts: 'Acts 7:35-44',
            anaphora: 9,
            sets: [{ psalmLxx: '104:26-27', gospel: 'Matthew 6:1-16' }]
        },
        evening: ['Job 40', 'Romans 8:1-17', 'Matthew 5']
    },
    '8/2': {
        morning: ['Job 41', 'Romans 8:18-39', 'Matthew 6'],
        matins: null,
        qidase: {
            pauline: 'Romans 11:13-25',
            universal: 'James 3:1-13',
            acts: 'Acts 14:11-19',
            anaphora: 13,
            sets: [{ psalmLxx: '104:27-28', gospel: 'Matthew 15:21-29' }]
        },
        evening: ['Job 42', 'Romans 9', 'Matthew 7']
    },
    '8/3': {
        morning: ['Proverbs 1', 'Romans 10', 'Matthew 8'],
        matins: null,
        qidase: {
            pauline: 'Galatians 1:20-2:6',
            universal: '1 Peter 2:3-11',
            acts: 'Acts 17:22-28',
            anaphora: 13,
            sets: [{ psalmLxx: '134:5-6', gospel: 'Matthew 16:5-13' }]
        },
        evening: ['Proverbs 2', 'Romans 11', 'Matthew 9']
    },
    '8/4': {
        morning: ['Proverbs 3', 'Romans 12', 'Matthew 10'],
        matins: null,
        qidase: {
            pauline: '2 Timothy 3:1-10',
            universal: '1 Peter 3:18-End',
            acts: 'Acts 17:23-30',
            anaphora: 2,
            sets: [{ psalmLxx: '88:47-48', gospel: 'Matthew 19:1-16' }]
        },
        evening: ['Proverbs 4', 'Romans 13', 'Matthew 11']
    },
    '8/5': {
        morning: ['Proverbs 5', 'Romans 14', 'Matthew 12'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 4:1-14',
            universal: '1 Peter 1:17-End',
            acts: 'Acts 13:27-32',
            anaphora: 4,
            sets: [{ psalmLxx: '94:7', gospel: 'Luke 11:45-End' }]
        },
        evening: ['Proverbs 6', 'Romans 15', 'Matthew 13']
    },
    '8/6': {
        morning: ['Proverbs 7', 'Romans 16', 'Matthew 14'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 2:9-End',
            universal: '2 Peter 3:4-10',
            acts: 'Acts 17:13-19',
            anaphora: 5,
            sets: [{ psalmLxx: '115:6-7', gospel: 'Matthew 18:12-15' }]
        },
        evening: ['Proverbs 8', '1 Corinthians 1', 'Matthew 15']
    },
    '8/7': {
        morning: ['Proverbs 9', '1 Corinthians 2', 'Matthew 16'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 13:1-17',
            universal: '1 Peter 2:3-11',
            acts: 'Acts 13:21-28',
            anaphora: 4,
            sets: [{ psalmLxx: '86:1-2', gospel: 'Matthew 1:1-18' }]
        },
        evening: ['Proverbs 10', '1 Corinthians 3', 'Matthew 17']
    },
    '8/8': {
        morning: ['Proverbs 11', '1 Corinthians 4', 'Matthew 18'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 2:8-End',
            universal: '1 Peter 2:11-13',
            acts: 'Acts 13:44-End',
            anaphora: 5,
            sets: [{ psalmLxx: '78:10-11', gospel: 'Luke 12:1-13' }]
        },
        evening: ['Proverbs 12', '1 Corinthians 5', 'Matthew 19']
    },
    '8/9': {
        morning: ['Proverbs 13', '1 Corinthians 6', 'Matthew 20'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 2:8-End',
            universal: '1 Peter 2:11-13',
            acts: 'Acts 13:44-End',
            anaphora: 3,
            sets: [{ psalmLxx: '78:10-11', gospel: 'Luke 12:1-13' }]
        },
        evening: ['Proverbs 14', '1 Corinthians 7', 'Matthew 21']
    },
    '8/10': {
        morning: ['Proverbs 15', '1 Corinthians 8', 'Matthew 22'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 12:1-7',
            universal: '1 John 2:20-End',
            acts: 'Acts 14:1-8',
            anaphora: 7,
            sets: [{ psalmLxx: '8:2', gospel: 'Matthew 18:1-12' }]
        },
        evening: ['Proverbs 16', '1 Corinthians 9', 'Matthew 23']
    },
    '8/11': {
        morning: ['Proverbs 17', '1 Corinthians 10:1-13', 'Matthew 24'],
        matins: null,
        qidase: {
            pauline: '2 Thessalonians 3:6-End',
            universal: '1 John 3:13-End',
            acts: 'Acts 15:30-36',
            anaphora: 4,
            sets: [{ psalmLxx: '131:9-10', gospel: 'Matthew 6:16-24' }]
        },
        evening: ['Proverbs 18', '1 Corinthians 10:14-33', 'Matthew 25']
    },
    '8/12': {
        morning: ['Proverbs 19', '1 Corinthians 11:1-16', 'Matthew 26'],
        matins: null,
        qidase: {
            pauline: 'Romans 16:1-3',
            universal: 'James 1:19-End',
            acts: 'Acts 13:16-21',
            anaphora: 12,
            sets: [{ psalmLxx: '44:9', gospel: 'Matthew 17:14-24' }]
        },
        evening: ['Proverbs 20', '1 Corinthians 11:17-34', 'Matthew 27']
    },
    '8/13': {
        morning: ['Proverbs 21', '1 Corinthians 12', 'Matthew 28'],
        matins: { psalmLxx: '33:7-8', gospel: 'Matthew 24:30-36' },
        qidase: {
            pauline: '1 Timothy 4:9-End',
            universal: '1 Peter 2:13-17',
            acts: 'Acts 24:14-22',
            anaphora: 1,
            sets: [{ psalmLxx: '141:6', gospel: 'Matthew 24:8-20' }]
        },
        evening: ['Proverbs 22', '1 Corinthians 13', 'Mark 1']
    },
    '8/14': {
        morning: ['Proverbs 23', '1 Corinthians 14:1-25', 'Mark 2'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 5:9-11',
            universal: '1 Peter 2:20-End',
            acts: 'Acts 13:1-7',
            anaphora: 5,
            sets: [{ psalmLxx: '45:1-2', gospel: 'Matthew 16:13-15' }]
        },
        evening: ['Proverbs 24', '1 Corinthians 14:26-40', 'Mark 3']
    },
    '8/15': {
        morning: ['Proverbs 25', '1 Corinthians 15:1-32', 'Mark 4'],
        matins: null,
        qidase: {
            pauline: '2 Thessalonians 2:1-11',
            universal: '1 John 4:1-9',
            acts: 'Acts 5:35-End',
            anaphora: 1,
            sets: [{ psalmLxx: '77:56-57', gospel: 'Matthew 12:22-38' }]
        },
        evening: ['Proverbs 26', '1 Corinthians 15:33-58', 'Mark 5']
    },
    '8/16': {
        morning: ['Proverbs 27', '1 Corinthians 16', 'Mark 6'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 8:1-10',
            universal: '1 Peter 3:1-4',
            acts: 'Acts 11:27-End',
            anaphora: 3,
            sets: [{ psalmLxx: '30:4-5', gospel: 'Matthew 14:1-13' }]
        },
        evening: ['Proverbs 28', '2 Corinthians 1', 'Mark 7']
    },
    '8/17': {
        morning: [],
        festalHiatus: true,
        matins: null,
        qidase: {
            pauline: '1 Corinthians 15:50-End',
            universal: '3 John 1:1-9',
            acts: 'Acts 5:34-End',
            anaphora: 1,
            sets: [{ psalmLxx: '113:23-24', gospel: 'John 15:17-26' }]
        },
        evening: ['Proverbs 29', '2 Corinthians 2', 'Mark 8']
    },
    '8/18': {
        morning: ['Proverbs 30', '2 Corinthians 3', 'Mark 9'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 6:3-12',
            universal: '1 Peter 5:12-End',
            acts: 'Acts 14:19-End',
            anaphora: 7,
            sets: [{ psalmLxx: '43:22-23', gospel: 'Luke 17:7-11' }]
        },
        evening: ['Proverbs 31', '2 Corinthians 4', 'Mark 10']
    },
    '8/19': {
        morning: ['Ecclesiastes 1', '2 Corinthians 5', 'Mark 11'],
        matins: null,
        qidase: {
            pauline: 'Romans 8:12-18',
            universal: '1 John 4:3-9',
            acts: 'Acts 5:33-36',
            anaphora: 7,
            sets: [{ psalmLxx: '65:10-11', gospel: 'Matthew 10:16-23' }]
        },
        evening: ['Ecclesiastes 2', '2 Corinthians 6', 'Mark 12']
    },
    '8/20': {
        morning: ['Ecclesiastes 3', '2 Corinthians 7', 'Mark 13'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 3:7-12',
            universal: 'James 3:13-End',
            acts: 'Acts 5:38-End',
            anaphora: 5,
            sets: [{ psalmLxx: '78:10-11', gospel: 'Matthew 25:14-31' }]
        },
        evening: ['Ecclesiastes 4', '2 Corinthians 8', 'Mark 14']
    },
    '8/21': {
        morning: ['Ecclesiastes 5', '2 Corinthians 9', 'Mark 15'],
        matins: { psalmLxx: '44:9-10', gospel: 'Luke 1:39-56' },
        qidase: {
            pauline: 'Ephesians 5:15-21',
            universal: '1 Peter 2:4-11',
            acts: 'Acts 17:30-End',
            anaphora: 4,
            sets: [{ psalmLxx: '44:12-13', gospel: 'Luke 17:1-11' }]
        },
        evening: ['Ecclesiastes 6', '2 Corinthians 10', 'Mark 16']
    },
    '8/22': {
        morning: ['Ecclesiastes 7', '2 Corinthians 11:1-15', 'Luke 1'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 1:1-12',
            universal: '1 John 2:22-End',
            acts: 'Acts 12:12-18',
            anaphora: 5,
            sets: [{ psalmLxx: '131:9-10', gospel: 'Matthew 18:15-21' }]
        },
        evening: ['Ecclesiastes 8', '2 Corinthians 11:16-33', 'Luke 2']
    },
    '8/23': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '109:5-6', gospel: 'Luke 12:1-13' },
        qidase: {
            pauline: '2 Corinthians 1:1-12',
            universal: '1 Peter 1:6-10',
            acts: 'Acts 14:1-23',
            anaphora: 3,
            sets: [{ psalmLxx: '78:10-11', gospel: 'Matthew 10:16-34' }],
            alternates: { anaphora: [4] }
        },
        evening: ['Ecclesiastes 9', '2 Corinthians 12', 'Luke 3']
    },
    '8/24': {
        morning: ['Ecclesiastes 10', '2 Corinthians 13', 'Luke 4'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 12:1-12',
            universal: '2 Peter 3:16-End',
            acts: 'Acts 17:27-End',
            anaphora: 7,
            sets: [{ psalmLxx: '49:3-5', gospel: 'Matthew 21:28-33' }]
        },
        evening: ['Ecclesiastes 11', 'Galatians 1', 'Luke 5']
    },
    '8/25': {
        morning: ['Ecclesiastes 12', 'Galatians 2', 'Luke 6'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 10:12-22',
            universal: '1 John 4:4-18',
            acts: 'Acts 8:1-13',
            anaphora: 3,
            sets: [{ psalmLxx: '114:5-6', gospel: 'Luke 18:1-9' }]
        },
        evening: ['Jeremiah 1', 'Galatians 3:1-14', 'Luke 7']
    },
    '8/26': {
        morning: ['Jeremiah 2', 'Galatians 3:15-29', 'Luke 8'],
        matins: null,
        qidase: {
            pauline: 'Ephesians 5:1-15',
            universal: '1 John 3:7-13',
            acts: 'Acts 17:16-30',
            anaphora: 7,
            sets: [{ psalmLxx: '72:23-24', gospel: 'Mark 13:9-14' }]
        },
        evening: ['Jeremiah 3', 'Galatians 4', 'Luke 9-10']
    },
    '8/27': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '39:7-8', gospel: 'Mark 15:1-42' },
        qidase: {
            pauline: '2 Corinthians 8:4-10',
            universal: '1 Peter 2:21-End',
            acts: 'Acts 5:29-34',
            anaphora: 3,
            sets: [{ psalmLxx: '55:3-5', gospel: 'Matthew 10:16-24' }]
        },
        evening: ['Jeremiah 4', 'Galatians 5', 'Luke 11']
    },
    '8/28': {
        morning: ['Jeremiah 5', 'Galatians 6', 'Luke 12'],
        matins: null,
        qidase: {
            pauline: 'Romans 4:1-14',
            universal: 'James 2:19-End',
            acts: 'Acts 7:1-9',
            anaphora: 5,
            sets: [{ psalmLxx: '140:9', gospel: 'Luke 12:8-17' }]
        },
        evening: ['Jeremiah 6', 'Ephesians 1', 'Luke 13']
    },
    '8/29': {
        morning: ['Jeremiah 7', 'Ephesians 2', 'Luke 14'],
        matins: { psalmLxx: '109:3', gospel: 'Luke 2:1-8' },
        qidase: {
            pauline: 'Colossians 4:10-14',
            universal: '1 John 4:9-18',
            acts: 'Acts 13:4-16',
            anaphora: 13,
            sets: [{ psalmLxx: '18:3-4', gospel: 'Luke 10:1-12' }]
        },
        evening: ['Jeremiah 8', 'Ephesians 3', 'Luke 15']
    },
    '8/30': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '115:6-7', gospel: 'Luke 10:1-12' },
        qidase: {
            pauline: '2 Timothy 4:1-20',
            universal: '1 Peter 5:12-End',
            acts: 'Acts 15:36-End',
            anaphora: 1,
            sets: [{ psalmLxx: '83:6-7', gospel: 'John 10:1-19' }]
        },
        evening: ['Jeremiah 9', 'Ephesians 4', 'Luke 16']
    },

    // =========================================================================
    // GINBOT 1 – 30 (May 9 – June 7)
    // =========================================================================
    '9/1': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '44:12-13', gospel: 'Matthew 1:1-18' },
        qidase: {
            pauline: 'Galatians 4:1-13',
            universal: '1 Peter 1:8-13',
            acts: 'Acts 7:44-51',
            anaphora: 4,
            sets: [{ psalmLxx: '86:1-2', gospel: 'Luke 1:39-57' }]
        },
        evening: ['Jeremiah 10-11', 'Ephesians 5', 'Luke 17']
    },
    '9/2': {
        morning: ['Jeremiah 12', 'Ephesians 6', 'Luke 18'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 4:8-14',
            universal: 'James 5:10-12',
            acts: 'Acts 14:21-End',
            anaphora: 11,
            sets: [{ psalmLxx: '91:12-13', gospel: 'Matthew 7:21-End' }]
        },
        evening: ['Jeremiah 13', 'Philippians 1', 'Luke 19']
    },
    '9/3': {
        morning: ['Jeremiah 14', 'Philippians 2', 'Luke 20'],
        matins: null,
        qidase: {
            pauline: 'Romans 16:21-End',
            universal: '1 John 2:27-End',
            acts: 'Acts 17:5-13',
            anaphora: 1,
            sets: [{ psalmLxx: '18:3-4', gospel: 'Luke 10:1-12' }]
        },
        evening: ['Jeremiah 15', 'Philippians 3', 'Luke 21']
    },
    '9/4': {
        morning: ['Jeremiah 16', 'Philippians 4', 'Luke 22'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 3:1-11',
            universal: '1 Peter 5:1-8',
            acts: 'Acts 14:23-End',
            anaphora: 5,
            sets: [{ psalmLxx: '83:6-7', gospel: 'Matthew 25:14-31' }]
        },
        evening: ['Jeremiah 17', 'Colossians 1', 'Luke 23']
    },
    '9/5': {
        morning: ['Jeremiah 18', 'Colossians 2', 'Luke 24'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 11:32-End',
            universal: '2 Peter 1:19-End',
            acts: 'Acts 7:51-55',
            anaphora: 5,
            sets: [{ psalmLxx: '21:10-11', gospel: 'Matthew 21:33-End' }]
        },
        evening: ['Jeremiah 19', 'Colossians 3', 'John 1']
    },
    '9/6': {
        morning: ['Jeremiah 20', 'Colossians 4', 'John 2'],
        matins: null,
        qidase: {
            pauline: 'Romans 6:15-End',
            universal: '1 Peter 3:10-15',
            acts: 'Acts 16:35-End',
            anaphora: 5,
            sets: [{ psalmLxx: '24:4', gospel: 'Luke 12:32-41' }]
        },
        evening: ['Jeremiah 21', '1 Thessalonians 1', 'John 3']
    },
    '9/7': {
        morning: ['Jeremiah 22', '1 Thessalonians 2', 'John 4'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 3:1-11',
            universal: '1 Peter 2:4-11',
            acts: 'Acts 20:28-31',
            anaphora: 6,
            sets: [{ psalmLxx: '83:6-7', gospel: 'Matthew 18:1-12' }]
        },
        evening: ['Jeremiah 23', '1 Thessalonians 3', 'John 5']
    },
    '9/8': {
        morning: ['Jeremiah 24', '1 Thessalonians 4', 'John 6'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 6:7-End',
            universal: 'James 1:7-17',
            acts: 'Acts 13:1-13',
            anaphora: 7,
            sets: [{ psalmLxx: '118:70-71', gospel: 'Matthew 6:19-End' }]
        },
        evening: ['Jeremiah 25', '1 Thessalonians 5', 'John 7']
    },
    '9/9': {
        morning: ['Jeremiah 26', '2 Thessalonians 1', 'John 8'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 11:1-17',
            universal: '1 Peter 3:1-7',
            acts: 'Acts 16:14-16',
            anaphora: 10,
            sets: [{ psalmLxx: '59:3-4', gospel: 'John 16:15-22' }]
        },
        evening: ['Jeremiah 27', '2 Thessalonians 2', 'John 9']
    },
    '9/10': {
        morning: ['Jeremiah 28', '2 Thessalonians 3', 'John 10'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 11:32-End',
            universal: '2 Peter 1:19-End',
            acts: 'Acts 3:17-End',
            anaphora: 3,
            sets: [{ psalmLxx: '65:12', gospel: 'Matthew 18:19-23' }]
        },
        evening: ['Jeremiah 29', '1 Timothy 1', 'John 11']
    },
    '9/11': {
        morning: ['Jeremiah 30', '1 Timothy 2', 'John 12'],
        matins: null,
        qidase: {
            pauline: 'Ephesians 5:15-21',
            universal: 'James 5:12-14',
            acts: 'Acts 26:24-30',
            anaphora: 11,
            sets: [{ psalmLxx: '68:29-30', gospel: 'Luke 21:1-7' }]
        },
        evening: ['Jeremiah 31', '1 Timothy 3', 'John 13']
    },
    '9/12': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '83:6-7', gospel: 'Matthew 5:1-17' },
        qidase: {
            pauline: 'Hebrews 13:13-22',
            universal: 'Jude 1:9-14',
            acts: 'Acts 13:16-20',
            anaphora: 10,
            sets: [{ psalmLxx: '118:86-87', gospel: 'Luke 10:29-38' }]
        },
        evening: ['Jeremiah 32', '1 Timothy 4', 'John 14']
    },
    '9/13': {
        morning: ['Jeremiah 33', '1 Timothy 5', 'John 15'],
        matins: null,
        qidase: {
            pauline: 'Ephesians 6:1-10',
            universal: '1 Peter 3:10-15',
            acts: 'Acts 21:27-31',
            anaphora: 7,
            sets: [{ psalmLxx: '38:1-2', gospel: 'Matthew 20:1-17' }]
        },
        evening: ['Jeremiah 34', '1 Timothy 6', 'John 16']
    },
    '9/14': {
        morning: ['Jeremiah 35', '2 Timothy 1', 'John 17'],
        matins: null,
        qidase: {
            pauline: 'Galatians 6:11-End',
            universal: '1 Peter 4:12-17',
            acts: 'Acts 4:31-End',
            anaphora: 5,
            sets: [{ psalmLxx: '115:6-7', gospel: 'Matthew 10:1-17' }]
        },
        evening: ['Jeremiah 36', '2 Timothy 2', 'John 18']
    },
    '9/15': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '31:2', gospel: 'John 1:44-End' },
        qidase: {
            pauline: 'Romans 8:24-End',
            universal: 'Jude 1:17-23',
            acts: 'Acts 1:12-15',
            anaphora: 1,
            sets: [{ psalmLxx: '18:3-4', gospel: 'Matthew 10:1-17' }]
        },
        evening: ['Jeremiah 37', '2 Timothy 3', 'John 19']
    },
    '9/16': {
        morning: ['Jeremiah 38', '2 Timothy 4', 'John 20'],
        matins: null,
        qidase: {
            pauline: 'Colossians 2:1-6',
            universal: 'Revelation 1:1-End',
            acts: 'Acts 10:14-End',
            anaphora: 3,
            sets: [{ psalmLxx: '106:29-30', gospel: 'John 21:20-End' }]
        },
        evening: ['Jeremiah 39', 'Titus 1', 'John 21']
    },
    '9/17': {
        morning: ['Jeremiah 40', 'Titus 2', 'Matthew 1'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 3:1-8',
            universal: '1 Peter 5:1-End',
            acts: 'Acts 20:28-31',
            anaphora: 9,
            sets: [{ psalmLxx: '83:6-7', gospel: 'Luke 19:11-28' }]
        },
        evening: ['Jeremiah 41', 'Titus 3', 'Matthew 2']
    },
    '9/18': {
        morning: ['Jeremiah 42', 'Philemon 1', 'Matthew 3'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 11:1-16',
            universal: '1 Peter 5:6-12',
            acts: 'Acts 10:44-End',
            anaphora: 5,
            sets: [{ psalmLxx: '118:61-63', gospel: 'Matthew 16:23-End' }]
        },
        evening: ['Jeremiah 43', 'Hebrews 1', 'Matthew 4']
    },
    '9/19': {
        morning: ['Jeremiah 44', 'Hebrews 2', 'Matthew 5'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 1:1-13',
            universal: '1 Peter 1:6-10',
            acts: 'Acts 8:1-9',
            anaphora: 7,
            sets: [{ psalmLxx: '117:16-17', gospel: 'Luke 3:10-19' }]
        },
        evening: ['Jeremiah 45', 'Hebrews 3', 'Matthew 6']
    },
    '9/20': {
        morning: ['Jeremiah 46', 'Hebrews 4', 'Matthew 7'],
        matins: null,
        qidase: {
            pauline: 'Romans 13:1-13',
            universal: '1 Peter 2:11-20',
            acts: 'Acts 13:40-End',
            anaphora: 7,
            sets: [{ psalmLxx: '67:30-31', gospel: 'Matthew 16:24-End' }],
            alternates: { psalmLxx: ['74:2-3'] }
        },
        evening: ['Jeremiah 47', 'Hebrews 5', 'Matthew 8']
    },
    '9/21': {
        morning: ['Jeremiah 48', 'Hebrews 6', 'Matthew 9'],
        matins: { psalmLxx: '44:12-13', gospel: 'Luke 1:39-57' },
        qidase: {
            pauline: '1 Corinthians 6:9-End',
            universal: '2 Peter 1:1-12',
            acts: 'Revelation 12:1-5',
            anaphora: 4,
            sets: [{ psalmLxx: '139:7-8', gospel: 'Matthew 18:6-19' }],
            alternates: { psalmLxx: ['140:4'] }
        },
        evening: ['Jeremiah 49', 'Hebrews 7', 'Matthew 10']
    },
    '9/22': {
        morning: ['Jeremiah 50', 'Hebrews 8', 'Matthew 11'],
        matins: null,
        qidase: {
            pauline: 'Romans 16:6-10',
            universal: '1 John 2:27-End',
            acts: 'Acts 21:15-21',
            anaphora: 1,
            sets: [{ psalmLxx: '18:3-4', gospel: 'Luke 10:1-12' }]
        },
        evening: ['Jeremiah 51-52', 'Hebrews 9', 'Matthew 12:1-37']
    },
    '9/23': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '44:12-13', gospel: 'Matthew 10:16-32' },
        qidase: {
            pauline: 'Romans 16:7-10',
            universal: 'Jude 1:20-End',
            acts: 'Acts 21:15-21',
            anaphora: 4,
            sets: [{ psalmLxx: '44:9-10', gospel: 'Luke 1:17-25' }]
        },
        evening: ['Lamentations 1', 'Hebrews 11', 'Matthew 13:1-30']
    },
    '9/24': {
        morning: ['Lamentations 2', 'Hebrews 12', 'Matthew 13:31-58'],
        matins: null,
        qidase: {
            pauline: 'Galatians 4:4-13',
            universal: '1 Peter 1:8-13',
            acts: 'Acts 2:13-End',
            anaphora: 4,
            sets: [{ psalmLxx: '77:43-44', gospel: 'Matthew 2:10-17' }],
            alternates: { universal: ['Revelation 12:13-End'] }
        },
        evening: ['Lamentations 3', 'Hebrews 13', 'Matthew 14']
    },
    '9/25': {
        morning: ['Lamentations 4', 'James 1', 'Matthew 15:1-20'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 2:8-End',
            universal: '1 Peter 4:12-End',
            acts: 'Acts 16:8-15',
            anaphora: 4,
            sets: [{ psalmLxx: '80:4-5', gospel: 'Mark 15:40-42' }]
        },
        evening: ['Lamentations 5', 'James 2', 'Matthew 15:21-39']
    },
    '9/26': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '18:3-4', gospel: 'John 20:24-End' },
        qidase: {
            pauline: 'Romans 8:22-31',
            universal: 'Jude 1:1-End',
            acts: 'Acts 2:1-14',
            anaphora: 1,
            sets: [{ psalmLxx: '17:35-36', gospel: 'Matthew 5:1-17' }]
        },
        evening: ['Ezekiel 1-2', 'James 3', 'Matthew 16']
    },
    '9/27': {
        morning: ['Ezekiel 3-4', 'James 4', 'Matthew 17'],
        matins: null,
        qidase: {
            pauline: 'Romans 6:1-12',
            universal: '1 Peter 2:21-End',
            acts: 'Acts 20:28-31',
            anaphora: 10,
            sets: [{ psalmLxx: '83:6-7', gospel: 'John 10:1-22' }]
        },
        evening: ['Ezekiel 5-6', 'James 5', 'Matthew 18']
    },
    '9/28': {
        morning: ['Ezekiel 7', '1 Peter 1:1-12', 'Matthew 19:1-15'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 7:29-End',
            universal: 'James 2:19-End',
            acts: 'Acts 5:1-12',
            anaphora: 9,
            sets: [{ psalmLxx: '30:18', gospel: 'Luke 12:22-39' }]
        },
        evening: ['Ezekiel 13', '1 Peter 1:13-25', 'Matthew 19:16-30']
    },
    '9/29': {
        morning: ['Ezekiel 14', '1 Peter 2', 'Matthew 20:1-19'],
        matins: null,
        qidase: {
            pauline: 'Galatians 4:1-12',
            universal: '1 John 4:9-18',
            acts: 'Acts 12:7-12',
            anaphora: 5,
            sets: [{ psalmLxx: '17:35-36', gospel: 'Matthew 5:1-17' }]
        },
        evening: ['Ezekiel 18', '1 Peter 3', 'Matthew 20:20-34']
    },
    '9/30': {
        morning: ['Ezekiel 33', '1 Peter 4:1-11', 'Matthew 21:1-32'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 15:1-12',
            universal: '1 John 2:27-End',
            acts: 'Acts 18:23-End',
            anaphora: 1,
            sets: [{ psalmLxx: '83:12', gospel: 'Luke 10:1-12' }]
        },
        evening: ['Ezekiel 34', '1 Peter 4:12-19', 'Matthew 21:33-46']
    },

    // =========================================================================
    // SENE 1 – 30 (June 8 – July 7)
    // =========================================================================
    '10/1': {
        morning: ['Daniel 1', '1 Peter 5', 'Matthew 22'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 11:21-32',
            universal: '1 Peter 4:12-End',
            acts: 'Acts 6:9-15',
            anaphora: 4,
            sets: [{ psalmLxx: '104:20-21', gospel: 'Matthew 24:45-End' }]
        },
        evening: ['Daniel 2', '2 Peter 1', 'Matthew 23']
    },
    '10/2': {
        morning: ['Daniel 3', '2 Peter 2', 'Matthew 24:1-35'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 14:29-End',
            universal: 'James 5:12-16',
            acts: 'Acts 13:24-32',
            anaphora: 4,
            sets: [{ psalmLxx: '131:1-2', gospel: 'Matthew 11:1-16' }]
        },
        evening: ['Daniel 4', '2 Peter 3', 'Matthew 24:36-51']
    },
    '10/3': {
        morning: ['Daniel 5', '1 John 1', 'Matthew 25:1-30'],
        matins: null,
        qidase: {
            pauline: 'Titus 2:1-9',
            universal: '1 Peter 3:1-7',
            acts: 'Acts 20:16-25',
            anaphora: 5,
            sets: [{ psalmLxx: '117:19', gospel: 'Luke 7:36-End' }]
        },
        evening: ['Daniel 6', '1 John 2', 'Matthew 25:31-46']
    },
    '10/4': {
        morning: ['Daniel 7', '1 John 3', 'Matthew 26'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 3:9-18',
            universal: '1 John 2:12-20',
            acts: 'Acts 12:18-End',
            anaphora: 5,
            sets: [{ psalmLxx: '7:12-13', gospel: 'Luke 21:12-29' }]
        },
        evening: ['Daniel 8', '1 John 4', 'Matthew 27']
    },
    '10/5': {
        morning: ['Daniel 9', '1 John 5', 'Matthew 28'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 2:12-End',
            universal: '1 John 3:1-11',
            acts: 'Acts 16:35-End',
            anaphora: 7,
            sets: [{ psalmLxx: '67:1-2', gospel: 'Luke 12:8-13' }]
        },
        evening: ['Daniel 10', '2 John 1', 'Mark 1']
    },
    '10/6': {
        morning: ['Daniel 11', '3 John 1', 'Mark 2'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 9:13-End',
            universal: 'James 1:12-19',
            acts: 'Acts 5:27-End',
            anaphora: 5,
            sets: [{ psalmLxx: '111:9', gospel: 'Luke 12:32-41' }]
        },
        evening: ['Daniel 12', 'Jude 1', 'Mark 3']
    },
    '10/7': {
        morning: ['Hosea 1', 'Acts 1', 'Mark 4'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 6:11-End',
            universal: '1 Peter 1:7-10',
            acts: 'Acts 12:10-21',
            anaphora: 4,
            sets: [{ psalmLxx: '86:1-3', gospel: 'Matthew 17:14-22' }]
        },
        evening: ['Hosea 2-3', 'Acts 2:1-21', 'Mark 5']
    },
    '10/8': {
        morning: ['Hosea 4', 'Acts 2:22-47', 'Mark 6:1-13'],
        matins: null,
        qidase: {
            pauline: 'Ephesians 2:13-End',
            universal: '1 Peter 1:10-13',
            acts: 'Acts 7:44-51',
            anaphora: 4,
            sets: [{ psalmLxx: '77:15-16', gospel: 'John 4:1-15' }]
        },
        evening: ['Hosea 5-6', 'Acts 3', 'Mark 6:14-56']
    },
    '10/9': {
        morning: ['Hosea 7', 'Acts 4', 'Mark 7'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 11:32-End',
            universal: '2 Peter 3:1-7',
            acts: 'Acts 13:17-24',
            anaphora: 4,
            sets: [{ psalmLxx: '98:6-7', gospel: 'Matthew 10:32-End' }]
        },
        evening: ['Hosea 8', 'Acts 5:1-16', 'Mark 8']
    },
    '10/10': {
        morning: ['Hosea 9', 'Acts 5:17-42', 'Mark 9:1-32'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 7:25-35',
            universal: '1 John 1:4-End',
            acts: 'Acts 15:30-37',
            anaphora: 7,
            sets: [{ psalmLxx: '89:14-15', gospel: 'Matthew 11:20-End' }]
        },
        evening: ['Hosea 10', 'Acts 6', 'Mark 9:33-50']
    },
    '10/11': {
        morning: ['Hosea 11', 'Acts 7:1-34', 'Mark 10'],
        matins: { psalmLxx: '15:4-5', gospel: 'Luke 22:31-End' },
        qidase: {
            pauline: '2 Corinthians 5:11-End',
            universal: '1 Peter 5:7-11',
            acts: 'Acts 17:30-End',
            anaphora: 2,
            sets: [{ psalmLxx: '90:5-6', gospel: 'Matthew 10:17-32' }]
        },
        evening: ['Hosea 12', 'Acts 7:35-60', 'Mark 11']
    },
    '10/12': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '33:7', gospel: 'Matthew 24:30-36' },
        qidase: {
            pauline: 'Ephesians 1:13-End',
            universal: 'Jude 1:9-14',
            acts: 'Acts 1:10-12',
            anaphora: 13,
            sets: [{ psalmLxx: '48:10', gospel: 'Matthew 25:14-31' }]
        },
        evening: ['Hosea 13', 'Acts 8:1-25', 'Mark 12:1-17']
    },
    '10/13': {
        morning: ['Hosea 14', 'Acts 8:26-40', 'Mark 12:18-44'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 6:7-20',
            universal: '1 Peter 1:13-End',
            acts: 'Acts 8:20-26',
            anaphora: 1,
            sets: [{ psalmLxx: '36:21-22', gospel: 'Luke 18:18-23' }]
        },
        evening: ['Joel 1', 'Acts 9', 'Mark 13']
    },
    '10/14': {
        morning: ['Joel 2', 'Acts 10:1-29', 'Mark 14'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 12:7-15',
            universal: '2 Peter 2:9-14',
            acts: 'Acts 27:1-7',
            anaphora: 5,
            sets: [{ psalmLxx: '78:10-11', gospel: 'Luke 21:12-19' }]
        },
        evening: ['Joel 3', 'Acts 10:30-48', 'Mark 15']
    },
    '10/15': {
        morning: ['Amos 1', 'Acts 11', 'Mark 16'],
        matins: null,
        qidase: {
            pauline: 'Ephesians 6:10-End',
            universal: '1 John 4:17-End',
            acts: 'Acts 25:1-13',
            anaphora: 3,
            sets: [{ psalmLxx: '88:19', gospel: 'Matthew 13:44-51' }]
        },
        evening: ['Amos 2', 'Acts 12', 'Luke 1:1-38']
    },
    '10/16': {
        morning: ['Amos 3', 'Acts 13:1-15', 'Luke 1:39-80'],
        matins: null,
        qidase: {
            pauline: 'Ephesians 6:14-End',
            universal: '1 Peter 3:10-15',
            acts: 'Acts 3:1-12',
            anaphora: 4,
            sets: [{ psalmLxx: '138:17-18', gospel: 'Matthew 2:19-End' }]
        },
        evening: ['Amos 4', 'Acts 13:16-52', 'Luke 2']
    },
    '10/17': {
        morning: ['Amos 5', 'Acts 14', 'Luke 3'],
        matins: null,
        qidase: {
            pauline: '2 Timothy 1:1-10',
            universal: 'James 5:14-17',
            acts: 'Acts 13:44-49',
            anaphora: 5,
            sets: [{ psalmLxx: '1:4-5', gospel: 'Luke 6:20-24' }]
        },
        evening: ['Amos 6', 'Acts 15:1-12', 'Luke 4']
    },
    '10/18': {
        morning: ['Amos 7', 'Acts 15:13-41', 'Luke 5'],
        matins: null,
        qidase: {
            pauline: '2 Timothy 3:1-End',
            universal: '2 Peter 2:9-14',
            acts: 'Acts 17:5-13',
            anaphora: 7,
            sets: [{ psalmLxx: '54:17', gospel: 'Matthew 18:15-19' }]
        },
        evening: ['Amos 8', 'Acts 16:1-15', 'Luke 6']
    },
    '10/19': {
        morning: ['Amos 9', 'Acts 16:16-40', 'Luke 7'],
        matins: null,
        qidase: {
            pauline: '1 Thessalonians 1:1-8',
            universal: '1 John 2:14-20',
            acts: 'Acts 19:11-18',
            anaphora: 11,
            sets: [{ psalmLxx: '78:10', gospel: 'Matthew 24:8-13' }]
        },
        evening: ['Obadiah 1', 'Acts 17', 'Luke 8']
    },
    '10/20': {
        morning: ['Jonah 1', 'Acts 18', 'Luke 9:1-27'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 14:29-34',
            universal: '2 Peter 3:1-8',
            acts: 'Acts 13:38-44',
            anaphora: 4,
            sets: [{ psalmLxx: '65:5-6', gospel: 'Luke 4:24-38' }]
        },
        evening: ['Jonah 2-3', 'Acts 19:1-20', 'Luke 9:28-62']
    },
    '10/21': {
        morning: ['Jonah 4', 'Acts 19:21-40', 'Luke 10:1-24'],
        matins: { psalmLxx: '131:7-8', gospel: 'Luke 1:39-47' },
        qidase: {
            pauline: 'Ephesians 2:13-End',
            universal: '1 Peter 2:4-11',
            acts: 'Acts 1:12-15',
            anaphora: 2,
            sets: [{ psalmLxx: '45:4-5', gospel: 'Matthew 16:13-20' }]
        },
        evening: ['Micah 1', 'Acts 20', 'Luke 10:25-42']
    },
    '10/22': {
        morning: ['Micah 2', 'Acts 21:1-16', 'Luke 11:1-26'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 5:6-End',
            universal: 'James 5:14-End',
            acts: 'Acts 13:44-End',
            anaphora: 2,
            sets: [{ psalmLxx: '67:25-26', gospel: 'Matthew 5:39-End' }]
        },
        evening: ['Micah 3', 'Acts 21:17-40', 'Luke 11:27-54']
    },
    '10/23': {
        morning: ['Micah 4', 'Acts 22', 'Luke 12:1-31'],
        matins: { psalmLxx: '71:1-2', gospel: 'Matthew 12:38-43' },
        qidase: {
            pauline: 'Romans 13:1-11',
            universal: '1 Peter 2:13-End',
            acts: 'Acts 7:44-54',
            anaphora: 5,
            sets: [{ psalmLxx: '31:5', gospel: 'Matthew 11:12-End' }]
        },
        evening: ['Micah 5', 'Acts 23', 'Luke 12:32-59']
    },
    '10/24': {
        morning: ['Micah 6', 'Acts 24', 'Luke 13'],
        matins: null,
        qidase: {
            pauline: 'Romans 9:24-End',
            universal: '1 John 1:4-End',
            acts: 'Acts 14:1-7',
            anaphora: 5,
            sets: [{ psalmLxx: '104:21', gospel: 'John 12:20-27' }]
        },
        evening: ['Micah 7', 'Acts 25', 'Luke 14']
    },
    '10/25': {
        morning: [],
        festalHiatus: true,
        matins: null,
        qidase: {
            pauline: 'Hebrews 6:7-13',
            universal: 'Jude 1:1-7',
            acts: 'Acts 14:16-End',
            anaphora: 1,
            sets: [{ psalmLxx: '132:1', gospel: 'John 14:18-27' }]
        },
        evening: ['Nahum 1', 'Acts 26', 'Luke 15']
    },
    '10/26': {
        morning: ['Nahum 2', 'Acts 27', 'Luke 16'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 4:1-14',
            universal: '2 Peter 1:19-End',
            acts: 'Acts 7:35-44',
            anaphora: 13,
            sets: [{ psalmLxx: '117:19', gospel: 'Matthew 13:36-44' }]
        },
        evening: ['Nahum 3', 'Acts 28', 'Luke 17']
    },
    '10/27': {
        morning: ['Habakkuk 1', 'Romans 1', 'Luke 18'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 12:28-End',
            universal: '1 John 2:27-29',
            acts: 'Acts 9:10-20',
            anaphora: 10,
            sets: [{ psalmLxx: '7:12-13', gospel: 'Luke 16:19-End' }]
        },
        evening: ['Habakkuk 2', 'Romans 2', 'Luke 19']
    },
    '10/28': {
        morning: ['Habakkuk 3', 'Romans 3', 'Luke 20'],
        matins: null,
        qidase: {
            pauline: 'Titus 1:7-End',
            universal: '1 Peter 5:1-7',
            acts: 'Acts 7:1-9',
            anaphora: 7,
            sets: [{ psalmLxx: '67:1', gospel: 'Mark 3:23-32' }]
        },
        evening: ['Zephaniah 1', 'Romans 4', 'Luke 21']
    },
    '10/29': {
        morning: ['Zephaniah 2', 'Romans 5', 'Luke 22:1-30'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 3:13-End',
            universal: '1 John 4:9-18',
            acts: 'Acts 9:20-23',
            anaphora: 7,
            sets: [{ psalmLxx: '111:9', gospel: 'Matthew 16:24-End' }]
        },
        evening: ['Zephaniah 3', 'Romans 6', 'Luke 22:31-71']
    },
    '10/30': {
        morning: [],
        festalHiatus: true,
        matins: null,
        qidase: {
            pauline: 'Romans 7:14-End',
            universal: '1 Peter 3:7-10',
            acts: 'Acts 19:1-11',
            anaphora: 3,
            sets: [{ psalmLxx: '86:2', gospel: 'Luke 1:57-End' }]
        },
        evening: ['Haggai 1', 'Romans 7', 'Luke 23']
    },

    // =========================================================================
    // HAMLE 1 – 30 (July 8 – August 6)
    // =========================================================================
    '11/1': {
        morning: ['Haggai 2', 'Romans 8:1-17', 'Luke 24'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 5:1-18',
            universal: '1 Peter 3:1-7',
            acts: 'Acts 9:36-End',
            anaphora: 9,
            sets: [{ psalmLxx: '77:15', gospel: 'John 20:19-End' }]
        },
        evening: ['Zechariah 1', 'Romans 8:18-39', 'John 1']
    },
    '11/2': {
        morning: ['Zechariah 2-3', 'Romans 9', 'John 2'],
        matins: { psalmLxx: '18:4', gospel: 'Mark 13:24-33' },
        qidase: {
            pauline: '1 Corinthians 9:1-13',
            universal: 'Jude 1:17-End',
            acts: 'Acts 5:16-33',
            anaphora: 1,
            sets: [{ psalmLxx: '98:6', gospel: 'Matthew 19:16-End' }]
        },
        evening: ['Zechariah 4', 'Romans 10', 'John 3']
    },
    '11/3': {
        morning: ['Zechariah 5', 'Romans 11', 'John 4'],
        matins: null,
        qidase: {
            pauline: 'Titus 3:8-End',
            universal: '1 Peter 3:15-End',
            acts: 'Acts 20:28-31',
            anaphora: 11,
            sets: [{ psalmLxx: '89:14-15', gospel: 'Matthew 18:15-21' }]
        },
        evening: ['Zechariah 6', 'Romans 12', 'John 5']
    },
    '11/4': {
        morning: ['Zechariah 7', 'Romans 13', 'John 6'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 11:32-End',
            universal: '2 Peter 1:19-End',
            acts: 'Acts 10:37-End',
            anaphora: 3,
            sets: [{ psalmLxx: '90:5-6', gospel: 'Matthew 21:33-End' }]
        },
        evening: ['Zechariah 8', 'Romans 14', 'John 7']
    },
    '11/5': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '18:4', gospel: 'John 15:1-17' },
        qidase: {
            pauline: '1 Thessalonians 4:13-End',
            universal: '2 Peter 1:1-12',
            acts: 'Acts 23:10-16',
            anaphora: 1,
            sets: [{ psalmLxx: '138:17-18', gospel: 'John 21:15-20' }]
        },
        evening: ['Zechariah 9', 'Romans 15', 'John 8']
    },
    '11/6': {
        morning: ['Zechariah 10', 'Romans 16', 'John 9'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 15:33-45',
            universal: '1 John 2:20-End',
            acts: 'Acts 16:14-18',
            anaphora: 1,
            sets: [{ psalmLxx: '114:8', gospel: 'Matthew 24:15-37' }]
        },
        evening: ['Zechariah 11', '1 Corinthians 1', 'John 10']
    },
    '11/7': {
        morning: ['Zechariah 12', '1 Corinthians 2', 'John 11'],
        matins: { psalmLxx: '32:5-6', gospel: 'John 1:1-6' },
        qidase: {
            pauline: 'Romans 9:1-6',
            universal: '1 John 4:11-End',
            acts: 'Acts 11:11-19',
            anaphora: 12,
            sets: [{ psalmLxx: '26:8-9', gospel: 'John 8:51-End' }]
        },
        evening: ['Zechariah 13', '1 Corinthians 3', 'John 12']
    },
    '11/8': {
        morning: ['Zechariah 14', '1 Corinthians 4', 'John 13'],
        matins: null,
        qidase: {
            pauline: 'Ephesians 6:10-19',
            universal: '1 Peter 3:10-15',
            acts: 'Acts 26:12-19',
            anaphora: 5,
            sets: [{ psalmLxx: '115:6-7', gospel: 'Mark 4:1-24' }]
        },
        evening: ['Malachi 1', '1 Corinthians 5', 'John 14']
    },
    '11/9': {
        morning: ['Malachi 2', '1 Corinthians 6', 'John 15'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 3:1-11',
            universal: '1 Peter 5:1-End',
            acts: 'Acts 20:28-31',
            anaphora: 5,
            sets: [{ psalmLxx: '63:6', gospel: 'Luke 13:18-23' }]
        },
        evening: ['Malachi 3', '1 Corinthians 7', 'John 16']
    },
    '11/10': {
        morning: ['Malachi 4', '1 Corinthians 8', 'John 17'],
        matins: { psalmLxx: '50:6-7', gospel: 'Luke 24:13-34' },
        qidase: {
            pauline: '1 Corinthians 1:10-End',
            universal: 'Jude 1:17-20',
            acts: 'Acts 8:14-18',
            anaphora: 1,
            sets: [{ psalmLxx: '18:3', gospel: 'John 1:44-End' }]
        },
        evening: ['Tobit 1', '1 Corinthians 9', 'John 18']
    },
    '11/11': {
        morning: ['Tobit 2', '1 Corinthians 10:1-13', 'John 19'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 2:1-9',
            universal: '1 Peter 4:12-17',
            acts: 'Acts 14:20-End',
            anaphora: 5,
            sets: [{ psalmLxx: '32:1-2', gospel: 'Luke 6:20-27' }]
        },
        evening: ['Tobit 3', '1 Corinthians 10:14-33', 'John 20']
    },
    '11/12': {
        morning: ['Tobit 4', '1 Corinthians 11:1-16', 'John 21'],
        matins: { psalmLxx: '33:7-8', gospel: 'Matthew 24:15-37' },
        qidase: {
            pauline: 'Romans 9:16-30',
            universal: 'Jude 1:6-14',
            acts: 'Acts 10:3-9',
            anaphora: 11,
            sets: [{ psalmLxx: '32:16-17', gospel: 'Luke 18:1-9' }]
        },
        evening: ['Tobit 5-6', '1 Corinthians 11:17-34', 'Matthew 1']
    },
    '11/13': {
        morning: ['Tobit 7', '1 Corinthians 12', 'Matthew 2'],
        matins: null,
        qidase: {
            pauline: 'Romans 8:18-35',
            universal: '1 Peter 1:13-End',
            acts: 'Acts 19:11-21',
            anaphora: 9,
            sets: [{ psalmLxx: '1:2-3', gospel: 'Matthew 10:32-End' }]
        },
        evening: ['Tobit 8', '1 Corinthians 13', 'Matthew 3']
    },
    '11/14': {
        morning: ['Tobit 9', '1 Corinthians 14:1-25', 'Matthew 4'],
        matins: null,
        qidase: {
            pauline: '1 Thessalonians 4:1-13',
            universal: '1 Peter 5:6-End',
            acts: 'Acts 14:19-End',
            anaphora: 5,
            sets: [{ psalmLxx: '43:22-23', gospel: 'Matthew 13:1-10' }]
        },
        evening: ['Tobit 10', '1 Corinthians 14:26-40', 'Matthew 5']
    },
    '11/15': {
        morning: ['Tobit 11', '1 Corinthians 15:1-32', 'Matthew 6'],
        matins: null,
        qidase: {
            pauline: 'Romans 1:18-27',
            universal: 'James 5:12-17',
            acts: 'Acts 9:22-30',
            anaphora: 6,
            sets: [{ psalmLxx: '88:6-7', gospel: 'Matthew 4:17-21' }]
        },
        evening: ['Tobit 12', '1 Corinthians 15:33-58', 'Matthew 7-8']
    },
    '11/16': {
        morning: ['Tobit 13', '1 Corinthians 16', 'Matthew 9:1-17'],
        matins: null,
        qidase: {
            pauline: 'Philippians 4:8-15',
            universal: 'James 2:1-10',
            acts: 'Acts 14:21-End',
            anaphora: 5,
            sets: [{ psalmLxx: '68:8-9', gospel: 'Mark 8:34-End' }]
        },
        evening: ['Tobit 14', '2 Corinthians 1', 'Matthew 9:18-38']
    },
    '11/17': {
        morning: ['Judith 1', '2 Corinthians 2', 'Matthew 10'],
        matins: null,
        qidase: {
            pauline: 'Romans 2:1-12',
            universal: '1 Peter 2:1-11',
            acts: 'Acts 26:11-19',
            anaphora: 3,
            sets: [{ psalmLxx: '138:7-8', gospel: 'Matthew 12:38-43' }]
        },
        evening: ['Judith 2', '2 Corinthians 3', 'Matthew 11']
    },
    '11/18': {
        morning: ['Judith 3-4', '2 Corinthians 4', 'Matthew 12:1-37'],
        matins: { psalmLxx: '18:3', gospel: 'Matthew 13:52-End' },
        qidase: {
            pauline: '1 Corinthians 15:1-13',
            universal: 'James 1:1-13',
            acts: 'Acts 15:13-22',
            anaphora: 1,
            sets: [{ psalmLxx: '25:4-5', gospel: 'Mark 6:1-14' }]
        },
        evening: ['Judith 5', '2 Corinthians 5', 'Matthew 12:38-50']
    },
    '11/19': {
        morning: ['Judith 6', '2 Corinthians 6', 'Matthew 13:1-30'],
        matins: { psalmLxx: '25:12', gospel: 'Matthew 18:1-12' },
        qidase: {
            pauline: 'Hebrews 11:33-End',
            universal: '1 Peter 4:12-End',
            acts: 'Acts 23:10-15',
            anaphora: 11,
            sets: [{ psalmLxx: '96:7', gospel: 'Matthew 11:25-End' }]
        },
        evening: ['Judith 7', '2 Corinthians 7', 'Matthew 13:31-58']
    },
    '11/20': {
        morning: ['Judith 8', '2 Corinthians 8', 'Matthew 14'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 4:7-End',
            universal: '1 Peter 4:12-End',
            acts: 'Acts 24:17-22',
            anaphora: 4,
            sets: [{ psalmLxx: '18:7-8', gospel: 'John 6:35-48' }]
        },
        evening: ['Judith 9', '2 Corinthians 9', 'Matthew 15:1-20']
    },
    '11/21': {
        morning: ['Judith 10', '2 Corinthians 10', 'Matthew 15:21-39'],
        matins: { psalmLxx: '44:9', gospel: 'Luke 1:39-57' },
        qidase: {
            pauline: 'Ephesians 6:10-19',
            universal: '1 John 5:1-7',
            acts: 'Acts 8:26-End',
            anaphora: 4,
            sets: [{ psalmLxx: '40:1-2', gospel: 'Matthew 19:1-16' }]
        },
        evening: ['Judith 11', '2 Corinthians 11:1-15', 'Matthew 16']
    },
    '11/22': {
        morning: ['Judith 12', '2 Corinthians 11:16-33', 'Matthew 17'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 12:1-11',
            universal: '1 Peter 1:6-10',
            acts: 'Acts 5:26-34',
            anaphora: 7,
            sets: [{ psalmLxx: '15:4-5', gospel: 'Mark 13:14-21' }]
        },
        evening: ['Judith 13', '2 Corinthians 12', 'Matthew 18']
    },
    '11/23': {
        morning: ['Judith 14', '2 Corinthians 13', 'Matthew 19:1-15'],
        matins: { psalmLxx: '90:13-14', gospel: 'John 12:23-30' },
        qidase: {
            pauline: '2 Corinthians 9:5-End',
            universal: 'James 2:14-20',
            acts: 'Acts 16:13-16',
            anaphora: 10,
            sets: [{ psalmLxx: '102:9-10', gospel: 'John 19:31-38' }]
        },
        evening: ['Judith 15', 'Galatians 1', 'Matthew 19:16-30']
    },
    '11/24': {
        morning: ['Judith 16', 'Galatians 2', 'Matthew 20:1-19'],
        matins: null,
        qidase: {
            pauline: '2 Corinthians 7:8-11',
            universal: '1 Peter 5:1-6',
            acts: 'Acts 16:35-End',
            anaphora: 5,
            sets: [{ psalmLxx: '54:13', gospel: 'Matthew 19:17-22' }]
        },
        evening: ['Wisdom of Solomon 1', 'Galatians 3:1-14', 'Matthew 20:20-34']
    },
    '11/25': {
        morning: ['Wisdom of Solomon 2', 'Galatians 3:15-29', 'Matthew 21:1-32'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 2:1-End',
            universal: 'Jude 1:11-17',
            acts: 'Acts 26:6-12',
            anaphora: 3,
            sets: [{ psalmLxx: '67:35', gospel: 'Mark 13:5-14' }]
        },
        evening: ['Wisdom of Solomon 3', 'Galatians 4', 'Matthew 21:33-46']
    },
    '11/26': {
        morning: ['Wisdom of Solomon 4', 'Galatians 5', 'Matthew 22:1-14'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 6:3-20',
            universal: '1 John 2:1-12',
            acts: 'Acts 5:28-34',
            anaphora: 2,
            sets: [{ psalmLxx: '67:31-32', gospel: 'Matthew 1:18-End' }]
        },
        evening: ['Wisdom of Solomon 5', 'Galatians 6', 'Matthew 22:15-46']
    },
    '11/27': {
        morning: ['Wisdom of Solomon 6', 'Ephesians 1', 'Matthew 23'],
        matins: { psalmLxx: '73:12', gospel: 'John 18:28-End' },
        qidase: {
            pauline: 'Hebrews 5:7-End',
            universal: '1 John 5:16-End',
            acts: 'Acts 4:10-19',
            anaphora: 10,
            sets: [{ psalmLxx: '88:18-19', gospel: 'John 10:34-End' }]
        },
        evening: ['Wisdom of Solomon 7', 'Ephesians 2', 'Matthew 24:1-35']
    },
    '11/28': {
        morning: ['Wisdom of Solomon 8', 'Ephesians 3', 'Matthew 24:36-51'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 7:1-End',
            universal: '1 Peter 3:1-8',
            acts: 'Acts 7:1-9',
            anaphora: 4,
            sets: [{ psalmLxx: '54:13-14', gospel: 'Matthew 19:1-13' }]
        },
        evening: ['Wisdom of Solomon 9', 'Ephesians 4', 'Matthew 25:1-30']
    },
    '11/29': {
        morning: ['Wisdom of Solomon 10', 'Ephesians 5', 'Matthew 25:31-46'],
        matins: { psalmLxx: '109:3', gospel: 'Luke 2:1-8' },
        qidase: {
            pauline: 'Galatians 3:15-End',
            universal: '1 John 4:9-18',
            acts: 'Acts 9:20-32',
            anaphora: 12,
            sets: [{ psalmLxx: '33:19-20', gospel: 'Luke 12:1-13' }]
        },
        evening: ['Wisdom of Solomon 11', 'Ephesians 6', 'Matthew 26:1-46']
    },
    '11/30': {
        morning: ['Wisdom of Solomon 12', 'Philippians 1', 'Matthew 26:47-75'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 2:1-9',
            universal: '2 Peter 1:12-17',
            acts: 'Acts 3:1-10',
            anaphora: 1,
            sets: [{ psalmLxx: '123:4-5', gospel: 'Mark 4:35-End' }]
        },
        evening: ['Wisdom of Solomon 13', 'Philippians 2', 'Matthew 27']
    },

    // =========================================================================
    // NEHASE 1 – 30 (August 7 – September 5)
    // =========================================================================
    '12/1': {
        morning: ['Wisdom of Solomon 14', 'Philippians 3', 'Matthew 28'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 5:1-11',
            universal: '1 John 5:1-6',
            acts: 'Acts 5:26-34',
            anaphora: 10,
            sets: [{ psalmLxx: '118:47-48', gospel: 'John 19:38-End' }]
        },
        evening: ['Wisdom of Solomon 15', 'Philippians 4', 'Mark 1']
    },
    '12/2': {
        morning: ['Wisdom of Solomon 16', 'Colossians 1', 'Mark 2'],
        matins: null,
        qidase: {
            pauline: '1 Timothy 2:8-End',
            universal: '1 Peter 3:1-7',
            acts: 'Acts 16:13-19',
            anaphora: 4,
            sets: [{ psalmLxx: '44:14-15', gospel: 'John 8:1-12' }]
        },
        evening: ['Wisdom of Solomon 17', 'Colossians 2', 'Mark 3']
    },
    '12/3': {
        morning: ['Wisdom of Solomon 18', 'Colossians 3', 'Mark 4'],
        matins: null,
        qidase: {
            pauline: '1 Thessalonians 3:1-End',
            universal: '1 Peter 3:10-15',
            acts: 'Acts 14:20-End',
            anaphora: 4,
            sets: [{ psalmLxx: '44:12-13', gospel: 'Luke 18:9-18' }]
        },
        evening: ['Wisdom of Solomon 19', 'Colossians 4', 'Mark 5']
    },
    '12/4': {
        morning: ['Sirach 1', '1 Thessalonians 1', 'Mark 6'],
        matins: null,
        qidase: {
            pauline: 'Romans 12:18-End',
            universal: '1 Peter 5:6-12',
            acts: 'Acts 17:23-28',
            anaphora: 4,
            sets: [{ psalmLxx: '20:1-2', gospel: 'Luke 14:31-End' }],
            alternates: { anaphora: [11] }
        },
        evening: ['Sirach 2', '1 Thessalonians 2', 'Mark 7']
    },
    '12/5': {
        morning: ['Sirach 3', '1 Thessalonians 3', 'Mark 8'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 12:10-17',
            universal: '1 John 5:14-End',
            acts: 'Acts 15:1-13',
            anaphora: 4,
            sets: [{ psalmLxx: '17:43-44', gospel: 'Luke 15:1-11' }]
        },
        evening: ['Sirach 4', '1 Thessalonians 4', 'Mark 9:1-32']
    },
    '12/6': {
        morning: ['Sirach 5', '1 Thessalonians 5', 'Mark 9:33-50'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 3:10-22',
            universal: '1 Peter 3:1-7',
            acts: 'Acts 16:13-19',
            anaphora: 4,
            sets: [{ psalmLxx: '44:12-13', gospel: 'Mark 16:9-19' }],
            alternates: { anaphora: [11] }
        },
        evening: ['Sirach 6', '2 Thessalonians 1', 'Mark 10']
    },
    '12/7': {
        morning: ['Sirach 7', '2 Thessalonians 2', 'Mark 11'],
        matins: { psalmLxx: '86:1-2', gospel: 'Matthew 1:1-17' },
        qidase: {
            pauline: 'Hebrews 9:1-11',
            universal: '1 Peter 2:6-18',
            acts: 'Acts 10:1-30',
            anaphora: 4,
            sets: [{ psalmLxx: '93:12', gospel: 'Matthew 16:13-24' }]
        },
        evening: ['Sirach 8', '2 Thessalonians 3', 'Mark 12']
    },
    '12/8': {
        morning: ['Sirach 9', '1 Timothy 1', 'Mark 13'],
        matins: null,
        qidase: {
            pauline: 'Romans 9:24-End',
            universal: '1 Peter 4:12-End',
            acts: 'Acts 16:35-End',
            anaphora: 4,
            sets: [{ psalmLxx: '104:14-15', gospel: 'Matthew 7:12-26' }]
        },
        evening: ['Sirach 10', '1 Timothy 2', 'Mark 14']
    },
    '12/9': {
        morning: ['Sirach 11', '1 Timothy 3', 'Mark 15'],
        matins: null,
        qidase: {
            pauline: 'Philippians 1:12-24',
            universal: '2 John 1:6-End',
            acts: 'Acts 15:19-25',
            anaphora: 4,
            sets: [{ psalmLxx: '44:9', gospel: 'John 10:1-22' }],
            alternates: { anaphora: [7] }
        },
        evening: ['Sirach 12', '1 Timothy 4-6', 'Mark 16']
    },
    '12/10': {
        morning: ['Sirach 13', '2 Timothy 1', 'Luke 1:1-38'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 12:22-End',
            universal: '1 Peter 1:6-13',
            acts: 'Acts 4:31-End',
            anaphora: 4,
            sets: [{ psalmLxx: '73:12-13', gospel: 'Luke 16:9-19' }]
        },
        evening: ['Sirach 14', '2 Timothy 2', 'Luke 1:39-80']
    },
    '12/11': {
        morning: ['Sirach 15', '2 Timothy 3', 'Luke 2'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 5:11-End',
            universal: '1 John 2:14-20',
            acts: 'Acts 12:18-End',
            anaphora: 4,
            sets: [{ psalmLxx: '44:16-17', gospel: 'Luke 6:20-24' }]
        },
        evening: ['Sirach 16', '2 Timothy 4', 'Luke 3']
    },
    '12/12': {
        morning: ['Sirach 17', 'Titus 1:1-9', 'Luke 4'],
        matins: { psalmLxx: '137:1-2', gospel: 'Matthew 25:31-End' },
        qidase: {
            pauline: '1 Corinthians 9:17-End',
            universal: 'Jude 1:8-14',
            acts: 'Acts 24:1-22',
            anaphora: 4,
            sets: [{ psalmLxx: '71:1-2', gospel: 'Matthew 22:1-15' }],
            alternates: { anaphora: [10] }
        },
        evening: ['Sirach 18', 'Titus 1:10-16', 'Luke 5']
    },
    '12/13': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '67:15-16', gospel: 'Matthew 17:1-14' },
        qidase: {
            pauline: 'Hebrews 11:23-30',
            universal: '2 Peter 1:15-End',
            acts: 'Acts 7:44-51',
            anaphora: 4,
            sets: [{ psalmLxx: '88:12-13', gospel: 'Luke 9:28-38' }],
            alternates: { anaphora: [12] }
        },
        evening: ['Sirach 19', 'Titus 2:1-8', 'Luke 6']
    },
    '12/14': {
        morning: ['Sirach 20', 'Titus 2:9-15', 'Luke 7'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 1:10-19',
            universal: 'James 1:12-24',
            acts: 'Acts 10:30-44',
            anaphora: 4,
            sets: [{ psalmLxx: '43:4-5', gospel: 'Matthew 17:14-24' }],
            alternates: { anaphora: [10] }
        },
        evening: ['Sirach 21', 'Titus 3', 'Luke 8']
    },
    '12/15': {
        morning: ['Sirach 22', 'Philemon 1', 'Luke 9:1-27'],
        matins: null,
        qidase: {
            pauline: '1 Corinthians 12:18-End',
            universal: 'Jude 1:17-End',
            acts: 'Acts 1:12-15',
            anaphora: 1,
            sets: [{ psalmLxx: '18:4-5', gospel: 'Matthew 10:1-15' }]
        },
        evening: ['Sirach 23', 'Hebrews 1', 'Luke 9:28-62']
    },
    '12/16': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '44:9', gospel: 'Luke 1:39-57' },
        qidase: {
            pauline: 'Romans 8:31-End',
            universal: '1 John 2:1-7',
            acts: 'Acts 1:12-15',
            anaphora: 2,
            sets: [{ psalmLxx: '45:4-5', gospel: 'Matthew 26:26-31' }]
        },
        evening: ['Sirach 24', 'Hebrews 2', 'Luke 10']
    },
    '12/17': {
        morning: ['Sirach 25', 'Hebrews 3', 'Luke 11:1-26'],
        matins: { psalmLxx: '44:9', gospel: 'Luke 1:39-57' },
        qidase: {
            pauline: 'Philippians 3:1-15',
            universal: '1 Peter 4:12-End',
            acts: 'Acts 9:1-8',
            anaphora: 4,
            sets: [{ psalmLxx: '117:18-19', gospel: 'John 15:12-27' }]
        },
        evening: ['Sirach 26', 'Hebrews 4', 'Luke 11:27-54']
    },
    '12/18': {
        morning: ['Sirach 27', 'Hebrews 5', 'Luke 12'],
        matins: { psalmLxx: '44:9', gospel: 'Luke 1:39-57' },
        qidase: {
            pauline: 'Philippians 3:1-6',
            universal: '1 John 2:1-20',
            acts: 'Acts 20:28-31',
            anaphora: 4,
            sets: [{ psalmLxx: '2:12', gospel: 'Matthew 15:6-21' }],
            alternates: { anaphora: [5] }
        },
        evening: ['Sirach 28', 'Hebrews 6', 'Luke 13']
    },
    '12/19': {
        morning: ['Sirach 29', 'Hebrews 7', 'Luke 14'],
        matins: { psalmLxx: '44:9', gospel: 'Luke 1:39-57' },
        qidase: {
            pauline: 'Romans 1:8-15',
            universal: '1 Peter 3:8-15',
            acts: 'Acts 16:35-End',
            anaphora: 4,
            sets: [{ psalmLxx: '55:10-11', gospel: 'Matthew 27:50-57' }],
            alternates: { anaphora: [5] }
        },
        evening: ['Sirach 30', 'Hebrews 8', 'Luke 15']
    },
    '12/20': {
        morning: ['Sirach 31', 'Hebrews 9', 'Luke 16'],
        matins: { psalmLxx: '44:9', gospel: 'Luke 1:39-57' },
        qidase: {
            pauline: '1 Corinthians 15:33-51',
            universal: 'James 4:11-End',
            acts: 'Acts 23:22-End',
            anaphora: 4,
            sets: [{ psalmLxx: '12:3', gospel: 'Matthew 22:23-34' }]
        },
        evening: ['Sirach 32', 'Hebrews 10:1-18', 'Luke 17']
    },
    '12/21': {
        morning: ['Sirach 33', 'Hebrews 10:19-39', 'Luke 18'],
        matins: { psalmLxx: '44:9', gospel: 'Luke 1:39-57' },
        qidase: {
            pauline: '1 Corinthians 7:25-End',
            universal: '2 John 1:1-7',
            acts: 'Acts 16:13-18',
            anaphora: 4,
            sets: [{ psalmLxx: '44:9-10', gospel: 'Matthew 2:1-14' }]
        },
        evening: ['Sirach 34', 'Hebrews 11:1-16', 'Luke 19']
    },
    '12/22': {
        morning: ['Sirach 35', 'Hebrews 11:17-40', 'Luke 20'],
        matins: null,
        qidase: {
            pauline: 'Romans 11:25-End',
            universal: '2 Peter 1:19-End',
            acts: 'Acts 7:51-54',
            anaphora: 4,
            sets: [{ psalmLxx: '104:14-15', gospel: 'Matthew 2:1-7' }],
            alternates: { anaphora: [3] }
        },
        evening: ['Sirach 36', 'Hebrews 12', 'Luke 21']
    },
    '12/23': {
        morning: ['Sirach 37', 'Hebrews 13', 'Luke 22'],
        matins: { psalmLxx: '43:10-11', gospel: 'John 16:1-7' },
        qidase: {
            pauline: '1 Corinthians 13:1-End',
            universal: '1 Peter 5:1-12',
            acts: 'Acts 12:18-End',
            anaphora: 4,
            sets: [{ psalmLxx: '45:2-3', gospel: 'Matthew 21:18-23' }],
            alternates: { anaphora: [3] }
        },
        evening: ['Sirach 38', 'James 1', 'Luke 23']
    },
    '12/24': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '83:6', gospel: 'John 10:1-22' },
        qidase: {
            pauline: 'Romans 8:35-End',
            universal: '1 Peter 5:1-6',
            acts: 'Acts 20:28-31',
            anaphora: 5,
            sets: [{ psalmLxx: '43:22-23', gospel: 'Matthew 10:16-End' }]
        },
        evening: ['Sirach 39', 'James 2', 'Luke 24']
    },
    '12/25': {
        morning: ['Sirach 40', 'James 3', 'John 1'],
        matins: null,
        qidase: {
            pauline: 'Ephesians 6:10-19',
            universal: '1 Peter 3:1-10',
            acts: 'Acts 12:12-20',
            anaphora: 7,
            sets: [{ psalmLxx: '38:7-8', gospel: 'Mark 3:7-13' }]
        },
        evening: ['Sirach 41', 'James 4', 'John 2']
    },
    '12/26': {
        morning: ['Sirach 42', 'James 5', 'John 3'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 11:8-17',
            universal: '1 Peter 3:1-10',
            acts: 'Acts 16:1-17',
            anaphora: null,
            sets: [{ psalmLxx: '127:3', gospel: 'Luke 20:5-8' }]
        },
        evening: ['Sirach 43', '1 Peter 1:1-12', 'John 4']
    },
    '12/27': {
        morning: ['Sirach 44', '1 Peter 1:13-25', 'John 5'],
        matins: { psalmLxx: '94:1-2', gospel: 'John 19:1-25' },
        qidase: {
            pauline: 'Hebrews 5:1-10',
            universal: '1 Peter 3:14-End',
            acts: 'Acts 3:17-End',
            anaphora: 10,
            sets: [{ psalmLxx: '98:6-7', gospel: 'John 12:26-31' }]
        },
        evening: ['Sirach 45', '1 Peter 2', 'John 6']
    },
    '12/28': {
        morning: ['Sirach 46', '1 Peter 3', 'John 7'],
        matins: { psalmLxx: '104:9', gospel: 'Matthew 1:1-18' },
        qidase: {
            pauline: 'Romans 4:1-23',
            universal: 'James 2:20-End',
            acts: 'Acts 7:1-9',
            anaphora: 4,
            sets: [{ psalmLxx: '120:1-2', gospel: 'Matthew 22:23-34' }]
        },
        evening: ['Sirach 47', '1 Peter 4:1-11', 'John 8']
    },
    '12/29': {
        morning: ['Sirach 48', '1 Peter 4:12-19', 'John 9'],
        matins: { psalmLxx: '109:3', gospel: 'Luke 2:1-8' },
        qidase: {
            pauline: 'Galatians 3:15-21',
            universal: '1 John 4:9-18',
            acts: 'Acts 20:28-34',
            anaphora: 2,
            sets: [{ psalmLxx: '100:2', gospel: 'Matthew 5:1-17' }]
        },
        evening: ['Sirach 49', '1 Peter 5', 'John 10']
    },
    '12/30': {
        morning: ['Sirach 50', '2 Peter 1', 'John 11'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 11:32-End',
            universal: 'Jude 1:17-End',
            acts: 'Acts 1:12-15',
            anaphora: 1,
            sets: [
                { psalmLxx: '92:4-5', gospel: 'Luke 24:13-33' },
                { psalmLxx: '100:6-7', gospel: 'Mark 1:1-9' }
            ]
        },
        evening: ['Sirach 51', '2 Peter 2', 'John 12']
    },

    // =========================================================================
    // PAGUMEN 1 – 6 (September 6 – 11 in Leap Years)
    // =========================================================================
    '13/1': {
        morning: ['Baruch 1', '2 Peter 3', 'John 13'],
        matins: null,
        qidase: {
            pauline: 'Philippians 1:12-25',
            universal: '1 John 5:1-7',
            acts: 'Acts 18:21-End',
            anaphora: 2,
            sets: [{ psalmLxx: '83:11', gospel: 'Matthew 14:1-7' }]
        },
        evening: ['Baruch 2', '1 John 1', 'John 14']
    },
    '13/2': {
        morning: ['Baruch 3', '1 John 2', 'John 15'],
        matins: null,
        qidase: {
            pauline: 'Titus 1:1-11',
            universal: '2 Peter 3:6-14',
            acts: 'Acts 4:31-36',
            anaphora: 1,
            sets: [{ psalmLxx: '110:10', gospel: 'Luke 10:1-12' }]
        },
        evening: ['Baruch 4', '1 John 3', 'John 16']
    },
    '13/3': {
        morning: [],
        festalHiatus: true,
        matins: { psalmLxx: '109:3-5', gospel: null },
        qidase: {
            pauline: 'Hebrews 7:1-5',
            universal: 'Jude 1:11-17',
            acts: 'Acts 5:17-26',
            anaphora: 13,
            sets: [{ psalmLxx: '49:2-3', gospel: 'Matthew 25:31-End' }]
        },
        evening: ['Baruch 5', '1 John 4', 'John 17']
    },
    '13/4': {
        morning: ['Baruch 6', '1 John 5', 'John 18'],
        matins: null,
        qidase: {
            pauline: '2 Timothy 2:11-End',
            universal: '1 Peter 5:1-6',
            acts: 'Acts 15:19-25',
            anaphora: 13,
            sets: [{ psalmLxx: '33:13-14', gospel: 'Matthew 18:23-End' }]
        },
        evening: ['Susanna 1', '2 John 1', 'John 19']
    },
    '13/5': {
        morning: ['Bel and the Dragon 1', '3 John 1', 'John 20'],
        matins: null,
        qidase: {
            pauline: 'Hebrews 11:32-End',
            universal: '2 Peter 1:19-End',
            acts: 'Acts 13:1-12',
            anaphora: 5,
            sets: [
                { psalmLxx: '90:13-14', gospel: 'Matthew 5:1-19' },
                { psalmLxx: '90:13-14', gospel: 'Mark 16:15-19' }
            ]
        },
        evening: ['Azariah 1:1-34', 'Jude 1', 'John 21']
    },
    '13/6': {
        morning: ['Habakkuk 3', 'Azariah 1:35-68', '2 Peter 3'],
        matins: { psalmLxx: null, gospel: 'Matthew 25:31-46' },
        qidase: {
            pauline: '2 Corinthians 5:17-End',
            universal: '2 Peter 3:8-End',
            acts: 'Acts 17:30-End',
            anaphora: null,
            sets: [{ psalmLxx: '95:2', gospel: 'Luke 13:1-10' }]
        },
        evening: ['Daniel 12', '1 Thessalonians 5', 'John 1:1-5']
    }
};

/**
 * Converts a Septuagint / Ge'ez Psalm reference string (e.g. "83:6-7" or "127:3")
 * into a Masoretic / KJV reference string ("Psalms 84:6-7" or "Psalms 128:3")
 * expected by `kidaseLectionaryRefs`.
 */
function convertLxxPsalmRefToMt(psalmLxxStr, getMtFromLxxFn) {
    if (!psalmLxxStr) return null;
    const cleaned = String(psalmLxxStr).replace(/^Ps(?:alms?)?\s*/i, '').trim();
    const match = cleaned.match(/^(\d+):(\d+)(?:[-,]\s*(\d+))?$/);
    if (!match) return null;
    const lxxCh = parseInt(match[1], 10);
    const lxxStart = parseInt(match[2], 10);
    const lxxEnd = match[3] ? parseInt(match[3], 10) : lxxStart;

    const mapFn = typeof getMtFromLxxFn === 'function' ? getMtFromLxxFn : (ch, v) => {
        if (ch >= 1 && ch <= 8) return { mtChapter: ch, mtVerse: v };
        if (ch === 9) return v <= 20 ? { mtChapter: 9, mtVerse: v } : { mtChapter: 10, mtVerse: v - 20 };
        if (ch >= 10 && ch <= 112) return { mtChapter: ch + 1, mtVerse: v };
        if (ch === 113) return v <= 8 ? { mtChapter: 114, mtVerse: v } : { mtChapter: 115, mtVerse: v - 8 };
        if (ch === 114) return { mtChapter: 116, mtVerse: v };
        if (ch === 115) return { mtChapter: 116, mtVerse: v + 9 };
        if (ch >= 116 && ch <= 145) return { mtChapter: ch + 1, mtVerse: v };
        if (ch === 146) return { mtChapter: 147, mtVerse: v };
        if (ch === 147) return { mtChapter: 147, mtVerse: v + 11 };
        return { mtChapter: ch, mtVerse: v };
    };

    const startMt = mapFn(lxxCh, lxxStart);
    const endMt = mapFn(lxxCh, lxxEnd);
    if (startMt.mtChapter === endMt.mtChapter) {
        return startMt.mtVerse === endMt.mtVerse
            ? `Psalms ${startMt.mtChapter}:${startMt.mtVerse}`
            : `Psalms ${startMt.mtChapter}:${startMt.mtVerse}-${endMt.mtVerse}`;
    }
    return `Psalms ${startMt.mtChapter}:${startMt.mtVerse}-${endMt.mtChapter}:${endMt.mtVerse}`;
}

/**
 * Converts an Ethiopian calendar date (ethYear, ethMonth 1..13, ethDay 1..30)
 * into a Gregorian { year, month, day } object.
 * When `forWazemaEvening` is true (used when hour >= 18:00), subtracts 1 day from
 * the civil JDN so that 6:00 PM+ on the resulting Gregorian date maps to the
 * requested Ethiopian liturgical day.
 */
function ethiopianToGregorian(ethYear, ethMonth, ethDay, { forWazemaEvening = false } = {}) {
    const y = parseInt(ethYear, 10);
    const m = Math.max(1, Math.min(13, parseInt(ethMonth, 10)));
    const isLeap = ((y + 5500) % 4) === 3;
    const maxDay = m === 13 ? (isLeap ? 6 : 5) : 30;
    const d = Math.max(1, Math.min(maxDay, parseInt(ethDay, 10)));

    let jdn = 1723856 + 365 * y + Math.floor(y / 4) + 30 * (m - 1) + (d - 1);
    if (forWazemaEvening) {
        jdn -= 1;
    }

    const f = jdn + 1401 + Math.floor((Math.floor((4 * jdn + 274277) / 146097) * 3) / 4) - 38;
    const e = 4 * f + 3;
    const g = Math.floor((e % 1461) / 4);
    const h = 5 * g + 2;
    const day = Math.floor((h % 153) / 5) + 1;
    const month = ((Math.floor(h / 153) + 2) % 12) + 1;
    const year = Math.floor(e / 1461) - 4716 + Math.floor((14 - month) / 12);

    return { year, month, day };
}

const EOTC_FESTAL_DAYS = {
    '1/1':  { english: 'Ethiopian New Year (Enkutatash) & St. John the Baptist', geez: 'ርእሰ ዐውደ ዓመት ወዮሐንስ መጥምቅ' },
    '1/2':  { english: 'Beheading of St. John the Baptist', geez: 'ምትረተ ርእሱ ለዮሐንስ መጥምቅ' },
    '1/11': { english: 'St. Fasilides the Martyr', geez: 'ቅዱስ ፋሲለደስ ሰማዕት' },
    '1/12': { english: 'St. Michael the Archangel & Council of Ephesus', geez: 'ቅዱስ ሚካኤል ወጉባኤ ኤፌሶን' },
    '1/17': { english: 'Feast of the Glorious Cross (Meskel)', geez: 'በዓለ መስቀል' },
    '1/21': { english: 'Commemoration of Our Lady Mary (Tebere)', geez: 'በዓለ እግዝእትነ ማርያም' },
    '1/23': { english: 'St. George the Martyr', geez: 'ቅዱስ ጊዮርጊስ ሊቀ ሰማዕታት' },
    '1/24': { english: 'Abune Tekle Haymanot & St. Gregory the Monk', geez: 'አቡነ ተክለ ሃይማኖት ወጎርጎርዮስ' },
    '1/27': { english: 'Medhane Alem (Savior of the World)', geez: 'መድኃኔ ዓለም' },
    '1/29': { english: 'Bale Wold (Feast of God the Son)', geez: 'በዓለ ወልድ' },
    '2/9':  { english: 'St. Thomas & the 318 Nicene Fathers', geez: 'ቶማስ ሐዋርያ ወሠለስቱ ምእት' },
    '2/12': { english: 'St. Matthew the Evangelist & St. Michael the Archangel', geez: 'ማቴዎስ ወንጌላዊ ወቅዱስ ሚካኤል' },
    '2/14': { english: 'Abune Aregawi (Zemika\'el) & St. Philip', geez: 'አቡነ አረጋዊ ወፊልጶስ' },
    '2/21': { english: 'Our Lady Mary & Commemoration of Lazarus', geez: 'እግዝእትነ ማርያም ወአልዓዛር' },
    '2/23': { english: 'St. George the Martyr', geez: 'ቅዱስ ጊዮርጊስ ሊቀ ሰማዕታት' },
    '2/24': { english: 'Abune Tekle Haymanot & Abba Hilarion', geez: 'አቡነ ተክለ ሃይማኖት ወአባ ኢላርዮን' },
    '2/25': { english: 'St. Merkorios & Abbaibla', geez: 'ቅዱስ መርቆሬዎስ ወአባ ይብላ' },
    '2/27': { english: 'Medhane Alem (Savior of the World)', geez: 'መድኃኔ ዓለም' },
    '2/29': { english: 'Bale Wold (Feast of God the Son)', geez: 'በዓለ ወልድ' },
    '3/6':  { english: 'Our Lady of Debre Quesquam (Return from Egypt)', geez: 'በዓለ ቁስቋም ማርያም' },
    '3/7':  { english: 'Holy Trinity & Consecration of St. George\'s Church', geez: 'ቅድስት ሥላሴ ወቅዳሴ ቤቱ ለጊዮርጊስ' },
    '3/8':  { english: 'The Four Bodiless Living Creatures (Arba\'etu Ensisa)', geez: 'አርባዕቱ እንስሳ' },
    '3/9':  { english: 'Council of Nicaea (318 Fathers)', geez: 'ጉባኤ ኒቅያ (ሠለስቱ ምእት)' },
    '3/11': { english: 'St. Anna (Hanna), Mother of Our Lady Mary', geez: 'ቅድስት ሐና እመ እግዝእትነ ማርያም' },
    '3/12': { english: 'Feast of St. Michael the Archangel (Hidar Mika\'el)', geez: 'ኅዳር ሚካኤል ሊቀ መላእክት' },
    '3/17': { english: 'St. John Chrysostom', geez: 'ቅዱስ ዮሐንስ አፈ ወርቅ' },
    '3/18': { english: 'Martyrdom of St. Philip the Apostle', geez: 'ቅዱስ ፊልጶስ ሐዋርያ' },
    '3/21': { english: 'St. Mary of Zion (Hidar Tsion)', geez: 'ኅዳር ጽዮን (እግዝእትነ ማርያም)' },
    '3/23': { english: 'St. Cornelius & St. George the Martyr', geez: 'ቆርኔሌዎስ ወቅዱስ ጊዮርጊስ' },
    '3/24': { english: 'The Twenty-Four Heavenly Priests (Kahinate Semay)', geez: 'ካህናተ ሰማይ' },
    '3/27': { english: 'Medhane Alem & St. James Intercisus', geez: 'መድኃኔ ዓለም ወያዕቆብ ዘግሙድ' },
    '3/29': { english: 'Bale Wold & St. Peter Martyr of Alexandria', geez: 'በዓለ ወልድ ወጴጥሮስ ተፍጻሜተ ሰማዕት' },
    '3/30': { english: 'St. Andrew the Apostle', geez: 'ቅዱስ እንድርያስ ሐዋርያ' },
    '4/1':  { english: 'Prophet Elias (Elijah) & Nativity of St. Mary', geez: 'ኤልያስ ነቢይ ወልደታ ለማርያም' },
    '4/3':  { english: 'Entrance of Our Lady Mary into the Temple (Ba\'eta)', geez: 'በዓታ ለእግዝእትነ ማርያም' },
    '4/8':  { english: 'St. Barbara & Abba Kiros', geez: 'ቅድስት በርባራ ወአባ ኪሮስ' },
    '4/12': { english: 'St. Michael the Archangel & Abune Samuel of Waldiba', geez: 'ቅዱስ ሚካኤል ወአቡነ ሳሙኤል ዘዋልድባ' },
    '4/15': { english: 'St. Gregory the Illuminator of Armenia', geez: 'ቅዱስ ጎርጎርዮስ ዘአርማንያ' },
    '4/21': { english: 'Commemoration of Our Lady Mary', geez: 'እግዝእትነ ማርያም ወላዲተ አምላክ' },
    '4/22': { english: 'St. Gabriel the Archangel & St. Deksios', geez: 'ቅዱስ ገብርኤል ወቅዱስ ደቅስዮስ' },
    '4/23': { english: 'Prophet & King David', geez: 'ቅዱስ ዳዊት ንጉሥ' },
    '4/24': { english: 'Nativity of Abune Tekle Haymanot', geez: 'ልደቱ ለአቡነ ተክለ ሃይማኖት' },
    '4/27': { english: 'Medhane Alem (Savior of the World)', geez: 'መድኃኔ ዓለም' },
    '4/28': { english: 'Paramony (Eve) of the Nativity (Genna Gahed)', geez: 'ገሀደ ልደት' },
    '4/29': { english: 'Feast of the Glorious Nativity of Our Lord (Genna)', geez: 'በዓለ ልደተ እግዚእነ ኢየሱስ ክርስቶስ' },
    '5/1':  { english: 'Martyrdom of St. Stephen the Protomartyr', geez: 'ቅዱስ እስጢፋኖስ ቀዳሜ ሰማዕት' },
    '5/4':  { english: 'St. John the Evangelist (Son of Thunder)', geez: 'ቅዱስ ዮሐንስ ወልደ ነጐድጓድ' },
    '5/6':  { english: 'Feast of the Circumcision of Our Lord (Gizret)', geez: 'በዓለ ግዝረተ እግዚእነ' },
    '5/10': { english: 'Paramony (Eve) of the Epiphany (Ketera)', geez: 'ከተራ (ገሀደ ጥምቀት)' },
    '5/11': { english: 'Feast of the Baptism of Our Lord (Timket / Epiphany)', geez: 'በዓለ ጥምቀተ እግዚእነ' },
    '5/12': { english: 'Wedding at Cana of Galilee (Kana Ze-Galila) & St. Michael', geez: 'ቃና ዘገሊላ ወቅዱስ ሚካኤል' },
    '5/15': { english: 'St. Cyriacus (Qirqos) & His Mother St. Julitta', geez: 'ቅዱስ ቂርቆስ ወእሙ ኢየሉጣ' },
    '5/18': { english: 'Translation of the Relics of St. George', geez: 'ፍልሰተ ሥጋሁ ለቅዱስ ጊዮርጊስ' },
    '5/21': { english: 'Dormition of Our Lady Mary (Aster\'eyo Maryam)', geez: 'አስተርእዮ ማርያም (ዕረፍታ ለእግዝእትነ ማርያም)' },
    '5/23': { english: 'St. Timothy the Apostle & St. George', geez: 'ቅዱስ ጢሞቴዎስ ወቅዱስ ጊዮርጊስ' },
    '5/24': { english: 'Abune Tekle Haymanot & St. Mary of Egypt', geez: 'አቡነ ተክለ ሃይማኖት ወማርያም ግብጻዊት' },
    '5/27': { english: 'Medhane Alem (Savior of the World)', geez: 'መድኃኔ ዓለም' },
    '5/29': { english: 'Bale Wold (Feast of God the Son)', geez: 'በዓለ ወልድ' },
    '6/8':  { english: 'Presentation of Our Lord in the Temple (Simeon the Elder)', geez: 'በዓለ ስምዖን (ምዕዳው ውስተ ቤተ መቅደስ)' },
    '6/12': { english: 'St. Michael the Archangel', geez: 'ቅዱስ ሚካኤል ሊቀ መላእክት' },
    '6/16': { english: 'Covenant of Mercy of Our Lady Mary (Kidane Mihret)', geez: 'ኪዳነ ምሕረት' },
    '6/21': { english: 'Commemoration of Our Lady Mary', geez: 'እግዝእትነ ማርያም ወላዲተ አምላክ' },
    '6/23': { english: 'St. Eusebius & St. George the Martyr', geez: 'ቅዱስ አውሳብዮስ ወቅዱስ ጊዮርጊስ' },
    '7/8':  { english: 'St. Matthias the Apostle', geez: 'ቅዱስ ማትያስ ሐዋርያ' },
    '7/10': { english: 'Discovery of the Holy Cross (Megabit Meskel)', geez: 'በዓለ መስቀል (መጋቢት ፲)' },
    '7/12': { english: 'St. Michael the Archangel', geez: 'ቅዱስ ሚካኤል ሊቀ መላእክት' },
    '7/21': { english: 'Commemoration of Our Lady Mary', geez: 'እግዝእትነ ማርያም ወላዲተ አምላክ' },
    '7/29': { english: 'Annunciation & Conception of Our Lord (Tsenset / Bale Wold)', geez: 'በዓለ ፅንሰተ እግዚእነ (በዓለ ወልድ)' },
    '8/13': { english: 'St. Ruphael the Archangel & Holy Martyrs', geez: 'ቅዱስ ሩፋኤል ወቅዱሳን ሰማዕታት' },
    '8/21': { english: 'Commemoration of Our Lady Mary', geez: 'እግዝእትነ ማርያም ወላዲተ አምላክ' },
    '8/23': { english: 'Martyrdom of St. George the Great Martyr', geez: 'ቅዱስ ጊዮርጊስ ሊቀ ሰማዕታት' },
    '8/27': { english: 'Medhane Alem (Savior of the World)', geez: 'መድኃኔ ዓለም' },
    '8/29': { english: 'Bale Wold (Feast of God the Son)', geez: 'በዓለ ወልድ' },
    '8/30': { english: 'Martyrdom of St. Mark the Evangelist', geez: 'ቅዱስ ማርቆስ ወንጌላዊ' },
    '9/1':  { english: 'Feast of the Nativity of Our Lady Mary (Lideta)', geez: 'ልደታ ለእግዝእትነ ማርያም' },
    '9/12': { english: 'Translation of Relics of St. John Chrysostom & St. Michael', geez: 'ዮሐንስ አፈ ወርቅ ወቅዱስ ሚካኤል' },
    '9/15': { english: 'St. Nathanael the Apostle', geez: 'ቅዱስ ናትናኤል ሐዋርያ' },
    '9/21': { english: 'Commemoration of Our Lady Mary', geez: 'እግዝእትነ ማርያም ወላዲተ አምላክ' },
    '9/23': { english: 'St. Julian & St. George the Martyr', geez: 'ቅዱስ ዩልያኖስ ወቅዱስ ጊዮርጊስ' },
    '9/26': { english: 'St. Thomas the Apostle', geez: 'ቅዱስ ቶማስ ሐዋርያ' },
    '10/11': { english: 'St. Claudius (Gelawdewos) the Martyr', geez: 'ቅዱስ ገላውዴዎስ ሰማዕት' },
    '10/12': { english: 'Feast of St. Michael the Archangel (Sene Mika\'el)', geez: 'ሰኔ ሚካኤል ሊቀ መላእክት' },
    '10/21': { english: 'Dedication of the First Church of St. Mary (Hnstata)', geez: 'ሕንፀተ ቤተ ክርስቲያን (ሰኔ ማርያም)' },
    '10/23': { english: 'King Solomon & St. George the Martyr', geez: 'ሰሎሞን ንጉሥ ወቅዱስ ጊዮርጊስ' },
    '11/2':  { english: 'St. Thaddaeus the Apostle', geez: 'ቅዱስ ታዴዎስ ሐዋርያ' },
    '11/5':  { english: 'Martyrdom of Sts. Peter & Paul (Petros we-Pawlos)', geez: 'ቅዱሳን ጴጥሮስ ወጳውሎስ' },
    '11/7':  { english: 'Feast of the Most Holy Trinity (Hamle Silassie)', geez: 'በዓለ ቅድስት ሥላሴ' },
    '11/10': { english: 'St. Theodore & Commemoration of the Cross', geez: 'ቅዱስ ቴዎድሮስ' },
    '11/12': { english: 'St. Michael the Archangel', geez: 'ቅዱስ ሚካኤል ሊቀ መላእክት' },
    '11/18': { english: 'St. James the Apostle, Brother of the Lord', geez: 'ቅዱስ ያዕቆብ እኁሁ ለእግዚእነ' },
    '11/19': { english: 'Feast of St. Gabriel the Archangel & St. Qirqos', geez: 'ቅዱስ ገብርኤል ወቅዱስ ቂርቆስ' },
    '11/21': { english: 'Commemoration of Our Lady Mary', geez: 'እግዝእትነ ማርያም ወላዲተ አምላክ' },
    '11/23': { english: 'St. Longinus the Centurion & St. George', geez: 'ቅዱስ ለንጊኖስ ወቅዱስ ጊዮርጊስ' },
    '11/27': { english: 'Medhane Alem (Savior of the World)', geez: 'መድኃኔ ዓለም' },
    '11/29': { english: 'Bale Wold (Feast of God the Son)', geez: 'በዓለ ወልድ' },
    '12/7':  { english: 'Conception of Our Lady Mary & Holy Trinity', geez: 'ፅንሰታ ለእግዝእትነ ማርያም ወቅድስት ሥላሴ' },
    '12/12': { english: 'St. Michael the Archangel', geez: 'ቅዱስ ሚካኤል ሊቀ መላእክት' },
    '12/13': { english: 'Feast of the Transfiguration on Mount Tabor (Debre Tabor)', geez: 'በዓለ ደብረ ታቦር' },
    '12/16': { english: 'Feast of the Assumption of Our Lady Mary (Filseta)', geez: 'ፍልሰታ ለእግዝእትነ ማርያም' },
    '12/17': { english: 'Octave of the Assumption of Our Lady Mary (Filseta)', geez: 'ሰሙነ ፍልሰታ ለእግዝእትነ ማርያም' },
    '12/18': { english: 'Octave of the Assumption of Our Lady Mary (Filseta)', geez: 'ሰሙነ ፍልሰታ ለእግዝእትነ ማርያም' },
    '12/19': { english: 'Octave of the Assumption of Our Lady Mary (Filseta)', geez: 'ሰሙነ ፍልሰታ ለእግዝእትነ ማርያም' },
    '12/20': { english: 'Octave of the Assumption of Our Lady Mary (Filseta)', geez: 'ሰሙነ ፍልሰታ ለእግዝእትነ ማርያም' },
    '12/21': { english: 'Conclusion of the Octave of Filseta & Our Lady Mary', geez: 'ፍጻሜ ሰሙነ ፍልሰታ ለእግዝእትነ ማርያም' },
    '12/23': { english: 'St. George the Martyr', geez: 'ቅዱስ ጊዮርጊስ ሊቀ ሰማዕታት' },
    '12/24': { english: 'Repose of Abune Tekle Haymanot', geez: 'ዕረፍቱ ለአቡነ ተክለ ሃይማኖት' },
    '12/27': { english: 'Medhane Alem (Savior of the World)', geez: 'መድኃኔ ዓለም' },
    '12/28': { english: 'Holy Patriarchs Abraham, Isaac, and Jacob', geez: 'አብርሃም ይስሐቅ ወያዕቆብ' },
    '12/29': { english: 'Bale Wold (Feast of God the Son)', geez: 'በዓለ ወልድ' },
    '13/3':  { english: 'Feast of St. Ruphael the Archangel', geez: 'ቅዱስ ሩፋኤል ሊቀ መላእክት' },
    '13/6':  { english: 'Commemoration of the Second Coming', geez: 'መታሰቢያ ዳግም ምጽአት' }
};

const EOTC_1938_SCAN_PAGES = [
    { bookPage: 139, pdfPage: 129, ethMonth: 1,  label: 'p. 139 — Meskerem | መስከረም (1–30)' },
    { bookPage: 140, pdfPage: 130, ethMonth: 2,  label: 'p. 140 — Tikimt | ጥቅምት (1–30)' },
    { bookPage: 141, pdfPage: 130, ethMonth: 3,  label: 'p. 141 — Hidar | ኅዳር (1–30)' },
    { bookPage: 142, pdfPage: 131, ethMonth: 4,  label: 'p. 142 — Tahsas | ታኅሣሥ (1–30)' },
    { bookPage: 143, pdfPage: 131, ethMonth: 5,  label: 'p. 143 — Tir | ጥር (1–30)' },
    { bookPage: 144, pdfPage: 132, ethMonth: 6,  label: 'p. 144 — Yekatit | የካቲት (1–30)' },
    { bookPage: 145, pdfPage: 132, ethMonth: 7,  label: 'p. 145 — Megabit | መጋቢት (1–30)' },
    { bookPage: 146, pdfPage: 133, ethMonth: 8,  label: 'p. 146 — Miazia | ሚያዝያ (1–30)' },
    { bookPage: 147, pdfPage: 133, ethMonth: 9,  label: 'p. 147 — Ginbot | ግንቦት (1–30)' },
    { bookPage: 148, pdfPage: 134, ethMonth: 10, label: 'p. 148 — Sene | ሰኔ (1–30)' },
    { bookPage: 149, pdfPage: 134, ethMonth: 11, label: 'p. 149 — Hamle | ሐምሌ (1–30)' },
    { bookPage: 150, pdfPage: 135, ethMonth: 12, label: 'p. 150 — Nehase & Pagumen | ነሐሴ ወጳጕሜን' },
    { bookPage: 151, pdfPage: 135, ethMonth: null, label: 'p. 151 — Movable Seasons & Sundays I | በዓላት ወአጽዋማት ፩' },
    { bookPage: 152, pdfPage: 136, ethMonth: null, label: 'p. 152 — Movable Seasons & Sundays II | በዓላት ወአጽዋማት ፪' },
    { bookPage: 153, pdfPage: 136, ethMonth: null, label: 'p. 153 — Movable Seasons & Sundays III | በዓላት ወአጽዋማት ፫' },
    { bookPage: 154, pdfPage: 137, ethMonth: null, label: 'p. 154 — Movable Seasons & Sundays IV | በዓላት ወአጽዋማት ፬' },
    { bookPage: 155, pdfPage: 137, ethMonth: null, label: 'p. 155 — Movable Seasons & Sundays V | በዓላት ወአጽዋማት ፭' },
    { bookPage: 156, pdfPage: 138, ethMonth: null, label: 'p. 156 — Movable Seasons & Sundays VI | በዓላት ወአጽዋማት ፮' },
    { bookPage: 157, pdfPage: 138, ethMonth: null, label: 'p. 157 — Fixed Annual Feasts I | በዓላት ዘዓመት ፩' },
    { bookPage: 158, pdfPage: 139, ethMonth: null, label: 'p. 158 — Fixed Annual Feasts II | በዓላት ዘዓመት ፪' },
    { bookPage: 159, pdfPage: 139, ethMonth: null, label: 'p. 159 — Fixed Annual Feasts III | በዓላት ዘዓመት ፫' },
    { bookPage: 160, pdfPage: 140, ethMonth: null, label: 'p. 160 — Fixed Annual Feasts IV | በዓላት ዘዓመት ፬' },
    { bookPage: 161, pdfPage: 140, ethMonth: null, label: 'p. 161 — Fixed Annual Feasts V | በዓላት ዘዓመት ፭' },
    { bookPage: 162, pdfPage: 141, ethMonth: null, label: 'p. 162 — Fixed Annual Feasts VI | በዓላት ዘዓመት ፮' },
    { bookPage: 163, pdfPage: 141, ethMonth: null, label: 'p. 163 — Fixed Annual Feasts VII | በዓላት ዘዓመት ፯' },
    { bookPage: 164, pdfPage: 142, ethMonth: null, label: 'p. 164 — Fixed Annual Feasts VIII | በዓላት ዘዓመት ፰' }
];

function getEotcLectionaryEntry(ethMonth, ethDay) {
    const key = `${parseInt(ethMonth, 10)}/${parseInt(ethDay, 10)}`;
    return EOTC_LECTIONARY[key] || null;
}

function getEotcFeastInfo(ethMonth, ethDay) {
    const key = `${parseInt(ethMonth, 10)}/${parseInt(ethDay, 10)}`;
    return EOTC_FESTAL_DAYS[key] || null;
}

function get1938ScanPageForMonth(ethMonth) {
    const m = parseInt(ethMonth, 10);
    if (m === 13) return 150;
    const found = EOTC_1938_SCAN_PAGES.find(p => p.ethMonth === m);
    return found ? found.bookPage : 139;
}

if (typeof window !== 'undefined') {
    window.EOTC_ANAPHORAS = EOTC_ANAPHORAS;
    window.EOTC_LECTIONARY = EOTC_LECTIONARY;
    window.EOTC_FESTAL_DAYS = EOTC_FESTAL_DAYS;
    window.EOTC_1938_SCAN_PAGES = EOTC_1938_SCAN_PAGES;
    window.resolveAppAnaphoraKey = resolveAppAnaphoraKey;
    window.convertLxxPsalmRefToMt = convertLxxPsalmRefToMt;
    window.ethiopianToGregorian = ethiopianToGregorian;
    window.getEotcLectionaryEntry = getEotcLectionaryEntry;
    window.getEotcFeastInfo = getEotcFeastInfo;
    window.get1938ScanPageForMonth = get1938ScanPageForMonth;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EOTC_ANAPHORAS,
        EOTC_LECTIONARY,
        EOTC_FESTAL_DAYS,
        EOTC_1938_SCAN_PAGES,
        resolveAppAnaphoraKey,
        convertLxxPsalmRefToMt,
        ethiopianToGregorian,
        getEotcLectionaryEntry,
        getEotcFeastInfo,
        get1938ScanPageForMonth
    };
}
