import handler as makeHandler from "./handler"
import initialize from "./initialize"
// import prox from "./plugin/prox"
// import enhance from "./plugin/enhance"

/**
* Construct a new prox object
*/
export function prox(ctx= {}, obj){
	if( obj!== undefined){
		// clone a fresh new ctx, add `.obj`.
		ctx= Object.assign({}, ctx, { obj })
	}else {
		ctx.obj= ctx.obj|| {}
	}
	ctx.handler = makeHandler(ctx)
	// create a fresh proxy on the object
	const proxied= new Proxy(obj, ctx)
	// run any registered initializers. opts.initializers will override global.
	
	initialize( obj, opts, proxied)
	return proxied
}
export default prox

//	proxPlugin.proxChain(proxied,handler._chains)
//	proxPlugin.proxObj(proxied,obj)
//	proxEnhance.proxEnhance(proxied)
