export pipelines from "./pipeline.js"
import propProx from "./plugin/prop-prox.js"
import reflect from "./plugin/reflect.js"

export const middlewares= [ propProx, reflect]

export const defaults= {
	pipelines,
	middlewares
}
