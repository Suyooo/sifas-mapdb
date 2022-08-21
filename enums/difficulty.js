const Difficulty = {
    BEG: 10,
    INT: 20,
    ADV: 30,
    ADVPLUS: 35,
    CHA: 37,
    name: (diffId) => {
        if (diffId === Difficulty.BEG) return "Beginner";
        if (diffId === Difficulty.INT) return "Intermediate";
        if (diffId === Difficulty.ADV) return "Advanced";
        if (diffId === Difficulty.ADVPLUS) return "Advanced+";
        if (diffId === Difficulty.CHA) return "Challenge";
        throw new Error('Unknown Difficulty ' + diffId);
    },
    nameShort: (diffId) => {
        if (diffId === Difficulty.BEG) return "Beg";
        if (diffId === Difficulty.INT) return "Int";
        if (diffId === Difficulty.ADV) return "Adv";
        if (diffId === Difficulty.ADVPLUS) return "Adv+";
        if (diffId === Difficulty.CHA) return "Ch";
        throw new Error('Unknown Difficulty ' + diffId);
    }
}

module.exports = Difficulty;