var cc= require("cc")

function handlerMaker(obj) {
	// build a chain runner
	function runner(default)
	{
		var chain= cc(arguments)
		return function(){
			var result = chain.execute({args:arguments,undefinedOnlyNonReturn:true})
			return result
		}
	}
	function completer(ctx)
	{
		if(ctx.result)
			return ctx.result
		return undefined
	}
	
	var prox = {
	}

	return function prox(obj) {
		obj= obj||{}
		this.prox= prox

		function transparentGetOwnPropertyDescriptor(ctx) {
			var name= args[0],
			  desc = Object.getOwnPropertyDescriptor(obj, name)
			// a trapping proxy's properties must always be configurable
			if (desc !== undefined) { desc.configurable = true; }
			ctx.result= desc
			return false
		}
		this.getOwnPropertyDescriptor= runner([transparentGetOwnPropertyDescriptor,completer])
		
		function transparentGetPropertyDescriptor(ctx) {
			var name= args[0],
			  desc = Object.getPropertyDescriptor(obj, name) // not in ES5
			// a trapping proxy's properties must always be configurable
			if (desc !== undefined) { desc.configurable = true; }
			ctx.result= desc
			return desc
		}
		this.getPropertyDescriptor= runner([transparentGetPropertyDescriptor,completer])

		function transparentGetOwnPropertyNames() {
			return Object.getOwnPropertyNames(obj);
		}
		this.getOwnPropertyNames= runner([transparentGetOwnPropertyNames,completer])


		getPropertyNames: function() {
			return Object.getPropertyNames(obj);                // not in ES5
		},
		defineProperty: function(name, desc) {
			Object.defineProperty(obj, name, desc);
		},
		delete:     function(name) { 
			return delete obj[name]; 
		},   
		fix:        function() {
			if (Object.isFrozen(obj)) {
			var result = {};
			Object.getOwnPropertyNames(obj).forEach(function(name) {
				result[name] = Object.getOwnPropertyDescriptor(obj, name);
			});
			return result;
		}
		// As long as obj is not frozen, the proxy won't allow itself to be fixed
			return undefined; // will cause a TypeError to be thrown
		},
		has:        function(name) { return name in obj; },
		hasOwn:     function(name) { return ({}).hasOwnProperty.call(obj, name); },
		get:        function(receiver, name) { return obj[name]; },
		set:        function(receiver, name, val) { obj[name] = val; return true; }, // bad behavior when set fails in non-strict mode
		enumerate:  function() {
			var result = [];
			for (var name in obj) { result.push(name); };
				return result;
		},
		keys: function() { return Object.keys(obj); }
	}();
}
//var proxy = Proxy.create(handlerMaker(obj));

function doOrMake(a) {
	var handler = handleMaker(a||{})
	var proxied = Proxy.create(handler)
	proxied._prox = handler.prox // TODO: plugin that creates this exposure
	return proxied
}


/*
module prox {
	export var mkprox = doOrMake(handleMaker); }
*/

/*
exports.mkprox = doOrMake(handleMaker);
*/




