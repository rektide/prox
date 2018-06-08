export const
  /**
  * List of phases, in the order they are run
  */
  phases= [ "prerun", "run", "postrun"],
  // each step of the chain is an object with two property symbols:
  /**
  * property symbol for a handler function for this step in the chain
  */
  stepHandlerSymbol= Symbol("stepHandler"),
  /**
  * property symbol for a unique symbol for this step in the chain, used to store the chain step's state.
  */
  stepStateSymbol= Symbol("stepState"),
  /**
  * used by an `exec` to store the current step's unique stepStateSymbol.
  */
  stepStateSymbolSymbol= Symbol("stepStateSymbolSymbol")

/**
* Helper for steps to get their state with
*/
export function stepState( exec){
	// find the step's plugin state symbol & retrieve symbol from the prox
	const
	  stepStateSymbol= exec[ stepStateSymbolSymbol],
	  state= exec.prox[ stepStateSymbol]
	return state
}

/**
* @this - a command-chain `exec`
*/
export function chainEval( step){
	// Originally I'd intended to .call() with the stepState but:
	// a. i'm happy passing via `.symbol` so this is semi-redundant
	// b. i'm a little nervous .call() will have some minor performance impacts
	// c. i don't want to block someone who wants to .bind() their handler in some creative manner! for now i leave the use of `this` free.
	//return step[ stepHandlerSymbol].call( this.symbol, this)

	this[ stepStateSymbolSymbol]= step[ stepStateSymbol]
	// many plugins could well not need state passed to them, so don't waste the lookup: call stepState helper if needed.
	// this[ stepStateSymbol]= this.prox[ this[ stepStateSymbolSymbol]]
	return step[ stepHandlerSymbol]( this)
}

export class Chain extends Array{
	static get phases(){
		return phases
	}
	static set phases(v){
		phases.splice( 0, phases.length, ...v)
	}
	static get stepHandlerSymbol(){
		return stepHandlerSymbol
	}
	static get stepStateSymbol(){
		return stepStateSymbol
	}
	static get chainEval(){
		return chainEval
	}
	constructor(){
		super()
	}
	[Symbol.iterator](){
		const phaseName= phases[ 0]
		return {
			chain: this,
			phaseNum: 0,
			phaseName,
			phaseSteps: this[ phaseName],
			stepNum: 0,
			stepState: undefined,
			next: function(){
				let step= this.step= this.phaseSteps&& this.phaseSteps[ this.stepNum++]
				while( !step){ // advance to next phase
					if( this.phaseNum>= phases.length){
						return {
							done: true
						}
					}
					++this.phaseNum
					const phaseName= this.phaseName= phases[ this.phaseNum]
					this.phaseSteps= this.chain[ phaseName]
					this.stepNum= 0
					step= this.step= this.phaseSteps&& this.phaseSteps[ this.stepNum++]
				}
				return {
					value: step,
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
			[stepHandlerSymbol]: handler, // the handler
			[stepStateSymbol]: symbol // the symbol to retrieve the handlers state with
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
			if( step[ stepHandlerSymbol]=== handler&& (!symbol || step[ stepStateSymbol]=== symbol)){
				steps.splice( i, 1)
				return true
			}
		}
		return false
	}
}

export default Chain
