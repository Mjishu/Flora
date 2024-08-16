"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//* Previous in SRS is the data returned the last time the function was ran on the card(or if first time set to default values)
//state is known or not known, N is # seen correctly in a row, eFactor is ease of recall, should output the same values but updated?
function srsFunc(previous, evaluation) {
    const newN = previous.N + 1; //* If known
    //if known:
    const isNew = !previous.new ? true : true;
    const newEFactor = previous.eFactor - .1;
    return {
        new: isNew,
        N: newN,
        eFactor: newEFactor,
        data: { interval: 1.0 }
    };
}
exports.default = srsFunc;
