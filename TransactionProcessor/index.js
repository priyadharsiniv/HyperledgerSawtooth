const { TransactionProcessor } = require('sawtooth-sdk/processor');
const { TP_FAMILIES, getConstants, PORTS } = require("./constants");

const DlbHandler = require('./handler');

process.setMaxListeners(20);

function registerTransactionProcessor(constants){
    for (let i = 0; i < PORTS.length; i++) {
        const port = PORTS[i];
        const transactionProcessor = new TransactionProcessor(`tcp://${constants.BASE_IP}:${port}`)
        transactionProcessor.addHandler(new DlbHandler(constants.TP_FAMILY,constants.TP_NAMESPACE))
        transactionProcessor.start()
        console.log(`Registered TP of family ${constants.TP_FAMILY} to validator \n tcp://${constants.BASE_IP}:${port} \n\n`)
    }
};

for (let [key, value] of Object.entries(TP_FAMILIES)) {
    const constants = getConstants(value);
    registerTransactionProcessor(constants);
}