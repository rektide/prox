
/**
* Minimal `cc` function wrapper around JavaScript's `Reflect` implementations
*/
export const defaultHandler= {}
const _defaultHandler = defaultHandler // save this name so we can "shadow" it with the specific impl

/**
* The fallback chain for each proxy handler method. Defaults to the defaultHandler.
* Users 
*/
export const defaultChain = {}
export default defaultChain

// For each member of Reflect, generate a corresponding handler, & chain consisting of just that handler.
Object.getOwnPropertyNames(Reflect).forEach( function( method){
	const
	  reflected= Reflect[ method], // find the canonical method
	  defaultHandler= function( ctx){ // create our handler
		const args= ctx.args
		ctx.output= reflected(...args) // run, save `output`
		ctx.next() // run everything
	  }
	_defaultHandler[ method]= defaultHandler // just our default handler
	defaultChain[ method]= [defaultHandler]
})
