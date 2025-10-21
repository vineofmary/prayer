// The source of truth for all these prayers is the open-source Orthodox Liturgy Liturgy database:
// https://docs.google.com/spreadsheets/d/1rkagFuBr3T6wtZ6muVhcN18VW9laFTJwBfi5cS3vnUk/edit?usp=sharing
const prayers = [
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "0",
    "english": "In the Name of the Father, and of the Son, and of the Holy Spirit, One God, Amen",
    "geez_script": "በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ፣ አሜን",
    "geez_phonetic": "besme 'ab weweld wemenfes ḳdus 'aḥadu 'amlak, 'amén",
    "amharic_script": "በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ፣ አሜን",
    "amharic_phonetic": "besme 'ab weweld wemenfes ḳdus 'aḥadu 'amlak, 'amén",
    "tigrinya_script": "ብስም ኣብን ወልድን መንፈስ ቅዱስን ሓደ ኣምላኽ፣ ኣሜን።",
    "tigrinya_phonetic": "bsm 'abn weldn menfes ḳdusn ḥade 'amlakh, 'amén.",
    "spanish": "En el Nombre del Padre, del Hijo y del Espíritu Santo. Un Dios. Amén."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "1",
    "english": "I seal my face and all of myself with the sign of the Cross. In the Name of the Father, and of the Son, and of the Holy Spirit, One God.",
    "geez_script": "አአትብ ገጽየ ወኵለንታየ በትእምርተ መስቀል። በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ።",
    "geez_phonetic": "a'atb getsye wekwlentaye bet'imrte mesḳel. besme 'ab weweld wemenfes ḳdus 'aḥadu 'amlak.",
    "amharic_script": "አንድ አምላክ በሆኑ በአብ በወልድ በመንፈስ ቅዱስ ስም ንጹሕ ልዩ ክቡር ጽሩይ በሆኑ",
    "amharic_phonetic": "and 'amlak behonu be'ab beweld bemenfes ḳdus sm ntsuḥ lyu kbur tsruy behonu",
    "tigrinya_script": "ገጸይን ኩሉ ነብሰይን ብትምህርቲ መስቀል የማዕትብ ኣለኹ፤ ብስም ኣብን ወልድን መንፈስ ቅዱስን ሓደ ኣምላኽ።",
    "tigrinya_phonetic": "getseyn kulu nebseyn btmhrtī mesḳel yema'itb 'alekhu: bsm 'abn weldn menfes ḳdusn ḥade 'amlakh.",
    "spanish": "Hago la señal de la cruz en mi rostro y por todo mi cuerpo. En el nombre del Padre, del Hijo y del Espíritu Santo, un solo Dios."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "1",
    "english": "In the Holy Trinity, believing and taking refuge,",
    "geez_script": "በቅድስት ሥላሴ እንዘ አአምን ወእትመሐፀን",
    "geez_phonetic": "beḳdst slasé 'inze 'a'amn we'itmeḥatsen",
    "amharic_script": "በሦስትነት ወይም በሥላሴ እያመንኩና እየተማፀንኩ",
    "amharic_phonetic": "besostnet weym beslasé 'iyamenkuna 'iyetematsenku",
    "tigrinya_script": "ብቕድስቲ ሥላሴ፤ እናኣመንኩን እናተማሕጸንኩን፤",
    "tigrinya_phonetic": "bqhdstī slasé: 'ina'amenkun 'inatemaḥtsenkun:",
    "spanish": "Yo creo y ofrezco mis súplicas a la Santa Trinidad."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "1",
    "english": "I renounce you, my enemy Satan, in front of my mother, this holy Church, who is my witness, Mary of Zion, to the age of ages.",
    "geez_script": "እክሕደከ ፀርየ ሰይጣን በቅድመ ዛቲ እምየ ቅድስት ቤተ ክርስቲያን እንተ ይእቲ ስምዕየ ማርያም ጽዮን ለዓለመ ዓለም።",
    "geez_phonetic": "ikḥdeke tserye seyṭan beḳdme zatī 'imye ḳdst béte krstīyan 'inte y'itī sm'iye maryam tsyon le'aleme 'alem.",
    "amharic_script": "ጠላቴ ሰይጣንን እክድሃለሁ ፣ በዚች በእናቴ በቤተክርስቲያን ፊት ቆሜ እክድሃለሁ ፣ ለዚህም ምስክሬ ማርያም ናት። በዚህም ዓለም በወዲያኛውም ዓለም እሷን አምባ መጠጊያ አድርጌ እክድሃለሁ።",
    "amharic_phonetic": "ṭelaté seyṭann 'ikdhalehu , bezīch be'inaté bebétekrstīyan fīt ḳomé 'ikdhalehu , lezīhm mskré maryam nat. bezīhm 'alem bewedīyañawm 'alem 'iswan 'amba meṭegīya 'adrgé 'ikdhalehu.",
    "tigrinya_script": "ኣብ ቅድሚ እዛ ኣደይ ዝኾነት ቅድስቲ ቤተ ክርስቲያን ሰይጣን እኽሕደካ ኣሎኹ፤ ንሳ ኸኣ ንዘልዓለም ምስክረይን ጸግዐይን ማርያም ኢያ።",
    "tigrinya_phonetic": "ab ḳdmī 'iza 'adey zkhonet ḳdstī béte krstīyan seyṭan 'ikhḥdeka 'alokhu: nsa khe'a nzel'alem mskreyn tseg'ayn maryam 'īya.",
    "spanish": "Denuncio a Satanás frente a la Santa Madre Iglesia Ortodoxa. Y para esto Mariam de Zion es mi testigo por siempre y para siempre."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "2",
    "english": "We thank You, Lord, and we glorify You. We bless You, Lord, and we trust You. We ask You, Lord, and we beg You.",
    "geez_script": "ነአኵተከ እግዚኦ ወንሴብሐከ። ንባርከከ እግዚኦ ወንትአመነከ። ንስእለከ እግዚኦ ወናስተበቍአከ።",
    "geez_phonetic": "ne'akwteke 'igzī'o wensébḥake. nbarkeke 'igzī'o went'ameneke. ns'ileke 'igzī'o wenastebeḳw'ake.",
    "amharic_script": "አቤቱ እናመሠግንሃለን፣ አቤቱ እናከብርሃለን፣አቤቱ እንገዛልሃለን፣ አቤቱ ቅዱስ ስምህን እናመስግናለን፣",
    "amharic_phonetic": "abétu 'inamesegnhalen, 'abétu 'inakebrhalen,'abétu 'ingezalhalen, 'abétu ḳdus smhn 'inamesgnalen,",
    "tigrinya_script": "ኦ ጐይታ፤ ነመስግነካን ነኽብረካን ኣሎና። ኦ ጐይታ፤ ንባርኸካን ንእመነካን ኣሎና። ኦ ጐይታ፤ ንልምነካን ንማልደካን ኣሎና።",
    "tigrinya_phonetic": "o gweyta: nemesgnekan nekhbrekan 'alona. 'o gweyta: nbarkhekan n'imenekan 'alona. 'o gweyta: nlmnekan nmaldekan 'alona.",
    "spanish": "Te damos gracias, oh Señor, y te adoramos. Te bendecimos, Oh Señor, y en ti confiamos."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "2",
    "english": "We submit to You, Lord, and we serve Your Holy Name. We bow to You, O You to Whom all knees will bow and to Whom all tongues will give service.",
    "geez_script": "ንገኒ ለከ እግዚኦ ወንትቀነይ ለስምከ ቅዱስ። ንሰግድ ለከ ኦ ዘለከ ይሰግድ ኵሉ ብርክ ወለከ ይትቀነይ ኵሉ ልሳን።",
    "geez_phonetic": "ngenī leke 'igzī'o wentḳeney lesmke ḳdus. nsegd leke 'o zeleke ysegd kwlu brk weleke ytḳeney kwlu lsan.",
    "amharic_script": "ጉልበት ሁሉ የሚሰግድልህ አቤቱ እንሰግድልሃለን፣ አንደበትም ሁሉ ለአንተ ይገዛል፣",
    "amharic_phonetic": "gulbet hulu yemīsegdlh 'abétu 'insegdlhalen, 'andebetm hulu le'ante ygezal,",
    "tigrinya_script": "ኦ ጐይታ፤ ንግዝኣካን ንቐዱስ ስምካ እውን ነገልግል ኣሎና። ኩሉ ብርኪ ዝሰግደልካ ኩሉ ልሳን'ውን ዝግዛኣልካ፤ ኦ ጐይታ፤ ንሰግደልካ ኣሎና።",
    "tigrinya_phonetic": "o gweyta: ngz'akan nqhedus smka 'iwn negelgl 'alona. kulu brkī zsegdelka kulu lsan'wn zgza'alka: 'o gweyta: nsegdelka 'alona.",
    "spanish": "Te damos gracias, Oh Señor, y servimos tu Santo nombre. A Ti adoramos, ante quien todas las rodillas se doblan y todas las lenguas sirven."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "2",
    "english": "You are the God of gods, the Lord of lords and the King of kings. You are the God of all flesh and all spirit.",
    "geez_script": "አንተ ውእቱ አምላከ አማልከት ወእግዚአ አጋእዝት ወንጉሠ ነገሥት። አምላከ አንተ ለኩሉ ዘሥጋ ወለኵላ ዘነፍስ።",
    "geez_phonetic": "ante w'itu 'amlake 'amalket we'igzī'a 'aga'izt wenguse negest. 'amlake 'ante lekulu zesga welekwla zenefs.",
    "amharic_script": "የአምላኮች አምላክ፣ የጌቶች ጌታ የንጉሦችም ንጉሥ አንተ ነህ። የሥጋም የነፍስም ፈጣሪ አንተ ነህ።",
    "amharic_phonetic": "ye'amlakoch 'amlak, yegétoch géta yengusochm ngus 'ante neh. yesgam yenefsm feṭarī 'ante neh.",
    "tigrinya_script": "ኣምላኽ ኣማልኽቲ፤ ጐይታ ጐይቶትን፤ ንጉሥ ነገሥታትን ንስኻ ኢኻ። ንኹሉ ሥጋን ንኹሉ ነፍስን ፈጣሪ ንስኻ ኢኻ።",
    "tigrinya_phonetic": "amlakh 'amalkhtī: gweyta gweytotn: ngus negestatn nskha 'īkha. nkhulu sgan nkhulu nefsn feṭarī nskha 'īkha.",
    "spanish": "Eres Dios de dioses, Señor de señores y Rey de reyes. Eres el Dios de todos los que tienen carne y alma."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "2",
    "english": "And we call You as Your holy Son taught us, saying: “when you pray, say this:”",
    "geez_script": "ወንጼውዓከ በከመ መሀረነ ቅዱስ ወልድከ እንዘ ይብል አንትሙሰ ሶበ ትጼልዩ ከመዝ በሉ።",
    "geez_phonetic": "wentséw'ake bekeme meharene ḳdus weldke 'inze ybl 'antmuse sobe ttsélyu kemez belu.",
    "amharic_script": "እናንተስ በምትጸልዩበት ጊዜ እንዲህ ብላችሁ ጸልዩ ብሎ ቅዱስ ልጅህ እንዳስተማረን እንጠራሃለን።",
    "amharic_phonetic": "inantes bemttselyubet gīzé 'indīh blachhu tselyu blo ḳdus ljh 'indastemaren 'inṭerahalen.",
    "tigrinya_script": "ቅዱስ ወድኻ ንስኻትኩምሲ ክትጽልዩ ከሎኹም ከምዚ በሉ፤ ኢሉ ከም ዝመሃረና ንጽውዓካ ኣሎና።",
    "tigrinya_phonetic": "ḳdus wedkha nskhatkumsī kttslyu kelokhum kemzī belu: 'īlu kem zmeharena ntsw'aka 'alona.",
    "spanish": "A Ti invocamos, de acuerdo con la enseñanza de tu Santo Hijo, quien dijo cuando oren, digan:"
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "3",
    "english": "Our Father in Heaven; Hallowed be Your name. Your Kingdom come. Your will be done, on earth as it is in Heaven.",
    "geez_script": "አቡነ ዘበሰማያት፣ ይትቀደስ ስምከ። ትምጻእ መንግሥትከ ወይኩን ፈቃድከ በከመ በሰማይ ከማሁ በምድር።",
    "geez_phonetic": "abune zebesemayat, ytḳedes smke. tmtsa'i mengstke weykun feḳadke bekeme besemay kemahu bemdr.",
    "amharic_script": "አባታችን ሆይ፥ በሰማይ የምትኖር፥ ስምህ ይቀደስ፥ መንግሥትህ ትምጣ፥ ፈቃድህ በሰማይ እንደሆነ እንዲሁም በምድር ይሁን።",
    "amharic_phonetic": "abatachn hoy; besemay yemtnor; smh yḳedes; mengsth tmṭa; feḳadh besemay 'indehone 'indīhum bemdr yhun.",
    "tigrinya_script": "ኣብ ሰማያት እትነብር ኣቦና ስምካ ይቀደስ፥ መንግስትኻ ትምጻእ፥ ፈቓድካ ከምቲ ኣብ ሰማያት ከምኡ'ውን ኣብ ምድሪ ይኹን፥",
    "tigrinya_phonetic": "ab semayat 'itnebr 'abona smka yḳedes; mengstkha tmtsa'i; feqhadka kemtī 'ab semayat kem'u'wn 'ab mdrī ykhun;",
    "spanish": "Padre nuestro que estás en los cielos, santificado sea tu nombre. Venga tu reino, Hágase tu voluntad en la tierra como en el cielo."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "3",
    "english": "Give us this day our daily bread. And forgive us our sins and trespasses, as we forgive those who trespass against us.",
    "geez_script": "ሲሳየነ ዘለለ ዕለትነ ሀበነ ዮም። ኅድግ ለነ አበሳነ ወጌጋየነ ከመ ንሕነኒ ንኅድግ ለዘአበሰ ለነ።",
    "geez_phonetic": "sīsayene zelele 'iletne habene yom. hdg lene 'abesane wegégayene keme nḥnenī nhdg leze'abese lene.",
    "amharic_script": "የዕለት እንጀራችንን ስጠን ለዛሬ፥ በደላችንን ይቅር በለን፥ እኛም የበደሉንን ይቅር እንደምንል፥",
    "amharic_phonetic": "ye'ilet 'injerachnn sṭen lezaré; bedelachnn yḳr belen; 'iñam yebedelunn yḳr 'indemnl;",
    "tigrinya_script": "ናይ ዕለት እንጌራና ሎሚ ሃበና፥ ንሕና ንዝበደሉና በደሎም ከም እንኃደግናሎም በደልና ኅደገልና፥",
    "tigrinya_phonetic": "nay 'ilet 'ingérana lomī habena; nḥna nzbedeluna bedelom kem 'inhadegnalom bedelna hdegelna;",
    "spanish": "Danos hoy nuestro pan de cada día Y perdona nuestras ofensas, así como también perdonamos a los que nos ofenden."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "3",
    "english": "And lead us not into temptation, Lord, but deliver us and rescue us from all evil. For Yours is the Kingdom, the Power and the Glory, forever. Amen.",
    "geez_script": "ኢታብአነ እግዚኦ ውስተ መንሱት፣ አላ አድኅነነ ወባልሐነ፣ እምኵሉ እኩይ እስመ ዚአከ ይእቲ መንግሥት ኀይል ወስብሐት ለዓለመ ዓለም። አሜን።",
    "geez_phonetic": "ītab'ane 'igzī'o wste mensut, 'ala 'adhnene webalḥane, 'imkwlu 'ikuy 'isme zī'ake y'itī mengst hayl wesbḥat le'aleme 'alem. 'amén.",
    "amharic_script": "አቤቱ ወደ ፈተና አታግባን፥ ከክፉ ሁሉ አድነን እንጂ፥ መንግሥት ያንተ ናትና። ኃይል፥ ክብር፥ ምስጋና ለዘለዓለም አሜን።",
    "amharic_phonetic": "abétu wede fetena 'atagban; kekfu hulu 'adnen 'injī; mengst yante natna. hayl; kbr; msgana lezele'alem 'amén.",
    "tigrinya_script": "ካብ ክፉእ ኣድኅነና እምበር ኣብ ፈተና ኣይተእትወና፥ መንግስትን፡ ኃይልን ፡ክብርን ንዘለዓለም ናትካ እዩ፡ አሜን።",
    "tigrinya_phonetic": "kab kfu'i 'adhnena 'imber 'ab fetena 'ayte'itwena; mengstn  hayln  kbrn nzele'alem natka 'iyu  'amén.",
    "spanish": "No nos dejes caer en tentación, y líbranos y rescátanos de todo mal; porque tuyo es el reino, el poder y la gloria, por los siglos de los siglos. Amén."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "4",
    "english": "With the Greeting of Saint Gabriel the Angel, O my Lady Mary, peace to you.",
    "geez_script": "በሰላመ ቅዱስ ገብርኤል መልአክ፣ ኦ እግዝእትየ ማርያም ሰላም ለኪ።",
    "geez_phonetic": "beselame ḳdus gebr'él mel'ak, 'o 'igz'itye maryam selam lekī.",
    "amharic_script": "እመቤታችን ድንግል ማርያም ሆይ በመልአኩ በቅዱስ ገብርኤል ሰላምታ ሰላም እልሻለሁ",
    "amharic_phonetic": "imebétachn dngl maryam hoy bemel'aku beḳdus gebr'él selamta selam 'ilshalehu",
    "tigrinya_script": "ኦ እግዝእትየ ማርያም ብናይ ቅዱስ ገብርኤል መልኣኽ ሰላምታ ሰላም እብለኪ፡",
    "tigrinya_phonetic": "o 'igz'itye maryam bnay ḳdus gebr'él mel'akh selamta selam 'iblekī",
    "spanish": "O Santa Virgen Maria, en la paz del Ángel Gabriel, la paz sea contigo."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "4",
    "english": "You are virgin in your thought and virgin in your flesh. The Mother of the Lord God of hosts, peace to you.",
    "geez_script": "ድንግል በኅሊናኪ ወድንግል በሥጋኪ። እመ እግዚአብሔር ጸባኦት ሰላም ለኪ።",
    "geez_phonetic": "dngl behlīnakī wedngl besgakī. 'ime 'igzī'abḥér tseba'ot selam lekī.",
    "amharic_script": "በሃሳብሽ ድንግል ነሽ በሥጋሽም ድንግል ነሽ። የአሸናፈ የእግዚአብሔር እናት ሆይ ሰላምታ ላንቺ ይገባል።",
    "amharic_phonetic": "behasabsh dngl nesh besgashm dngl nesh. ye'ashenafe ye'igzī'abḥér 'inat hoy selamta lanchī ygebal.",
    "tigrinya_script": "ብሕልናኺ ድንግል ኢኺ፡ ብሥጋኺ'ውን ድንግል ኢኺ። ኣደ እግዚአብሔር ፀባዖት (ጎይታ ሠራዊት) ሰላም እብለኪ ኣለኹ።",
    "tigrinya_phonetic": "bḥlnakhī dngl 'īkhī  bsgakhī'wn dngl 'īkhī. 'ade 'igzī'abḥér tseba'ot (goyta serawīt) selam 'iblekī 'alekhu.",
    "spanish": "Eres virgen en espíritu, así como en cuerpo: O Madre del Dios perfecto, la paz sea contigo."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "4",
    "english": "Blessed are you among women, and blessed is the fruit of your womb! Rejoice, joyful one, O filled with grace, the Lord is with you.",
    "geez_script": "ቡርክት አንቲ እምአንስት ወቡሩክ ፍሬ ከርሥኪ። ተፈሥሒ ፍሥሕት ኦ ምልእተ ጸጋ እግዚአብሔር ምስሌኪ።",
    "geez_phonetic": "burkt 'antī 'im'anst weburuk fré kerskī. tefesḥī fsḥt 'o ml'ite tsega 'igzī'abḥér mslékī.",
    "amharic_script": "ከሴቶች ሁሉ ተለይተሽ አንቺ የተባረክሽ ነሽ የማኀፀንሽም ፍሬ የተባረከ ነው። ጸጋን የተመላሽ ሆይ ደስ ይበልሽ እግዚአብሔር ከአንቺ ጋር ነውና",
    "amharic_phonetic": "kesétoch hulu teleytesh 'anchī yetebareksh nesh yemahatsenshm fré yetebareke new. tsegan yetemelash hoy des ybelsh 'igzī'abḥér ke'anchī gar newna",
    "tigrinya_script": "ንስኺ ካብ ኣንስቲ ብርኽቲ ኢኺ፡ ፍረ ከርሥኺ'ውን ብሩኽ እዩ። ኦ ምልእተ ጸጋ እግዚአብሔር ምሳኺ እዩ፡ ኦ ፍሥሕት ደስ ይበልኪ፡",
    "tigrinya_phonetic": "nskhī kab 'anstī brkhtī 'īkhī  fre kerskhī'wn brukh 'iyu. 'o ml'ite tsega 'igzī'abḥér msakhī 'iyu  'o fsḥt des ybelkī",
    "spanish": "Bendita tú eres entre las mujeres y bendito es el Fruto de tu vientre. Alégrate, tú que estás llena de gracia, el Señor está contigo."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "4",
    "english": "Ask and pray for our mercy to your beloved Son, Jesus Christ, that He may forgive us our sins. Amen.",
    "geez_script": "ሰአሊ ወጸልዪ ምሕረት በእንቲኣነ ኀበ ፍቁር ወልድኪ ኢየሱስ ክርስቶስ ከመ ይሥረይ ለነ ኃጣውኢነ። አሜን።",
    "geez_phonetic": "se'alī wetselyī mḥret be'intī'ane habe fḳur weldkī 'īyesus krstos keme ysrey lene haṭaw'īne. 'amén.",
    "amharic_script": "ከተወደደው ልጅሽ ከጌታችን ከመድኃኒታችን ከኢየሱስ ክርክቶስ ዘንድ ይቅርታን ለምኝልን ኃጢአታችንን ያስተሠርይልን ዘንድ ለዘለዓለሙ አሜን።",
    "amharic_phonetic": "ketewededew ljsh kegétachn kemedhanītachn ke'īyesus krktos zend yḳrtan lemñln haṭī'atachnn yasteseryln zend lezele'alemu 'amén.",
    "tigrinya_script": "ኃጢኣትና ኪሠርየልና ናብ ፍቁር ወድኺ ኢየሱስ ክርስቶስ ምእንታና ምሕረት ለምንልና። አሜን።",
    "tigrinya_phonetic": "haṭī'atna kīseryelna nab fḳur wedkhī 'īyesus krstos m'intana mḥret lemnlna. 'amén.",
    "spanish": "Ruega y ora por nosotros a tu amado Hijo, Eyesus Kristos, para que tenga misericordia de nuestras almas y nos perdone nuestros pecados. Amén."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "5",
    "english": "We believe in one God, God the Father Almighty, maker of heaven and earth, all things visible and invisible.",
    "geez_script": "ነአምን በአሐዱ አምላክ እግዚአብሔር አብ አኃዜ ኵሉ ገባሬ ሰማያት ወምድር ዘያስተርኢ ወዘኢያስተርኢ።",
    "geez_phonetic": "ne'amn be'aḥadu 'amlak 'igzī'abḥér 'ab 'ahazé kwlu gebaré semayat wemdr zeyaster'ī weze'īyaster'ī.",
    "amharic_script": "ሁለን በፈጠረ አንድ አምላክ በሚሆን በእግዚአብሔር አብ እናምናለን። ሰማይና ምድርን የፈጠረ የሚታየውንና የማይታየውን",
    "amharic_phonetic": "hulen befeṭere 'and 'amlak bemīhon be'igzī'abḥér 'ab 'inamnalen. semayna mdrn yefeṭere yemītayewnna yemaytayewn",
    "tigrinya_script": "ኩሉ ብዝሓዘ ሰማይን ምድርን ዝረአን ዘይረአን ብዝፈጠረ ብሓደ እግዚኣብሔር ኣብ ንኣምን።",
    "tigrinya_phonetic": "kulu bzḥaze semayn mdrn zre'an zeyre'an bzfeṭere bḥade 'igzī'abḥér 'ab n'amn.",
    "spanish": "Creo en un solo Dios, Padre todopoderoso, Creador del Cielo y de la Tierra, de todo lo visible y lo invisible."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "5",
    "english": "And we believe in one Lord Jesus Christ, the only-begotten Son of the Father, who was with Him before the creation of the world:",
    "geez_script": "ወነአምን በአሐዱ እግዚእ ኢየሱስ ክርስቶስ ወልደ አብ ዋሕድ ዘህልው ምስሌሁ እምቅድመ ይትፈጠር ዓለም",
    "geez_phonetic": "wene'amn be'aḥadu 'igzī'i 'īyesus krstos welde 'ab waḥd zehlw msléhu 'imḳdme ytfeṭer 'alem",
    "amharic_script": "ዓለም ሳይፈጠር ከእርሱ ጋር በነበረ አንድ የአብ ልጅ በሚሆን በአንድ ጌታ በኢየሱስ ክርስቶስ እናምናለን፣",
    "amharic_phonetic": "alem sayfeṭer ke'irsu gar benebere 'and ye'ab lj bemīhon be'and géta be'īyesus krstos 'inamnalen,",
    "tigrinya_script": "ብሓደ ጐይታ ብኢየሱስ ክርስቶስ ዓለም ፡ ከይተፈጥረ ምስኡ ፡ ህልው ፡ ብዝኾነ ወልደ ፡ ኣብ ዋህድ ፡ ውን ነኣምን።",
    "tigrinya_phonetic": "bḥade gweyta b'īyesus krstos 'alem   keytefeṭre  ms'u   hlw   bzkhone welde   'ab wahd   wn ne'amn.",
    "spanish": "Creo en un solo Señor Jesucristo, Hijo único de Dios, quien con El estuvo antes de la creación del mundo."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "5",
    "english": "Light from Light, True God from True God, begotten not made, of one essence with the Father.",
    "geez_script": "ብርሃን ዘእምብርሃን አምላክ ዘእምአምላክ ዘበአማን ዘተወልደ ወአኮ ዘተገብረ ዘዕሩይ ምስለ አብ በመለኮቱ።",
    "geez_phonetic": "brhan ze'imbrhan 'amlak ze'im'amlak zebe'aman zetewelde we'ako zetegebre ze'iruy msle 'ab bemelekotu.",
    "amharic_script": "ከብርሃን የተገኘ ብርሃን ከእውነተኛ አምላክየተገኘ አምላክ የተወለደ እንጂ ያልተፈጠረ በባሕርይው ከአብ ጋር የሚስተካከል",
    "amharic_phonetic": "kebrhan yetegeñe brhan ke'iwneteña 'amlakyetegeñe 'amlak yetewelede 'injī yaltefeṭere bebaḥryw ke'ab gar yemīstekakel",
    "tigrinya_script": "ካብ ብርሃን ዝተረኽበ ብርሃን፡ ካብ ሓቀኛ ኣምላኽ ዝተረኽበ ኣምላኽ፡ ዝተወልደ እምበር ፍጡር ዘይኮነ፡ ብመለኮቱ ምስ ኣብ ማዕረ ዝኾነ።",
    "tigrinya_phonetic": "kab brhan zterekhbe brhan  kab ḥaḳeña 'amlakh zterekhbe 'amlakh  ztewelde 'imber fṭur zeykone  bmelekotu ms 'ab ma'ire  zkhone.",
    "spanish": "Luz de luz, Dios verdadero de Dios verdadero, engendrado, no creado, de la misma esencia del Padre."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "5",
    "english": "By Whom all things were made, and without Him was not anything in heaven or earth made:",
    "geez_script": "ዘቦቱ ኵሉ ኮነ ወዘእንበሌሁሰ አልቦ ዘኮነ ወኢምንትኒ ዘበሰማይኒ ወዘበምድርኒ",
    "geez_phonetic": "zebotu kwlu kone weze'inbeléhuse 'albo zekone we'īmntnī zebesemaynī wezebemdrnī",
    "amharic_script": "ሁሉ በእርሱ የሆነ በሰማይ ካለው በምድርም ካለው ያለእርሱ ምንም ምን የሆነ የለም",
    "amharic_phonetic": "hulu be'irsu yehone besemay kalew bemdrm kalew yale'irsu mnm mn yehone yelem",
    "tigrinya_script": "ኩሉ ብእኡ ዝተፈጥረ፡ ብዘይካኡ ግና ኣብዚ ምድሪ ዘሎ ይኹን ወይስ ኣብ ሰማይ ዘሎ ምንም ዝተፈጥረ የልቦን።",
    "tigrinya_phonetic": "kulu b'i'u ztefeṭre  bzeyka'u gna 'abzī mdrī zelo ykhun weys 'ab semay zelo mnm ztefeṭre yelbon.",
    "spanish": "Por quien todo fue hecho, y sin El nada en el cielo ni en  la tierra fue hecho;"
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "5",
    "english": "Who for us men and for our salvation came down from heaven, was made man and was incarnate from the Holy Spirit and from the holy Virgin Mary.",
    "geez_script": "ዘበእንቲአነ ለሰብእ ወበእንተ መድኃኒትነ ወረደ እምሰማያት ተሰብአ ወተሠገወ እመንፈስ ቅዱስ ወእማርያም እምቅድስት ድንግል።",
    "geez_phonetic": "zebe'intī'ane leseb'i webe'inte medhanītne werede 'imsemayat teseb'a wetesegewe 'imenfes ḳdus we'imaryam 'imḳdst dngl.",
    "amharic_script": "ስለኛ ስለ ሰዎች ስለ መዳናችን ከሰማይ ወረደ፣ ከመንፈስ ቅዱስ የተነሳ ከቅድስት ድንግል ማርያም ፈጽሞ ሰው ሆነ።",
    "amharic_phonetic": "sleña sle sewoch sle medanachn kesemay werede, kemenfes ḳdus yetenesa keḳdst dngl maryam fetsmo sew hone.",
    "tigrinya_script": "ምእንታና ምእንቲ ሰብ ምእንቲ ድኅነትና፡ ካብ ሰማያት ዝወረደ፡ብመንፈስ ቅዱስ ካብ ቅድስት ድንግል ማርያም ሥጋ  ለበሰ ሰብ ኮነ።",
    "tigrinya_phonetic": "m'intana m'intī seb m'intī dhnetna  kab semayat zwerede bmenfes ḳdus kab ḳdst dngl maryam sga lebese seb kone.",
    "spanish": "Que por nosotros, los hombres, y por nuestra salvación, bajó del cielo, y fue encarnado por el Espíritu Santo, y por la Santa Virgen María."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "5",
    "english": "Became man, was crucified for our sakes in the days of Pontius Pilate, suffered, died, was buried and rose from the dead on the third day as was written in the holy scriptures:",
    "geez_script": "ኮነ ብእሴ ወተሰቅለ በእንቲአነ በመዋዕለ ጲላጦስ ጰንጤናዊ ሐመ ወሞተ ወተቀብረ ወተንሥአ እሙታን አመ ሣልስት ዕለት በከመ ጽሑፍ ውስተ ቅዱሳት መጻሕፍት",
    "geez_phonetic": "kone b'isé weteseḳle be'intī'ane bemewa'ile p̣īlaṭos p̣enṭénawī ḥame wemote weteḳebre wetens'a 'imutan 'ame salst 'ilet bekeme tsḥuf wste ḳdusat metsaḥft",
    "amharic_script": "ሰው ሆኖ በጴንጤናዊ ጲላጦስ  ዘመን ስለኛ ተሰቀለ፣ ታመመ፣ ሞተ፣ ተቀበረም፤ በሶስተኛውም ቀን ከሙታን ተለይቶ ተነሳ፤ በቅዱሳት መጻህፍት እንደተጻፈ",
    "amharic_phonetic": "sew hono bep̣énṭénawī p̣īlaṭos  zemen sleña teseḳele, tameme, mote, teḳeberem: besosteñawm ḳen kemutan teleyto tenesa: beḳdusat metsahft 'indetetsafe",
    "tigrinya_script": "ሰብ ኮይኑ ድማ ብዘመን ጴንጤናዊ ጲላጦስ ምእንታና ተሰቕለ፡ ሓመመ፡ መከራ መስቀል ተቐበለ፡ ሞተ፡ ተቐብረ፡ ኣብ ቅዱሳት መጻሕፍቲ ከም ዝተጻሕፈ፡",
    "tigrinya_phonetic": "seb koynu dma bzemen p̣énṭénawī p̣īlaṭos m'intana teseqhle  ḥameme  mekera mesḳel teqhebele  mote  teqhebre  'ab ḳdusat metsaḥftī kem ztetsaḥfe",
    "spanish": "Y se hizo hombre; Y por nuestra causa fue crucificado en tiempos de Poncio Pilato; padeció y fue sepultado. Y resucitó al tercer día, como fue escrito en las sagradas escrituras:"
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "5",
    "english": "Ascended in glory into heaven, sat at the right hand of his Father, and will come again in glory to judge the living and the dead; there is no end of his reign.",
    "geez_script": "ዐርገ በስብሐት ውስተ ሰማያት ወነበረ በየማነ አቡሁ ዳግመ ይመጽእ በስብሐት ይኰንን ሕያዋነ ወሙታነ ወአልቦ ምኅለቅት ለመንግሥቱ።",
    "geez_phonetic": "arge besbḥat wste semayat wenebere beyemane 'abuhu dagme ymets'i besbḥat ykwenn ḥyawane wemutane we'albo mhleḳt lemengstu.",
    "amharic_script": "በክብር ወደ ሰማይ አረገ፤ በአባቱም ቀኝ ተቀመጠ። ዳግመኛም ህያዋንና ሙታንን ይገዛ ዘንድ በጌትነት ይመጣል። ለመንግስቱም ፍጻሜ የለውም፤",
    "amharic_phonetic": "bekbr wede semay 'arege: be'abatum ḳeñ teḳemeṭe. dagmeñam hyawanna mutann ygeza zend begétnet ymeṭal. lemengstum ftsamé yelewm:",
    "tigrinya_script": "ብኽብሪ ናብ ሰማይ ዓረገ፡ ኣብ የማን ኣቡኡ ተቐመጠ፡ ከም ብሓድሽ ንሕያዋንን ንምዉታትን ክፈርድ ብኽብሪ ክመጽእ እዩ፡ ንመንግሥቱውን መወዳእታ የብሉን።",
    "tigrinya_phonetic": "bkhbrī nab semay 'arege  'ab yeman 'abu'u teqhemeṭe  kem bḥadsh nḥyawann nmwutatn kferd bkhbrī kmets'i 'iyu  nmengstuwn meweda'ita yeblun.",
    "spanish": "Y subió al cielo. Y está sentado a la derecha del Padre; y de nuevo vendrá con gloria para juzgar a vivos y muertos, y su reino no tendrá fin."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "5",
    "english": "And we believe in the Holy Spirit, the life-giving God, who proceeds from the Father; we worship and glorify him with the Father and the Son; who spoke by the prophets.",
    "geez_script": "ወነአምን በመንፈስ ቅዱስ እግዚእ ምኅየዊ ዘሠረፀ እምአብ ንስግድ ሎቱ ወንሰብሖ ምስለ አብ ወወልድ ዘነበበ በነቢያት።",
    "geez_phonetic": "wene'amn bemenfes ḳdus 'igzī'i mhyewī zeseretse 'im'ab nsgd lotu wensebḥo msle 'ab weweld zenebebe benebīyat.",
    "amharic_script": "ጌታ ማህየዊ በሚሆን ከአብ በሰረጸ በመንፈስ ቅዱስም እናምናለን። እንሰግድለት እናመሰግነውም ዘንድ ከአብና ከወልድ ጋራ በነቢያት የተናገረ፤",
    "amharic_phonetic": "géta mahyewī bemīhon ke'ab beseretse bemenfes ḳdusm 'inamnalen. 'insegdlet 'inamesegnewm zend ke'abna keweld gara benebīyat yetenagere:",
    "tigrinya_script": "ጐይታን መሕወይን ብዝኾነ ካብ ኣብ ዝሰረፀ መንፈስ ቅዱስውን ንኣምን። ምስ ኣብን ወልድን ንሰግደሉን ነመስግኖን፡ ብነብያት ዝተዛረበ እዩ።",
    "tigrinya_phonetic": "gweytan meḥweyn bzkhone kab 'ab zseretse menfes ḳduswn n'amn. ms 'abn weldn nsegdelun nemesgnon  bnebyat ztezarebe 'iyu.",
    "spanish": "Creo en el Espíritu Santo, Señor y dador de vida, que procede del Padre, que con el Padre y el Hijo recibe una misma adoración y gloria, y que habló por los profetas."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "5",
    "english": "And we believe in one holy, universal, apostolic Church, and we believe in one baptism for the remission of sins,",
    "geez_script": "ወነአምን በአሐቲ ቅድስት ቤተ ክርስቲያን እንተ ላዕለ ኵሉ ጉባኤ ዘሐዋርያት። ወነአምን በአሐቲ ጥምቀት ለሥርየተ ኃጢአት",
    "geez_phonetic": "wene'amn be'aḥatī ḳdst béte krstīyan 'inte la'ile kwlu guba'é zeḥawaryat. wene'amn be'aḥatī ṭmḳet lesryete haṭī'at",
    "amharic_script": "ከሁሉ በላይ በምትሆን ሐዋርያት በሰበሰቧት በአንዲት ቅድስት ቤተ ክርስቲያንም እናምናለን። ኃጢአት ለማስተስረይ በአንዲት ጥምቀት እናምናለን፣",
    "amharic_phonetic": "kehulu belay bemthon ḥawaryat besebesebwat be'andīt ḳdst béte krstīyanm 'inamnalen. haṭī'at lemastesrey be'andīt ṭmḳet 'inamnalen,",
    "tigrinya_script": "ልዕሊ ኩሉ ናይ ሓዋርያት ጉባኤ ብዝኾነት ብሓንቲ ቅድስት ቤተ ክርስቲያን ንኣምን። ንሕድገት ሓጢኣት ብሓንቲ ጥምቀትውን ንኣምን።",
    "tigrinya_phonetic": "l'ilī kulu nay ḥawaryat guba'é bzkhonet bḥantī ḳdst béte krstīyan n'amn. nḥdget ḥaṭī'at bḥantī ṭmḳetwn n'amn.",
    "spanish": "Creo en una Iglesia, Santa, Universal y Apostólica. Confieso que hay un solo bautismo para el perdón de los pecados."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "5",
    "english": "and wait for the resurrection from the dead and the life to come, world without end. Amen.",
    "geez_script": "ወንሴፎ ትንሣኤ ሙታን ወሕይወተ ዘይመጽእ ለዓለመ ዓለም። አሜን።",
    "geez_phonetic": "wenséfo tnsa'é mutan weḥywete zeymets'i le'aleme 'alem. 'amén.",
    "amharic_script": "የሙታንንም መነሳት ተስፋ እናደርጋለን፣ የሚመጣውንም ሕይወት ለዘላለሙ። አሜን",
    "amharic_phonetic": "yemutannm menesat tesfa 'inadergalen, yemīmeṭawnm ḥywet lezelalemu. 'amén",
    "tigrinya_script": "፨ ሕዝብ (በዜማ)፤ ትንሣኤ ምዉታትን ንዘልዓለም ዓለም ዝመጽእ ሕይወትን ተስፋን ንገብር። ኣሜን",
    "tigrinya_phonetic": "፨ ḥzb (bezéma): tnsa'é mwutatn nzel'alem 'alem zmets'i ḥywetn tesfan ngebr. 'amén",
    "spanish": "Espero la resurrección de los muertos y la vida del mundo futuro. Amén."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer. Isaiah 6:3",
    "chapter": "Daily",
    "stanza": "6",
    "english": "Holy, holy, holy, is the Lord of hosts; the heavens and all the earth are completely filled with the holiness of Your glory.",
    "geez_script": "ቅዱስ ቅዱስ ቅዱስ እግዚአብሔር ጸባኦት ፍጹም ምሉእ ሰማያት ወኵሎ ምድረ ቅድሳተ ስብሐቲከ።",
    "geez_phonetic": "ḳdus ḳdus ḳdus 'igzī'abḥér tseba'ot ftsum mlu'i semayat wekwlo mdre ḳdsate sbḥatīke.",
    "amharic_script": "አሸናፊ እግዚአብሔር ቅዱስ ቅዱስ ቅዱስ ተብለህ ትመሰገናለህ። ምስጋናህም በሰማይና በምድር የሞላ ነው።",
    "amharic_phonetic": "ashenafī 'igzī'abḥér ḳdus ḳdus ḳdus tebleh tmesegenaleh. msganahm besemayna bemdr yemola new.",
    "tigrinya_script": "ቅዱስ ቅዱስ ቅዱስ እግዚኣብሔርጐይታ ሠራዊት፤ ፍጹም ክብሪ ምስጋናኻ ሰማያትን ምድርን ምሉእ ኢዩ።",
    "tigrinya_phonetic": "ḳdus ḳdus ḳdus 'igzī'abḥérgweyta serawīt: ftsum kbrī msganakha semayatn mdrn mlu'i 'īyu.",
    "spanish": "Santo, Santo, Santo, ¡Perfecto Señor de los ejércitos! ¡Llenos están el cielo y la tierra de la santidad de tu gloria!"
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "6",
    "english": "We worship you Christ, with Your good heavenly Father and Your life-giving Holy Spirit for You came and saved us.",
    "geez_script": "ንስግድ ለከ ክርስቶስ ምስለ አቡከ ኄር ሰማያዊ ወመንፈስከ ቅዱስ ማኅየዊ እስመ መጻእከ ወአድኃንከነ።",
    "geez_phonetic": "nsgd leke krstos msle 'abuke hér semayawī wemenfeske ḳdus mahyewī 'isme metsa'ike we'adhankene.",
    "amharic_script": "ክርስቶስ ላንተ እንሰግድልሃለን ከሰማያዊው ከቸር አባትህ ጋር አዳኝ ከሆነው ከመንፈስ ቅዱስም ጋር እንሰግድልሃለን ወደዚህ ዓለም መጥተህ አድነኸናልና።",
    "amharic_phonetic": "krstos lante 'insegdlhalen kesemayawīw kecher 'abath gar 'adañ kehonew kemenfes ḳdusm gar 'insegdlhalen wedezīh 'alem meṭteh 'adnekhenalna.",
    "tigrinya_script": "ኦ ክርስቶስ መጺእካ ኣድሒንካና ኢኻ እሞ ምስ መሓርን ሰማያውን ኣቦኻ ማህየዊ ምስ ዝኾነ ቅዱስ መንፈስካ ንሰግደልካ ኣሎና።",
    "tigrinya_phonetic": "o krstos metsī'ika 'adḥīnkana 'īkha 'imo ms meḥarn semayawn  'abokha mahyewī ms zkhone ḳdus menfeska nsegdelka 'alona.",
    "spanish": "Te adoramos, Jesucristo, junto a tu Padre celestial y misericordioso, y al Espíritu Santo, el dador de vida, porque viniste y nos salvaste."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "7",
    "english": "I worship the Father, and the Son, and the Holy Spirit in one prostration. (3x)",
    "geez_script": "እሰግድ ለአብ ወወልድ ወመንፈስ ቅዱስ አሐተ ስግደተ። (፫ተ ጊዜ)",
    "geez_phonetic": "isegd le'ab weweld wemenfes ḳdus 'aḥate sgdete. (selestute gīzé)",
    "amharic_script": "ለአብ ለወልድ ለመንፈስ ቅዱስ አንዲት ስግደት እሰግዳለሁ (3 ጊዜ)።",
    "amharic_phonetic": "le'ab leweld lemenfes ḳdus 'andīt sgdet 'isegdalehu (3 gīzé).",
    "tigrinya_script": "ንኣብን ንወልድን ንመንፈስ ቅዱስን ሓንቲ ስግደት እሰግድ። (3ተ ግዜ)",
    "tigrinya_phonetic": "n'abn nweldn nmenfes ḳdusn ḥantī sgdet 'isegd. (3te gzé)",
    "spanish": "Ofrezco una adoración al Padre, al Hijo y al Espíritu Santo. (3x)"
  },
  {
    "instruction": "",
    "reference": "Daily Prayer. Saint Gregory of Nazianzus' Oration 39:11.",
    "chapter": "Daily",
    "stanza": "7",
    "english": "Being One, He is Three, and being Three, He is One. They are distinguished as three in Persons, yet united in the Godhead.",
    "geez_script": "እንዘ አሐዱ ሠለስቱ ወእንዘ ሠለስቱ አሐዱ። ይሤለሱ በአካላት ወይትዋሐዱ በመለኮት።",
    "geez_phonetic": "inze 'aḥadu selestu we'inze selestu 'aḥadu. ysélesu be'akalat weytwaḥadu bemelekot.",
    "amharic_script": "አንድ ሲሆኑ ሦስት ሦስት ሲሆኑ አንድ በአካል ሦስት ሲሆኑ በመለኮት አንድ ለሚሆኑ እሰግዳለሁ።",
    "amharic_phonetic": "and sīhonu sost sost sīhonu 'and be'akal sost sīhonu bemelekot 'and lemīhonu 'isegdalehu.",
    "tigrinya_script": "ሓደ ኸለዉ ሠለስተ፤ ሠለስተ ኸለዉ ሓደ ዝኾኑ፤ ብኣካላት ሠለስተ፤ ብመለኮት ከኣ ሓደ ኢዮም።",
    "tigrinya_phonetic": "ḥade khelewu seleste: seleste khelewu ḥade zkhonu: b'akalat seleste: bmelekot ke'a ḥade 'īyom.",
    "spanish": "Siendo Uno, es Tres y siendo Tres, es Uno; Son Tres Personas y Uno en la Divinidad."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "7",
    "english": "I bow to our Lady Mary, the Virgin Bearer of God. I bow to the Cross of our Lord Jesus Christ which was sanctified with His Precious Blood.",
    "geez_script": "እሰግድ ለእግዝእትነ ማርያም ድንግል ወላዲተ አምላክ። እሰግድ ለመስቀለ እግዚእነ ኢየሱስ ክርስቶስ ዘተቀደሰ በደሙ ክቡር።",
    "geez_phonetic": "isegd le'igz'itne maryam dngl weladīte 'amlak. 'isegd lemesḳele 'igzī'ine 'īyesus krstos zeteḳedese bedemu kbur.",
    "amharic_script": "አምላክን ለወለደች ለእመቤታችን ለድንግል ማርያምም እሰግዳለሁ። ዓለምን ሁሉ ለማዳን ሲል ኢየሱስ ክርስቶስ ለተሰቀለበት መስቀልም እሰግዳለሁ።",
    "amharic_phonetic": "amlakn leweledech le'imebétachn ledngl maryamm 'isegdalehu. 'alemn hulu lemadan sīl 'īyesus krstos leteseḳelebet mesḳelm 'isegdalehu.",
    "tigrinya_script": "ንኣዴና ድንግል ማርያም ወላዲት ኣምላኽ እሰግድ። ንመስቀል ጐይታና ኢየሱስ ክርስቶስ እሰግድ፤ ንሱ ብኽቡር ደም ጐይታ ዝተቐደሰ ኢዩ።",
    "tigrinya_phonetic": "n'adéna dngl maryam weladīt 'amlakh 'isegd. nmesḳel gweytana 'īyesus krstos 'isegd: nsu bkhbur dem gweyta zteqhedese 'īyu.",
    "spanish": "Adoro ante nuestra Señora María, Virgen y Portadora de Dios, que es pura en su carne y en su alma. Adoro ante la Cruz de nuestro Señor Jesucristo, que fue santificada por su Sangre preciosa."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer. 1 Corinthians 1:18",
    "chapter": "Daily",
    "stanza": "7",
    "english": "The Cross is our power, the Cross is our strength, the Cross is our redemption, the Cross is the salvation of our souls.",
    "geez_script": "መስቀል ኃይልነ መስቀል ጽንዕነ መስቀል ቤዛነ መስቀል መድኃኒተ ነፍስነ",
    "geez_phonetic": "mesḳel haylne mesḳel tsn'ine mesḳel bézane mesḳel medhanīte nefsne",
    "amharic_script": "መስቀል ኃይላችን ነው፣ ኃይላችን መስቀል ነው። የሚያፀናን መስቀል ነው፣ መስቀል ቤዛችን ነው፣ መስቀል የነፍሳችን መዳኛ ነው",
    "amharic_phonetic": "mesḳel haylachn new, haylachn mesḳel new. yemīyatsenan mesḳel new, mesḳel bézachn new, mesḳel yenefsachn medaña new",
    "tigrinya_script": "መስቀል ሓይልና እዩ፤ መስቀል ጽንዓትና እዩ፤ መስቀል ቤዛና እዩ፤ መስቀል መድሓኒት ነፍስና እዩ።",
    "tigrinya_phonetic": "mesḳel ḥaylna 'iyu: mesḳel tsn'atna 'iyu: mesḳel bézana 'iyu: mesḳel medḥanīt nefsna 'iyu.",
    "spanish": "La Cruz es nuestra fuerza, la Cruz es nuestro amparo, la Cruz es nuestro rescate y la Cruz es el remedio de nuestras almas."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "7",
    "english": "The Jews denied, but we believed; and those who believed have been saved by the power of His Cross.",
    "geez_script": "አይሁድ ክሕዱ ንሕነሰ አመነ ወእለ አመነ በኃይለ መስቀሉ ድኅነ።",
    "geez_phonetic": "ayhud kḥdu nḥnese 'amene we'ile 'amene behayle mesḳelu dhne.",
    "amharic_script": "አይሁድ ይክዱታል እኛ ግን እናምነዋለን ያመነው እኛም በመስቀሉ እንድናለን።",
    "amharic_phonetic": "ayhud ykdutal 'iña gn 'inamnewalen yamenew 'iñam bemesḳelu 'indnalen.",
    "tigrinya_script": "ኣይሁድ ከሓድዎ ንሕና ግና ኣመንና፤ እቶም ዝኣመንና ብሓይሊ መስቀሉ ደሓንና።",
    "tigrinya_phonetic": "ayhud keḥadwo nḥna gna 'amenna: 'itom z'amenna bḥaylī mesḳelu deḥanna.",
    "spanish": "Los judíos lo negaron, pero nosotros creemos en Él. Nosotros, los que hemos creído en Él, somos salvados por el poder de su Cruz."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "8",
    "english": "Leader: Glory to the Father, glory to the Son, glory to the Holy Spirit. (3x)\n፨ People: It is due to the Father, and to the Son, and to the Holy Spirit. (3x)",
    "geez_script": "መሪሕ፤ ስብሐት ለአብ ስብሐት ለወልድ ስብሐት ለመንፈስ ቅዱስ። (፫ተ ጊዜ)\n፨ ሕዝብ፤ ይደልዎሙ ለአብ ወወልድ ወመንፈስ ቅዱስ። (፫ተ ጊዜ)",
    "geez_phonetic": "merīḥ: sbḥat le'ab sbḥat leweld sbḥat lemenfes ḳdus. (selestute gīzé)\n፨ ḥzb: ydelwomu le'ab weweld wemenfes ḳdus. (selestute gīzé)",
    "amharic_script": "መሪ፤ ለአብ ምስጋና ይገባል፣ ለወልድም ምስጋና ይገባል፣ ለመንፈስ ቅዱስም ምስጋና ይገባል (3 ጊዜ)። \n፨ ሕዝብ፤ ለአብ ምስጋና ይገባል፣ ለወልድም ምስጋና ይገባል፣ ለመንፈስ ቅዱስም ምስጋና ይገባል (3 ጊዜ)። ",
    "amharic_phonetic": "merī: le'ab msgana ygebal, leweldm msgana ygebal,  lemenfes ḳdusm msgana ygebal (3 gīzé). \n፨ ḥzb: le'ab msgana ygebal, leweldm msgana ygebal, lemenfes ḳdusm msgana ygebal (3 gīzé). ",
    "tigrinya_script": "መራሒ፤ ምስጋና ንኣብ፤ ምስጋና ንወልድ፤ ምስጋና ንመንፈስ ቅዱስ ይኹን። (3ተ ግዜ)\n፨ ሕዝብ፤ ንአብ ንወልድ ንመንፈስ ቅዱስን ምስጋና ይግብኦም። (3ተ ግዜ)",
    "tigrinya_phonetic": "meraḥī: msgana n'ab: msgana nweld: msgana nmenfes ḳdus ykhun. (3te gzé)\n፨ ḥzb: n'ab nweld nmenfes ḳdusn msgana ygb'om. (3te gzé)",
    "spanish": "Líder: Gloria al Padre, gloria al Hijo, gloria al Espíritu Santo. (3x) \n፨ Gente: Es debido al Padre, al Hijo y al Espíritu Santo. (3x)"
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "8",
    "english": "Leader: Glory to our Lady Mary, the Virgin Bearer of God.\n፨ People: It is due to our Lady Mary, the Virgin Bearer of God.",
    "geez_script": "መሪሕ፤ ስብሐት ለእግዝእትነ ማርያም ድንግል ወላዲተ አምላክ።\n፨ ሕዝብ፤ ይደልዋ ለእግዝእትነ ማርያም ድንግል ወላዲተ አምላክ።",
    "geez_phonetic": "merīḥ: sbḥat le'igz'itne maryam dngl weladīte 'amlak.\n፨ ḥzb: ydelwa le'igz'itne maryam dngl weladīte 'amlak.",
    "amharic_script": "መሪ፤ አምላክን ለወለደች ለእመቤታችን ለድንግል ማርያም ምስጋና ይገባል። \n፨ ሕዝብ፤ አምላክን ለወለደች ለእመቤታችን ለድንግል ማርያም ምስጋና ይገባል። ",
    "amharic_phonetic": "merī: 'amlakn leweledech le'imebétachn ledngl maryam msgana ygebal. \n፨ ḥzb: 'amlakn leweledech le'imebétachn ledngl maryam msgana ygebal. ",
    "tigrinya_script": "መራሒ፤ ምስጋና ንእግዝእትነ ማርያም ድንግል ወላዲት ኣምላኽ ይኹን።\n፨ ሕዝብ፤ ንእግዝእትነ ማርያም ድንግል ወላዲት ኣምላኽ ምስጋና ይግባእ።",
    "tigrinya_phonetic": "meraḥī: msgana n'igz'itne maryam dngl weladīt 'amlakh ykhun.\n፨ ḥzb: n'igz'itne maryam dngl weladīt 'amlakh msgana ygba'i.",
    "spanish": "Líder: Gloria a Nuestra Señora María, Virgen y Madre de Dios. \n፨ Gente: Es debido a Nuestra Señora María, Virgen y Portadora de Dios."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "8",
    "english": "Leader: Glory to the Cross of our Lord Jesus Christ.\n፨ People: It is due to the Cross of our Lord Jesus Christ.",
    "geez_script": "መሪሕ፤ ስብሐት ለመስቀለ እግዚእነ ኢየሱስ ክርስቶስ።\n፨ ሕዝብ፤ ይደልዎ ለመስቀለ እግዚእነ ኢየሱስ ክርስቶስ።",
    "geez_phonetic": "merīḥ: sbḥat lemesḳele 'igzī'ine 'īyesus krstos.\n፨ ḥzb: ydelwo lemesḳele 'igzī'ine 'īyesus krstos.",
    "amharic_script": "መሪ፤ ለኢየሱስ ክርስቶስ መስቀልም ምስጋና ይገባል። \n፨ ሕዝብ፤ ለኢየሱስ ክርስቶስ መስቀልም ምስጋና ይገባል። ",
    "amharic_phonetic": "merī: le'īyesus krstos mesḳelm msgana ygebal. \n፨ ḥzb: le'īyesus krstos mesḳelm msgana ygebal. ",
    "tigrinya_script": "መራሒ፤ ምስጋና ንመስቀል ጐይታና ኢየሱስ ክርስቶስ ይኹን።\n፨ ሕዝብ፤ ንመስቀል ጐይታና ኢየሱስ ክርስቶስ ምስጋና ይግባእ።",
    "tigrinya_phonetic": "meraḥī: msgana nmesḳel gweytana 'īyesus krstos ykhun.\n፨ ḥzb: nmesḳel gweytana 'īyesus krstos msgana ygba'i.",
    "spanish": "Líder: Gloria a la Cruz de Nuestro Señor Jesucristo.\n፨ Gente: Es debido a la Cruz de Nuestro Señor Jesucristo."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "8",
    "english": "Leader: May Christ remember us with His mercy. \n፨ People: Amen.\nLeader: May we not be put to shame in His second coming. \n፨ People: Amen.",
    "geez_script": "መሪሕ፤ ክርስቶስ በምሕረቱ ይዘከረነ።\n፨ ሕዝብ፤ አሜን።\nመሪሕ፤ አመ ዳግም ምጽአቱ ኢያስተኀፍረነ።\n፨ ሕዝብ፤ አሜን።",
    "geez_phonetic": "merīḥ: krstos bemḥretu yzekerene. \n፨ ḥzb: 'amén.\nmerīḥ: 'ame dagm mts'atu 'īyastehafrene.\n፨ ḥzb: 'amén.",
    "amharic_script": "መሪ፤ ክርስቶስ በቸርነቱ ያስበን ዘንድ \n፨ ሕዝብ፤ አሜን።\nመሪ፤ ዳግመኛም በመጣ ጊዜ እንዳያሳፍረን\n፨ ሕዝብ፤ አሜን።",
    "amharic_phonetic": "merī: krstos bechernetu yasben zend \n፨ ḥzb: 'amén.\nmerī: dagmeñam bemeṭa gīzé 'indayasafren\n፨ ḥzb: 'amén.",
    "tigrinya_script": "መራሒ፤ ክርስቶስ ብምሕረቱ ይዘከረና።\n፨ ሕዝብ፤ ኣሜን።\nመራሒ፤ ኣብ ዳግማይ ምጽኣቱ ኣየሕፍረና።\n፨ ሕዝብ፤ ኣሜን።",
    "tigrinya_phonetic": "meraḥī: krstos bmḥretu yzekerena.\n፨ ḥzb: 'amén.\nmeraḥī: 'ab dagmay mts'atu 'ayeḥfrena.\n፨ ḥzb: 'amén.",
    "spanish": "Líder: Que Cristo nos recuerde en su misericordia.\n፨ Gente: Amén.\nLíder: Y no nos desprecié en su segunda venida.\n፨ Gente: Amén."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "8",
    "english": "Leader: May He awaken us to glorification of His Name.\n፨ People: Amen.\nLeader: And may He strengthen us in His worship. \n፨ People: Amen.",
    "geez_script": "መሪሕ፤ ለሰብሖተ ስሙ ያንቅሀነ።\n፨ ሕዝብ፤ አሜን።\nመሪሕ፤ ወበአምልኮቱ ያጽንአነ።\n፨ ሕዝብ፤ አሜን።",
    "geez_phonetic": "merīḥ: lesebḥote smu yanḳhane.\n፨ ḥzb: 'amén.\nmerīḥ: webe'amlkotu yatsn'ane.\n፨ ḥzb: 'amén.",
    "amharic_script": "መሪ፤ ስሙን ለማመስገን ያነቃን ዘንድ \n፨ ሕዝብ፤ አሜን።\nመሪ፤ እርሱንም በማምለክ ያጸናን ዘንድ \n፨ ሕዝብ፤ አሜን።",
    "amharic_phonetic": "merī: smun lemamesgen yaneḳan zend \n፨ ḥzb: 'amén.\nmerī: 'irsunm bemamlek yatsenan zend \n፨ ḥzb: 'amén.",
    "tigrinya_script": "መራሒ፤ ስሙ ንምምስጋን የንቅሓና።\n፨ ሕዝብ፤ ኣሜን።\nመራሒ፤ ኣብ ኣምልኾቱ የጽንዓና።\n፨ ሕዝብ፤ ኣሜን።",
    "tigrinya_phonetic": "meraḥī: smu nmmsgan yenḳḥana.\n፨ ḥzb: 'amén.\nmeraḥī: 'ab 'amlkhotu yetsn'ana.\n፨ ḥzb: 'amén.",
    "spanish": "Líder: Que nos despierte para agradecer su nombre.\n፨ Gente: Amén.\nLíder: Que nos fortalezca en su adoración.\n፨ Gente: Amén."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "8",
    "english": "Leader: Our Lady Mary, lift up our prayers,\n፨ People: Amen.\nLeader: and cause our sins to be forgiven \n፨ People: Amen.\nLeader: in front of the throne of our Lord.\n፨ People: Amen.",
    "geez_script": "መሪሕ፤ እግዝእትነ ማርያም አዕርጊ ጸሎተነ \n፨ ሕዝብ፤ አሜን።\nመሪሕ፤ ወአስተሥርዪ ኃጢአተነ\n፨ ሕዝብ፤ አሜን።\nመሪሕ፤ ቅድመ መንበሩ ለእግዚእነ።\n፨ ሕዝብ፤ አሜን።",
    "geez_phonetic": "merīḥ: 'igz'itne maryam 'a'irgī tselotene \n፨ ḥzb: 'amén.\nmerīḥ: we'astesryī haṭī'atene\n፨ ḥzb: 'amén.\nmerīḥ: ḳdme menberu le'igzī'ine.\n፨ ḥzb: 'amén.",
    "amharic_script": "መሪ፤ እመቤታችን ጸሎታችንን አሳርጊልን ፣ \n፨ ሕዝብ፤ አሜን። \nመሪ፤ ኃጢአታችንንም አስተሥርዩልን \n፨ ሕዝብ፤ አሜን። \nመሪ፤ በጌታችን መንበር ፊት ጸሎታችንን አሳርኪልን \n፨ ሕዝብ፤ አሜን። ",
    "amharic_phonetic": "merī: 'imebétachn tselotachnn 'asargīln , \n፨ ḥzb: 'amén. \nmerī: haṭī'atachnnm 'astesryuln \n፨ ḥzb: 'amén. \nmerī:  begétachn menber fīt tselotachnn 'asarkīln \n፨ ḥzb: 'amén. ",
    "tigrinya_script": "መራሒ፤ እግዝእትነ ማርያም ጸሎትና ኣዕርግልና።\n፨ ሕዝብ፤ ኣሜን።\nመራሒ፤ ሓጢኣትና እውን ኣስተሥርይልና።\n፨ ሕዝብ፤ ኣሜን።\nመራሒ፤ ኣብ ቅድሚ መንበሩ ንጐይታና።\n፨ ሕዝብ፤ ኣሜን።",
    "tigrinya_phonetic": "meraḥī: 'igz'itne maryam tselotna 'a'irglna.\n፨ ḥzb: 'amén.\nmeraḥī: ḥaṭī'atna 'iwn 'astesrylna.\n፨ ḥzb: 'amén.\nmeraḥī: 'ab ḳdmī menberu ngweytana.\n፨ ḥzb: 'amén.",
    "spanish": "Líder: Nuestra Señora María, eleva nuestras oraciones.\n፨ Gente: Amén.\nLíder: Pide perdón por todos nuestros pecados.\n፨ Gente: Amén.\nLíder: Ante el trono de Nuestro Señor.\n፨ Gente: Amén."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "8",
    "english": "Leader: To Him who fed us this bread;\n፨ People: For His mercy endures forever.",
    "geez_script": "መሪሕ፤ ለዘአብልዐነ ዘንተ ኅብስተ፤\n፨ ሕዝብ፤ እስመ ለዓለም ምሕረቱ።",
    "geez_phonetic": "merīḥ: leze'abl'ane zente hbste:\n፨ ḥzb: 'isme le'alem mḥretu.",
    "amharic_script": "መሪ፣ ይህንን ኀብስት ላበላን \n፨ ሕዝብ፤ ምሕረቱ ለዘላለም ነውና",
    "amharic_phonetic": "merī, yhnn habst labelan \n፨ ḥzb: mḥretu lezelalem newna",
    "tigrinya_script": "መራሒ፤ ነዚ ኅብስቲ እዚ ንዘብልዓና።\n፨ ሕዝብ፤ ምሕረቱ ንዘልዓለም ይነብር ኢዩ።",
    "tigrinya_phonetic": "meraḥī: nezī hbstī 'izī nzebl'ana.\n፨ ḥzb: mḥretu nzel'alem ynebr 'īyu.",
    "spanish": "Líder: A aquel que nos ha dado este pan.\n፨ Gente: Porque su misericordia perdura por siempre."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "8",
    "english": "Leader: And to Him who has given us this cup to drink;\n፨ People: For His mercy endures forever.",
    "geez_script": "መሪሕ፤ ወለዘአስተየነ ዘንተ ጽዋዓ፤\n፨ ሕዝብ፤ እስመ ለዓለም ምሕረቱ።",
    "geez_phonetic": "merīḥ: weleze'asteyene zente tswa'a:\n፨ ḥzb: 'isme le'alem mḥretu.",
    "amharic_script": "መሪ፣ ይህንንም ጽዋ ላጠጣን \n፨ ሕዝብ፤ ምሕረቱ ለዘላለም ነውና",
    "amharic_phonetic": "merī, yhnnm tswa laṭeṭan \n፨ ḥzb: mḥretu lezelalem newna",
    "tigrinya_script": "መራሒ፤ ነዚ መስተ እዚ እውን ንዘስተየና።\n፨ ሕዝብ፤ ምሕረቱ ንዘልዓለም ይነብር ኢዩ።",
    "tigrinya_phonetic": "meraḥī: nezī meste 'izī 'iwn nzesteyena.\n፨ ḥzb: mḥretu nzel'alem ynebr 'īyu.",
    "spanish": "Líder: A aquel que nos ha dado esta copa.\n፨ Gente: Porque su misericordia perdura por siempre."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "8",
    "english": "Leader: And to Him who ordained for us our sustenance and clothed us;\n፨ People: For His mercy endures forever.",
    "geez_script": "መሪሕ፤ ወለዘሠርዐ ለነ ሲሳየነ ወአራዘነ፤\n፨ ሕዝብ፤ እስመ ለዓለም ምሕረቱ።",
    "geez_phonetic": "merīḥ: welezeser'a lene sīsayene we'arazene:\n፨ ḥzb: 'isme le'alem mḥretu.",
    "amharic_script": "መሪ፣ ምግባችንንና ልብሳችንን ላዘጋጀልን \n፨ ሕዝብ፤ ምሕረቱ ለዘላለም ነውና",
    "amharic_phonetic": "merī, mgbachnnna lbsachnn lazegajeln \n፨ ḥzb: mḥretu lezelalem newna",
    "tigrinya_script": "መራሒ፤ መግብናን ክዳንናን ንዘዳለወልና።\n፨ ሕዝብ፤ ምሕረቱ ንዘልዓለም ይነብር ኢዩ።",
    "tigrinya_phonetic": "meraḥī: megbnan kdannan nzedalewelna.\n፨ ḥzb: mḥretu nzel'alem ynebr 'īyu.",
    "spanish": "Líder: A aquel que nos ha dado nuestra comida y ropa.\n፨ Gente: Porque su misericordia perdura por siempre."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "8",
    "english": "Leader: And to Him who was patient with all our sin;\n፨ People: For His mercy endures forever.",
    "geez_script": "መሪሕ፤ ወለዘተዐገሠ ኲሉ ኃጢአተነ፤\n፨ ሕዝብ፤ እስመ ለዓለም ምሕረቱ።",
    "geez_phonetic": "merīḥ: welezete'agese kwīlu haṭī'atene:\n፨ ḥzb: 'isme le'alem mḥretu.",
    "amharic_script": "መሪ፣ ኃጢአታችንንም ሁሉ ለታገሠልን \n፨ ሕዝብ፤ ምሕረቱ ለዘላለም ነውና",
    "amharic_phonetic": "merī, haṭī'atachnnm hulu letageseln \n፨ ḥzb: mḥretu lezelalem newna",
    "tigrinya_script": "መራሒ፤ ኩሉ ሓጢኣትና እውን ንዝተዓገሰና።\n፨ ሕዝብ፤ ምሕረቱ ንዘልዓለም ይነብር ኢዩ።",
    "tigrinya_phonetic": "meraḥī: kulu ḥaṭī'atna 'iwn nzte'agesena.\n፨ ḥzb: mḥretu nzel'alem ynebr 'īyu.",
    "spanish": "Líder: A aquel que soporta todos nuestros pecados.\n፨ Gente: Porque su misericordia perdura para siempre."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "8",
    "english": "Leader: And to Him who gave us His holy Flesh and His precious Blood;\n፨ People: For His mercy endures forever.",
    "geez_script": "መሪሕ፤ ወለዘወሀበነ ሥጋሁ ቅዱስ ወደሞ ክቡረ።\n፨ ሕዝብ፤ እስመ ለዓለም ምሕረቱ።",
    "geez_phonetic": "merīḥ: welezewehabene sgahu ḳdus wedemo kbure.\n፨ ḥzb: 'isme le'alem mḥretu.",
    "amharic_script": "መሪ፣ ክቡር ደሙን ቅዱስ ሥጋውን ለሰጠን\n፨ ሕዝብ፤ ምሕረቱ ለዘላለም ነውና ",
    "amharic_phonetic": "merī, kbur demun ḳdus sgawn leseṭen\n፨ ḥzb: mḥretu lezelalem newna ",
    "tigrinya_script": "መራሒ፤ ቅዱስ ሥጋኡን ክቡር ደሙን ንዝሃበና።\n፨ ሕዝብ፤ ምሕረቱ ንዘልዓለም ይነብር ኢዩ።",
    "tigrinya_phonetic": "meraḥī: ḳdus sga'un kbur demun nzhabena.\n፨ ḥzb: mḥretu nzel'alem ynebr 'īyu.",
    "spanish": "Líder: A aquel que nos ha dado su santa Carne y su Sangre preciosa.\n፨ Gente: Porque su misericordia perdura para siempre."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "8",
    "english": "Leader: And to Him who brought us to this hour;\n፨ People: For His mercy endures forever.",
    "geez_script": "መሪሕ፤ ወለዘአብጽሐነ እስከ ዛቲ ሰዓት።\n፨ ሕዝብ፤ እስመ ለዓለም ምሕረቱ።",
    "geez_phonetic": "merīḥ: weleze'abtsḥane 'iske zatī se'at.\n፨ ḥzb: 'isme le'alem mḥretu.",
    "amharic_script": "መሪ፣ እስከዚችም ሰዓት ላደረሰን \n፨ ሕዝብ፤ ምሕረቱ ለዘላለም ነውና",
    "amharic_phonetic": "merī, 'iskezīchm se'at laderesen \n፨ ḥzb: mḥretu lezelalem newna",
    "tigrinya_script": "መራሒ፤ ክሣብ እዛ ሰዓት እዚኣ እውን ስለ ዘብጽሓና ምስጋና ይኹኖ።\n፨ ሕዝብ፤ ምሕረቱ ንዘልዓለም ይነብር ኢዩ።",
    "tigrinya_phonetic": "meraḥī: ksab 'iza se'at 'izī'a 'iwn sle zebtsḥana msgana ykhuno.\n፨ ḥzb: mḥretu nzel'alem ynebr 'īyu.",
    "spanish": "Líder: Y a aquel que nos ha preservado hasta este mismo momento.\n፨ Gente: Porque su misericordia perdura para siempre."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "8",
    "english": "Let us give glory and thanksgiving to the Most High God, to His Virgin Mother, and to His precious Cross.",
    "geez_script": "ነሀብ ሎቱ ስብሐተ ወአኰቴተ ለእግዚአብሔር ልዑል፤ ወለወላዲቱ ድንግል፤ ወለመስቀሉ ክቡር።",
    "geez_phonetic": "nehab lotu sbḥate we'akwetéte le'igzī'abḥér l'ul: weleweladītu dngl: welemesḳelu kbur.",
    "amharic_script": "ለእሱ ለልዑል እግዚአብሔርፍፁም ምስጋና ይገባል ለወለደችው ለድንግል ማርያም ምስጋና ይገባል ። ለኢየሱስ ክርሰቶስም መስቀል ምስጋና ይገባል።",
    "amharic_phonetic": "le'isu lel'ul 'igzī'abḥérftsum msgana ygebal leweledechw ledngl maryam msgana ygebal . le'īyesus krsetosm mesḳel msgana ygebal.",
    "tigrinya_script": "ንልዑል እግዚኣብሔር ክብርን ምስጋናን ነቐርበሉ፤ ከምኡ እውን ንወላዲቱ ድንግል፤ ንመስቀሉ ክቡር።",
    "tigrinya_phonetic": "nl'ul 'igzī'abḥér kbrn msganan neqherbelu: kem'u 'iwn nweladītu dngl: nmesḳelu kbur.",
    "spanish": "¡A Él demos gloria, dando gracias  al Dios Altísimo! ¡Y demos gracias a su Madre y a su honrosa Cruz!"
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "8",
    "english": "May the Name of the Lord, our God, be thanked and glorified, always, at all moments and in every hour.",
    "geez_script": "ይትአኰት ወይሰባሕ ስሙ ለእግዚአብሔር አምላክነ ወትረ በኲሉ ጊዜ ወበኲሉ ስዓት።",
    "geez_phonetic": "yt'akwet weysebaḥ smu le'igzī'abḥér 'amlakne wetre bekwīlu gīzé webekwīlu s'at.",
    "amharic_script": "የእግዚአብሔር ስሙ ፈጽሞ ይመሰገን ዘንድ ዘወትር በየጊዜያቱና በየሰዓቱ ምስጋና ይገባል።",
    "amharic_phonetic": "ye'igzī'abḥér smu fetsmo ymesegen zend zewetr beyegīzéyatuna beyese'atu msgana ygebal.",
    "tigrinya_script": "ስም እግዚኣብሔር ኣምላኸና ብኹሉ ጊዜን ብኹሉ ሰዓትን ክምስገን ይንበር።",
    "tigrinya_phonetic": "sm 'igzī'abḥér 'amlakhena bkhulu gīzén bkhulu se'atn kmsgen ynber.",
    "spanish": "Que el Nombre del Señor, nuestro Dios, sea alabado y glorificado, siempre, en todo momento  y en toda hora."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "9",
    "english": "Greetings to you, we say as we bow to you. Mary our Mother, we beseech you.",
    "geez_script": "ሰላም ለኪ እንዘ ንሰግድ ንብለኪ። ማርያም እምነ፤ ናስተበቍዐኪ።",
    "geez_phonetic": "selam lekī 'inze nsegd nblekī. maryam 'imne: nastebeḳw'akī.",
    "amharic_script": "ሰላም ላንቺ ይሁን እያልን እንሰግድልሻለን እናታችን ማርያም ሆይ እንማልድሻለን",
    "amharic_phonetic": "selam lanchī yhun 'iyaln 'insegdlshalen 'inatachn maryam hoy 'inmaldshalen",
    "tigrinya_script": "እናሰገድና ሰላም ንብለኪ፤ ማርያም ኣዴና ንልምነኪ።",
    "tigrinya_phonetic": "inasegedna selam nblekī: maryam 'adéna nlmnekī.",
    "spanish": "Que la paz esté contigo mientras nos inclinamos ante ti, Nuestra Madre María, ¡te suplicamos!"
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "9",
    "english": "From the ravenous beast, we take refuge in you. For the sake of Anne, your mother, and Joachim, your father, O Virgin, bless our congregation today.",
    "geez_script": "እምአርዌ ነዓዊ ተማሐፀነ ብኪ። በእንተ ሐና እምኪ ወኢያቄም አቡኪ፤ ማኅበረነ ዮም ድንግል ባርኪ።",
    "geez_phonetic": "im'arwé ne'awī temaḥatsene bkī. be'inte ḥana 'imkī we'īyaḳém 'abukī: mahberene yom dngl barkī.",
    "amharic_script": "ከአዳኝ አውሬ ታድኝን ዘንድ ተማጽነንብሻል ስለ እናትሽ ስለ ሐና ብለሽ ስለ አባትሽ ስለ ኢያቄም ብለሽ ድንግል ማኀበራችንን ዛሬ ባርኪልን።",
    "amharic_phonetic": "ke'adañ 'awré tadñn zend tematsnenbshal sle 'inatsh sle ḥana blesh sle 'abatsh sle 'īyaḳém blesh dngl mahaberachnn zaré barkīln.",
    "tigrinya_script": "ካብ ሃዳናይ ኣራዊት ንምሕጸን ብኣኺ። ምእንቲ ሃና ኣዴኺ ኢያቄም እውን ኣቦኺ። ንማሕበርና ድንግል ሎሚ ባርኺ።",
    "tigrinya_phonetic": "kab hadanay 'arawīt nmḥtsen b'akhī. m'intī hana 'adékhī 'īyaḳém 'iwn  'abokhī. nmaḥberna dngl lomī barkhī.",
    "spanish": "Confiamos en ti para que nos salves de los animales salvajes y depredadores. Por el bien de Ana, tu madre, y de tu padre Joaquín, oh Santa Virgen María, bendice hoy a nuestra congregación."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer - The Song of Mary.",
    "chapter": "Daily",
    "stanza": "10",
    "english": "Prayer of Our Lady Mary, Virgin Bearer of God\n(Luke 1:46-55)",
    "geez_script": "ጸሎተ እግዝእትነ ማርያም ድንግል ወላዲተ አምላክ\n(ሉቃ ፩ : ፵፮ - ፶፭)",
    "geez_phonetic": "tselote 'igz'itne maryam dngl weladīte 'amlak\n(luḳa ahadu : arb'asidistu - hamsahamistu)",
    "amharic_script": "",
    "amharic_phonetic": "",
    "tigrinya_script": "",
    "tigrinya_phonetic": "",
    "spanish": "Oración de Nuestra Señora María, Virgen Portadora de Dios\n(Lucas 1:46-55)"
  },
  {
    "instruction": "",
    "reference": "Daily Prayer - The Song of Mary. Luke 1:46-48",
    "chapter": "Daily",
    "stanza": "10",
    "english": "“My soul magnifies the Lord, And my spirit has rejoiced in God my Savior. For He has regarded the lowly state of His maidservant;",
    "geez_script": "ታዐብዮ ነፍስየ ለእግዚአብሔር። ወትትሐሠይ መንፈስየ በአምላክየ ወመድኀኒየ። እስመ ርእየ ሕማማ ለአመቱ",
    "geez_phonetic": "ta'abyo nefsye le'igzī'abḥér. wettḥasey menfesye be'amlakye wemedhanīye. 'isme r'iye ḥmama le'ametu",
    "amharic_script": "ሰውነቴ እግዚአብሔርን ታከብረዋለች። ልቡናዬም በአምላኬ በመድኀኒቴ ሐሤት ታደርጋለች። የባርያውን ትሕትና ተመልክቶአልና።",
    "amharic_phonetic": "sewneté 'igzī'abḥérn takebrewalech. lbunayém be'amlaké bemedhanīté ḥasét tadergalech. yebaryawn tḥtna temelkto'alna.",
    "tigrinya_script": "ነፍሰይ ንእግዚኣብሔር ተዕብዮ፤ መንፈሰይ ከኣ ብኣምላኸይ በቲ መድኃንየይ ባህ ይብላ። ውርደት ባርያኡ ርእዩ እዩ እሞ፤",
    "tigrinya_phonetic": "nefsey n'igzī'abḥér te'ibyo: menfesey ke'a b'amlakhey betī medhanyey bah ybla. wrdet barya'u r'iyu 'iyu 'imo:",
    "spanish": "Y María dijo: \"\"Mi alma engrandece al Señor, y mi espíritu se regocija en Dios mi Salvador. Porque ha mirado la humildad de su sierva."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer - The Song of Mary. Luke 1:48-49",
    "chapter": "Daily",
    "stanza": "10",
    "english": "For behold, henceforth all generations will call me blessed. For He who is mighty has done great things for me, And holy is His name.",
    "geez_script": "ወናሁ እምይእዜሰ ያስተበጽዑኒ ኵሉ ትውልድ። እስመ ገብረ ሊተ ኀይለ ዐቢያተ ወቅዱስ ስሙ።",
    "geez_phonetic": "wenahu 'imy'izése yastebets'unī kwlu twld. 'isme gebre līte hayle 'abīyate weḳdus smu.",
    "amharic_script": "እነሆ፥ ከዛሬ ጀምሮ ትውልድ ሁሉ ብፅዕት ይሉኛል። ታላቅ ሥራን ሠርቶልኛልና፤ ስሙም ቅዱስ ነው።",
    "amharic_phonetic": "ineho; kezaré jemro twld hulu bts'it yluñal. talaḳ sran sertolñalna: smum ḳdus new.",
    "tigrinya_script": "እንሆ ካብ ሕጂ ኵሎም ወለዶ ብፅዕቲ ኪብሉኒ ኢዮም። እቲ ዅሉ ዝኽእል ዓበይቲ ነገራት ገይሩለይ ኢዩ እሞ ስሙ ቅዱስ ኢዩ።",
    "tigrinya_phonetic": "inho kab ḥjī kwlom weledo bts'itī kīblunī 'īyom. 'itī ዅlu zkh'il 'abeytī negerat geyruley 'īyu 'imo smu ḳdus 'īyu.",
    "spanish": "Pues he aquí, desde ahora en adelante todas las generaciones me llamarán bienaventurada. Porque el Poderoso ha hecho grandes cosas por mí; y santo es su nombre."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer - The Song of Mary. Luke 1:50-51",
    "chapter": "Daily",
    "stanza": "10",
    "english": "And His mercy is on those who fear Him From generation to generation. He has shown strength with His arm; He has scattered the proud in the imagination of their hearts.",
    "geez_script": "ወሣህሉኒ ለትውልደ ትውልድ ለእለ ይፈርህዎ። ወገብረ ኀይለ በመዝራዕቱ ወዘረዎሙ ለእለ ያዐብዩ ሕሊና ልቦሙ።",
    "geez_phonetic": "wesahlunī letwlde twld le'ile yferhwo. wegebre hayle bemezra'itu wezerewomu le'ile ya'abyu ḥlīna lbomu.",
    "amharic_script": "ይቅርታውም ለሚፈሩት ለልጅ ልጅ ነው። በክንዱ ኀይልን አደረገ፤ በልባቸው ዐሳብ የሚታበዩትንም በተናቸው።",
    "amharic_phonetic": "yḳrtawm lemīferut lelj lj new. bekndu hayln 'aderege: belbachew 'asab yemītabeyutnm betenachew.",
    "tigrinya_script": "ምሕረቱ ውን ኣብቶም ዝፈርህዎ ንውሉድ ወለዶ ኢዩ። ብቕልጽሙ ኃይሊ ገበረ፤ ንዕቡያት ሓሳባት ልቦም በተነሎም።",
    "tigrinya_phonetic": "mḥretu wn 'abtom zferhwo nwlud weledo 'īyu. bqhltsmu haylī gebere: n'ibuyat ḥasabat lbom betenelom.",
    "spanish": "Y su misericordia es de generación en generación para los que le temen. Él ha hecho proezas con su brazo; ha dispersado a los soberbios en los pensamientos de sus corazones."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer - The Song of Mary. Luke 1:52-53",
    "chapter": "Daily",
    "stanza": "10",
    "english": "He has put down the mighty from their thrones, And exalted the lowly. He has filled the hungry with good things, And the rich He has sent away empty.",
    "geez_script": "ወነሠቶሙ ለኀያላን እመናብርቲሆሙ ወአዕበዮሙ ለትሑታን። ወአጽገቦሙ በረከቶ ለርኁባን ወፈነዎሙ ዕራቆሙ ለብዑላን።",
    "geez_phonetic": "wenesetomu lehayalan 'imenabrtīhomu we'a'ibeyomu letḥutan. we'atsgebomu bereketo lerhuban wefenewomu 'iraḳomu leb'ulan.",
    "amharic_script": "ኀያላኑን ከዙፋናቸው አዋረዳቸው፤ ትሑታኑንም ከፍ ከፍ አደረጋቸው። የተራቡትን ከበረከቱ አጠገባቸው፤ ባለጠጎችንም ባዶ እጃቸውን ሰደዳቸው።",
    "amharic_phonetic": "hayalanun kezufanachew 'awaredachew: tḥutanunm kef kef 'aderegachew. yeterabutn kebereketu 'aṭegebachew: baleṭegochnm bado 'ijachewn sededachew.",
    "tigrinya_script": "ንኃያላት ካብ ዝፋናቶም ኣውረዶም። ንዝተዋረዱ ኸኣ ልዕል ኣበሎም። ንጥሙያት ብበረኸት ኣጽገቦም፤ ንሃብታማት ከኣ ጥራይ ኢዶም ሰደዶም።",
    "tigrinya_phonetic": "nhayalat kab zfanatom 'awredom. nztewaredu khe'a l'il 'abelom. nṭmuyat bberekhet 'atsgebom: nhabtamat ke'a ṭray 'īdom sededom.",
    "spanish": "Ha derribado a los poderosos de sus tronos y ha exaltado a los humildes. Ha colmado de bienes a los hambrientos y a los ricos ha enviado vacíos."
  },
  {
    "instruction": "",
    "reference": "Daily Prayer - The Song of Mary. Luke 1:54-55",
    "chapter": "Daily",
    "stanza": "10",
    "english": "He has helped His servant Israel, In remembrance of His mercy, As He spoke to our fathers, To Abraham and to his seed forever.”",
    "geez_script": "ወተወክፎ ለእስራኤል ቍልዔሁ ወተዘከረ ሣህሎ። ዘይቤሎሙ ለአበዊነ ለአብርሃም ወለዘርኡ እስከ ለዓለም።",
    "geez_phonetic": "wetewekfo le'isra'él ḳwl'éhu wetezekere sahlo. zeybélomu le'abewīne le'abrham welezer'u 'iske le'alem.",
    "amharic_script": "ብላቴናውን እስራኤልን ተቀበለው፤ ይቅርታውንም ዐሰበ። ለአባቶቻችን ለአብርሃምና ለዘሩ እስከ ዘለዓለም እንደ ተናገረው።”",
    "amharic_phonetic": "blaténawn 'isra'éln teḳebelew: yḳrtawnm 'asebe. le'abatochachn le'abrhamna lezeru 'iske zele'alem 'inde tenagerew.”",
    "tigrinya_script": "ከምቲ ነቦታትና ንኣብርሃምን ንዘርኡን ዝነገሮም ንዘለዓለም ምሕረቱ እናዘከረ ንእስራኤል ባርያኡ ተቐበሎ።",
    "tigrinya_phonetic": "kemtī nebotatna n'abrhamn nzer'un znegerom nzele'alem mḥretu 'inazekere n'isra'él barya'u teqhebelo.",
    "spanish": "Él ha ayudado a Israel, su siervo, recordando su misericordia, como lo había prometido a nuestros padres, a Abraham y a su descendencia para siempre.\"\"\""
  },
  {
    "instruction": "",
    "reference": "Daily Prayer",
    "chapter": "Daily",
    "stanza": "10",
    "english": "Glory to the Father, to the Son, and to the Holy Spirit, forever and to the age of ages. Amen.",
    "geez_script": "ስብሐት ለአብ ወወልድ ወመንፈስ ቅዱስ ለዓለም ወለዓለመ ዓለም።",
    "geez_phonetic": "sbḥat le'ab weweld wemenfes ḳdus le'alem wele'aleme 'alem.",
    "amharic_script": "ለአብ ምስጋና ይገባል፣ ለወልድም ምስጋና ይገባል፣ ለመንፈስ ቅዱስም ምስጋና ይገባል።",
    "amharic_phonetic": "le'ab msgana ygebal, leweldm msgana ygebal, lemenfes ḳdusm msgana ygebal.",
    "tigrinya_script": "ንኣብን ንወልድን ንመንፈስ ቅዱስን ምስጋና። ንዘልዓለም ዓለም።",
    "tigrinya_phonetic": "n'abn nweldn nmenfes ḳdusn msgana. nzel'alem 'alem.",
    "spanish": "¡Gloria al Padre, al Hijo y al Espíritu Santo, por siempre y para siempre!"
  },
  {
    "instruction": ``,
    "reference": `Intro to The Praise of Mary`,
    "chapter": `Daily`,
    "stanza": `11`,
    "english": `The Praise of Mary of the 7 days composed by Saint Ephraim the Syrian.`,
    "geez_script": `ውዳሴ ማርያም ዘ፯ቱ ዕለታት ዘደረሰ ቅዱስ ኤፍሬም ሶርያዊ`,
    "geez_phonetic": `wdasé maryam zeseb'atutu 'iletat zederese ḳdus 'éfrém soryawī`,
    "amharic_script": ``,
    "amharic_phonetic": ``,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `La Alabanza de María de los 7 días, compuesta por San Efraín el Sirio.`
  },
    {
        "instruction": ``,
        "reference": `The Praise of Mary, attributed to Saint Ephrem the Syrian of Nisbis/Edessa (4th century)`,
        "chapter": `Daily`,
        "stanza": `12`,
        "english": `O my Lady, loose me from the bonds of Satan. O Mother of the Savior and daughter of the Light, bless, sanctify, and cleanse me as you blessed your beloved Ephrem.`,
        "geez_script": `ኦ እግዝእትየ፣ ፍትሕኒ እማዕሠረ ሰይጣን። ኦ እም መድኀኒ ወወለተ ብርሃን፣ ባርክኒ ወቀድስኒ ወአንጽሕኒ በከመ ባረኪዮ ለቅዱስ ኤፍሬም ሶርያዊ`,
        "geez_phonetic": `o 'igz'itye, ftḥnī 'ima'isere seyṭan. 'o 'im medhanī wewelete brhan, barknī weḳedsnī we'antsḥnī bekeme barekīyo leḳdus 'éfrém soryawī`,
        "amharic_script": ``,
        "amharic_phonetic": ``,
        "tigrinya_script": ``,
        "tigrinya_phonetic": ``,
        "spanish": `Oh Señora mía, libérame de las ataduras de Satanás. Oh Madre del Salvador e hija de la Luz, bendíceme, santifícame y límpiame como bendijiste a tu amado Efraín.`
    },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `Intro`,
    "english": `Praises for Our Lady Mary, Virgin, Bearer of God, that is read on Thursday.`,
    "geez_script": `ውዳሴሃ ለእግዝእትነ ማርያም ድንግል ወላዲተ አምላክ ዘይትነበብ በዕለተ ሐሙስ`,
    "geez_phonetic": `wdaséha le'igz'itne maryam dngl weladīte 'amlak zeytnebeb be'ilete ḥamus`,
    "amharic_script": ``,
    "amharic_phonetic": ``,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `La Alabanza De Nuestra Señora, La Virgen María, Portadora De Dios, Que Se Lee El Quinto Día, Jueves.`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `1`,
    "english": `The bush which Moses saw burning with fire in the wilderness, whose branches were not consumed,`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ርኩሰት የሌለባት ድንግል ማርያም ሙሴ በበረሀ በነደ እሳት ጫፎቿ ሳይቃጠሉ ያያት`,
    "amharic_phonetic": `rkuset yelélebat dngl maryam musé bebereha benede 'isat chafochwa sayḳaṭelu yayat`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `La zarza que vio Moisés en llamas de fuego en el desierto, cuya madera no se consumía,`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `1`,
    "english": `is a resemblance of Mary the undefiled Virgin of whom the word of the Father became incarnate,`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ዕፅን ትመስላለች የአብ ቃል በርስዋ ሰው ሆኗልና`,
    "amharic_phonetic": `itsn tmeslalech ye'ab ḳal berswa sew honwalna`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `es una semejanza de María, la Virgen que no tenía mancha.  
El Verbo del 
Padre se encarnó de Ella,`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `1`,
    "english": `and the fire of His Godhead did not consume the Virgin, and after she had brought Him forth her virginity was maintained.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `እሳተ መለኮቱ (የመለኮቱ ባሕርይ) አላቃጠላትምና ከወለደችው በኋላ ድንግልናዋ አልተለወጠምና`,
    "amharic_phonetic": `isate melekotu (yemelekotu baḥry) 'alaḳaṭelatmna keweledechw behwala dnglnawa 'alteleweṭemna`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `y el fuego de su Divinidad no consumió a la Virgen, y después que Ella lo dio a luz, su virginidad se mantuvo,`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `1`,
    "english": `His divinity was unchanged while becoming the Son of Man.
The true God came and delivered us. O holy one, pray for us.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ሰውም ቢሆን መለኮቱ አልተለወጠም በዕውነት አምላክነውና በዕውነት አምላክ የሆነ እርሱ መጥቶ
አዳነን።
ቅድስት ሆይ ለምኝልን።`,
    "amharic_phonetic": `sewm bīhon melekotu 'alteleweṭem be'iwnet 'amlaknewna be'iwnet 'amlak yehone 'irsu meṭto
'adanen.
ḳdst hoy lemñln.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `y la Divinidad de Él quedó sin cambio. Nuestro Dios, quien en verdad es Dios, se hizo hombre;
Él vino y nos liberó. ¡Ruega a Él por nosotros, oh Santa!`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `2`,
    "english": `We all magnify you, O our Lady the God-bearer, that your compassion may be over us all.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `አምላክን የወለድሽ እመቤታችን ሆይሁላችን እናገንሻለን። ይቅርታሽ ለሁላችን ይሆን ዘንድ ነውና።`,
    "amharic_phonetic": `amlakn yeweledsh 'imebétachn hoyhulachn 'inagenshalen. yḳrtash lehulachn yhon zend newna.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `Todos te engrandecemos, oh Nuestra Señora, la Portadora de Dios, para que tu compasión sea sobre todos nosotros.`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `2`,
    "english": `Through the pride of us all, the Virgin Mary, the God-bearer, the original curse that rested upon our race by the perversion which the woman committed when she ate from the tree 
was destroyed.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ሔዋን እንጨት በልታ ባደረገችው ዓመፅ በባሕርያችን ያደረ የቀድሞው እርግማን በእርስዋ የጠፋልን አምላክን የወለደች ድንግል ማርያም የሁላችን መመኪያ ናት ።`,
    "amharic_phonetic": `ḥéwan 'inchet belta baderegechw 'amets bebaḥryachn yadere yeḳedmow 'irgman be'irswa yeṭefaln 'amlakn yeweledech dngl maryam yehulachn memekīya nat .`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `La Virgen María, la Portadora de Dios, se ha convertido en el objeto de gloria de todos nosotros, porque por medio de Ella fue destruida la maldición de los tiempos antiguos, que pesaba sobre nuestra raza, por la maldad que cometió la mujer cuando comió del árbol.`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `2`,
    "english": `Because of Eve the gates of paradise were shut, and through Virgin Mary they 
were opened to us again,`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ስለ ሔዋን የገነት ደጅ ተዘጋ ዳግመኛም ስለ ድንግል ማርያም ተከፈተልን።`,
    "amharic_phonetic": `sle ḥéwan yegenet dej tezega dagmeñam sle dngl maryam tekefeteln.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `Por Eva se cerró de golpe la puerta del jardín, y por María la Virgen se nos ha abierto de nuevo.`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `2`,
    "english": `He granted us to eat from the Tree of Life, that is, the Body of Christ and His precious Blood.
Because of His love for us He came and delivered us.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ከዕፅ ሕይወት እንበላ ዘንድ አደለን። ይኸውም እኛን ስለመውደደ መጥቶ ያዳነን የክርስቶስ ክቡር ሥጋው ክቡር ደሙ ነው።`,
    "amharic_phonetic": `ke'its ḥywet 'inbela zend 'adelen. ykhewm 'iñan slemewdede meṭto yadanen yekrstos kbur sgaw kbur demu new.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `Nos es designado comer del Árbol de la Vida, es decir, el Cuerpo de Cristo y Su Sangre preciosa.
Por Su amor por nosotros, Él vino y nos libró.`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `2`,
    "english": `What mind, what utterance, and what ear is able to comprehend this mystery which has been proclaimed about her?`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ስለ እርሷ ድንቅ ሆኖ የሚነገረውን ይህ ሚስጢር ማወቅ የሚቻለው ምን ልቡና ነው? መናገርየሚቻለው ምን አንደበት ነው? መስማት የሚቻለው ምን ጆሮ ነው?`,
    "amharic_phonetic": `sle 'irswa dnḳ hono yemīnegerewn yh mīsṭīr maweḳ yemīchalew mn lbuna new? menageryemīchalew mn 'andebet new? mesmat yemīchalew mn joro new?`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `¿Qué entendimiento, qué lenguaje y qué oído es capaz de comprender el misterio, que debe ser proclamado como maravilloso?`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `2`,
    "english": `God the lover of mankind is the One and 
only Word of the Father Who existed in His divinity without corruption before the world.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ሰውን የሚወድ እግዚአብሔር አንድ ብቻ የሆነ አምላክነቱ ሳይለወጥ ከዓለም በፊት የነበረ`,
    "amharic_phonetic": `sewn yemīwed 'igzī'abḥér 'and bcha yehone 'amlaknetu sayleweṭ ke'alem befīt yenebere`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `El cual es que “Dios es el amante de la humanidad, ”Uno es Él Solo, el Verbo del Padre, que existió antes del mundo en Su Divinidad incorruptible, de Uno, el Padre.`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `2`,
    "english": `The Only-begotten from His one Father became incarnate from His holy mother.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `የአብ ቃል ከአብ ዘንድ መጥቶ ልዩ ከሆነች እናቱ ሰው ሆነ።`,
    "amharic_phonetic": `ye'ab ḳal ke'ab zend meṭto lyu kehonech 'inatu sew hone.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `El Hijo Unigénito 
vino y se encarnó de la Mujer Santa, Su madre,`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `2`,
    "english": `Her virginity did not perish after she gave birth to Him and thus she has been revealed as the Mother of God.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ከወለደችው በኋላም ድንግልናዋ አልተለወጠም።
ስለዚህ አምላክን የወለደች እንደሆነች ታወቀች።`,
    "amharic_phonetic": `keweledechw behwalam dnglnawa 'alteleweṭem. slezīh 'amlakn yeweledech 'indehonech taweḳech.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `y después que ella lo dio a luz no pereció su virginidad, y por esto se manifestó que era la Portadora de Dios.`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `2`,
    "english": `O, how deep is the richness of the wisdom of God, for the womb that was decreed to give birth in laborious pain, suffering, and sorrow heart,`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `እግዚአብሔር የጥበቡ ስፋት ምን ይጠልቅ?
በጻእር በምጥ በልብ ጋር ትወልድ ዘንድ የፈረደባት ማኀፀን`,
    "amharic_phonetic": `igzī'abḥér yeṭbebu sfat mn yṭelḳ?
betsa'ir bemṭ belb gar tweld zend yeferedebat mahatsen`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `¡Oh profunda es la riqueza de la sabiduría de Dios! El vientre que Él decretó que daría a luz niños con dolor, sufrimiento y tristeza de corazón,`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `2`,
    "english": `has become the fountain of life, and has brought forth without the seed of man, Him Who removed the curse from our race, and for this reason we will praise Him, saying`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `የሕይወት መገኛ ሆነች ከባሕርያችን እርግማንን የሚያጠፋልንን ያለ ወንድ ዘር ወለደችልን።
ስለዚህም ሰውን የምትወድ ሆይ ክብር ላንተ ይገባል፤`,
    "amharic_phonetic": `yeḥywet megeña honech kebaḥryachn 'irgmann yemīyaṭefalnn yale wend zer weledechln.
slezīhm sewn yemtwed hoy kbr lante ygebal:`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `se había convertido en la fuente de vida, y ha dado a luz sin la simiente del hombre a Aquel que quitó la maldición de nuestra raza. Y por esta razón le alabaremos, diciendo:`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `2`,
    "english": `Glory be to You, O Good Lover of mankind and Savior of our souls. O holy one, pray for us.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ቸርና የሰውነታችን መድኃኒት ነህ እያልን እናመስግነው።
ቅድስት ሆይ ለምኝልን።`,
    "amharic_phonetic": `cherna yesewnetachn medhanīt neh 'iyaln 'inamesgnew. ḳdst hoy lemñln.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `“Gloria a Ti, oh Tú, Amante de la humanidad, Redentor de nuestras almas.”
¡Ruega a Él por nosotros, oh Santa!`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `3`,
    "english": `O how wonderful and marvelous is this, the power of the womb of the Virgin, the Mother of God without seed!`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ያለወንድ ዘር አምላክን የወለደች ድንግል የማኀፀንዋ ሥራ ምን ይደንቅ?`,
    "amharic_phonetic": `yalewend zer 'amlakn yeweledech dngl yemahatsenwa sra mn ydenḳ?`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `¡Oh, cuán maravilloso y poderoso fue el vientre de la Virgen, que dio a luz a Dios sin simiente!`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `3`,
    "english": `And of this the angel who appeared unto Joseph was a witness when he spoke, saying,`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ለዮሴፍ የታየው መልአኩ ከእርሷ`,
    "amharic_phonetic": `leyoséf yetayew mel'aku ke'irswa`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `Y de esto fue testigo el ángel que se apareció a José cuando habló, diciendo:`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `3`,
    "english": `That which shall be born of her is of the Holy Spirit.
It was the Word of God Who became incarnate without change.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `በመንፈስ ቅዱስ የሚወለደው ያለ መለወጥ ሰው የሚሆነው
የእግዚአብሔር ቃል ነው ብሎ መስክሯልና። `,
    "amharic_phonetic": `bemenfes ḳdus yemīweledew yale meleweṭ sew yemīhonew
ye'igzī'abḥér ḳal new blo meskrwalna. `,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `“Lo que de ella nacerá, es del Espíritu Santo.”
Fue el Verbo de Dios Quien se encarnó sin cambio.`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `3`,
    "english": `Mary brought Him forth Who is the twofold joy. And [he] said ""You shall bring forth a Son and will call His Name Emmanuel, which means God with us,""`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ማርያም የዚህ ደስታ ዕጥፍ የሆነ እርሱን ወለደችው።
መልአኩ ልጅ ትወልጃለሽ ስሙም አማኑኤል ይባላል አላት። ትርጓሜውም እግዚአብሐር ከእኛ ጋር ሆነ ማለት ነው።`,
    "amharic_phonetic": `maryam yezīh desta 'iṭf yehone 'irsun weledechw.
mel'aku lj tweljalesh smum 'amanu'él ybalal 'alat. trgwaméwm 'igzī'abḥar ke'iña gar hone malet new.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `María lo dio a luz por segunda vez. Y Gabriel le dijo a ella: “Darás a luz un hijo, y le dirás por nombre Emanuel, que traducido es, Dios con nosotros.`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `3`,
    "english": `And moreover;
""He shall be called Jesus, Who shall save His people from their sins.""`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ዳግመኛ ወገኖቹን ከኃጢአታቸው የሚያድናቸው ኢየሱስ ይባላል።`,
    "amharic_phonetic": `dagmeña wegenochun kehaṭī'atachew yemīyadnachew 'īyesus ybalal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `Y además, se llamará Jesús, el que salvará a su pueblo de sus pecados.”`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `3`,
    "english": `And may He save us also by His power, and forgive our sins, for we have known in truth that He is God, Who became man.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `በኃይሉ ያድነን ዘንድ ኃጢአታችንንም ያስተሠርይልን ዘንድ ለዘለዓለም ክብር ይግባውና ሰው የሆነ እርሱን አምላክ እንደሆነ በተረዳ ነገር አውቀነዋልና፡።`,
    "amharic_phonetic": `behaylu yadnen zend haṭī'atachnnm yasteseryln zend lezele'alem kbr ygbawna sew yehone 'irsun 'amlak 'indehone betereda neger 'awḳenewalna .`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `Y que Él también 
nos salve por Su poder, y perdone nuestros pecados, porque hemos conocido en verdad que Él es el Dios que se hizo hombre.`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `3`,
    "english": `Praise be unto Him forever and ever, O how wonderful is the birth of God from Mary, the Holy Virgin, she bore the Word;`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ልዩ ከሆነች ድንግል ማርያም ይህ የአምላክ መወለድ ምን
ይደንቅ ቃልን ወስነችው።`,
    "amharic_phonetic": `lyu kehonech dngl maryam yh ye'amlak meweled mn
ydenḳ ḳaln wesnechw.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `Alabado sea Él por siempre. ¡Oh, qué maravilloso es el nacimiento de Dios por María, la Santísima Virgen! Ella cumplió la Palabra del Padre;`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `3`,
    "english": `a seed did not precede His Birth and her virginity was not destroyed by His Birth, The Word went forth from the Father without weariness, and was born of the Virgin without suffering,`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": ` ልደቱንም ዘር አልቀደመውም። በመወለዱም ድንግልናዋን
አልለወጠውም። ቃል ከአብ ያለ ድካም ወጣ። ከድንግልም ያለ ሕማም ተወለደ።`,
    "amharic_phonetic": ` ldetunm zer 'alḳedemewm. bemeweledum dnglnawan
'alleweṭewm. ḳal ke'ab yale dkam weṭa. kednglm yale ḥmam tewelede.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `la simiente no precedió de Su Nacimiento, y Su virginidad no fue destruida por Su Nacimiento.  
El Verbo salió del Padre sin cansancio y nació de la Virgen sin sufrimiento ni dolor.`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `3`,
    "english": `the wise men worshiped Him, and brought unto Him incense because He is God, and gold because He is the King,`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ሰብአ ሰገል ሰገዱለት አምላክ ነውና ዕጣን አመጡለት ንጉሥም ነውና ወርቅ አመጡለት`,
    "amharic_phonetic": `seb'a segel segedulet 'amlak newna 'iṭan 'ameṭulet ngusm newna werḳ 'ameṭulet`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `Los Sabios lo adoraron y le trajeron incienso porque era Dios, y oro porque era Rey,`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `3`,
    "english": `and myrrh which was given for His life-giving death for our sake which He accepted of His own will,`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ስለእኛ በፈቃዱ ለተቀበለው መዳኛችን ለሆነ ሞቱም ከርቤ አመጡለት።`,
    "amharic_phonetic": `sle'iña befeḳadu leteḳebelew medañachn lehone motum kerbé 'ameṭulet.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `y mirra, que se daba por su 
muerte que dio vida a los hombres. Y por nuestro bien aceptó la muerte por su propia voluntad.`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `3`,
    "english": `He is the One and only Good Lover of mankind. O holy one, pray for us.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ቸርና ሰውን ወዳጅ የሆነ አንድ እርሱ ብቻ ነው።
ቅድስት ሆይ ለምኝልን።`,
    "amharic_phonetic": `cherna sewn wedaj yehone 'and 'irsu bcha new.
ḳdst hoy lemñln.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `Sólo Él es el Ser Bueno, y el Amante de la humanidad. ¡Ruega a Él por nosotros, oh Santa!`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `4`,
    "english": `O how wonderful! He took a rib from the side of Adam, and fashioned from it a woman, and the whole creation of mankind.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ከአዳም ጐን አንዲት ዐፅም ማንሣት ምን ይደንቅ?
ከእርሱ ሴትን ፈጠረ የሰው ፍጥረትንም ሁሉ ፈጠረ።`,
    "amharic_phonetic": `ke'adam gwen 'andīt 'atsm mansat mn ydenḳ?
ke'irsu sétn feṭere yesew fṭretnm hulu feṭere.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `¡Oh, qué maravilloso!  Él tomó una costilla del costado de Adán, y de ella formó una mujer, y toda la creación de los hijos de los hombres fue dada a Dios,`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `4`,
    "english": `The Lord, the Word of the Father, was given, and was incarnate of the Holy Virgin,`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ጌታ የአብ ቃል ተሰጠ። ከልዩ ድንግልም ሰው ሆነ
`,
    "amharic_phonetic": `géta ye'ab ḳal teseṭe. kelyu dnglm sew hone
`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `Verbo del Padre, que se encarnó de la Santísima Virgen,`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `4`,
    "english": `and was called Emmanuel for this we beseech her at all times to intercede on our behalf with her 
beloved Son.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `አማኑኤል ተባለ ስለዚህ ሁል ጊዜ እርስዋን እንለምን፣ ከተወደደ ልጅዋ ታማልደን ዘንድ።`,
    "amharic_phonetic": `amanu'él tebale slezīh hul gīzé 'irswan 'inlemn, ketewedede ljwa tamalden zend.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `y se llama Emanuel.
Y por eso le suplicamos que en todo tiempo luche por nosotros con su amado Hijo por el perdón de nuestros pecados.`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `4`,
    "english": `She is good (generous) towards all the saints and the archbishops, for she brought to them that for which they waited.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `በቅዱሳንና በሊቃነ ጳጳሳት ዘንድ ቸር ናት ደጅ የሚጠኑትን ወልዳላቸዋልችና
`,
    "amharic_phonetic": `beḳdusanna belīḳane p̣ap̣asat zend cher nat dej yemīṭenutn weldalachewalchna
`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `Ella fue benéfica con todos los santos y sumos sacerdotes, porque les trajo lo que esperaban,`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `4`,
    "english": `And for the prophets, she brought to them Him concerning whom they had prophesied.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ለነቢያትም ትንቢት የተናገሩለትን ወልዳላቸዋለችና`,
    "amharic_phonetic": `lenebīyatm tnbīt yetenageruletn weldalachewalechna`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `y trajo a los profetas a Aquel de quien habían profetizado,`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `4`,
    "english": `And for the Apostles she brought forth Him in the Name 
of whom they preached to ends of the world,`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ለሐዋርያትም እስከ ዓለም ዳርቻ በስሙ ያስተማሩለትን ወልዳላቸዋለችና`,
    "amharic_phonetic": `leḥawaryatm 'iske 'alem darcha besmu yastemaruletn weldalachewalechna`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `y les dio a conocer a los Apóstoles a Aquel en cuyo nombre habían de predicar en todos los confines del mundo,`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `4`,
    "english": `for the martyrs and believers who fought for His sake, Jesus Christ came forth from her.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ሰማዕታትና ምዕመናንም የተጋደሉለት የጥበቡ ጸጋ ብዛት የማይታወቅ ኢየሱስ ክርስቶስ ከእርስዋ ተወልዷልና`,
    "amharic_phonetic": `sema'itatna m'imenanm yetegadelulet yeṭbebu tsega bzat yemaytaweḳ 'īyesus krstos ke'irswa teweldwalna`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `y de Ella salió para los mártires y creyentes Aquel por quien habían de luchar, Jesucristo.`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `4`,
    "english": `The wealth of the grace of His wisdom is incomprehensible. Let us seek His great mercy, for He came and delivered us. O holy one, pray for us.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `የይቅርታውን ብዛት መርምረን እንወቅ (እንፈልግ) መጥቶ አድኖናልና።
ቅድስት ሆይ ለምኝልን።`,
    "amharic_phonetic": `yeyḳrtawn bzat mermren 'inweḳ ('infelg) meṭto 'adnonalna.
ḳdst hoy lemñln.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `La riqueza de la gracia de Su sabiduría es insondable. Buscaremos la grandeza de Su compasión, porque Él vino y nos libró. ¡Ruega a Él por nosotros, oh Santa!
`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `5`,
    "english": `God swore to David in truth and He does not regret ""of the fruit of your loins I will set upon your throne,""`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `እግዚአብሔር 
የባሕርይህን ፍሬ በዙፋንህ ላይ አኖራለሁ ብሎ ለዳዊት በእውነት ማለ አይጸጸትም።`,
    "amharic_phonetic": `igzī'abḥér yebaḥryhn fré bezufanh lay 'anoralehu blo ledawīt be'iwnet male 'aytsetsetm.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `Dios juró a David en rectitud y no se arrepentirá: “Del fruto de tu vientre me sentaré en tu trono.”`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `5`,
    "english": `And when that righteous man received (believed) that Christ would be born of him in the flesh, he wished to seek out and to prepare a dwelling-place for God the Word.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ጻድቅ እርሱ ዳዊት ክርስቶስ በሥጋ ከእርሱ እንዲወለድ ባመነ ጊዜ የእግዚአብሔርን ቃል ማደሪያ ፈልጎ ያገኝ ዘንድ ወደደ`,
    "amharic_phonetic": `tsadḳ 'irsu dawīt krstos besga ke'irsu 'indīweled bamene gīzé ye'igzī'abḥérn ḳal maderīya felgo yageñ zend wedede`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `Y cuando aquel justo recibió de Él que Cristo debía nacer de él en la carne, quiso buscar y preparar una morada para Dios, la Palabra del Padre.`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `5`,
    "english": `And he completed this with great vigilance and then cried out in the Spirit and said,`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ይህንንም በታላቅ ትጋት ፈጸመ።`,
    "amharic_phonetic": `yhnnm betalaḳ tgat fetseme.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `Y lo completó con gran esfuerzo y luego clamó en el Espíritu Santo y dijo:`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `5`,
    "english": `Behold, we have heard it in Ephrata and the dwelling-place of the God of Jacob, which is in Bethlehem, in which Emmanuel has chosen to be born in the flesh for our salvation.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ከዚህም በኋላ እነሆ በኤፍራታ ሰማነው ብሎ በመንፈስ ቅዱስ አስምቶ ተናገረ።
ይህቺውም አማኑኤል እኛን ለማዳን በሥጋ ይወለድባት ዘንድ የመረጣት የያዕቆብ አምላክ ማደሪያ ናት።`,
    "amharic_phonetic": `kezīhm behwala 'ineho be'éfrata semanew blo bemenfes ḳdus 'asmto tenagere.
yhchīwm 'amanu'él 'iñan lemadan besga yweledbat zend yemereṭat yeya'iḳob 'amlak maderīya nat.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `“He aquí, lo hemos oído en Efrata y en la morada del Dios de Jacob, que es Belén, en la cual Emanuel ha elegido para nacer en la carne para nuestra salvación.”`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `5`,
    "english": `And also another of the prophets has said it: ""And as for you, O Bethlehem of the land of Ephrata, you will not be the least of the kings of Judah.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ዳግመኛም ከነቢያት አንዱ ሚክያስ አንቺ የኤፍራታ ክፍል የሆንሽ ቤተልሔም ከይሁዳ ነገሥታት መሳፍንት 
አገር አታንሺም`,
    "amharic_phonetic": `dagmeñam kenebīyat 'andu mīkyas 'anchī ye'éfrata kfl yehonsh bételḥém keyhuda negestat mesafnt 
'ager 'atanshīm`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `Y también lo ha dicho otro de los profetas: “Y tú, oh Belén de la tierra de Efrata, no serás la más pequeña del rey de Judá,`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `5`,
    "english": `For from you will come forth a King Who will shepherd My people Israel.""`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ወገኖቼ እሥራኤልን የሚጠብቃቸው ንጉሥ ካንቺ ይወጣልና`,
    "amharic_phonetic": `wegenoché 'isra'éln yemīṭebḳachew ngus kanchī yweṭalna`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `porque de ti saldrá un rey que regirá a mi pueblo Israel.”`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `5`,
    "english": `O how wonderful is the word of those who prophesied in One Spirit concerning Christ, to Whom be glory, together with His Good Father, and the Holy Spirit henceforth and forever. O holy one, pray for us.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ከዛሬ ጀምሮ እስከ ዘለዓለም ድረስ ከቸር አባቱና ከመንፈስ ቅዱስ ጋር ምስጋና ስለተገባው ስለ ክርስቶስ ባንድ መንፈስ ቅዱስ ትንቢት የተናገሩት የነዚህ የሚክያስና የዳዊት ነገርምን ይረቅ?
ቅድስት ሆይ ለምኝልን።`,
    "amharic_phonetic": `kezaré jemro 'iske zele'alem dres kecher 'abatuna kemenfes ḳdus gar msgana sletegebaw sle krstos band menfes ḳdus tnbīt yetenagerut yenezīh yemīkyasna yedawīt negermn yreḳ?
ḳdst hoy lemñln.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `¡Oh, cuán maravillosa es la palabra de aquellos que profetizaron acerca de Cristo en un solo Espíritu, a quien sea la gloria junto con su Buen Padre y el Espíritu Santo, desde ahora y para siempre! ¡Ruega a Él por nosotros, oh Santa!`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `6`,
    "english": `When the lawless rose up against David When the enemies revolted against David who reigned for Israel, he wished to drink water from the pool of Bethlehem.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ለእስራኤል የነገሠ ዳዊት ጠላቶቹ በተነሡበት ጊዜ ከቤተልሔም ምንጭ ውኃ ይጠጣ ዘንድ ወደደ`,
    "amharic_phonetic": `le'isra'él yenegese dawīt ṭelatochu betenesubet gīzé kebételḥém mnch wha yṭeṭa zend wedede`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `David, que reinaba sobre Israel, quiso beber del agua del estanque de Belén,`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `6`,
    "english": `Whereupon, the captains of his hosts rose up quickly and waged war in the camp of the rebels, and brought unto him that water which he wished to drink.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `የጭፍሮቹ አለቆች ፈጥነው ተነሡና በጠላቶቹ ከተማ 
ተዋግተው ሊጠጣ የወደደውን አመጡለት።`,
    "amharic_phonetic": `yechfrochu 'aleḳoch feṭnew tenesuna beṭelatochu ketema tewagtew līṭeṭa yewededewn 'ameṭulet.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `por lo que inmediatamente se levantaron los capitanes de sus ejércitos, e hicieron guerra en el campamento de los rebeldes, y le trajeron el agua que deseaba beber.`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `6`,
    "english": `When that righteous man saw that they had willingly delivered themselves over to death for his sake, he poured out that water and did not drink of it,`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ጻድቅ ዳዊት ግን ጨክነው ሰውነታቸውን ስለ እርሱ ለጦርነት ለሞት አሳልፈው እንደሰጡ ባየ ጊዜ ያን ውኃ አፈሰሰ ከእርሱም አልጠጣም`,
    "amharic_phonetic": `tsadḳ dawīt gn cheknew sewnetachewn sle 'irsu leṭornet lemot 'asalfew 'indeseṭu baye gīzé yan wha 'afesese ke'irsum 'alṭeṭam`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `Y cuando el justo vio que voluntariamente se habían entregado la matanza por su causa, derramó el agua para el Señor y no bebió de ella.`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `6`,
    "english": `and then righteousness was accounted unto him forever.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ከዚህ በኋላ ለዘለዓለም ጽድቅ ሆኖ ተቆጠረለት።`,
    "amharic_phonetic": `kezīh behwala lezele'alem tsdḳ hono teḳoṭerelet.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `Y desde entonces le fue contado por justicia para siempre.`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `6`,
    "english": `Truly the martyrs rejected the desire of this world, and poured out their blood for God, and endured bitter deaths for the sake of the kingdom of heaven, saying,`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ስማዕታት የዚችን ዓለም ጣዕም በዕውነት ናቁ ደማቸውንም ስለ እግዚአብሔር አፈሰሱ።
ስለ መንግሥተ ሰማያትም መራራ ሞትን ታገሱ።`,
    "amharic_phonetic": `sma'itat yezīchn 'alem ṭa'im be'iwnet naḳu demachewnm sle 'igzī'abḥér 'afesesu.
sle mengste semayatm merara motn tagesu.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `Y en verdad de la misma manera los mártires han rechazado el deseo de este mundo, y han derramado su sangre por Dios, y han soportado amargas muertes por el Reino de los Cielos.`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `6`,
    "english": `have compassion upon us according to the greatness of Your compassion. O holy one, pray for us.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `እንደ ይቅርታህ ብዛት ይቅር በለን።
ቅድስት ሆይ ለምኝልን።`,
    "amharic_phonetic": `inde yḳrtah bzat yḳr belen. ḳdst hoy lemñln.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `Ten compasión de nosotros conforme a la grandeza de Tu compasión. ¡Ruega a Él por nosotros, oh Santa!`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `7`,
    "english": `One from the Holy Trinity, saw our lowly state, bowed the heaven of heavens, He came and dwelt in the womb of the Virgin,`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ከቅድስት ሥላሴ አንዱ ወልድ መዋረዳችንን አይቶ ከሰማየ ሰማያት ወርዶ ባሕርዩን ዝቅ አደረገና መጥቶ በድንግል ማሕፀን አደረ።`,
    "amharic_phonetic": `keḳdst slasé 'andu weld mewaredachnn 'ayto kesemaye semayat werdo baḥryun zḳ 'aderegena meṭto bedngl maḥtsen 'adere.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `Uno de la Santísima Trinidad vio nuestro estado bajo, inclinó el cielo de los cielos, vino y habitó en el vientre de la Virgen,`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `7`,
    "english": `and became a man like us with the exception of sin alone, and He was born in Bethlehem 
according to the teaching of the Prophets,`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ከብቻዋ ከኃጢአት በቀርም እንደኛ ሰው ሆነ፤
ነቢያትም ትንቢት እንደተናገሩለት በቤተልሔም ተወለደ።`,
    "amharic_phonetic": `kebchawa kehaṭī'at beḳerm 'indeña sew hone: nebīyatm tnbīt 'indetenagerulet bebételḥém tewelede.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `y se hizo un hombre como nosotros, con la única excepción del pecado. Y nació en Belén, según lo predicado por los profetas,`
  },
  {
    "instruction": ``,
    "reference": `Thursday Praise of Mary`,
    "chapter": `Thurs`,
    "stanza": `7`,
    "english": `He delivered us, and redeemed us and made us His own people. O holy one, pray for us.`,
    "geez_script": ``,
    "geez_phonetic": ``,
    "amharic_script": `ፈጽሞ አዳነን ወገኖቹም አደረገን።
ቅድስት ሆይ ለምኝልን።`,
    "amharic_phonetic": `fetsmo 'adanen wegenochum 'aderegen.
ḳdst hoy lemñln.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": `nos libró, nos redimió y nos hizo su pueblo por los siglos de los siglos. ¡Ruega a Él por nosotros, oh Santa!`
  },
  {
    "instruction": ``,
    "reference": `Intro to ""The Angels Praise Mary,"" attributed to Abba Giyorgis of Segla/Gasecha (15th century)`,
    "chapter": `Angels`,
    "stanza": `Intro`,
    "english": `The Angels Praise Mary, composed by Abba Giyorgis the Ethiopian`,
    "geez_script": `ይዌድስዋ መላእክት ለማርያም ዘደረሰ አባ ጊዮርጊስ ኢትዮጵያዊ`,
    "geez_phonetic": `ywédswa mela'ikt lemaryam zederese 'aba gīyorgīs 'ītyop̣yawī`,
    "amharic_script": ``,
    "amharic_phonetic": ``,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `1`,
    "english": `The angels praise Mary within the inner part of the curtains of the temple, and they say to her, ""Greetings to you, Mary, the new calf.""`,
    "geez_script": `ይዌድስዋ መላእክት ለማርያም በውስተ ውሳጤ መንጦላዕት ወይብልዋ በሐኪ ማርያም ሐዳስዩ ጣዕዋ።`,
    "geez_phonetic": `ywédswa mela'ikt lemaryam bewste wsaṭé menṭola'it weyblwa beḥakī maryam ḥadasyu ṭa'iwa.`,
    "amharic_script": `መላእክት ማርያምን በመንጦላዕት ውስጥ ያመሰግኗታል፤
ሐዳስ ጣዕዋ ላንቺ ምስጋና ይገባሻል እያሉ።`,
    "amharic_phonetic": `mela'ikt maryamn bemenṭola'it wsṭ yamesegnwatal: ḥadas ṭa'iwa lanchī msgana ygebashal 'iyalu.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `1`,
    "english": `The angel said to Mary, ""Accept the Word that comes to you, Who will dwell in your womb.""`,
    "geez_script": `ይቤላ መልአክ ለማርያም ተወከፊዮ ለቃል ኅቤኪ ይመጽእ ወበማኅፀነ ዚአኪ የኅድር፤`,
    "geez_phonetic": `ybéla mel'ak lemaryam tewekefīyo leḳal hbékī ymets'i webemahtsene zī'akī yehdr:`,
    "amharic_script": `መልአክ ማርያምን ቃልን ተቀበይው አላት ካንቺ ዘንድ ይመጣልና በማኅፀንሽም ያድራል።`,
    "amharic_phonetic": `mel'ak maryamn ḳaln teḳebeyw 'alat kanchī zend ymeṭalna bemahtsenshm yadral.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `1`,
    "english": `How did He dwell in a poor house, like a humble man? From heaven He descended upon her, finding beauty in her, and was born from 
her.`,
    "geez_script": `እፎ ቤተ ነዳይ ኅደረ ከመ ምስኪን እምሰማያት ወረደ ላዕሌሃ ፈቲዎ ሥነ ዚአሃ ወተወልደ እምኔሃ።`,
    "geez_phonetic": `ifo béte neday hdere keme mskīn 'imsemayat werede la'iléha fetīwo sne zī'aha wetewelde 'imnéha.`,
    "amharic_script": `እንዴት ከድሀ ቤት አደረ እንደ ምስኪን ከሰማያት ወርዶ የርስዋን ባሕርይ ባሕርይ አድርጎ ተወለደ`,
    "amharic_phonetic": `indét kedha bét 'adere 'inde mskīn kesemayat werdo yerswan baḥry baḥry 'adrgo tewelede`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary.
Luke 1:26`,
    "chapter": `Angels`,
    "stanza": `2`,
    "english": `And now in the sixth month, the angel Gabriel, was sent by God to a city of Galilee named Nazareth,`,
    "geez_script": `ወበሳድስ ወርኅ ተፈነወ ገብርኤል መልአክ እምኀበ እግዚአብሔሔር ኅበ አሐቲ ሀገር ዘገሊላ እንተ ስማ ናዝሬት`,
    "geez_phonetic": `webesads werh tefenewe gebr'él mel'ak 'imhabe 'igzī'abḥéḥér hbe 'aḥatī hager zegelīla 'inte sma nazrét`,
    "amharic_script": `በስድስተኛውም ወር መልአኩ ገብርኤል ከእግዚአብሔር ዘንድ ስሟ ናዝሬት ወደምትባለው ወደ አንዲት የገሊላ ከተማ`,
    "amharic_phonetic": `besdsteñawm wer mel'aku gebr'él ke'igzī'abḥér zend smwa nazrét wedemtbalew wede 'andīt yegelīla ketema`,
    "tigrinya_script": `ብሻድሻይ ወርሒ መልኣኽ ገብርኤል፥ ናዝሬት ናብ እትብሃል ከተማ ገሊላ፥ ካብ ዓሌት ዳዊት ዝኾነ፥`,
    "tigrinya_phonetic": `bshadshay werḥī mel'akh gebr'él;
nazrét nab 'itbhal ketema gelīla; kab 'alét dawīt zkhone;`,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary. Luke 1:27; Isaiah 7:14;
Matthew 1:18.`,
    "chapter": `Angels`,
    "stanza": `2`,
    "english": `to a virgin betrothed to a man whose name was Joseph, of the house of David. And the virgin's name was Mary.`,
    "geez_script": `ኅበ ድንግል እንተ ተፍኅረት ለብእሲ ዘስሙ ዮሴፍ ዘእምቤተ ዳዊት ወስማ ለይእቲ ድንግል ማርያም፤`,
    "geez_phonetic": `hbe dngl 'inte tefhret leb'isī zesmu yoséf ze'imbéte dawīt wesma ley'itī dngl maryam:`,
    "amharic_script": `ከዳዊት ወገን ለሚሆን ዮሴፍ ለሚባል ሰው ወደ ታጨችው ወደ አንዲት ድንግል ተላከ፤
የዚያችም ድንግል ስምዋ ማርያም ይባል ነበረ።`,
    "amharic_phonetic": `kedawīt wegen lemīhon yoséf lemībal sew wede tachechw wede 'andīt dngl telake: yezīyachm dngl smwa maryam ybal nebere.`,
    "tigrinya_script": `ዮሴፍ ንዝበሃል ሰብ፥ ናብ ዝተሓፀየት ናብ ሓንቲ ድንግል፥ ካብ እግዚኣብሄር ተልኣኸ፤
ስም እታ ድንግል ከዓ ማርያም ይበሃል።`,
    "tigrinya_phonetic": `yoséf nzbehal seb; nab zteḥatseyet nab ḥantī dngl;
kab 'igzī'abhér tel'akhe: sm 'ita dngl ke'a maryam ybehal.`,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary. Luke 1:28;
Daniel 9:23`,
    "chapter": `Angels`,
    "stanza": `2`,
    "english": `And having come in, the angel said to her, ""Rejoice, joyful one, O filled with grace, the Lord is with you; blessed are you among women!""`,
    "geez_script": `ቦአ መልአክ ኅቤሃ ወይቤላ ተፈሥሒ ፍሥሕት ኦ ምልእተ ጸጋ እግዚአብሔር ምስሌኪ ቡርክት አንቲ እምአንስት።`,
    "geez_phonetic": `bo'a mel'ak hbéha weybéla tefesḥī fsḥt 'o ml'ite tsega 'igzī'abḥér mslékī burkt 'antī 'im'anst.`,
    "amharic_script": `መልአኩም ወደ እርስዋ ገብቶ፥ “ደስ ያለሽ፥ ጸጋንም የተመላሽ ሆይ፥ ደስ ይበልሽ፤ እግዚአብሔር ካንቺ ጋር ነው፤ ከሴቶች ተለይተሽ አንቺ የተባረክሽ ነሽ” አላት።`,
    "amharic_phonetic": `mel'akum wede 'irswa gebto;
“des yalesh; tseganm yetemelash hoy; des ybelsh: 'igzī'abḥér kanchī gar new: kesétoch teleytesh 'anchī yetebareksh nesh” 'alat.`,
    "tigrinya_script": `እቲ መልኣኽ ናብቲ ንሳ ዘላቶ ኣትዩ፥ “ኦ ምልእተ ፀጋ ደስ ይበልኪ! እግዚኣብሄር ምሳኺ እዩ፤ ንስኺ ኻብ ኣንስቲ ዝተባረኽኪ ኢኺ” በላ።`,
    "tigrinya_phonetic": `itī mel'akh nabtī nsa zelato 'atyu;
“'o ml'ite tsega des ybelkī! 'igzī'abhér msakhī 'iyu: nskhī khab 'anstī ztebarekhkī 'īkhī” bela.`,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary. Luke 1:29, 1:12`,
    "chapter": `Angels`,
    "stanza": `2`,
    "english": `But when she saw him, she was troubled at his saying, and she considered, saying, ""what manner of greeting is this?""`,
    "geez_script": `ወርእያ ደንገፀት እምቃሉ ወሐለየት ወትቤ እፎኑ ከመዝኑ እንጋ አምኃ ይትአምኁ።`,
    "geez_phonetic": `wer'iya dengetset 'imḳalu weḥaleyet wetbé 'ifonu kemeznu 'inga 'amha yt'amhu.`,
    "amharic_script": `እርስዋም በአየችው ጊዜ ከአነጋገሩ የተነሣ ደነገጠችና “ይህ እንዴት ያለ ሰላምታ ነው?”
ብላ ዐሰበች።`,
    "amharic_phonetic": `irswam be'ayechw gīzé ke'anegageru yetenesa denegeṭechna “yh 'indét yale selamta new?” bla 'asebech.`,
    "tigrinya_script": `ንሳ ድማ ምስ ረአየቶ በቲ ቓሉ ደንገፀት፤
“ከመይ ዝበለ ሰላምታ እዩ?” ኢላውን ሓሰበት።`,
    "tigrinya_phonetic": `nsa dma ms re'ayeto betī qhalu dengetset: “kemey zbele selamta 'iyu?”
'īlawn ḥasebet.`,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary. Luke 1:30, 2:52`,
    "chapter": `Angels`,
    "stanza": `2`,
    "english": `Then the angel said to her, ""Do not be afraid, Mary, for you have found favor with God.`,
    "geez_script": `ወይቤላ መልአክ ኢትፍርሂ ማርያም እስመ ረከብኪ ሞገሰ ብኅበ እግዚአብሔር።`,
    "geez_phonetic": `weybéla mel'ak 'ītfrhī maryam 'isme rekebkī mogese bhbe 'igzī'abḥér.`,
    "amharic_script": `መልአኩም እንዲህ አላት፥ “ማርያም ሆይ፥ በእግዚአብሔር ዘንድ ባለሟልነትን አግኝተሻልና አትፍሪ።`,
    "amharic_phonetic": `mel'akum 'indīh 'alat; “maryam hoy;
be'igzī'abḥér zend balemwalnetn 'agñteshalna 'atfrī.`,
    "tigrinya_script": `እቲ መልኣኽ ከዓ “ኦ ማርያም፥ ኣብ ቅድሚ እግዚኣብሄር ሞገስ ረኺብኪ ኢኺ እሞ ኣይትፍርሒ።`,
    "tigrinya_phonetic": `itī mel'akh ke'a “'o maryam;
'ab ḳdmī 'igzī'abhér moges rekhībkī 'īkhī 'imo 'aytfrḥī.`,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary.
Luke 1:31`,
    "chapter": `Angels`,
    "stanza": `2`,
    "english": `And behold, you will conceive in your womb and bring forth a Son, and shall call His name Jesus.`,
    "geez_script": `ወናሁ ትፀንሲ ወትወልዲ ወልደ ወትሰምዪዮ ስሞ ኢየሱስ።`,
    "geez_phonetic": `wenahu ttsensī wetweldī welde wetsemyīyo smo 'īyesus.`,
    "amharic_script": `እነሆ፥ ትፀንሻለሽ፤
ወንድ ልጅንም ትወልጃለሽ፤ ስሙንም ኢየሱስ ትይዋለሽ።`,
    "amharic_phonetic": `ineho; ttsenshalesh: wend ljnm tweljalesh: smunm 'īyesus tywalesh.`,
    "tigrinya_script": `እንሆ ኽትጠንሲ፥ ወዲውን ክትወልዲ ኢኺ፤
ስሙ ድማ ኢየሱስ ክትብልዮ ኢኺ።`,
    "tigrinya_phonetic": `inho khtṭensī; wedīwn ktweldī 'īkhī: smu dma 'īyesus ktblyo 'īkhī.`,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary.
Luke 1:32`,
    "chapter": `Angels`,
    "stanza": `2`,
    "english": `He will be great, and will be called the Son of the Highest; and the Lord God will give Him the throne of His father David.`,
    "geez_script": `ውእቱ ዐቢይ ወይትሰመይ ወልደ እግዚአብሔር ልዑል።
ወይሁቦ እግዚአብሔር አምላክ መንበረ ዳዊት አቡሁ።`,
    "geez_phonetic": `w'itu 'abīy weytsemey welde 'igzī'abḥér l'ul. weyhubo 'igzī'abḥér 'amlak menbere dawīt 'abuhu.`,
    "amharic_script": `እርሱም ታላቅ ነው፤
የልዑል እግዚአብሔር ልጅም ይባላል፤ እግዚአብሔር አምላክም የአባቱን የዳዊትን ዙፋን ይሰጠዋል።`,
    "amharic_phonetic": `irsum talaḳ new: yel'ul 'igzī'abḥér ljm ybalal: 'igzī'abḥér 'amlakm ye'abatun yedawītn zufan yseṭewal.`,
    "tigrinya_script": `ንሱ ዓብዪ ክኸውን፥ ወዲ ልዑል እግዚኣብሄርውን ክብሃል እዩ።
እግዚኣብሄር ኣምላኽ ድማ፥ ዙፋን ኣቦኡ ዳዊት ክህቦ እዩ።`,
    "tigrinya_phonetic": `nsu 'abyī kkhewn; wedī l'ul 'igzī'abhérwn kbhal 'iyu. 'igzī'abhér 'amlakh dma;
zufan 'abo'u dawīt khbo 'iyu.`,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary. Luke 1:33`,
    "chapter": `Angels`,
    "stanza": `2`,
    "english": `And He will reign over the house of Jacob forever, and of His kingdom there will be no end.”`,
    "geez_script": `ወይነግሥ ለቤተ ያዕቆብ ለዓለም ወአልቦ ማኅለቅት ለመንግሥቱ።`,
    "geez_phonetic": `weynegs lebéte ya'iḳob le'alem we'albo mahleḳt lemengstu.`,
    "amharic_script": `ለያዕቆብ ወገንም ለዘለዓለሙ ይነግሣል፤ ለመንግሥቱም ፍጻሜ የለውም።”`,
    "amharic_phonetic": `leya'iḳob wegenm lezele'alemu ynegsal: lemengstum ftsamé yelewm.”`,
    "tigrinya_script": `ንሱ ኣብ ቤት ያእቆብ ንዘለኣለም ክነግስ እዩ። ንመንግስቱውን መወዳእታ የብሉን” በላ።`,
    "tigrinya_phonetic": `nsu 'ab bét ya'iḳob nzele'alem knegs 'iyu.
nmengstuwn meweda'ita yeblun” bela.`,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary. Luke 1:34; Matthew 1:24-25`,
    "chapter": `Angels`,
    "stanza": `2`,
    "english": `Then Mary said to the angel, “How can this be, since I do not know a man?”`,
    "geez_script": `ትቤሎ ማርያም ለመልአክ እፎኑ ይከውነኒ ዝንቱ እንዘ ኢየአምር ብእሴ።`,
    "geez_phonetic": `tbélo maryam lemel'ak 'ifonu ykewnenī zntu 'inze 'īye'amr b'isé.`,
    "amharic_script": `ማርያምም መልአኩን፥ “ወንድ ስለማላውቅ ይህ እንዴት ይሆንልኛል?”
አለችው።`,
    "amharic_phonetic": `maryamm mel'akun; “wend slemalawḳ yh 'indét yhonlñal?” 'alechw.`,
    "tigrinya_script": `ማርያም ድማ ነቲ መልኣኽ፥ “ኣነ ሰብኣይ ኣይፈልጥን፤ እዝ ነገር እዙይ ከመይ ኢሉ ይኸውን?”
በለቶ።`,
    "tigrinya_phonetic": `maryam dma netī mel'akh; “'ane seb'ay 'ayfelṭn: 'iz neger 'izuy kemey 'īlu ykhewn?”
beleto.`,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary. Luke 1:35; Matthew 1:20`,
    "chapter": `Angels`,
    "stanza": `2`,
    "english": `And the angel answered and said to her, “The Holy Spirit will come upon you, and the power of the Highest will overshadow you;`,
    "geez_script": `አውሥኦ መልአክ ወይቤላ መንፈስ እግዚአብሔር ቅዱስ ይመጽእ ልዕሌኪ ወኃይለ ልዑል ይጸልለኪ።`,
    "geez_phonetic": `aws'o mel'ak weybéla menfes 'igzī'abḥér ḳdus ymets'i l'ilékī wehayle l'ul ytsellekī.`,
    "amharic_script": `መልአኩም መልሶ እንዲህ አላት፥ “መንፈስ ቅዱስ ያድርብሻል፤ የልዑል ኀይልም ይጋርድሻል፤`,
    "amharic_phonetic": `mel'akum melso 'indīh 'alat; “menfes ḳdus yadrbshal: yel'ul haylm ygardshal:`,
    "tigrinya_script": `እቲ መልኣኽ መሊሱ ኸምዙይ በለ፦ “መንፈስ ቅዱስ ናባኺ ኽመፅእ እዩ፤ ሓይሊ ልዑል እግዚኣብሄርውን ከፅልለልኪ እዩ፤`,
    "tigrinya_phonetic": `itī mel'akh melīsu khemzuy bele: “menfes ḳdus nabakhī khmets'i 'iyu: ḥaylī l'ul 'igzī'abhérwn ketsllelkī 'iyu:`,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary. 
Luke 1:35; Hebrews 1:2,8`,
    "chapter": `Angels`,
    "stanza": `2`,
    "english": `therefore, also, that Holy One who is to be born will be called the Son of God.`,
    "geez_script": `ዘኒ ይትወለድ እምኔኪ ቅዱስ ውእቱ ወይሰመይ ወልደ እግዚአብሔር ልዑል።`,
    "geez_phonetic": `zenī ytweled 'imnékī ḳdus w'itu weysemey welde 'igzī'abḥér l'ul.`,
    "amharic_script": `ከአንቺ የሚወለደውም ቅዱስ ነው፤
የልዑል እግዚአብሔር ልጅም ይባላል።`,
    "amharic_phonetic": `ke'anchī yemīweledewm ḳdus new: yel'ul 'igzī'abḥér ljm ybalal.`,
    "tigrinya_script": `ስለዙይ እቲ ኻባኺ ዝውለድ ቅዱስ እዩ፤
ወዲ እግዚኣብሄርውን ክብሃል እዩ።`,
    "tigrinya_phonetic": `slezuy 'itī khabakhī zwled ḳdus 'iyu: wedī 'igzī'abhérwn kbhal 'iyu.`,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary.
Luke 1:36;`,
    "chapter": `Angels`,
    "stanza": `2`,
    "english": `Now indeed, Elizabeth your relative has also conceived a son in her old age and in her elderliness.; and this is now the sixth month for her who was called barren.`,
    "geez_script": `ወናሁ ኤልሳቤጥኒ እንተ እምአዝማድኪ ይእቲ ፀንሰት ወረከበት ወልደ በልኅቃቲሃ ወበርሥዐቲሃ።
ወናሁ ሳድስ ዝንቱ ወርኅ ለእንተ ይብልዋ መካን`,
    "geez_phonetic": `wenahu 'élsabéṭnī 'inte 'im'azmadkī y'itī tsenset werekebet welde belhḳatīha webers'atīha.
wenahu sads zntu werh le'inte yblwa mekan`,
    "amharic_script": `እነሆ፥ ከዘመዶችሽ ወገን የምትሆን ኤልሣቤጥም እርስዋ እንኳ በእርጅናዋ ወንድ ልጅን ፀንሳለች፤
መካን ትባል የነበረችው ከፀነሰች እነሆ፥ ይህ ስድስተኛ ወር ነው።`,
    "amharic_phonetic": `ineho; kezemedochsh wegen yemthon 'élsabéṭm 'irswa 'inkwa be'irjnawa wend ljn tsensalech: mekan tbal yeneberechw ketsenesech 'ineho;
yh sdsteña wer new.`,
    "tigrinya_script": `እንሆ እታ ዘመድኪ ኤልሳቤጥ እኳ፥ ኣብ እርጋና ወዲ ጠኒሳ ኣላ፤
እታ መኻን ዝተብሃለት እዙይ ሻድሻይ ወርሓ እዩ፤`,
    "tigrinya_phonetic": `inho 'ita zemedkī 'élsabéṭ 'ikwa;
'ab 'irgana wedī ṭenīsa 'ala: 'ita mekhan ztebhalet 'izuy shadshay werḥa 'iyu:`,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary. Luke 1:37; Genesis 18:14;
Jeremiah 32:17`,
    "chapter": `Angels`,
    "stanza": `2`,
    "english": `For with God nothing will be impossible.”`,
    "geez_script": `እስመ አልቦ ነገር ዘይሰአኖ ለእግዚአብሔር።`,
    "geez_phonetic": `isme 'albo neger zeyse'ano le'igzī'abḥér.`,
    "amharic_script": `ለእግዚአብሔር የሚሳነው ነገር የለምና”።`,
    "amharic_phonetic": `le'igzī'abḥér yemīsanew neger yelemna”.`,
    "tigrinya_script": `ንእግዚኣብሄር ዝሰኣኖ ነገር የለንሞ।”`,
    "tigrinya_phonetic": `n'igzī'abhér zse'ano neger yelenmo.”,`,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary. Luke 1:38`,
    "chapter": `Angels`,
    "stanza": `2`,
    "english": `Then Mary said, “Behold the maidservant of the Lord! Let it be to me according to your word.”`,
    "geez_script": `ትቤሎ ማርያም ለመልአክ ነየ አመተ ለእግዚአብሔር ይኩነኒ በከመ ትቤለኒ።`,
    "geez_phonetic": `tbélo maryam lemel'ak neye 'amete le'igzī'abḥér ykunenī bekeme tbélenī.`,
    "amharic_script": `ማርያምም መልአኩን፥ “እነሆኝ፥ የእግዚአብሔር ባሪያው አለሁ፤
እንደ ቃልህ ይሁንልኝ” አለችው፤`,
    "amharic_phonetic": `maryamm mel'akun; “'inehoñ; ye'igzī'abḥér barīyaw 'alehu: 'inde ḳalh yhunlñ” 'alechw:`,
    "tigrinya_script": `ማርያም ድማ “እኒሀኹ፥ ኣነ ባርያ እግዚኣብሄር እየ፤
ከምቲ ዝበልካኒ ይኹነለይ” በለቶ።`,
    "tigrinya_phonetic": `maryam dma “'inīhakhu; 'ane barya 'igzī'abhér 'iye: kemtī zbelkanī ykhuneley” beleto.`,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: The angel said to her:
፨
People: peace to you.`,
    "geez_script": `መሪሕ፤ ይቤላ መልአክ
፨ ሕዝብ፤ ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: ybéla mel'ak
፨
ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ መልአኩ ገብርኤል ማርያም ድንግል ላንቺ ክብር ምስጋና ይገባሻል አላት።
፨ ሕዝብ፤
ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, mel'aku gebr'él maryam dngl lanchī kbr msgana ygebashal 'alat.
፨
ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: Gabriel said to her
፨ People: peace to you.`,
    "geez_script": `መሪሕ፤ ይቤላ ገብርኤል
፨ ሕዝብ፤
ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: ybéla gebr'él
፨ ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ 
፨ ሕዝብ፤ ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, 
፨
ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: Mary the Virgin,
፨ People: peace to you.`,
    "geez_script": `መሪሕ፤ ማርያም ድንግል
፨ ሕዝብ፤
ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: maryam dngl
፨ ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ ማርያም ድንግል
፨ ሕዝብ፤ ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, maryam dngl
፨
ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: The Bearer of God,
፨ People: peace to you.`,
    "geez_script": `መሪሕ፤ ወላዲተ አምላክ
፨ ሕዝብ፤
ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: weladīte 'amlak
፨ ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ ወላዲተ አምላክ
፨ ሕዝብ፤ ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, weladīte 'amlak
፨
ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: Mary, the holy one,
፨ People: peace to you.`,
    "geez_script": `መሪሕ፤ ማርያም ቅድስት
፨ ሕዝብ፤
ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: maryam ḳdst
፨ ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ ቅድስት ነሽና
፨ ሕዝብ፤ ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, ḳdst neshna
፨
ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: Mary, the praised,
፨ People: peace to you.`,
    "geez_script": `መሪሕ፤ ማርያም ውድስት
፨ ሕዝብ፤
ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: maryam wdst
፨ ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ 
፨ ሕዝብ፤ ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, 
፨
ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: Mary, the pure,
፨ People: peace to you.`,
    "geez_script": `መሪሕ፤ ማርያም ንጽሕት
፨ ሕዝብ፤
ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: maryam ntsḥt
፨ ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ 
፨ ሕዝብ፤ ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, 
፨
ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: Mary, the joyous,
፨ People: peace to you.`,
    "geez_script": `መሪሕ፤ ማርያም ፍሥሕት
፨ ሕዝብ፤
ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: maryam fsḥt
፨ ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ 
፨ ሕዝብ፤ ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, 
፨
ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: Mary, the beatific,
፨ People: peace to you.`,
    "geez_script": `መሪሕ፤ ማርያም ብፅዕት
፨ ሕዝብ፤
ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: maryam bts'it
፨ ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ 
፨ ሕዝብ፤ ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, 
፨
ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: Mary, the blessed,
፨ People: peace to you.`,
    "geez_script": `መሪሕ፤ ማርያም ቡርክት
፨ ሕዝብ፤
ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: maryam burkt
፨ ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ 
፨ ሕዝብ፤ ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, 
፨
ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: The dwelling place of the Godhead,
፨ People: peace to you.`,
    "geez_script": `መሪሕ፤ ማኅደረ መለኮት
፨
ሕዝብ፤ ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: mahdere melekot
፨ ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ የመለኮት ማደሪያ ነሽና
፨ ሕዝብ፤ ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, yemelekot maderīya neshna
፨
ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: The perfect Tabernacle,
፨ People: peace to you.`,
    "geez_script": `መሪሕ፤ ደብተራ ፍጽምት
፨ ሕዝብ፤
ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: debtera ftsmt
፨ ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ የተሸለምሽ ድንኳን ነሽና
፨ ሕዝብ፤ ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, yeteshelemsh dnkwan neshna
፨
ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: Sister of the angels,
፨ People: peace to you.`,
    "geez_script": `መሪሕ፤ እኅተ መላእክት
፨ ሕዝብ፤
ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: 'ihte mela'ikt
፨ ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ የመላእክት እኅት ነሽና
፨ ሕዝብ፤ ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, yemela'ikt 'iht neshna
፨
ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: And mother of all people,
፨ People: peace to you.`,
    "geez_script": `መሪሕ፤ ወእመ ኵሉ ሕዝብ
፨
ሕዝብ፤ ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: we'ime kwlu ḥzb
፨ ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ የሕዝቡ ሁሉ እናት ነሽና
፨ ሕዝብ፤
ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, yeḥzbu hulu 'inat neshna
፨ ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: Our Lady Mary,
፨
People: peace to you.`,
    "geez_script": `መሪሕ፤ እግዝእትነ ማርያም
፨ ሕዝብ፤ ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: 'igz'itne maryam
፨ ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ የሁሉ እመቤት ማርያም
፨ ሕዝብ፤
ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, yehulu 'imebét maryam
፨ ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: Peaceful one,
፨
People: peace to you.`,
    "geez_script": `መሪሕ፤ ሰላማዊት
፨ ሕዝብ፤ ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: selamawīt
፨ ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ የሁሉ ሰላም ማርያም
፨ ሕዝብ፤
ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, yehulu selam maryam
፨ ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: The Most High sanctified you as His dwelling place.
፨ People: Peace to you.`,
    "geez_script": `መሪሕ፤ ቀደሰኪ ለማኅደሩ ልዑል
፨ ሕዝብ፤ ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: ḳedesekī lemahderu l'ul
፨ ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ 
፨ ሕዝብ፤
ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, 
፨ ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: He favored you and chose you to become a dwelling place for Him.
፨ People: Peace to you.`,
    "geez_script": `መሪሕ፤ አብደረኪ ወኅረየኪ ከመ ትኩኒዮ ማኅደሮ
፨ ሕዝብ፤ ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: 'abderekī wehreyekī keme tkunīyo mahdero
፨
ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ ልዑል ማደሪያው ትሆኝ ዘንድ መርጦሻልና
፨ ሕዝብ፤ ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, l'ul maderīyaw thoñ zend merṭoshalna
፨
ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: You are clothed and embellished in gold garment.
፨
People: Peace to you.`,
    "geez_script": `መሪሕ፤ በአልባሰ ወርቅ ዑፅፍት ወኁብርት
፨ ሕዝብ፤ ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: be'albase werḳ 'utsft wehubrt
፨ ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ በወርቅ የተሸለምሽ
፨
ሕዝብ፤ ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, bewerḳ yeteshelemsh
፨ ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: You have a dove's wings fashioned with silver.
፨ People: Peace to you.`,
    "geez_script": `መሪሕ፤ ክነፈ ርግብ በብሩር ዘግቡር
፨ ሕዝብ፤ ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: knefe rgb bebrur zegbur
፨
ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ የርግብ ክንፍ በብር ያጌጥሽ
፨ ሕዝብ፤ ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, yergb knf bebr yagéṭsh
፨
ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: And your waist is adorned with greenish gold, Mary, the embellished,
፨
People: Peace to you.`,
    "geez_script": `መሪሕ፤ ወገበዋቲሃኒ በሐመልማለ ወርቅ ማርያም ሥርጉት
፨ ሕዝብ፤ ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: wegebewatīhanī beḥamelmale werḳ maryam srgut
፨
ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ ጎኖችሽ በወርቅ አመልማሎ የተሸለሙ 
፨ ሕዝብ፤ ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, gonochsh bewerḳ 'amelmalo yeteshelemu 
፨
ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: The gate of the East and the Mother of Light,
፨
People: Peace to you.`,
    "geez_script": `መሪሕ፤ ኆኅተ ምሥራቅ ወእሙ ለብርሃን
፨ ሕዝብ፤ ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: hohte msraḳ we'imu lebrhan
፨
ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ የምሥራቅ ደጃፍ የብርሃን እናቱ
፨ ሕዝብ፤ ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, yemsraḳ dejaf yebrhan 'inatu
፨
ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: You shine brighter than the sun and you are higher than the mountains.
፨ People: Peace to you.`,
    "geez_script": `መሪሕ፤ ትበርሂ እምፀሐይ ወትትሌዐሊ እምአድባር
፨ ሕዝብ፤ ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: tberhī 'imtseḥay wettlé'alī 'im'adbar
፨
ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ ከፀሐይ ሰባት እጅ የምታበሪ ክብርሽ ከአድባራቱ ሁሉ ከፍ ከፍ ያለ
፨ ሕዝብ፤
ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, ketseḥay sebat 'ij yemtaberī kbrsh ke'adbaratu hulu kef kef yale
፨
ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Leader: Mary, the chosen and honored one,
፨ People: Peace to you.`,
    "geez_script": `መሪሕ፤
ማርያም ኅሪት ወክብርት
፨ ሕዝብ፤ ሰላም ለኪ።`,
    "geez_phonetic": `merīḥ: maryam hrīt wekbrt
፨ ḥzb: selam lekī.`,
    "amharic_script": `መሪ፣ ማርያም ሆይ ከተመረጡ የተመረጥሽ ከተከበሩ የተከበርሽ
፨ ሕዝብ፤
ላንቺ ክብር ምስጋና ይገባሻል።`,
    "amharic_phonetic": `merī, maryam hoy ketemereṭu yetemereṭsh ketekeberu yetekebersh
፨
ḥzb: lanchī kbr msgana ygebashal.`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `Plead for us to our Lord and Savior Jesus Christ, so that He may save us when He comes in the glory of His Father with His holy angels.`,
    "geez_script": `ሰአሊ ለነ ኅበ እግዚእነ ወመድኃኒነ ኢየሱስ ክርስቶስ። ከመ ያድኅነነ አመ ይመጽእ በስብሐተ አቡሁ ምስለ መላእክቲሁ ቅዱሳን።`,
    "geez_phonetic": `se'alī lene hbe 'igzī'ine wemedhanīne 'īyesus krstos. keme yadhnene 'ame ymets'i besbḥate 'abuhu msle mela'iktīhu ḳdusan.`,
    "amharic_script": `ከጌታችን ከመድኃኒታችን ከኢየሱስ ክርስቶስ ዘንድ ለምኝልን ያድነን ዘንድ ከአባቱ ምስጋና ከቅዱሳን መላእክቶቹ ጋር በመጣ ጊዜ`,
    "amharic_phonetic": `kegétachn kemedhanītachn ke'īyesus krstos zend lemñln yadnen zend ke'abatu msgana keḳdusan mela'iktochu gar bemeṭa gīzé`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `When He places the 
sheep on His right and the goats on His left,`,
    "geez_script": `አመ ያቀውም አባግዐ በየማኑ ወአጣሌ በፀጋሙ፥`,
    "geez_phonetic": `ame yaḳewm 'abag'a beyemanu we'aṭalé betsegamu;`,
    "amharic_script": `ጻድቅንን በቀኙ ኃጥአንን በግራው ባቆመ ጊዜ`,
    "amharic_phonetic": `tsadḳnn beḳeñu haṭ'ann begraw baḳome gīzé`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `may He place us on His right with Saint Stephen the Martyr, Saint John the Baptist, and all of the saints and martyrs to the age of ages, Amen.`,
    "geez_script": `ያቁመነ በየማኑ ምስለ እስጢፋኖስ ሰማዕት ወዮሐንስ መጥምቅ።
ወምስለ ኵሎሙ ቅዱሳን ወሰማዕት ለዓለመ ዓለም። አሜን።`,
    "geez_phonetic": `yaḳumene beyemanu msle 'isṭīfanos sema'it weyoḥans meṭmḳ. wemsle kwlomu ḳdusan wesema'it le'aleme 'alem.
'amén.`,
    "amharic_script": `እኛን ከሰማዕት እንጢፋኖስ ከመጥምቁ ዮሐንስ እና ከሁሉ ቅዱሳን ከሰማዕታትም ጋር ያቆመን ዘንድ ለምኝልን ለዓለመ ዓለም አሜን፤`,
    "amharic_phonetic": `iñan kesema'it 'inṭīfanos kemeṭmḳu yoḥans 'ina kehulu ḳdusan kesema'itatm gar yaḳomen zend lemñln le'aleme 'alem 'amén:`,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `May the prayers of Mary and her intercession save us from the wrath of her Son.`,
    "geez_script": `ጸሎታ ለማርያም ወስእለታ ያድኅነነ እመዓተ ወልዳ`,
    "geez_phonetic": `tselota lemaryam wes'ileta yadhnene 'ime'ate welda`,
    "amharic_script": ``,
    "amharic_phonetic": ``,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `May the prayers of Mary and her intercession save Patriarch {{PATRIARCH NAME}} from the wrath of her Son.`,
    "geez_script": `ጸሎታ ለማርያም ወስእለታ ለርእሰ ሊቃነ ጳጳሳት አባ {{PATRIARCH NAME}} ይዕቀቦ እመዓተ ወልዳ`,
    "geez_phonetic": `tselota lemaryam wes'ileta ler'ise līḳane p̣ap̣asat 'aba {{PATRIARCH NAME}} y'iḳebo 'ime'ate 
welda`,
    "amharic_script": ``,
    "amharic_phonetic": ``,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `May the prayers of Mary and her intercession save Bishop {{BISHOP NAME}} from the wrath of her Son.`,
    "geez_script": `ጸሎታ ለማርያም ወስእለታ ለጳጳስነ አባ {{BISHOP NAME}} ይዕቀቦ እመዓተ ወልዳ።`,
    "geez_phonetic": `tselota lemaryam wes'ileta lep̣ap̣asne 'aba {{BISHOP NAME}} y'iḳebo 'ime'ate welda.`,
    "amharic_script": ``,
    "amharic_phonetic": ``,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `May the prayers of Mary and her intercession save the lover of God, the head of state, {{Leader / President / Emperor}}, from the wrath of her Son.`,
    "geez_script": `ጸሎታ ለማርያም ወስእለታ ለመፍቅሬ አምላክ {{Leader / President / Emperor}} ይዕቀቦ እመዓተ ወልዳ።`,
    "geez_phonetic": `tselota lemaryam wes'ileta lemefḳré 'amlak {{Leader / President / Emperor}} y'iḳebo 'ime'ate welda.`,
    "amharic_script": ``,
    "amharic_phonetic": ``,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `May the prayers of Mary 
and her intercession save {{Servant's Names}}, and all Christian people from the wrath of her Son.`,
    "geez_script": `ጸሎታ ለማርያም ወስእለታ ለደብርነ {{Servant's Names}} ይዕቀባ እመዓተ ወልዳ።`,
    "geez_phonetic": `tselota lemaryam wes'ileta ledebrne {{Servant's Names}} y'iḳeba 'ime'ate welda.`,
    "amharic_script": ``,
    "amharic_phonetic": ``,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `May the prayers of Mary and her intercession save our country, {{COUNTRY}}, from the wrath of her Son.`,
    "geez_script": `ጸሎታ ለማርያም ወስእለታ ለሃገሪትነ ኤርትራ ወለዛቲ ሃገር {{COUNTRY}} ይዕቀባ እመዓተ ወልዳ።`,
    "geez_phonetic": `tselota lemaryam wes'ileta lehagerītne 'értra welezatī hager {{COUNTRY}} y'iḳeba 'ime'ate welda.`,
    "amharic_script": ``,
    "amharic_phonetic": ``,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
  {
    "instruction": ``,
    "reference": `The Angels Praise Mary`,
    "chapter": `Angels`,
    "stanza": `3`,
    "english": `May the prayers of Mary and her intercession save us from the wrath of her Son.`,
    "geez_script": `ጸሎታ ለማርያም ወስእለታ ያድኅነነ እመዓተ ወልዳ።`,
    "geez_phonetic": `tselota lemaryam wes'ileta yadhnene 'ime'ate welda.`,
    "amharic_script": ``,
    "amharic_phonetic": ``,
    "tigrinya_script": ``,
    "tigrinya_phonetic": ``,
    "spanish": ``
  },
    {
        "instruction": "",
        "reference": "Intro to praying the Psalms of David",
        "chapter": "Psalms",
        "stanza": "Intro",
        "english": "Come to me, David, King of Israel, master of the Psalm, beautiful and sweet in speech;",
        "geez_script": "ነዓ ኀቤየ ዳዊት ንጉሠ እሥራኤል፣ በዓለ መዝሙር ሠናየ ወጥዑመ ቃል፣",
        "geez_phonetic": "ne'a habéye dawīt nguse 'isra'él, be'ale mezmur senaye weṭ'ume ḳal,",
        "amharic_script": "",
        "amharic_phonetic": "",
        "tigrinya_script": "",
        "tigrinya_phonetic": "",
        "spanish": ""
    },
    {
        "instruction": "",
        "reference": "Intro to praying the Psalms of David",
        "chapter": "Psalms",
        "stanza": "Intro",
        "english": "teach me the story and the interpretation of all parables,",
        "geez_script": "ታለብዎኒ ነገረ ወፍካሬ ኵሉ አምሳል፣",
        "geez_phonetic": "talebwonī negere wefkaré kwlu 'amsal,",
        "amharic_script": "",
        "amharic_phonetic": "",
        "tigrinya_script": "",
        "tigrinya_phonetic": "",
        "spanish": ""
    },
    {
        "instruction": "",
        "reference": "Intro to praying the Psalms of David",
        "chapter": "Psalms",
        "stanza": "Intro",
        "english": "so that I may praise the Most High God and the Virgin Mary, while I cry out and say:",
        "geez_script": "ከመ እሰብሖ ለእግዚአብሔር ልዑል ወከመ እወድሳ ለማርያም ድንግል፣ እንዘ እጸርሕ ወእብል።",
        "geez_phonetic": "keme 'isebḥo le'igzī'abḥér l'ul wekeme 'iwedsa lemaryam dngl, 'inze 'itserḥ we'ibl.",
        "amharic_script": "",
        "amharic_phonetic": "",
        "tigrinya_script": "",
        "tigrinya_phonetic": "",
        "spanish": ""
    },
    {
        "instruction": "",
        "reference": "Intro to praying the Psalms of David",
        "chapter": "Psalms",
        "stanza": "Intro",
        "english": "Glory to the Father, and to the Son, and to the Holy Spirit, forever and to the age of ages.",
        "geez_script": "ስብሐት ለአብ ወወልድ ወመንፈስ ቅዱስ ለዓለም ወለዓለመ ዓለም።",
        "geez_phonetic": "sbḥat le'ab weweld wemenfes ḳdus le'alem wele'aleme 'alem.",
        "amharic_script": "",
        "amharic_phonetic": "",
        "tigrinya_script": "",
        "tigrinya_phonetic": "",
        "spanish": ""
    },

    // Here is where the application logic should insert the selected Psalms.
    // If no Psalms are selected then the prayers for the intro and conclusion should be removed.
    // After each Psalm there must be the short doxology (I've labelled it as "Psalms-Response")

    {
        "instruction": "This short doxology is recited after the completion of each Psalm.",
        "reference": "Conclusion/response to praying each Psalm of David",
        "chapter": "Psalms",
        "stanza": "Response",
        "english": "Glory to the Father, and to the Son, and to the Holy Spirit, forever and to the age of ages.",
        "geez_script": "ስብሐት ለአብ ወወልድ ወመንፈስ ቅዱስ ለዓለም ወለዓለመ ዓለም።",
        "geez_phonetic": "sbḥat le'ab weweld wemenfes ḳdus le'alem wele'aleme 'alem.",
        "amharic_script": "",
        "amharic_phonetic": "",
        "tigrinya_script": "",
        "tigrinya_phonetic": "",
        "spanish": ""
    },
    {
        "instruction": "",
        "reference": "Conclusion to praying the Psalms of David",
        "chapter": "Psalms",
        "stanza": "Closing",
        "english": "Ask for us, Mary, for the mercy of your Son, may He watch over us from the Seventh Heaven (Aryam).",
        "geez_script": "ሰአሊ ለነ ማርያም፤ ምሕረተ ወልድኪ፥ የሐውጸነ እምአርያም",
        "geez_phonetic": "se'alī lene maryam: mḥrete weldkī; yeḥawtsene 'im'aryam",
        "amharic_script": "",
        "amharic_phonetic": "",
        "tigrinya_script": "",
        "tigrinya_phonetic": "",
        "spanish": ""
    },
    {
        "instruction": "",
        "reference": "Conclusion to praying the Psalms of David",
        "chapter": "Psalms",
        "stanza": "Closing",
        "english": "Ask for us, David, in front of the throne of the Lord of Hosts.",
        "geez_script": "ሰአል ለነ ዳዊት ቅድመ መንበሩ ለጸባኦት።",
        "geez_phonetic": "se'al lene dawīt ḳdme menberu letseba'ot.",
        "amharic_script": "",
        "amharic_phonetic": "",
        "tigrinya_script": "",
        "tigrinya_phonetic": "",
        "spanish": ""
    },
    {
        "instruction": "",
        "reference": "Conclusion to praying the Psalms of David",
        "chapter": "Psalms",
        "stanza": "Closing",
        "english": "O God of David, protect our lives and forgive our sins.",
        "geez_script": "ኦ አምላከ ዳዊት እቀብ ሕይወተነ ወሥረይ ኃጢአተነ።",
        "geez_phonetic": "o 'amlake dawīt 'iḳeb ḥywetene wesrey haṭī'atene.",
        "amharic_script": "",
        "amharic_phonetic": "",
        "tigrinya_script": "",
        "tigrinya_phonetic": "",
        "spanish": ""
    },
    {
        "instruction": "",
        "reference": "Conclusion to praying the Psalms of David",
        "chapter": "Psalms",
        "stanza": "Closing",
        "english": "Deliver us from the evil day, and rescue us from all temptation.",
        "geez_script": "አድኅነነ እም ዕለተ እኪት ወባልሐነ እምኵሉ መንሱት።",
        "geez_phonetic": "adhnene 'im 'ilete 'ikīt webalḥane 'imkwlu mensut.",
        "amharic_script": "",
        "amharic_phonetic": "",
        "tigrinya_script": "",
        "tigrinya_phonetic": "",
        "spanish": ""
    },
    {
        "instruction": "",
        "reference": "Conclusion to praying the Psalms of David",
        "chapter": "Psalms",
        "stanza": "Closing",
        "english": "For those who birthed us in the flesh, and for those who raised us in grace,",
        "geez_script": "ለእለ ወለዱነ በሥጋ ወለእለ ሐሠዩነ በጸጋ፣",
        "geez_phonetic": "le'ile weledune besga wele'ile ḥaseyune betsega,",
        "amharic_script": "",
        "amharic_phonetic": "",
        "tigrinya_script": "",
        "tigrinya_phonetic": "",
        "spanish": ""
    },
    {
        "instruction": "",
        "reference": "Conclusion to praying the Psalms of David",
        "chapter": "Psalms",
        "stanza": "Closing",
        "english": "and for those who taught us and instructed us in the word of faith,",
        "geez_script": "ወለእለ አስተምሀሩነ ወለእለ መሀሩነ ቃለ ሃይማኖት፣",
        "geez_phonetic": "wele'ile 'astemharune wele'ile meharune ḳale haymanot,",
        "amharic_script": "",
        "amharic_phonetic": "",
        "tigrinya_script": "",
        "tigrinya_phonetic": "",
        "spanish": ""
    },
    {
        "instruction": "",
        "reference": "Conclusion to praying the Psalms of David",
        "chapter": "Psalms",
        "stanza": "Closing",
        "english": "(...) have mercy on them, God, in the Kingdom of Heaven,",
        "geez_script": "(...) መሐሮሙ እግዚአብሔር በመንግሥተ ሰማያት",
        "geez_phonetic": "(...) meḥaromu 'igzī'abḥér bemengste semayat",
        "amharic_script": "",
        "amharic_phonetic": "",
        "tigrinya_script": "",
        "tigrinya_phonetic": "",
        "spanish": ""
    },
    {
        "instruction": "",
        "reference": "Conclusion to praying the Psalms of David",
        "chapter": "Psalms",
        "stanza": "Closing",
        "english": "(and also) for me, for Your servants and for Your maidservants, {{Servant's Names}},",
        "geez_script": "ሊተ፣ ለአግበርቲከ ወለአእማቲከ {እገሌ፣ እገሊት}",
        "geez_phonetic": "līte, le'agbertīke wele'a'imatīke {'igelé, 'igelīt}",
        "amharic_script": "",
        "amharic_phonetic": "",
        "tigrinya_script": "",
        "tigrinya_phonetic": "",
        "spanish": ""
    },
    {
        "instruction": "",
        "reference": "Conclusion to praying the Psalms of David",
        "chapter": "Psalms",
        "stanza": "Closing",
        "english": "forever and to the age of ages. Amen.",
        "geez_script": "ለዓለም ወለዓለመ ዓለም። አሜን።",
        "geez_phonetic": "le'alem wele'aleme 'alem. 'amén.",
        "amharic_script": "",
        "amharic_phonetic": "",
        "tigrinya_script": "",
        "tigrinya_phonetic": "",
        "spanish": ""
    }
];