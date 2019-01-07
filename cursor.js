import { Cursor as PhasedMiddlewareCursor} from "phased-middleware/cursor.js"

export function extend( klass= PhasedMiddlewareCursor,{ name}= {}){
	const
	  name= name|| "Prox"+ klass.name,
	  wrapper={[ name]: class extends klass{
			get prox(){
				return this.phasedMiddleware
			}
			set prox( prox){
				this.phasedMiddleware= prox
			}
	  }} 
	return wrapper[ name]
}

export const
  cursor= extend( PhasedMiddlewareCursor), // PMC's "name" is 'Cursor'
  Cursor= cursor,
  ProxCursor= cursor
export default cursor
