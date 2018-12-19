import PhasedMiddleware from "phased-middleware"
import { pipelines, pipelineNames} from "./pipeline.js"
import { defaults, defaulter } from "./defaults.js"

let _id= 0

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

	constructor( obj, opts= defaults){
		super( defaulter( opts))
		Object.defineProperties( this, {
			// create proxyied object that we are the handler for
			proxied: {
				value: new Proxy( obj, this)
			},
			// our target object
			obj: {
				value: obj
			},
		})
	}
}
pipelineNames.forEach( method=> {
	Prox.prototype[ method]= function( ...args){
		return this.exec( method, null, args).output
	}
})
export default Prox
