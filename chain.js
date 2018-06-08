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
	//// find the step's plugin state symbol & retrieve symbol from the prox
	//const
	//  symbol= step[ pluginStateSymbol],
	//  pluginState= this.prox[ symbol]
	//// each chain step will update `exec`'s `.pluginState` as the chain executes
	//this.pluginState = pluginState

	// Originally I'd intended to .call() with the pluginState but:
	// a. i'm happy passing via `.symbol` so this is semi-redundant
	// b. i'm a little nervous .call() will have some minor performance impacts
	// c. i don't want to block someone who wants to .bind() their handler in some creative manner! for now i leave the use of `this` free.
	//return step[ handlerSymbol].call( this.symbol, this)

	return step[ handlerSymbol]( this)
}

/**
* Helper for plugins to get their state with
*/
export function pluginState( step){
	//// find the step's plugin state symbol & retrieve symbol from the prox
	const
	  symbol= step[ pluginStateSymbol],
	  pluginState= this.prox[ symbol]
	// each chain step will update `exec`'s `.pluginState` as the chain executes
	return pluginState
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
		const phaseName= phases[ 0]
		return {
			chain: this,
			phaseNum: 0,
			phaseName,
			phaseSteps: this[ phaseName],
			stepNum: 0,
			next: function(){
				const report= (v)=>{
					console.log({
						phaseName: this.phaseName,
						stepNum: this.stepNum
					})
				}
				report("start")
				let step= this.step= this.phaseSteps&& this.phaseSteps[ this.stepNum++]
				while( !step){ // advance to next phase
					report("while")
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
