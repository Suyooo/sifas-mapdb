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
    if (liveId === "0005") return "PSYCHIC FIRE";
    if (liveId === "0043") return "Cutie Panther";
    if (liveId === "0004") return "Shunjou Romantic";
    if (liveId === "0049") return "Binetsu kara Mystery";
    if (liveId === "0015") return "NO EXIT ORION";
    if (liveId === "0025") return "sweet&sweet holiday";
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
    if (liveId === "1067") return "WHITE FIRST LOVE";
    if (liveId === "1066") return "Beginner's Sailing";
    if (liveId === "1064") return "in this unstable world";
    if (liveId === "1099") return "Tatehoko Tsubasa";
    if (liveId === "1062") return "Oyasuminasan!";
    if (liveId === "1100") return "Akogare Ranraran";
    if (liveId === "1069") return "New winding road";
    if (liveId === "1101") return "Shiny Racers";
    if (liveId === "1068") return "RED GEM WINK";
    if (liveId === "1102") return "Cotton Candy Ei Ei Oh!";

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
    if (liveId === "2110") return "Miracle STAY TUNE!";
    if (liveId === "2097") return "Eien no Isshun";
    if (liveId === "2111") return "Twilight";
    if (liveId === "2112") return "Ryouran! Victory Road (Type A)";
    if (liveId === "2113") return "Ryouran! Victory Road (Type B)";
    if (liveId === "2098") return "Mirai Harmony";
    if (liveId === "2120") return "Hurray Hurray";
    if (liveId === "2031") return "SUPER NOVA";
    if (liveId === "2067") return "POWER SPOT!!";
    if (liveId === "2066") return "Love Triangle";
    if (liveId === "2070") return "Saika -saika-";
    if (liveId === "2088") return "THE SECRET NiGHT";
    if (liveId === "2089") return "Fly into the sky";
    if (liveId === "2085") return "SUPER NOVA";
    if (liveId === "2102") return "Eternal Light";
    if (liveId === "2117") return "Saika -saika-";
    if (liveId === "2032") return "Dream Land! Dream World!";
    if (liveId === "2068") return "Kakushiaji!";
    if (liveId === "2065") return "Cheer for you!!";
    if (liveId === "2071") return "Happy Nyan! Days";
    if (liveId === "2090") return "Maze Town";
    if (liveId === "2086") return "Dream Land! Dream World!";
    if (liveId === "2091") return "Folklore ~Kanki no Uta~";
    if (liveId === "2104") return "Infinity! Our Wings!!";
    if (liveId === "2118") return "Happy Nyan! Days";
    if (liveId === "2033") return "Sing & Smile!!";
    if (liveId === "2069") return "Make-up session ABC";
    if (liveId === "2064") return "Beautiful Moonlight";
    if (liveId === "2072") return "Twinkle Town";
    if (liveId === "2092") return "Swinging!";
    if (liveId === "2093") return "Not Sad";
    if (liveId === "2087") return "Sing & Smile!!";
    if (liveId === "2103") return "ENJOY IT!";
    if (liveId === "2119") return "Twinkle Town";
    if (liveId === "2056") return "MONSTER GIRLS";
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
    songNameRomaji, songNamePostfix,
    GIMMICK_MARKER_PADDING, Skyline
}