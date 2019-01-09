import PhasedMiddleware from "phased-middleware"
import { pluginName} from "phased-middleware/name.js"
import { $symbols} from "phased-middleware/symbol.js"

import AggroProx from "./plugin/aggro-prox.js"
import { defaults, defaulter } from "./defaults.js"
import { PipelineNames, PipelineSymbols} from "./pipeline.js"
import { $obj, $proxied} from "./symbol.js"

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
		// these both strike me as kind of a no-no that could potentially obstruct garbage collection
		this[ $obj]= obj
		this[ $proxied]= new Proxy( obj, this)
	}
	get obj(){
		return this[ $obj]
	}
	get proxied(){
		return this[ $proxied]
	}
	symbol( i, obj){
		let symbols= obj&& this.symbolMap? this.symbolMap.get( obj): this.symbols
		return symbols[ i]
	}
	pluginSymbol( plugin, obj){
		const
		  index= this.pluginIndex( plugin),
		  symbol= this.symbol( index, obj)
		return symbol
	}
	pluginData( plugin, obj){
		const symbol= this.pluginSymbol( plugin, obj)
		return this[ symbol]
	}

	free(){
		this[ $obj]= null
		this[ $proxied]= null
	}
	/**
	* Return a prox proxy for a new `obj`.
	* @danger: do not `#install` after `#fork`, symbols will be out of alignment
	*/
	fork( obj){
		const newProx= new (AggroProx())( obj, this)
		return newProx.proxied
	}
}
for( let i= 0; i< PipelineNames.length; ++i){
	const
	  method= PipelineNames[ i],
	  symbol= PipelineSymbols[ i]
	Prox.prototype[ method]= function( o, ...args){
		return this.exec( symbol, null, null, o, ...args)
	}
}
export default Prox.make
export const make = Prox.make
