import tape from "tape"
import Chain from "../chain"

tape("can install a single handler", function(t){
	t.plan( 1)
	const
	  chain= new Chain(),
	  symbol = Symbol()
	chain.install(()=> t.pass( "run handler"), symbol, "run")
	for( const el of chain){
		el[ Chain.handlerSymbol]()
	}
	t.end()
})
