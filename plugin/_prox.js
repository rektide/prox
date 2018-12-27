export function makeProxProp( propertyName= "_prox"){
	function getPropProx( context){
		const key= context.inputs[ 1]
		if( key=== "_prox"){
			context.setOutput( context.phasedMiddleware) // return the prox
			context.position= context.phasedRun.length // terminate
		}
	}
	getProxProp.phase= { pipeline: "get", phase: "prerun"}
	return {
		name: "prox-prop",
		get: getProxProp
	}
}

export const
  _prox= makePropProx(),
  prox= _prox,
  proxProp= _prox

export default _prox
