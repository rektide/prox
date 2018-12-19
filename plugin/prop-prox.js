export function makePropProx( propertyName= "_prox"){
	function getPropProx( context){
		if( context.inputs[ 1]=== "_prox"){
			setOutput( context.phasedMiddleware) // return the prox
			context.position= context.phasedRun.length // terminate
		}
	}
	getPropProx.phase= {pipeline: "get", phase: "prerun"}
	return {
		name: "prop-prox",
		get: getPropProx
	}
}

export const propProx= makePropProx()

export default propProx
