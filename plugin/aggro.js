import Prox from "../prox"

/**
* Aggro plugin will, whenever an object is assigned, insure that that object is wrapped in a proxy.
*/
export const aggro= {
	set: function( ctx){
		var target= ctx.args[ 0]
		var targetProx= target._prox
		if( targetProx&& targetProx.parent=== ctx.prox){
			// object already has a prox & knows
			return
		}
		target= new Prox( target)
		target._prox.parent= ctx.prox
		target._prox.parentKey= ctx.args[ 1]
	},
	install: function( prox){
		prox.chain("set").install( aggro.set)
	},
	uninstall: function( prox){
		prox.chain("set").uninstall( aggro.set)
	}
}
aggro.set.phase= "postrun"

export default aggro
