/**
* Prox stores `Chain`s as symbols, looked up by name here.
*/
export const chainSymbols= {}
Object
	.getOwnPropertyNames(Reflect)
	.forEach( trap=> chainSymbols[ trap]= Symbol( trap))
