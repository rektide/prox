import handler from "./handler"
import initialize from "./initialze"
// import prox from "./plugin/prox"
// import enhance from "./plugin/enhance"

/**
* Construct a new prox object
*/
export function prox(obj= {}, opts){
	// create a fresh proxy on the object
	const proxied= new Proxy(obj, handler)
	// run any registered initializers. opts.initializers will override global.
	initialize(proxied, opts, proxied)
	return proxied
}
export default prox

//	proxPlugin.proxChain(proxied,handler._chains)
//	proxPlugin.proxObj(proxied,obj)
//	proxEnhance.proxEnhance(proxied)
