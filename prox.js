import handler as makeHandler from "./handler"
import initialize from "./initialize"

export const methods = {}
export const defaultPlugins = []

export const pluginsSymbol = new Symbol("plugins")


/**
* prox is a proxy 'handler' instance, pointing to a specific obj
*/
export class Prox{
	/**
	* factory method to create a new Prox around an object & return the proxied object
	*/
	static make( obj= {}, opts)
		var p= new Prox( obj, opts)
		return p.proxied
	}
	/**
	* handler chains are stores as symbols, this maps from the name to the symbol
	*/
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
		const finalize = {
		  obj,
		  [plugnsSymbol]: [] // we will initialize this once we create the proxy, via our `plugins`' setter
		}
		// define defaults, pull in opts, & save obj
		Object.assign(this, opts, finalize)

		// create proxyied object that we are the handler for
		this.proxied= new Proxy( obj, this)

		// set plugins, which will run them
		const defaultAndPlugins= [
		  ...(opts.defaultPlugins|| defaultPlugins),
		  ...opts.plugins ],
		this.plugins= [...new Set(defaultAndPlugins)]
	}
	set plugins( plugins){
		// torn about this impl.	ideally every plugin is powered by other state of Prox & uninstall & install
		// faithfully returns to same state. unsure whether i can make this big demand but going with it for now.

		// uninstall all old plugins, giving us a pristine state
		this[ pluginsSymbol].forEach( p=> p.uninstall(this))
		// at this point there really shouldn't be anything on `.chains`

		// install all current plugins
		this[ pluginsSymbol]= plugins
		this[ pluginsSymbol].forEach( p=> p.install(this))
	}
	get plugins( plugins){
		return this[ pluginsSymbol]
	}
	free(){
		// this is probably silly but i'm afraid of things i think
		// might leak &u want to track these fears here
		this.proxied= null
		this.obj= null
	}
}

// for each proxy handler method, create a small `cc` invoker
Object.keys( defaultChain).forEach( function( method){
	const chain= new Symbol( method)
	methods[ method]= chain
	// create a handler method taking all the trap arguments
	Prox.prototype[ method]= function ( ...args){
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
	
export default Prox
