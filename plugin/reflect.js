import { chainSymbols } from "../constants"
import { default as _reflect } from "../util/reflect"
import { forEach } from "../util/generator"

/**
* Minimal wrapper to call JavaScript's `Reflect` implementations
*/
export class Reflect{
	static makeHandler( method){
		const reflected = _reflect[ method]
		function reflectHandler( ctx){
			ctx.output= reflected( ...ctx.args) // run, save `output`
			ctx.next() // run everything
	  	}
		reflectHandler.phase = "run"
		return reflectHandler
	}
	static install( prox){
		Object
		  .keys(chainSymbols)
		  .map(function( key){
			//console.log({key})
			const chain= prox.chain( key)
			chain.install( singleton[ key])
		  })
	}
	static uninstall( prox){
		forEach( prox.chains(), ([ chain, method])=> chain.install( singleton[ method]))
	}
	static get name(){
		return "reflect"
	}
}
Object.keys( chainSymbols).forEach( function( method){
	Reflect.prototype[ method]= Reflect.makeHandler( method)
})

export default Reflect

export const singleton = new Reflect()
