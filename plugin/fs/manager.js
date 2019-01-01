import Deferrant from "deferrant"

export class Manager{
	constructor(){
		this.empty= null
		this.current= null // promise for in progress
		this.finish= this.finish.bind( this)
		this.queue= [] // queue of things to run
	}
	awaitEmpty(){
		if( !this.queue.length){
			return Promise.resolve( this)
		}
		if( !this.empty){
			this.empty= Deferrant()
		}
		return this.empty
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
			if( this.empty){
				this.empty.resolve()
				this.empty= null
			}
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

export const
  singleton= new Manager(),
  managerSingleton= singleton,
  ManagerSingleton= singleton
export default singleton
