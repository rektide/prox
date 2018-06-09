import tape from "tape"
import Chain, { stepHandlerSymbol } from "../chain"

tape("can install a single handler", function(t){
	t.plan( 1)
	const
	  chain= new Chain(),
	  symbol = Symbol(),
	  singleHandler= ()=> {console.log("go");t.pass( "run handler")}
	chain.install( singleHandler, symbol, "run")
	for( const el of chain){
		el[ stepHandlerSymbol]()
	}
	t.end()
})

tape("can install multiple handlers", function(t){
	t.plan( 3)
	const
	  chain= new Chain(),
	  symbol = Symbol()
	chain.install(()=> t.pass( "run handler 1"), symbol, "run")
	chain.install(()=> t.pass( "run handler 2"), symbol, "run")
	chain.install(()=> t.pass( "run handler 3"), symbol, "run")
	for( const el of chain){
		el[ stepHandlerSymbol]()
	}
	t.end()
})

tape("can install & uninstall a handler", function(t){
	t.plan( 1)
	const
	  chain= new Chain(),
	  symbol = Symbol(),
	  handler= ()=> t.pass("run handler")
	chain.install(handler, symbol, "run")
	for( const el of chain){
		el[ stepHandlerSymbol]()
	}
	chain.uninstall(handler, symbol, "run")
	for( const el of chain){
		// there should be no elements
		el[ stepHandlerSymbol]()
	}
	t.end()
})

tape("can install multiple & uninstall a handler", function(t){
	t.plan( 3)
	const
	  chain= new Chain(),
	  symbol = Symbol(),
	  handler1= ()=> t.pass("run handler 1"),
	  handler2= ()=> t.pass("run handler 2")
	chain.install(handler1, symbol, "run")
	chain.install(handler2, symbol, "run")
	for( const el of chain){
		el[ stepHandlerSymbol]()
	}
	chain.uninstall(handler2, symbol, "run")
	for( const el of chain){
		el[ stepHandlerSymbol]()
	}
	t.end()
})

tape("handlers run in their phase order", function(t){
	t.plan( 4)
	let step= 0
	const
	  chain= new Chain(),
	  symbol = Symbol()
	chain.install(()=> t.equal(++step, 4, "postrun"), symbol, "postrun")
	chain.install(()=> t.equal(++step, 2, "run"), symbol, "run")
	chain.install(()=> t.equal(++step, 3, "run"), symbol, "run")
	chain.install(()=> t.equal(++step, 1, "prerun"), symbol, "prerun")
	for( const el of chain){
		el[ stepHandlerSymbol]()
	}
	t.end()
})
