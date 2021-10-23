import { PipelineNames}  from "../pipeline.js"
import { default as _reflect } from "../util/reflect.js"
import { $phases} from "phased-middleware/symbol.js"

/**
* Lookup Reflect[ method] & create a chain handler for it.
*/
export function makeHandler( method){
	const
	  reflected = _reflect[ method],
	  name = method + "Reflect",
	  // this hack lets us, via inference, dynamically pick a friendly function name
	  tmp= {
		[ name]: function( context){
			const output= reflected( ...context.inputs) // run
			context.setOutput( output) // save `output`
		}
	  },
	  handler= tmp[ name]
	handler[ $phases]={ pipeline: method, phase: "run"}
	return handler
}

/**
* Minimal wrapper to call JavaScript's `Reflect` implementations
*/
export const reflect = {
	name: "reflect"
}
export default reflect

// iterate through all methods, creating each handler on run

Object.values( PipelineNames).forEach( function( method, i){
	reflect[ method]= makeHandler( method)
})
