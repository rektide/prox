import PhasedMiddleware from "phased-middleware"
import { PipelineNames, PipelineSymbols} from "./pipeline.js"
import { defaults, defaulter } from "./defaults.js"
import { pluginName} from "phased-middleware/name.js"
import { $symbols} from "phased-middleware/symbol.js"

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
	constructor( obj= {}, opts){
		super( defaulter( opts))
		let symbolMap
		let proxied= new Proxy( obj, this)
		Object.defineProperties( this, {
			// create proxyied object that we are the handler for
			handler: {
				value: this
			},
			obj: {
				get: function(){
					if( !this.symbolMap){
						return obj
					}
					throw new Error( "forked prox no longer has a specific obj")
				}
			},
			proxied: {
				get: function(){
					if( !this.symbolMap){
						return proxied
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
					proxied= null
					obj= null
				}
			}
		})
	}
	symbol( i, obj){
		if( obj&& this.symbolMap){
			return this.symbolMap.get( obj)[ i]
		}
		return this[ $symbols][ i]
	}
	pluginData( i, obj){
		const symbol= this.symbol( i, obj)
		return this[ symbol]
	}
	/**
	* Return a prox proxy for a new `obj`.
	* @danger: do not `#install` after `#fork`, symbols will be out of alignment
	*/
	fork( obj){
		const newSymbols= this.plugins.map( plugin=> Symbol( pluginName( plugin)))
		if( this.symbolMap){
			this.symbolMap.set( obj, newSymbols)
		}else{
			const
			  oldObj= this.obj,
			  symbolMap= new WeakMap()
			symbolMap.set( oldObj, this.symbols)
			symbolMap.set( obj, newSymbols)
			this.symbolMap= symbolMap
		}

		// TODO: iterate through symbols & fork? except we don't know current object, blah
		// hacked _prox to store this. :/
		return new Proxy( obj, this)
	}
}
for( let i= 0; i< PipelineNames.length; ++i){
	const
	  method= PipelineNames[ i],
	  symbol= PipelineSymbols[ i]
	Prox.prototype[ method]= function( o, ...args){
		const symbols= this.symbolMap&& this.symbolMap.get( o)
		return this.exec( symbol, null, symbols, o, ...args)
	}
}
export default Prox.make
export const make = Prox.make
