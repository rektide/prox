import tape from "tape"
import prox from ".."
import { handlerSymbol, symbolSymbol } from "../chain"

tape("normal operation", function(t){
	const o= prox.make({})
	o.blue = 0
	t.equal(o.blue, 0)
	o.red = 255
	t.equal(o.red, 255)
	t.end()
})

function doubleOutput( ctx){
	const val= ctx.args[2]
	if ( !isNaN( val)){
		ctx.args[2]*= 2
	}
	ctx.next()
}

tape("directly fiddle a .set trap", function(t){
	// this demonstrates HOW to directly modify a chain
	// but usually operator intervention at this level is not expected- plugins should install/uninstall automatically
	const
	  underlying= {},
	  o= prox.make(underlying),
	  // prox's `addPlugin` normally creates this:
	  doubleOutputHandler= {
		[handlerSymbol]: doubleOutput,
		[symbolSymbol]: Symbol("direct-fiddle")
	  }

	// base case
	o.blue= 4
	t.equal( o.blue, 4, "fresh proxy set")

	// create a ._chain, empty
	o.blue= 5
	t.equal( o.blue, 5, "._chain but no ._chain.set behaves normally")

	// now lets monkey with .set
	const chain= o._prox.chain("set")
	chain.run.unshift( doubleOutputHandler)
	o.blue= 6
	o.car= "honk"
	t.equal( o.blue, 12, "setDouble doubled a number")
	t.equal( o.car, "honk", "setDouble passed through non-number")

	// double monkey! what does it mean?!
	chain.run.unshift( doubleOutputHandler)
	t.equal( o.blue, 12, "existing value remains intact")
	o.blue= 24
	t.equal( o.blue, 96, "output is twice doubled")

	// revert our monkeyworking
	chain.run.splice(0, 2) // will clear our monkeying
	o.blue= 9
	t.equal( o.blue, 9, "setting works as normal once ._chain is cleared")
	t.end()
})


var doublePlugin= {
	set(ctx){
		doubleOutput(ctx)
	},
	install( prox){
		prox.chain("set").install( doublePlugin.set)
	},
	uninstall( prox){
		prox.chain("set").uninstall( doublePlugin.set)
	}
}
doublePlugin.set.phase= "prerun"

tape("install a double plugin", function(t){
	const
	  o= prox.make(),
	  startPlugins = o._prox.plugins
	o._prox.plugins= startPlugins.concat( doublePlugin)
	o.n = 2
	t.equal( o.n, 4, "double plugin")

	o._prox.plugins= o._prox.plugins.concat( doublePlugin)
	o.n = 16
	t.equal( o.n, 64, "two double plugins")

	o._prox.plugins= startPlugins
	o.n = 99
	t.equal( o.n, 99, "resetting plugins clears behavior")
	t.end()
})

// todo: plugin test that starts from prox with no defaults, adds a plugin, removes plugin, checks that chains are clear
