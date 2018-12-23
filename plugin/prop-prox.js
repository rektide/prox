export function makePropProx( propertyName= "_prox"){
	function getPropProx( context){
		const key= context.inputs[ 1]
		if( key=== "_prox"){
			context.setOutput( context.phasedMiddleware) // return the prox
			context.position= context.phasedRun.length // terminate
		}
	}
	getPropProx.phase= { pipeline: "get", phase: "prerun"}
	return {
		name: "prop-prox",
		get: getPropProx
	}
}

export const propProx= makePropProx()

export default propProx
