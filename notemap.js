/*
This module creates the HTML code for the note map timeline and panels for gimmick/AC info, used for the Map DB pages.
Copyright (C) 2020-2022 Suyooo

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

const NoteType = require("./enums/noteType");
const SkillFinishType = require("./enums/skillFinishType");
const NoteGimmickTrigger = require("./enums/noteGimmickTrigger");
const ACGimmickTrigger = require("./enums/acGimmickTrigger");
const ACMissionType = require("./enums/acMissionType");
const Difficulty = require("./enums/difficulty");

function capitalizeFirstLetter(s) {
    return s.substring(0, 1).toUpperCase() + s.substring(1);
}

function format(x) {
    // https://stackoverflow.com/a/2901298
    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "&#8239;");
    return parts.join(".");
}

function attributeName(attrId) {
    if (attrId === 1) return "smile";
    if (attrId === 2) return "pure";
    if (attrId === 3) return "cool";
    if (attrId === 4) return "active";
    if (attrId === 5) return "natural";
    if (attrId === 6) return "elegant";
    if (attrId === 9) return "none";
    throw new Error('Unknown Attribute ' + attrId);
}

function difficultyName(diffId) {
    if (diffId === Difficulty.BEG) return "Beginner";
    if (diffId === Difficulty.INT) return "Intermediate";
    if (diffId === Difficulty.ADV) return "Advanced";
    if (diffId === Difficulty.ADVPLUS) return "Advanced+";
    if (diffId === Difficulty.CHA) return "Challenge";
    throw new Error('Unknown Difficulty ' + diffId);
}

function difficultyNameShort(diffId) {
    if (diffId === Difficulty.BEG) return "Beg";
    if (diffId === Difficulty.INT) return "Int";
    if (diffId === Difficulty.ADV) return "Adv";
    if (diffId === Difficulty.ADVPLUS) return "Adv+";
    if (diffId === Difficulty.CHA) return "Ch";
    throw new Error('Unknown Difficulty ' + diffId);
}


function songNameRomaji(liveId) {
    let lid = liveId.length == 4 ? "" + liveId : ("" + liveId).substring(1);

    // µ's
    if (lid === "0001") return "Sore wa Bokutachi no Kiseki";
    if (lid === "0002") return "START:DASH!!";
    if (lid === "0014") return "Arashi no Naka no Koi Dakara";
    if (lid === "0011") return "Snow halation";
    if (lid === "0016") return "Bokura wa Ima no Naka de";
    if (lid === "0013") return "Music S.T.A.R.T!!";
    if (lid === "0008") return "Bokura no LIVE Kimi to no LIFE";
    if (lid === "0003") return "Natsuiro Egao de 1,2,Jump!";
    if (lid === "0017") return "HEART to HEART!";
    if (lid === "0062") return "Yume no Tobira";
    if (lid === "0037") return "Wonder zone";
    if (lid === "0012") return "Wonderful Rush";
    if (lid === "0036") return "No brand girls";
    if (lid === "0118") return "A song for You! You? You!!";
    if (lid === "0010") return "LOVELESS WORLD";
    if (lid === "0060") return "Donna Toki mo Zutto";
    if (lid === "0071") return "Happy maker!";
    if (lid === "0077") return "COLORFUL VOICE";
    if (lid === "0009") return "Angelic Angel";
    if (lid === "0068") return "KiRa-KiRa Sensation!";
    if (lid === "0021") return "Mogyutto &quot;love&quot; de Sekkin Chuu!";
    if (lid === "0089") return "Bokutachi wa Hitotsu no Hikari";
    if (lid === "0046") return "Takaramonozu";
    if (lid === "0006") return "Dancing stars on me!";
    if (lid === "0032") return "Kitto Seishun ga Kikoeru";
    if (lid === "0023") return "Oh,Love&Peace!";
    if (lid === "0100") return "MOMENT RING";
    if (lid === "0121") return "A song for You! You? You!!";
    if (lid === "0120") return "A song for You! You? You!!";
    if (lid === "0005") return "PSYCHIC FIRE";
    if (lid === "0043") return "Cutie Panther";
    if (lid === "0004") return "Shunjou Romantic";
    if (lid === "0049") return "Binetsu kara Mystery";
    if (lid === "0015") return "NO EXIT ORION";
    if (lid === "0025") return "sweet&sweet holiday";
    if (lid === "0059") return "Someday of my life";
    if (lid === "0061") return "Arifureta Kanashimi no Hate";
    if (lid === "0064") return "Blueberry ♡ Train";
    if (lid === "0067") return "Yuuki no Reason";
    if (lid === "0070") return "Koi no Signal Rin rin rin!";
    if (lid === "0066") return "Daring!!";
    if (lid === "0073") return "Junai Lens";
    if (lid === "0054") return "Kodoku na Heaven";
    if (lid === "0076") return "Mahoutsukai Hajimemashita!";

    // Aqours
    if (lid === "1007") return "Mirai no Bokura wa Shitteru yo";
    if (lid === "1001") return "Kimi no Kokoro wa Kagayaiteru kai?";
    if (lid === "1002") return "Aozora Jumping Heart";
    if (lid === "1014") return "KOKORO Magic “A to Z”";
    if (lid === "1008") return "HAPPY PARTY TRAIN";
    if (lid === "1012") return "Thrilling • One Way";
    if (lid === "1003") return "Step! ZERO to ONE";
    if (lid === "1011") return "SKY JOURNEY";
    if (lid === "1078") return "Wake up, Challenger!!";
    if (lid === "1015") return "Brightest Melody";
    if (lid === "1009") return "Koi ni Naritai AQUARIUM";
    if (lid === "1085") return "Fantastic Departure!";
    if (lid === "1084") return "JIMO-AI Dash!";
    if (lid === "1013") return "MIRACLE WAVE";
    if (lid === "1079") return "Mitaiken HORIZON";
    if (lid === "1049") return "Landing action Yeah!!";
    if (lid === "1030") return "Jingle Bells ga Tomaranai";
    if (lid === "1072") return "Hop? Stop? Nonstop!";
    if (lid === "1017") return "Mattete Ai no Uta";
    if (lid === "1010") return "MIRAI TICKET";
    if (lid === "1089") return "smile smile ship Start!";
    if (lid === "1090") return "Future Flight";
    if (lid === "1025") return "Mijuku DREAMER";
    if (lid === "1060") return "WATER BLUE NEW WORLD";
    if (lid === "1036") return "Humming Friend";
    if (lid === "1021") return "Daisuki Dattara Daijoubu!";
    if (lid === "1057") return "MY Mai☆TONIGHT";
    if (lid === "1022") return "Yume Kataru yori Yume Utaou";
    if (lid === "1091") return "Aqours☆HEROES";
    if (lid === "1016") return "Aqours☆HEROES";
    if (lid === "1092") return "Nando Datte Yakusoku!";
    if (lid === "1005") return "Torikoriko PLEASE!!";
    if (lid === "1082") return "Amazing Travel DNA";
    if (lid === "1044") return "GALAXY HidE and SeeK";
    if (lid === "1004") return "Genki Zenkai DAY!DAY!DAY!";
    if (lid === "1081") return "Braveheart Coaster";
    if (lid === "1042") return "Kinmirai Happy End";
    if (lid === "1006") return "Strawberry Trapper";
    if (lid === "1080") return "New Romantic Sailors";
    if (lid === "1046") return "Kowareyasuki";
    if (lid === "1059") return "One More Sunshine Story";
    if (lid === "1065") return "Pianoforte Monologue";
    if (lid === "1070") return "Sakana ka Nanda ka?";
    if (lid === "1067") return "WHITE FIRST LOVE";
    if (lid === "1066") return "Beginner's Sailing";
    if (lid === "1064") return "in this unstable world";
    if (lid === "1062") return "Oyasuminasan!";
    if (lid === "1069") return "New winding road";
    if (lid === "1068") return "RED GEM WINK";

    // Nijigaku
    if (lid === "2001") return "TOKIMEKI Runners";
    if (lid === "2020") return "Love U my friends (2D)";
    if (lid === "2034") return "TOKIMEKI Runners (Chapter 17 Ver.)";
    if (lid === "2053") return "Just Believe!!!";
    if (lid === "2040") return "Nijiiro Passions!";
    if (lid === "2041") return "NEO SKY, NEO MAP!";
    if (lid === "2051") return "Yume ga Koko Kara Hajimaru yo";
    if (lid === "2037") return "Love U my friends";
    if (lid === "2057") return "Nijiiro Passions!";
    if (lid === "2058") return "NEO SKY, NEO MAP!";
    if (lid === "2059") return "Yume ga Koko Kara Hajimaru yo";
    if (lid === "2061") return "Mirai Harmony";
    if (lid === "2062") return "Sweet Eyes";
    if (lid === "2063") return "Zensoku Dreamer";
    if (lid === "2060") return "Just Believe!!!";
    if (lid === "2074") return "L!L!L! (Love the Life We Live)";
    if (lid === "2073") return "Hurray Hurray";
    if (lid === "2096") return "Just Believe!!! (12 Member Ver.)";
    if (lid === "2109") return "Just Believe!!! (12 Member Ver.)";
    if (lid === "2099") return "Colorful Dreams! Colorful Smiles!";
    if (lid === "2100") return "Yume ga Bokura no Taiyou sa";
    if (lid === "2108") return "Future Parade";
    if (lid === "2110") return "Miracle STAY TUNE!";
    if (lid === "2097") return "Eien no Isshun";
    if (lid === "2031") return "SUPER NOVA";
    if (lid === "2067") return "POWER SPOT!!";
    if (lid === "2066") return "Love Triangle";
    if (lid === "2070") return "Saika -saika-";
    if (lid === "2088") return "THE SECRET NiGHT";
    if (lid === "2089") return "Fly into the sky";
    if (lid === "2085") return "SUPER NOVA";
    if (lid === "2102") return "Eternal Light";
    if (lid === "2117") return "Saika -saika-";
    if (lid === "2032") return "Dream Land! Dream World!";
    if (lid === "2068") return "Kakushiaji!";
    if (lid === "2065") return "Cheer for you!!";
    if (lid === "2071") return "Happy Nyan! Days";
    if (lid === "2090") return "Maze Town";
    if (lid === "2086") return "Dream Land! Dream World!";
    if (lid === "2091") return "Folklore ~Kanki no Uta~";
    if (lid === "2104") return "Infinity! Our Wings!!";
    if (lid === "2033") return "Sing & Smile!!";
    if (lid === "2069") return "Make-up session ABC";
    if (lid === "2064") return "Beautiful Moonlight";
    if (lid === "2072") return "Twinkle Town";
    if (lid === "2092") return "Swinging!";
    if (lid === "2093") return "Not Sad";
    if (lid === "2087") return "Sing & Smile!!";
    if (lid === "2103") return "ENJOY IT!";
    if (lid === "2056") return "MONSTER GIRLS";
    if (lid === "2002") return "Yume e no Ippo";
    if (lid === "2011") return "Kaika Sengen";
    if (lid === "2021") return "Say Good-Bye Namida";
    if (lid === "2042") return "Dream with You";
    if (lid === "2052") return "Awakening Promise";
    if (lid === "2075") return "Break the System";
    if (lid === "2003") return "Diamond";
    if (lid === "2012") return "☆Wonderland☆";
    if (lid === "2039") return "Mutekikyuu * Believer";
    if (lid === "2022") return "Margaret";
    if (lid === "2043") return "Poppin' Up!";
    if (lid === "2076") return "TO BE YOURSELF";
    if (lid === "2004") return "Anata no Risou no Heroine";
    if (lid === "2013") return "Audrey";
    if (lid === "2023") return "Yagate Hitotsu no Monogatari";
    if (lid === "2044") return "Solitude Rain";
    if (lid === "2077") return "Eieisa";
    if (lid === "2005") return "Starlight";
    if (lid === "2014") return "Wish";
    if (lid === "2024") return "Fire Bird";
    if (lid === "2045") return "VIVID WORLD";
    if (lid === "2078") return "Turn It Up!";
    if (lid === "2006") return "Meccha Going!!";
    if (lid === "2015") return "Yuu & Ai";
    if (lid === "2025") return "Tanoshii no Tensai";
    if (lid === "2046") return "Saikou Heart";
    if (lid === "2079") return "Diabolic mulier";
    if (lid === "2007") return "Nemureru Mori ni Ikitai na";
    if (lid === "2016") return "My Own Fairy-Tale";
    if (lid === "2026") return "Märchen Star";
    if (lid === "2047") return "Butterfly";
    if (lid === "2080") return "Silent Blaze";
    if (lid === "2008") return "CHASE!";
    if (lid === "2017") return "MELODY";
    if (lid === "2027") return "LIKE IT! LOVE IT!";
    if (lid === "2048") return "DIVE!";
    if (lid === "2081") return "Yada!";
    if (lid === "2009") return "Evergreen";
    if (lid === "2018") return "Koe Tsunagou yo";
    if (lid === "2028") return "Aion no Uta";
    if (lid === "2049") return "La Bella Patria";
    if (lid === "2082") return "Itsudatte for you!";
    if (lid === "2010") return "Dokipipo ☆ Emotion";
    if (lid === "2019") return "Teletelepathy";
    if (lid === "2029") return "Analog Heart";
    if (lid === "2050") return "Tsunagaru Connect";
    if (lid === "2083") return "First Love Again";
    if (lid === "2030") return "Ketsui no Hikari";
    if (lid === "2038") return "Aoi Kanaria";
    if (lid === "2084") return "Concentrate!";
    if (lid === "2105") return "EMOTION";
    if (lid === "2035") return "I'm Still...";
    if (lid === "2054") return "Toy Doll";
    if (lid === "2106") return "stars we chase";
    if (lid === "2036") return "Queendom";
    if (lid === "2055") return "Ye Mingzhu";
    if (lid === "2107") return "Eutopia";
    if (lid === "2997") return "MONSTER GIRLS (MV)";
    if (lid === "2998") return "I'm Still... (MV)";
    if (lid === "2999") return "Queendom (MV)";

    // Liella!
    if (lid === "3001") return "Hajimari wa Kimi no Sora";
    if (lid === "3002") return "START!! True dreams";
    if (lid === "3003") return "Mirai wa Kaze no You ni";
    if (lid === "3004") return "Mirai Yohou Hallelujah!";
    if (lid === "3007") return "Wish Song";

    throw new Error('Unknown Romaji Song Name for ' + liveId);
}

function skill(skill, removeTarget) {
    let eff = skillEffect(skill.effect_type, skill.effect_amount);
    return (removeTarget ? "" : skillTarget(skill.target)) + eff +
        skillFinish(skill.finish_type, skill.finish_amount, eff.indexOf("SP Voltage Gain") !== -1);
    // TODO: The parameter for isSPVoltageGainBuff is based on the skill effect strings above right now...
    //  so it's prone to typos and will break if translated
}

function skillTarget(targetId) {
    if (targetId === 1) return 'all units ';
    if (targetId === 29) return 'µ\'s units ';
    if (targetId === 30) return 'Aqours units ';
    if (targetId === 31) return 'Nijigaku units ';
    if (targetId === 35) return 'CYaRon units ';
    if (targetId === 36) return 'AZALEA units ';
    if (targetId === 37) return 'Guilty Kiss units ';
    if (targetId === 38) return '<span class="t vo">Vo</span> units ';
    if (targetId === 39) return '<span class="t sp">Sp</span> units ';
    if (targetId === 40) return '<span class="t gd">Gd</span> units ';
    if (targetId === 41) return '<span class="t sk">Sk</span> units ';
    if (targetId === 58) return ''; // no target (affecting SP charge or stamina)
    if (targetId === 61) return '<span class="a smile">Smile</span> units ';
    if (targetId === 62) return '<span class="a pure">Pure</span> units ';
    if (targetId === 63) return '<span class="a cool">Cool</span> units ';
    if (targetId === 64) return '<span class="a active">Active</span> units ';
    if (targetId === 65) return '<span class="a natural">Natural</span> units ';
    if (targetId === 66) return '<span class="a elegant">Elegant</span> units ';
    if (targetId === 67) return 'non-<span class="a smile">Smile</span> units ';
    if (targetId === 68) return 'non-<span class="t vo">Vo</span> units ';
    if (targetId === 69) return '1st Year units ';
    if (targetId === 70) return '2nd Year units ';
    if (targetId === 71) return '3rd Year units ';
    if (targetId === 72) return 'non-<span class="a pure">Pure</span> units ';
    if (targetId === 73) return 'non-<span class="a cool">Cool</span> units ';
    if (targetId === 74) return 'non-<span class="a active">Active</span> units ';
    if (targetId === 75) return 'non-<span class="a natural">Natural</span> units ';
    if (targetId === 76) return 'non-<span class="a elegant">Elegant</span> units ';
    if (targetId === 77) return 'non-<span class="t sp">Sp</span> units ';
    if (targetId === 78) return 'non-<span class="t gd">Gd</span> units ';
    if (targetId === 79) return 'non-<span class="t sk">Sk</span> units ';
    if (targetId === 83) return 'units in the current strategy ';
    if (targetId === 86) return 'non-µ\'s units ';
    if (targetId === 87) return 'non-<span class="t vo">Vo</span> or <span class="t gd">Gd</span> units ';
    if (targetId === 88) return 'non-<span class="t vo">Vo</span> or <span class="t sp">Sp</span> units ';
    if (targetId === 89) return 'non-<span class="t vo">Vo</span> or <span class="t sk">Sk</span> units ';
    if (targetId === 90) return 'non-<span class="t gd">Gd</span> or <span class="t sp">Sp</span> units ';
    if (targetId === 92) return 'non-<span class="t sp">Sp</span> or <span class="t sk">Sk</span> units ';
    if (targetId === 96) return '<span class="t vo">Vo</span> and <span class="t sk">Sk</span> units ';
    if (targetId === 97) return '<span class="t vo">Vo</span> and <span class="t sp">Sp</span> units ';
    if (targetId === 98) return '<span class="t vo">Vo</span> and <span class="t gd">Gd</span> units ';
    if (targetId === 99) return 'non-Aqours units ';
    if (targetId === 100) return 'non-Niji units ';
    if (targetId === 101) return 'non-1st Year units ';
    if (targetId === 102) return 'non-2nd Year units ';
    if (targetId === 103) return 'non-3rd Year units ';
    if (targetId === 104) return 'DiverDiva units ';
    if (targetId === 105) return 'A•ZU•NA units ';
    if (targetId === 106) return 'QU4RTZ units ';
    if (targetId === 107) return 'non-DiverDiva units ';
    if (targetId === 108) return 'non-A•ZU•NA units ';
    if (targetId === 109) return 'non-QU4RTZ units ';
    throw new Error('Unknown Skill Target ' + targetId);
}

function skillEffect(typeId, amount) {
    if (typeId === 3) return 'charge SP Gauge by ' + format(amount) + ' points';
    if (typeId === 4) return 'gain ' + format(amount) + ' points of shield';
    if (typeId === 5) return 'restore ' + format(amount) + ' points of stamina';
    if (typeId === 17) return 'gain ' + format(amount / 100) + '% Appeal';
    if (typeId === 18) return 'increase Voltage Gain by ' + format(amount / 100) + '%';
    if (typeId === 19) return 'gain ' + format(amount / 100) + '% SP Gauge Fill Rate';
    if (typeId === 20) return 'gain ' + format(amount / 100) + '% Critical Chance';
    if (typeId === 21) return 'gain ' + format(amount / 100) + '% Critical Power';
    if (typeId === 22) return 'gain ' + format(amount / 100) + '% Skill Activation Chance';
    if (typeId === 23) return 'increase SP Voltage Gain by ' + format(amount / 100) + '%';
    if (typeId === 26) return 'gain ' + format(amount / 100) + '% Base Appeal';
    if (typeId === 33) return 'gain ' + format(amount / 100) + '% Base Skill Activation Chance';
    if (typeId === 45) return 'gain ' + format(amount / 100) + '% Base SP Gauge Fill Rate';
    if (typeId === 46) return 'gain ' + format(amount / 100) + '% Base Critical Chance';
    if (typeId === 47) return 'gain ' + format(amount / 100) + '% Base Critical Power';
    if (typeId === 48) return 'gain ' + format(amount / 100) + '% Base Skill Activation Chance';
    if (typeId === 49) return 'gain ' + format(amount / 100) + '% Base Appeal';
    if (typeId === 50) return 'increase Base SP Voltage Gain by ' + format(amount / 100) + '%';
    if (typeId === 51) return 'increase Base Voltage Gain by ' + format(amount / 100) + '%';
    if (typeId === 52) return 'lose all buffs (excluding those affecting Base values)';
    if (typeId === 68) return 'take ' + format(amount) + ' points of stamina damage';
    if (typeId === 69) return 'discharge SP Gauge by ' + format(amount / 100) + '%';
    if (typeId === 70) return 'lose ' + format(amount) + ' points of shield';
    if (typeId === 71) return 'lose ' + format(amount / 100) + '% Appeal';
    if (typeId === 72) return 'lose ' + format(amount / 100) + '% Tap Voltage';
    if (typeId === 73) return 'lose ' + format(amount / 100) + '% SP Gauge Fill Rate';
    if (typeId === 75) return 'lose ' + format(amount / 100) + '% Critical Power';
    if (typeId === 76) return 'lose ' + format(amount / 100) + '% Skill Activation Chance';
    if (typeId === 78) return 'lose ' + format(amount / 100) + '% Base Skill Activation Chance';
    if (typeId === 79) return 'lose ' + format(amount / 100) + '% Base Tap Voltage';
    if (typeId === 81) return 'lose ' + format(amount / 100) + '% Base Appeal';
    if (typeId === 82) return 'lose ' + format(amount / 100) + '% Base Critical Chance';
    if (typeId === 83) return 'lose ' + format(amount / 100) + '% Base SP Gauge Fill Rate';
    if (typeId === 84) return 'lose ' + format(amount / 100) + '% Base Appeal';
    if (typeId === 85) return 'lose ' + format(amount / 100) + '% Base SP Gauge Fill Rate';
    if (typeId === 86) return 'lose ' + format(amount / 100) + '% Base Skill Activation Chance';
    if (typeId === 87) return 'lose ' + format(amount / 100) + '% Base Critical Chance';
    if (typeId === 91) return 'charge SP Gauge by ' + format(amount / 100) + '%';
    if (typeId === 93) return 'gain ' + format(amount / 100) + '% of max Stamina as shield';
    if (typeId === 96) return 'restore ' + format(amount / 100) + '% of max Stamina';
    if (typeId === 112) return 'charge SP Gauge by ' + format(amount / 100) + '% of the tapping card\'s Technique';
    if (typeId === 119) return 'gain ' + format(amount / 100) + '% Appeal for each <span class="t vo">Vo</span> unit in the formation';
    if (typeId === 120) return 'lose ' + format(amount / 100) + '% Appeal for each <span class="t vo">Vo</span> unit in the formation';
    if (typeId === 123) return 'gain ' + format(amount / 100) + '% Appeal for each <span class="t sk">Sk</span> unit in the formation';
    if (typeId === 128) return 'restore ' + format(amount) + ' points of stamina for each <span class="t vo">Vo</span> unit in the formation';
    if (typeId === 130) return 'restore ' + format(amount) + ' points of stamina for each <span class="t sp">Sp</span> unit in the formation';
    if (typeId === 132) return 'restore ' + format(amount) + ' points of stamina for each <span class="t sk">Sk</span> unit in the formation';
    if (typeId === 134) return 'restore ' + format(amount) + ' points of stamina for each <span class="t gd">Gd</span> unit in the formation';
    if (typeId === 137) return 'gain ' + format(amount / 100) + '% Base Appeal for each <span class="t vo">Vo</span> unit in the formation';
    if (typeId === 139) return 'gain ' + format(amount / 100) + '% Base Appeal for each <span class="t sp">Sp</span> unit in the formation';
    if (typeId === 141) return 'gain ' + format(amount / 100) + '% Base Appeal for each <span class="t sk">Sk</span> unit in the formation';
    if (typeId === 143) return 'gain ' + format(amount / 100) + '% Base Appeal for each <span class="t gd">Gd</span> unit in the formation';
    if (typeId === 161) return 'gain ' + format(amount / 100) + '% Skill Activation Chance for each <span class="t vo">Vo</span> unit in the formation';
    if (typeId === 163) return 'gain ' + format(amount / 100) + '% Skill Activation Chance for each <span class="t sk">Sk</span> unit in the formation';
    if (typeId === 164) return 'gain ' + format(amount / 100) + '% Skill Activation Chance for each <span class="t gd">Gd</span> unit in the formation';
    if (typeId === 169) return 'gain ' + format(amount / 100) + '% Base Skill Activation Chance for each <span class="t vo">Vo</span> unit in the formation';
    if (typeId === 170) return 'gain ' + format(amount / 100) + '% Base Skill Activation Chance for each <span class="t sp">Sp</span> unit in the formation';
    if (typeId === 171) return 'gain ' + format(amount / 100) + '% Base Skill Activation Chance for each <span class="t sk">Sk</span> unit in the formation';
    if (typeId === 172) return 'gain ' + format(amount / 100) + '% Base Skill Activation Chance for each <span class="t gd">Gd</span> unit in the formation';
    if (typeId === 179) return 'gain ' + format(amount / 100) + '% Critical Chance for each <span class="t sk">Sk</span> unit in the formation';
    if (typeId === 185) return 'gain ' + format(amount / 100) + '% Base Critical Chance for each <span class="t vo">Vo</span> unit in the formation';
    if (typeId === 187) return 'gain ' + format(amount / 100) + '% Base Critical Chance for each <span class="t sk">Sk</span> unit in the formation';
    if (typeId === 193) return 'gain ' + format(amount / 100) + '% Critical Power for each <span class="t vo">Vo</span> unit in the formation';
    if (typeId === 210) return 'increase SP Voltage Gain by ' + format(amount / 100) + '% for each <span class="t sp">Sp</span> unit in the formation';
    if (typeId === 218) return 'increase Base SP Voltage Gain by ' + format(amount / 100) + '% for each <span class="t sp">Sp</span> unit in the formation';
    if (typeId === 219) return 'increase Base SP Voltage Gain by ' + format(amount / 100) + '% for each <span class="t sk">Sk</span> unit in the formation';
    if (typeId === 229) return 'increase the cooldown reduction from their Strategy Switch bonus by ' + format(amount) + ' turns';
    if (typeId === 230) return 'increase SP gained from their Strategy Switch bonus by ' + format(amount) + ' points';
    if (typeId === 263) return 'take ' + format(amount / 100) + '% of max Stamina as damage, bypassing Shield';
    if (typeId === 265) return 'block Healing';
    throw new Error('Unknown Skill Effect Type ' + typeId);
}

function skillFinish(conditionId, amount, isSPVoltageGainBuff) {
    if (conditionId === 1) return ' until the song ends'
    if (conditionId === 2) return ' for ' + format(amount) + ' notes'
    if (conditionId === 3) return "" // instant effect (affecting SP charge or stamina)
    if (conditionId === 4) return "" // until AC ends (this is handled in the trigger switch below)
    if (conditionId === 7) {
        if (isSPVoltageGainBuff) {
            if (amount == 1) return ' for the next SP Skill'
            else return ' for the next ' + amount + ' SP Skills'
        } else {
            if (amount == 1) return ' until a SP Skill is used'
            else return ' until ' + amount + ' SP Skills are used'
        }
    }
    if (conditionId === 8) return ' until the next Strategy switch'
    throw new Error('Unknown Skill Finish Condition ' + conditionId);
}

function isCleansable(skill) {
    // TODO: This is based on the skill effect strings above right now... so it's prone to typos and will break if translated
    if (skill === null) return "-";
    return skillEffect(skill.effect_type, 0).indexOf("Base") === -1;
}

function acMission(typeId, goal) {
    if (typeId === ACMissionType.VOLTAGE_TOTAL) return 'Get ' + format(goal) + ' Voltage';
    if (typeId === ACMissionType.TIMING_NICE) return 'Hit ' + format(goal) + ' NICEs';
    if (typeId === ACMissionType.TIMING_GREAT) return 'Hit ' + format(goal) + ' GREATs';
    if (typeId === ACMissionType.TIMING_WONDERFUL) return 'Hit ' + format(goal) + ' WONDERFULs';
    if (typeId === ACMissionType.VOLTAGE_SINGLE) return 'Get ' + format(goal) + ' Voltage in one Appeal';
    if (typeId === ACMissionType.VOLTAGE_SP) return 'Get ' + format(goal) + ' Voltage from SP';
    if (typeId === ACMissionType.UNIQUE) return 'Appeal with ' + format(goal) + ' unique Units';
    if (typeId === ACMissionType.CRITICALS) return 'Get ' + format(goal) + ' Criticals';
    if (typeId === ACMissionType.SKILLS) return 'Activate ' + format(goal) + ' Tap Skills';
    if (typeId === ACMissionType.STAMINA) {
        if (goal === 10000) return 'Finish the AC with ' + format(goal / 100) + '% of max Stamina';
        else return 'Finish the AC with ' + format(goal / 100) + '% of max Stamina or more';
    }
    throw new Error('Unknown AC Mission Type ' + typeId);
}

function acColor(typeId) {
    if (typeId === ACMissionType.VOLTAGE_TOTAL) return 'vo';
    if (typeId === ACMissionType.TIMING_NICE) return 'sk';
    if (typeId === ACMissionType.TIMING_GREAT) return 'sk';
    if (typeId === ACMissionType.TIMING_WONDERFUL) return 'sk';
    if (typeId === ACMissionType.VOLTAGE_SINGLE) return 'vo';
    if (typeId === ACMissionType.VOLTAGE_SP) return 'sp';
    if (typeId === ACMissionType.UNIQUE) return 'vo';
    if (typeId === ACMissionType.CRITICALS) return 'sk';
    if (typeId === ACMissionType.SKILLS) return 'sk';
    if (typeId === ACMissionType.STAMINA) return 'gd';
    throw new Error('Unknown AC Mission Type ' + typeId);
}

function makeNotemap(liveData) {
    try {
        const liveInfo = {
            hasNoteMap: liveData.notes !== null,
            hasSongGimmicks: liveData.gimmick !== null,
            noteGimmicks: [],
            appealChances: []
        };
        const gimmickCounts = {};

        if (liveInfo.hasNoteMap) {
            liveInfo.notes = [];

            const firstNoteTime = liveData.notes[0].time;
            const lastNoteTime = liveData.notes[liveData.notes.length - 1].time;
            // notes are placed in the center 98% of the timeline, but we need the total time covered for timing
            const mapLength = (lastNoteTime - firstNoteTime);

            // Stackers to assign the gimmick markers to layers to avoid overlapping
            // Each stacker is an array, one number per layer, keeping track of the position where the last marker on
            // that layer ends ("occupied until this position"). When adding a marker, its start position can be
            // compared with that saved value to find the first free layer.
            // There is one global stacker (default view) and one per gimmick (filtered gimmick view).
            const stackerGlobal = [];
            const stackerPerGimmick = liveData.note_gimmicks.map(_ => []);

            for (let ni = 0; ni < liveData.notes.length; ni++) {
                const note = liveData.notes[ni];
                const noteData = {
                    index: ni,
                    positionRelative: (note.time - firstNoteTime) / mapLength,
                    cssClass: (note.rail == 1 ? 'top' : 'bottom'),
                    hasGimmick: note.gimmick !== null,
                    isHold: note.type === NoteType.HOLD_START
                };

                if (noteData.isHold) {
                    let endNi = ni + 1;
                    while (liveData.notes[endNi].rail !== note.rail || liveData.notes[endNi].type !== NoteType.HOLD_END) {
                        endNi++;
                    }
                    noteData.holdLengthRelative = (liveData.notes[endNi].time - note.time) / mapLength;
                }

                if (noteData.hasGimmick) {
                    if (gimmickCounts[note.gimmick] === undefined) {
                        gimmickCounts[note.gimmick] = 0;
                    }
                    gimmickCounts[note.gimmick]++;

                    const positionRelative = (note.time - firstNoteTime) / mapLength;

                    let globalLayer = 0;
                    while (globalLayer < stackerGlobal.length
                    && stackerGlobal[globalLayer] > positionRelative) {
                        globalLayer++;
                    }
                    if (globalLayer == stackerGlobal.length)
                        stackerGlobal.push(0); // new layer required

                    let thisGimmickLayer = 0;
                    while (thisGimmickLayer < stackerPerGimmick[note.gimmick].length
                    && stackerPerGimmick[note.gimmick][thisGimmickLayer] > positionRelative) {
                        thisGimmickLayer++;
                    }
                    if (thisGimmickLayer == stackerPerGimmick[note.gimmick].length)
                        stackerPerGimmick[note.gimmick].push(0); // new layer required

                    const gimmickMarkerData = {
                        gimmickIndex: note.gimmick,
                        noteIndex: ni,
                        hasLength: liveData.note_gimmicks[note.gimmick].finish_type === SkillFinishType.NOTE_COUNT,
                        positionRelative, globalLayer, thisGimmickLayer
                    };

                    if (gimmickMarkerData.hasLength) {
                        let endNi = ni + liveData.note_gimmicks[note.gimmick].finish_amount;
                        if (endNi >= liveData.notes.length) endNi = liveData.notes.length - 1;
                        gimmickMarkerData.lengthRelative = (liveData.notes[endNi].time - note.time) / mapLength;

                        // magic value (TM) to avoid unneccessary stacks due to float precision loss
                        stackerGlobal[globalLayer] = stackerPerGimmick[note.gimmick][thisGimmickLayer]
                            = positionRelative + gimmickMarkerData.lengthRelative - 0.0001;
                    } else {
                        // magic value (TM) to avoid too much overlap of no-length markers
                        stackerGlobal[globalLayer] = stackerPerGimmick[note.gimmick][thisGimmickLayer]
                            = positionRelative + 0.0075;
                    }

                    noteData.gimmickMarker = gimmickMarkerData;
                }

                liveInfo.notes.push(noteData);
            }

            liveInfo.mapInfo = {
                noteCount: format(liveData.notes.length),
                markerLayerCount: stackerGlobal.length,
                mapLength: mapLength,
                hasActualSongLength: liveData.song_length !== undefined
            };
            if (liveInfo.mapInfo.hasActualSongLength) {
                const min = Math.floor(liveData.song_length / 60000);
                const sec = Math.floor(liveData.song_length % 60000 / 1000);
                liveInfo.mapInfo.songLength = min + ':' + (sec < 10 ? '0' : '') + sec;
            }
        }

        if (liveInfo.hasSongGimmicks) {
            liveInfo.songGimmicks = liveData.gimmick.map((gimmick, index) => {
                let skillstr = capitalizeFirstLetter(skill(gimmick, false));
                if (gimmick.finish_type === SkillFinishType.UNTIL_SONG_END) {
                    // remove " until the song ends" if that is the condition - pretty much implied through being the song gimmick
                    skillstr = skillstr.substring(0, skillstr.length - 20);
                }

                return {
                    index,
                    skill: skillstr,
                    isCleansable: isCleansable(gimmick)
                }
            });
        }

        for (let gi = 0; gi < liveData.note_gimmicks.length; gi++) {
            let skillstr;
            let remove_target = false;
            switch (liveData.note_gimmicks[gi].trigger) {
                case NoteGimmickTrigger.ON_HIT:
                    skillstr = "If hit, ";
                    break;
                case NoteGimmickTrigger.ON_MISS:
                    skillstr = "If missed, ";
                    break;
                case NoteGimmickTrigger.ALWAYS:
                    skillstr = ""; // always
                    break;
                case NoteGimmickTrigger.ON_VO_HIT:
                    skillstr = 'If hit with a <span class="t vo">Vo</span> unit, ';
                    remove_target = liveData.note_gimmicks[gi].target == 38;
                    break;
                case NoteGimmickTrigger.ON_SP_HIT:
                    skillstr = 'If hit with an <span class="t sp">Sp</span> unit, ';
                    remove_target = liveData.note_gimmicks[gi].target == 39;
                    break;
                case NoteGimmickTrigger.ON_SK_HIT:
                    skillstr = 'If hit with an <span class="t sk">Sk</span> unit, ';
                    remove_target = liveData.note_gimmicks[gi].target == 41;
                    break;
                default:
                    throw new Error('Unknown Note Gimmick Trigger ' + liveData.note_gimmicks[gi].trigger);
            }

            skillstr += skill(liveData.note_gimmicks[gi], remove_target);
            if (liveData.note_gimmicks[gi].trigger === NoteGimmickTrigger.ALWAYS) {
                skillstr = capitalizeFirstLetter(skillstr);
            }

            const noteGimmickData = {
                index: gi,
                skill: skillstr
            };

            if (liveInfo.hasNoteMap) {
                noteGimmickData.count = gimmickCounts[gi];
            }

            liveInfo.noteGimmicks.push(noteGimmickData);
        }

        let totalACNotes = 0;
        let totalACReward = 0;
        for (let ai = 0; ai < liveData.appeal_chances.length; ai++) {
            const ac = liveData.appeal_chances[ai];
            const acData = {
                index: ai,
                cssClass: acColor(ac.mission_type),
                mission: acMission(ac.mission_type, ac.mission_value),
                hasGimmick: ac.gimmick !== null,
                hasPerNoteInfo: false
            };

            let skillstr;
            if (acData.hasGimmick) {
                switch (ac.gimmick.trigger) {
                    case ACGimmickTrigger.ON_START:
                        skillstr = (ac.gimmick.finish_type === SkillFinishType.UNTIL_AC_END)
                            ? "During this AC, "
                            : "When the AC starts, ";
                        break;
                    case ACGimmickTrigger.ON_SUCCESS:
                        skillstr = "On AC Success, ";
                        break;
                    case ACGimmickTrigger.ON_FAIL:
                        skillstr = "On AC Failure, ";
                        break;
                    case ACGimmickTrigger.ON_END:
                        skillstr = "At the end of the AC, ";
                        break;
                    default:
                        throw new Error('Unknown AC Gimmick Trigger ' + ac.gimmick.trigger);
                }
                skillstr += skill(ac.gimmick, false);
                acData.gimmick = skillstr;
            }

            if (liveInfo.hasNoteMap) {
                const mapLength = (liveData.notes[liveData.notes.length - 1].time - liveData.notes[0].time);
                acData.startRelative = (liveData.notes[ac.range_note_ids[0]].time - liveData.notes[0].time) / mapLength;
                acData.lengthRelative
                    = (liveData.notes[ac.range_note_ids[1]].time - liveData.notes[ac.range_note_ids[0]].time) / mapLength;

                acData.length = ac.range_note_ids[1] - ac.range_note_ids[0] + 1;
                totalACNotes += acData.length;
                totalACReward += ac.reward_voltage;

                if (ac.mission_type === ACMissionType.VOLTAGE_TOTAL) {
                    acData.hasPerNoteInfo = true;
                    acData.perNoteInfo = "(avg. "
                        + format(Math.ceil(ac.mission_value / acData.length))
                        + " Voltage per note)";
                } else if (ac.mission_type === ACMissionType.CRITICALS) {
                    acData.hasPerNoteInfo = true;
                    acData.perNoteInfo = "("
                        + format(Math.ceil(ac.mission_value / acData.length * 100))
                        + "% of notes must crit)";
                } else if (ac.mission_type === ACMissionType.SKILLS) {
                    acData.hasPerNoteInfo = true;
                    acData.perNoteInfo = "("
                        + format(Math.ceil(ac.mission_value / acData.length * 100))
                        + "% of taps must proc)";
                }
                acData.rewardVoltage = format(ac.reward_voltage);
                acData.penaltyDamage = format(ac.penalty_damage);
            }
            liveInfo.appealChances.push(acData);
        }
        if (liveInfo.hasNoteMap) {
            liveInfo.mapInfo.totalACNotes
                = format(totalACNotes) + " (" + format(Math.round((totalACNotes / liveData.notes.length) * 100)) + "%)";
            liveInfo.mapInfo.totalACReward = format(totalACReward);
            liveInfo.mapInfo.totalNoteDamage
                = format(liveData.notes.length * liveData.note_damage + totalACNotes * Math.floor(liveData.note_damage / 10));
        }

        return liveInfo;
    } catch (e) {
        console.log("In Live " + liveData.live_id + " (Diff " + liveData.song_difficulty + "): " + e.stack);
        throw e;
    }
}

module.exports = {
    make: makeNotemap,
    attributeName,
    difficultyName,
    difficultyNameShort,
    isCleansable,
    format,
    songNameRomaji
};
