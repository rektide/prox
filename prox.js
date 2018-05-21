import cc from "command-chain"

import Chain from "./chain"
import { chainSymbols } from "./constants"
import reflect from "./plugin/reflect"
import propProx from "./plugin/prop-prox"

export const defaultPlugins = [ reflect, propProx]
export const pluginsSymbol = Symbol("plugin") // list of plugins is stored here
export const pluginsContextSymbol= Symbol("plugin") // 

/**
* Lookup the chain by it's symbol
*/
export function defaultChainLookup(prox, chainSymbol){
	return prox[ chainSymbol]
}

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
				args,
				eval: Chain.chainEval
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
	static get pluginsContextSymbol(){
		return pluginsContextSymbol
	}

	constructor( obj, opts= {}){
		const finalize = {
		  obj,
		  [Prox.pluginsSymbol]: [], // we will initialize this once we create the proxy, via our `plugins`' setter
		  id: ++_id
		}
		// create empty handler chains
		for( var chainSymbol of Object.values( chainSymbols)){
			finalize[ chainSymbol]= new Chain()
		}
		const optsPlugins= opts.plugins
		delete opts.plugins

		// define defaults, pull in opts, & save obj
		Object.assign( this, opts, finalize)
		opts.plugins= optsPlugins

		// create proxyied object that we are the handler for
		this.proxied= new Proxy( obj, this)

		// set plugins, which will run them
		const defaultAndPlugins= [
		  ...(opts.defaultPlugins|| defaultPlugins),
		  ...(optsPlugins|| []) ]
		this.plugins= defaultAndPlugins
	}
	set plugins( plugins){
		// torn about this impl.	ideally every plugin is powered by other state of Prox & uninstall & install
		// faithfully returns to same state. unsure whether i can make this big demand but going with it for now.
		this.clearPlugins();
		// we just uninstalled everything we have, now clear it.
		(plugins|| []).forEach( plugin=> this.addPlugin( plugin))
	}
	clearPlugins(){
		// uninstall all old plugins, giving us a pristine state
		const oldPlugins= this[ pluginsSymbol]|| []
		for( let i= oldPlugins.length - 1; i>= 0; --i){
			const
			  plugin= oldPlugins[ i],
			  contextSymbol= this[ pluginsContextSymbol][ i],
			  ctx= this[ contextSymbol]
			// for each phase on the plugin
			for( const [phaseName, phase] of Object.entries( plugin.phases|| [])){
				// for each chain handler in the phase
				for( const [methodName, handler] of Object.entries( phase)){
					const chainName= stripHandlerSuffix( methodName)
					if( !chainName){
						continue
					}
					const chain= this[ chainSymbols[ chainName]]
					chain.uninstall( handler, contextSymbol, phaseName)
				}
			}
			// do plugins static uninstall
			if( plugin.uninstall){
				plugin.uninstall( this, contextSymbol)
			}
			// do instance's uninstall
			if( ctx&& ctx.uninstall){
				ctx.uninstall( this, contextSymbol)
			}
			// cleanup context
			delete this[ contextSymbol]
		}
		this[ pluginsSymbol]= []
		this[ pluginsContextSymbol]= []
	}
	addPlugin( plugin){
		const contextSymbol= Symbol()
		// save this plugin, & it's context symbol
		this[ pluginsSymbol].push( plugin)
		this[ pluginsContextSymbol].push( contextSymbol)

		// first we try to add the static phases defined on the plugin
		this._addPhases( plugin.phases, contextSymbol)

		// run any static "install" methods
		if( plugin.install){
			const pluginContext= plugin.install( this, contextSymbol)
			if( pluginContext!== undefined){
				// assign install output as the context
				this[ contextSymbol]= pluginContext
			}
		}

		// if there's still no context, but plugin is a function, create an instance of it
		if( !this[ contextSymbol] && plugin instanceof Function){
			this[ contextSymbol]= new plugin( this, contextSymbol)
		}

		// last, add any phases described by context
		this._addPhases( this[ contextSymbol], contextSymbol)
	}
	/**
	* typically users ought to addPlugin, but this underlying method allows directly adding handlers
	* (this method is used by addPlugin)
	*/
	_addPhases( phases, symbol){
		if( !phases){
			return
		}
		for( const [phaseName, phase] of Object.entries( phases)){
			for( const [methodName, handler] of Object.entries( phase)){
				const chainName= stripHandlerSuffix( methodName)
				if( !chainName){
					continue
				}
				const chain= this[ chainSymbols[ chainName]]
				chain.install( handler, symbol, phaseName)
			}
		}
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
