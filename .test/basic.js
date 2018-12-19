import tape from "tape"
import factory, { Prox } from "../prox.js"

tape( "can get/set from a prox", function( t){
	const p= factory()
	p.ok= 42
	t.equal( p.ok, 42, "set/get works")
	t.end()
})

tape( "prox has it's own _prox", function( t){
	const
	  prox = new Prox(),
	  o= prox.proxied
	o.ok= 42
	t.equal( o._prox, prox, "o has _prox")
	t.end()
})
