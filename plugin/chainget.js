var prox= require("../prox")

var chainy= /^_chain(.*)/

function chainget(o,a){
	function chainget(o){
		o._chains.get.push(function(ctx){
			var res
			if(ctx.result == null && (res= chainy.exec(ctx.args[0])) && prox.defaultChains[res[1]]){
				ctx.result= ctx.obj._chains[res]
			}
		})
	}
	o._enhance("chainget",chainget)
}
