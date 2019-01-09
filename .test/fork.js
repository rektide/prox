import tape from "tape"
import { plugins} from "../defaults.js"
import factory from "../prox.js"

tape( "can fork a prox", function( t){
	const orig= factory()
	orig.ok= 42
	t.equal( orig.ok, 42, "set/get works")

	// this test isn't stateful, just making sure reflect continues to work
	const
	  newObj= {ok: 99},
	  forked= orig._prox.fork( newObj)
	t.equal( forked.ok, 99, "forked object finds own values")

	// validate some expected
	t.equal( forked._prox.parent, orig._prox, "forked prox has parent")
	t.end()
})


// modelled after _prox, but retrieves the underlying objects symbol map & pluginData
const magicTestPlugin= {
	name: "magic-test",
	get: function( cursor){
		const key= cursor.inputs[ 1]
		if( key=== "_magicTest"){
			cursor.setOutput({ pluginData: cursor.pluginData, symbol: cursor.symbol, symbols: cursor.symbols})
			cursor.position= cursor.phasedRun.length // terminate
		}
	},
	set: function( cursor){
		const key= cursor.inputs[ 1]
		if( key=== "_magicTest"){
			cursor.pluginData= cursor.inputs[ 2]
			cursor.position= cursor.phasedRun.length
			cursor.setOutput( true)
		}
	}
}
magicTestPlugin.get.phase= { pipeline: "get", phase: "prerun"}
magicTestPlugin.set.phase= { pipeline: "set", phase: "prerun"}

tape( "can fork a prox", function( t){
	const
	  obj= {},
	  magicPlugins= [ magicTestPlugin, ...plugins],
	  proxed= factory(obj,{ plugins: magicPlugins}),
	  prox= proxed._prox

	const
	  newObj= {ok: 99},
	  forked= prox.fork( newObj)
	t.equal( forked.ok, 99, "forked object finds own values")

	// validate changes on prox
	t.equal( proxed._prox, prox, "proxed._prox is prox")
	t.equal( forked._prox.parent, prox, "forked._prox has parent prox")

	// validate clean magicTest state
	t.ok( proxed._magicTest.symbol, "proxed has a magic symbol")
	t.notOk( proxed._magicTest.pluginData, "proxed has no magic data")
	t.ok( forked._magicTest.symbol, "forked has no magic symbol")
	t.notOk( forked._magicTest.pluginData, "forked has no magic data")

	// set forked magic data
	forked._magicTest= "magic"
	t.notOk( proxed._magicTest.pluginData, "proxed has no pluginData")
	t.equal( forked._magicTest.pluginData, "magic", "forked magicTest has new data")

	// set proxed magic data
	proxed._magicTest= "orig"
	t.equal( proxed._magicTest.pluginData, "orig", "proxed magicTest has new data")
	t.equal( prox[ proxed._magicTest.symbol], "orig", "proxed magicTest data is held on prox")
	t.equal( forked._magicTest.pluginData, "magic", "forked magicTest has new data")
	t.end()
})
