import PhasedMiddleware from "phased-middleware"
import { pipelines, pipelineNames} from "./pipeline.js"
import { defaults, defaulter } from "./defaults.js"

let _id= 0


function makeProxyHandlers( prox){
	const handlers= {}
	pipelineNames.forEach( method=> {
		// guessing this is slower alas
		//const handler= function( ...args){
		//	return handler.prox.exec( handler.method, null, ...args)
		//}
		//handler.prox= prox
		//handler.method= method
		//handlers[ method]= handler
		handlers[ method]= function( ...args){
			return prox.exec( method, null, ...args)
		}
	})
	return handlers
}

/**
* prox is a proxy 'handler' instance, pointing to a specific obj
*/
export class Prox extends PhasedMiddleware{
	/**
	* factory method to create a new Prox around an object & return the proxied object
	*/
	static make( obj= {}, opts){
		var p= new Prox( obj, opts)
		return p.proxied
	}

	constructor( obj= {}, opts= defaults){
		super( defaulter( opts))
		Object.defineProperties( this, {
			// create proxyied object that we are the handler for
			proxied: {
				value: new Proxy( obj, makeProxyHandlers( this))
			},
			// our target object
			obj: {
				value: obj
			},
		})
	}
}
export default Prox.make
export const make = Prox.make
