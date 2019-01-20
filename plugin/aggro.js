import Prox from "../prox"
import { $aggro} from "../symbol.js"
import { currentObject, setCurrentObject} from "./_prox.js"
import { $install, $phases, $plugins, $instantiate} from "phased-middleware/symbol.js"

export class AggroData{
	constructor( opts){
		this.key= opts.key
		this.parent= opts.parent
		this.parentSymbol= opts.parentSymbol
	}
	*[Symbol.iterator](){
		let cursor= this
		while( cursor){
			yield cursor
			cursor= cursor.parent[ cursor.parentSymbol]
		}
	}
}

export function setAggro({ inputs, plugin, prox: phasedMiddleware, setOutput, i, symbol}){
	const val= inputs[ 2]
	// weed out primitives
	if( !val){
		return
	}
	const type= typeof( val)
	if( type!== "object"&& (type=== "number"|| type=== "string"|| type=== "boolean"|| type=== "symbol")){
		return
	}
	// 
	const
	  [ target, key]= inputs,
	  oldCurrentObject= currentObject,
	  existingProx= val._prox,
	  existingData= existingProx&& existingProx[ symbol]
	if( existingData&& existingData.parent=== prox&& existingData.parentKey=== key){
		// object already has a prox with the correct location information
		return
	}else if(existingProx){
		val= currentObject
	}
	const
	  proxied= prox.fork( val),
	  newProx= proxied._prox,
	  // this assumes aggro is in the same place. default aggroprox behaves so.
	  newSymbol= newProx.symbol( i)
	// assign
	newProx[ newSymbol]= new AggroData({
	  key,
	  parent: prox,
	  parentSymbol: symbol
	})
	// restore, after having gotten some new _prox's
	setCurrentObject( oldCurrentObject)
	
	//const
	//  plugins= parentProx[ $plugins],
	//  proxied= Prox( val, { plugins})
	//proxied._prox.parent= phasedMiddleware
	//proxied._prox.parentKey= key

	// swap in the new proxied object
	//setOutput( proxied)
	inputs[ 2]= proxied

	// recurse, which will also recurse
	// for now, only doing a shallow pass via `in`
	for( let o in val){
		proxied[ o]= val[ o]
	}
}
setAggro[ $phases]= {pipeline: "set", phase: "prerun"}

/**
* Recursive applicator of "prox"
* Aggro plugin will, whenever an object is assigned, insure that that object is wrapped in a prox
* Additionally, aggro attaches the parent & parentKey to the new prox, that point to the aggro prox & the key where it was set.
*/
export const aggro= {
	set: setAggro,
	name: "aggro",
	[ $instantiate]: true
}, Aggro= aggro, aggroSingleton= aggro, AggroSingleton= aggro, singleton= aggro, Singleton= aggro
export default aggro
