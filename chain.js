export const
  /**
  * List of phases, in the order they are run
  */
  phases= [ "prerun", "run", "postrun"],
  // each step of the chain is an object with two property symbols:
  /**
  * property symbol for a handler function for this step in the chain
  */
  handlerSymbol= Symbol("handler"),
  /**
  * property symbol for a unique symbol for this step in the chain, used to store the chain step's state.
  */
  pluginStateSymbol= Symbol("pluginState")

/**
* @this - a command-chain `exec`
*/
export function chainEval( step){
	// find the step's plugin state symbol & retrieve symbol from the prox
	const
	  symbol= step[ pluginStateSymbol],
	  pluginState= this.prox[ symbol]
	// each chain step will update `exec`'s `.pluginState` as the chain executes
	this.pluginState = pluginState

	// Originally I'd intended to .call() with the pluginState but:
	// a. i'm happy passing via `.symbol` so this is semi-redundant
	// b. i'm a little nervous .call() will have some minor performance impacts
	// c. i don't want to block someone who wants to .bind() their handler in some creative manner! for now i leave the use of `this` free.
	//return step[ handlerSymbol].call( this.symbol, this)

	return step[ handlerSymbol]( this)
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
	static get pluginStateSymbol(){
		return pluginStateSymbol
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
			// handler can specify phase or default to "run"
			phase= handler.phase|| "run"
		}
		// retrieve or create the array of steps for this phase
		const steps= this[ phase]|| (this[ phase]= [])
		// add our new step
		steps.push({
			[handlerSymbol]: handler, // the handler
			[pluginStateSymbol]: symbol // the symbol to retrieve the handlers state with
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
		const steps= this[ phase]
		if( !steps){
			return false
		}
		for( let i in steps){
			const step= steps[ i]
			if( step[ handlerSymbol]=== handler&& (!symbol || step[ pluginStateSymbol]=== symbol)){
				steps.splice( i, 1)
				return true
			}
		}
		return false
	}
}

export default Chain
