export const
  /**
  * List of phases, in the order they are run
  */
  phases= [ "prerun", "run", "postrun"],
  /**
  * Store the handler with this symbol
  */
  handlerSymbol= Symbol("handler"),
  /**
  * Store the symbol prox allocates per-plugin-instance with this symbol
  */
  symbolSymbol= Symbol("symbol")

export function chainEval( el){
	this.symbol= el[ symbolSymbol]
	return el[ handlerSymbol]( this)
}

export class Chain extends Array{
	static get phases(){
		return phases
	}
	static set phases(v){
		phases.splice( 0, phases.length, ...v)
	}
	static get handlerSymbol(){
		return handlerSymbol
	}
	static get symbolSymbol(){
		return symbolSymbol
	}
	static get chainEval(){
		return chainEval
	}
	constructor(){
		super()
	}
	[Symbol.iterator](){
		return {
			chain: this,
			phase: 0,
			pos: 0,
			next: function(){
				if( this.phase>= phases.length){
					return {
						done: true
					}
				}
				const
				  phaseName= phases[ this.phase],
				  phase= this.chain[ phaseName]
				if( !phase|| this.pos>= phase.length){
					++this.phase
					this.pos= 0
					return this.next()
				}
				const value= phase[ this.pos++]
				return {
					value,
					done: false
				}
			}
		}
		return iterator
	}
	install( handler, symbol, phase){
		// find phase
		if( !handler){
			return
		}
		if( phase=== undefined){
			phase= handler.phase|| "run"
		}
		const els= this[ phase]|| (this[ phase]= [])
		els.push({
			[handlerSymbol]: handler,
			[symbolSymbol]: symbol
		})
	}
	uninstall( handler, symbol, phase){
		// find phase
		if( !handler){
			return
		}
		if( phase=== undefined){
			phase= handler.phase|| "run"
		}
		const els= this[ phase]
		if( !els){
			return false
		}
		for( let i in els){
			const el= els[ i]
			if( el[ handlerSymbol]=== handler&& el[ symbolSymbol]=== symbol){
				els.splice( i, 1)
				return true
			}
		}
		return false
	}
}

export default Chain
