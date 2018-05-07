import cc from "cc"
import defaultChain from "./default-chain"

export const handler= {}
export default handler

// for each proxy handler method, create a small `cc` invoker
Object.keys( defaultChain).forEach( function( method){
	handler[ method]= function ( ...args){
		const
		  // get target
		  target= args[0],
		  // get the chain we want to run
		  chain= target._chain&& target._chain[ method]|| defaultChain[ method]
		// run chain
		return cc({
			chain, // the chain to run!
			method, // which event on the proxy is firing
			args
		})
	}
})
