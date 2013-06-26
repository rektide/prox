var prox= require("../prox").prox

if(typeof exports === undefined)
	exports= {}

function aggro(o,opts) {
	o._enhance("aggro",function(o) {
		o._chains.set.chain.push(function(ctx) {
			var val= ctx.results
			if(typeof val == "object" && !val._chains)
				ctx.results= prox(val)
		})
	})
}
exports.enhance= exports.aggro= aggro
