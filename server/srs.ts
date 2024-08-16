
interface srsInterface {
    N: number, //if 0 means state would be false, aka not known (if card is to be known, n should be atleast 2 before setting to next day?)
    eFactor: number,
    data: object | null,
    new: boolean
}

interface evaluationInterface {
    score: number,
    lateness: number
}

//* Previous in SRS is the data returned the last time the function was ran on the card(or if first time set to default values)

//state is known or not known, N is # seen correctly in a row, eFactor is ease of recall, should output the same values but updated?
function srsFunc(previous: srsInterface, evaluation: evaluationInterface): srsInterface {
    const newN = previous.N + 1 //* If known
    //if known:
    const isNew = !previous.new ? true : true;
    const newEFactor = previous.eFactor - .1;


    return {
        new: isNew,
        N: newN,
        eFactor: newEFactor,
        data: { interval: 1.0 }
    }
}

export default srsFunc