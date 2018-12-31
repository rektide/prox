export let currentObject

export function makeProxProp( propertyName= "_prox"){
	function getProxProp( context){
		const key= context.inputs[ 1]
		if( key=== "_prox"){
			currentObject= context.inputs[ 0]
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
  _prox= makeProxProp(),
  prox= _prox,
  proxProp= _prox

export default _prox
