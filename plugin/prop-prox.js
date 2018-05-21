export function getPropProx( ctx){
	if( ctx.args[1]=== "_prox"){
		ctx.output= ctx.prox
	}
	ctx.next()
}
getPropProx.phase= "postrun"

export const propProx= {
	phases: {
		postrun: {
			getPropProx
		}
	},
	name: "propProx"
}

export default propProx
