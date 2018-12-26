import Prox from "../prox"
import { $plugins} from "phased-middleware/symbol.js"

export function setAggro({ inputs, phasedMiddleware, setOutput} ){
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
	  existingProx= val._prox
	if( existingProx&& existingProx.parent=== parentProx&& existingProx.parentKey=== key){
		// object already has a prox with the correct location information
		return
	}else if(existingProx){
		// unwrap obj
		val= val._prox.obj
	}
	const
	  plugins= parentProx[ $plugins],
	  proxied= Prox( val, { plugins})
	proxied._prox.parent= phasedMiddleware
	proxied._prox.parentKey= key

	// swap in the new proxied object
	setOutput( proxied)
	inputs[ 2]= proxied

	// recurse
	// for now, only doing a shallow pass!
	for( let o in val){
		proxied[ o]= val[ o]
	}
}
setAggro.phase= {pipeline: "set", phase: "prerun"}

/**
* Aggro plugin will, whenever an object is assigned, insure that that object is wrapped in a prox
* Additionally, aggro attaches the parent & parentKey to the new prox, that point to the aggro prox & the key where it was set.
*/
export const aggro= {
	set: setAggro,
	name: "aggro"
}

export default aggro
