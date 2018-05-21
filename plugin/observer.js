
// ["add", "update", "delete", "reconfigure", "setPrototype", "preventExtensions"]

export class Observer{
	get phases(){
		return {
			run: {
				set: this.setObserver,
				deleteProperty: this.deletePropertyObserver,
				defineProperty: this.definePropertyObserver,
				setPrototypeOf: this.setPrototypeOfObserver,
				preventExtensions: this.preventExtensionsObserver
			}
		}
	}
	setObserver( ctx){
		// name, object, type, oldValue
	}
	deletePropertyObserver( ctx){
	}
	definePropertyObserver( ctx){
	}
	setPrototypeOfObserver( ctx){
	}
	preventExtensionsObserver( ctx){
	}

	// operator friendly, non-suffixed aliases
	get set(){
		return this.setObserver
	}
	get deleteProperty(){
		return this.deletePropertyObserver
	}
	get defineProperty(){
		return this.defineProperty
	}
	get setPrototypeOf(){
		return this.setPrototypeOf
	}
	get preventExtensions(){
		return this.preventExtensions
	}

	/**
	* user-facing interface of observer plugin, as Object.observe
	*/
	observe(callback, acceptList){
		for( const accept of acceptList){
			const handlers= this[ accept]|| (this[ accept]= [])
			handlers.push( callbck)
		}
	}
	constructor ( prox, symbol){
		this.symbol= symbol
		this.observe= this.observe.bind( this)

		// install our `observe` on the prox if none present
		prox.observe= prox.observe|| this.observe
	}
	static install( prox, symbol){
		// TODO: use this to instrument children in a manner that bubbles to parent
	}
	static uninstall( prox, symbol){
		const obs= prox[ symbol]
		if( prox.observe=== obs.observe){
			// remove our `observe` rom prox.
			delete prox.observe
		}
	}
}

export default Observer
