
/**
* Minimal `cc` function wrapper around JavaScript's `Reflect` implementations
*/
export const defaultHandler = {}
/**
* The fallback chain for each proxy handler method. Defaults to the defaultHandler.
* Users 
*/
export const defaultChain = {}
export defaultChain

// For each member of Reflect, generate a corresponding handler, & chain consisting of just that handler.
Object.getOwnPropertyNames(Reflect).forEach( function( method){
	const
	  unshadowed= defaultChain, // save this name so we can "shadow" it with the specific impl
	  reflected= Reflect[ method], // find the canonical method
	  defaultHandler= function( ctx){ // create our handler
		const args= ctx.args
		ctx.output= reflected(...args) // run, save `output`
		ctx.next() // go to next
	  }
	unshadowed[ method]= defaultHandler // just our default handler
	defaultChain[ method]= [defaultHandler]
})
