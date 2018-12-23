import Prox from "../prox"
import { $plugins} from "phased-middleware/symbol.js"

export function setAggro({ inputs, phasedMiddleware, setOutput} ){
	const val= inputs[ 2]
	if( !val){
		return
	}
	if( Object(val)!== val){
		return
	}
	const
	  [ target, key]= inputs,
	  parentProx= phasedMiddleware,
	  existingProx= val._prox
	if( existingProx&& existingProx.parent=== parentProx&& existingProx.parentKey=== key){
		// object already has a prox with the correct location information
		return
	}
	const
	  plugins= parentProx[ $plugins],
	  proxied= Prox( val, { plugins}) // the aggro plugin will recursively apply itself here
	proxied._prox.parent= phasedMiddleware
	proxied._prox.parentKey= key

	// swap in the new proxied object
	setOutput( proxied)
	inputs[ 2]= proxied
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
