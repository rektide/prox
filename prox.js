var cc= require("cc"),
  proxPlugin= require("./plugin/prox"),
  proxEnhance= require("./plugin/enhance")

function completerFilter(ctx)
	{console.log("~~complete~~",ctx.result,ctx.name);return ctx ? ctx.result : undefined}

// build a chain runner
function runner(name,obj,cc){
	return function() {
		var ctx = {args:arguments,obj:obj,this:this,name:name}
		return cc.execute(ctx)
	}
}

var defaultChains= {
	getOwnPropertyDescriptor: function(ctx) {var name= ctx.args[0],
		  desc= Object.getOwnPropertyDescriptor(ctx.obj, name)
		// a trapping proxy's properties must always be configurable
		if(desc !== undefined) {desc.configurable= true}
		ctx.result= desc
	},
	getPropertyDescriptor: function(ctx) {var name= ctx.args[0],
		  desc= Object.getPropertyDescriptor(ctx.obj, name) // not in ES5
		// a trapping proxy's properties must always be configurable
		if(desc !== undefined) {desc.configurable= true}
		ctx.result= desc
	},
	getOwnPropertyNames: function(ctx) {
		ctx.result= Object.getOwnPropertyNames(ctx.obj)
	},
	getPropertyNames: function(ctx) {
		ctx.result= Object.getPropertyNames(ctx.obj)                // not in ES5
	},
	defineProperty: function(ctx) {var name = ctx.args[0], desc = ctx.args[1]
		Object.defineProperty(ctx.obj, name, desc)
	},
	delete: function(ctx) {var name= ctx.args[0]
		ctx.result= delete ctx.obj[name]
	},   
	fix: function(ctx) {
		if (Object.isFrozen(ctx.obj)) {
			var result= {}
			Object.getOwnPropertyNames(ctx.obj).forEach(function(name) {
				result[name]= Object.getOwnPropertyDescriptor(ctx.obj, name);
			})
			ctx.result= result
		}
		// As long as obj is not frozen, the proxy won't allow itself to be fixed
		// will cause a TypeError to be thrown
	},
	has: function(ctx) {var name= ctx.args[0]
		ctx.result= name in ctx.obj},
	hasOwn: function(ctx) {var name= ctx.args[0]
		ctx.result= ({}).hasOwnProperty.call(ctx.obj, name)},
	get: function(ctx) {var receiver= ctx.args[0], name= ctx.args[1]
		ctx.result= ctx.obj[name]
	},
	set: function(ctx) {var receiver= ctx.args[0], name= ctx.args[1], val= ctx.args[2]
		ctx.obj[name]= val
		ctx.result= true}, // bad behavior when set fails in non-strict mode
	enumerate: function(ctx) {
		var result= []
		for (var name in ctx.obj)
			result.push(name)
		ctx.result= result
	},
	keys: function(ctx) {
		ctx.result= Object.keys(ctx.obj);
	}
}

function handlerMaker(obj) {
	return new function(obj) {
		this._obj= obj
		this._chains= {}
		for(var i in defaultChains) {
			var base= defaultChains[i],
			  _cc= cc(base,{name:i,undefinedOnlyNonReturnable:true})
			base.postProcess= completerFilter
			this._chains[i]= _cc
			this[i]= runner(i,obj,_cc)
		}
		return this
	}(obj||{});
}
//var proxy= Proxy.create(handlerMaker(obj));

function doOrMake(a) {
	var handler= handlerMaker(a||{})
	var proxied= Proxy.create(handler)

	proxPlugin.proxChain(proxied,handler._chains)
	proxPlugin.proxObj(proxied,handler._obj)
	proxEnhance.proxEnhance(proxied,{chain:proxChain,obj:proxObj,enhance:proxEnhance})

	return proxied
}


/*
module prox {
	export var mkprox= doOrMake(handlerMaker) }
*/

exports.prox= doOrMake

