export function getPropProx( ctx){
	if( ctx.args[1]=== "_prox"){
		ctx.output= ctx.prox
	}
	ctx.next()
}
getPropProx.phase= "postrun"

const postrun= {
	getPropProx
}

export const propProx= {
	phases: {
		postrun
	}
}

export default propProx
