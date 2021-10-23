var eventEmitter= require("events").EventEmitter,
  meta= require("./enhance.js").meta

if(typeof exports === undefined)
	exports= {}

var crud= exports.enhance= exports.crud= function(o,opts) {
	opts= opts||{}
	var chains= o._chains,
	  reads= !!opts.reads,
	  updateOnly= !!opts.updateOnly,
	  ctxFul= !!opts.ctxFul,
	  evt= new eventEmitter()
	if(!chains)
		throw "No _chains"

	if(!ctxFul) {
		// does not expose request ctx directly, safer-like.
		chain.set.chain.push(function(){
			return !updateOnly ? 
				function(ctx){var name= ctx.args[1], val= ctx.args[2]
					evt.emit(o[name]?"update":"create",name,val)
				}
			: function(ctx){
					evt.emit("update",name,val)
				}
		}())
		chain.delete.chain.push(function(ctx){var name= ctx.args[0], dropped= ctx.result
			evt.emit("delete",name,dropped)
		})
		if(reads)
			chain.get.chain.push(function(ctx){var name= ctx.args[0], returned= ctx.result
				evt.emit("read",name,returned)
			})
	} else {
		// simpler path that emits the entire ctx for app to dice and mangle in inadvisable ways
		chain.set.chain.push(function(){
			return !updateOnly ? 
				function(ctx){var name= ctx.args[1]
					evt.emit(o[name]?"update":"create",ctx)
				}
			: function(ctx){
					evt.emit("update",ctx)
				}
		}())
		chain.delete.chain.push(function(ctx){
			evt.emit("delete",ctx)
		})
		if(reads)
			chain.get.chain.push(function(ctx){
				evt.emit("read",ctx)
			})

	}

	meta(o,"_crud",{evt:evt},opts)
	return evt
}
crud.name= "crud"
