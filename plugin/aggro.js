import Prox from "../prox"
import { currentObject, setCurrentObject} from "./_prox.js"
import { $phases, $plugins, $instantiate} from "phased-middleware/symbol.js"

export function setAggro({ inputs, phasedMiddleware, setOutput, i, symbol}){
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
	  parentProx= phasedMiddleware,
	  oldCurrentObject= currentObject,
	  existingProx= val._prox
	if( existingProx&& existingProx.parent=== parentProx&& existingProx.parentKey=== key){
		// object already has a prox with the correct location information
		return
	}else if(existingProx){
		// OH FRAK fork() is broken here!
		// oh: currentObject hack. fork() maybe probably has to go?
		// unwrap obj
		val= currentObject
	}
	const
	  proxied= phasedMiddleware.fork( val),
	  newProx= proxied._prox,
	  newSymbol= newProx.symbol( i, val)
	// assign
	newProx[ newSymbol]= {
	  parent: phasedMiddleware,
	  parentPluginData: symbol,
	  parentKey: key
	}
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
}
export default aggro
