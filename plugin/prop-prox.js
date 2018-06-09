export function getPropProx( exec){
	if( exec.args[1]=== "_prox"){
		exec.output= exec.prox
	}
	exec.next()
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
