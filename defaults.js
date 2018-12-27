import { pipelines } from "./pipeline.js"
import proxProp from "./plugin/_prox.js"
import reflect from "./plugin/reflect.js"

export { pipelines }

export const plugins= Object.freeze([ proxProp, reflect])

export const defaults= {
	pipelines,
	plugins
}
export default defaults

export function defaulter( opts){
	return { ...defaults, ...opts}
}
