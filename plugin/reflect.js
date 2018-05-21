import { chainSymbols } from "../constants"
import { default as _reflect } from "../util/reflect"
import { forEach } from "../util/generator"

/**
* Lookup Reflect[ method] & create a chain handler for it.
*/
export function makeHandler( method){
	const
	  reflected = _reflect[ method],
	  name = method + "Reflect",
	  // this hack lets us, via inference, dynamically pick a friendly function name
	  tmp= {
		[ name]: function( ctx){
			ctx.output= reflected( ...ctx.args) // run, save `output`
			ctx.next() // run everything
		}
	  }
	tmp[ name].phase= "run"
	return tmp[ name]
}

const run= {}

// iterate through all methods, creating each handler on run
Object.keys( chainSymbols).forEach( function( method){
	run[ method]= makeHandler( method)
})

/**
* Minimal wrapper to call JavaScript's `Reflect` implementations
*/
export const reflect = {
	phases: {
		run
	},
	name: "reflect"
}

export default reflect
