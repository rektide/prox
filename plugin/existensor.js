var prox= require("../prox.js").prox

function existens(o,opts){
	function existens(o){
		function existens(ctx){
			var slot= ctx.args[0]
			if(!ctx.existens){
				ctx.result= prox(ctx.result)
				ctx.obj._enhance.bless(ctx.result)
			}
		}
		// add the existens handler to the get chain
		o._chains.get.push(existens)
	}
	o._enhance("existensor",existens) // this module is existens
}
