
const { _hash } = require("../lib");

// validator ports
const PORTS = ["4004"];

const TP_FAMILIES = {
    DLB_DOCUMENT : "DLB_DOCUMENT"
};

const getConstants = (TP_FAMILY) => { 
    const constants = {};
    constants.TP_NAMESPACE = _hash(TP_FAMILY).substring(0, 6);
    constants.TP_FAMILY = TP_FAMILY;

    switch (TP_FAMILY) { 
        
        case TP_FAMILIES.DLB_DOCUMENT:
                constants.BASE_IP = 'localhost';
                return constants;
            break;

        default:
            return false;
            break;
    }
};

module.exports = { TP_FAMILIES, getConstants, PORTS }