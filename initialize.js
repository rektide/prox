import cc from "command-chain"

/**
* This initializer sets up a `ctx.props` helper that other initializers can add to to define properties
* This is to prevent each initializer from calling a very small `Object.defineProperty` with just it's own
* thing, as that could be un-performant.
*
* Note that if an initializer is going to start depending on another initializers's props, it may have to
* circumvent these optimizations, defining the depended upon property ahead of time or other.
*/
export function props(ctx){
	// define our helper, where we will gather props
	ctx.props= {}
	// run all initializers
	ctx.next()
	if (!ctx.obj|| !ctx.props){
		return
	}
	// now define the requested properties
	Object.defineProperties(ctx.obj, ctx.props)
}

/**
* Create an empty `obj._chain` that is not enumerable, such that when someone does define it it will be invisible.
*/
export function _chain(ctx){
	ctx.props._chain= {
		value: undefined,
		writable: true, // users are free to a chain
		configurable: true // if you don't like this prop, that's fine. dwtw.
	}
	ctx.next()
}

/**
* An array of all initializers.
* Users and/or plugins might modify this at runtime, affecting future object construction
*/
export const initializers= [props, _chain]

/**
* Run each initializer against obj
*/
export function run(obj, opts, proxied){
	const chain= opts&& opts.initializers|| initializers
	cc({
		obj,
		opts,
		proxied,
		chain
	})
	return obj
}
export default run
