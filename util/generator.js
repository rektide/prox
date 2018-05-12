export function forEach( iterable, fn){
	for( var o of iterable){
		fn( o)
	}
}

export function * map( iterable, fn){
	for( var o of iterable){
		yield fn( o)
	}
}
