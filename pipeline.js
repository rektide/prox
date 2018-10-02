import _reflect from "./util/reflect.js"

export const phases= ["prerun", "run", "postrun"]

export const pipelineNames= Object.getOwnPropertyNames( _reflect)

export const pipelines= {}
export default pipelines

pipelineNames.forEach( name=> {
	pipelines[ name]= phases
})
