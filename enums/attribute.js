const Attribute = {
    SMILE: 1,
    PURE: 2,
    COOL: 3,
    ACTIVE: 4,
    NATURAL: 5,
    ELEGANT: 6,
    NONE: 9,
    name: (attrId) => {
        if (attrId === Attribute.SMILE) return "smile";
        if (attrId === Attribute.PURE) return "pure";
        if (attrId === Attribute.COOL) return "cool";
        if (attrId === Attribute.ACTIVE) return "active";
        if (attrId === Attribute.NATURAL) return "natural";
        if (attrId === Attribute.ELEGANT) return "elegant";
        if (attrId === Attribute.NONE) return "none";
        throw new Error('Unknown Attribute ' + attrId);
    }
}

module.exports = Attribute;