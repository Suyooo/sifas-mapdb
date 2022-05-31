/*
This module creates the HTML code for the note map timeline and panels for gimmick/AC info, used for the map DB pages.
Copyright (C) 2020 Suyooo

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

const fs = require('fs');

function capFirstLetter(s) {
    return s.substring(0, 1).toUpperCase() + s.substring(1);
}

function format(x) {
    // https://stackoverflow.com/a/2901298
    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "&#8239;");
    return parts.join(".");
}

function attribute(attr_id) {
    if (attr_id === 1) return "smile";
    if (attr_id === 2) return "pure";
    if (attr_id === 3) return "cool";
    if (attr_id === 4) return "active";
    if (attr_id === 5) return "natural";
    if (attr_id === 6) return "elegant";
    if (attr_id === 9) return "none";
    throw new Error('Unknown Attribute ' + attr_id);
}

function difficulty(diff_id) {
    if (diff_id === 10) return "Beginner";
    if (diff_id === 20) return "Intermediate";
    if (diff_id === 30) return "Advanced";
    if (diff_id === 35) return "Advanced+";
    if (diff_id === 37) return "Challenge";
    throw new Error('Unknown Difficulty ' + diff_id);
}

function difficulty_short(diff_id) {
    if (diff_id === 10) return "Beg";
    if (diff_id === 20) return "Int";
    if (diff_id === 30) return "Adv";
    if (diff_id === 35) return "Adv+";
    if (diff_id === 37) return "Ch";
    throw new Error('Unknown Difficulty ' + diff_id);
}


function song_name_romaji(live_id) {
    let lid = ("" + live_id).substring(1);

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
    if (lid === "2062") return "Sweet Eyes";
    if (lid === "2063") return "Zensoku Dreamer";
    if (lid === "2051") return "Yume ga Koko Kara Hajimaru yo";
    if (lid === "2061") return "Mirai Harmony";
    if (lid === "2037") return "Love U my friends";
    if (lid === "2057") return "Nijiiro Passions!";
    if (lid === "2058") return "NEO SKY, NEO MAP!";
    if (lid === "2059") return "Yume ga Koko Kara Hajimaru yo";
    if (lid === "2060") return "Just Believe!!!";
    if (lid === "2074") return "L!L!L! (Love the Life We Live)";
    if (lid === "2096") return "Just Believe!!! (12 Member Ver.)";
    if (lid === "2109") return "Just Believe!!! (12 Member Ver.)";
    if (lid === "2099") return "Colorful Dreams! Colorful Smiles!";
    if (lid === "2100") return "Yume ga Bokura no Taiyou sa";
    if (lid === "2073") return "Hurray Hurray";
    if (lid === "2031") return "SUPER NOVA";
    if (lid === "2067") return "POWER SPOT!!";
    if (lid === "2066") return "Love Triangle";
    if (lid === "2070") return "Saika -saika-";
    if (lid === "2088") return "THE SECRET NiGHT";
    if (lid === "2089") return "Fly into the sky";
    if (lid === "2085") return "SUPER NOVA";
    if (lid === "2102") return "Eternal Light";
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

    throw new Error('Unknown Romaji Song Name for ' + live_id);
}

function skill(skill) {
    return (skill.finish_type === 3 ? "" : skill_target(skill.target)) +
        skill_effect(skill.effect_type, skill.effect_amount) +
        skill_finish(skill.finish_type, skill.finish_amount);
}

function skill_target(target_id) {
    if (target_id === 1) return 'all units ';
    if (target_id === 29) return 'µ\'s units ';
    if (target_id === 30) return 'Aqours units ';
    if (target_id === 31) return 'Nijigaku units ';
    if (target_id === 38) return '<span class="t vo">Vo</span> units ';
    if (target_id === 39) return '<span class="t sp">Sp</span> units ';
    if (target_id === 40) return '<span class="t gd">Gd</span> units ';
    if (target_id === 41) return '<span class="t sk">Sk</span> units ';
    if (target_id === 58) return ''; // no target (affecting SP charge or stamina)
    if (target_id === 61) return '<span class="a smile">Smile</span> units ';
    if (target_id === 62) return '<span class="a pure">Pure</span> units ';
    if (target_id === 63) return '<span class="a cool">Cool</span> units ';
    if (target_id === 64) return '<span class="a active">Active</span> units ';
    if (target_id === 65) return '<span class="a natural">Natural</span> units ';
    if (target_id === 66) return '<span class="a elegant">Elegant</span> units ';
    if (target_id === 67) return 'non-<span class="a smile">Smile</span> units ';
    if (target_id === 68) return 'non-<span class="t vo">Vo</span> units ';
    if (target_id === 69) return '1st Year units ';
    if (target_id === 70) return '2nd Year units ';
    if (target_id === 71) return '3rd Year units ';
    if (target_id === 72) return 'non-<span class="a pure">Pure</span> units ';
    if (target_id === 73) return 'non-<span class="a cool">Cool</span> units ';
    if (target_id === 74) return 'non-<span class="a active">Active</span> units ';
    if (target_id === 75) return 'non-<span class="a natural">Natural</span> units ';
    if (target_id === 76) return 'non-<span class="a elegant">Elegant</span> units ';
    if (target_id === 77) return 'non-<span class="t sp">Sp</span> units ';
    if (target_id === 78) return 'non-<span class="t gd">Gd</span> units ';
    if (target_id === 79) return 'non-<span class="t sk">Sk</span> units ';
    if (target_id === 83) return 'units in the current strategy ';
    if (target_id === 86) return 'non-µ\'s units ';
    if (target_id === 87) return 'non-<span class="t vo">Vo</span> or <span class="t gd">Gd</span> units ';
    if (target_id === 88) return 'non-<span class="t vo">Vo</span> or <span class="t sp">Sp</span> units ';
    if (target_id === 89) return 'non-<span class="t vo">Vo</span> or <span class="t sk">Sk</span> units ';
    if (target_id === 90) return 'non-<span class="t gd">Gd</span> or <span class="t sp">Sp</span> units ';
    if (target_id === 92) return 'non-<span class="t sp">Sp</span> or <span class="t sk">Sk</span> units ';
    if (target_id === 96) return '<span class="t vo">Vo</span> and <span class="t sk">Sk</span> units ';
    if (target_id === 97) return '<span class="t vo">Vo</span> and <span class="t sp">Sp</span> units ';
    if (target_id === 98) return '<span class="t vo">Vo</span> and <span class="t gd">Gd</span> units ';
    if (target_id === 99) return 'non-Aqours units ';
    if (target_id === 100) return 'non-Niji units ';
    if (target_id === 101) return 'non-1st Year units ';
    if (target_id === 102) return 'non-2nd Year units ';
    if (target_id === 103) return 'non-3rd Year units ';
    if (target_id === 104) return 'DiverDiva units ';
    if (target_id === 105) return 'A•ZU•NA units ';
    if (target_id === 106) return 'QU4RTZ units ';
    if (target_id === 107) return 'non-DiverDiva units ';
    if (target_id === 108) return 'non-A•ZU•NA units ';
    if (target_id === 109) return 'non-QU4RTZ units ';
    throw new Error('Unknown Skill Target ' + target_id);
}

function skill_effect(type_id, amount) {
    if (type_id === 3) return 'charge SP Gauge by ' + format(amount) + ' points';
    if (type_id === 4) return 'gain ' + format(amount) + ' points of shield';
    if (type_id === 5) return 'restore ' + format(amount) + ' points of stamina';
    if (type_id === 17) return 'gain ' + format(amount / 100) + '% Appeal';
    if (type_id === 18) return 'increase Voltage Gain by ' + format(amount / 100) + '%';
    if (type_id === 19) return 'gain ' + format(amount / 100) + '% SP Gauge Fill Rate';
    if (type_id === 20) return 'gain ' + format(amount / 100) + '% Critical Chance';
    if (type_id === 21) return 'gain ' + format(amount / 100) + '% Critical Power';
    if (type_id === 22) return 'gain ' + format(amount / 100) + '% Skill Activation Chance';
    if (type_id === 23) return 'increase SP Voltage Gain by ' + format(amount / 100) + '%';
    if (type_id === 26) return 'gain ' + format(amount / 100) + '% Base Appeal';
    if (type_id === 33) return 'gain ' + format(amount / 100) + '% Base Skill Activation Chance';
    if (type_id === 45) return 'gain ' + format(amount / 100) + '% Base SP Gauge Fill Rate';
    if (type_id === 46) return 'gain ' + format(amount / 100) + '% Base Critical Chance';
    if (type_id === 47) return 'gain ' + format(amount / 100) + '% Base Critical Power';
    if (type_id === 48) return 'gain ' + format(amount / 100) + '% Base Skill Activation Chance';
    if (type_id === 49) return 'gain ' + format(amount / 100) + '% Base Appeal';
    if (type_id === 50) return 'increase Base SP Voltage Gain by ' + format(amount / 100) + '%';
    if (type_id === 51) return 'increase Base Voltage Gain by ' + format(amount / 100) + '%';
    if (type_id === 52) return 'remove all buffs (excluding those affecting Base values)';
    if (type_id === 68) return 'take ' + format(amount) + ' points of stamina damage';
    if (type_id === 69) return 'discharge SP Gauge by ' + format(amount / 100) + '%';
    if (type_id === 70) return 'lose ' + format(amount) + ' points of shield';
    if (type_id === 71) return 'lose ' + format(amount / 100) + '% Appeal';
    if (type_id === 73) return 'lose ' + format(amount / 100) + '% SP Gauge Fill Rate';
    if (type_id === 75) return 'lose ' + format(amount / 100) + '% Critical Power';
    if (type_id === 76) return 'lose ' + format(amount / 100) + '% Skill Activation Chance';
    if (type_id === 78) return 'lose ' + format(amount / 100) + '% Base Skill Activation Chance';
    if (type_id === 81) return 'lose ' + format(amount / 100) + '% Base Appeal';
    if (type_id === 82) return 'lose ' + format(amount / 100) + '% Base Critical Chance';
    if (type_id === 83) return 'lose ' + format(amount / 100) + '% Base SP Gauge Fill Rate';
    if (type_id === 84) return 'lose ' + format(amount / 100) + '% Base Appeal';
    if (type_id === 85) return 'lose ' + format(amount / 100) + '% Base SP Gauge Fill Rate';
    if (type_id === 86) return 'lose ' + format(amount / 100) + '% Base Skill Activation Chance';
    if (type_id === 87) return 'lose ' + format(amount / 100) + '% Base Critical Chance';
    if (type_id === 91) return 'charge SP Gauge by ' + format(amount / 100) + '%';
    if (type_id === 93) return 'gain ' + format(amount / 100) + '% of max Stamina as shield';
    if (type_id === 96) return 'restore ' + format(amount / 100) + '% of max Stamina';
    if (type_id === 119) return 'gain ' + format(amount / 100) + '% Appeal for each <span class="t vo">Vo</span> unit in the formation';
    if (type_id === 128) return 'restore ' + format(amount) + ' points of stamina for each <span class="t vo">Vo</span> unit in the formation';
    if (type_id === 130) return 'restore ' + format(amount) + ' points of stamina for each <span class="t sp">Sp</span> unit in the formation';
    if (type_id === 132) return 'restore ' + format(amount) + ' points of stamina for each <span class="t sk">Sk</span> unit in the formation';
    if (type_id === 134) return 'restore ' + format(amount) + ' points of stamina for each <span class="t gd">Gd</span> unit in the formation';
    if (type_id === 137) return 'gain ' + format(amount / 100) + '% Base Appeal for each <span class="t vo">Vo</span> unit in the formation';
    if (type_id === 139) return 'gain ' + format(amount / 100) + '% Base Appeal for each <span class="t sp">Sp</span> unit in the formation';
    if (type_id === 141) return 'gain ' + format(amount / 100) + '% Base Appeal for each <span class="t sk">Sk</span> unit in the formation';
    if (type_id === 143) return 'gain ' + format(amount / 100) + '% Base Appeal for each <span class="t gd">Gd</span> unit in the formation';
    if (type_id === 161) return 'gain ' + format(amount / 100) + '% Skill Activation Chance for each <span class="t sk">Vo</span> unit in the formation';
    if (type_id === 163) return 'gain ' + format(amount / 100) + '% Skill Activation Chance for each <span class="t sk">Sk</span> unit in the formation';
    if (type_id === 164) return 'gain ' + format(amount / 100) + '% Skill Activation Chance for each <span class="t gd">Gd</span> unit in the formation';
    if (type_id === 169) return 'gain ' + format(amount / 100) + '% Base Skill Activation Chance for each <span class="t vo">Vo</span> unit in the formation';
    if (type_id === 170) return 'gain ' + format(amount / 100) + '% Base Skill Activation Chance for each <span class="t sp">Sp</span> unit in the formation';
    if (type_id === 171) return 'gain ' + format(amount / 100) + '% Base Skill Activation Chance for each <span class="t sk">Sk</span> unit in the formation';
    if (type_id === 172) return 'gain ' + format(amount / 100) + '% Base Skill Activation Chance for each <span class="t gd">Gd</span> unit in the formation';
    if (type_id === 179) return 'gain ' + format(amount / 100) + '% Critical Chance for each <span class="t sk">Sk</span> unit in the formation';
    if (type_id === 185) return 'gain ' + format(amount / 100) + '% Base Critical Chance for each <span class="t vo">Vo</span> unit in the formation';
    if (type_id === 187) return 'gain ' + format(amount / 100) + '% Base Critical Chance for each <span class="t sk">Sk</span> unit in the formation';
    if (type_id === 193) return 'gain ' + format(amount / 100) + '% Critical Power for each <span class="t vo">Vo</span> unit in the formation';
    if (type_id === 210) return 'increase SP Voltage Gain by ' + format(amount / 100) + '% for each <span class="t sp">Sp</span> unit in the formation';
    if (type_id === 218) return 'increase Base SP Voltage Gain by ' + format(amount / 100) + '% for each <span class="t sp">Sp</span> unit in the formation';
    if (type_id === 219) return 'increase Base SP Voltage Gain by ' + format(amount / 100) + '% for each <span class="t sk">Sk</span> unit in the formation';
    if (type_id === 230) return 'increase the power of their Strategy Switch bonus by ' + format(amount) + ' points';
    if (type_id === 263) return 'take ' + format(amount / 100) + '% of max Stamina as damage, bypassing Shield';
    if (type_id === 265) return 'block Healing';
    throw new Error('Unknown Skill Effect Type ' + type_id);
}

function skill_finish(condition_id, amount) {
    if (condition_id === 1) return ' until the song ends'
    if (condition_id === 2) return ' for ' + format(amount) + ' notes'
    if (condition_id === 3) return "" // instant effect (affecting SP charge or stamina)
    if (condition_id === 4) return "" // until AC ends (this is handled in the trigger switch below)
    if (condition_id === 7) return ' for one time only'
    if (condition_id === 8) return ' until the next Strategy switch'
    throw new Error('Unknown Skill Finish Condition ' + condition_id);
}

function is_cleansable(skill) {
    // TODO: This is based on the skill effect strings above right now... subject to typos and will break if translated
    if (skill === null) return "-";
    return skill_effect(skill.effect_type, 0).indexOf("Base") === -1 ? "Yes" : "No";
}

function ac_mission(type_id, goal) {
    if (type_id === 1) return 'Get ' + format(goal) + ' Voltage';
    if (type_id === 2) return 'Hit ' + format(goal) + ' NICEs';
    if (type_id === 3) return 'Hit ' + format(goal) + ' GREATs';
    if (type_id === 4) return 'Hit ' + format(goal) + ' WONDERFULs';
    if (type_id === 5) return 'Get ' + format(goal) + ' Voltage in one Appeal';
    if (type_id === 6) return 'Get ' + format(goal) + ' Voltage from SP';
    if (type_id === 7) return 'Appeal with ' + format(goal) + ' unique Units';
    if (type_id === 8) return 'Get ' + format(goal) + ' Criticals';
    if (type_id === 9) return 'Activate ' + format(goal) + ' Tap Skills';
    if (type_id === 16) return 'Finish the AC with ' + format(goal / 100) + '% of max Stamina or more';
    throw new Error('Unknown AC Mission Type ' + type_id);
}

function ac_colour(type_id) {
    if (type_id === 1) return 'vo';
    if (type_id === 2) return 'sk';
    if (type_id === 3) return 'sk';
    if (type_id === 4) return 'sk';
    if (type_id === 5) return 'vo';
    if (type_id === 6) return 'sp';
    if (type_id === 7) return 'vo';
    if (type_id === 8) return 'sk';
    if (type_id === 9) return 'sk';
    if (type_id === 16) return 'gd';
    throw new Error('Unknown AC Mission Type ' + type_id);
}

function make_notemap(live) {
    try {
        let s = "";

        if (live.notes !== null) {
            let firstnote_time = live.notes[0].time;
            let lastnote_time = live.notes[live.notes.length - 1].time;
            // notes are placed in the center 98% of the timeline, but we need the total time covered for timing
            let length_notes_only = (lastnote_time - firstnote_time) / 98 * 100;

            let total_ac_notes = 0;
            let total_ac_rewards = 0;
            for (let ai = 0; ai < live.appeal_chances.length; ai++) {
                let ac = live.appeal_chances[ai];
                let start = live.notes[ac.range_note_ids[0]].time;
                let length = live.notes[ac.range_note_ids[1]].time - start;

                s += '<div data-ac="' + ai + '" class="appealchance ' + ac_colour(ac.mission_type) + '" style="' +
                    'left: ' + ((start - firstnote_time) / (lastnote_time - firstnote_time) * 98 + 1) + '%;' +
                    'width: ' + (length / (lastnote_time - firstnote_time) * 98) + '%;">' +
                    '&nbsp;</div>';
                total_ac_notes += ac.range_note_ids[1] - ac.range_note_ids[0] + 1;
                total_ac_rewards += ac.reward_voltage;
            }

            let stacker_global = [];
            let stacker_seperate = [];
            for (let gi = 0; gi < live.note_gimmicks.length; gi++) {
                stacker_seperate.push([]);
            }
            for (let ni = 0; ni < live.notes.length; ni++) {
                let note = live.notes[ni];

                s += '<div class="note ' + (note.rail == 1 ? 'top' : 'bottom') + (note.gimmick !== null ? ' gimmicked' : '') +
                    '" style="left: calc(' + ((note.time - firstnote_time) / (lastnote_time - firstnote_time) * 98 + 1) + '% - 1px);">' +
                    '&nbsp;</div>';
                if (note.type === 2) {
                    let ni2 = ni + 1;
                    while (live.notes[ni2].rail !== note.rail) ni2++;
                    s += '<div class="hold ' + (note.rail == 1 ? 'top' : 'bottom')
                        + '" style="left: calc(' + ((note.time - firstnote_time) / (lastnote_time - firstnote_time) * 98 + 1) + '% - 1px);' +
                        'width: ' + ((live.notes[ni2].time - note.time) / (lastnote_time - firstnote_time) * 98) + '%;">' +
                        '&nbsp;</div>';
                }
                if (note.gimmick !== null) {
                    if (live.note_gimmicks[note.gimmick].counter === undefined) live.note_gimmicks[note.gimmick].counter = 1;
                    else live.note_gimmicks[note.gimmick].counter += 1;

                    let marker_position = ((note.time - firstnote_time) / (lastnote_time - firstnote_time) * 98 + 1);

                    let stack_layer_global = 0;
                    while (stack_layer_global < stacker_global.length && stacker_global[stack_layer_global] > marker_position) {
                        stack_layer_global++;
                    }
                    if (stack_layer_global == stacker_global.length) stacker_global.push(0);

                    let stack_layer_seperate = 0;
                    while (stack_layer_seperate < stacker_seperate[note.gimmick].length &&
                    stacker_seperate[note.gimmick][stack_layer_seperate] > marker_position) {
                        stack_layer_seperate++;
                    }
                    if (stack_layer_seperate == stacker_seperate[note.gimmick].length)
                        stacker_seperate[note.gimmick].push(0);

                    let marker_length = 0;
                    if (live.note_gimmicks[note.gimmick].finish_type === 2) {
                        let ni2 = ni + live.note_gimmicks[note.gimmick].finish_amount;
                        if (ni2 >= live.notes.length) ni2 = live.notes.length - 1;
                        marker_length = ((live.notes[ni2].time - note.time) / (lastnote_time - firstnote_time) * 98);
                    }

                    s += '<div class="gimmick" data-gimmick="' + note.gimmick + '" data-npos="' + (ni + 1) +
                        '" style="--gimmicklayer: ' + stack_layer_global + ';' + '--gimmicklayer-filtered: ' +
                        stack_layer_seperate + '; left: ' + marker_position + '%; ' + 'width:' + marker_length + '%">' +
                        '<div class="gimmickmarker">' + (note.gimmick + 1) + '</div>';
                    if (live.note_gimmicks[note.gimmick].finish_type === 2) {
                        s += '<div class="gimmicklength">&nbsp;</div>';

                        stacker_global[stack_layer_global] = stacker_seperate[note.gimmick][stack_layer_seperate] = marker_position + marker_length;
                    } else {
                        // magic value (TM) to avoid too much overlap of start markers
                        stacker_global[stack_layer_global] = stacker_seperate[note.gimmick][stack_layer_seperate] = marker_position + 0.75;
                    }
                    s += '</div>';
                }
                if ((ni + 1) % 5 === 0) {
                    s += '<div class="marker' + ((ni + 1) % 50 === 0 ? ' fifty' : '') + ((ni + 1) % 10 !== 0 ? ' five' : '') +
                        '" style="left: calc(' + ((note.time - firstnote_time) / (lastnote_time - firstnote_time) * 98 + 1) + '% - 1em);">' +
                        '|<br>' + (((ni + 1) % 10 === 0) ? format(ni + 1) : "&nbsp;") + '</div>';
                }
            }

            let total_note_damage = live.notes.length * live.note_damage + total_ac_notes * Math.floor(live.note_damage / 10);

            let infos = '<div class="col l6"><b>Note Count: </b>' + format(live.notes.length) + '</div>' +
                '<div class="col l6"><b>Total Note Damage: </b>' + format(total_note_damage) + '</div>' +
                '<div class="col l6"><b>Notes in ACs: </b>' + format(total_ac_notes) + ' (' +
                format(Math.round((total_ac_notes / live.notes.length) * 100)) + '%)</div>' +
                '<div class="col l6"><b>Total AC Reward Voltage: </b>' + format(total_ac_rewards) + '</div>' +
                '<div class="col l6"><b>SP Gauge Size: </b>' + format(live.sp_gauge_max) + '</div>';
            if (live.song_length) {
                let min = Math.floor(live.song_length / 60000);
                let sec = Math.floor(live.song_length % 60000 / 1000);
                infos += '<div class="col l6"><b>Actual Song Length: </b>' + min + ':' + (sec < 10 ? '0' : '') + sec + '</div>';
            }
            s = '<div class="row nomargin">' + infos + '</div><div class="notebarcontainer" tabindex="-1"><div class="notebar"' +
                'style="--gimmicklayers: ' + stacker_global.length + '" data-totaltime="' + length_notes_only + '">' + s + '</div></div>';
        } else {
            s += '<div class="row" style="margin-top: 1em; text-align: center">(no note map available)</div>';
        }

        s += '<div class="row nomargin">'
        s += '<div class="col l6 detailinfo"><h5>Gimmicks</h5><div><div>Song Gimmick</div><div>';
        if (live.gimmick === null) {
            s += "none";
        } else {
            for (let i = 0; i < live.gimmick.length; i++) {
                if (live.gimmick.length > 1) s += '<b>' + (i + 1) + ')</b> ';
                let skillstr = skill(live.gimmick[i]);
                if (live.gimmick[i].finish_type === 1) {
                    // remove " until the song ends" if that is the condition - pretty much implied through being the song gimmick
                    skillstr = skillstr.substring(0, skillstr.length - 20);
                }
                s += capFirstLetter(skillstr) + '<br><b>Cleansable:</b> ' + is_cleansable(live.gimmick[i]);
                if (i+1 < live.gimmick.length) s += '<br>';
            }
        }
        s += '</div></div>';

        for (let gi = 0; gi < live.note_gimmicks.length; gi++) {
            let noteg = live.note_gimmicks[gi];

            s += '<div data-gimmick="' + gi + '" class="gimmick"><div>Note Gimmick ' + format(gi + 1) + '</div><div>';
            switch (noteg.trigger) {
                case 1:
                    s += "If hit, ";
                    break;
                case 2:
                    s += "If missed, ";
                    break;
                case 3:
                    s += ""; // always
                    break;
                case 4:
                    s += 'If hit with a <span class="t vo">Vo</span> unit, ';
                    break;
                case 5:
                    s += 'If hit with a <span class="t sp">Sp</span> unit, ';
                    break;
                case 7:
                    s += 'If hit with a <span class="t sk">Sk</span> unit, ';
                    break;
                default:
                    throw new Error('Unknown Note Gimmick Trigger ' + noteg.trigger);
            }

            let skillstr = skill(noteg);
            if (noteg.trigger === 3) {
                skillstr = capFirstLetter(skillstr);
            }
            s += skillstr;
            if (noteg.counter !== undefined) {
                s += '<br><b>Amount:</b> ' + format(noteg.counter) + ' note' + (noteg.counter === 1 ? '' : 's');
            }
            s += '</div></div>';
        }

        s += '</div><div class="col l6 detailinfo"><h5>Appeal Chances</h5>';
        for (let ai = 0; ai < live.appeal_chances.length; ai++) {
            let ac = live.appeal_chances[ai];

            s += '<div data-ac="' + ai + '" class="appealchance ' + ac_colour(ac.mission_type) + '"><div>AC ' + format(ai + 1) + ': ' +
                ac_mission(ac.mission_type, ac.mission_value) + '</div><div>';
            if (ac.gimmick === null) {
                s += 'No Gimmick<br>';
            } else {
                switch (ac.gimmick.trigger) {
                    case 1:
                        s += (ac.gimmick.finish_type === 4) ? "During this AC, " : "When the AC starts, ";
                        break;
                    case 2:
                        s += "On AC Success, ";
                        break;
                    case 3:
                        s += "On AC Failure, ";
                        break;
                    case 4:
                        s += "At the end of the AC, ";
                        break;
                    default:
                        throw new Error('Unknown AC Gimmick Trigger ' + ac.gimmick.trigger);
                }
                s += skill(ac.gimmick) + '<br>';
            }

            if (ac.range_note_ids !== null) {
                let aclength = (ac.range_note_ids[1] - ac.range_note_ids[0] + 1);
                s += '<b>Length:</b> ' + format(aclength) + ' notes';
                if (ac.mission_type === 1) {
                    s += ' (avg. ' + format(Math.ceil(ac.mission_value / aclength)) + ' Voltage per note)';
                } else if (ac.mission_type === 8) {
                    s += ' (' + format(Math.ceil(ac.mission_value / aclength * 100)) + '% of notes must crit)';
                } else if (ac.mission_type === 9) {
                    s += ' (' + format(Math.ceil(ac.mission_value / aclength * 100)) + '% of taps must proc)';
                }
                s += '<div class="row nomargin"><div class="col m6 no-padding"><b>Success:</b> ' + format(ac.reward_voltage) +
                    ' Voltage</div>' + '<div class="col m6 no-padding"><b>Failure:</b> ' + (ac.penalty_damage !== null ? format(ac.penalty_damage) : "???") + ' Damage</div></div>';
            }

            s += '</div></div>';
        }

        return s + "</div></div>";
    } catch (e) {
        console.log("In Live " + live.live_id + " (Diff " + live.song_difficulty + "):")
        throw e;
    }
}

module.exports = {
    "make": make_notemap,
    "attribute": attribute,
    "difficulty": difficulty,
    "difficulty_short": difficulty_short,
    "is_cleansable": is_cleansable,
    "format": format,
    "song_name_romaji": song_name_romaji
};
