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
	t.equal( newObj.ok, 99, "forked object finds own values")

	// validate some expected
	t.equal( forked._prox, orig._prox, "same prox on orig/forked")
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
	t.notOk( prox.symbolMap, "no symbolMap for single instance")

	const
	  newObj= {ok: 99},
	  forked= prox.fork( newObj)
	t.equal( forked.ok, 99, "forked object finds own values")

	// validate some expected
	t.equal( proxed._prox, prox, "proxed._prox is prox")
	t.equal( forked._prox, prox, "forked._prox is prox too")
	t.ok( proxed._prox.symbolMap, "prox gained a symbolMap")

	const
	  proxedMap= prox.symbolMap.get( obj),
	  forkedMap= prox.symbolMap.get( newObj)
	t.equal( proxed._magicTest.symbols, proxedMap, "symbolMap has obj's symbol map")
	t.notOk( proxed._magicTest.pluginData, "no proxed magicTest data")
	t.equal( forked._magicTest.symbols, forked._prox.symbolMap.get( newObj), "symbolMap has newObj's symbol map")
	t.notOk( forked._magicTest.pluginData, "no forked magicTest data")

	// set data
	forked._magicTest= "magic"
	t.equal( forked._magicTest.pluginData, "magic", "forked magicTest has new data")
	t.notOk( proxed._magicTest.pluginData, "magic", "proxes has no magicTest data")

	t.end()
})
