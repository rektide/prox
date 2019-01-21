export class AggroData{
	constructor( opts){
		this.key= opts.key
		this.parent= opts.parent
		this.parentSymbol= opts.parentSymbol
	}
	*[Symbol.iterator](){
		let iter= this
		while( iter){
			yield iter
			iter= iter.parent[ iter.parentSymbol] // parent's iter
		}
	}
}
export default AggroData
