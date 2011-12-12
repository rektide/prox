var prox= require("../prox").prox

if(typeof exports === undefined)
	exports= {}

var aggro= exports.enhance= exports.aggro= function(o,opts) {
	o._enhance("aggro",function(o) {
		o._chains.set.chain.push(function(ctx) {
			var val= ctx.results
			if(typeof val == "object" && !val._chains)
				ctx.results= prox(val)
		})
	})
}
aggro.name= "aggro"
