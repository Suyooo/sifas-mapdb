const settings = require("./settings.js");

const isFreeLive = (liveDiffId) => liveDiffId < 20000000;
const isActiveEventLive = (liveDiffId) => settings.active_event_live_ids.indexOf(Math.floor(liveDiffId / 1000)) !== -1;
const isStoryStage = (liveDiffId) => liveDiffId >= 30000000 && liveDiffId < 40000000;

function songNameRomaji(liveId) {
    // µ's
    if (liveId == 10001) return "Sore wa Bokutachi no Kiseki";
    if (liveId == 10002) return "START:DASH!!";
    if (liveId == 10014) return "Arashi no Naka no Koi Dakara";
    if (liveId == 10011) return "Snow halation";
    if (liveId == 10016) return "Bokura wa Ima no Naka de";
    if (liveId == 10013) return "Music S.T.A.R.T!!";
    if (liveId == 10008) return "Bokura no LIVE Kimi to no LIFE";
    if (liveId == 10003) return "Natsuiro Egao de 1,2,Jump!";
    if (liveId == 10017) return "HEART to HEART!";
    if (liveId == 10062) return "Yume no Tobira";
    if (liveId == 10037) return "Wonder zone";
    if (liveId == 10012) return "Wonderful Rush";
    if (liveId == 10036) return "No brand girls";
    if (liveId == 10118) return "A song for You! You? You!!";
    if (liveId == 10010) return "LOVELESS WORLD";
    if (liveId == 10060) return "Donna Toki mo Zutto";
    if (liveId == 10071) return "Happy maker!";
    if (liveId == 10077) return "COLORFUL VOICE";
    if (liveId == 10009) return "Angelic Angel";
    if (liveId == 10068) return "KiRa-KiRa Sensation!";
    if (liveId == 10021) return "Mogyutto &quot;love&quot; de Sekkin Chuu!";
    if (liveId == 10089) return "Bokutachi wa Hitotsu no Hikari";
    if (liveId == 10046) return "Takaramonozu";
    if (liveId == 10006) return "Dancing stars on me!";
    if (liveId == 10032) return "Kitto Seishun ga Kikoeru";
    if (liveId == 10023) return "Oh,Love&Peace!";
    if (liveId == 10100) return "MOMENT RING";
    if (liveId == 10121) return "A song for You! You? You!!";
    if (liveId == 10120) return "A song for You! You? You!!";
    if (liveId == 10005) return "PSYCHIC FIRE";
    if (liveId == 10043) return "Cutie Panther";
    if (liveId == 10004) return "Shunjou Romantic";
    if (liveId == 10049) return "Binetsu kara Mystery";
    if (liveId == 10015) return "NO EXIT ORION";
    if (liveId == 10025) return "sweet&sweet holiday";
    if (liveId == 10059) return "Someday of my life";
    if (liveId == 10061) return "Arifureta Kanashimi no Hate";
    if (liveId == 10064) return "Blueberry ♡ Train";
    if (liveId == 10067) return "Yuuki no Reason";
    if (liveId == 10070) return "Koi no Signal Rin rin rin!";
    if (liveId == 10066) return "Daring!!";
    if (liveId == 10073) return "Junai Lens";
    if (liveId == 10054) return "Kodoku na Heaven";
    if (liveId == 10076) return "Mahoutsukai Hajimemashita!";

    // Aqours
    if (liveId == 11007) return "Mirai no Bokura wa Shitteru yo";
    if (liveId == 11001) return "Kimi no Kokoro wa Kagayaiteru kai?";
    if (liveId == 11002) return "Aozora Jumping Heart";
    if (liveId == 11014) return "KOKORO Magic “A to Z”";
    if (liveId == 11008) return "HAPPY PARTY TRAIN";
    if (liveId == 11012) return "Thrilling • One Way";
    if (liveId == 11003) return "Step! ZERO to ONE";
    if (liveId == 11011) return "SKY JOURNEY";
    if (liveId == 11078) return "Wake up, Challenger!!";
    if (liveId == 11015) return "Brightest Melody";
    if (liveId == 11009) return "Koi ni Naritai AQUARIUM";
    if (liveId == 11085) return "Fantastic Departure!";
    if (liveId == 11084) return "JIMO-AI Dash!";
    if (liveId == 11013) return "MIRACLE WAVE";
    if (liveId == 11079) return "Mitaiken HORIZON";
    if (liveId == 11049) return "Landing action Yeah!!";
    if (liveId == 11030) return "Jingle Bells ga Tomaranai";
    if (liveId == 11072) return "Hop? Stop? Nonstop!";
    if (liveId == 11017) return "Mattete Ai no Uta";
    if (liveId == 11010) return "MIRAI TICKET";
    if (liveId == 11089) return "smile smile ship Start!";
    if (liveId == 11090) return "Future Flight";
    if (liveId == 11025) return "Mijuku DREAMER";
    if (liveId == 11060) return "WATER BLUE NEW WORLD";
    if (liveId == 11036) return "Humming Friend";
    if (liveId == 11021) return "Daisuki Dattara Daijoubu!";
    if (liveId == 11057) return "MY Mai☆TONIGHT";
    if (liveId == 11022) return "Yume Kataru yori Yume Utaou";
    if (liveId == 11091) return "Aqours☆HEROES";
    if (liveId == 11016) return "Aqours☆HEROES";
    if (liveId == 11092) return "Nando Datte Yakusoku!";
    if (liveId == 11005) return "Torikoriko PLEASE!!";
    if (liveId == 11082) return "Amazing Travel DNA";
    if (liveId == 11044) return "GALAXY HidE and SeeK";
    if (liveId == 11004) return "Genki Zenkai DAY!DAY!DAY!";
    if (liveId == 11081) return "Braveheart Coaster";
    if (liveId == 11042) return "Kinmirai Happy End";
    if (liveId == 11006) return "Strawberry Trapper";
    if (liveId == 11080) return "New Romantic Sailors";
    if (liveId == 11046) return "Kowareyasuki";
    if (liveId == 11059) return "One More Sunshine Story";
    if (liveId == 11065) return "Pianoforte Monologue";
    if (liveId == 11070) return "Sakana ka Nanda ka?";
    if (liveId == 11067) return "WHITE FIRST LOVE";
    if (liveId == 11066) return "Beginner's Sailing";
    if (liveId == 11064) return "in this unstable world";
    if (liveId == 11062) return "Oyasuminasan!";
    if (liveId == 11069) return "New winding road";
    if (liveId == 11068) return "RED GEM WINK";

    // Nijigaku
    if (liveId == 12001) return "TOKIMEKI Runners";
    if (liveId == 12020) return "Love U my friends (2D)";
    if (liveId == 12034) return "TOKIMEKI Runners (Chapter 17 Ver.)";
    if (liveId == 12053) return "Just Believe!!!";
    if (liveId == 12040) return "Nijiiro Passions!";
    if (liveId == 12041) return "NEO SKY, NEO MAP!";
    if (liveId == 12051) return "Yume ga Koko Kara Hajimaru yo";
    if (liveId == 12037) return "Love U my friends";
    if (liveId == 12057) return "Nijiiro Passions!";
    if (liveId == 12058) return "NEO SKY, NEO MAP!";
    if (liveId == 12059) return "Yume ga Koko Kara Hajimaru yo";
    if (liveId == 12061) return "Mirai Harmony";
    if (liveId == 12062) return "Sweet Eyes";
    if (liveId == 12063) return "Zensoku Dreamer";
    if (liveId == 12060) return "Just Believe!!!";
    if (liveId == 12074) return "L!L!L! (Love the Life We Live)";
    if (liveId == 12073) return "Hurray Hurray";
    if (liveId == 12096) return "Just Believe!!! (12 Member Ver.)";
    if (liveId == 12109) return "Just Believe!!! (12 Member Ver.)";
    if (liveId == 12099) return "Colorful Dreams! Colorful Smiles!";
    if (liveId == 12100) return "Yume ga Bokura no Taiyou sa";
    if (liveId == 12108) return "Future Parade";
    if (liveId == 12110) return "Miracle STAY TUNE!";
    if (liveId == 12097) return "Eien no Isshun";
    if (liveId == 12031) return "SUPER NOVA";
    if (liveId == 12067) return "POWER SPOT!!";
    if (liveId == 12066) return "Love Triangle";
    if (liveId == 12070) return "Saika -saika-";
    if (liveId == 12088) return "THE SECRET NiGHT";
    if (liveId == 12089) return "Fly into the sky";
    if (liveId == 12085) return "SUPER NOVA";
    if (liveId == 12102) return "Eternal Light";
    if (liveId == 12117) return "Saika -saika-";
    if (liveId == 12032) return "Dream Land! Dream World!";
    if (liveId == 12068) return "Kakushiaji!";
    if (liveId == 12065) return "Cheer for you!!";
    if (liveId == 12071) return "Happy Nyan! Days";
    if (liveId == 12090) return "Maze Town";
    if (liveId == 12086) return "Dream Land! Dream World!";
    if (liveId == 12091) return "Folklore ~Kanki no Uta~";
    if (liveId == 12104) return "Infinity! Our Wings!!";
    if (liveId == 12033) return "Sing & Smile!!";
    if (liveId == 12069) return "Make-up session ABC";
    if (liveId == 12064) return "Beautiful Moonlight";
    if (liveId == 12072) return "Twinkle Town";
    if (liveId == 12092) return "Swinging!";
    if (liveId == 12093) return "Not Sad";
    if (liveId == 12087) return "Sing & Smile!!";
    if (liveId == 12103) return "ENJOY IT!";
    if (liveId == 12056) return "MONSTER GIRLS";
    if (liveId == 12002) return "Yume e no Ippo";
    if (liveId == 12011) return "Kaika Sengen";
    if (liveId == 12021) return "Say Good-Bye Namida";
    if (liveId == 12042) return "Dream with You";
    if (liveId == 12052) return "Awakening Promise";
    if (liveId == 12075) return "Break the System";
    if (liveId == 12003) return "Diamond";
    if (liveId == 12012) return "☆Wonderland☆";
    if (liveId == 12039) return "Mutekikyuu * Believer";
    if (liveId == 12022) return "Margaret";
    if (liveId == 12043) return "Poppin' Up!";
    if (liveId == 12076) return "TO BE YOURSELF";
    if (liveId == 12004) return "Anata no Risou no Heroine";
    if (liveId == 12013) return "Audrey";
    if (liveId == 12023) return "Yagate Hitotsu no Monogatari";
    if (liveId == 12044) return "Solitude Rain";
    if (liveId == 12077) return "Eieisa";
    if (liveId == 12005) return "Starlight";
    if (liveId == 12014) return "Wish";
    if (liveId == 12024) return "Fire Bird";
    if (liveId == 12045) return "VIVID WORLD";
    if (liveId == 12078) return "Turn It Up!";
    if (liveId == 12006) return "Meccha Going!!";
    if (liveId == 12015) return "Yuu & Ai";
    if (liveId == 12025) return "Tanoshii no Tensai";
    if (liveId == 12046) return "Saikou Heart";
    if (liveId == 12079) return "Diabolic mulier";
    if (liveId == 12007) return "Nemureru Mori ni Ikitai na";
    if (liveId == 12016) return "My Own Fairy-Tale";
    if (liveId == 12026) return "Märchen Star";
    if (liveId == 12047) return "Butterfly";
    if (liveId == 12080) return "Silent Blaze";
    if (liveId == 12008) return "CHASE!";
    if (liveId == 12017) return "MELODY";
    if (liveId == 12027) return "LIKE IT! LOVE IT!";
    if (liveId == 12048) return "DIVE!";
    if (liveId == 12081) return "Yada!";
    if (liveId == 12009) return "Evergreen";
    if (liveId == 12018) return "Koe Tsunagou yo";
    if (liveId == 12028) return "Aion no Uta";
    if (liveId == 12049) return "La Bella Patria";
    if (liveId == 12082) return "Itsudatte for you!";
    if (liveId == 12010) return "Dokipipo ☆ Emotion";
    if (liveId == 12019) return "Teletelepathy";
    if (liveId == 12029) return "Analog Heart";
    if (liveId == 12050) return "Tsunagaru Connect";
    if (liveId == 12083) return "First Love Again";
    if (liveId == 12030) return "Ketsui no Hikari";
    if (liveId == 12038) return "Aoi Kanaria";
    if (liveId == 12084) return "Concentrate!";
    if (liveId == 12105) return "EMOTION";
    if (liveId == 12035) return "I'm Still...";
    if (liveId == 12054) return "Toy Doll";
    if (liveId == 12106) return "stars we chase";
    if (liveId == 12036) return "Queendom";
    if (liveId == 12055) return "Ye Mingzhu";
    if (liveId == 12107) return "Eutopia";
    if (liveId == 12997) return "MONSTER GIRLS";
    if (liveId == 12998) return "I'm Still...";
    if (liveId == 12999) return "Queendom";

    // Liella!
    if (liveId == 13001) return "Hajimari wa Kimi no Sora";
    if (liveId == 13002) return "START!! True dreams";
    if (liveId == 13003) return "Mirai wa Kaze no You ni";
    if (liveId == 13004) return "Mirai Yohou Hallelujah!";
    if (liveId == 13007) return "Wish Song";

    throw new Error('Unknown Romaji Song Name for ' + liveId);
}

function songPostfix(liveId) {
    // µ's
    if (liveId == 10118) return "2D";       // A song for You! You? You!! (limited version)
    if (liveId == 10121) return "Event";    // A song for You! You? You!! (event prerelease version)

    // Aqours
    if (liveId == 11091) return "Event";    // Aqours☆HEROES (event prerelease version)

    // Nijigaku
    if (liveId == 12031) return "2D";       // SUPER NOVA (daily version)
    if (liveId == 12032) return "2D";       // Dream Land, Dream World! (daily version)
    if (liveId == 12033) return "2D";       // Sing & Smile!! (daily version)
    if (liveId == 12040) return "2D";       // 虹色Passions！ (limited version)
    if (liveId == 12041) return "2D";       // NEO SKY, NEO MAP! (limited version)
    if (liveId == 12051) return "2D";       // 夢がここからはじまるよ (limited version)
    if (liveId == 12053) return "2D";       // Just Believe!!! (limited version)
    if (liveId == 12070) return "2D";       // 祭花 -saika- (limited version)
    if (liveId == 12109) return "Event";    // Just Believe!!! （12人Ver.） (event prerelease version)
    if (liveId == 12997) return "MV";       // MONSTER GIRLS (MV version)
    if (liveId == 12998) return "MV";       // I'm Still... (MV version)
    if (liveId == 12999) return "MV";       // Queendom (MV version)
    
    return null;
}

module.exports = {
    isFreeLive, isActiveEventLive, isStoryStage,
    songNameRomaji, songPostfix
}