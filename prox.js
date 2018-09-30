import PhasedMiddleware from "phased-middleware"
import { pipelines, pipelineNames} from "./pipeline.js"
import reflect from "./plugin/reflect.js"
import propProx from "./plugin/prop-prox.js"

export const basePlugins = [ reflect, propProx]

let _id= 0

/**
* prox is a proxy 'handler' instance, pointing to a specific obj
*/
export class Prox{
	/**
	* factory method to create a new Prox around an object & return the proxied object
	*/
	static make( obj= {}, opts){
		var p= new Prox( obj, opts)
		return p.proxied
	}

	constructor( obj, opts= {}){
		const plugins= [ ...opts.basePlugins|| basePlugins, ...opts.plugins|| []]
		Object.defineProperties( this, {
			// create proxyied object that we are the handler for
			proxied: {
				value: new Proxy( obj, this)
			},
			// our target object
			obj: {
				value: obj
			},
			// the middleware runner that executes our proxy handler methods
			phasedMiddleware: {
				value: new PhasedMiddleware({
					pipelines,
					plugins
				})
			},
			// a unique identifier for this prox instance
			id: {
				value: ++_id
			}
		})
		console.log("x", typeof this.proxied)
	}
	set plugins( plugins){
		this.phasedMiddleware.replace( plugins)
	}
	get plugins(){
		return this.phasedMiddleware.middlewares
	}
	addPlugin( plugin){
		this.phasedMiddleware.install( plugin)
	}
	exec( method, value){
		return this.phasedMiddleware.exec[ method]( value)
	}
}
pipelineNames.forEach( method=> {
	Prox.prototype[ method]= function( value){
		return this.exec( method, value)
	}
})

/**
* To make debugging easier, handlers are permitted a suffix to their name. Strip this of to their name. Strip this of to their name. Find the suffix-less name.
*/
export function stripHandlerSuffix( name){
	if( chainSymbols[ name]){
		// name is the exact name, had no suffix
		return name
	}
	for( const chain in chainSymbols){
		if( name.startsWith( chain)){
			return chain
		}
	}
	const err= new Error(`Failed to de-suffix \`${name}\` to a chain name`)
	err.name= name
	throw err
}

export default Prox
