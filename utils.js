const settings = require("./settings.js");

const isFreeLive = (liveDiffId) => liveDiffId < 20000000;
const isActiveEventLive = (liveDiffId) => settings.active_event_live_ids.indexOf(Math.floor(liveDiffId / 1000)) !== -1;
const isStoryStage = (liveDiffId) => liveDiffId >= 30000000 && liveDiffId < 40000000;

function songNameRomaji(liveId) {
    if (liveId.length !== 4) liveId = liveId.toString().slice(-4);

    // µ's
    if (liveId === "0001") return "Sore wa Bokutachi no Kiseki";
    if (liveId === "0002") return "START:DASH!!";
    if (liveId === "0014") return "Arashi no Naka no Koi Dakara";
    if (liveId === "0011") return "Snow halation";
    if (liveId === "0016") return "Bokura wa Ima no Naka de";
    if (liveId === "0013") return "Music S.T.A.R.T!!";
    if (liveId === "0008") return "Bokura no LIVE Kimi to no LIFE";
    if (liveId === "0003") return "Natsuiro Egao de 1,2,Jump!";
    if (liveId === "0017") return "HEART to HEART!";
    if (liveId === "0062") return "Yume no Tobira";
    if (liveId === "0037") return "Wonder zone";
    if (liveId === "0012") return "Wonderful Rush";
    if (liveId === "0036") return "No brand girls";
    if (liveId === "0118") return "A song for You! You? You!!";
    if (liveId === "0010") return "LOVELESS WORLD";
    if (liveId === "0060") return "Donna Toki mo Zutto";
    if (liveId === "0071") return "Happy maker!";
    if (liveId === "0077") return "COLORFUL VOICE";
    if (liveId === "0009") return "Angelic Angel";
    if (liveId === "0068") return "KiRa-KiRa Sensation!";
    if (liveId === "0021") return "Mogyutto &quot;love&quot; de Sekkin Chuu!";
    if (liveId === "0089") return "Bokutachi wa Hitotsu no Hikari";
    if (liveId === "0046") return "Takaramonozu";
    if (liveId === "0006") return "Dancing stars on me!";
    if (liveId === "0032") return "Kitto Seishun ga Kikoeru";
    if (liveId === "0023") return "Oh,Love&Peace!";
    if (liveId === "0100") return "MOMENT RING";
    if (liveId === "0121") return "A song for You! You? You!!";
    if (liveId === "0120") return "A song for You! You? You!!";
    if (liveId === "0078") return "SENTIMENTAL StepS";
    if (liveId === "0007") return "LONELIEST BABY";
    if (liveId === "0087") return "SUNNY DAY SONG";
    if (liveId === "0022") return "Aishiteru Banzai!";
    if (liveId === "0005") return "PSYCHIC FIRE";
    if (liveId === "0043") return "Cutie Panther";
    if (liveId === "0038") return "Diamond Princess no Yuutsu";
    if (liveId === "0004") return "Shunjou Romantic";
    if (liveId === "0049") return "Binetsu kara Mystery";
    if (liveId === "0027") return "Shiranai Love*Oshiete Love";
    if (liveId === "0015") return "NO EXIT ORION";
    if (liveId === "0025") return "sweet&sweet holiday";
    if (liveId === "0024") return "Love marginal";
    if (liveId === "0059") return "Someday of my life";
    if (liveId === "0061") return "Arifureta Kanashimi no Hate";
    if (liveId === "0064") return "Blueberry ♡ Train";
    if (liveId === "0067") return "Yuuki no Reason";
    if (liveId === "0070") return "Koi no Signal Rin rin rin!";
    if (liveId === "0066") return "Daring!!";
    if (liveId === "0073") return "Junai Lens";
    if (liveId === "0054") return "Kodoku na Heaven";
    if (liveId === "0076") return "Mahoutsukai Hajimemashita!";

    // Aqours
    if (liveId === "1007") return "Mirai no Bokura wa Shitteru yo";
    if (liveId === "1001") return "Kimi no Kokoro wa Kagayaiteru kai?";
    if (liveId === "1002") return "Aozora Jumping Heart";
    if (liveId === "1014") return "KOKORO Magic “A to Z”";
    if (liveId === "1008") return "HAPPY PARTY TRAIN";
    if (liveId === "1012") return "Thrilling • One Way";
    if (liveId === "1003") return "Step! ZERO to ONE";
    if (liveId === "1011") return "SKY JOURNEY";
    if (liveId === "1078") return "Wake up, Challenger!!";
    if (liveId === "1015") return "Brightest Melody";
    if (liveId === "1009") return "Koi ni Naritai AQUARIUM";
    if (liveId === "1085") return "Fantastic Departure!";
    if (liveId === "1084") return "JIMO-AI Dash!";
    if (liveId === "1013") return "MIRACLE WAVE";
    if (liveId === "1079") return "Mitaiken HORIZON";
    if (liveId === "1049") return "Landing action Yeah!!";
    if (liveId === "1030") return "Jingle Bells ga Tomaranai";
    if (liveId === "1072") return "Hop? Stop? Nonstop!";
    if (liveId === "1017") return "Mattete Ai no Uta";
    if (liveId === "1010") return "MIRAI TICKET";
    if (liveId === "1089") return "smile smile ship Start!";
    if (liveId === "1090") return "Future Flight";
    if (liveId === "1025") return "Mijuku DREAMER";
    if (liveId === "1060") return "WATER BLUE NEW WORLD";
    if (liveId === "1036") return "Humming Friend";
    if (liveId === "1021") return "Daisuki Dattara Daijoubu!";
    if (liveId === "1057") return "MY Mai☆TONIGHT";
    if (liveId === "1022") return "Yume Kataru yori Yume Utaou";
    if (liveId === "1083") return "Jump up HIGH!!";
    if (liveId === "1091") return "Aqours☆HEROES";
    if (liveId === "1016") return "Aqours☆HEROES";
    if (liveId === "1092") return "Nando Datte Yakusoku!";
    if (liveId === "1093") return "BANZAI! digital trippers";
    if (liveId === "1054") return "Kimi no Hitomi o Meguru Bouken";
    if (liveId === "1005") return "Torikoriko PLEASE!!";
    if (liveId === "1082") return "Amazing Travel DNA";
    if (liveId === "1044") return "GALAXY HidE and SeeK";
    if (liveId === "1004") return "Genki Zenkai DAY!DAY!DAY!";
    if (liveId === "1081") return "Braveheart Coaster";
    if (liveId === "1042") return "Kinmirai Happy End";
    if (liveId === "1006") return "Strawberry Trapper";
    if (liveId === "1080") return "New Romantic Sailors";
    if (liveId === "1046") return "Kowareyasuki";
    if (liveId === "1059") return "One More Sunshine Story";
    if (liveId === "1065") return "Pianoforte Monologue";
    if (liveId === "1070") return "Sakana ka Nanda ka?";
    if (liveId === "1096") return "Motto ne!";
    if (liveId === "1067") return "WHITE FIRST LOVE";
    if (liveId === "1097") return "Perfect SEKAI";
    if (liveId === "1066") return "Beginner's Sailing";
    if (liveId === "1098") return "Totsuzen GIRL";
    if (liveId === "1064") return "in this unstable world";
    if (liveId === "1099") return "Tatehoko Tsubasa";
    if (liveId === "1062") return "Oyasuminasan!";
    if (liveId === "1100") return "Akogare Ranraran";
    if (liveId === "1069") return "New winding road";
    if (liveId === "1101") return "Shiny Racers";
    if (liveId === "1068") return "RED GEM WINK";
    if (liveId === "1102") return "Cotton Candy Ei Ei Oh!";
    if (liveId === "1103") return "DREAMY COLOR";

    // Nijigaku
    if (liveId === "2001") return "TOKIMEKI Runners";
    if (liveId === "2020") return "Love U my friends (2D)";
    if (liveId === "2034") return "TOKIMEKI Runners (Chapter 17 Ver.)";
    if (liveId === "2053") return "Just Believe!!!";
    if (liveId === "2040") return "Nijiiro Passions!";
    if (liveId === "2041") return "NEO SKY, NEO MAP!";
    if (liveId === "2051") return "Yume ga Koko Kara Hajimaru yo";
    if (liveId === "2037") return "Love U my friends";
    if (liveId === "2057") return "Nijiiro Passions!";
    if (liveId === "2058") return "NEO SKY, NEO MAP!";
    if (liveId === "2059") return "Yume ga Koko Kara Hajimaru yo";
    if (liveId === "2061") return "Mirai Harmony";
    if (liveId === "2062") return "Sweet Eyes";
    if (liveId === "2063") return "Zensoku Dreamer";
    if (liveId === "2060") return "Just Believe!!!";
    if (liveId === "2074") return "L!L!L! (Love the Life We Live)";
    if (liveId === "2073") return "Hurray Hurray";
    if (liveId === "2096") return "Just Believe!!! (12 Member Ver.)";
    if (liveId === "2109") return "Just Believe!!! (12 Member Ver.)";
    if (liveId === "2099") return "Colorful Dreams! Colorful Smiles!";
    if (liveId === "2100") return "Yume ga Bokura no Taiyou sa";
    if (liveId === "2108") return "Future Parade";
    if (liveId === "2110") return "Miracle STAY TUNE! (Ver. 1)";
    if (liveId === "2121") return "Miracle STAY TUNE! (Ver. 2)";
    if (liveId === "2097") return "Eien no Isshun";
    if (liveId === "2111") return "Twilight";
    if (liveId === "2112") return "Ryouran! Victory Road (Type A)";
    if (liveId === "2113") return "Ryouran! Victory Road (Type B)";
    if (liveId === "2098") return "Mirai Harmony";
    if (liveId === "2120") return "Hurray Hurray";
    if (liveId === "2122") return "What You Gonna Do";
    if (liveId === "2031") return "SUPER NOVA";
    if (liveId === "2067") return "POWER SPOT!!";
    if (liveId === "2066") return "Love Triangle";
    if (liveId === "2070") return "Saika -saika-";
    if (liveId === "2088") return "THE SECRET NiGHT";
    if (liveId === "2089") return "Fly into the sky";
    if (liveId === "2085") return "SUPER NOVA";
    if (liveId === "2102") return "Eternal Light";
    if (liveId === "2117") return "Saika -saika-";
    if (liveId === "2125") return "Shadow Effect";
    if (liveId === "2032") return "Dream Land! Dream World!";
    if (liveId === "2068") return "Kakushiaji!";
    if (liveId === "2065") return "Cheer for you!!";
    if (liveId === "2071") return "Happy Nyan! Days";
    if (liveId === "2090") return "Maze Town";
    if (liveId === "2086") return "Dream Land! Dream World!";
    if (liveId === "2091") return "Folklore ~Kanki no Uta~";
    if (liveId === "2104") return "Infinity! Our Wings!!";
    if (liveId === "2118") return "Happy Nyan! Days";
    if (liveId === "2126") return "Blue!";
    if (liveId === "2033") return "Sing & Smile!!";
    if (liveId === "2069") return "Make-up session ABC";
    if (liveId === "2064") return "Beautiful Moonlight";
    if (liveId === "2072") return "Twinkle Town";
    if (liveId === "2092") return "Swinging!";
    if (liveId === "2093") return "Not Sad";
    if (liveId === "2087") return "Sing & Smile!!";
    if (liveId === "2103") return "ENJOY IT!";
    if (liveId === "2119") return "Twinkle Town";
    if (liveId === "2127") return "PASTEL";
    if (liveId === "2056") return "MONSTER GIRLS";
    if (liveId === "2124") return "Vroom Vroom";
    if (liveId === "2002") return "Yume e no Ippo";
    if (liveId === "2011") return "Kaika Sengen";
    if (liveId === "2021") return "Say Good-Bye Namida";
    if (liveId === "2042") return "Dream with You";
    if (liveId === "2052") return "Awakening Promise";
    if (liveId === "2075") return "Break the System";
    if (liveId === "2003") return "Diamond";
    if (liveId === "2012") return "☆Wonderland☆";
    if (liveId === "2039") return "Mutekikyuu * Believer";
    if (liveId === "2022") return "Margaret";
    if (liveId === "2043") return "Poppin' Up!";
    if (liveId === "2076") return "TO BE YOURSELF";
    if (liveId === "2004") return "Anata no Risou no Heroine";
    if (liveId === "2013") return "Audrey";
    if (liveId === "2023") return "Yagate Hitotsu no Monogatari";
    if (liveId === "2044") return "Solitude Rain";
    if (liveId === "2077") return "Eieisa";
    if (liveId === "2005") return "Starlight";
    if (liveId === "2014") return "Wish";
    if (liveId === "2024") return "Fire Bird";
    if (liveId === "2045") return "VIVID WORLD";
    if (liveId === "2078") return "Turn It Up!";
    if (liveId === "2006") return "Meccha Going!!";
    if (liveId === "2015") return "Yuu & Ai";
    if (liveId === "2025") return "Tanoshii no Tensai";
    if (liveId === "2046") return "Saikou Heart";
    if (liveId === "2079") return "Diabolic mulier";
    if (liveId === "2007") return "Nemureru Mori ni Ikitai na";
    if (liveId === "2016") return "My Own Fairy-Tale";
    if (liveId === "2026") return "Märchen Star";
    if (liveId === "2047") return "Butterfly";
    if (liveId === "2080") return "Silent Blaze";
    if (liveId === "2008") return "CHASE!";
    if (liveId === "2017") return "MELODY";
    if (liveId === "2027") return "LIKE IT! LOVE IT!";
    if (liveId === "2048") return "DIVE!";
    if (liveId === "2081") return "Yada!";
    if (liveId === "2009") return "Evergreen";
    if (liveId === "2018") return "Koe Tsunagou yo";
    if (liveId === "2028") return "Aion no Uta";
    if (liveId === "2049") return "La Bella Patria";
    if (liveId === "2082") return "Itsudatte for you!";
    if (liveId === "2010") return "Dokipipo ☆ Emotion";
    if (liveId === "2019") return "Teletelepathy";
    if (liveId === "2029") return "Analog Heart";
    if (liveId === "2050") return "Tsunagaru Connect";
    if (liveId === "2083") return "First Love Again";
    if (liveId === "2030") return "Ketsui no Hikari";
    if (liveId === "2038") return "Aoi Kanaria";
    if (liveId === "2084") return "Concentrate!";
    if (liveId === "2105") return "EMOTION";
    if (liveId === "2035") return "I'm Still...";
    if (liveId === "2054") return "Toy Doll";
    if (liveId === "2106") return "stars we chase";
    if (liveId === "2036") return "Queendom";
    if (liveId === "2055") return "Ye Mingzhu";
    if (liveId === "2107") return "Eutopia";
    if (liveId === "2997") return "MONSTER GIRLS";
    if (liveId === "2998") return "I'm Still...";
    if (liveId === "2999") return "Queendom";

    // Liella!
    if (liveId === "3001") return "Hajimari wa Kimi no Sora";
    if (liveId === "3002") return "START!! True dreams";
    if (liveId === "3003") return "Mirai wa Kaze no You ni";
    if (liveId === "3004") return "Mirai Yohou Hallelujah!";
    if (liveId === "3007") return "Wish Song";

    throw new Error('Unknown Romaji Song Name for ' + liveId);
}

function songNameApril(live_id) {
    let liveId = ("" + live_id).substring(1);

    // I don't even remember what language order I used in Google Translate, but these are all unedited results
    // I just picked the best ones from a couple of results, so these are not all from the same process

    if (liveId === "0001") return "This is our miracle";
    if (liveId === "0002") return "Start: Dash!";
    if (liveId === "0003") return "Natsuiro Egao de 1, 2, jump!";
    if (liveId === "0004") return "Junju love";
    if (liveId === "0005") return "Heart fire";
    if (liveId === "0008") return "Our LIVE life with you";
    if (liveId === "0009") return "Angel angel";
    if (liveId === "0010") return "Ruthless world";
    if (liveId === "0011") return "Halogenation of snow";
    if (liveId === "0012") return "Great summit"; // how did this happen
    if (liveId === "0013") return "Music S.T.A.R.T !!";
    if (liveId === "0014") return "Because love is in the storm";
    if (liveId === "0015") return "Orion with no exit";
    if (liveId === "0016") return "Now we";
    if (liveId === "0017") return "From heart to heart!";
    if (liveId === "0021") return "Mogat's &quot;love&quot; is coming soon!"; // is this a threat?
    if (liveId === "0036") return "No brand girls";
    if (liveId === "0037") return "Wonder area";
    if (liveId === "0054") return "Lonely sky";
    if (liveId === "0059") return "At some point in my life";
    if (liveId === "0060") return "always";
    if (liveId === "0061") return "End of general sadness";
    if (liveId === "0062") return "Dream Tobira";
    if (liveId === "0064") return "Blueberry ♡ train";
    if (liveId === "0066") return "Brave! !!";
    if (liveId === "0067") return "Reason to be courageous";
    if (liveId === "0068") return "KiRa-KiRa has moved!";
    if (liveId === "0070") return "The signal of love Rin Rin!";
    if (liveId === "0071") return "Happy Creator!";
    if (liveId === "0073") return "Pure love lens";
    if (liveId === "0076") return "I started using magic!";
    if (liveId === "0077") return "Colorful sound";
    if (liveId === "0118") return "Recommended song! They are? They are! !!";
    if (liveId === "0120") return "Recommended song! They are? They are! !!";
    if (liveId === "1001") return "Is your heart shining";
    if (liveId === "1002") return "A heart racing in the blue sky";
    if (liveId === "1003") return "Step! From zero to one";
    if (liveId === "1004") return "Energetic throttle day! Day! Day!";
    if (liveId === "1005") return "Tottorico, please!";
    if (liveId === "1006") return "Strawberry catcher";
    if (liveId === "1007") return "We know in the future";
    if (liveId === "1008") return "Happy party train";
    if (liveId === "1009") return "I want to fall in love with the aquarium";
    if (liveId === "1011") return "Heavenly journey";
    if (liveId === "1012") return "Exciting one-way street";
    if (liveId === "1013") return "Miracle wave";
    if (liveId === "1014") return "KOKORO Magic &quot;From A to Z&quot;";
    if (liveId === "1015") return "The brightest melody";
    if (liveId === "1017") return "Wait a minute love song";
    if (liveId === "1030") return "The bell continues to ring";
    if (liveId === "1042") return "Let's have a happy ending in the near future";
    if (liveId === "1044") return "Hide and search";
    if (liveId === "1046") return "Kobeljaski"; // this made me lose it
    if (liveId === "1049") return "Landing action!";
    if (liveId === "1059") return "Another sunshine story";
    if (liveId === "1062") return "Good night everyone!";
    if (liveId === "1064") return "In this unstable world";
    if (liveId === "1065") return "Piano long monologues";
    if (liveId === "1066") return "Beginner sailing";
    if (liveId === "1067") return "White first love";
    if (liveId === "1068") return "Ruby winks";
    if (liveId === "1069") return "New twists";
    if (liveId === "1070") return "Is it a fish";
    if (liveId === "1072") return "Leap? Stop? Nonstop!";
    if (liveId === "1078") return "Wake up the challenger!";
    if (liveId === "1079") return "Inexperienced horizon";
    if (liveId === "1080") return "New romantic sailor";
    if (liveId === "1081") return "Braveheart coasters";
    if (liveId === "1082") return "Amazing travel DNA";
    if (liveId === "1084") return "JIMO-AI Dash!";
    if (liveId === "1085") return "Great offspring!";
    if (liveId === "2001") return "Tokimeki runner";
    if (liveId === "2002") return "One step towards a dream";
    if (liveId === "2003") return "diamond";
    if (liveId === "2004") return "Your ideal heroine";
    if (liveId === "2005") return "Starlight";
    if (liveId === "2006") return "I'm going to try my best!";
    if (liveId === "2007") return "I want to go to the sleeping forest";
    if (liveId === "2008") return "Track!";
    if (liveId === "2009") return "Always green";
    if (liveId === "2010") return "Dokipipo ☆ emotion";
    if (liveId === "2011") return "Blooming declaration";
    if (liveId === "2012") return "☆ Wonderland ☆";
    if (liveId === "2013") return "Audrey";
    if (liveId === "2014") return "Want";
    if (liveId === "2015") return "Fall in love with a friend";
    if (liveId === "2016") return "My own fairy tale";
    if (liveId === "2017") return "melody";
    if (liveId === "2018") return "Let's connect the sounds";
    if (liveId === "2019") return "telepathy";
    if (liveId === "2020") return "My beloved friend (2D)";
    if (liveId === "2021") return "Tears are good";
    if (liveId === "2022") return "Margaret";
    if (liveId === "2023") return "Last story";
    if (liveId === "2024") return "Phoenix";
    if (liveId === "2025") return "Funny genius";
    if (liveId === "2026") return "Fairytale star";
    if (liveId === "2027") return "That is wonderful! I like this!"; // how nice
    if (liveId === "2028") return "Sad poetry";
    if (liveId === "2029") return "Simulated heart";
    if (liveId === "2030") return "Light of determination";
    if (liveId === "2031") return "Supernova";
    if (liveId === "2032") return "Dreamland! Dream world!";
    if (liveId === "2033") return "Sing and laugh!";
    if (liveId === "2085") return "Supernova";
    if (liveId === "2086") return "Dreamland! Dream world!";
    if (liveId === "2087") return "Sing and laugh!";
    if (liveId === "2034") return "TOKIMEKI Runners Chapter 17 Ver.";
    if (liveId === "2037") return "My beloved friend";
    if (liveId === "2039") return "Invincible * followers";
    if (liveId === "2040") return "Rainbow colored passion!";
    if (liveId === "2041") return "New sky, new map!";
    if (liveId === "2042") return "Dream with you";
    if (liveId === "2043") return "Poppin'Up!";
    if (liveId === "2044") return "Lonely rain";
    if (liveId === "2045") return "Lifeworld";
    if (liveId === "2046") return "Psychological mind";
    if (liveId === "2047") return "butterfly";
    if (liveId === "2048") return "go in!";
    if (liveId === "2049") return "La Bella Patria";
    if (liveId === "2050") return "Tuna connection"; // I can't really pick a favourite but this is probably up there
    if (liveId === "2051") return "The dream starts here";
    if (liveId === "2052") return "Awakened promise";
    if (liveId === "2053") return "Please believe!";
    if (liveId === "2057") return "Rainbow colored passion!";
    if (liveId === "2061") return "Future harmony";
    if (liveId === "2098") return "Future harmony";
    if (liveId === "2062") return "Sweet eyes";
    if (liveId === "2063") return "Dreamers move forward at full speed";
    if (liveId === "2064") return "Good moonlight";
    if (liveId === "2065") return "Please support! !!";
    if (liveId === "2066") return "Triangular relationship";
    if (liveId === "2067") return "Power spot!";
    if (liveId === "2068") return "Kakushiaji!";
    if (liveId === "2998") return "I still...";
    if (liveId === "2999") return "queen";

    if (liveId === "1089") return "Smile when the ship takes off!";
    if (liveId === "0089") return "We are light"; // doesn't come across in this: translator used "light" as in "not heavy"

    if (liveId === "1010") return "future voting";
    if (liveId === "2035") return "I still...";
    if (liveId === "2036") return "queen";
    if (liveId === "2038") return "Happy Midori";
    if (liveId === "1021") return "Other than the doctor's love, die the job!";
    if (liveId === "1022") return "Let's sing about dreams instead of talking about them";
    if (liveId === "1025") return "an immature dreamer";
    if (liveId === "0006") return "The dance star is on me!";
    if (liveId === "2054") return "doll toy";
    if (liveId === "2055") return "night pearl";
    if (liveId === "2056") return "Giant girl";
    if (liveId === "2058") return "New sky, new map!";
    if (liveId === "2059") return "The dream starts here";
    if (liveId === "1036") return "buzzing friend";
    if (liveId === "2060") return "Please believe!";
    if (liveId === "2069") return "ABC Makeup Class";
    if (liveId === "2070") return "festive flower -four seasons-";
    if (liveId === "0023") return "Love and security!";
    if (liveId === "2071") return "Good year! Sky";
    if (liveId === "0025") return "sweet feast";
    if (liveId === "2072") return "City of Shining";
    if (liveId === "2073") return "longevity longevity";
    if (liveId === "2074") return "A generation! A generation! A generation! (love our life)";
    if (liveId === "2075") return "GENERAL NOTICE";
    if (liveId === "2076") return "A YEAR";
    if (liveId === "2077") return "yes sir fight";
    if (liveId === "0032") return "I believe you can hear youth";
    if (liveId === "1057") return "Tonight's dance";
    if (liveId === "2078") return "Come!";
    if (liveId === "2079") return "Demon Muriel";
    if (liveId === "1060") return "NEW WORLD BLUE WATER";
    if (liveId === "2080") return "silent flame";
    if (liveId === "2081") return "Yes !";
    if (liveId === "2082") return "Always to you!";
    if (liveId === "2083") return "first love, cover";
    if (liveId === "2084") return "intensity!";
    if (liveId === "0043") return "Sweet leopard";
    if (liveId === "0046") return "Pomonoz";
    if (liveId === "2088") return "THE NIGHT OF ARRIVAL";
    if (liveId === "2089") return "flying in the air";
    if (liveId === "0049") return "From low-grade fever to mystery";
    if (liveId === "2090") return "Labyrinth City";
    if (liveId === "2091") return "Oral tradition ~A love song~";
    if (liveId === "2092") return "Shake!";
    if (liveId === "2093") return "Not angry";
    if (liveId === "3001") return "start is your paradise";
    if (liveId === "3002") return "To start! ! real dream";
    if (liveId === "3003") return "The future is windy";
    if (liveId === "3004") return "Future Predictions Hallelujah!";
    if (liveId === "3007") return "a song of desire";
    if (liveId === "1090") return "fly to the future";
    if (liveId === "0100") return "couple ring ";

    if (liveId === "0007") return "The only child";
    if (liveId === "0022") return "I love you too!";
    if (liveId === "0024") return "Love on the border";
    if (liveId === "0038") return "Diamond Princess grief";
    if (liveId === "0078") return "emotional measures";
    if (liveId === "0087") return "The song of the sun";
    if (liveId === "0027") return "Anonymous love * Talk about love";
    if (liveId === "1016") return "Accor ☆ Heroes";
    if (liveId === "1054") return "Adventure is in front of you";
    if (liveId === "1083") return "jump up and down! !";
    if (liveId === "1092") return "I promise you no matter what!";
    if (liveId === "1093") return "Long live! digital hiker";
    if (liveId === "1096") return "far!";
    if (liveId === "1097") return "The ideal world";
    if (liveId === "1098") return "A wonderful girl";   // good opinion
    if (liveId === "1099") return "my head";
    if (liveId === "1100") return "Miss Run Running";
    if (liveId === "1101") return "excellent runner";
    if (liveId === "1102") return "Cockroach AA AA!";   // AAAAAAAAAAAAAAA
    if (liveId === "1103") return "a nice color";
    if (liveId === "2096") return "Just believe it! ! ! (see 12 people)";
    if (liveId === "2097") return "Eternal time";
    if (liveId === "2099") return "Different smiles! Dreamy colors!";
    if (liveId === "2100") return "I dream of the sun";
    if (liveId === "2102") return "infinite light";
    if (liveId === "2103") return "fun!";
    if (liveId === "2104") return "several! Ice wings! !";
    if (liveId === "2105") return "method";
    if (liveId === "2106") return "The stars we attack";
    if (liveId === "2107") return "The virtuous city";
    if (liveId === "2108") return "future weapons";
    if (liveId === "2110") return "Please look forward to the miracle!";
    if (liveId === "2121") return "Please look forward to the miracle! (second door)";
    if (liveId === "2111") return "being in the dark";
    if (liveId === "2112") return "In confusion! The Road to Victory (Form A)";
    if (liveId === "2113") return "In confusion! The Road to Victory (Form B)";
    if (liveId === "2122") return "Vacho and others";
    if (liveId === "2124") return "Engine breakdown";
    if (liveId === "2125") return "but the results";
    if (liveId === "2126") return "Green!"; // colours in languages are fun
    if (liveId === "2127") return "pie";

    console.log("Unknown Funny Name for " + live_id);
}

function songNamePostfix(liveId) {
    if (liveId.length !== 4) liveId = liveId.toString().slice(-4);

    // µ's
    if (liveId === "0118") return "2D";       // A song for You! You? You!! (limited version)
    if (liveId === "0121") return "Event";    // A song for You! You? You!! (event prerelease version)

    // Aqours
    if (liveId === "1091") return "Event";    // Aqours☆HEROES (event prerelease version)

    // Nijigaku
    if (liveId === "2031") return "2D";       // SUPER NOVA (daily version)
    if (liveId === "2032") return "2D";       // Dream Land, Dream World! (daily version)
    if (liveId === "2033") return "2D";       // Sing & Smile!! (daily version)
    if (liveId === "2040") return "2D";       // 虹色Passions！ (limited version)
    if (liveId === "2041") return "2D";       // NEO SKY, NEO MAP! (limited version)
    if (liveId === "2051") return "2D";       // 夢がここからはじまるよ (limited version)
    if (liveId === "2061") return "2D";       // 未来ハーモニー (2D version)
    if (liveId === "2053") return "2D";       // Just Believe!!! (limited version)
    if (liveId === "2109") return "Event";    // Just Believe!!! （12人Ver.） (event prerelease version)
    if (liveId === "2117") return "Event";    // 祭花 -saika- (event prerelease version)
    if (liveId === "2118") return "Event";    // Happy Nyan! Days (event prerelease version)
    if (liveId === "2119") return "Event";    // Twinkle Town (event prerelease version)
    if (liveId === "2120") return "Event";    // Hurray Hurray (event prerelease version)
    if (liveId === "2997") return "MV";       // MONSTER GIRLS (MV version)
    if (liveId === "2998") return "MV";       // I'm Still... (MV version)
    if (liveId === "2999") return "MV";       // Queendom (MV version)

    return null;
}

const GIMMICK_MARKER_PADDING = 0.004;

class Skyline {
    skyline = [[-0.1, -1], [1.1, -1]];

    get(x, w) {
        const x1 = x - GIMMICK_MARKER_PADDING;
        const x2 = x + (w || GIMMICK_MARKER_PADDING);

        let i = 0;
        while (this.skyline[i][0] < x1) {
            i++;
        }

        let maxy = this.skyline[i - 1][1];
        while (this.skyline[i][0] < x2) {
            maxy = Math.max(maxy, this.skyline[i][1]);
            i++;
        }

        return maxy;
    }

    add(x, y, w) {
        const x1 = x - GIMMICK_MARKER_PADDING;
        const x2 = x + (w || GIMMICK_MARKER_PADDING);
        this.merge({skyline: [[x1, y], [x2, -1]]});
    }

    merge(other) {
        const newSkyline = [[-0.1, -1]];
        let hThis = -1, hOther = -1, iThis = 0, iOther = 0;

        while (iThis < this.skyline.length && iOther < other.skyline.length) {
            let x;
            if (this.skyline[iThis][0] < other.skyline[iOther][0]) {
                x = this.skyline[iThis][0];
                hThis = this.skyline[iThis][1];
                iThis++;
            } else {
                x = other.skyline[iOther][0];
                hOther = other.skyline[iOther][1];
                iOther++;
            }
            const y = Math.max(hThis, hOther);
            if (y !== newSkyline.at(-1)[1]) newSkyline.push([x, y]);
        }

        this.skyline = newSkyline.concat(this.skyline.slice(iThis)).concat(other.skyline.slice(iOther));
    }
}

module.exports = {
    isFreeLive, isActiveEventLive, isStoryStage,
    songNameRomaji, songNamePostfix, songNameApril,
    GIMMICK_MARKER_PADDING, Skyline
}