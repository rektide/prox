export const phases= [ "prerun", "run", "postrun"]

export class Chain extends Array{
	static get phases(){
		return phases
	}
	static set phases(v){
		phases.splice( 0, phases.length, ...v)
	}
	constructor(){
		super()
		this.phases = []
	}
	install( fn, phase){
		// find phase
		if( !fn){
			return
		}
		if( phase=== undefined){
			phase= fn.phase
		}
		const
		  phaseNumber= phases.indexOf( phase),
		  hasPhase= phaseNumber!== -1
		let target= phaseNumber=== -1? this.free: this.phases[ phaseNumber]
		if( !target){
			if( hasPhase){
				target= this.phases[ phaseNumber]= []
			}else{
				target= this.free= []
			}
		}
		target.push( fn)
		this.rebuild()
	}
	uninstall( fn, phase){
		// find phase
		if( !fn){
			return
		}
		if( phase=== undefined){
			phase= fn.phase
		}
		const
		  phaseNumber= phases.indexOf( phase),
		  hasPhase= phaseNumber!== -1
		let target= phaseNumber=== -1? this.free: this.phases[ phaseNumber]
		if( !target){
			return
		}
		const index= target.indexOf( fn)
		if( index=== -1){
			return
		}
		target.splice( index, 1)
		this.rebuild()
	}
	rebuild(){
		// zero self out
		this.splice( 0, this.length)
		// rebuild our contents from the phases + free
		for( let phaseNumber in phases){
			var phaseHandlers= this.phases[ phaseNumber]
			if( phaseHandlers){
				this.push( ...phaseHandlers)
			}
		}
		// rebuild our free handlers at the end
		if( this.free){
			this.push( ...this.free)
		}
	}
}

export default Chain
