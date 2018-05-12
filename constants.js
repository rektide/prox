export const chainSymbols = {}

Object
	.getOwnPropertyNames(Reflect)
	.forEach( trap=> chainSymbols[ trap]= Symbol( trap))
