import tape from "tape"
import prox from "../prox.js"
import aggro from "../plugin/aggro.js"
import { DefaultPlugins} from "../defaults.js"

const plugins= [...DefaultPlugins, aggro]

tape("aggro adds prox to child", function(t){
	const
	  o= prox({ parent: "is me"},{ plugins}),
	  foo= { value: "a child"}
	t.ok( o._prox, "root object has a _prox")
	t.notOk( foo._prox, "foo does not yet have a _prox")
	o.foo= foo
	const fooProx= o.foo._prox
	t.ok( fooProx, "o.foo now a _prox")
	t.notOk( foo._prox, "original foo does not have a _prox")
	const data= fooProx.pluginData( aggro, foo)
	t.equal( data.parent, o._prox, "child points to `parent`")
	t.equal( data.key, "foo", "child knowns it's key via `key`")
	t.end()
})

tape("grandchildren also proxed by aggro", function(t){
	const o= prox({},{ plugins})
	t.ok( o._prox, "root object has a `_prox`")
	o.foo=  {}
	const grandchild= {}
	o.foo.bar= grandchild
	t.ok( o.foo.bar._prox, "proxed grandchild has a `_prox`")
	const grandData= o.foo.bar._prox.pluginData( aggro, grandchild)
	t.equal( grandData.parent, o.foo._prox, "proxied grandchild points to child prox via `parent`")
	t.equal( grandData.key, "bar", "proxied grandchild knows it's key via `key`")
	t.notOk( grandchild._prox, "real grandchild unaffected")
	t.end()
})

tape("child's contents are also proxed", function(t){
	const
	  o= prox({}, { plugins}),
	  more= {
		stuff: {},
		primitive: 42
	  }
	o.more= more
	t.ok( o.more._prox, "child has `_prox`")
	t.ok( o.more.stuff._prox, "child's content's have `_prox`")
	t.ok( o.more.primitive, 42, "child's primitive content's unchanged")
	t.end()
})

tape("one object can be aggroed by two prox", function(t){
	const
	  shared= {},
	  proxed1= prox({},{ plugins}),
	  proxed2= prox({},{ plugins})

	proxed1.alpha= shared
	t.notOk( shared._prox, "original shared object being aggroed is unaffected")
	t.ok( proxed1.alpha._prox, "shared object is proxied accessed via parent")
	const data1= proxed1.alpha._prox.pluginData( aggro, shared)
	t.equal( data1.parent, proxed1._prox, "first proxying has parent")
	t.equal( data1.key, "alpha", "first proxying knows it's parent's key")

	proxed2.omega= shared
	t.notOk( shared._prox, "original shared object being aggroed is unaffected")
	t.ok( proxed2.omega._prox, "shared object is proxied accessed via parent")
	const data2= proxed2.omega._prox.pluginData( aggro, shared)
	t.equal( data2.parent, proxed2._prox, "second proxying has parent")
	t.equal( data2.key, "omega", "second proxying knows it's parent's key")
	// let's re-assert our proxed1, which ought be unchanged
	const data1b= proxed1.alpha._prox.pluginData( aggro, shared)
	t.equal( data1b.parent, proxed1._prox, "first proxying still knows it's parent")
	t.equal( data1b.key, "alpha", "first proxying still knows it's parent's key")
	t.end()
})

tape( "an array can be aggro", function(t){
	t.end()
})

tape( "can optionally do a deep recurse", function(t){
	t.end()
})
