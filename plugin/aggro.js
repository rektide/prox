import Prox from "../prox"

/**
* Aggro plugin will, whenever an object is assigned, insure that that object is wrapped in a prox
* Additionally, aggro attaches the parent & parentKey to the new prox, that point to the aggro prox & the key where it was set.
*/
export const aggro= {
	set: function( ctx){
		const val= ctx.args[ 2]
		if( !val){
			return ctx.next()
		}
		if( Object(val)!== val){
			return ctx.next()
		}
		const
		  [ target, key]= ctx.args,
		  parentProx= ctx.prox,
		  existingProx= val._prox
		if( existingProx&& existingProx.parent=== parentProx&& existingProx.parentKey=== key){
			// object already has a prox with the correct location information
			return ctx.next()
		}
		const
		  plugins= parentProx.aggroPlugins|| parentProx.plugins,
		  proxied= Prox.make( val, { plugins})
		proxied._prox.parent= ctx.prox
		proxied._prox.parentKey= ctx.args[ 1]

		// swap in the new proxied object
		ctx.args[ 2]= proxied
		ctx.next()
	},
	install: function( prox){
		prox.chain("set").install( aggro.set)
		for( var key in prox.obj){
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
	},
	name: "aggro"
}
aggro.set.phase= "prerun"

export default aggro
