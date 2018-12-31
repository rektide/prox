import PhasedMiddleware from "phased-middleware"
import { pipelines, pipelineNames} from "./pipeline.js"
import { defaults, defaulter } from "./defaults.js"
import { $symbols} from "phased-middleware/symbol.js"

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
		handlers[ method]= function( o, ...args){
			const symbols= prox.symbolMap&& prox.symbolMap.get( o)
			return prox.exec( method, null, symbols, o, ...args)
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
		let symbolMap
		const handler= makeProxyHandlers( this)
		Object.defineProperties( this, {
			// create proxyied object that we are the handler for
			handler: {
				value: handler
			},
			proxied: {
				get: function(){
					if( !this.symbolMap){
						return new Proxy( obj, makeProxyHandlers( this))
					}
					throw new Error( "forked prox no longer has a specific proxied")
				}
			},
			symbolMap: {
				get: function(){
					return symbolMap
				},
				set: function( val){
					symbolMap= val
				}
			}
		})
	}
	/**
	* Return a prox proxy for a new `obj`.
	* @danger: do not `#install` after `#fork`, symbols will be out of alignment
	*/
	fork( obj){
		const newSymbols= this.plugins.map( plugin=> Symbol( pluginName( plugin)))
		if( this.symbolMap){
			this.symbolMap.put( obj, newSymbols)
			return new Proxy( obj, this.handler)
		}else{
			const
			  oldObj= this.proxied,
			  symbolMap= new WeakMap()
			symbolMap.put( oldObj, this.symbols)
			symbolMap.put( obj, newSymbols)
			this.symbolMap= symbolMap
		}
		return this
	}
}
export default Prox.make
export const make = Prox.make
