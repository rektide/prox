import cc from "command-chain"

import Chain from "./chain"
import { chainSymbols } from "./constants"
import reflect from "./plugin/reflect"
import propProx from "./plugin/prop-prox"

export const defaultPlugins = [ reflect, propProx]
export const pluginsSymbol = Symbol("plugin")

/**
* Lookup the chain by it's symbol
*/
export function defaultChainLookup(prox, chainSymbol){
	return prox[ chainSymbol]
}

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
	/**
	* Create a simple Proxy trap handler that finds the chain,
	*/
	static handler( method, chainSymbol){
		// create a handler method taking all the trap arguments & finding & running the chain
		return function handler( ...args){
			const chainLookup = this.chainLookup || defaultChainLookup
			// run chain
			const val= cc({
				prox: this,
				chain: chainLookup(this, chainSymbol),
				method, // which event on the proxy is firing
				args
			})
			return val
		}
	}
	static get defaultPlugins(){
		return defaultPlugins
	}
	static set defaultPlugins( v){
		defaultPlugins.splice( 0, defaultPlugins.length, ...v)
	}
	static get pluginsSymbol(){
		return pluginsSymbol
	}

	constructor( obj, opts= {}){
		const finalize = {
		  obj,
		  [Prox.pluginsSymbol]: [] // we will initialize this once we create the proxy, via our `plugins`' setter
		}
		// create empty handler chains
		for( var chainSymbol of Object.values( chainSymbols)){
			finalize[ chainSymbol]= new Chain()
		}
		// define defaults, pull in opts, & save obj
		Object.assign( this, opts, finalize)

		// create proxyied object that we are the handler for
		this.proxied= new Proxy( obj, this)

		// set plugins, which will run them
		const defaultAndPlugins= [
		  ...(opts.defaultPlugins|| defaultPlugins),
		  ...(opts.plugins|| []) ]
		this.plugins= [...new Set(defaultAndPlugins)]
	}
	set plugins( plugins){
		// torn about this impl.	ideally every plugin is powered by other state of Prox & uninstall & install
		// faithfully returns to same state. unsure whether i can make this big demand but going with it for now.

		// uninstall all old plugins, giving us a pristine state
		this[ Prox.pluginsSymbol].forEach( p=> p.uninstall(this))
		// at this point there really shouldn't be anything on `.chains`

		// install all current plugins
		this[ Prox.pluginsSymbol]= plugins
		this[ Prox.pluginsSymbol].forEach( p=> p.install(this))
	}
	get plugins(){
		return this[ Prox.pluginsSymbol]
	}
	free(){
		// this is probably silly but i'm afraid of things i think
		// might leak &u want to track these fears here
		this.proxied= null
		this.obj= null
	}
	/**
	* @returns an iterable of [chain, method, chainSymbol] 
	*/
	*chains(){
		for( var chain of Object.entries( chainSymbols)){
			chain.unshift( this[ chain[1]])
			yield chain
		}
	}
	chain( method){
		return this[ chainSymbols[ method]]
	}
}
Object.entries( chainSymbols).forEach(([ method, chainSymbol])=> {
	Prox.prototype[ method]= Prox.handler( method, chainSymbol)
})

export default Prox
