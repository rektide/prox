if(typeof exports === undefined)
	exports= {}


/**
 * A prototype for adding "meta" properties to an object. Plugins that want
 *  to expose themselves should consider using this.
 * @param o the object which is to be extended
 * @param meta the name of the extension to add to the object
 * @param ext the extension added
 */
var meta= exports.meta= function(o,meta,ext,opts) {
	opts= opts||{}
	var chains= o._chains||opts.chains,
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
			ctx.result= ext
	})
}

/**
 * add a _enhance function for adding enhancements
 */
var proxEnhance= exports.proxEnhance= function(o,opts) {
	opts= opts||{}
	var chains= handler._chains,
	  includes= opts.includes||{},
	  excludes= opts.excludes||[],

	function enhance(name,enhancer){
		if(typeof name == "function" && name.name){ //unpack
			enhancer= name
			name= enhancer.name
		}
		if(enhancer == null||excludes.indexOf(enhancer)==-1){
			var old= includes[name]
			includes[name]= enhancer
			if(!old && enhancer)
				enhancer.call(this,o,opts)
		}
	}
	enhance.opts= opts
	enhance.includes= includes
	enhance.excludes= excludes
	enhance.bless= function bless(o) {
		for(var i in includes) {
			o._enhance(i,includes[i])
		}
	}

	meta(o,"_enhance",enhance,opts)
}
