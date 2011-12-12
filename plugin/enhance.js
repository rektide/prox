if(typeof exports === undefined)
	exports= {}

/**
 * Enhance is a prototype for adding "meta" properties to an object. Plugins that want
 *  to expose themselves should consider using this.
 * @name enhance
 * @param target the object which is to be extended
 * @param extension the extension to add to the object
 * @param name the meta-name for the extension
 */
var prox= exports.enhance= exports.enhancePlugin= function(target,extension,name,opts) {
	opts= opts||{}
	var chains= target._chains,
	  paranoid= opts.beParanoid
	chains.getPropertyDescriptor.chain.push(function(ctx){var cname= ctx.args[0]
		if(cname == meta) {
			// TODO: ctx.results = ??
		}
	})
	chains.getPropertyNames.chain.push(paranoid?function(ctx){
		if(ctx.results.indexOf(name) == -1)
			ctx.results.push(name)
	}
	:function(ctx){}(
		ctx.results.push(name)
	))
	chains.has.chain.push(function(ctx){var cname= ctx.args[0]
		if(cname == meta)
			ctx.results= true
	})
	chains.get.chain.push(function(ctx){var cname= ctx.args[0]
		if(cname == meta)
			ctx.result= extension
	})
}
