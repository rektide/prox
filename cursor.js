import { Cursor as PhasedMiddlewareCursor} from "phased-middleware/cursor.js"

export function extend( klass){
	return class extends klass{
		get prox(){
			return this.phasedMiddleware
		}
		set prox( prox){
			this.phasedMiddleware= prox
		}
	}
}

export const
  cursor= extend( PhasedMiddlewareCursor),
  Cursor= cursor,
  PhasedMiddlewareCursor= cursor
export default cursor
