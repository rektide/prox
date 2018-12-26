export class Manager{
	constructor(){
		this.current= null // promise for in progress
		this.finish= this.finish.bind( this)
		this.queue= [] // queue of things to run
	}
	push( o){
		if( !o){
			return
		}
		if( this.current=== null&& this.queue.length=== 0){
			// nothing in progress, launch now
			return this.dispatch( o)
		}
		// queue work
		this.queue.push( o)
	}
	dispatch( o= this.queue.pop()){
		if( !o){
			return
		}
		const val= o()
		if( val.then){
			// complete async work then go again
			val.then( this.finish)
			this.current= val
			return
		}
		// sync work complete, go again
		this.dispatch()
	}
	finish(){
		// this promise just wrapped
		this.current= null
		// run next
		this.dispatch()
	}
}

export const singleton= new Manager()
export default singleton
