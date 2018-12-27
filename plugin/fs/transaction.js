import { namer} from "phased-middleware/name.js"
import { Deferrant, Noop} from "deferrant"

const transactionNamer= namer( "prox-txn-")

export function Transaction(name= transactionNamer()){
	return new FinishTransaction()
}

export class FinishTransaction extends Deferrant{
}
