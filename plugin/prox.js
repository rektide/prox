if(typeof exports === undefined)
	exports= {}

var prox= exports.enhance= exports.prox= function(handler,opts) {
	opts= opts||{}
	var chains= handler._chains,
	  paranoid= opts.beParanoid,
	  meta= opts.name||"_chain"
	chains.getPropertyDescriptor.chain.push(function(ctx){var name= ctx.args[0]
		if(name == meta) {
			// TODO: ctx.results = ??
		}
	})
	chains.getPropertyNames.chain.push(function(ctx){
		if(!paranoid || ctx.results.indexOf(meta) == -1)
			ctx.results.push(meta)
	})
	chains.has.chain.push(function(ctx){var name= ctx.args[0]
		if(name == meta)
			ctx.results= true
	})
	chains.get.chain.push(function(ctx){var name= ctx.args[0]
		if(name == meta)
			return chains
	})
}
