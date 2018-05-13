import Prox from "../prox"

/**
* Aggro plugin will, whenever an object is assigned, insure that that object is wrapped in a prox
* Additionally, aggro attaches the parent & parentKey to the new prox, that point to the aggro prox & the key where it was set.
*/
export const aggro= {
	set: function( ctx){
		const
		  target= ctx.args[ 0],
		  key= ctx.args[1],
		  prox= ctx.prox,
		  childProx= target._prox
		if( childProx&& childProx.parent=== ctx.prox&& childProx.parentKey=== key){
			// object already has a prox with the correct location information
			return
		}
		const
		  plugins= ctx.prox.aggroPlugins|| ctx.prox.plugins
		  newProx= new Prox( target, { plugins}),
		target._prox.parent= ctx.prox
		target._prox.parentKey= ctx.args[ 1]
	},
	install: function( prox){
		prox.chain("set").install( aggro.set)
		for( var key of prox.obj){
			prox.proxied[ key]= prox.proxied[ key]
		}
	},
	uninstall: function( prox){
		prox.chain("set").uninstall( aggro.set)
		for( var key of prox.obj){
			const proxed= prox.obj[ key]
			if( !proxed._prox){
				continue
			}
			prox.proxied[ key]= prox.proxied[ key]._prox.obj
		}
	}
}
aggro.set.phase= "postrun"

export default aggro
