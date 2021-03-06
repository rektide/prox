import { PhasedMiddlewarePipelines as pipelines, alias} from "./pipeline.js"
import cursor from "./cursor.js"
import proxProp from "./plugin/_prox.js"
import reflect from "./plugin/reflect.js"

export { pipelines }
export const
  Pipelines= pipelines,
  defaultPipelines= pipelines,
  DefaultPipelines= pipelines

export const
  plugins= Object.freeze([ proxProp, reflect]),
  Plugins= plugins,
  defaultPlugins= plugins,
  DefaultPlugins= plugins

export const defaults= {
	alias,
	cursor,
	pipelines,
	plugins,
}
export default defaults

export function defaulter( opts){
	return { ...defaults, ...opts}
}
