import cc from "command-chain"
import defaultChain from "./default-chains"

export const handler= {}
export default handler

// for each proxy handler method, create a small `cc` invoker
Object.keys( defaultChain).forEach( function( method){
	// create a handler taking all the trap arguments
	handler[ method]= function ( ...args){
		const
		  // get target
		  target= args[0],
		  // get the chain we want to run
		  chain= target._chain&& target._chain[ method]|| defaultChain[ method]
		// run chain
		const val= cc({
			chain, // the chain to run!
			method, // which event on the proxy is firing
			args
		})
		return val
	}
})
