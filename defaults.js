import { pipelines } from "./pipeline.js"
import propProx from "./plugin/prop-prox.js"
import reflect from "./plugin/reflect.js"

export { pipelines }

export const plugins= [ propProx, reflect]

export const defaults= {
	pipelines,
	plugins	
}
export default defaults

export function defaulter( opts){
	return { ...defaults, ...opts}
}
