import handler as makeHandler from "./handler"
import initialize from "./initialize"

export const methods = {}
export const defaultPlugins = []

export const pluginsSymbol = new Symbol("plugins")


/**
* prox is a proxy 'handler' instance, pointing to a specific obj
*/
class prox{
	static get methodSymbols(){
		return methods
	}
	static get defaultPlugins(){
		return defaultPlugins
	}
	static set defaultPlugins( v){
		this.defaultPlugins.splice.apply( 0, this.defaultPlugins.length, ...v)
	}

	constructor( obj, opts= {}){
		// define defaults, pull in opts, & save obj
		const
		  defaultAndPlugins= [
		 	...(opts.defaultPlugins|| defaultPlugins),
			...opts.plugins ],
		  finalize = {
			obj,
			[plugnsSymbol]: []
		  }
		Object.assign(this, opts, finalize)
		// create proxyied object that we are the handler for
		this.proxied= new Proxy( obj, this)

		// set plugins, which will run them
		this.plugins= [...new Set(defaultAndPlugins)]
	}
	set plugins( plugins){
		// uninstall all old plugins
		this[ pluginsSymbol].forEach( p=> p.uninstall(this))

		// install all current plugins
		this[ pluginsSymbol]= plugins
		this[ pluginsSymbol].forEach( p=> p.install(this))
	}
	get plugins( plugins){
		return this[ pluginsSymbol]
	}
	free(){
		this.proxied= null
		this.obj= null
	}

}


// for each proxy handler method, create a small `cc` invoker
Object.keys( defaultChain).forEach( function( method){
	const chain= new Symbol( method)
	methods[ method]= chain
	// create a handler method taking all the trap arguments
	prox.prototype[ method]= function ( ...args){
		const
		  // get target
		  target= args[0],
		  // get the chain we want to run
		  chain= this[ chain]
		// run chain
		const val= cc({
			prox: this,
			chain, // the chain to run!
			method, // which event on the proxy is firing
			args
		})
		return val
	}
})
	
export default prox
