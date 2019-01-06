import _reflect from "./util/reflect.js"
import Namer, { $namePrefix} from "phased-middleware/name.js"

export const phases= ["run"]

export const
  names= Object.getOwnPropertyNames( _reflect),
  pipelineNames= names,
  PipelineNames= names

const namer= Namer( "prox", "pipeline")
export const
  symbols= Object.getOwnPropertyNames( _reflect).map( name=> namer({ [$namePrefix]: name})),
  pipelineSymbols= symbols,
  PipelineSymbols= symbols

// used to construct the phased middleware
export const
  phasedMiddlewarePipelines= {},
  PhasedMiddlewarePipelines= phasedMiddlewarePipelines

export const
  symbol= {},
  pipelineSymbol= symbol,
  PipelineSymbol= symbol

export const
  alias= {},
  Alias= alias

// populate dicts
symbols.forEach(( $symbol, i)=> {
	// every pipeline has the same phases
	phasedMiddlewarePipelines[ $symbol]= phases

	// build dicts
	const name= names[ i]
	// name->symbol
	symbol[ name]= $symbol
	alias[ name]= $symbol
	// symbol->name
	symbol[ $symbol]= name
})
