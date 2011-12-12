var meta= require("./enhance").meta

if(typeof exports === undefined)
	exports= {}

/**
 * Adds an _obj metaproperty that exposes the underlying object directly.
 */
var proxObj= exports.proxObj= function(o,obj,opts) {
	meta(o,"_obj",obj,opts)
}

/**
 * Add a _chain metaproperty that exposes the underlying CC's.
 */
var proxChain= exports.proxChain= function(o,chains,opts) {	
	opts= opts||{}
	opts.chains= chains
	meta(o,"_chains",chains,opts)
}
