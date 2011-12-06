var cc= require("cc")


function completerFilter(ctx)
	{return ctx ? ctx.result : undefined}

// build a chain runner
function runner(obj,filter)
{
	filter.filter= completerFilter
	var chain= cc(filter,{undefinedOnlyNonReturnable:true})
	return function(){
		var result= chain.execute(obj,{args:arguments,obj:obj})
		if(result)
			return result.result
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
	has: function(name) {var name= ctx.args[0]
		ctx.result= name in ctx.obj},
	hasOwn: function(name) {var name= ctx.args[0]
		ctx.result= ({}).hasOwnProperty.call(ctx.obj, name)},
	get: function(ctx) {var receiver= ctx.args[0], name= ctx.args[1]
		ctx.result= obj[name]
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
		ctx.result= Object.keys(obj);
	}
}

function handlerMaker(obj,args) {
	return new function prox(obj) {
		this._obj= obj
		var chains= this._chains= {}
		for(var i in defaultChains) {
			var chain= defaultChains[i]
			chains[i]= chain
			this[i]= runner(obj,chain)
		}
		return this
	}(obj||{});
}
//var proxy= Proxy.create(handlerMaker(obj));

function doOrMake(a) {
	var handler= handleMaker(a||{})
	var proxied= Proxy.create(handler)
	proxied._prox= handler.prox // TODO: plugin that creates this exposure
	return proxied
}


/*
module prox {
	export var mkprox= doOrMake(handleMaker); }
*/

/*
exports.mkprox= doOrMake(handleMaker);
*/




