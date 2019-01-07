import { Cursor} from "phased-middleware/cursor.js"

Object.defineProperty( Cursor.protype, "prox", {
	get: function(){
		return this.phasedMiddleware
	}
	set: function( prox){
		this.phasedMiddleware= prox
	}
})
