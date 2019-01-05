import tape from "tape"
import make, { Prox } from "../prox.js"

tape( "can get/set from a prox", function( t){
	const p= make()
	p.ok= 42
	t.equal( p.ok, 42, "set/get works")
	t.ok( p._prox, "has a _prox")
	t.end()
})

tape( "prox has it's own _prox", function( t){
	const
	  plain= {},
	  prox= new Prox( plain),
	  proxied= prox.proxied
	t.equal( proxied._prox, prox, "proxied has a _prox")
	t.notOk( plain._prox, "plain object has no _prox")
	t.end()
})

tape( "prox can be dynamically modified", function( t){
	const proxied= make()
	proxied.myValue= 5

	// create & install a plugin that totals up all values that are set on count
	let
	  aggregate= 0,
	  n= 0
	function aggregator( cursor){
		// we're observing a new value, so:
		aggregate+= cursor.inputs[ 2]// add 'value' to total
		++n // register that we've seen a new value
	}
	aggregator.phase= { pipeline: "set", phase: "postrun"}
	// install
	proxied._prox.install({ get: aggregator })
	// we have not set yet so aggregate has not changed since being defined
	t.equal( aggregate, 0, "aggregate starts at 0")
	t.equal( n, 0, "no values observed so far")

	// set our value and watch aggregate change
	proxied.myValue= 10
	t.equal( aggregate, 10, "aggregate goes up to 10")
	t.equal( n, 1, "observed 1 value")
	proxied.myValue= 50
	t.equal( aggregate, 60, "aggregate goes up to 60")
	t.equal( n, 2, "observed 2 values")

	proxied.hahaha= 30
	t.equal( aggregate, 90, "aggregate isn't watching any particular field, goes to 90")
	t.equal( n, 3, "observed 3 values")
	t.end()
})
